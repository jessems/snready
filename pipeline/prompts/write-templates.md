# Write parameterized question templates

You are stage S8b of the SNReady question pipeline (`docs/question-pipeline.md`). A template
turns one **fact** into a question. The fact fills the slots, and the pipeline computes the
correct answer and distractors deterministically from the fact store. Your job is the
*shape*: how the stem is phrased and which answer mode applies.

## Input

The packet file's `input` holds:

- `factTypes`: what each fact holds (`subject`, `value`, `valueKind`, `relation`) with an example.
- `answerModes`: how answers and distractors are derived for each mode.
- `archetypes`: question types, each with `examples` of observed questions. The examples show the shape only: **never copy their wording**.
- `existingTemplates`: keep these. Only add templates that are missing or clearly better.

## Output

Write JSON to the packet's `output` path:

```json
{ "templates": [ {
  "templateId": "role_permission_lookup.t01",
  "archetypeId": "role_permission_lookup",
  "factType": "role_permission",
  "relations": ["requires_role"],
  "format": "multiple_choice",
  "cognitiveLevel": "knowledge",
  "answer": { "mode": "single" },
  "stems": ["Which role is required to {subject}?", "A user needs to {subject}. Which role must they have?"],
  "optionCount": 4
} ] }
```

## Rules

1. Write 1–3 templates for every archetype whose `factType` matches a fact type in `factTypes`. Archetypes can only be generated through matching fact types. One exception: `identify_invalid_option` uses `component_membership` with mode `non_member`. Skip archetypes that no fact type can serve, such as release features.
2. `relations` is exactly `[<the factType's relation>]`.
3. Mode ↔ valueKind ↔ format must agree:
   - `single`: text → `multiple_choice`. Stems use `{subject}`; the answer is the value.
   - `reverse`: text → `multiple_choice`. Stems use `{value}` and never `{subject}`; the answer is the subject. Example: "Which feature lets you {value}?" or "Which concept is defined as: {value}?"
   - `members`: list → `multiple_select`, with `correctCount` 2 or 3
   - `non_member`: list → `multiple_choice_negative`
   - `ordinal`: ordered_list → `multiple_choice`, with `position` `first` or `last`
4. **Stems**: 1–3 phrasings per template, all asking exactly the same thing. They are cosmetic variants of one question. Each must contain its slot (`{subject}`, or `{value}` for `reverse`) and may contain `{context}` (product area; it may be missing, so the stem must still read well if `({context})` or `in {context}` is removed). Write stems so that *any* subject of that fact type reads naturally. Look at the factType's `subject` description: if subjects are actions ("Create and manage knowledge bases"), a stem like "Which role is required to {subject}?" needs a lowercase-tolerant phrasing.
5. The stem must never contain the answer. For text facts, consider both directions: `single` ("Which statement describes {subject}?") and `reverse` ("Which concept is described as: {value}?"). `scenario_tool_fit` subjects are needs, so `single` reads naturally: "An administrator needs to {subject}. Which feature should they use?"
6. `templateId` = `<archetypeId>.tNN`, numbered after existing templates.
7. `cognitiveLevel` per `QUESTION-STANDARDS.md`; scenario/navigation templates are usually `application`.
8. `optionCount` 4, or 5–6 for `members`.
