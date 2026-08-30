// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  normalizeTrackedLocation,
  normalizeTrackedPath,
  trackBeginCheckout,
  trackPageView,
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
});
