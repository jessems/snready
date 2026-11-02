import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { onRequestPost } from "@/functions/api/webhook";

const constructEventAsync = vi.hoisted(() => vi.fn());
const createSubtleCryptoProvider = vi.hoisted(() => vi.fn(() => "subtle-provider"));
const enqueuePurchaseFollowup = vi.hoisted(() => vi.fn());

type MockKvNamespace = KVNamespace<string> & {
  get: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  list: ReturnType<typeof vi.fn>;
  getWithMetadata: ReturnType<typeof vi.fn>;
};

vi.mock("stripe", () => ({
  default: Object.assign(
    vi.fn().mockImplementation(function StripeMock() {
      return {
        webhooks: {
          constructEventAsync,
        },
      };
    }),
    { createSubtleCryptoProvider }
  ),
}));

vi.mock("@/functions/lib/followup", () => ({
  enqueuePurchaseFollowup,
}));

function kvStore(): MockKvNamespace {
  const store = new Map<string, string>();
  const kv = {
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    getWithMetadata: vi.fn(async (key: string) => ({ value: store.get(key) ?? null, metadata: null })),
    put: vi.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    delete: vi.fn(async (key: string) => {
      store.delete(key);
    }),
    list: vi.fn(async () => ({ keys: [], list_complete: true, cursor: "", cacheStatus: null })),
  };

  return kv as unknown as MockKvNamespace;
}

function context(
  envOverrides: Record<string, unknown> = {},
  body = "{}",
  headers: HeadersInit = { "stripe-signature": "t=1,v1=testsig" }
) {
  return {
    request: new Request("https://snready.com/api/webhook", {
      method: "POST",
      body,
      headers,
    }),
    env: {
      STRIPE_SECRET_KEY: "sk_test_fixture",
      STRIPE_WEBHOOK_SECRET: "whsec_primary",
      SNREADY_ACCESS: kvStore(),
      RESEND_API_KEY: "re_test_fixture",
      SITE_URL: "https://snready.com",
      ...envOverrides,
    },
  } as unknown as Parameters<typeof onRequestPost>[0];
}

describe("webhook Pages Function", () => {
  beforeEach(() => {
    constructEventAsync.mockReset();
    createSubtleCryptoProvider.mockClear();
    enqueuePurchaseFollowup.mockReset();
    constructEventAsync.mockResolvedValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_paid",
          customer_details: { email: "Buyer@Example.com" },
          metadata: { plan: "single", certification: "CSA" },
          created: 1_726_000_000,
        },
      },
    });
    enqueuePurchaseFollowup.mockResolvedValue({});
  });

  it("returns 500 when no webhook secret candidate is configured", async () => {
    const response = await onRequestPost(
      context({
        STRIPE_WEBHOOK_SECRET: "",
        STRIPE_WEBHOOK_SIGNING_SECRET: "",
        STRIPE_WEBHOOK_SECRET_KEY: "",
      })
    );

    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Webhook secret not configured");
    expect(constructEventAsync).not.toHaveBeenCalled();
  });

  it("accepts the signing-secret alias and verifies with subtle crypto", async () => {
    const accessKv = kvStore();

    const response = await onRequestPost(
      context({
        STRIPE_WEBHOOK_SECRET: "",
        STRIPE_WEBHOOK_SIGNING_SECRET: "whsec_alias",
        SNREADY_ACCESS: accessKv,
      }, '{"id":"evt_test"}')
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true });
    expect(createSubtleCryptoProvider).toHaveBeenCalledTimes(1);
    expect(constructEventAsync).toHaveBeenCalledWith(
      '{"id":"evt_test"}',
      "t=1,v1=testsig",
      "whsec_alias",
      undefined,
      "subtle-provider"
    );
    expect(accessKv.put).toHaveBeenCalledWith(
      "access:buyer@example.com",
      expect.any(String),
      {}
    );
    expect(enqueuePurchaseFollowup).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        sessionId: "cs_test_paid",
        email: "buyer@example.com",
        plan: "single",
        certification: "CSA",
      })
    );
  });

  it("does not fail the webhook after access grant if follow-up enqueue throws", async () => {
    const accessKv = kvStore();
    enqueuePurchaseFollowup.mockRejectedValue(new Error("Resend unavailable"));

    const response = await onRequestPost(context({ SNREADY_ACCESS: accessKv }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true });
    expect(accessKv.put).toHaveBeenCalledWith(
      "access:buyer@example.com",
      expect.any(String),
      {}
    );
  });

  describe("GA4 Measurement Protocol purchase fallback", () => {
    const fetchMock = vi.fn();

    beforeEach(() => {
      fetchMock.mockReset();
      fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
      vi.stubGlobal("fetch", fetchMock);
      constructEventAsync.mockResolvedValue({
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_live_paid",
            payment_status: "paid",
            amount_total: 900,
            currency: "usd",
            customer_details: { email: "Buyer@Example.com" },
            metadata: { plan: "single", certification: "CSA", gaClientId: "123.456", gaSessionId: "789" },
            created: 1_726_000_000,
          },
        },
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("does not call GA4 when GA4_API_SECRET is not set", async () => {
      const response = await onRequestPost(context());

      expect(response.status).toBe(200);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("sends a purchase with the Stripe session id as transaction_id and the stored client id", async () => {
      const waitUntil = vi.fn();
      const ctx = context({ GA4_API_SECRET: "secret" });
      (ctx as unknown as { waitUntil: typeof waitUntil }).waitUntil = waitUntil;

      const response = await onRequestPost(ctx);
      await Promise.all(waitUntil.mock.calls.map(([promise]) => promise));

      expect(response.status).toBe(200);
      expect(waitUntil).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe(
        "https://www.google-analytics.com/mp/collect?measurement_id=G-21R4T0V162&api_secret=secret"
      );
      expect(JSON.parse(init.body)).toEqual({
        client_id: "123.456",
        events: [
          {
            name: "purchase",
            params: expect.objectContaining({
              transaction_id: "cs_live_paid",
              value: 9,
              currency: "USD",
              session_id: "789",
              items: [expect.objectContaining({ item_id: "single-CSA", price: 9, quantity: 1 })],
            }),
          },
        ],
      });
    });

    it("honours GA4_MEASUREMENT_ID", async () => {
      await onRequestPost(context({ GA4_API_SECRET: "secret", GA4_MEASUREMENT_ID: "G-OTHER" }));

      expect(fetchMock.mock.calls[0][0]).toContain("measurement_id=G-OTHER");
    });

    it("never fails the webhook when the GA4 request fails", async () => {
      const accessKv = kvStore();
      fetchMock.mockRejectedValue(new Error("network down"));

      const response = await onRequestPost(context({ GA4_API_SECRET: "secret", SNREADY_ACCESS: accessKv }));

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ received: true });
      expect(accessKv.put).toHaveBeenCalledWith("access:buyer@example.com", expect.any(String), {});
    });
  });
});
