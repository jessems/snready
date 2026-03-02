#!/usr/bin/env npx tsx
/**
 * Migrates all question files to the canonical QuestionFile format:
 * {
 *   "certification": "csa",
 *   "topic": "change-management",
 *   "questions": [...]
 * }
 *
 * Run: npx tsx scripts/migrate-question-format.ts
 * Dry run: npx tsx scripts/migrate-question-format.ts --dry-run
 */

import { promises as fs } from "fs";
import path from "path";

interface Question {
  id: string;
  certification: string;
  topic: string;
  [key: string]: unknown;
}

interface QuestionFile {
  certification: string;
  topic: string;
  questions: Question[];
}

const DRY_RUN = process.argv.includes("--dry-run");

async function migrateFile(filePath: string): Promise<{ status: "migrated" | "ok" | "error"; message: string }> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(content);

    // Check if already in canonical format
    if (
      typeof data === "object" &&
      !Array.isArray(data) &&
      data.certification &&
      data.topic &&
      Array.isArray(data.questions)
    ) {
      return { status: "ok", message: "Already in canonical format" };
    }

    // If it's an array, convert to canonical format
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return { status: "error", message: "Empty array, cannot infer metadata" };
      }

      // Extract certification and topic from first question
      const firstQuestion = data[0] as Question;
      if (!firstQuestion.certification || !firstQuestion.topic) {
        return { status: "error", message: "Questions missing certification/topic fields" };
      }

      const canonicalFormat: QuestionFile = {
        certification: firstQuestion.certification,
        topic: firstQuestion.topic,
        questions: data,
      };

      if (!DRY_RUN) {
        await fs.writeFile(filePath, JSON.stringify(canonicalFormat, null, 2) + "\n", "utf-8");
      }

      return { status: "migrated", message: `Converted ${data.length} questions from array` };
    }

    // If it's an object with questions but missing certification/topic at top level
    if (
      typeof data === "object" &&
      Array.isArray(data.questions) &&
      (!data.certification || !data.topic)
    ) {
      if (data.questions.length === 0) {
        return { status: "error", message: "Empty questions array, cannot infer metadata" };
      }

      // Extract certification and topic from first question
      const firstQuestion = data.questions[0] as Question;
      if (!firstQuestion.certification || !firstQuestion.topic) {
        return { status: "error", message: "Questions missing certification/topic fields" };
      }

      const canonicalFormat: QuestionFile = {
        certification: firstQuestion.certification,
        topic: firstQuestion.topic,
        questions: data.questions,
      };

      if (!DRY_RUN) {
        await fs.writeFile(filePath, JSON.stringify(canonicalFormat, null, 2) + "\n", "utf-8");
      }

      return { status: "migrated", message: `Added wrapper to ${data.questions.length} questions` };
    }

    return { status: "error", message: "Unknown format" };
  } catch (err) {
    return { status: "error", message: String(err) };
  }
}

async function main() {
  console.log(DRY_RUN ? "🔍 DRY RUN - No files will be modified\n" : "🔄 Migrating question files...\n");

  const questionsDir = path.join(process.cwd(), "data", "questions");
  const certDirs = await fs.readdir(questionsDir);

  let migrated = 0;
  let ok = 0;
  let errors = 0;

  for (const cert of certDirs) {
    const certPath = path.join(questionsDir, cert);
    const stat = await fs.stat(certPath);

    if (!stat.isDirectory()) continue;
    if (cert.endsWith(".old")) continue;

    const files = await fs.readdir(certPath);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    for (const file of jsonFiles) {
      const filePath = path.join(certPath, file);
      const result = await migrateFile(filePath);

      const icon = result.status === "migrated" ? "✅" : result.status === "ok" ? "⬜" : "❌";
      console.log(`${icon} ${cert}/${file}: ${result.message}`);

      if (result.status === "migrated") migrated++;
      else if (result.status === "ok") ok++;
      else errors++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Migrated: ${migrated}`);
  console.log(`   ⬜ Already OK: ${ok}`);
  console.log(`   ❌ Errors: ${errors}`);

  if (DRY_RUN && migrated > 0) {
    console.log(`\n💡 Run without --dry-run to apply changes`);
  }
}

main().catch(console.error);
