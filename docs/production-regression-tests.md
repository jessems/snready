# Production Regression Tests

This suite protects the existing revenue-generating SNReady production behavior before larger feature work lands.

## Commands

- `npm run test:data` — validates certification/topic/question data consistency.
- `npm run test:unit` — runs Vitest unit/component/function tests.
- `npm run test` — runs unit + data tests.
- `npm run test:e2e:smoke` — runs Playwright smoke tests.
- `npm run test:ci` — typecheck plus unit/component/function/data tests.

> Note: repository-wide `npm run lint` currently reports pre-existing unrelated lint issues on `main`, so it is not part of the initial test gate. The full Next production build remains covered by Cloudflare Pages deployment builds; local constrained builds may be killed by memory pressure.

## Preview smoke testing

Run the smoke suite against a Cloudflare Pages preview URL:

```bash
PLAYWRIGHT_BASE_URL=https://<preview-url> npm run test:deployment
```

If `PLAYWRIGHT_BASE_URL` is omitted, Playwright builds the static export and serves `out/` locally.

## What the baseline protects

- public page availability
- practice-question/paywall rendering
- deployment auth readiness via magic-link dry run
- deployment session endpoint structured validation responses
- deployment checkout endpoint structured validation responses
- checkout function request shaping
- certification/topic/question data consistency
- private exam-intelligence paths not exposing content

## Notes

The data integrity script treats legacy missing `source`, `labels`, and `meta` fields as non-fatal warnings because many current production questions predate the stricter schema. Future content work can tighten those warnings after a separate migration.
