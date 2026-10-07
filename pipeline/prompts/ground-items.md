# Ground official exam items in the ServiceNow docs

You are stage S8f of the SNReady question pipeline (`docs/question-pipeline.md`). Each item is an
**official** exam question (a blueprint sample, MeasureUp, or a dump) that has already been
parameterized as template + bindings + answer. Find the **docs fact** that makes its answer
correct.

That fact is what the exam tests. We use it to write *new, differently structured* questions
about the same knowledge. We never republish the official item, so the fact must come from the
docs in the docs' own words, not from the item.

## Input

The packet file's `input.items` holds, for each item:

- `stem`, `options`, `answer`: the official item and its keyed answer.
- `template`, `bindings`: how the item was parameterized.
- `factTypeSpec`: the fact type to produce (what `subject` and `value` hold), with an example.
- `chunks`: docs excerpts ranked by relevance (`chunkId`, `pageTitle`, `heading`, `text`).

## Output

Write JSON to the packet's `output` path, with one entry per item:

```json
{ "items": [
  { "itemId": "o_…", "fact": { "chunkId": "c_…", "subject": "…", "value": "…", "context": "…", "quote": "…" }, "note": "optional" },
  { "itemId": "o_…", "fact": null, "note": "why no chunk supports it" }
] }
```

## Rules

1. **The docs decide.** `quote` must be copied verbatim from that chunk's text (for list facts, join fragments with ` ... `), and it must state the fact. If no chunk supports the item's answer, return `fact: null`. Never use the item itself or your own knowledge as the source.
2. **Same knowledge, docs wording.** The fact must make the item's answer correct.
   - Use the docs' names and phrasing for `subject` and `value`. Exact names (tables, roles, features) will usually match the item's answer anyway.
   - Definitions and descriptions may be worded differently from the item's option. That's expected and fine.
3. **Follow `factTypeSpec`.** Keep values short, since they become answer options (about 10 words at most, no trailing period). For list types, include every item the docs list.
4. **Self-contained subject.** It must make sense without the item. Add `context` (product area) when the subject is ambiguous.
5. Don't copy item text into `note`. Refer to items by `itemId` only.
