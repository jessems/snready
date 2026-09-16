#!/usr/bin/env node
import fs from "node:fs";
import {
  attributionCoverage,
  completeDayWindow,
  paidStripeTruth,
  roasByCurrency,
  strictGoogleAdsEvidence,
  summarizeRevenue,
} from "./revenue-reporting.mjs";

const STRIPE_KEY_PATH = process.env.STRIPE_KEY_PATH || "/root/.hermes/profiles/snready/home/.hermes/profiles/snready/.stripe_key";
const MONTHLY_SPEND_CAP = Number(process.env.GOOGLE_ADS_MONTHLY_SPEND_CAP || "100");
const SCALE_SPEND_CAP = Number(process.env.GOOGLE_ADS_SCALE_SPEND_CAP || "250");
const spendMonthToDate = process.env.GOOGLE_ADS_SPEND_MONTH_TO_DATE ? Number(process.env.GOOGLE_ADS_SPEND_MONTH_TO_DATE) : null;
const diagnosticsUrl = process.env.ATTRIBUTION_DIAGNOSTICS_URL || "";
const diagnosticsSecret = process.env.ATTRIBUTION_DIAGNOSTICS_SECRET || "";
const diagnosticsDays = Number(process.env.ATTRIBUTION_DIAGNOSTICS_DAYS || "7");
const reportWindow = completeDayWindow({ start: process.env.REPORT_START_DATE, end: process.env.REPORT_END_DATE });

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

async function fetchDiagnostics() {
  if (!diagnosticsUrl || !diagnosticsSecret) return null;

  const url = new URL(diagnosticsUrl);
  url.searchParams.set("days", String(diagnosticsDays));

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${diagnosticsSecret}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Diagnostics ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

function money(centsOrDollars, cents = false) {
  const value = cents ? centsOrDollars / 100 : centsOrDollars;
  return `$${value.toFixed(2)}`;
}

const { start, end } = reportWindow;
const allSessions = await listCheckoutSessions(start, end);
const paid = paidStripeTruth(allSessions);
const adAttributed = paid.filter(strictGoogleAdsEvidence);
const revenue = summarizeRevenue(paid);
const coverage = attributionCoverage(paid);
const revenueCents = paid.reduce((sum, session) => sum + (session.amount_total || 0), 0);
const adRevenueCents = adAttributed.reduce((sum, session) => sum + (session.amount_total || 0), 0);
const googleAdsSales = adAttributed.length;
const campaignBreakdown = new Map();
const diagnostics = await fetchDiagnostics().catch((error) => ({ error: error instanceof Error ? error.message : String(error) }));

for (const session of adAttributed) {
  const m = session.metadata || {};
  const campaign = m.lastUtmCampaign || m.firstUtmCampaign || "unlabeled-google-ads";
  const current = campaignBreakdown.get(campaign) || { sales: 0, revenueCents: 0 };
  current.sales += 1;
  current.revenueCents += session.amount_total || 0;
  campaignBreakdown.set(campaign, current);
}

const dailyBudget = MONTHLY_SPEND_CAP / 30.4;
const daysElapsed = (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000);
const maxSpendToDate = dailyBudget * daysElapsed;
const revenueForRoas = summarizeRevenue(adAttributed).byCurrency;
const roas = spendMonthToDate && spendMonthToDate > 0 ? roasByCurrency(revenueForRoas, spendMonthToDate) : null;
const roasValue = roas && !roas.blocked ? roas.USD : null;
const nextCap = roasValue !== null && roasValue > 1 ? SCALE_SPEND_CAP : MONTHLY_SPEND_CAP;

console.log(`**SNReady Google Ads revenue — ${reportWindow.startDate}→${reportWindow.endDate} complete UTC days**`);
console.log(`- Total Stripe paid truth: ${money(revenueCents, true)} from ${paid.length} paid sessions (smoke/test excluded)`);
console.log(`- Revenue by currency: ${Object.entries(revenue.byCurrency).map(([currency, amount]) => `${currency} ${money(amount)}`).join(", ") || "none"}`);
console.log(`- Strict Google Ads-attributed revenue: ${money(adRevenueCents, true)} from ${googleAdsSales} paid sessions`);
console.log(`- Source attribution coverage: GA client ${coverage.withGaClientId}/${coverage.total}; GA/session cookie ${coverage.withSession}/${coverage.total}; strict Ads ${coverage.strictGoogleAds}/${coverage.total}; inferred search-referrer ${coverage.inferredSearchReferrer}/${coverage.total}`);
if (spendMonthToDate !== null) {
  if (roas?.blocked) {
    console.log(`- Google Ads spend entered: ${money(spendMonthToDate)}; ROAS not reported: ${roas.blocked}`);
  } else {
    console.log(`- Google Ads spend entered: ${money(spendMonthToDate)}; strict USD ROAS: ${roasValue.toFixed(2)}x`);
  }
  console.log(`- Budget decision: ${roasValue !== null && roasValue > 1 ? `positive strict return — eligible to scale up to ${money(nextCap)}/month` : `hold at or below ${money(MONTHLY_SPEND_CAP)}/month until strict ROAS improves`}`);
} else {
  console.log(`- Spend data unavailable to this script. Keep Google Ads account budget at or below ${money(MONTHLY_SPEND_CAP)}/month until spend import/API access is connected.`);
  console.log(`- Pacing guardrail for today: expected MTD spend should be <= ${money(maxSpendToDate)} at the ${money(MONTHLY_SPEND_CAP)}/month cap.`);
}

if (diagnostics?.totals) {
  console.log(`- Checkout coverage (${diagnostics.range.start}→${diagnostics.range.end}): ${diagnostics.totals.withAnyUtm}/${diagnostics.totals.totalCheckouts} with UTMs, ${diagnostics.totals.withAnyClickId}/${diagnostics.totals.totalCheckouts} with click IDs, ${diagnostics.totals.strictGoogleCpc}/${diagnostics.totals.totalCheckouts} strict google/cpc, ${diagnostics.totals.inferredSearchReferrer}/${diagnostics.totals.totalCheckouts} inferred search-referrer`);
} else if (diagnostics?.error) {
  console.log(`- Checkout coverage diagnostics unavailable: ${diagnostics.error}`);
} else {
  console.log("- Checkout coverage diagnostics unavailable: set ATTRIBUTION_DIAGNOSTICS_URL and ATTRIBUTION_DIAGNOSTICS_SECRET to include pre-purchase coverage data.");
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
