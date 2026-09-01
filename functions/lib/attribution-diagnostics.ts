type AttributionData = Record<string, string | undefined>;

type CountMap = Record<string, number>;

export interface CheckoutAttributionDiagnosticRecord {
  key: string;
  date: string;
  totalCheckouts: number;
  withReturnUrl: number;
  emptyAttribution: number;
  withGaClientId: number;
  withGaSessionId: number;
  withGaSessionCookie: number;
  withAnyUtm: number;
  withAnyClickId: number;
  googleCpcLike: number;
  sourceCounts: CountMap;
  mediumCounts: CountMap;
  landingPageGroupCounts: CountMap;
  planCounts: CountMap;
  certificationCounts: CountMap;
  updatedAt: string;
}

interface DiagnosticFlags {
  source: string;
  medium: string;
  landingPageGroup: string;
  hasReturnUrl: boolean;
  isEmptyAttribution: boolean;
  hasGaClientId: boolean;
  hasGaSessionId: boolean;
  hasGaSessionCookie: boolean;
  hasAnyUtm: boolean;
  hasAnyClickId: boolean;
  isGoogleCpcLike: boolean;
}

const DIAGNOSTIC_PREFIX = "attribution_diagnostics:";

function increment(map: CountMap, key: string, amount = 1) {
  map[key] = (map[key] || 0) + amount;
}

function normalizeBucket(value: string | undefined, noneLabel = "(none)") {
  if (!value) return noneLabel;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return noneLabel;
  if (normalized === "google") return "google";
  if (normalized === "cpc") return "cpc";
  if (normalized === "organic") return "organic";
  if (normalized === "referral") return "referral";
  if (normalized === "ppc") return "ppc";
  if (normalized === "ai-assistant") return "ai-assistant";
  if (normalized === "chatgpt.com") return "chatgpt.com";
  if (normalized === "reddit.com") return "reddit.com";
  if (normalized === "bing") return "bing";
  if (normalized.length <= 48) return normalized;
  return `${normalized.slice(0, 45)}...`;
}

function classifyLandingPage(value: string | undefined) {
  const path = value || "";
  if (!path) return "unknown";
  if (path.includes("practice-questions")) return "practice-questions";
  if (path.startsWith("/pricing")) return "pricing";
  if (path.includes("study-guide")) return "study-guide";
  if (path.startsWith("/courses")) return "courses";
  if (path.startsWith("/checkout")) return "checkout";
  return "other";
}

function summarizeAttribution(attribution: AttributionData | undefined, returnUrl?: string): DiagnosticFlags {
  const source = normalizeBucket(attribution?.lastUtmSource || attribution?.firstUtmSource);
  const medium = normalizeBucket(attribution?.lastUtmMedium || attribution?.firstUtmMedium);
  const hasAnyUtm = Boolean(
    attribution?.firstUtmSource ||
    attribution?.lastUtmSource ||
    attribution?.firstUtmMedium ||
    attribution?.lastUtmMedium ||
    attribution?.firstUtmCampaign ||
    attribution?.lastUtmCampaign ||
    attribution?.firstUtmTerm ||
    attribution?.lastUtmTerm ||
    attribution?.firstUtmContent ||
    attribution?.lastUtmContent
  );
  const hasAnyClickId = Boolean(
    attribution?.firstGclid || attribution?.lastGclid || attribution?.firstGbraid || attribution?.lastGbraid || attribution?.firstWbraid || attribution?.lastWbraid || attribution?.firstMsclkid || attribution?.lastMsclkid
  );
  const hasGaClientId = Boolean(attribution?.gaClientId);
  const hasGaSessionId = Boolean(attribution?.gaSessionId);
  const hasGaSessionCookie = Boolean(attribution?.gaSessionCookie);
  const hasReturnUrl = Boolean(returnUrl);
  const isEmptyAttribution = !hasAnyUtm && !hasAnyClickId && !hasGaClientId && !hasGaSessionId && !hasGaSessionCookie;
  const isGoogleCpcLike = source === "google" || medium === "cpc" || medium === "ppc" || Boolean(attribution?.firstGclid || attribution?.lastGclid || attribution?.firstGbraid || attribution?.lastGbraid || attribution?.firstWbraid || attribution?.lastWbraid);
  const landingPageGroup = classifyLandingPage(attribution?.lastLandingPage || attribution?.firstLandingPage || returnUrl);

  return {
    source,
    medium,
    landingPageGroup,
    hasReturnUrl,
    isEmptyAttribution,
    hasGaClientId,
    hasGaSessionId,
    hasGaSessionCookie,
    hasAnyUtm,
    hasAnyClickId,
    isGoogleCpcLike,
  };
}

function utcDateKey(input = new Date()) {
  return input.toISOString().slice(0, 10);
}

function emptyRecord(date: string): CheckoutAttributionDiagnosticRecord {
  return {
    key: `${DIAGNOSTIC_PREFIX}${date}`,
    date,
    totalCheckouts: 0,
    withReturnUrl: 0,
    emptyAttribution: 0,
    withGaClientId: 0,
    withGaSessionId: 0,
    withGaSessionCookie: 0,
    withAnyUtm: 0,
    withAnyClickId: 0,
    googleCpcLike: 0,
    sourceCounts: {},
    mediumCounts: {},
    landingPageGroupCounts: {},
    planCounts: {},
    certificationCounts: {},
    updatedAt: new Date(0).toISOString(),
  };
}

