import { describe, expect, it } from "vitest";
import { getQuestionListingStatus } from "@/lib/site-facts";

describe("getQuestionListingStatus", () => {
  it("is not reviewed when any question is unreviewed, and returns the newest draft date", () => {
    expect(getQuestionListingStatus([
      { meta: { reviewed: true, generatedAt: "2026-02-01T10:00:00Z" } },
      { meta: { reviewed: false, generatedAt: "2026-03-15T08:00:00Z" } },
      { meta: { reviewed: false } },
    ])).toEqual({ reviewed: false, updatedIso: "2026-03-15" });
  });

  it("is reviewed only when every question is marked reviewed", () => {
    expect(getQuestionListingStatus([
      { meta: { reviewed: true, generatedAt: "2026-02-01" } },
      { meta: { reviewed: true, generatedAt: "2026-01-01" } },
    ])).toEqual({ reviewed: true, updatedIso: "2026-02-01" });
  });

  it("is never reviewed for an empty list or missing metadata", () => {
    expect(getQuestionListingStatus([])).toEqual({ reviewed: false, updatedIso: null });
    expect(getQuestionListingStatus([{}])).toEqual({ reviewed: false, updatedIso: null });
  });
});
