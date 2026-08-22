# Google Ads 5-Exam Launch Pack

Owner: Jesse / SNReady
Last updated: 2026-08-18

This pack is built around SNReady's existing attribution setup:

- Google/UTM params are captured in `lib/analytics.ts`
- Checkout attribution is persisted into Stripe Checkout Session metadata
- Revenue can be reviewed with `node scripts/marketing/google-ads-attribution-report.mjs`

## Recommended first 5 campaigns

Chosen from recent SNReady Stripe sales plus existing certification landing pages:

1. CSA
2. CIS-DF
3. CPOA
4. CAD
5. CIS-CSM

Reference sales signal used for prioritization:

- Last 30 days sales: CSA 9, CIS-DF 4, CPOA 3, CAD 1, CIS-CSM 1
- Last 365 days sales: CIS-DF 45, CSA 29, CPOA 21, CAD 13, CIS-CSM 4

## Tracking settings (apply account-wide)

Enable **auto-tagging** in Google Ads.

Set the account-level or campaign-level **final URL suffix** to:

```text
utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}&utm_id={campaignid}
```

Do not skip this. SNReady already stores these fields for later Stripe ROAS analysis.

Leave the tracking template blank unless you explicitly need one. If you use a tracking template instead of the final URL suffix field, it must include `{lpurl}` first:

```text
{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}&utm_id={campaignid}
```

Do **not** paste the bare UTM string into the tracking-template field. That can create malformed URLs like `/csa/practice-questionshttps://snready.com`, which leads to junk paid traffic and broken attribution.

## Campaign settings

- Network: Search only
- Include Google search partners: Off for launch
- Display expansion: Off
- Location: start with United States, India, Singapore, Canada, United Kingdom, Australia
- Languages: English
- Bidding: Maximize Clicks for first 7-10 days
- Match types: Exact + Phrase only
- Ad rotation: optimize
- Conversions to monitor: purchase, begin_checkout
- Include both abbreviation and full-cert-name keyword variants in each ad group (for example `CIS-DF` + `Data Foundations`)

## Budget reality check

A practical 5-campaign test budget is:

- CSA: $9/day
- CIS-DF: $8/day
- CPOA: $5/day
- CAD: $5/day
- CIS-CSM: $3/day
- Total: $30/day (~$912/month)

If budget is materially lower than that, keep all 5 campaigns created but pause the bottom 2 until the top 3 are stable.

## Shared negative keywords

Apply at campaign level:

```text
free
pdf
dumps
brain dumps
braindumps
torrent
crack
github
quizlet
reddit
youtube
jobs
salary
interview
course free
training institute
answers pdf
```

## Campaign builds

## 1) CSA

- Campaign: SNReady | Search | CSA
- Landing page: https://snready.com/csa/practice-questions
- Daily budget: $9

### Ad groups

#### CSA Practice Exam
Keywords:
- [servicenow csa practice exam]
- "servicenow csa practice exam"
- [servicenow csa practice test]
- "servicenow csa practice test"
- [csa practice questions]
- "csa practice questions"
- [certified system administrator practice questions]
- "certified system administrator practice questions"

#### CSA Exam Questions
Keywords:
- [servicenow csa exam questions]
- "servicenow csa exam questions"
- [csa mock test]
- "csa mock test"
- [servicenow administrator certification practice test]
- "servicenow administrator certification practice test"
- [certified system administrator mock test]
- "certified system administrator mock test"

Suggested headlines:
- CSA Practice Exam Questions
- ServiceNow CSA Mock Test
- Prepare for the CSA Exam
- CSA Practice Questions Online
- ServiceNow Admin Exam Prep
- CSA Exam Prep With Explanations
- Practice Realistic CSA Questions
- Instant CSA Study Access

Descriptions:
- Practice realistic CSA exam questions with explanations and instant access.
- Focused ServiceNow CSA prep built for faster exam readiness.
- Train with exam-style CSA practice questions online.
- Prepare for the ServiceNow CSA exam with targeted question practice.

