import { describe, expect, it } from "vitest";
import {
  attributionCoverage,
  completeDayWindow,
  networkSplitName,
  paidStripeTruth,
  roasByCurrency,
  strictGoogleAdsEvidence,
  summarizeAdSpend,
  summarizeRevenue,
} from "@/scripts/marketing/revenue-reporting.mjs";

describe("revenue reporting helpers", () => {
  it("uses complete UTC days and rejects today's partial window", () => {
    expect(completeDayWindow({ start: "2026-08-07", end: "2026-09-06", now: new Date("2026-09-06T12:00:00Z") } as any)).toMatchObject({
      startDate: "2026-08-07",
      endDate: "2026-09-06",
    });
    expect(() => completeDayWindow({ start: "2026-09-05", end: "2026-09-07", now: new Date("2026-09-06T12:00:00Z") } as any)).toThrow(/complete UTC day/);
  });

  it("treats paid Stripe sessions as truth while excluding smoke checkouts", () => {
    const sessions = [
      { id: "cs_paid", payment_status: "paid", amount_total: 900, currency: "usd", metadata: {} },
      { id: "cs_smoke", payment_status: "paid", amount_total: 900, currency: "usd", metadata: { firstUtmSource: "deploy-watchdog" } },
      { id: "cs_unpaid", payment_status: "unpaid", amount_total: 900, currency: "usd", metadata: {} },
    ];
    expect(paidStripeTruth(sessions).map((session: any) => session.id)).toEqual(["cs_paid"]);
    expect(summarizeRevenue(sessions)).toEqual({ paidCount: 1, byCurrency: { USD: 9 } });
  });

  it("separates strict Google Ads evidence from inferred search referrers", () => {
    const sessions = [
      { payment_status: "paid", metadata: { lastUtmSource: "google", lastUtmMedium: "cpc", gaClientId: "1.2" } },
      { payment_status: "paid", metadata: { lastInferredSource: "google", lastInferredMedium: "search-referrer" } },
      { payment_status: "paid", metadata: { firstGclid: "Cj0KCQjw123456789012345" } },
    ];
    expect(strictGoogleAdsEvidence(sessions[0])).toBe(true);
    expect(strictGoogleAdsEvidence(sessions[1])).toBe(false);
    expect(strictGoogleAdsEvidence(sessions[2])).toBe(true);
    expect(attributionCoverage(sessions)).toMatchObject({ total: 3, withGaClientId: 1, strictGoogleAds: 2, inferredSearchReferrer: 1 });
  });

  it("does not label Display traffic as Search and applies spend caps", () => {
    expect(networkSplitName({ ad_network_type: "CONTENT" })).toBe("CONTENT");
    expect(networkSplitName({ ad_network_type: "SEARCH" })).toBe("Search");
    expect(summarizeAdSpend([{ ad_network_type: "SEARCH", cost_micros: 150_000_000 }], 100)).toEqual({
      spend: 100,
      rawSpend: 150,
      capped: true,
      byNetwork: { Search: 150 },
    });
  });

  it("suppresses ROAS when currency conversion or strict attribution is unsafe", () => {
    expect(roasByCurrency({ USD: 9 }, 3)).toEqual({ USD: 3 });
    expect(roasByCurrency({ USD: 9, CAD: 9 }, 3)).toEqual({ blocked: "ROAS suppressed until non-USD revenue is converted and strict Ads attribution is available" });
    expect(roasByCurrency({ USD: 9 }, 0)).toBeNull();
  });
});
