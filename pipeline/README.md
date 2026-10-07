# Question generation pipeline

Implements the concept in [`docs/question-pipeline.md`](../docs/question-pipeline.md).
Course scraping (S3b) is not implemented yet.

```bash
npm run pipeline -- <command> --cert=csa     # no command → list of commands
```

## How a run works

Deterministic stages are plain scripts. LLM stages are **agent packets**: `<stage>:packets`
writes `*.in.json` files, a Claude Code agent fills each one in following
`pipeline/prompts/<prompt>.md` and writes `*.out.json`, and `<stage>:ingest` validates the outputs.
Nothing calls a model API. Use `status` to see which packets are still pending.

To hand a packet to an agent: "Read `pipeline/prompts/<prompt>.md`, then fill
`<packet>.in.json` and write the output to the packet's `output` path."

| Stage | Command | Output |
|-------|---------|--------|
| S1 Blueprint | `blueprint` | `data/pipeline/<cert>/blueprint.json` (from `data/cert-sources/cert-sources.csv`) |
| S2 Sources | `sources` | `sources.json`. Curated fixes live in `seeds.json` (`add` / `remove`) |
| S3a Docs | `scrape-docs` | `corpus.json`. Markdown is cached in `pipeline/.work/docs/` |
| S4 Chunks | `chunk` | `pipeline/.work/chunks/<cert>.jsonl` |
| S5 Facts 🤖 | `facts:packets [--domain= --limit=]` → `facts:ingest` | `facts.json`. Quotes and list items are checked against the chunk |
| S6a Official samples | `samples --cert=all` | blueprint sample items → quarantine `samples/official.json`; public index `data/pipeline/official-samples.json` |
| S6/S7 Observed | `observed` | quarantine `observed.jsonl`: **official items only** (blueprint samples + MeasureUp + dumps), deduped |
| S8a Archetypes 🤖 | `classify:packets` → `classify:ingest` → `archetypes:accept --id=` | quarantine classifications. Proposals go to `archetype-proposals.json` |
| S8b Templates 🤖 | `templates:packets` → `templates:ingest` | `data/pipeline/templates.json` (global) |
| S8c Distribution | `distribution` | `distribution.json` |
| S8e Parameterize 🤖 | `parameterize:packets` → `parameterize:ingest` → `templates:accept --id=` | each observed item → template + bindings + answer, checked against the item's answer key. Item-level results go to quarantine; `parameterization.json` and `template-proposals.json` hold aggregates |
| S8f Ground 🤖 | `ground:packets` → `ground:ingest` | each official item → the docs fact behind its answer (quote-checked, `examTargeted`); links in quarantine `fact-links.json` |
| S9 Plan (official) | `plan:observed --variants=N --restructures=M` | per official item: N **variants** (same template, other facts) + M **restructures** (same fact, other templates) |
| S9 Plan | `plan --target=N` | `plan.json`. N is the desired bank size; existing questions count towards it |
| S10 Instantiate | `instantiate` | `drafts.json`: options and answers fixed from facts, giveaways skipped |
| S11/S12 Write 🤖 | `write:packets` → `write:ingest` | `generated.json` + `rejections.json` |
| S13 Review / publish | `review`, `publish [--write]` | `review.md`. `publish` needs `topic-map.json` |
| S14 Sequencing | `lib/question-sequencing.ts` | used by mock exams and by `publish` ordering |

🤖 = agent stage.

## Audit pages

`/admin/pipeline` (admin-only, like the other `/admin` pages):

- **Exam shape** (`/admin/pipeline/<cert>`): question types as lettered buckets with their share (a 29%, b 16%, …). Each bucket lists its templates (`c.1 What is the table name for {subject}?`, with the `c.1.answer` rule), then every observed and generated instance with its slot bindings and answer.
- **Facts**: blueprint objective → doc seed coverage, and a filterable fact table with quotes, sources and usage.
- **Generated questions**: blueprint balance, plan gaps, questions in sequenced order with identities, and rejections.

Observed items (dump, sample or bank text) render **only under `npm run dev`**. `next build` skips quarantine entirely, so `out/` holds aggregates only.

## Source rule

Exam shape (types, templates, their shares) comes **only from official questions**: ServiceNow blueprint samples, MeasureUp practice exams (`<cert>/measureup/`), or exam dumps (`<cert>/dumps/`). SNReady's own question bank is never an input. It would just measure how we wrote questions before. Below 30 official items, `distribution` warns and the audit page flags the shares as unreliable.

## Never republish official items

We learn structure and tested facts from official items, but never publish their questions. Code in `pipeline/lib/official-guard.ts`:

1. An official item's own (template, fact) pair is never instantiated (`takenInstances`).
2. Writer agents never see official item text. Their drafts are built from templates and docs facts only.
3. `write:ingest` rejects anything whose stem is ≥60% similar to an official item, or ≥40% similar with ≥75% of the same options.
4. `publish` reruns that check over every question and refuses to run without the quarantine.

## Feedback loops

- `plan` reports **gaps**: archetypes without templates, and quotas the fact store can't fill. Fill them by running more `facts:packets` for that domain, or by adding seeds.
- A writer rejection with `rejectKind: "trivia"` blocks that fact for every template.
- Generated and rejected instance ids are never drafted again, so rerunning `plan → instantiate → write` tops the bank up to `--target`.

## Where data lives

- `data/pipeline/<cert>/`: committed and reviewable. The app never imports it.
- `pipeline/.work/`: gitignored cache (docs, chunks, non-private packets).
- Quarantine (`$SNREADY_QUARANTINE_DIR`, default `~/.snready/quarantine`): outside the repo. Holds samples, dumps, the observed corpus, classifications, and the classify/template packets, which contain question text.
  - Official samples go in `<cert>/samples/*.json`, MeasureUp exams in `<cert>/measureup/*.json`, dumps in `<cert>/dumps/*.json` (optional `<name>.meta.json` sidecar: vendor, url, purchasedAt, price, examVersion, notes). Format: `[{ "stem": "...", "options": ["..."], "correct": [0] | null, "domain"?: "..." }]`.

## Identity

`pipeline/lib/ids.ts`:

- `factId` = hash of (type, subject, relation, value).
- `instanceId` = `<templateId>.<hash(factId)>`.
- `familyKey` = templateId.
- `knowledgeKeys` = [factId].

Published questions carry `identity` (see `types/index.ts`), which sequencing uses to keep siblings apart.
