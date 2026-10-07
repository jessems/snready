// S13 Publish. generated.json is the staging area; `review` renders it for a human, and
// `publish` converts reviewed questions into the site's Question format.
//   publish needs data/pipeline/<cert>/topic-map.json: { "<domainId>": "<topic slug>" }
//   and only writes when --write is passed; otherwise it prints what would change.
import fs from "node:fs";
import path from "node:path";
import { publicQuestionId } from "../lib/ids";
import { closestOfficial, officialFingerprints, tooCloseToOfficial } from "../lib/official-guard";
import { certFile, log, paths, readJson, readJsonIfExists, writeJson } from "../lib/io";
import type { Blueprint, GeneratedQuestion } from "../lib/types";
import type { Question, QuestionFile } from "../../types";
import { sequenceQuestions } from "../../lib/question-sequencing";
import { loadGenerated } from "./s11-write";

export function toSiteQuestion(q: GeneratedQuestion, blueprint: Blueprint, topic: string, generatedAt: string): Question {
  const domain = blueprint.domains.find((d) => d.id === q.domainId);
  const docSlug = q.sourceUrl.replace(/^.*\/docs\/r\/[^/]+\//, "").replace(/\.html$/, "");
  return {
    id: publicQuestionId(q.cert, q.identity),
    certification: q.cert,
    topic,
    cognitiveLevel: q.cognitiveLevel,
    type: q.format,
    question: q.stem,
    options: q.options,
    correctAnswers: q.correctAnswers,
    explanation: q.explanation,
    references: [q.sourceUrl],
    isFree: false,
    source: {
      type: "documentation",
      documentation: { docSlug, section: "", url: q.sourceUrl },
      path: "",
      excerpt: q.quote,
    },
    labels: {
      certification: q.cert,
      domain: domain?.name ?? q.domainId,
      domainSlug: topic,
      domainPercentage: domain?.weight ?? 0,
      subtopics: [],
      tags: [],
    },
    meta: { generatedAt, version: "pipeline-1", release: q.release, reviewed: false },
    identity: {
      instanceId: q.identity.instanceId,
      familyKey: q.identity.familyKey,
      knowledgeKeys: q.identity.knowledgeKeys,
    },
  };
}

export function runReview(cert: string): string {
  const blueprint = readJson<Blueprint>(certFile(cert, "blueprint.json"));
  const questions = loadGenerated(cert);
  const lines = [`# ${cert.toUpperCase()} generated questions (${questions.length})`, ""];
  for (const domain of blueprint.domains) {
    const inDomain = questions.filter((q) => q.domainId === domain.id);
    if (!inDomain.length) continue;
    lines.push(`## ${domain.name} (${domain.weight}%) · ${inDomain.length}`, "");
    for (const q of inDomain) {
      lines.push(`### ${q.stem}`, "", `\`${q.identity.instanceId}\` · ${q.format} · ${q.cognitiveLevel}`, "");
      for (const o of q.options) lines.push(`- ${q.correctAnswers.includes(o.id) ? "**✓" : ""} ${o.id}) ${o.text}${q.correctAnswers.includes(o.id) ? "**" : ""}`);
      lines.push("", `> ${q.explanation.correct}`, "");
      for (const w of q.explanation.wrongAnswers) lines.push(`- _${w.choiceId}_: ${w.explanation}`);
      lines.push("");
    }
  }
  const file = certFile(cert, "review.md");
  fs.writeFileSync(file, lines.join("\n"));
  log("s13", `${cert}: review file → ${path.relative(paths.root, file)}`);
  return file;
}

export function runPublish(cert: string, write: boolean): void {
  const topicMapFile = certFile(cert, "topic-map.json");
  if (!fs.existsSync(topicMapFile)) {
    throw new Error(`Missing ${path.relative(paths.root, topicMapFile)}: map each blueprint domainId to a topic slug in data/topics/${cert}-topics.json`);
  }
  const topicMap = readJson<Record<string, string>>(topicMapFile);

  // Final gate: nothing that resembles an official item may reach data/questions.
  if (!fs.existsSync(paths.observed(cert))) {
    throw new Error(`Can't verify against official items: ${paths.observed(cert)} is missing. Publish from a machine with the quarantine.`);
  }
  const official = officialFingerprints(cert);
  const copies = loadGenerated(cert)
    .map((q) => ({ q, c: closestOfficial(q.stem, q.options.map((o) => o.text), official) }))
    .filter(({ c }) => tooCloseToOfficial(c));
  if (copies.length) {
    throw new Error(`Refusing to publish: ${copies.length} question(s) resemble official items: ${copies.map(({ q, c }) => `${q.identity.instanceId}≈${c!.itemId}`).join(", ")}`);
  }
  const blueprint = readJson<Blueprint>(certFile(cert, "blueprint.json"));
  const generatedAt = new Date().toISOString();
  const byTopic = new Map<string, Question[]>();
  for (const q of loadGenerated(cert)) {
    const topic = topicMap[q.domainId];
    if (!topic) throw new Error(`topic-map.json has no topic for ${q.domainId}`);
    byTopic.set(topic, [...(byTopic.get(topic) ?? []), toSiteQuestion(q, blueprint, topic, generatedAt)]);
  }
  for (const [topic, incoming] of byTopic) {
    const file = path.join(paths.questionsDir, cert, `${topic}.json`);
    const current = readJsonIfExists<QuestionFile>(file, { certification: cert, topic, questions: [] });
    const known = new Set(current.questions.map((q) => q.identity?.instanceId).filter(Boolean));
    // Topic pages show questions in file order, so space out siblings before appending.
    const fresh = sequenceQuestions(incoming.filter((q) => !known.has(q.identity!.instanceId)));
    log("s13", `${cert}/${topic}: ${fresh.length} new (${current.questions.length} existing)${write ? "" : " [dry run]"}`);
    if (write && fresh.length) writeJson(file, { ...current, questions: [...current.questions, ...fresh] });
  }
}
