// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { normalizeTrackedPath, trackPageView } from "@/lib/analytics";

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
    expect(normalizeTrackedPath("https://snready.com/csa/practice-questions?utm_source=google")).toBe(
      "/csa/practice-questions?utm_source=google",
    );
  });
});

describe("analytics tracking", () => {
  it("sends normalized page paths to GA4", () => {
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
        content_group: "practice",
      }),
    );
  });
});
