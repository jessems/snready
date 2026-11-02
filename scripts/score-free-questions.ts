// Scores the quality of the FREE practice questions (the ones rendered in indexable
// static HTML), per certification and overall.
//
// "Free" follows the same rules as lib/data.ts:
//   - every question of a free certification (lib/free-certs.ts, e.g. CSA)
//   - otherwise the first N questions of each topic file, N from
//     calculateFreeQuestionsDistribution (lib/free-questions.ts)
//   - every delta question (data/questions/{cert}/delta-*.json, FREE_DELTA policy)
//
// Usage:
//   npx tsx scripts/score-free-questions.ts [--certs csa,cad] [--json out.json]
//                                           [--no-network] [--details]
//
// Prints a readable summary; --json also writes the full result (per-question issues).
// Doc links are checked over the network with a short timeout unless --no-network is
// given or the network is unreachable, in which case the check is reported as skipped.

import fs from "node:fs";
import path from "node:path";
import { calculateFreeQuestionsDistribution } from "../lib/free-questions";
import { isFreeCertification } from "../lib/free-certs";
import { orderOptionsForQuestion } from "../lib/option-order";

interface Option {
  id: string;
  text: string;
}

interface WrongAnswer {
  choiceId: string;
  explanation?: string;
  reference?: string;
}

interface Question {
  id: string;
  type?: string;
  question: string;
  options: Option[];
  correctAnswers: string[];
  explanation?: string | { correct?: string; wrongAnswers?: WrongAnswer[] };
  references?: unknown[];
  source?: { documentation?: { url?: string } };
}

interface FreeQuestion {
  cert: string;
  file: string;
  delta: boolean;
  q: Question;
}

const ROOT = path.resolve(__dirname, "..");
const QUESTIONS_DIR = path.join(ROOT, "data/questions");
const TOPICS_DIR = path.join(ROOT, "data/topics");

const args = process.argv.slice(2);
const argValue = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const certFilter = argValue("--certs")?.split(",").map((s) => s.trim().toLowerCase());
const jsonOut = argValue("--json");
const noNetwork = args.includes("--no-network");
const showDetails = args.includes("--details");

// ---------- loading ----------

function readQuestions(file: string): Question[] {
  return (JSON.parse(fs.readFileSync(file, "utf8")).questions ?? []) as Question[];
}

function loadCert(cert: string): { free: FreeQuestion[]; all: Question[] } {
  const topicsFile = path.join(TOPICS_DIR, `${cert}-topics.json`);
  const topics: { slug: string; questionCount: number }[] = JSON.parse(fs.readFileSync(topicsFile, "utf8")).topics;
  const distribution = calculateFreeQuestionsDistribution(topics);
  const free: FreeQuestion[] = [];
  const all: Question[] = [];
  for (const topic of topics) {
    const file = path.join(QUESTIONS_DIR, cert, `${topic.slug}.json`);
    if (!fs.existsSync(file)) continue;
    const questions = readQuestions(file);
    all.push(...questions);
    const n = isFreeCertification(cert) ? questions.length : distribution.get(topic.slug) ?? 0;
    for (const q of questions.slice(0, n)) free.push({ cert, file: path.relative(ROOT, file), delta: false, q });
  }
  const certDir = path.join(QUESTIONS_DIR, cert);
  for (const name of fs.readdirSync(certDir).filter((f) => /^delta-.*\.json$/.test(f)).sort()) {
    const file = path.join(certDir, name);
    const questions = readQuestions(file);
    all.push(...questions);
    for (const q of questions) free.push({ cert, file: path.relative(ROOT, file), delta: true, q });
  }
  return { free, all };
}

// ---------- helpers ----------

