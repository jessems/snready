import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildPremiumNeedles,
  extractNeedle,
  loadPremiumAndFreeQuestions,
  scanBuildOutput,
  scanDirectoryForNeedles,
} from "@/scripts/premium-leaks";

const outDir = path.join(process.cwd(), "out");
const hasBuildOutput = fs.existsSync(path.join(outDir, "index.html"));
const tmpDirs: string[] = [];

function fixtureDir(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "snready-leak-fixture-"));
  tmpDirs.push(dir);
  for (const [file, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), content);
  }
  return dir;
}

afterEach(() => {
  for (const dir of tmpDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

describe("premium leak scanner", () => {
  it("extracts a plain-text snippet that survives HTML and JSON escaping", () => {
    expect(extractNeedle(`Why are the "current" objects NOT available in scheduled script executions?`))
      .toBe("objects NOT available in scheduled script executions");
    expect(extractNeedle("Too short")).toBeNull();
  });

  it("flags premium content in public files, including JSON-escaped RSC payloads and JS chunks", async () => {
    const { premium, free } = await loadPremiumAndFreeQuestions();
    const needles = buildPremiumNeedles(premium.slice(0, 50), free);
    const stemNeedle = needles.find((needle) => needle.field === "question")!;
    const explanationNeedle = needles.find((needle) => needle.field === "explanation.correct")!;
    const sample = premium.find((question) => question.id === stemNeedle.questionId)!;
    const explanationSample = premium.find((question) => question.id === explanationNeedle.questionId)!;
    const escapedStem = JSON.stringify(sample.question);
    const dir = fixtureDir({
      "index.html": "<html><body>Free content only</body></html>",
      "cad/practice-questions.txt": `self.__next_f.push([1,${JSON.stringify(escapedStem)}])`,
      "_next/static/chunks/abc.js": `var q={explanation:${JSON.stringify(explanationSample.explanation.correct)}}`,
      "admin/exports/cad.csv": sample.question,
    });

    const result = scanDirectoryForNeedles(dir, needles);
    expect(result.leaks.map((leak) => leak.file).sort()).toEqual(["_next/static/chunks/abc.js", "cad/practice-questions.txt"]);
    expect(result.protectedHits).toEqual(["admin/exports/cad.csv"]);
  });

  it("does not flag free questions", async () => {
    const { premium, free } = await loadPremiumAndFreeQuestions();
    const needles = buildPremiumNeedles(premium, free);
    const dir = fixtureDir({ "csa/practice-questions.html": free.map((question) => `${question.question} ${question.explanation.correct}`).join("\n") });
    expect(scanDirectoryForNeedles(dir, needles).leaks).toEqual([]);
  });

  it.skipIf(!hasBuildOutput)("finds no premium question content in the built static export (out/)", async () => {
    const result = await scanBuildOutput(outDir);
    expect(result.needleCount).toBeGreaterThan(1000);
    expect(result.leaks.map((leak) => leak.file)).toEqual([]);
  }, 120_000);
});
