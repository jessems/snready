import fs from "node:fs";
import path from "node:path";

type JsonObject = Record<string, unknown>;
type Topic = { slug: string; name: string; questionCount: number; freeQuestionCount?: number };
type Question = { id: string; certification: string; topic: string; type: string; question: string; options: Array<{ id: string; text: string }>; correctAnswers: string[]; explanation?: { correct?: string }; source?: unknown; labels?: unknown; meta?: unknown };

const root = process.cwd();
const errors: string[] = [];
const warnings: string[] = [];
const questionIds = new Set<string>();
let totalQuestionRows = 0;
let certCount = 0;
function fail(message: string) { errors.push(message); }
function warn(message: string) { warnings.push(message); }
function isObject(value: unknown): value is JsonObject { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function readJson<T>(relativePath: string): T | null {
  try { return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8")) as T; }
  catch (error) { fail(`${relativePath}: ${(error as Error).message}`); return null; }
}
function assertQuestionShape(q: Question, file: string, idx: number, cert: string, topic: string) {
  totalQuestionRows += 1;
  const prefix = `${file} question[${idx}]`;
  if (!isNonEmptyString(q.id)) fail(`${prefix}: missing id`);
  else if (questionIds.has(q.id)) fail(`${prefix}: duplicate question id ${q.id}`); else questionIds.add(q.id);
  if (q.certification !== cert) fail(`${prefix} ${q.id}: certification ${q.certification} does not match ${cert}`);
  if (q.topic !== topic) fail(`${prefix} ${q.id}: topic ${q.topic} does not match ${topic}`);
  if (!isNonEmptyString(q.question)) fail(`${prefix} ${q.id}: missing question stem`);
  if (!Array.isArray(q.options) || q.options.length < 2) fail(`${prefix} ${q.id}: expected at least 2 options`);
  else {
    const optionIds = new Set<string>();
    for (const option of q.options) {
      if (!isNonEmptyString(option.id)) fail(`${prefix} ${q.id}: option missing id`);
      if (!isNonEmptyString(option.text)) fail(`${prefix} ${q.id}: option ${option.id} missing text`);
      if (optionIds.has(option.id)) fail(`${prefix} ${q.id}: duplicate option id ${option.id}`);
      optionIds.add(option.id);
    }
    if (!Array.isArray(q.correctAnswers) || q.correctAnswers.length === 0) fail(`${prefix} ${q.id}: missing correct answers`);
    else for (const answer of q.correctAnswers) if (!optionIds.has(answer)) fail(`${prefix} ${q.id}: correct answer ${answer} not found in options`);
  }
  if (!q.explanation?.correct) fail(`${prefix} ${q.id}: missing correct explanation`);
  if (!q.source) warn(`${prefix} ${q.id}: missing source`);
  if (!q.labels) warn(`${prefix} ${q.id}: missing labels`);
  if (!q.meta) warn(`${prefix} ${q.id}: missing meta`);
}
const certData = readJson<JsonObject | JsonObject[]>("data/certifications.json");
const certs = Array.isArray(certData) ? certData : Array.isArray(certData?.certifications) ? certData.certifications as JsonObject[] : [];
if (!Array.isArray(certs) || certs.length === 0) fail("data/certifications.json: expected non-empty certifications array");
for (const cert of certs) {
  if (!isObject(cert)) { fail("data/certifications.json: certification must be object"); continue; }
  if (!isNonEmptyString(cert.slug)) { fail("data/certifications.json: certification missing slug"); continue; }
  certCount += 1;
  const certSlug = cert.slug as string;
  if (!isNonEmptyString(cert.name)) fail(`data/certifications.json ${certSlug}: missing name`);
  if (!isNonEmptyString(cert.fullName)) fail(`data/certifications.json ${certSlug}: missing fullName`);
  const topicsPath = `data/topics/${certSlug}-topics.json`;
  if (!fs.existsSync(path.join(root, topicsPath))) { warn(`${topicsPath}: no topics file; cert may not be question-ready yet`); continue; }
  const topicsData = readJson<JsonObject | Topic[]>(topicsPath);
  const topics = Array.isArray(topicsData) ? topicsData : Array.isArray(topicsData?.topics) ? topicsData.topics as Topic[] : [];
  if (!Array.isArray(topics)) { fail(`${topicsPath}: expected array`); continue; }
  const topicSlugs = new Set<string>();
  for (const topic of topics) {
    const topicSlug = topic.slug as string;
    if (topicSlugs.has(topicSlug)) fail(`${topicsPath}: duplicate topic slug ${topicSlug}`);
    topicSlugs.add(topicSlug);
    if (!isNonEmptyString(topic.name)) fail(`${topicsPath} ${topicSlug}: missing topic name`);
    if (typeof topic.questionCount !== "number" || topic.questionCount < 0) fail(`${topicsPath} ${topicSlug}: invalid questionCount`);
    if (typeof topic.freeQuestionCount === "number" && topic.freeQuestionCount > topic.questionCount) fail(`${topicsPath} ${topicSlug}: freeQuestionCount exceeds questionCount`);
    const questionPath = `data/questions/${certSlug}/${topicSlug}.json`;
    if (!fs.existsSync(path.join(root, questionPath))) { fail(`${questionPath}: missing question file listed by topic`); continue; }
    const questionData = readJson<JsonObject | Question[]>(questionPath);
    const questions = Array.isArray(questionData) ? questionData : Array.isArray(questionData?.questions) ? questionData.questions as Question[] : [];
    if (!Array.isArray(questions)) { fail(`${questionPath}: expected array`); continue; }
    if (questions.length !== topic.questionCount) fail(`${questionPath}: ${questions.length} questions does not match topic questionCount ${topic.questionCount}`);
    questions.forEach((q, idx) => assertQuestionShape(q, questionPath, idx, certSlug, topicSlug));
  }
  const questionDir = path.join(root, "data/questions", certSlug);
  if (fs.existsSync(questionDir)) {
    for (const fileName of fs.readdirSync(questionDir).filter((name) => name.endsWith(".json"))) {
      const slug = fileName.replace(/\.json$/, "");
      if (slug.startsWith("_") || slug.startsWith("delta-")) continue;
      if (!topicSlugs.has(slug)) fail(`data/questions/${certSlug}/${fileName}: question file has no matching topic entry`);
    }
  }
}
if (warnings.length > 0) console.warn(`Data integrity warnings: ${warnings.length} non-fatal legacy/content warnings omitted from CI output.`);
if (errors.length > 0) { console.error(`Data integrity failed with ${errors.length} error(s):`); for (const e of errors) console.error(`- ${e}`); process.exit(1); }
console.log(`Data integrity passed: ${certCount} certifications, ${questionIds.size} unique questions validated (${totalQuestionRows} total question rows).`);