export function mergeCheckoutAttributionDiagnostic(
  existing: CheckoutAttributionDiagnosticRecord | null,
  input: {
    attribution?: AttributionData;
    certification?: string;
    plan?: string;
    returnUrl?: string;
    now?: Date;
  }
): CheckoutAttributionDiagnosticRecord {
  const now = input.now || new Date();
  const date = utcDateKey(now);
  const record = existing && existing.date === date ? structuredClone(existing) : emptyRecord(date);
  const flags = summarizeAttribution(input.attribution, input.returnUrl);

  record.totalCheckouts += 1;
  if (flags.hasReturnUrl) record.withReturnUrl += 1;
  if (flags.isEmptyAttribution) record.emptyAttribution += 1;
  if (flags.hasGaClientId) record.withGaClientId += 1;
  if (flags.hasGaSessionId) record.withGaSessionId += 1;
  if (flags.hasGaSessionCookie) record.withGaSessionCookie += 1;
  if (flags.hasAnyUtm) record.withAnyUtm += 1;
  if (flags.hasAnyClickId) record.withAnyClickId += 1;
  if (flags.isGoogleCpcLike) record.googleCpcLike += 1;
  increment(record.sourceCounts, flags.source);
  increment(record.mediumCounts, flags.medium);
  increment(record.landingPageGroupCounts, flags.landingPageGroup);
  increment(record.planCounts, input.plan || "unknown");
  increment(record.certificationCounts, (input.certification || "ALL").toUpperCase());
  record.updatedAt = now.toISOString();

  return record;
}

export async function recordCheckoutAttributionDiagnostic(
  kv: KVNamespace<string> | undefined,
  input: {
    attribution?: AttributionData;
    certification?: string;
    plan?: string;
    returnUrl?: string;
    now?: Date;
  }
) {
  if (!kv) return null;
  const date = utcDateKey(input.now || new Date());
  const key = `${DIAGNOSTIC_PREFIX}${date}`;

  try {
    const existingRaw = await kv.get(key);
    const existing = existingRaw ? JSON.parse(existingRaw) as CheckoutAttributionDiagnosticRecord : null;
    const next = mergeCheckoutAttributionDiagnostic(existing, input);
    const flags = summarizeAttribution(input.attribution, input.returnUrl);
    await kv.put(key, JSON.stringify(next));
    console.log("Checkout attribution diagnostic recorded", JSON.stringify({
      date: next.date,
      totalCheckouts: next.totalCheckouts,
      withGaClientId: next.withGaClientId,
      withGaSessionId: next.withGaSessionId,
      withAnyUtm: next.withAnyUtm,
      withAnyClickId: next.withAnyClickId,
      googleCpcLike: next.googleCpcLike,
      source: flags.source,
      medium: flags.medium,
      plan: input.plan || "unknown",
      certification: (input.certification || "ALL").toUpperCase(),
    }));
    return next;
  } catch (error) {
    console.error("Checkout attribution diagnostic write failed", error);
    return null;
  }
}

export function buildDiagnosticKey(date: string) {
  return `${DIAGNOSTIC_PREFIX}${date}`;
}

export function listUtcDates(days: number, now = new Date()) {
  const safeDays = Math.min(Math.max(Math.floor(days), 1), 31);
  const dates: string[] = [];
  for (let i = 0; i < safeDays; i += 1) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i));
    dates.push(utcDateKey(d));
  }
  return dates;
}

export function aggregateDiagnosticRecords(records: CheckoutAttributionDiagnosticRecord[]) {
  const total = emptyRecord(records[0]?.date || utcDateKey());
  total.key = "aggregate";
  total.date = records.map((record) => record.date).join(",");
  total.updatedAt = records.reduce((latest, record) => record.updatedAt > latest ? record.updatedAt : latest, new Date(0).toISOString());

  for (const record of records) {
    total.totalCheckouts += record.totalCheckouts;
    total.withReturnUrl += record.withReturnUrl;
    total.emptyAttribution += record.emptyAttribution;
    total.withGaClientId += record.withGaClientId;
    total.withGaSessionId += record.withGaSessionId;
    total.withGaSessionCookie += record.withGaSessionCookie;
    total.withAnyUtm += record.withAnyUtm;
    total.withAnyClickId += record.withAnyClickId;
    total.googleCpcLike += record.googleCpcLike;
    for (const [key, count] of Object.entries(record.sourceCounts)) increment(total.sourceCounts, key, count);
    for (const [key, count] of Object.entries(record.mediumCounts)) increment(total.mediumCounts, key, count);
    for (const [key, count] of Object.entries(record.landingPageGroupCounts)) increment(total.landingPageGroupCounts, key, count);
    for (const [key, count] of Object.entries(record.planCounts)) increment(total.planCounts, key, count);
    for (const [key, count] of Object.entries(record.certificationCounts)) increment(total.certificationCounts, key, count);
  }

  return total;
}
