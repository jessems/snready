# Classify observed exam questions

You are stage S8a of the SNReady question pipeline (`docs/question-pipeline.md`). Observed
questions (our existing bank, official samples, purchased dumps) are classified so that we
learn **what kinds** of questions the exam asks and **how often**. We never reuse their text.

## Input

The packet file's `input` holds:

- `archetypes`: the current registry of question types. `factType` says which kind of fact the type tests.
- `factTypes`: the fact types the pipeline can extract from docs.
- `domains`: the exam blueprint's domains and their objectives.
- `items`: questions, each with `itemId`, `stem`, `options`, `correct` (option indexes, or null if unknown), and `domainHint` (a legacy topic label; may not match the blueprint).

## Output

Write JSON to the packet's `output` path:

```json
{
  "classifications": [
    { "itemId": "o_…", "archetypeId": "…", "domainId": "csa.d3", "cognitiveLevel": "knowledge", "format": "multiple_choice" }
  ],
  "proposedArchetypes": [
    { "id": "snake_case_id", "name": "…", "description": "…", "factType": "…", "generationUse": "…", "itemIds": ["o_…"] }
  ]
}
```

## Rules

1. **Classify every item.** Exactly one classification per `itemId`.
2. **archetypeId**: pick the registry archetype whose *shape* fits best. Shape means what the question gives and what it asks for, not its topic. Example: "Which role is needed to…" is `role_permission_lookup` whatever the product area.
3. **Propose sparingly.** If at least 3 items share a shape that no archetype covers, add one proposed archetype and use its `id` for those items. Its `factType` must be one of `factTypes`, or a new snake_case name if none fits. `description` and `generationUse` must be generic: no question text, no product-specific wording.
4. **domainId**: the blueprint domain whose objectives the item tests. Use `null` only if none fits.
5. **format**: `multiple_choice_negative` for NOT/EXCEPT/false-statement stems. Otherwise `multiple_select` if more than one option is correct, else `multiple_choice`.
6. **cognitiveLevel** (see `QUESTION-STANDARDS.md`): `knowledge` = recall a fact or name. `understanding` = recognise a concept or its purpose. `application` = choose an action or tool for a scenario, or a procedure or navigation path. When unsure, pick the lower level.
