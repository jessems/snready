#!/usr/bin/env node
import fs from "node:fs";

const ATTRIBUTION_DIAGNOSTICS_URL = process.env.ATTRIBUTION_DIAGNOSTICS_URL || "https://snready.com/api/attribution-diagnostics";
const ATTRIBUTION_DIAGNOSTICS_SECRET = process.env.ATTRIBUTION_DIAGNOSTICS_SECRET || process.env.FOLLOWUP_RUN_SECRET || "";
const ATTRIBUTION_DIAGNOSTICS_DAYS = Number(process.env.ATTRIBUTION_DIAGNOSTICS_DAYS || "7");

const STRIPE_KEY_PATH = process.env.STRIPE_KEY_PATH || "/root/.hermes/profiles/snready/home/.hermes/profiles/snready/.stripe_key";
const MONTHLY_SPEND_CAP = Number(process.env.GOOGLE_ADS_MONTHLY_SPEND_CAP || "100");
const SCALE_SPEND_CAP = Number(process.env.GOOGLE_ADS_SCALE_SPEND_CAP || "250");
const spendMonthToDate = process.env.GOOGLE_ADS_SPEND_MONTH_TO_DATE ? Number(process.env.GOOGLE_ADS_SPEND_MONTH_TO_DATE) : null;

function monthWindow(now = new Date()) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));
  return { start, next };
}

function isGoogleAdsSession(session) {
  const m = session.metadata || {};
  const values = [
    m.firstUtmSource,
    m.lastUtmSource,
    m.firstUtmMedium,
    m.lastUtmMedium,
    m.firstUtmCampaign,
    m.lastUtmCampaign,
    m.firstGclid,
    m.lastGclid,
    m.firstGbraid,
    m.lastGbraid,
    m.firstWbraid,
    m.lastWbraid,
  ].filter(Boolean).map((value) => String(value).toLowerCase());

  return values.some((value) =>
    value === "google" ||
    value === "cpc" ||
    value === "ppc" ||
    value.includes("google") ||
    value.startsWith("gclid") ||
    value.length > 20 && /^[a-z0-9_-]+$/i.test(value)
  );
}

