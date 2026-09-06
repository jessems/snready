export function completeDayWindow({ start, end, now = new Date() } = {}) {
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const endDate = end ? new Date(`${end}T00:00:00.000Z`) : todayUtc;
  const startDate = start ? new Date(`${start}T00:00:00.000Z`) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  if (!(startDate < endDate)) throw new Error("Report start must be before exclusive end date");
  if (endDate > todayUtc) throw new Error("Report end must be a complete UTC day, not today/future");
  return { start: startDate, end: endDate, startDate: startDate.toISOString().slice(0, 10), endDate: endDate.toISOString().slice(0, 10) };
}

export function isSmokeSession(session) {
  const m = session.metadata || {};
  const email = String(session.customer_details?.email || session.customer_email || "").toLowerCase();
  const values = [m.source, m.firstUtmSource, m.lastUtmSource, m.firstUtmCampaign, m.lastUtmCampaign, m.testMode, m.smokeTest, email].filter(Boolean).map(String).map((v) => v.toLowerCase());
  return values.some((v) => v.includes("deploy-watchdog") || v.includes("smoke") || v.includes("test@example.com"));
}

export function paidStripeTruth(sessions) {
  return sessions.filter((session) => session.payment_status === "paid" && !isSmokeSession(session));
}

export function strictGoogleAdsEvidence(session) {
  const m = session.metadata || {};
  const sourceMediumPairs = [
    [m.firstUtmSource, m.firstUtmMedium],
    [m.lastUtmSource, m.lastUtmMedium],
  ].map(([source, medium]) => [String(source || "").toLowerCase(), String(medium || "").toLowerCase()]);
  const hasGoogleCpc = sourceMediumPairs.some(([source, medium]) => source === "google" && ["cpc", "ppc", "paid", "paid-search"].includes(medium));
  const hasClickId = [m.firstGclid, m.lastGclid, m.firstGbraid, m.lastGbraid, m.firstWbraid, m.lastWbraid].some(Boolean);
  return hasGoogleCpc || hasClickId;
}

export function inferredSearchReferrerEvidence(session) {
  const m = session.metadata || {};
  return [m.firstInferredMedium, m.lastInferredMedium].includes("search-referrer");
}

export function summarizeRevenue(sessions) {
  const paid = paidStripeTruth(sessions);
  const byCurrency = {};
  for (const session of paid) {
    const currency = String(session.currency || "unknown").toUpperCase();
    byCurrency[currency] = (byCurrency[currency] || 0) + Number(session.amount_total || 0) / 100;
  }
  return { paidCount: paid.length, byCurrency };
}

export function attributionCoverage(sessions) {
  const paid = paidStripeTruth(sessions);
  const withGaClientId = paid.filter((s) => Boolean(s.metadata?.gaClientId)).length;
  const withSession = paid.filter((s) => Boolean(s.metadata?.gaSessionId || s.metadata?.gaSessionCookie || s.metadata?.sessionId)).length;
  const strictGoogleAds = paid.filter(strictGoogleAdsEvidence).length;
  const inferredSearchReferrer = paid.filter(inferredSearchReferrerEvidence).length;
  return { total: paid.length, withGaClientId, withSession, strictGoogleAds, inferredSearchReferrer };
}

export function networkSplitName(row = {}) {
  const network = String(row.ad_network_type || row.segments?.adNetworkType || row.network || "UNKNOWN").toUpperCase();
  if (network.includes("SEARCH")) return "Search";
  if (network.includes("DISPLAY")) return "Display";
  if (network.includes("YOUTUBE")) return "YouTube";
  if (network.includes("PARTNER")) return "Search partners";
  return network || "Unknown";
}

export function summarizeAdSpend(rows, capDollars = Infinity) {
  const byNetwork = {};
  let spend = 0;
  for (const row of rows) {
    const dollars = Number(row.cost_micros ?? row.metrics?.costMicros ?? 0) / 1_000_000;
    spend += dollars;
    const network = networkSplitName(row);
    byNetwork[network] = (byNetwork[network] || 0) + dollars;
  }
  return { spend: Math.min(spend, capDollars), rawSpend: spend, capped: spend > capDollars, byNetwork };
}

export function roasByCurrency(revenueByCurrency, spendDollars) {
  if (!spendDollars || spendDollars <= 0) return null;
  if (!revenueByCurrency.USD || Object.keys(revenueByCurrency).some((currency) => currency !== "USD" && revenueByCurrency[currency] > 0)) {
    return { blocked: "ROAS suppressed until non-USD revenue is converted and strict Ads attribution is available" };
  }
  return { USD: revenueByCurrency.USD / spendDollars };
}

export function conversionOwnershipStatus(conversions = []) {
  return conversions.map((conversion) => ({
    name: conversion.name || conversion.conversionAction?.name || "unknown",
    owner: conversion.ownerCustomer || conversion.conversionAction?.ownerCustomer || "unknown",
    status: conversion.status || conversion.conversionAction?.status || "unknown",
    includeInConversionsMetric: Boolean(conversion.includeInConversionsMetric ?? conversion.conversionAction?.includeInConversionsMetric),
    scope: String(conversion.ownerCustomer || "").includes("manager") ? "mcc" : "campaign/account",
  }));
}