## 2) CIS-DF

- Campaign: SNReady | Search | CIS-DF
- Landing page: https://snready.com/cis-df/practice-questions
- Daily budget: $8

### Ad groups

#### CIS-DF Practice Exam
Keywords:
- [cis-df practice exam]
- "cis-df practice exam"
- [cis-df practice questions]
- "cis-df practice questions"
- [servicenow cis-df practice questions]
- "servicenow cis-df practice questions"
- [data foundations practice exam]
- "data foundations practice exam"
- [certified implementation specialist data foundations practice questions]
- "certified implementation specialist data foundations practice questions"

#### CIS-DF Exam Questions
Keywords:
- [cis-df exam questions]
- "cis-df exam questions"
- [data foundations certification practice test]
- "data foundations certification practice test"
- [cis-df mock test]
- "cis-df mock test"
- [servicenow data foundations exam questions]
- "servicenow data foundations exam questions"

Suggested headlines:
- CIS-DF Practice Questions
- ServiceNow CIS-DF Exam Prep
- CIS-DF Mock Exam Access
- Data Foundations Exam Practice
- CIS-DF Questions With Explanations
- Prepare for CIS-DF Faster
- Practice Realistic CIS-DF Questions
- Targeted CIS-DF Exam Prep

Descriptions:
- Targeted CIS-DF practice questions and explanations for focused exam prep.
- Train on realistic ServiceNow CIS-DF exam-style questions online.
- Prepare faster with focused CIS-DF question practice.
- Built for ServiceNow CIS-DF candidates who want practical exam prep.

## 3) CPOA

- Campaign: SNReady | Search | CPOA
- Landing page: https://snready.com/cpoa/practice-questions
- Daily budget: $5

### Ad groups

#### CPOA Practice Exam
Keywords:
- [servicenow cpoa practice exam]
- "servicenow cpoa practice exam"
- [servicenow cpoa practice test]
- "servicenow cpoa practice test"
- [cpoa practice questions]
- "cpoa practice questions"
- [certified product owner agile practice exam]
- "certified product owner agile practice exam"

#### CPOA Exam Questions
Keywords:
- [cpoa exam questions]
- "cpoa exam questions"
- [cpoa mock test]
- "cpoa mock test"
- [certified product owner agile practice questions]
- "certified product owner agile practice questions"

Suggested headlines:
- CPOA Practice Exam Questions
- ServiceNow CPOA Mock Test
- Prepare for the CPOA Exam
- CPOA Questions With Explanations
- Product Owner Agile Exam Prep
- CPOA Practice Test Online
- Practice Realistic CPOA Questions
- Targeted CPOA Exam Prep

Descriptions:
- Practice ServiceNow CPOA questions with clear explanations and instant access.
- Focus your CPOA exam prep with realistic practice questions.
- Prepare for the ServiceNow CPOA exam with targeted question practice.
- Exam-style CPOA prep for faster certification readiness.

## 4) CAD

- Campaign: SNReady | Search | CAD
- Landing page: https://snready.com/cad/practice-questions
- Daily budget: $5

### Ad groups

#### CAD Practice Exam
Keywords:
- [servicenow cad practice exam]
- "servicenow cad practice exam"
- [servicenow cad practice test]
- "servicenow cad practice test"
- [certified application developer practice test]
- "certified application developer practice test"

#### CAD Exam Questions
Keywords:
- [cad exam questions servicenow]
- "cad exam questions servicenow"
- [servicenow developer mock test]
- "servicenow developer mock test"
- [cad practice questions]
- "cad practice questions"
- [certified application developer practice questions]
- "certified application developer practice questions"

Suggested headlines:
- CAD Practice Exam Questions
- ServiceNow CAD Mock Test
- Certified App Developer Prep
- CAD Questions With Explanations
- Practice for the CAD Exam
- ServiceNow Developer Exam Prep
- Practice Realistic CAD Questions
- Targeted CAD Question Prep

