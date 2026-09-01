import { aggregateDiagnosticRecords, buildDiagnosticKey, listUtcDates, type CheckoutAttributionDiagnosticRecord } from "../lib/attribution-diagnostics";

interface Env {
  SNREADY_ACCESS: KVNamespace<string>;
  FOLLOWUP_RUN_SECRET?: string;
  ATTRIBUTION_DIAGNOSTICS_SECRET?: string;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function expectedSecret(env: Env) {
  return env.ATTRIBUTION_DIAGNOSTICS_SECRET || env.FOLLOWUP_RUN_SECRET || "";
}

function isAuthorized(request: Request, env: Env) {
  const expected = expectedSecret(env);
  if (!expected) {
    console.error("ATTRIBUTION_DIAGNOSTICS_SECRET/FOLLOWUP_RUN_SECRET is not configured");
    return false;
  }

  const authorization = request.headers.get("authorization") || "";
  const bearerToken = authorization.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : "";
  const headerToken = request.headers.get("x-attribution-secret") || "";
  return bearerToken === expected || headerToken === expected;
}

function parseSingleDate(value: string | null) {
  if (!value) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!isAuthorized(request, env)) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const url = new URL(request.url);
  const requestedDate = parseSingleDate(url.searchParams.get("date"));
  const daysParam = Number(url.searchParams.get("days") || "7");
  const days = Number.isFinite(daysParam) ? Math.min(Math.max(Math.floor(daysParam), 1), 31) : 7;
  const dates = requestedDate ? [requestedDate] : listUtcDates(days);

  try {
    const records: CheckoutAttributionDiagnosticRecord[] = [];
    for (const date of dates) {
      const raw = await env.SNREADY_ACCESS.get(buildDiagnosticKey(date));
      if (!raw) continue;
      records.push(JSON.parse(raw) as CheckoutAttributionDiagnosticRecord);
    }

    return jsonResponse({
      success: true,
      dates,
      records,
      aggregate: aggregateDiagnosticRecords(records),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown attribution diagnostics error";
    console.error("Attribution diagnostics read failed", message, error);
    return jsonResponse({ error: "Attribution diagnostics read failed", details: message }, 500);
  }
};

export const onRequestPost: PagesFunction<Env> = async () => jsonResponse({ error: "Use GET" }, 405);
