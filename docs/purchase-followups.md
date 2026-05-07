# Purchase Follow-up Emails

SNReady sends an automated check-in email after each completed Stripe checkout asking whether the buyer had a good experience and passed their certification exam.

## How it works

1. `checkout.session.completed` in `functions/api/webhook.ts` grants access and enqueues a follow-up record in the existing `SNREADY_ACCESS` KV namespace.
2. `/api/session` also enqueues the same follow-up after checkout success, so buyers are still scheduled if the Stripe webhook is delayed. The Stripe session ID is the idempotency key, so duplicate scheduling is safe.
3. A Cloudflare Pages scheduled function or a protected `POST /api/followups/run` call processes due follow-ups daily.
4. The processor finds due records from KV, sends emails through Resend, marks successful records as `sent`, and deletes their due index key.

## KV keys

- `purchase_followup:{stripeSessionId}` — durable purchase follow-up record.
- `purchase_followup_due:{YYYY-MM-DD}:{stripeSessionId}` — due-date index scanned by the daily runner.

## Configuration

Cloudflare Pages environment variables/secrets:

- `RESEND_API_KEY` — existing Resend API key used to send email.
- `SITE_URL` — existing site URL, used for the practice/login link.
- `FOLLOWUP_RUN_SECRET` — required shared secret for `POST /api/followups/run`.
- `FOLLOWUP_DELAY_DAYS` — optional number of days after purchase before sending; defaults to `21`.
- `FOLLOWUP_FROM_EMAIL` — optional sender; defaults to `SNReady <jesse@snready.com>`.
- `FOLLOWUP_REPLY_TO` — optional reply-to; defaults to `jesse@snready.com`.

Schedule a daily Cloudflare Pages Functions cron trigger for the deployment. The `onScheduled` handler in `functions/api/followups/run.ts` processes up to 100 due emails per run with a 14-day lookback. The protected HTTP endpoint is also available for manual runs or for schedulers that call URLs.

## Manual run

```bash
curl -X POST \
  "https://www.snready.com/api/followups/run?dryRun=true&limit=100&lookbackDays=14" \
  -H "Authorization: Bearer $FOLLOWUP_RUN_SECRET"
```

Change `dryRun=true` to `dryRun=false` or omit it to send due emails.

## Safety

- Emails are idempotent per Stripe checkout session.
- Sent records stay in KV for auditability.
- Due index keys are deleted after successful send.
- Failed records are marked `failed` with the error message and can be retried by rewriting their status to `pending` or by adding a new due index key.
