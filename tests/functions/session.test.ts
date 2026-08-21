import { describe, expect, it, vi } from "vitest";
import { onRequestGet } from "@/functions/api/session";

const retrieveCheckoutSession = vi.hoisted(() => vi.fn());
const enqueuePurchaseFollowup = vi.hoisted(() => vi.fn());
const makeSessionCookie = vi.hoisted(() => vi.fn(() => "snready_session=test; Path=/; HttpOnly"));

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

function kvStore() {
  const map = new Map<string, string>();
  return {
    get: vi.fn(async (key: string) => map.get(key) ?? null),
    put: vi.fn(async (key: string, value: string) => {
      map.set(key, value);
    }),
  };
}

describe("session Pages Function", () => {
  it("returns 503 when Stripe is not configured", async () => {
    const response = await onRequestGet({
      request: new Request("https://preview.snready.pages.dev/api/session?session_id=cs_test_123"),
      env: {
        STRIPE_SECRET_KEY: "",
        SNREADY_ACCESS: kvStore(),
        RESEND_API_KEY: "re_test",
        SITE_URL: "",
      },
    } as unknown as Parameters<typeof onRequestGet>[0]);

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: "Checkout session verification is not configured for this deployment",
    });
    expect(retrieveCheckoutSession).not.toHaveBeenCalled();
    expect(enqueuePurchaseFollowup).not.toHaveBeenCalled();
    expect(makeSessionCookie).not.toHaveBeenCalled();
  });
});