async function stripeGet(path, params = {}) {
  const key = fs.readFileSync(STRIPE_KEY_PATH, "utf8").trim();
  const url = new URL(`https://api.stripe.com/v1/${path}`);
  for (const [keyName, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) url.searchParams.set(keyName, String(value));
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!response.ok) {
    throw new Error(`Stripe ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

async function listCheckoutSessions(start, end) {
  const sessions = [];
  let startingAfter;
  do {
    const page = await stripeGet("checkout/sessions", {
      limit: 100,
      "created[gte]": Math.floor(start.getTime() / 1000),
      "created[lt]": Math.floor(end.getTime() / 1000),
      starting_after: startingAfter,
    });
    sessions.push(...page.data);
    startingAfter = page.has_more ? page.data.at(-1)?.id : undefined;
  } while (startingAfter);

  return sessions.filter((session) => session.payment_status === "paid");
}

async function fetchAttributionDiagnostics(days = ATTRIBUTION_DIAGNOSTICS_DAYS) {
  if (!ATTRIBUTION_DIAGNOSTICS_SECRET) return null;
  const url = new URL(ATTRIBUTION_DIAGNOSTICS_URL);
  url.searchParams.set("days", String(days));
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${ATTRIBUTION_DIAGNOSTICS_SECRET}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Attribution diagnostics ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

function money(centsOrDollars, cents = false) {
  const value = cents ? centsOrDollars / 100 : centsOrDollars;
  return `$${value.toFixed(2)}`;
}

const { start, next } = monthWindow();
const paid = await listCheckoutSessions(start, next);
const adAttributed = paid.filter(isGoogleAdsSession);
const revenueCents = paid.reduce((sum, session) => sum + (session.amount_total || 0), 0);
const adRevenueCents = adAttributed.reduce((sum, session) => sum + (session.amount_total || 0), 0);
const googleAdsSales = adAttributed.length;
const gaClientIdSessions = paid.filter((session) => Boolean(session.metadata?.gaClientId)).length;
const gaSessionIdSessions = paid.filter((session) => Boolean(session.metadata?.gaSessionId || session.metadata?.gaSessionCookie)).length;
const paidAnyUtmSessions = paid.filter((session) => Boolean(session.metadata?.firstUtmSource || session.metadata?.lastUtmSource || session.metadata?.firstUtmMedium || session.metadata?.lastUtmMedium || session.metadata?.firstUtmCampaign || session.metadata?.lastUtmCampaign)).length;
const paidAnyClickIdSessions = paid.filter((session) => Boolean(session.metadata?.firstGclid || session.metadata?.lastGclid || session.metadata?.firstGbraid || session.metadata?.lastGbraid || session.metadata?.firstWbraid || session.metadata?.lastWbraid)).length;
const diagnostics = await fetchAttributionDiagnostics().catch((error) => {
  console.warn(`Attribution diagnostics unavailable: ${error.message}`);
  return null;
});
const campaignBreakdown = new Map();

for (const session of adAttributed) {
  const m = session.metadata || {};
  const campaign = m.lastUtmCampaign || m.firstUtmCampaign || "unlabeled-google-ads";
  const current = campaignBreakdown.get(campaign) || { sales: 0, revenueCents: 0 };
  current.sales += 1;
  current.revenueCents += session.amount_total || 0;
  campaignBreakdown.set(campaign, current);
}

const dailyBudget = MONTHLY_SPEND_CAP / 30.4;
const maxSpendToDate = dailyBudget * ((Date.now() - start.getTime()) / (24 * 60 * 60 * 1000));
const roas = spendMonthToDate && spendMonthToDate > 0 ? adRevenueCents / 100 / spendMonthToDate : null;
const nextCap = roas !== null && roas > 1 ? SCALE_SPEND_CAP : MONTHLY_SPEND_CAP;

console.log(`**SNReady Google Ads ROAS — ${start.toISOString().slice(0, 7)} MTD**`);
console.log(`- Total Stripe revenue: ${money(revenueCents, true)} from ${paid.length} paid sessions`);
console.log(`- Google Ads-attributed revenue: ${money(adRevenueCents, true)} from ${googleAdsSales} paid sessions`);
console.log(`- Paid-session metadata coverage: ga_client_id ${gaClientIdSessions}/${paid.length}; ga_session ${gaSessionIdSessions}/${paid.length}; any UTM ${paidAnyUtmSessions}/${paid.length}; any click ID ${paidAnyClickIdSessions}/${paid.length}`);
if (diagnostics?.aggregate?.totalCheckouts) {
  const agg = diagnostics.aggregate;
  console.log(`- Checkout coverage (${diagnostics.records.length}d): ga_client_id ${agg.withGaClientId}/${agg.totalCheckouts}; ga_session ${agg.withGaSessionId}/${agg.totalCheckouts}; any UTM ${agg.withAnyUtm}/${agg.totalCheckouts}; any click ID ${agg.withAnyClickId}/${agg.totalCheckouts}; Google/CPC-like ${agg.googleCpcLike}/${agg.totalCheckouts}`);
  const topSources = Object.entries(agg.sourceCounts || {}).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([source, count]) => `${source} ${count}`).join(', ');
  const topMedia = Object.entries(agg.mediumCounts || {}).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([medium, count]) => `${medium} ${count}`).join(', ');
  console.log(`- Checkout sources: ${topSources || 'none'}`);
  console.log(`- Checkout media: ${topMedia || 'none'}`);
} else if (ATTRIBUTION_DIAGNOSTICS_SECRET) {
  console.log("- Checkout coverage: diagnostics endpoint returned no checkout records for the requested window yet");
} else {
  console.log("- Checkout coverage: set ATTRIBUTION_DIAGNOSTICS_SECRET or FOLLOWUP_RUN_SECRET to include pre-purchase checkout diagnostics");
}
if (spendMonthToDate !== null) {
  console.log(`- Google Ads spend entered: ${money(spendMonthToDate)}; ROAS: ${roas.toFixed(2)}x`);
  console.log(`- Budget decision: ${roas > 1 ? `positive return — eligible to scale up to ${money(nextCap)}/month` : `hold at ${money(MONTHLY_SPEND_CAP)}/month or reduce bids until ROAS improves`}`);
} else {
  console.log(`- Spend data unavailable to this script. Keep Google Ads account budget at or below ${money(MONTHLY_SPEND_CAP)}/month until spend import/API access is connected.`);
  console.log(`- Pacing guardrail for today: expected MTD spend should be <= ${money(maxSpendToDate)} at the ${money(MONTHLY_SPEND_CAP)}/month cap.`);
}

const campaigns = [...campaignBreakdown.entries()].sort((a, b) => b[1].revenueCents - a[1].revenueCents).slice(0, 5);
if (campaigns.length) {
  console.log("- Campaigns:");
  for (const [campaign, stats] of campaigns) {
    console.log(`  - ${campaign}: ${money(stats.revenueCents, true)} from ${stats.sales} sales`);
  }
} else {
  console.log("- Campaigns: no paid sessions with Google Ads attribution yet");
}

console.log("- Required tracking convention: use auto-tagging plus UTM tags like utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}.");
