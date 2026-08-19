export const GA_MEASUREMENT_ID = "G-21R4T0V162";
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";
export const GOOGLE_ADS_PURCHASE_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL || "";

export type PlanType = "single" | "all";

export interface AttributionData {
  gaClientId?: string;
  gaSessionId?: string;
  gaSessionCookie?: string;
  firstLandingPage?: string;
  firstReferrer?: string;
  firstUtmSource?: string;
  firstUtmMedium?: string;
  firstUtmCampaign?: string;
  firstUtmTerm?: string;
  firstUtmContent?: string;
  firstGclid?: string;
  firstGbraid?: string;
  firstWbraid?: string;
  firstMsclkid?: string;
  lastLandingPage?: string;
  lastReferrer?: string;
  lastUtmSource?: string;
  lastUtmMedium?: string;
  lastUtmCampaign?: string;
  lastUtmTerm?: string;
  lastUtmContent?: string;
  lastGclid?: string;
  lastGbraid?: string;
  lastWbraid?: string;
  lastMsclkid?: string;
  firstSeenAt?: string;
  lastSeenAt?: string;
}

interface TouchData {
  landingPage: string;
  referrer: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  msclkid?: string;
  seenAt: string;
}

interface StoredAttribution {
  first?: TouchData;
  last?: TouchData;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = "snready_attribution";
const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1000;

function isBrowser() {
  return typeof window !== "undefined";
}

function truncate(value: string | null | undefined, maxLength = 240) {
  if (!value) return undefined;
  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

function readStoredAttribution(): StoredAttribution {
  if (!isBrowser()) return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as StoredAttribution;
    const lastSeen = parsed.last?.seenAt ? Date.parse(parsed.last.seenAt) : 0;
    if (lastSeen && Date.now() - lastSeen > ATTRIBUTION_TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return {};
    }

    return parsed || {};
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return {};
  }
}

function writeStoredAttribution(attribution: StoredAttribution) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
}

function getParam(params: URLSearchParams, key: string) {
  return truncate(params.get(key) || undefined);
}

