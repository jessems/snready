import { describe, expect, it } from "vitest";
import { aggregateDiagnosticRecords, mergeCheckoutAttributionDiagnostic, recordCheckoutAttributionDiagnostic } from "@/functions/lib/attribution-diagnostics";
import { onRequestGet } from "@/functions/api/attribution-diagnostics";

function context(request: Request, env: Record<string, unknown>) {
  return {
    request,
    env,
    functionPath: "/api/attribution-diagnostics",
    waitUntil: () => {},
    passThroughOnException: () => {},
    next: async () => new Response(null),
    params: {},
    data: {},
  } as unknown as Parameters<typeof onRequestGet>[0];
}

type MockKvNamespace = KVNamespace<string> & {
  store: Map<string, string>;
};

function kvStore(initial: Record<string, string> = {}): MockKvNamespace {
  const store = new Map(Object.entries(initial));
  return {
    store,
    async get(key: string) {
      return store.get(key) ?? null;
    },
    async put(key: string, value: string) {
      store.set(key, value);
    },
    async delete(key: string) {
      store.delete(key);
    },
    async list() {
      return { keys: [], list_complete: true, cursor: "", cacheStatus: null } as unknown as KVNamespaceListResult<unknown>;
    },
  } as MockKvNamespace;
}

describe("checkout attribution diagnostics", () => {
  it("aggregates sanitized attribution presence counters", () => {
    const dayOne = mergeCheckoutAttributionDiagnostic(null, {
      attribution: {
        gaClientId: "123.456",
        gaSessionId: "789",
        firstUtmSource: "google",
        firstUtmMedium: "cpc",
        firstGclid: "abc",
        firstLandingPage: "/csa/practice-questions?utm_source=google",
      },
      certification: "csa",
      plan: "single",
      returnUrl: "/csa/practice-questions",
      now: new Date("2026-08-31T12:00:00Z"),
    });

    const dayTwo = mergeCheckoutAttributionDiagnostic(null, {
      attribution: {},
      certification: "cad",
      plan: "all",
      returnUrl: "/pricing",
      now: new Date("2026-08-30T12:00:00Z"),
    });

    const aggregate = aggregateDiagnosticRecords([dayOne, dayTwo]);
    expect(aggregate.totalCheckouts).toBe(2);
    expect(aggregate.withGaClientId).toBe(1);
    expect(aggregate.withGaSessionId).toBe(1);
    expect(aggregate.withAnyUtm).toBe(1);
    expect(aggregate.withAnyClickId).toBe(1);
    expect(aggregate.googleCpcLike).toBe(1);
    expect(aggregate.sourceCounts.google).toBe(1);
    expect(aggregate.sourceCounts["(none)"]).toBe(1);
    expect(aggregate.mediumCounts.cpc).toBe(1);
    expect(aggregate.planCounts.single).toBe(1);
    expect(aggregate.planCounts.all).toBe(1);
    expect(aggregate.certificationCounts.CSA).toBe(1);
    expect(aggregate.certificationCounts.CAD).toBe(1);
  });

  it("records a daily diagnostic snapshot to KV", async () => {
    const kv = kvStore();
    const result = await recordCheckoutAttributionDiagnostic(kv, {
      attribution: {
        gaClientId: "123.456",
        firstUtmSource: "chatgpt.com",
      },
      certification: "csa",
      plan: "single",
      returnUrl: "/csa/practice-questions",
      now: new Date("2026-08-31T09:00:00Z"),
    });

    expect(result?.totalCheckouts).toBe(1);
    expect(result?.withGaClientId).toBe(1);
    expect(result?.sourceCounts["chatgpt.com"]).toBe(1);
    expect(kv.store.get("attribution_diagnostics:2026-08-31")).toContain('"totalCheckouts":1');
  });

  it("returns protected aggregated diagnostics over HTTP", async () => {
    const kv = kvStore({
      "attribution_diagnostics:2026-08-31": JSON.stringify({
        key: "attribution_diagnostics:2026-08-31",
        date: "2026-08-31",
        totalCheckouts: 2,
        withReturnUrl: 2,
        emptyAttribution: 1,
        withGaClientId: 1,
        withGaSessionId: 1,
        withGaSessionCookie: 0,
        withAnyUtm: 1,
        withAnyClickId: 1,
        googleCpcLike: 1,
        sourceCounts: { google: 1, "(none)": 1 },
        mediumCounts: { cpc: 1, "(none)": 1 },
        landingPageGroupCounts: { "practice-questions": 1, pricing: 1 },
        planCounts: { single: 1, all: 1 },
        certificationCounts: { CSA: 1, CAD: 1 },
        updatedAt: "2026-08-31T10:00:00.000Z",
      }),
    });

    const response = await onRequestGet(context(
      new Request("https://snready.com/api/attribution-diagnostics?date=2026-08-31", {
        headers: { authorization: "Bearer secret123" },
      }),
      {
        SNREADY_ACCESS: kv,
        ATTRIBUTION_DIAGNOSTICS_SECRET: "secret123",
      }
    ));

    expect(response.status).toBe(200);
    const body = await response.json() as { aggregate: { totalCheckouts: number; sourceCounts: Record<string, number> }; records: unknown[] };
    expect(body.aggregate.totalCheckouts).toBe(2);
    expect(body.aggregate.sourceCounts.google).toBe(1);
    expect(body.records).toHaveLength(1);
  });

  it("rejects unauthorized diagnostics reads", async () => {
    const response = await onRequestGet(context(
      new Request("https://snready.com/api/attribution-diagnostics"),
      {
        SNREADY_ACCESS: kvStore(),
        ATTRIBUTION_DIAGNOSTICS_SECRET: "secret123",
      }
    ));

    expect(response.status).toBe(401);
  });
});
