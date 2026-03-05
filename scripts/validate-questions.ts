#!/usr/bin/env npx tsx
/**
 * Validates all question files against the canonical QuestionFile schema.
 * Run: npx tsx scripts/validate-questions.ts
 * 
 * Exit codes:
 *   0 - All files valid
 *   1 - Validation errors found
 */

import { promises as fs } from "fs";
import path from "path";

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  certification: string;
  topic: string;
  cognitiveLevel?: "knowledge" | "understanding" | "application";
  type: "multiple_choice" | "multi_select";
  question: string;
  options: QuestionOption[];
  correctAnswers: string[];
  explanation: {
    correct: string;
    wrongAnswers?: Array<{
      choiceId: string;
      explanation: string;
      reference?: string;
    }>;
  };
  isFree?: boolean;
  [key: string]: unknown;
}

interface QuestionFile {
  certification: string;
  topic: string;
  questions: Question[];
}

interface ValidationError {
  file: string;
  errors: string[];
}

function validateQuestionFile(filePath: string, data: unknown): string[] {
  const errors: string[] = [];

  // Must be an object
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    errors.push("File must be an object with { certification, topic, questions }");
    return errors;
  }

  const file = data as Record<string, unknown>;

  // Required top-level fields
  if (typeof file.certification !== "string" || !file.certification) {
    errors.push("Missing or invalid 'certification' field (required: string)");
  }
  if (typeof file.topic !== "string" || !file.topic) {
    errors.push("Missing or invalid 'topic' field (required: string)");
  }
  if (!Array.isArray(file.questions)) {
    errors.push("Missing or invalid 'questions' field (required: array)");
    return errors;
  }

  const questions = file.questions as unknown[];
  const expectedCert = file.certification as string;
  const expectedTopic = file.topic as string;

  // Validate each question
  questions.forEach((q, i) => {
    const prefix = `questions[${i}]`;
    
    if (typeof q !== "object" || q === null) {
      errors.push(`${prefix}: must be an object`);
      return;
    }

    const question = q as Record<string, unknown>;

    // Required fields
    if (typeof question.id !== "string" || !question.id) {
      errors.push(`${prefix}.id: required string`);
    }
    if (typeof question.certification !== "string") {
      errors.push(`${prefix}.certification: required string`);
    } else if (question.certification !== expectedCert) {
      errors.push(`${prefix}.certification: mismatch (expected '${expectedCert}', got '${question.certification}')`);
    }
    if (typeof question.topic !== "string") {
      errors.push(`${prefix}.topic: required string`);
    } else if (question.topic !== expectedTopic && !expectedTopic.startsWith("_")) {
      // Allow topic mismatch for special files like _free.json (contains samples from multiple topics)
      errors.push(`${prefix}.topic: mismatch (expected '${expectedTopic}', got '${question.topic}')`);
    }
    if (typeof question.question !== "string" || !question.question) {
      errors.push(`${prefix}.question: required string`);
    }
    const validTypes = [
      "multiple_choice",
      "multiple_select", 
      "multiple_choice_negative",
      "compound_true_false",
      "true_false_compound"
    ];
    if (!validTypes.includes(question.type as string)) {
      errors.push(`${prefix}.type: must be one of: ${validTypes.join(", ")}`);
    }

    // Options validation
    if (!Array.isArray(question.options)) {
      errors.push(`${prefix}.options: required array`);
    } else {
      const options = question.options as unknown[];
      if (options.length < 2) {
        errors.push(`${prefix}.options: must have at least 2 options`);
      }
      options.forEach((opt, j) => {
        if (typeof opt !== "object" || opt === null) {
          errors.push(`${prefix}.options[${j}]: must be an object`);
          return;
        }
        const option = opt as Record<string, unknown>;
        if (typeof option.id !== "string" || !option.id) {
          errors.push(`${prefix}.options[${j}].id: required string`);
        }
        if (typeof option.text !== "string" || !option.text) {
          errors.push(`${prefix}.options[${j}].text: required string`);
        }
      });
    }

    // Correct answers validation
    if (!Array.isArray(question.correctAnswers)) {
      errors.push(`${prefix}.correctAnswers: required array`);
    } else {
      const answers = question.correctAnswers as string[];
      if (answers.length === 0) {
        errors.push(`${prefix}.correctAnswers: must have at least 1 answer`);
      }
      // Verify answers reference valid option IDs
      if (Array.isArray(question.options)) {
        const optionIds = new Set((question.options as QuestionOption[]).map(o => o.id));
        answers.forEach(ans => {
          if (!optionIds.has(ans)) {
            errors.push(`${prefix}.correctAnswers: '${ans}' not found in options`);
          }
        });
      }
    }

    // Explanation validation
    if (typeof question.explanation !== "object" || question.explanation === null) {
      errors.push(`${prefix}.explanation: required object`);
    } else {
      const explanation = question.explanation as Record<string, unknown>;
      if (typeof explanation.correct !== "string" || !explanation.correct) {
        errors.push(`${prefix}.explanation.correct: required string`);
      }
    }
  });

  return errors;
}

async function main() {
  console.log("🔍 Validating question files...\n");

  const questionsDir = path.join(process.cwd(), "data", "questions");
  const certDirs = await fs.readdir(questionsDir);

  const validationErrors: ValidationError[] = [];
  let totalFiles = 0;
  let totalQuestions = 0;

  for (const cert of certDirs) {
    const certPath = path.join(questionsDir, cert);
    const stat = await fs.stat(certPath);

    if (!stat.isDirectory()) continue;
    if (cert.endsWith(".old")) continue;

    const files = await fs.readdir(certPath);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    for (const file of jsonFiles) {
      const filePath = path.join(certPath, file);
      totalFiles++;

      try {
        const content = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(content);
        const errors = validateQuestionFile(filePath, data);

        if (errors.length > 0) {
          validationErrors.push({ file: `${cert}/${file}`, errors });
          console.log(`❌ ${cert}/${file}`);
          errors.forEach(e => console.log(`   └─ ${e}`));
        } else {
          const questionCount = (data as QuestionFile).questions.length;
          totalQuestions += questionCount;
          console.log(`✅ ${cert}/${file} (${questionCount} questions)`);
        }
      } catch (err) {
        validationErrors.push({ file: `${cert}/${file}`, errors: [`Parse error: ${err}`] });
        console.log(`❌ ${cert}/${file}: Parse error`);
      }
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Files: ${totalFiles}`);
  console.log(`   Questions: ${totalQuestions}`);
  console.log(`   Errors: ${validationErrors.length}`);

  if (validationErrors.length > 0) {
    console.log(`\n❌ Validation failed with ${validationErrors.length} error(s)`);
    process.exit(1);
  } else {
    console.log(`\n✅ All files valid`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
