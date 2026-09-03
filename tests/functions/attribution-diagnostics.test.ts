import { describe, expect, it, vi } from "vitest";

import { onRequestGet, onRequestPost } from "@/functions/api/attribution/diagnostics";

type MockKvNamespace = KVNamespace<string> & {
  get: ReturnType<typeof vi.fn>;
};

function kvStore(initial: Record<string, string>): MockKvNamespace {
  const store = new Map(Object.entries(initial));
  return {
    get: vi.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
  } as unknown as MockKvNamespace;
}

function context(
  url = "https://snready.com/api/attribution/diagnostics",
  headers: HeadersInit = {},
  envOverrides: Partial<{ ATTRIBUTION_DIAGNOSTICS_SECRET: string; SNREADY_ACCESS: MockKvNamespace }> = {},
) {
  return {
    request: new Request(url, { headers }),
    env: {
      ATTRIBUTION_DIAGNOSTICS_SECRET: "diag_secret",
      SNREADY_ACCESS: kvStore({}),
      ...envOverrides,
    },
  } as unknown as Parameters<typeof onRequestGet>[0];
}

describe("attribution diagnostics endpoint", () => {
  it("returns 503 when diagnostics secret is not configured", async () => {
    const response = await onRequestGet(
      context("https://snready.com/api/attribution/diagnostics", {}, { ATTRIBUTION_DIAGNOSTICS_SECRET: "" }),
    );

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "Attribution diagnostics are not configured" });
  });

  it("requires authorization", async () => {
    const response = await onRequestGet(context());

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns a single-day view for an explicit date", async () => {
    const accessKv = kvStore({
      "attribution_diagnostics:2026-09-02": JSON.stringify({
        date: "2026-09-02",
        totals: {
          totalCheckouts: 2,
          withGaClientId: 2,
          withGaSessionId: 1,
          withAnyUtm: 1,
          withAnyClickId: 0,
          strictGoogleCpc: 1,
          inferredSearchReferrer: 1,
        },
        buckets: {
          source: { google: 1, unknown: 1 },
          medium: { cpc: 1, unknown: 1 },
          certification: { csa: 2 },
          plan: { single: 2 },
        },
      }),
    });

    const response = await onRequestGet(
      context(
        "https://snready.com/api/attribution/diagnostics?date=2026-09-02",
        { authorization: "Bearer diag_secret" },
        { SNREADY_ACCESS: accessKv },
      ),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      range: {
        start: "2026-09-02",
        end: "2026-09-02",
        days: 1,
      },
      records: [
        {
          date: "2026-09-02",
          totals: {
            totalCheckouts: 2,
            withGaClientId: 2,
            withGaSessionId: 1,
            withAnyUtm: 1,
            withAnyClickId: 0,
            strictGoogleCpc: 1,
            inferredSearchReferrer: 1,
          },
          buckets: {
            source: { google: 1, unknown: 1 },
            medium: { cpc: 1, unknown: 1 },
            certification: { csa: 2 },
            plan: { single: 2 },
          },
        },
      ],
      totals: {
        totalCheckouts: 2,
        withGaClientId: 2,
        withGaSessionId: 1,
        withAnyUtm: 1,
        withAnyClickId: 0,
        strictGoogleCpc: 1,
        inferredSearchReferrer: 1,
      },
    });
  });

  it("rejects POST", async () => {
    const response = await onRequestPost(context() as unknown as Parameters<typeof onRequestPost>[0]);
    expect(response.status).toBe(405);
    expect(await response.json()).toEqual({ error: "Use GET" });
  });
});
