import { beforeEach, describe, expect, it, vi } from "vitest";

const retrieveCheckoutSession = vi.hoisted(() => vi.fn());
const enqueuePurchaseFollowup = vi.hoisted(() => vi.fn());
const makeSessionCookie = vi.hoisted(() => vi.fn(() => "snready_session=test-token; Path=/; HttpOnly"));

vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(function StripeMock() {
    return { checkout: { sessions: { retrieve: retrieveCheckoutSession } } };
  }),
}));

vi.mock("@/functions/lib/followup", () => ({
  enqueuePurchaseFollowup,
}));

vi.mock("@/functions/lib/session", () => ({
  makeSessionCookie,
}));

import { onRequestGet } from "@/functions/api/session";

function createKvStore(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  return {
    get: vi.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
    put: vi.fn((key: string, value: string) => {
      store.set(key, value);
      return Promise.resolve();
    }),
    delete: vi.fn((key: string) => {
      store.delete(key);
      return Promise.resolve();
    }),
    list: vi.fn(() => Promise.resolve({ keys: [], list_complete: true, cursor: undefined })),
  };
}

function context(url: string, envOverrides: Record<string, unknown> = {}) {
  return {
    request: new Request(url),
    env: {
      STRIPE_SECRET_KEY: "sk_test_fixture",
      RESEND_API_KEY: "re_test_fixture",
      SITE_URL: "https://snready.com",
      SNREADY_ACCESS: createKvStore(),
      ...envOverrides,
    },
  } as unknown as Parameters<typeof onRequestGet>[0];
}

describe("session verification Pages Function", () => {
  beforeEach(() => {
    retrieveCheckoutSession.mockReset();
    enqueuePurchaseFollowup.mockReset();
    enqueuePurchaseFollowup.mockResolvedValue({});
    makeSessionCookie.mockClear();
    makeSessionCookie.mockReturnValue("snready_session=test-token; Path=/; HttpOnly");
  });

  it("returns 400 when session_id is missing", async () => {
    const response = await onRequestGet(context("https://snready.com/api/session"));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Session ID required",
      code: "session_id_required",
    });
    expect(retrieveCheckoutSession).not.toHaveBeenCalled();
  });

  it("returns 404 when Stripe says the checkout session does not exist", async () => {
    retrieveCheckoutSession.mockRejectedValue({
      type: "StripeInvalidRequestError",
      code: "resource_missing",
      statusCode: 404,
      message: "No such checkout.session: cs_fake",
    });

    const kv = createKvStore();
    const response = await onRequestGet(context("https://snready.com/api/session?session_id=cs_fake", { SNREADY_ACCESS: kv }));

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: "Checkout session not found",
      code: "session_not_found",
      details: "No such checkout.session: cs_fake",
    });
    expect(kv.put).not.toHaveBeenCalled();
  });

  it("returns 502 when Stripe lookup fails for reasons other than a bad session id", async () => {
    retrieveCheckoutSession.mockRejectedValue(new Error("Stripe API timeout"));

    const response = await onRequestGet(context("https://snready.com/api/session?session_id=cs_live_timeout"));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: "Stripe session lookup failed",
      code: "stripe_lookup_failed",
      details: "Stripe API timeout",
    });
  });

  it("returns 500 when access persistence fails after a paid session lookup", async () => {
    retrieveCheckoutSession.mockResolvedValue({
      id: "cs_live_paid",
      payment_status: "paid",
      customer_details: { email: "buyer@example.com" },
      metadata: { plan: "single", certification: "CSA" },
      amount_total: 900,
      created: 1_700_000_000,
    });

    const kv = createKvStore();
    kv.put.mockRejectedValueOnce(new Error("KV unavailable"));

    const response = await onRequestGet(context("https://snready.com/api/session?session_id=cs_live_paid", { SNREADY_ACCESS: kv }));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "Failed to grant access",
      code: "access_grant_failed",
      details: "KV unavailable",
    });
  });

  it("grants access and logs the user in when the checkout session is paid", async () => {
    retrieveCheckoutSession.mockResolvedValue({
      id: "cs_live_paid",
      payment_status: "paid",
      customer_details: { email: "Buyer@Example.com" },
      metadata: { plan: "single", certification: "CSA" },
      amount_total: 900,
      created: 1_700_000_000,
    });

    const kv = createKvStore({
      "access:buyer@example.com": JSON.stringify({
        paid: true,
        plan: "single",
        certification: "CAD",
        certifications: ["CAD"],
      }),
    });

    const response = await onRequestGet(context("https://snready.com/api/session?session_id=cs_live_paid", { SNREADY_ACCESS: kv }));

    expect(response.status).toBe(200);
    expect(response.headers.get("Set-Cookie")).toBe("snready_session=test-token; Path=/; HttpOnly");
    expect(await response.json()).toMatchObject({
      success: true,
      email: "Buyer@Example.com",
      plan: "single",
      certification: "CSA",
      certifications: ["CAD", "CSA"],
      amountTotal: 900,
      followupQueued: true,
      warnings: [],
    });
    expect(makeSessionCookie).toHaveBeenCalled();
    expect(enqueuePurchaseFollowup).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        sessionId: "cs_live_paid",
        email: "buyer@example.com",
        certification: "CSA",
        certifications: ["CAD", "CSA"],
      }),
    );
  });

  it("still returns 200 when follow-up enqueue fails after access is granted", async () => {
    retrieveCheckoutSession.mockResolvedValue({
      id: "cs_live_paid",
      payment_status: "paid",
      customer_details: { email: "buyer@example.com" },
      metadata: { plan: "all", certification: "ALL" },
      amount_total: 4900,
      created: 1_700_000_000,
    });
    enqueuePurchaseFollowup.mockRejectedValueOnce(new Error("follow-up KV write failed"));

    const response = await onRequestGet(context("https://snready.com/api/session?session_id=cs_live_paid"));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      success: true,
      followupQueued: false,
      warnings: ["followup_enqueue_failed"],
    });
  });
});
