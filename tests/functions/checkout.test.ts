import { beforeEach, describe, expect, it, vi } from "vitest";
import { onRequestPost } from "@/functions/api/checkout";
const createCheckoutSession = vi.hoisted(() => vi.fn());
vi.mock("stripe", () => ({ default: vi.fn().mockImplementation(function StripeMock() { return { checkout: { sessions: { create: createCheckoutSession } } }; }) }));
function context(body: unknown) { return { request: new Request("https://snready.com/api/checkout", { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }), env: { STRIPE_SECRET_KEY: "sk_test_fixture", SITE_URL: "https://snready.com" } } as Parameters<typeof onRequestPost>[0]; }
describe("checkout Pages Function", () => {
  beforeEach(() => { createCheckoutSession.mockReset(); createCheckoutSession.mockResolvedValue({ url: "https://checkout.stripe.test/session" }); });
  it("rejects single-cert checkout without a certification", async () => {
    const response = await onRequestPost(context({ plan: "single" }));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Certification is required for single-cert purchases", code: "missing_certification" });
    expect(createCheckoutSession).not.toHaveBeenCalled();
  });
  it("creates a $9 single-cert checkout session with normalized metadata", async () => {
    const response = await onRequestPost(context({
      certification: "csa",
      plan: "single",
      returnUrl: "/csa/practice-questions",
      attribution: {
        gaClientId: "123456789.987654321",
        gaSessionId: "1782533012",
        firstUtmSource: "google",
        lastLandingPage: "/pricing",
      },
    }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ url: "https://checkout.stripe.test/session" });
    const payload = createCheckoutSession.mock.calls[0][0];
    expect(payload.line_items[0].price_data.unit_amount).toBe(900);
    expect(payload.metadata).toMatchObject({
      certification: "CSA",
      plan: "single",
      returnUrl: "/csa/practice-questions",
      gaClientId: "123456789.987654321",
      gaSessionId: "1782533012",
      firstUtmSource: "google",
      lastLandingPage: "/pricing",
    });
    expect(payload.success_url).toBe("https://snready.com/checkout/success?session_id={CHECKOUT_SESSION_ID}");
    expect(payload.cancel_url).toContain("return_to=%2Fcsa%2Fpractice-questions");
  });
  it("returns structured Stripe details when checkout creation fails", async () => {
    createCheckoutSession.mockRejectedValueOnce({
      type: "StripePermissionError",
      code: "permission_error",
      statusCode: 403,
      message: "This API key does not have permission to perform the request",
    });

    const response = await onRequestPost(context({ certification: "csa", plan: "single" }));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: "Stripe checkout failed",
      code: "stripe_permission_denied",
      providerType: "StripePermissionError",
      providerCode: "permission_error",
      providerStatus: 403,
      providerMessage: "This API key does not have permission to perform the request",
    });
  });
  it("creates a $49 all-access checkout and ignores unsafe return URLs", async () => {
    await onRequestPost(context({ certification: "csa", plan: "all", returnUrl: "https://evil.example/phish" }));
    const payload = createCheckoutSession.mock.calls[0][0];
    expect(payload.line_items[0].price_data.unit_amount).toBe(4900);
    expect(payload.metadata).toMatchObject({ certification: "CSA", plan: "all", returnUrl: "" });
    expect(payload.cancel_url).not.toContain("evil.example");
  });
});
