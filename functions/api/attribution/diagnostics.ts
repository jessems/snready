interface Env {
  SNREADY_ACCESS: KVNamespace;
  ATTRIBUTION_DIAGNOSTICS_SECRET: string;
}

const ATTRIBUTION_DIAGNOSTICS_PREFIX = "attribution_diagnostics:";

type DiagnosticsBucketMap = Record<string, number>;

type DiagnosticsRecord = {
  date: string;
  updatedAt?: string;
  totals: {
    totalCheckouts: number;
    withGaClientId: number;
    withGaSessionId: number;
    withAnyUtm: number;
    withAnyClickId: number;
    strictGoogleCpc: number;
    inferredSearchReferrer: number;
  };
  buckets?: {
    source?: DiagnosticsBucketMap;
    medium?: DiagnosticsBucketMap;
    certification?: DiagnosticsBucketMap;
    plan?: DiagnosticsBucketMap;
  };
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isAuthorized(request: Request, env: Env): boolean {
  if (!env.ATTRIBUTION_DIAGNOSTICS_SECRET) {
    console.error("ATTRIBUTION_DIAGNOSTICS_SECRET is not configured");
    return false;
  }

  const authorization = request.headers.get("authorization") || "";
  const bearerToken = authorization.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : "";
  const headerToken = request.headers.get("x-attribution-secret") || "";

  return bearerToken === env.ATTRIBUTION_DIAGNOSTICS_SECRET || headerToken === env.ATTRIBUTION_DIAGNOSTICS_SECRET;
}

function emptyRecord(date: string): DiagnosticsRecord {
  return {
    date,
    totals: {
      totalCheckouts: 0,
      withGaClientId: 0,
      withGaSessionId: 0,
      withAnyUtm: 0,
      withAnyClickId: 0,
      strictGoogleCpc: 0,
      inferredSearchReferrer: 0,
    },
    buckets: {
      source: {},
      medium: {},
      certification: {},
      plan: {},
    },
  };
}

function mergeCountMaps(target: DiagnosticsBucketMap, source: DiagnosticsBucketMap = {}) {
  for (const [key, value] of Object.entries(source)) {
    target[key] = (target[key] || 0) + Number(value || 0);
  }
}

function mergeRecords(records: DiagnosticsRecord[]): DiagnosticsRecord {
  const aggregate = emptyRecord("aggregate");

  for (const record of records) {
    aggregate.totals.totalCheckouts += Number(record.totals?.totalCheckouts || 0);
    aggregate.totals.withGaClientId += Number(record.totals?.withGaClientId || 0);
    aggregate.totals.withGaSessionId += Number(record.totals?.withGaSessionId || 0);
    aggregate.totals.withAnyUtm += Number(record.totals?.withAnyUtm || 0);
    aggregate.totals.withAnyClickId += Number(record.totals?.withAnyClickId || 0);
    aggregate.totals.strictGoogleCpc += Number(record.totals?.strictGoogleCpc || 0);
    aggregate.totals.inferredSearchReferrer += Number(record.totals?.inferredSearchReferrer || 0);
    mergeCountMaps(aggregate.buckets?.source || {}, record.buckets?.source);
    mergeCountMaps(aggregate.buckets?.medium || {}, record.buckets?.medium);
    mergeCountMaps(aggregate.buckets?.certification || {}, record.buckets?.certification);
    mergeCountMaps(aggregate.buckets?.plan || {}, record.buckets?.plan);
  }

  return aggregate;
}

function parseDate(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  return value;
}

function recentDates(days: number) {
  const count = Number.isFinite(days) ? Math.min(Math.max(Math.floor(days), 1), 31) : 7;
  const dates: string[] = [];

  for (let offset = 0; offset < count; offset += 1) {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - offset);
    dates.push(date.toISOString().slice(0, 10));
  }

  return dates.reverse();
}

async function readRecord(env: Env, date: string): Promise<DiagnosticsRecord> {
  const raw = await env.SNREADY_ACCESS.get(`${ATTRIBUTION_DIAGNOSTICS_PREFIX}${date}`);
  if (!raw) return emptyRecord(date);

  try {
    const parsed = JSON.parse(raw) as DiagnosticsRecord;
    return {
      ...emptyRecord(date),
      ...parsed,
      date,
      totals: {
        ...emptyRecord(date).totals,
        ...(parsed.totals || {}),
      },
      buckets: {
        ...emptyRecord(date).buckets,
        ...(parsed.buckets || {}),
      },
    };
  } catch {
    return emptyRecord(date);
  }
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.ATTRIBUTION_DIAGNOSTICS_SECRET) {
    return jsonResponse({ error: "Attribution diagnostics are not configured" }, 503);
  }

  if (!isAuthorized(request, env)) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const url = new URL(request.url);
  const explicitDate = parseDate(url.searchParams.get("date"));
  const dates = explicitDate ? [explicitDate] : recentDates(Number(url.searchParams.get("days") || "7"));
  const records = await Promise.all(dates.map((date) => readRecord(env, date)));

  return jsonResponse({
    range: {
      start: dates[0],
      end: dates[dates.length - 1],
      days: dates.length,
    },
    records,
    totals: mergeRecords(records).totals,
  });
};

export const onRequestPost: PagesFunction<Env> = async () => jsonResponse({ error: "Use GET" }, 405);
