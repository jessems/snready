/**
 * Detects premium (paid) question content in the static export.
 *
 * Premium questions must only be served by the /api/questions Pages Function after
 * an access check. Anything under out/ (except the admin-protected out/admin/) is
 * public, so no premium question stem, answer explanation, or long answer option
 * may appear there.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  getAllQuestionsForCertification,
  getCertificationSlugs,
  getFreeQuestionsForCertification,
} from "@/lib/data";
import type { Question } from "@/types";

const MIN_NEEDLE_LENGTH = 40;
const MAX_NEEDLE_LENGTH = 60;

// Paths that are served only after the admin session check in functions/admin/_middleware.ts.
const PROTECTED_PREFIXES = ["admin/"];

// Blog posts quote a handful of question stems (no options or answers) as examples of
// question formats. Stems are tolerated there; explanations/answers are still flagged.
const STEM_ALLOWED_PREFIXES = ["blog/"];

export interface PremiumNeedle {
  questionId: string;
  field: string;
  text: string;
}

export interface LeakScanResult {
  scannedFiles: number;
  needleCount: number;
  premiumQuestionCount: number;
  leaks: Array<{ file: string; needles: PremiumNeedle[] }>;
  protectedHits: string[];
}

/** Longest run of plain words (letters, digits, spaces); identical in HTML, JSON and JS strings. */
export function extractNeedle(text: string | undefined): string | null {
  if (!text) return null;
  const runs = text.match(/[A-Za-z0-9 ]+/g) || [];
  let best = "";
  for (const run of runs) {
    const trimmed = run.trim().replace(/ {2,}/g, " ");
    if (trimmed.length > best.length) best = trimmed;
  }
  if (best.length < MIN_NEEDLE_LENGTH) return null;
  return best.slice(0, MAX_NEEDLE_LENGTH).trim();
}

function questionTexts(question: Question): Array<{ field: string; text: string }> {
  const texts: Array<{ field: string; text: string }> = [
    { field: "question", text: question.question },
    { field: "explanation.correct", text: question.explanation?.correct || "" },
  ];
  for (const wrong of question.explanation?.wrongAnswers || []) {
    texts.push({ field: `explanation.wrongAnswers.${wrong.choiceId}`, text: wrong.explanation });
  }
  // Answer options are skipped: they are short, generic product names that also
  // appear in regular SEO copy. Stems and explanations identify a question uniquely.
  return texts;
}

/** Text that is legitimately public: free questions (incl. doc excerpts) plus extra SEO copy. */
export function buildPublicCorpus(free: Question[], extraText: string[] = []): string {
  return [
    ...free.flatMap((question) => [
      ...questionTexts(question).map(({ text }) => text),
      ...(question.options || []).map((option) => option.text),
      question.source?.excerpt || "",
    ]),
    ...extraText,
  ].join("\n");
}

/**
 * Builds search needles for premium questions, skipping any snippet that also
 * appears in public content (free questions, topic copy), since that is allowed.
 */
export function buildPremiumNeedles(premium: Question[], free: Question[], extraPublicText: string[] = []): PremiumNeedle[] {
  const freeCorpus = buildPublicCorpus(free, extraPublicText);

  const needles: PremiumNeedle[] = [];
  const seen = new Set<string>();
  for (const question of premium) {
    for (const { field, text } of questionTexts(question)) {
      const needle = extractNeedle(text);
      if (!needle || seen.has(needle) || freeCorpus.includes(needle)) continue;
      seen.add(needle);
      needles.push({ questionId: question.id, field, text: needle });
    }
  }
  return needles;
}

export async function loadPremiumAndFreeQuestions(): Promise<{ premium: Question[]; free: Question[] }> {
  const premium: Question[] = [];
  const free: Question[] = [];
  for (const slug of getCertificationSlugs()) {
    const all = await getAllQuestionsForCertification(slug);
    const freeQuestions = await getFreeQuestionsForCertification(slug);
    const freeIds = new Set(freeQuestions.map((question) => question.id));
    free.push(...freeQuestions);
    premium.push(...all.filter((question) => !freeIds.has(question.id)));
  }
  return { premium, free };
}

function listFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(full));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

/** Scans a directory with `grep -F` (Aho-Corasick) for any of the needles. */
export function scanDirectoryForNeedles(dir: string, needles: PremiumNeedle[]): LeakScanResult {
  const files = listFiles(dir);
  const result: LeakScanResult = {
    scannedFiles: files.length,
    needleCount: needles.length,
    premiumQuestionCount: new Set(needles.map((needle) => needle.questionId)).size,
    leaks: [],
    protectedHits: [],
  };
  if (needles.length === 0 || files.length === 0) return result;

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "snready-leaks-"));
  const patternFile = path.join(tmpDir, "needles.txt");
  fs.writeFileSync(patternFile, needles.map((needle) => needle.text).join("\n"), "utf8");

  try {
    // -r recursive, -F fixed strings, -o print matches, -a treat binary as text
    const grep = spawnSync("grep", ["-r", "-F", "-o", "-a", "-f", patternFile, dir], {
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
    });
    if (grep.status !== 0 && grep.status !== 1) {
      throw new Error(`grep failed (${grep.status}): ${grep.stderr}`);
    }

    const byText = new Map(needles.map((needle) => [needle.text, needle]));
    const hits = new Map<string, Map<string, PremiumNeedle>>();
    for (const line of grep.stdout.split("\n")) {
      if (!line) continue;
      const separator = line.indexOf(":");
      const file = path.relative(dir, line.slice(0, separator)).split(path.sep).join("/");
      const match = line.slice(separator + 1);
      const needle = byText.get(match) || needles.find((candidate) => candidate.text.startsWith(match) || match.includes(candidate.text));
      if (!needle) continue;
      if (!hits.has(file)) hits.set(file, new Map());
      hits.get(file)!.set(needle.text, needle);
    }

    for (const [file, fileHits] of Array.from(hits.entries()).sort(([a], [b]) => a.localeCompare(b))) {
      if (PROTECTED_PREFIXES.some((prefix) => file.startsWith(prefix))) {
        result.protectedHits.push(file);
        continue;
      }
      const stemAllowed = STEM_ALLOWED_PREFIXES.some((prefix) => file.startsWith(prefix));
      const leakedNeedles = Array.from(fileHits.values()).filter((needle) => !(stemAllowed && needle.field === "question"));
      if (leakedNeedles.length > 0) {
        result.leaks.push({ file, needles: leakedNeedles });
      }
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  return result;
}

function readTopicCopy(): string[] {
  const topicsDir = path.join(process.cwd(), "data", "topics");
  return fs
    .readdirSync(topicsDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => fs.readFileSync(path.join(topicsDir, file), "utf8"));
}

export async function scanBuildOutput(outDir: string = path.join(process.cwd(), "out")): Promise<LeakScanResult> {
  const { premium, free } = await loadPremiumAndFreeQuestions();
  const needles = buildPremiumNeedles(premium, free, readTopicCopy());
  return scanDirectoryForNeedles(outDir, needles);
}