const URL_PATTERN = /https?:\/\/[^\s<>"')\]]+/g;
const stripUrls = (s: string) => s.replace(URL_PATTERN, "").replace(/\bSee:?\s*$/i, "").trim();

function correctText(q: Question): string {
  if (!q.explanation) return "";
  return typeof q.explanation === "string" ? q.explanation : q.explanation.correct ?? "";
}

function wrongAnswers(q: Question): WrongAnswer[] {
  return typeof q.explanation === "object" && q.explanation ? q.explanation.wrongAnswers ?? [] : [];
}

function questionUrls(q: Question): string[] {
  const urls = new Set<string>();
  const add = (s: unknown) => {
    if (typeof s !== "string") return;
    for (const m of s.matchAll(URL_PATTERN)) urls.add(m[0].replace(/[.,;:]+$/, ""));
  };
  add(correctText(q));
  for (const w of wrongAnswers(q)) add(w.reference);
  for (const r of q.references ?? []) {
    if (typeof r === "string") add(r);
    else if (r && typeof r === "object") add((r as { url?: string }).url);
  }
  add(q.source?.documentation?.url);
  return [...urls];
}

function isDocsUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (u.protocol !== "https:") return false;
    if (host === "docs.servicenow.com") return u.pathname.length > 1;
    if (host === "servicenow.com") return u.pathname.startsWith("/docs/") && u.pathname.length > "/docs/".length;
    return false;
  } catch {
    return false;
  }
}

function wellFormed(url: string): boolean {
  try {
    const u = new URL(url);
    return (u.protocol === "https:" || u.protocol === "http:") && /\.servicenow\.com$|^servicenow\.com$/.test(u.hostname);
  } catch {
    return false;
  }
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const STOP = new Set(["the", "a", "an", "of", "to", "in", "is", "what", "which", "for", "and", "or", "on", "be", "does", "do", "that", "with", "by", "are", "can", "this"]);
const tokens = (s: string) => new Set(normalize(s).split(" ").filter((t) => t && !STOP.has(t)));
function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
}

const ABSOLUTE = /\b(always|never|only|all)\b/i;