Descriptions:
- Practice realistic CAD exam questions for ServiceNow developers.
- CAD prep with exam-style questions, explanations, and instant access.
- Prepare for the ServiceNow CAD exam with targeted question practice.
- Focus your CAD study time with realistic practice questions.

## 5) CIS-CSM

- Campaign: SNReady | Search | CIS-CSM
- Landing page: https://snready.com/cis-csm/practice-questions
- Daily budget: $3

### Ad groups

#### CIS-CSM Practice Exam
Keywords:
- [cis-csm practice exam]
- "cis-csm practice exam"
- [cis-csm practice questions]
- "cis-csm practice questions"
- [servicenow cis-csm practice exam]
- "servicenow cis-csm practice exam"
- [customer service management practice exam]
- "customer service management practice exam"
- [certified implementation specialist customer service management practice questions]
- "certified implementation specialist customer service management practice questions"

#### CIS-CSM Exam Questions
Keywords:
- [servicenow cis-csm exam questions]
- "servicenow cis-csm exam questions"
- [customer service management certification practice test]
- "customer service management certification practice test"
- [cis-csm mock test]
- "cis-csm mock test"
- [customer service management exam questions]
- "customer service management exam questions"

Suggested headlines:
- CIS-CSM Practice Questions
- ServiceNow CIS-CSM Exam Prep
- CIS-CSM Mock Test Online
- Customer Service Mgmt Exam Prep
- CIS-CSM Questions Explained
- Prepare for the CIS-CSM Exam
- Practice Realistic CIS-CSM Questions
- Targeted CIS-CSM Study Prep

Descriptions:
- Get targeted CIS-CSM practice questions and explanations online.
- Focused ServiceNow CIS-CSM prep built around exam-style questions.
- Prepare for the CIS-CSM exam with realistic question practice.
- Train with targeted CIS-CSM questions and instant online access.

## Recommended ad assets

### Callouts
- Instant Access
- Lifetime Access
- Exam-Style Questions
- Detailed Explanations
- Focused ServiceNow Prep

### Structured snippets
Header: Certifications
Values: CSA, CIS-DF, CPOA, CAD, CIS-CSM

### Sitelinks
- Practice Questions → https://snready.com/practice-questions
- Certifications → https://snready.com/certifications
- Pricing → https://snready.com/pricing
- Study Plan → https://snready.com/study-plan

## Launch sequence

If launching all 5 at once:
1. Create all campaigns as paused
2. Add the final URL suffix
3. Add negatives
4. Add RSAs and assets
5. Turn on top 3 first: CSA, CIS-DF, CPOA
6. Turn on CAD and CIS-CSM after confirming clean tracking + first click quality

## Post-launch checks

### Check 1: URL tagging
Click one ad preview/final URL and confirm the page URL contains:
- utm_source=google
- utm_medium=cpc
- utm_campaign=
- utm_term=
- utm_content=

Also confirm the path stays clean, e.g. `/csa/practice-questions?...` and **not** malformed variants like `/csa/practice-questionshttps://snready.com`.

### Check 2: Begin checkout tracking
Trigger a checkout from a tagged session and confirm begin_checkout fires in GA4 realtime.

### Check 3: Stripe attribution
Run:

```bash
cd /root/.openclaw/workspace-snready/snready
node scripts/marketing/google-ads-attribution-report.mjs
```

Optional with spend entered:

```bash
cd /root/.openclaw/workspace-snready/snready
GOOGLE_ADS_SPEND_MONTH_TO_DATE=42.75 node scripts/marketing/google-ads-attribution-report.mjs
```

## Decision rules after launch

- No checkout starts after 10-14 days: tighten keywords and pause weakest ad groups
- Clicks but no purchases: improve landing page message before scaling spend
- Purchases with positive ROAS: increase CSA and CIS-DF first
- Do not broaden to Display or Performance Max until search is profitable
