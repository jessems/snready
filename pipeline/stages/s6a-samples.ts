// S6a Official sample questions. ServiceNow's exam blueprint KB articles end with a few
// "Sample Item #N" questions and answer keys. This stage parses them from the cached blueprint
// text (.question-pipeline/sources/<cert>/blueprint.md, first line = <!-- KB url -->) into:
//   <quarantine>/<cert>/samples/official.json   item text, the observed-corpus import format (S7)
//   data/pipeline/official-samples.json         public index: KB link, counts, practice exams (no text)
import fs from "node:fs";
import path from "node:path";
import { log, paths, writeJson } from "../lib/io";

export const BLUEPRINT_CACHE = path.join(paths.root, ".question-pipeline", "sources");
const PRACTICE_EXAM_KB = "KB0013408";
const kbUrl = (kb: string) => `https://learning.servicenow.com/kb?id=kb_article_view&sysparm_article=${kb}`;

export interface SampleItem {
  number: number;
  /** "matching" = match/order items (drag-and-drop style), which aren't multiple choice. */
  format: "multiple_choice" | "multiple_select" | "matching";
  stem: string;
  /** Matching items keep their raw text, since they don't fit stem + options. */
  raw?: string;
  options: string[];
  correct: number[] | null;
  chooseCount: number | null;
}

export interface SampleIndexEntry {
  cert: string;
  kb: string | null;
  url: string | null;
  updated: string | null;
  itemCount: number;
  keyedCount: number;
  multiSelectCount: number;
  matchingCount: number;
  warnings: string[];
  practiceExam: { provider: string; kb: string; url: string } | null;
}

const ITEM_HEADER = /^\s*Sample (?:Item|Question)\s*[–—-]?\s*#?\s*(\d+)\s*:?\s*$/i;
const ANSWER = /^\s*(?:Correct\s+)?Answers?\s*:?\s*([A-F](?:\s*[,&]\s*(?:and\s+)?[A-F]|\s+and\s+[A-F])*)\s*\.?\s*$/i;
const LETTERED = /^\s*([A-F])[.)]\s+(.+?)\s*$/;

