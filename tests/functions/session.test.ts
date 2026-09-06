import { beforeEach, describe, expect, it, vi } from "vitest";
import { onRequestGet } from "@/functions/api/session";

const retrieveSession = vi.hoisted(() => vi.fn());
const enqueuePurchaseFollowup = vi.hoisted(() => vi.fn());
const makeSessionCookie = vi.hoisted(() => vi.fn(() => "snready_session=test-token; Path=/; HttpOnly"));

vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(function StripeMock() {
    return {
      checkout: {
        sessions: {
          retrieve: retrieveSession,
        },
      },
    };
  }),
}));

vi.mock("@/functions/lib/followup", () => ({
  enqueuePurchaseFollowup,
}));

vi.mock("@/functions/lib/session", () => ({
  makeSessionCookie,
}));

type MockKvNamespace = KVNamespace<string> & {
  get: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  list: ReturnType<typeof vi.fn>;
  getWithMetadata: ReturnType<typeof vi.fn>;
};

function kvStore(initial: Record<string, string> = {}): MockKvNamespace {
  const store = new Map(Object.entries(initial));
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

function context(sessionId?: string, overrides: Partial<Parameters<typeof onRequestGet>[0]["env"]> = {}) {
  const url = new URL("https://snready.com/api/session");
  if (sessionId) url.searchParams.set("session_id", sessionId);

  return {
    request: new Request(url.toString()),
    env: {
      STRIPE_SECRET_KEY: "sk_test_fixture",
      SNREADY_ACCESS: kvStore(),
      RESEND_API_KEY: "re_test_fixture",
      SITE_URL: "https://snready.com",
      ...overrides,
    },
  } as Parameters<typeof onRequestGet>[0];
}

describe("session verification Pages Function", () => {
  beforeEach(() => {
    retrieveSession.mockReset();
    enqueuePurchaseFollowup.mockReset();
    makeSessionCookie.mockClear();
    enqueuePurchaseFollowup.mockResolvedValue({});
    retrieveSession.mockResolvedValue({
      id: "cs_test_paid",
      payment_status: "paid",
      customer_details: { email: "buyer@example.com" },
      metadata: { plan: "single", certification: "CSA" },
      amount_total: 900,
      currency: "cad",
      created: 1_726_000_000,
    });
  });

  it("returns a structured 400 when session_id is missing", async () => {
    const response = await onRequestGet(context());

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Session ID required",
      code: "missing_session_id",
    });
  });

  it("fails fast with a clear config error when Stripe env is missing", async () => {
    const response = await onRequestGet(context("cs_live_paid", { STRIPE_SECRET_KEY: "" }));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: "Session verification is not configured for this deployment",
      code: "stripe_not_configured",
      missing: ["STRIPE_SECRET_KEY"],
    });
    expect(retrieveSession).not.toHaveBeenCalled();
  });

  it("returns a structured 404 when Stripe says the checkout session does not exist", async () => {
    retrieveSession.mockRejectedValue({
      type: "StripeInvalidRequestError",
      code: "resource_missing",
      message: "No such checkout.session: cs_fake",
    });

    const response = await onRequestGet(context("cs_fake"));

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: "Checkout session not found",
      code: "session_not_found",
    });
  });

  it("returns a structured 502 when Stripe lookup fails for other reasons", async () => {
    retrieveSession.mockRejectedValue(new Error("Stripe temporarily unavailable"));

    const response = await onRequestGet(context("cs_live_problem"));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: "Stripe session lookup failed",
      code: "stripe_lookup_failed",
    });
  });

  it("returns a structured 400 when payment has not completed", async () => {
    retrieveSession.mockResolvedValueOnce({
      id: "cs_test_open",
      payment_status: "unpaid",
      customer_details: { email: "buyer@example.com" },
      metadata: { plan: "single", certification: "CSA" },
      amount_total: 900,
      created: 1_726_000_000,
    });

    const response = await onRequestGet(context("cs_test_open"));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Payment not completed",
      code: "payment_not_completed",
    });
  });

  it("returns success even when follow-up email enqueue fails", async () => {
    enqueuePurchaseFollowup.mockRejectedValue(new Error("KV write failed"));

    const response = await onRequestGet(context("cs_live_paid"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      success: true,
      email: "buyer@example.com",
      plan: "single",
      certification: "CSA",
      amountTotal: 900,
      amountCurrency: "CAD",
      warnings: ["purchase_followup_enqueue_failed"],
    });
    expect(response.headers.get("Set-Cookie")).toContain("snready_session=test-token");
  });

  it("returns a structured 500 when access grant persistence fails", async () => {
    const accessKv = kvStore();
    accessKv.put.mockImplementation(async (key: string, value: string) => {
      if (key.startsWith("access:")) {
        throw new Error("KV unavailable");
      }
      return undefined;
    });

    const response = await onRequestGet(context("cs_live_paid", { SNREADY_ACCESS: accessKv }));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "Access grant failed",
      code: "access_grant_failed",
    });
  });
});
