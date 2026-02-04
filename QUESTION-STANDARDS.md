# Question Format Standards

This document captures the design decisions for the question schema used across
snready and the question generation pipeline.

## Field Definitions

### `type` - Question Type

Uses **ServiceNow's official terminology** from exam format descriptions:

| Value | Meaning | ServiceNow Usage |
|-------|---------|------------------|
| `multiple_choice` | Single correct answer | "Multiple choice" in exam specs |
| `multiple_select` | Multiple correct answers | "Multiple select" in exam specs |

**Decision:** Match ServiceNow's exact terminology rather than generic "single/multiple".

### `cognitiveLevel` - Cognitive Classification

ServiceNow does **not** publicly use a cognitive framework. Based on analysis of
actual CSA exam questions, we use a 3-level system that matches observed patterns:

| Value | % of Real Questions | What It Tests | Example |
|-------|---------------------|---------------|---------|
| `knowledge` | ~40% | Fact recall, definitions | "What language is used for scripting?" |
| `understanding` | ~40% | Concept recognition, purpose | "What is the definition of transform maps?" |
| `application` | ~20% | Procedures, navigation, scenarios | "Where do you create notifications?" |

**Decision:** This is **our addition** for progressive learning, not a ServiceNow standard.
Classification is subjective; when uncertain, prefer lower levels.

### `explanation` - Answer Explanation

Structured format with per-wrong-answer feedback:

```json
{
  "correct": "Why the correct answer is right",
  "wrongAnswers": [
    { "choiceId": "a", "explanation": "Why A is wrong", "reference": "optional source" }
  ]
}
```

**Decision:** Richer than a single string to support learning, not just drilling.

### `source` - Content Origin

Tracks where each question was generated from:

- `source.course.url` - Link to Now Learning lesson (if from course)
- `source.documentation.url` - Link to docs.servicenow.com (if from docs)
- `source.path` - Local file path to source content
- `source.excerpt` - Key text that supports the question

**Decision:** Full traceability enables quality audits and content updates.

## References

- ServiceNow exam format: "Multiple choice and multiple select"
- Cognitive levels derived from analysis of actual CSA questions (ProcessExam.com samples)
- No official ServiceNow cognitive framework exists publicly