/** Parse one "Sample Item" block. Options may be lettered ("A. …") or bare lines (CAD). */
export function parseSampleBlock(number: number, lines: string[]): { item: SampleItem; warnings: string[] } {
  const warnings: string[] = [];
  const body = lines
    .map((l) => l.replace(/\u00a0/g, " ").trim())
    .filter((l) => l && !/^Back to Top$/i.test(l)); // KB page navigation residue
  // Match/order items ("Correct Match", or several "Answer:" lines) aren't multiple choice.
  if (body.some((l) => /^Correct Match$/i.test(l)) || body.filter((l) => ANSWER.test(l)).length > 1) {
    const stemEnd = body.findIndex((l) => /\b(match|order)\b/i.test(l));
    return {
      item: { number, format: "matching", stem: body.slice(0, stemEnd + 1).join(" "), raw: body.join("\n"), options: [], correct: null, chooseCount: null },
      warnings: [`item ${number}: matching/ordering item (not multiple choice)`],
    };
  }
  const answerIdx = body.findIndex((l) => ANSWER.test(l));
  // "A, C, D, and F": drop the word "and" before collecting letters.
  const answerLetters = answerIdx >= 0 ? body[answerIdx].match(ANSWER)![1].replace(/\band\b/gi, " ").toUpperCase().match(/[A-F]/g)! : null;
  const content = answerIdx >= 0 ? body.slice(0, answerIdx) : body;

  let stem: string[] = [];
  let options: string[] = [];
  if (content.some((l) => LETTERED.test(l))) {
    const first = content.findIndex((l) => LETTERED.test(l));
    stem = content.slice(0, first);
    for (const line of content.slice(first)) {
      const m = line.match(LETTERED);
      if (m) options.push(m[2]);
      else if (options.length) options[options.length - 1] += " " + line; // wrapped option
    }
  } else {
    // Unlettered: the stem ends at the line containing the question mark (or "(choose …)").
    const end = content.findIndex((l) => /\?\s*$|\(choose/i.test(l));
    if (end < 0) warnings.push(`item ${number}: can't tell stem from options`);
    stem = content.slice(0, end + 1);
    options = content.slice(end + 1);
  }

  const stemText = stem.join(" ").replace(/\s+/g, " ").trim();
  const choose = stemText.match(/\(choose (two|three|four|2|3|4)\)/i)?.[1].toLowerCase();
  const chooseCount = choose ? ({ two: 2, three: 3, four: 4 } as Record<string, number>)[choose] ?? Number(choose) : null;
  const correct = answerLetters ? answerLetters.map((l) => l.charCodeAt(0) - 65) : null;

  if (!answerLetters) warnings.push(`item ${number}: no answer key`);
  if (options.length < 2) warnings.push(`item ${number}: ${options.length} options parsed`);
  if (correct?.some((i) => i >= options.length)) warnings.push(`item ${number}: answer outside options`);
  if (chooseCount && correct && correct.length !== chooseCount) warnings.push(`item ${number}: says choose ${chooseCount}, key has ${correct.length}`);

  const format = (correct?.length ?? 0) > 1 ? "multiple_select" : "multiple_choice";
  return { item: { number, format, stem: stemText, options: options.map((o) => o.replace(/\s+/g, " ").trim()), correct, chooseCount }, warnings };
}

export function parseBlueprintSamples(markdown: string): { items: SampleItem[]; warnings: string[] } {
  const lines = markdown.split("\n");
  const start = lines.findIndex((l) => /^\s*Sample Questions\s*$/i.test(l));
  if (start < 0) return { items: [], warnings: ["no 'Sample Questions' section"] };
  const items: SampleItem[] = [];
  const warnings: string[] = [];
  let current: { number: number; lines: string[] } | null = null;
  const flush = () => {
    if (!current) return;
    const parsed = parseSampleBlock(current.number, current.lines);
    items.push(parsed.item);
    warnings.push(...parsed.warnings);
  };
  for (const line of lines.slice(start + 1)) {
    const header = line.match(ITEM_HEADER);
    if (header) {
      flush();
      current = { number: Number(header[1]), lines: [] };
    } else if (current) current.lines.push(line);
  }
  flush();
  if (!items.length) warnings.push("sample section has no items");
  return { items, warnings };
}

export function blueprintCerts(): string[] {
  if (!fs.existsSync(BLUEPRINT_CACHE)) return [];
  return fs.readdirSync(BLUEPRINT_CACHE).filter((c) => fs.existsSync(path.join(BLUEPRINT_CACHE, c, "blueprint.md"))).sort();
}

export function runSamples(certArg: string): SampleIndexEntry[] {
  const certs = certArg === "all" ? blueprintCerts() : [certArg];
  const indexFile = path.join(paths.root, "data", "pipeline", "official-samples.json");
  const index = new Map<string, SampleIndexEntry>(
    (fs.existsSync(indexFile) ? (JSON.parse(fs.readFileSync(indexFile, "utf8")) as SampleIndexEntry[]) : []).map((e) => [e.cert, e])
  );

  for (const cert of certs) {
    const file = path.join(BLUEPRINT_CACHE, cert, "blueprint.md");
    if (!fs.existsSync(file)) {
      log("s6a", `${cert}: no cached blueprint at ${path.relative(paths.root, file)}`);
      continue;
    }
    const markdown = fs.readFileSync(file, "utf8");
    const kb = markdown.match(/sysparm_article=(KB\d+)/)?.[1] ?? null;
    const { items, warnings } = parseBlueprintSamples(markdown);
    // Observed-corpus import format; matching items can't be classified as multiple choice.
    writeJson(
      path.join(paths.quarantine, cert, "samples", "official.json"),
      items.filter((i) => i.format !== "matching").map((i) => ({ stem: i.stem, options: i.options, correct: i.correct, source: `${kb} sample item #${i.number}` }))
    );
    writeJson(path.join(paths.quarantine, cert, "official-samples-parsed.json"), { kb, items });
    index.set(cert, {
      cert,
      kb,
      url: kb ? kbUrl(kb) : null,
      updated: markdown.match(/^\s*Updated\s+(.+?)\s*$/m)?.[1] ?? null,
      itemCount: items.length,
      keyedCount: items.filter((i) => i.correct?.length).length,
      multiSelectCount: items.filter((i) => i.format === "multiple_select").length,
      matchingCount: items.filter((i) => i.format === "matching").length,
      warnings,
      practiceExam: markdown.includes(PRACTICE_EXAM_KB) ? { provider: "MeasureUp", kb: PRACTICE_EXAM_KB, url: kbUrl(PRACTICE_EXAM_KB) } : null,
    });
    log("s6a", `${cert}: ${items.length} sample items${warnings.length ? ` (${warnings.length} warnings: ${warnings.join("; ")})` : ""}`);
  }

  const list = [...index.values()].sort((a, b) => a.cert.localeCompare(b.cert));
  writeJson(indexFile, list);
  return list;
}
