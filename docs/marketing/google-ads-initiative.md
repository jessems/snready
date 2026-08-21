# Google Ads Initiative

Goal: drive incremental SNReady sales while keeping acquisition spend disciplined.

## Budget rules

- Start with Google Ads budget capped at **$100/month** (~$3.30/day).
- Do not scale spend just because clicks increase.
- If measured paid-search return is positive (ad-attributed Stripe revenue > Google Ads spend), the cap can increase to **$250/month**.
- If ROAS is below 1.0x, pause or reduce bids/campaigns until attribution data shows a better path.

## Required campaign tracking

Enable Google Ads auto-tagging and use final URL suffix / tracking template UTMs:

```text
utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}&utm_id={campaignid}
```

This tracking stores first-touch and last-touch attribution in browser localStorage, passes those fields to `/api/checkout`, and persists them into Stripe Checkout Session metadata. It also stores GA4 `gaClientId`, `gaSessionId`, and the raw GA4 session cookie on checkout sessions so later offline-conversion/server-side Measurement Protocol work can join paid Stripe conversions back to the browser session. Stripe remains the source of truth for paid conversions; GA4 gets `begin_checkout` and `purchase` ecommerce events. When the site has Google Ads tag settings configured, the success page also fires a direct Google Ads purchase conversion.

### Website env vars for direct Google Ads conversions

```bash
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-18397575219
NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL=De0BCKvawuQcELPw0sRE
```

If these are unset, the website still captures attribution into Stripe metadata and GA4, but it skips the direct Google Ads conversion event.

## Initial campaigns to launch

Keep the first campaign narrow so $100/month is meaningful:

1. **CSA practice test buyer intent**
   - Landing page: `https://snready.com/csa/practice-questions`
   - Example exact/phrase keywords: `servicenow csa practice test`, `servicenow csa exam questions`, `csa servicenow practice exam`
   - Negative keywords: `free pdf`, `dump`, `brain dump`, `answers pdf`, `torrent`, `job`, `salary`, `training course`

2. **CAD practice test buyer intent**
   - Landing page: `https://snready.com/cad/practice-questions`
   - Example exact/phrase keywords: `servicenow cad practice test`, `servicenow cad exam questions`, `cad servicenow practice exam`
   - Same negative keywords as CSA.

3. **CIS-ITSM practice test buyer intent**
   - Landing page: `https://snready.com/cis-itsm/practice-questions`
   - Example exact/phrase keywords: `servicenow cis itsm practice test`, `servicenow itsm exam questions`, `cis itsm practice exam`
   - Same negative keywords as CSA.

## Monitoring

Run the local report script from the repo root:

```bash
node scripts/marketing/google-ads-attribution-report.mjs
```

Optional spend input while Google Ads API import is not connected:

```bash
GOOGLE_ADS_SPEND_MONTH_TO_DATE=42.75 node scripts/marketing/google-ads-attribution-report.mjs
```

The report reads Stripe Checkout Sessions, identifies sessions with Google Ads UTMs/click IDs, and reports month-to-date ad-attributed revenue, sales, campaign breakdown, and whether spend is eligible to scale.

## Decision policy

- **No ad-attributed sales after 2 weeks:** tighten match types, improve landing page message, or pause the weakest campaign.
- **ROAS between 0 and 1:** keep under $100/month; cut expensive keywords and only keep terms with checkout starts.
- **ROAS above 1:** allow the monthly cap to rise up to $250/month, but keep campaign-level losers paused.
- **Attribution missing:** do not scale; fix UTMs/auto-tagging first.