// A stem counts as a scenario when it puts an actor in a situation ("An administrator
// needs to…", "A user reports…", "After upgrading…") rather than asking for a definition.
const SCENARIO = [
  /\b(a|an|the|your)\s+(\w+\s+){0,3}(user|administrator|admin|developer|manager|agent|analyst|team|company|organi[sz]ation|customer|employee|technician|engineer|consultant|owner|lead|requester|caller|approver|member|director|architect)s?\b[^.?]*\b(needs?|wants?|must|is|are|has|have|reports?|asks?|notices?|creates?|configures?|tries|tried|submits?|opens?|receives?|sees?|wrote|writes?|added|adds?|changed|changes?|cannot|can't|would like)\b/i,
  /\byou (are|have|need|want|notice|must)\b/i,
  /\b(after|while|during|when)\b[^?]{15,},/i,
  /\bscenario\b/i,
];
const isScenario = (stem: string) => SCENARIO.some((r) => r.test(stem));

// ---------- per-question scoring ----------

interface QuestionIssues {
  id: string;
  cert: string;
  file: string;
  delta: boolean;
  single: boolean;
  storedLetter?: string;
  renderedLetter?: string;
  longestCorrect: boolean;
  absoluteOptions: string[]; // option ids containing absolute words
  absoluteInCorrect: boolean;
  lengthRatio: number;
  nonParallel: boolean;
  thinExplanation: boolean;
  wrongOptionsUnexplained: string[];
  recallOnly: boolean;
  missingDocLink: boolean;
  urls: string[];
  malformedUrls: string[];
  issueCount: number;
}

function scoreQuestion(fq: FreeQuestion): QuestionIssues {
  const { q } = fq;
  const correct = new Set(q.correctAnswers ?? []);
  const single = correct.size === 1 && q.type !== "multiple_select";
  const lengths = q.options.map((o) => o.text.trim().length);
  const maxLen = Math.max(...lengths);
  const minLen = Math.max(1, Math.min(...lengths));
  let storedLetter: string | undefined;
  let renderedLetter: string | undefined;
  let longestCorrect = false;
  if (single) {
    const id = [...correct][0];
    const si = q.options.findIndex((o) => o.id === id);
    storedLetter = String.fromCharCode(65 + si);
    const ri = orderOptionsForQuestion(q.id, q.options).findIndex((o) => o.id === id);
    renderedLetter = String.fromCharCode(65 + ri);
    const correctLen = q.options[si]?.text.trim().length ?? 0;
    longestCorrect = correctLen === maxLen && lengths.filter((l) => l === maxLen).length === 1;
  }
  const absoluteOptions = q.options.filter((o) => ABSOLUTE.test(o.text)).map((o) => o.id);
  const explained = new Set(
    wrongAnswers(q)
      .filter((w) => (w.explanation ?? "").trim().length >= 25)
      .map((w) => w.choiceId)
  );
  const wrongOptionsUnexplained = q.options.filter((o) => !correct.has(o.id) && !explained.has(o.id)).map((o) => o.id);
  const thinExplanation = stripUrls(correctText(q)).length < 120 || wrongOptionsUnexplained.length > 0;
  const urls = questionUrls(q);
  const issues: QuestionIssues = {
    id: q.id,
    cert: fq.cert,
    file: fq.file,
    delta: fq.delta,
    single,
    storedLetter,
    renderedLetter,
    longestCorrect,
    absoluteOptions,
    absoluteInCorrect: absoluteOptions.some((id) => correct.has(id)),
    lengthRatio: Math.round((maxLen / minLen) * 100) / 100,
    nonParallel: maxLen / minLen > 2,
    thinExplanation,
    wrongOptionsUnexplained,
    recallOnly: !isScenario(q.question),
    missingDocLink: !urls.some(isDocsUrl),
    urls,
    malformedUrls: urls.filter((u) => !wellFormed(u)),
    issueCount: 0,
  };
  issues.issueCount =
    Number(issues.longestCorrect) * 2 +
    Number(issues.absoluteOptions.length > 0) +
    Number(issues.nonParallel) +
    Number(issues.thinExplanation) * 2 +
    Number(issues.recallOnly) +
    Number(issues.missingDocLink) * 2 +
    Number(issues.malformedUrls.length > 0);
  return issues;
}

// ---------- duplicates ----------

interface DuplicatePair {
  a: string;
  b: string;
  jaccard: number;
  exact: boolean;
  bothFree: boolean;
}

function findDuplicates(free: FreeQuestion[], all: Question[]): DuplicatePair[] {
  const freeIds = new Set(free.map((f) => f.q.id));
  const pool = all.map((q) => ({ q, tok: tokens(q.question), norm: normalize(q.question) }));
  const pairs: DuplicatePair[] = [];
  for (let i = 0; i < pool.length; i++) {
    for (let j = i + 1; j < pool.length; j++) {
      const a = pool[i];
      const b = pool[j];
      if (!freeIds.has(a.q.id) && !freeIds.has(b.q.id)) continue;
      const exact = a.norm === b.norm;
      const jac = exact ? 1 : jaccard(a.tok, b.tok);
      if (exact || jac >= 0.8) {
        pairs.push({ a: a.q.id, b: b.q.id, jaccard: Math.round(jac * 100) / 100, exact, bothFree: freeIds.has(a.q.id) && freeIds.has(b.q.id) });
      }
    }
  }
  return pairs;
}

// ---------- link checks ----------

type LinkStatus = { url: string; status: number | "error" | "skipped"; finalUrl?: string; ok: boolean | null; note?: string };

async function checkUrl(url: string): Promise<LinkStatus> {
  // The docs site is a JS app; it serves the real page (or a real 404) to crawlers.
  const headers = { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" };
  for (const method of ["HEAD", "GET"]) {
    try {
      const res = await fetch(url, { method, redirect: "follow", headers, signal: AbortSignal.timeout(12000) });
      if (method === "HEAD" && (res.status === 405 || res.status === 403)) continue;
      const finalUrl = res.url;
      let ok = res.ok;
      let note: string | undefined;
      // Old docs.servicenow.com/bundle URLs that no longer resolve land on the docs home page.
      if (ok && /servicenow\.com\/docs\/?(\?.*)?$/.test(finalUrl) && !/servicenow\.com\/docs\/?$/.test(url)) {
        ok = false;
        note = "redirects to docs home (topic not found)";
      }
      return { url, status: res.status, finalUrl, ok, note };
    } catch (error) {
      if (method === "GET") return { url, status: "error", ok: false, note: String((error as Error).message ?? error) };
    }
  }
  return { url, status: "error", ok: false };
}

async function networkAvailable(): Promise<boolean> {
  try {
    await fetch("https://www.servicenow.com/docs/", { method: "HEAD", signal: AbortSignal.timeout(8000) });
    return true;
  } catch {
    return false;
  }
}

async function checkLinks(urls: string[]): Promise<{ mode: "checked" | "skipped"; results: Map<string, LinkStatus> }> {
  const results = new Map<string, LinkStatus>();
  if (noNetwork || !(await networkAvailable())) {
    for (const url of urls) results.set(url, { url, status: "skipped", ok: null });
    return { mode: "skipped", results };
  }
  const queue = [...urls];
  const workers = Array.from({ length: 8 }, async () => {
    while (queue.length) {
      const url = queue.shift()!;
      results.set(url, await checkUrl(url));
    }
  });
  await Promise.all(workers);
  return { mode: "checked", results };
}

// ---------- aggregation ----------

const pct = (n: number, d: number) => (d === 0 ? 0 : Math.round((n / d) * 1000) / 10);

function aggregate(items: QuestionIssues[], duplicates: DuplicatePair[]) {
  const single = items.filter((i) => i.single);
  const dist = (key: "storedLetter" | "renderedLetter") => {
    const counts: Record<string, number> = {};
    for (const i of single) counts[i[key]!] = (counts[i[key]!] ?? 0) + 1;
    return Object.fromEntries(Object.keys(counts).sort().map((k) => [k, { count: counts[k], pct: pct(counts[k], single.length) }]));
  };
  return {
    freeQuestions: items.length,
    singleAnswer: single.length,
    storedLetterDistribution: dist("storedLetter"),
    renderedLetterDistribution: dist("renderedLetter"),
    longestCorrect: { count: single.filter((i) => i.longestCorrect).length, pct: pct(single.filter((i) => i.longestCorrect).length, single.length) },
    exactDuplicatePairs: duplicates.filter((d) => d.exact).length,
    nearDuplicatePairs: duplicates.filter((d) => !d.exact).length,
    absoluteWordQuestions: { count: items.filter((i) => i.absoluteOptions.length).length, pct: pct(items.filter((i) => i.absoluteOptions.length).length, items.length) },
    absoluteWordInCorrect: items.filter((i) => i.absoluteInCorrect).length,
    nonParallel: { count: items.filter((i) => i.nonParallel).length, pct: pct(items.filter((i) => i.nonParallel).length, items.length) },
    thinExplanation: { count: items.filter((i) => i.thinExplanation).length, pct: pct(items.filter((i) => i.thinExplanation).length, items.length) },
    recallOnly: { count: items.filter((i) => i.recallOnly).length, pct: pct(items.filter((i) => i.recallOnly).length, items.length) },
    missingDocLink: { count: items.filter((i) => i.missingDocLink).length, pct: pct(items.filter((i) => i.missingDocLink).length, items.length) },
    malformedUrlQuestions: items.filter((i) => i.malformedUrls.length).length,
  };
}

function formatDist(d: Record<string, { count: number; pct: number }>): string {
  return Object.entries(d).map(([k, v]) => `${k} ${v.pct}% (${v.count})`).join("  ");
}

async function main() {
  const certs = fs
    .readdirSync(TOPICS_DIR)
    .filter((f) => f.endsWith("-topics.json"))
    .map((f) => f.replace(/-topics\.json$/, ""))
    .filter((c) => fs.existsSync(path.join(QUESTIONS_DIR, c)))
    .filter((c) => !certFilter || certFilter.includes(c))
    .sort();

  const perCert: Record<string, { items: QuestionIssues[]; duplicates: DuplicatePair[] }> = {};
  for (const cert of certs) {
    const { free, all } = loadCert(cert);
    perCert[cert] = { items: free.map(scoreQuestion), duplicates: findDuplicates(free, all) };
  }

  const allItems = Object.values(perCert).flatMap((c) => c.items);
  const allUrls = [...new Set(allItems.flatMap((i) => i.urls))].sort();
  const links = await checkLinks(allUrls);
  const brokenUrls = [...links.results.values()].filter((r) => r.ok === false);
  const brokenSet = new Set(brokenUrls.map((r) => r.url));

  const certSummaries = Object.fromEntries(
    Object.entries(perCert).map(([cert, { items, duplicates }]) => [
      cert,
      {
        ...aggregate(items, duplicates),
        brokenLinkQuestions: links.mode === "skipped" ? "skipped" : items.filter((i) => i.urls.some((u) => brokenSet.has(u))).length,
      },
    ])
  );
  const allDuplicates = Object.values(perCert).flatMap((c) => c.duplicates);
  const overall = {
    ...aggregate(allItems, allDuplicates),
    brokenLinkQuestions: links.mode === "skipped" ? "skipped" : allItems.filter((i) => i.urls.some((u) => brokenSet.has(u))).length,
  };

  const result = {
    generatedAt: new Date().toISOString(),
    linkCheck: { mode: links.mode, uniqueUrls: allUrls.length, broken: brokenUrls },
    overall,
    certs: certSummaries,
    duplicates: allDuplicates,
    questions: allItems,
  };
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(result, null, 2) + "\n");

  // ---------- readable summary ----------
  const lines: string[] = [];
  lines.push(`Free-question quality score (${result.generatedAt})`);
  lines.push(`Scope: free questions as rendered in static HTML (free certs: all; others: per-topic free slice; plus all delta questions)`);
  lines.push(`Link check: ${links.mode}${links.mode === "checked" ? ` (${allUrls.length} unique URLs, ${brokenUrls.length} broken)` : " (no network)"}`);
  lines.push("");
  const row = (name: string, s: ReturnType<typeof aggregate> & { brokenLinkQuestions: number | string }) => {
    lines.push(`== ${name} ==  free questions: ${s.freeQuestions} (single-answer: ${s.singleAnswer})`);
    lines.push(`  correct letter as stored:   ${formatDist(s.storedLetterDistribution)}`);
    lines.push(`  correct letter as rendered: ${formatDist(s.renderedLetterDistribution)}`);
    lines.push(`  longest option is correct:  ${s.longestCorrect.pct}% (${s.longestCorrect.count})`);
    lines.push(`  duplicate stem pairs:       exact ${s.exactDuplicatePairs}, near (Jaccard >= 0.8) ${s.nearDuplicatePairs}`);
    lines.push(`  absolute words in options:  ${s.absoluteWordQuestions.pct}% (${s.absoluteWordQuestions.count}; in correct option: ${s.absoluteWordInCorrect})`);
    lines.push(`  non-parallel options (>2x): ${s.nonParallel.pct}% (${s.nonParallel.count})`);
    lines.push(`  thin explanation:           ${s.thinExplanation.pct}% (${s.thinExplanation.count})`);
    lines.push(`  recall-only stem:           ${s.recallOnly.pct}% (${s.recallOnly.count})`);
    lines.push(`  missing docs link:          ${s.missingDocLink.pct}% (${s.missingDocLink.count})`);
    lines.push(`  malformed URL questions:    ${s.malformedUrlQuestions}`);
    lines.push(`  questions with broken link: ${s.brokenLinkQuestions}`);
    lines.push("");
  };
  row("OVERALL", overall);
  for (const [cert, s] of Object.entries(certSummaries)) row(cert.toUpperCase(), s);

  if (allDuplicates.length) {
    lines.push("Duplicate stem pairs (at least one side free):");
    for (const d of allDuplicates) lines.push(`  ${d.exact ? "EXACT" : `J=${d.jaccard.toFixed(2)}`}  ${d.a}  ~  ${d.b}${d.bothFree ? "" : "  (one side premium)"}`);
    lines.push("");
  }
  if (brokenUrls.length) {
    lines.push("Broken doc links:");
    for (const b of brokenUrls) lines.push(`  ${b.status}  ${b.url}${b.note ? `  (${b.note})` : ""}`);
    lines.push("");
  }
  if (showDetails) {
    lines.push("Worst questions (by weighted issue count):");
    for (const i of [...allItems].sort((a, b) => b.issueCount - a.issueCount).slice(0, 60)) {
      const flags = [
        i.longestCorrect && "longest-correct",
        i.absoluteOptions.length && "absolute",
        i.nonParallel && `ratio ${i.lengthRatio}`,
        i.thinExplanation && "thin-expl",
        i.recallOnly && "recall",
        i.missingDocLink && "no-doc-link",
      ].filter(Boolean);
      lines.push(`  ${i.issueCount}  ${i.id}  ${flags.join(", ")}`);
    }
  }
  console.log(lines.join("\n"));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
