# Exam Intelligence Data

This directory contains publishable symbolic exam-intelligence artifacts. It must not contain raw exam dumps, verbatim observed exam questions, or private source material.

## Layout

- `artifacts/servicenow-core-artifacts.json` — reusable question-shape registry used to classify and plan ServiceNow exam-style items.
- `profiles/*-exam-profile.json` — quantified profiles generated from SNReady's existing public question bank. These summarize artifact/fact distributions and generation targets without raw dump text.

## Generate profiles

```bash
npm run exam-intel:profile
# optional single cert
npx tsx scripts/exam-intel/profile-existing-questions.ts --cert=csa
```

The generator is deterministic except for `generatedAt`. For reproducible CI/local diffs, set `SNREADY_EXAM_INTEL_GENERATED_AT`.

## Guardrails

- Do not store raw dump stems/options here.
- Dump-derived material must be quarantined outside public app data until distilled into artifacts/facts/mappings.
- Facts should be source-verified before they are used to render public SNReady questions.
