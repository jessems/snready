// @vitest-environment jsdom

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CheckoutButton } from "@/components/CheckoutButton";

const accessState = vi.hoisted(() => ({ value: { hasAccess: false } }));
const analytics = vi.hoisted(() => ({
  captureAttribution: vi.fn(() => ({ firstUtmSource: "google", gaClientId: "123.456" })),
  getPlanValue: vi.fn((plan: "single" | "all") => (plan === "all" ? 49 : 9)),
  normalizeTrackedPath: vi.fn((path: string) => path.split("#")[0]),
  trackBeginCheckout: vi.fn(),
  trackCheckoutCreated: vi.fn(),
  trackCheckoutFailed: vi.fn(),
}));

vi.mock("@/components/AccessProvider", () => ({ useAccess: () => accessState.value }));
vi.mock("@/lib/analytics", () => analytics);

describe("CheckoutButton", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
    window.history.replaceState({}, "", "/cis-itsm/practice-questions?utm_source=google&email=student@example.com");
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, href: "http://localhost/cis-itsm/practice-questions?utm_source=google&email=student@example.com", pathname: "/cis-itsm/practice-questions", search: "?utm_source=google&email=student@example.com" },
    });
    accessState.value = { hasAccess: false };
    analytics.captureAttribution.mockReturnValue({ firstUtmSource: "google", gaClientId: "123.456" });
    analytics.getPlanValue.mockImplementation((plan: "single" | "all") => (plan === "all" ? 49 : 9));
    analytics.normalizeTrackedPath.mockImplementation((path: string) => path.split("#")[0]);
    analytics.trackBeginCheckout.mockClear();
    analytics.trackCheckoutCreated.mockClear();
    analytics.trackCheckoutFailed.mockClear();
  });

  it("posts to local checkout API, tracks checkout_created, and redirects when response.ok returns a URL", async () => {
    const fetchMock = vi.spyOn(window, "fetch").mockResolvedValue({ ok: true, status: 200, json: async () => ({ url: "https://checkout.stripe.com/c/pay" }) } as Response);

    render(<CheckoutButton certification="CIS-ITSM" plan="single">Buy CIS-ITSM</CheckoutButton>);
    await userEvent.click(screen.getByRole("button", { name: "Buy CIS-ITSM" }));

    await waitFor(() => expect(analytics.trackCheckoutCreated).toHaveBeenCalledWith({ certification: "CIS-ITSM", plan: "single", value: 9, returnUrl: "/cis-itsm/practice-questions" }));
    expect(fetchMock).toHaveBeenCalledWith("/api/checkout", expect.objectContaining({ method: "POST" }));
    expect(JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string)).toEqual(expect.objectContaining({ certification: "CIS-ITSM", plan: "single" }));
    expect(analytics.trackCheckoutFailed).not.toHaveBeenCalled();
    expect(window.location.href).toBe("https://checkout.stripe.com/c/pay");
  });

  it("does not redirect or track checkout_created when API returns a URL with response.ok false", async () => {
    vi.spyOn(window, "fetch").mockResolvedValue({ ok: false, status: 502, json: async () => ({ url: "https://checkout.stripe.com/c/should-not-use" }) } as Response);

    render(<CheckoutButton certification="CIS-ITSM" plan="single">Buy CIS-ITSM</CheckoutButton>);
    await userEvent.click(screen.getByRole("button", { name: "Buy CIS-ITSM" }));

    await waitFor(() => expect(analytics.trackCheckoutFailed).toHaveBeenCalledWith(expect.objectContaining({ certification: "CIS-ITSM", plan: "single", value: 9, reason: "http_502" })));
    expect(analytics.trackCheckoutCreated).not.toHaveBeenCalled();
    expect(window.location.href).not.toContain("should-not-use");
  });

  it("tracks checkout_failed without putting PII in analytics payload when checkout creation throws", async () => {
    vi.spyOn(window, "fetch").mockRejectedValue(new Error("network down student@example.com"));

    render(<CheckoutButton certification="CIS-ITSM" plan="single">Buy CIS-ITSM</CheckoutButton>);
    await userEvent.click(screen.getByRole("button", { name: "Buy CIS-ITSM" }));

    await waitFor(() => expect(analytics.trackCheckoutFailed).toHaveBeenCalledWith(expect.objectContaining({ reason: "network_error" })));
    expect(JSON.stringify(analytics.trackCheckoutFailed.mock.calls)).not.toContain("student@example.com");
    expect(analytics.trackCheckoutCreated).not.toHaveBeenCalled();
  });
});
