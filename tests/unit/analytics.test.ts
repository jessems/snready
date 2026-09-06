// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  captureAttribution,
  getStoredAttribution,
  normalizeTrackedLocation,
  normalizeTrackedPath,
  trackBeginCheckout,
  trackPageView,
  trackPurchaseOnce,
} from "@/lib/analytics";

describe("analytics path normalization", () => {
  it("keeps valid app paths unchanged", () => {
    expect(normalizeTrackedPath("/csa/practice-questions?utm_source=google")).toBe(
      "/csa/practice-questions?utm_source=google",
    );
  });

  it("strips malformed embedded absolute URLs from tracked paths", () => {
    expect(normalizeTrackedPath("/csa/practice-questionshttps://snready.com")).toBe(
      "/csa/practice-questions",
    );
  });

  it("converts absolute URLs into pathname + search", () => {
    expect(
      normalizeTrackedPath(
        "https://snready.com/csa/practice-questions?utm_source=google",
      ),
    ).toBe("/csa/practice-questions?utm_source=google");
  });

  it("drops fragments and collapses duplicated slashes", () => {
    expect(normalizeTrackedPath("//cis-itsm//practice-questions#pricing")).toBe(
      "/cis-itsm/practice-questions",
    );
  });

  it("normalizes tracked locations into clean URLs or clean app paths", () => {
    expect(
      normalizeTrackedLocation(
        "https://snready.com/cis-itsm/practice-questions?utm_source=google",
      ),
    ).toBe("https://snready.com/cis-itsm/practice-questions?utm_source=google");
    expect(normalizeTrackedLocation("/cis-itsm/practice-questionshttps://snready.com")).toBe(
      "/cis-itsm/practice-questions",
    );
  });
});

describe("analytics tracking", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.title = "SNReady";
    document.cookie = "_ga=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "_ga_21R4T0V162=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    window.history.replaceState({}, "", "/csa/practice-questions");
  });

  it("sends normalized page paths and page locations to GA4", () => {
    const gtag = vi.fn();
    Object.defineProperty(window, "gtag", {
      configurable: true,
      value: gtag,
    });

    trackPageView("/csa/practice-questionshttps://snready.com");

    expect(gtag).toHaveBeenCalledWith(
      "event",
      "page_view",
      expect.objectContaining({
        page_path: "/csa/practice-questions",
        page_location: `${window.location.origin}/csa/practice-questions`,
        content_group: "practice",
      }),
    );
  });

  it("normalizes checkout start paths before sending begin_checkout", () => {
    const gtag = vi.fn();
    Object.defineProperty(window, "gtag", {
      configurable: true,
      value: gtag,
    });

    trackBeginCheckout({
      certification: "CIS-ITSM",
      plan: "single",
      value: 9,
      returnUrl: "/cis-itsm/practice-questionshttps://snready.com",
    });

    expect(gtag).toHaveBeenCalledWith(
      "event",
      "begin_checkout",
      expect.objectContaining({
        checkout_start_path: "/cis-itsm/practice-questions",
      }),
    );
  });

  it("tracks paid confirmed purchases once with child-owned Google Ads send_to, value, currency, and transaction id", () => {
    const gtag = vi.fn();
    Object.defineProperty(window, "gtag", {
      configurable: true,
      value: gtag,
    });

    trackPurchaseOnce({
      transactionId: "cs_live_paid_123",
      certification: "CIS-DF",
      plan: "single",
      value: 9,
      currency: "cad",
    });
    trackPurchaseOnce({
      transactionId: "cs_live_paid_123",
      certification: "CIS-DF",
      plan: "single",
      value: 9,
      currency: "cad",
    });

    expect(gtag).toHaveBeenCalledTimes(2);
    expect(gtag).toHaveBeenCalledWith(
      "event",
      "purchase",
      expect.objectContaining({
        transaction_id: "cs_live_paid_123",
        value: 9,
        currency: "CAD",
      }),
    );
    expect(gtag).toHaveBeenCalledWith(
      "event",
      "conversion",
      expect.objectContaining({
        send_to: "AW-18398619673/ePp1CJb5ve8cEJnQksVE",
        transaction_id: "cs_live_paid_123",
        value: 9,
        currency: "CAD",
      }),
    );
  });

  it("refreshes last touch for a meaningful external referrer even without UTMs", () => {
    Object.defineProperty(document, "referrer", {
      configurable: true,
      value: "https://google.com/search?q=servicenow+csa",
    });
    window.history.replaceState({}, "", "/csa/practice-questions");

    const first = captureAttribution();

    expect(first.firstInferredSource).toBe("google");
    expect(first.firstInferredMedium).toBe("search-referrer");
    expect(first.lastInferredSource).toBe("google");

    Object.defineProperty(document, "referrer", {
      configurable: true,
      value: "https://chatgpt.com/c/123",
    });
    window.history.replaceState({}, "", "/cad/practice-questions");

    const updated = captureAttribution();

    expect(updated.firstInferredSource).toBe("google");
    expect(updated.lastInferredSource).toBe("chatgpt.com");
    expect(updated.lastInferredMedium).toBe("ai-assistant");
    expect(updated.lastLandingPage).toBe("/cad/practice-questions");
  });

  it("does not let internal navigation overwrite an external referrer touch", () => {
    window.localStorage.setItem(
      "snready_attribution",
      JSON.stringify({
        first: {
          landingPage: "/csa/practice-questions",
          referrer: "https://google.com/search?q=servicenow",
          inferredSource: "google",
          inferredMedium: "search-referrer",
          seenAt: "2026-09-03T00:00:00.000Z",
        },
        last: {
          landingPage: "/csa/practice-questions",
          referrer: "https://google.com/search?q=servicenow",
          inferredSource: "google",
          inferredMedium: "search-referrer",
          seenAt: "2026-09-03T00:00:00.000Z",
        },
      }),
    );

    Object.defineProperty(document, "referrer", {
      configurable: true,
      value: "https://snready.com/blog/csa-guide",
    });
    window.history.replaceState({}, "", "/checkout/cancel");

    captureAttribution();
    const stored = getStoredAttribution();

    expect(stored.lastInferredSource).toBe("google");
    expect(stored.lastLandingPage).toBe("/csa/practice-questions");
  });
});
