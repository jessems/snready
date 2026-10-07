# Write final questions from drafts

You are stage S11 of the SNReady question pipeline (`docs/question-pipeline.md`). Each draft
was built mechanically from verified documentation facts: a template stem with the slot
filled in, plus options whose correctness comes from the fact store. Your job is to turn
it into a polished certification practice question, or reject it.

## Input

The packet file's `input.drafts` holds, for each draft:

- `stem`: the mechanically rendered stem. It may read awkwardly, e.g. capitalised mid-sentence, a clumsy slot fit, or a missing article.
- `options`: `{id, text, correct, source}`. `source` is the fact the option text came from, with its doc quote and URL.
- `fact`: the fact the question tests (`subject`, `value`, `quote`, `url`).
- `format`, `cognitiveLevel`.

## Output

Write JSON to the packet's `output` path, with one entry per draft:

```json
{ "questions": [ {
  "instanceId": "…",
  "verdict": "ok",
  "stem": "polished stem",
  "cognitiveLevel": "knowledge",
  "explanation": {
    "correct": "Why the correct answer is right, grounded in the fact's quote.",
    "wrongAnswers": [ { "choiceId": "b", "explanation": "Why b is wrong for this question." } ]
  }
} ] }
```

For a rejection: `{ "instanceId": "…", "verdict": "reject", "rejectKind": "…", "reason": "…" }`.
`rejectKind` is one of:
- `trivia`: the *fact* isn't exam-worthy. It will never be used again, so only use this when no question about this fact would be fair game.
- `ambiguous`: another option is arguably correct, or the stem is unclear.
- `giveaway`: the wording or the options make the answer obvious.
- `mismatch`: the options aren't the same kind of thing.
- `other`

## Rules

1. **You cannot change options or which ones are correct.** Only the stem, explanations and cognitive level are yours.
2. **Polish the stem without changing its meaning.** Fix grammar, casing and articles so it reads like a real exam item. Keep it to one or two sentences. Say "Which TWO…" / "Choose 3." when the format is `multiple_select` (count the correct options), and use "NOT" / "EXCEPT" in capitals for `multiple_choice_negative`. Never put the correct answer's text in the stem.
3. **Reject when the question is unfair.** Use reject when:
   - a "wrong" option is also correct or arguably correct (e.g. a distractor from another fact that also answers this subject);
   - the stem is ambiguous without information the candidate can't have;
   - the fact is trivia no exam would test;
   - the options are so mismatched in kind that the answer is obvious;
   - the question only makes sense with the doc page open.

   Rejecting is cheap. Publishing a wrong question is expensive.
4. **Explanations are grounded.** `correct` explains why using the fact's quote: paraphrase it, don't invent beyond it. For each wrong option, explain briefly why it doesn't fit this question, based on its own `source` when that helps ("X is what the docs describe for Y, not for Z"). One or two sentences each. Do not add URLs; the pipeline appends sources.
5. `wrongAnswers` covers exactly the options with `correct: false`.
6. Adjust `cognitiveLevel` only if the polished question clearly tests a different level (see `QUESTION-STANDARDS.md`).
