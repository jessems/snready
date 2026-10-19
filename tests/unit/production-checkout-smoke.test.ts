import { describe, expect, it, vi } from "vitest";
import { runProductionCheckoutSmoke } from "@/lib/testing/productionCheckoutSmoke";

describe("runProductionCheckoutSmoke", () => {
  it("probes invalid checkout, valid checkout, and session validation in order", async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ error: "Certification is required for single-cert purchases" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ url: "https://checkout.stripe.com/pay/cs_test_123" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "Session ID required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
      );

    const result = await runProductionCheckoutSmoke({
      baseUrl: "https://snready.com/",
      fetchImpl,
    });

    expect(result.baseUrl).toBe("https://snready.com");
    expect(result.checkoutUrl).toBe("https://checkout.stripe.com/pay/cs_test_123");
    expect(fetchImpl).toHaveBeenCalledTimes(3);

    const [invalidRequestUrl, invalidRequestInit] = fetchImpl.mock.calls[0];
    expect(invalidRequestUrl).toBe("https://snready.com/api/checkout");
    expect(invalidRequestInit?.method).toBe("POST");
    expect(invalidRequestInit?.body).toBe(JSON.stringify({}));

    const [validRequestUrl, validRequestInit] = fetchImpl.mock.calls[1];
    expect(validRequestUrl).toBe("https://snready.com/api/checkout");
    expect(validRequestInit?.method).toBe("POST");
    expect(JSON.parse(String(validRequestInit?.body))).toEqual({
      certification: "csa",
      plan: "single",
      returnUrl: "/csa/practice-questions",
      attribution: {
        firstUtmSource: "deployment-smoke",
        lastUtmSource: "deployment-smoke",
      },
    });

    const [sessionRequestUrl, sessionRequestInit] = fetchImpl.mock.calls[2];
    expect(sessionRequestUrl).toBe("https://snready.com/api/session");
    expect(sessionRequestInit?.method).toBe("GET");
  });

  it("throws a useful error when the live checkout probe does not return a Stripe URL", async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ error: "Certification is required for single-cert purchases" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        )
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "Failed to create checkout session" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        })
      );

    await expect(
      runProductionCheckoutSmoke({
        baseUrl: "https://snready.com",
        fetchImpl,
      })
    ).rejects.toThrow(/valid checkout probe failed/i);
  });
});