function getCookie(name: string) {
  if (!isBrowser()) return undefined;

  const match = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`));

  if (!match) return undefined;
  return decodeURIComponent(match.slice(name.length + 1));
}

function getGaClientId() {
  const cookie = getCookie("_ga");
  if (!cookie) return undefined;

  // Universal GA/GA4 cookies usually look like GA1.1.123456789.987654321.
  // GA4 Measurement Protocol expects the final two numeric parts joined by a dot.
  const parts = cookie.split(".");
  if (parts.length >= 4) return truncate(parts.slice(-2).join("."), 100);
  return truncate(cookie, 100);
}

function getGaSessionCookie() {
  const measurementSuffix = GA_MEASUREMENT_ID.replace("G-", "");
  return truncate(getCookie(`_ga_${measurementSuffix}`), 240);
}

function getGaSessionId() {
  const cookie = getGaSessionCookie();
  if (!cookie) return undefined;

  // Current GA4 cookies include a segment like s1234567890. Keep this best-effort
  // so future server-side/offline conversion work can join browser and Stripe data.
  const sessionMatch = cookie.match(/(?:^|\.)s(\d+)(?:\.|$)/);
  return truncate(sessionMatch?.[1], 100);
}

function hasCampaignParams(touch: TouchData) {
  return Boolean(
    touch.utmSource ||
      touch.utmMedium ||
      touch.utmCampaign ||
      touch.utmTerm ||
      touch.utmContent ||
      touch.gclid ||
      touch.gbraid ||
      touch.wbraid ||
      touch.msclkid
  );
}

function currentTouch(): TouchData | null {
  if (!isBrowser()) return null;

  const url = new URL(window.location.href);
  const params = url.searchParams;
  return {
    landingPage: truncate(`${url.pathname}${url.search}`) || "/",
    referrer: truncate(document.referrer) || "",
    utmSource: getParam(params, "utm_source"),
    utmMedium: getParam(params, "utm_medium"),
    utmCampaign: getParam(params, "utm_campaign"),
    utmTerm: getParam(params, "utm_term"),
    utmContent: getParam(params, "utm_content"),
    gclid: getParam(params, "gclid"),
    gbraid: getParam(params, "gbraid"),
    wbraid: getParam(params, "wbraid"),
    msclkid: getParam(params, "msclkid"),
    seenAt: new Date().toISOString(),
  };
}

function flattenAttribution(stored: StoredAttribution): AttributionData {
  return {
    gaClientId: getGaClientId(),
    gaSessionId: getGaSessionId(),
    gaSessionCookie: getGaSessionCookie(),
    firstLandingPage: stored.first?.landingPage,
    firstReferrer: stored.first?.referrer,
    firstUtmSource: stored.first?.utmSource,
    firstUtmMedium: stored.first?.utmMedium,
    firstUtmCampaign: stored.first?.utmCampaign,
    firstUtmTerm: stored.first?.utmTerm,
    firstUtmContent: stored.first?.utmContent,
    firstGclid: stored.first?.gclid,
    firstGbraid: stored.first?.gbraid,
    firstWbraid: stored.first?.wbraid,
    firstMsclkid: stored.first?.msclkid,
    lastLandingPage: stored.last?.landingPage,
    lastReferrer: stored.last?.referrer,
    lastUtmSource: stored.last?.utmSource,
    lastUtmMedium: stored.last?.utmMedium,
    lastUtmCampaign: stored.last?.utmCampaign,
    lastUtmTerm: stored.last?.utmTerm,
    lastUtmContent: stored.last?.utmContent,
    lastGclid: stored.last?.gclid,
    lastGbraid: stored.last?.gbraid,
    lastWbraid: stored.last?.wbraid,
    lastMsclkid: stored.last?.msclkid,
    firstSeenAt: stored.first?.seenAt,
    lastSeenAt: stored.last?.seenAt,
  };
}

export function captureAttribution(): AttributionData {
  if (!isBrowser()) return {};

  const stored = readStoredAttribution();
  const touch = currentTouch();
  if (!touch) return flattenAttribution(stored);

  const next: StoredAttribution = {
    first: stored.first || touch,
    last: !stored.last || hasCampaignParams(touch) ? touch : stored.last,
  };

  writeStoredAttribution(next);
  return flattenAttribution(next);
}

export function getStoredAttribution(): AttributionData {
  return flattenAttribution(readStoredAttribution());
}

export function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (!isBrowser() || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

export function trackPageView(path: string) {
  if (!isBrowser() || typeof window.gtag !== "function") return;

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
    content_group: getContentGroup(path),
  });
}

export function trackBeginCheckout(params: {
  certification?: string;
  plan: PlanType;
  value: number;
  returnUrl: string;
}) {
  trackEvent("begin_checkout", {
    currency: "USD",
    value: params.value,
    plan: params.plan,
    certification: params.certification || "ALL",
    checkout_start_path: params.returnUrl,
    items: [commerceItem(params.plan, params.certification, params.value)],
  });
}

export function trackPurchaseOnce(params: {
  transactionId: string;
  certification?: string;
  plan: PlanType;
  value: number;
}) {
  if (!isBrowser()) return;

  const dedupeKey = `snready_purchase_tracked:${params.transactionId}`;
  if (window.localStorage.getItem(dedupeKey)) return;
  window.localStorage.setItem(dedupeKey, new Date().toISOString());

  trackEvent("purchase", {
    transaction_id: params.transactionId,
    currency: "USD",
    value: params.value,
    plan: params.plan,
    certification: params.certification || "ALL",
    items: [commerceItem(params.plan, params.certification, params.value)],
  });

  if (GOOGLE_ADS_ID && GOOGLE_ADS_PURCHASE_LABEL) {
    trackEvent("conversion", {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_PURCHASE_LABEL}`,
      transaction_id: params.transactionId,
      currency: "USD",
      value: params.value,
    });
  }
}

export function getPlanValue(plan: PlanType) {
  return plan === "all" ? 49 : 9;
}

function commerceItem(plan: PlanType, certification: string | undefined, value: number) {
  return {
    item_id: `${plan}-${certification || "all"}`,
    item_name: plan === "all" ? "All Certifications" : `${certification?.toUpperCase()} Certification`,
    item_category: "ServiceNow certification prep",
    item_variant: plan,
    price: value,
    quantity: 1,
  };
}

function getContentGroup(path: string) {
  if (path.startsWith("/blog")) return "blog";
  if (path.startsWith("/salaries")) return "salary";
  if (path.startsWith("/courses")) return "course";
  if (path.includes("practice-questions")) return "practice";
  if (path.includes("study-guide")) return "study-guide";
  if (path.startsWith("/checkout")) return "checkout";
  if (path.startsWith("/certifications")) return "certifications";
  return "site";
}
