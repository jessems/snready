import { beforeEach, describe, expect, it, vi } from "vitest";
import { onRequestGet } from "@/functions/api/session";

const retrieveCheckoutSession = vi.hoisted(() => vi.fn());
const enqueuePurchaseFollowup = vi.hoisted(() => vi.fn());

vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(function StripeMock() {
    return {
      checkout: {
        sessions: {
          retrieve: retrieveCheckoutSession,
        },
      },
    };
  }),
}));

vi.mock("@/functions/lib/followup", () => ({
  enqueuePurchaseFollowup,
}));

function kvStore(options: { initial?: Record<string, string>; failPutAtCall?: number } = {}) {
  const store = new Map(Object.entries(options.initial || {}));
  let putCount = 0;

  return {
    get: vi.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
    put: vi.fn((key: string, value: string) => {
      putCount += 1;
      if (options.failPutAtCall && putCount === options.failPutAtCall) {
        return Promise.reject(new Error(`KV put failed for ${key}`));
      }
      store.set(key, value);
      return Promise.resolve();
    }),
    delete: vi.fn((key: string) => {
      store.delete(key);
      return Promise.resolve();
    }),
    dump: () => Object.fromEntries(store.entries()),
  };
}

function context(sessionId?: string, kv = kvStore()) {
  const url = new URL("https://snready.com/api/session");
  if (sessionId) url.searchParams.set("session_id", sessionId);

  return {
    request: new Request(url.toString()),
    env: {
      STRIPE_SECRET_KEY: "sk_test_fixture",
      SNREADY_ACCESS: kv,
      RESEND_API_KEY: "re_test",
      SITE_URL: "https://snready.com",
    },
  } as unknown as Parameters<typeof onRequestGet>[0];
}

function paidSession(overrides: Record<string, unknown> = {}) {
  return {
    id: "cs_test_123",
    payment_status: "paid",
    customer_details: { email: "buyer@example.com" },
    metadata: { plan: "single", certification: "CSA" },
    amount_total: 900,
    created: 1_700_000_000,
    ...overrides,
  };
}

describe("session verification endpoint", () => {
  beforeEach(() => {
    retrieveCheckoutSession.mockReset();
    enqueuePurchaseFollowup.mockReset();
    retrieveCheckoutSession.mockResolvedValue(paidSession());
    enqueuePurchaseFollowup.mockResolvedValue({});
  });

  it("returns a structured 400 when session_id is missing", async () => {
    const response = await onRequestGet(context());

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Session ID required",
      code: "missing_session_id",
    });
    expect(retrieveCheckoutSession).not.toHaveBeenCalled();
  });

  it("returns 404 when Stripe reports the checkout session does not exist", async () => {
    retrieveCheckoutSession.mockRejectedValueOnce({
      type: "StripeInvalidRequestError",
      code: "resource_missing",
      statusCode: 404,
      message: "No such checkout.session",
    });

    const kv = kvStore();
    const response = await onRequestGet(context("cs_fake_missing", kv));

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: "Checkout session not found",
      code: "session_not_found",
    });
    expect(kv.put).not.toHaveBeenCalled();
    expect(enqueuePurchaseFollowup).not.toHaveBeenCalled();
  });

  it("returns 502 when Stripe lookup fails for a non-not-found reason", async () => {
    retrieveCheckoutSession.mockRejectedValueOnce(new Error("Stripe API unavailable"));

    const response = await onRequestGet(context("cs_live_broken"));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: "Unable to verify checkout session",
      code: "stripe_lookup_failed",
    });
  });

  it("returns 500 with a distinct code when KV access grant fails", async () => {
    const kv = kvStore({ failPutAtCall: 2 });

    const response = await onRequestGet(context("cs_live_paid", kv));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "Unable to grant access for this checkout session",
      code: "access_grant_failed",
    });
    expect(enqueuePurchaseFollowup).not.toHaveBeenCalled();
  });

  it("does not block access when follow-up enqueue fails after grant", async () => {
    enqueuePurchaseFollowup.mockRejectedValueOnce(new Error("Resend failed"));

    const kv = kvStore();
    const response = await onRequestGet(context("cs_live_paid", kv));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      success: true,
      email: "buyer@example.com",
      plan: "single",
      certification: "CSA",
    });
    expect(response.headers.get("Set-Cookie")).toContain("snready_session=");
    expect(kv.put).toHaveBeenCalled();
  });
});
