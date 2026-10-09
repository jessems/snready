# Purchase Follow-up Emails

SNReady sends an automated, one-time outcome check-in after a completed Stripe checkout. The buyer can report whether they took and passed the exam, rate how helpful the practice questions were, and optionally provide a comment with separate permission to feature it.

Individual certification purchases receive a check-in 15 days after purchase. Buyers who did not pass can reply “no” for a full refund, with no questions, form, or proof required. Buyers can also reach out anytime to ask for a refund. The $49 All Access plan is excluded and retains its existing outcome survey. Refund requests arrive at the configured reply-to inbox and must be processed in Stripe by the operator; inbound replies do not automatically issue refunds.

## How it works

1. `checkout.session.completed` in `functions/api/webhook.ts` grants access and enqueues a follow-up record in the existing `SNREADY_ACCESS` KV namespace.
2. `/api/session` also enqueues the same follow-up after checkout success, so buyers are still scheduled if the Stripe webhook is delayed. The Stripe session ID is the idempotency key, so duplicate scheduling is safe.
3. A scheduler must call the protected `POST /api/followups/run` endpoint daily to process due follow-ups.
4. The processor finds due records from KV, honors email-level suppression, sends through Resend, marks successful records as `sent`, and deletes their due index key.
5. The email links to `/feedback` with a purchase-bound random token. Responses do not expose or store the buyer's email in the response object.

## KV keys

- `purchase_followup:{stripeSessionId}` — durable purchase follow-up record.
- `purchase_followup_due:{YYYY-MM-DD}:{stripeSessionId}` — due-date index scanned by the daily runner.
- `purchase_feedback:{token}` — maps a random feedback token to its Stripe session.
- `purchase_feedback_response:{token}` — stores the submitted outcome and explicit feature consent.
- `purchase_followup_suppressed:{normalizedEmail}` — prevents future customer follow-ups.
- `purchase_outcome_backfill_queued:{normalizedEmail}` — deduplicates the historical purchaser campaign by customer.

## Configuration

Cloudflare Pages environment variables/secrets:

- `RESEND_API_KEY` — existing Resend API key used to send email.
- `SITE_URL` — existing site URL, used for the practice/login link.
- `FOLLOWUP_RUN_SECRET` — required shared secret for `POST /api/followups/run`.
- `FOLLOWUP_DELAY_DAYS` — optional delay for All Access outcome surveys; defaults to `21`. New individual purchases use a fixed `15` days. Explicit historical backfill due dates remain unchanged.
- `FOLLOWUP_FROM_EMAIL` — optional sender; defaults to `SNReady <jesse@snready.com>`.
- `FOLLOWUP_REPLY_TO` — optional reply-to; defaults to `jesse@snready.com`.

Configure a daily scheduler to call the protected HTTP endpoint. Verify the production scheduler separately; queuing purchases alone does not send the emails. The endpoint also supports manual runs.

## Manual run

```bash
curl -X POST \
  "https://www.snready.com/api/followups/run?dryRun=true&limit=100&lookbackDays=14" \
  -H "Authorization: Bearer $FOLLOWUP_RUN_SECRET"
```

Change `dryRun=true` to `dryRun=false` or omit it to send due emails.

## Historical purchaser backfill

The protected backfill endpoint scans paid Stripe Checkout Sessions, defaults to buyers at least 21 days past purchase, deduplicates by normalized email, and skips suppressed customers. It **defaults to dry-run mode**:

```bash
curl -X POST \
  "https://www.snready.com/api/followups/backfill?dryRun=true&minimumAgeDays=21&limit=100" \
  -H "Authorization: Bearer $FOLLOWUP_RUN_SECRET"
```

After reviewing the aggregate dry-run counts, set `dryRun=false` to enqueue the cohort, then invoke `/api/followups/run` to send. Neither endpoint returns customer email addresses.

## Safety

- Emails are idempotent per Stripe checkout session.
- The historical campaign sends at most once per normalized purchaser email.
- Feedback links are unguessable, purchase-bound UUIDs; invalid links are rejected.
- Emails include visible opt-out copy and RFC 8058 one-click unsubscribe headers.
- Comments can only be featured when the buyer explicitly checks the consent box.
- Sent records stay in KV for auditability.
- Due index keys are deleted after successful send.
- Failed records are marked `failed` with the error message and can be retried by rewriting their status to `pending` or by adding a new due index key.
