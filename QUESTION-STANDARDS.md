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
  "correct": "Why the correct answer is right. See https://docs.servicenow.com/...",
  "wrongAnswers": [
    {
      "choiceId": "a",
      "explanation": "Why A is wrong",
      "reference": "https://docs.servicenow.com/bundle/[release]/page/..."
    }
  ]
}
```

**Decision:** Richer than a single string to support learning, not just drilling.

### Reference Requirements

**All explanations MUST include official ServiceNow documentation links.**

| Field | Requirement | Example |
|-------|-------------|---------|
| `explanation.correct` | Must end with or contain a docs.servicenow.com URL | `"...See https://docs.servicenow.com/bundle/xanadu-..."` |
| `wrongAnswers[].reference` | Required URL to official docs (not optional text) | `"https://docs.servicenow.com/bundle/xanadu-servicenow-platform/page/..."` |

**Acceptable URL patterns:**
- `https://docs.servicenow.com/bundle/[release]-[product]/page/...` (primary)
- `https://developer.servicenow.com/dev.do#!/...` (developer resources)
- `https://nowlearning.servicenow.com/...` (Now Learning courses)

**NOT acceptable:**
- Generic text references like "ITIL Problem Management"
- Missing references entirely
- Internal/proprietary URLs

**Fallback:** If an official reference absolutely cannot be found (extremely rare), use:
```json
"reference": "No official documentation available - based on platform behavior"
```

This ensures every explanation is verifiable against official ServiceNow sources.

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
