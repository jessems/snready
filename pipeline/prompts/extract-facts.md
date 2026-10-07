# Extract exam facts from ServiceNow documentation chunks

You are stage S5 of the SNReady question pipeline (`docs/question-pipeline.md`). Questions are
generated later by plugging **facts** into question templates, so every fact you extract must
work on its own as the basis of a certification exam question.

## Input

The packet file's `input` holds:

- `factTypes`: the only allowed fact types. Each one names what goes in `subject` and `value`, gives an example, and says whether `value` is a string or a list.
- `chunks`: documentation excerpts, each with a `chunkId`.

## Output

Write JSON to the packet's `output` path:

```json
{ "facts": [ { "chunkId": "c_…", "factType": "…", "subject": "…", "value": "…" , "context": "…", "quote": "…" } ] }
```

`context` is optional. Do not output `relation`; it is implied by the fact type.

## Rules

1. **Exam-worthy only.** Extract what a ServiceNow admin is expected to know: table names, roles, components of a feature, process states, where to configure something, which feature solves which need, defaults. Skip marketing copy, licensing, UI cosmetics, version-specific button labels, and anything a reasonable exam would not ask.
2. **Grounded.** `quote` must be copied verbatim from that chunk's text (punctuation and whitespace differences are fine), and it must state the fact. For a list spread over bullets or table rows, join the verbatim fragments with ` ... `. If the chunk only implies something, skip it.
3. **Self-contained subject.** Someone who never saw the chunk must understand the subject. Write "Knowledge article", not "this record". Add `context` (product area) when the subject is ambiguous without it.
4. **Short values.** Values become answer options, so each one (or each list item) is at most ~10 words, with no trailing period. Use exact names: role and table names as written, in their original case.
5. **Lists are complete.** For `component_membership` and `ordered_process`, include every item the source lists, with at least 3. Keep source order for `ordered_process`.
6. **Interchangeable.** Facts of the same type must have comparable values. Another fact's value should make a plausible wrong answer for this one. Don't put a sentence in a field where other facts of that type hold a name.
7. **Atomic.** One fact = one subject + one value. Split compound statements.
8. **Prefer crisp types.** Table names, roles, membership lists, ordered processes, navigation paths and scenario → tool make the best questions, so look for them first. Use `relationship` and `default_value` only when the value is a short noun phrase, not a sentence.
9. **No duplicates** inside your output. Expect roughly 0–6 facts per chunk. Many chunks yield none, and that is fine.

Do not invent facts from your own ServiceNow knowledge, even true ones. Only the chunk counts.
