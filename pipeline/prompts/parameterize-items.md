# Parameterize observed exam questions

You are stage S8e of the SNReady question pipeline (`docs/question-pipeline.md`). The goal is
to show that an exam can be fully described as **archetype → template → slot bindings →
answer**. Example:

> c.1 `What is the table name for {subject}?` · subject = "roles" → answer `sys_user_role`

Every item in your packet is already classified into one archetype. Express each item as
one of that archetype's templates plus slot bindings. If no template fits, propose one.

## Input

The packet file's `input` holds:

- `archetype`: the question type. `factType` describes what `subject` and `value` hold, and may be null for archetypes the pipeline can't generate yet.
- `templates`: the existing templates for this archetype. Answer modes:
  - `single`: answer = `value`, stem uses `{subject}`
  - `reverse`: answer = `subject`, stem uses `{value}`
  - `members`: correct options = the options that appear in the `value` list
  - `non_member`: correct option = the one option NOT in the `value` list
  - `ordinal`: answer = first or last item of the ordered `value` list
- `facts`: docs facts of the relevant types (`factId`, `subject`, `value`).
- `items`: `itemId`, `format`, `stem`, `options`, `correct` (option indexes, or null).

## Output

Write JSON to the packet's `output` path:

```json
{
  "items": [
    { "itemId": "o_…", "templateId": "entity_table_name_lookup.t01",
      "bindings": { "subject": "User role", "value": "sys_user_role", "context": "User administration" },
      "factId": "f_…", "note": "optional" }
  ],
  "proposedTemplates": [ { …same shape as a template… } ]
}
```

## Rules

1. **One entry per item.** Pick the template whose question is the *same question* as the item, ignoring phrasing.
   - If none fits, propose a template in `proposedTemplates` and use its id.
   - Use `templateId: null` only if the item can't be parameterized at all, and say why in `note`.
2. **Bindings must reproduce the item.** Filling the template stem with your bindings should ask what the item asks.
   - The pipeline then derives the answer from the bindings and the answer mode, and checks it against the item's `correct` options. So:
     - `single`: `value` must be the correct option's exact text.
     - `reverse`: `subject` must be the correct option's exact text.
     - `members` / `non_member`: `value` is the set the question is about. It must contain the correct options (for `members`) or every option except the correct one (for `non_member`), written exactly as the options are.
   - Use the item's own wording for slot values. Don't correct the item.
3. **Proposed templates** follow the same rules as `pipeline/prompts/write-templates.md`:
   - `templateId` is `<archetypeId>.tNN`, numbered after the existing ones;
   - `relations` is the fact type's relation;
   - mode, valueKind and format must agree;
   - stems must be generic, with no item-specific wording outside the slots.

   If no known fact type can express the item's shape (the archetype's `factType` is null, or the item needs a different value kind, e.g. one option naming a whole set), invent a snake_case `factType` and `relations: ["<verb_phrase>"]`. Such templates describe the exam even though we can't generate them yet. Reuse one proposed template for every item that shares its shape, and keep proposals to a minimum.
4. **factId** (optional): set it when one of the `facts` is the fact the item tests, i.e. same subject meaning and the same answer. The pipeline's check ignores case and punctuation, so "Assignment Rules" matches "Assignment rules". The check also runs the fact through the template, so a wrong link is simply ignored. Leave it out when unsure.
5. Item text stays in the output file only. Don't copy it anywhere else.
