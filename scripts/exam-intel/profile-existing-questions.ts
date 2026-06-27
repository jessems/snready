#!/usr/bin/env npx tsx
import fs from "node:fs";
import path from "node:path";

type QuestionOption = { id: string; text: string };
type Question = {
  id: string;
  certification: string;
  topic: string;
  type?: string;
  question: string;
  options?: QuestionOption[];
  correctAnswers?: string[];
  explanation?: { correct?: string };
  labels?: { tags?: string[]; subtopics?: string[]; domain?: string; domainSlug?: string };
};
type QuestionFile = { certification?: string; topic?: string; questions?: Question[] } | Question[];
type Artifact = { id: string; factType: string };
type Classification = {
  artifactId: string;
  factType: string;
  confidence: number;
  matchedSignals: string[];
};
type ClassifiedQuestion = {
  id: string;
  topic: string;
  questionType: string;
  artifactId: string;
  factType: string;
  confidence: number;
  matchedSignals: string[];
};
type DistributionRow = { id: string; count: number; percentage: number };
type Profile = {
  certification: string;
  generatedAt: string;
  source: "existing_snready_questions";
  observedItemCount: number;
  classifiedItemCount: number;
  classifiedPercentage: number;
  artifactDistribution: Array<DistributionRow & { artifactId: string }>;
  factTypeDistribution: Array<DistributionRow & { factType: string }>;
  topicDistribution: Array<DistributionRow & { topic: string }>;
  generationTargets: Record<string, number>;
  lowConfidenceExamples: ClassifiedQuestion[];
  unmatchedExamples: Array<{ id: string; topic: string }>;
  classifiedQuestions: ClassifiedQuestion[];
};

const root = process.cwd();
const registryPath = path.join(root, "data", "exam-intel", "artifacts", "servicenow-core-artifacts.json");
const profilesDir = path.join(root, "data", "exam-intel", "profiles");
const certFilter = process.argv.find((arg) => arg.startsWith("--cert="))?.split("=")[1];
const writeOutput = !process.argv.includes("--dry-run");
const ISO_NOW = process.env.SNREADY_EXAM_INTEL_GENERATED_AT ?? new Date().toISOString();

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8")) as { artifacts: Artifact[] };
const artifactsById = new Map(registry.artifacts.map((artifact) => [artifact.id, artifact]));

const rules: Array<{ artifactId: string; signals: Array<{ name: string; pattern: RegExp; weight: number }> }> = [
  { artifactId: "identify_invalid_option", signals: [
    { name: "negative-stem", pattern: /\b(not|except|least likely|cannot|invalid|incorrect|does not|isn't|aren't|false)\b/i, weight: 4 },
    { name: "negative-type", pattern: /multiple_choice_negative/i, weight: 3 },
  ] },
  { artifactId: "entity_table_name_lookup", signals: [
    { name: "table-name", pattern: /\b(table|class|record type|extends|sys_|cmdb_|sn_[a-z0-9_]+)\b/i, weight: 3 },
    { name: "table-question", pattern: /\bwhich\s+(?:table|class)|table\s+(?:stores|contains|backs)|stored\s+in\s+which\s+table\b/i, weight: 4 },
  ] },
  { artifactId: "role_permission_lookup", signals: [
    { name: "role-permission", pattern: /\b(role|permission|access|admin|administrator|security_admin|itil|approver|delegate|can view|can create|can edit)\b/i, weight: 3 },
    { name: "which-role", pattern: /\bwhich\s+role|what\s+role|requires\s+the\s+.*role\b/i, weight: 4 },
  ] },
  { artifactId: "configuration_order_sequence", signals: [
    { name: "sequence-language", pattern: /\b(first|next|before|after|order|sequence|step|phase|prerequisite|dependency|then|following)\b/i, weight: 3 },
    { name: "process-order", pattern: /\bwhat\s+is\s+the\s+(?:first|next)|which\s+step|in\s+what\s+order\b/i, weight: 4 },
  ] },
  { artifactId: "navigation_path_lookup", signals: [
    { name: "navigation", pattern: /\b(navigate|navigation|application navigator|module|menu|workspace|portal|breadcrumb|homepage|dashboard|list view|form view)\b/i, weight: 3 },
    { name: "where-find", pattern: /\bwhere\s+(?:do|can|would)|how\s+do\s+you\s+open|which\s+module\b/i, weight: 3 },
  ] },
  { artifactId: "default_value_lookup", signals: [
    { name: "default-value", pattern: /\b(default|out-of-the-box|baseline|initial|preconfigured|standard value|by default)\b/i, weight: 4 },
    { name: "numeric-setting", pattern: /\b\d+\s*(?:days?|hours?|minutes?|percent|%)\b/i, weight: 2 },
  ] },
  { artifactId: "release_feature_lookup", signals: [
    { name: "release", pattern: /\b(release|zurich|yokohama|xanadu|washington|vancouver|utah|tokyo|added|introduced|new feature|enhancement)\b/i, weight: 4 },
  ] },
  { artifactId: "property_behavior_lookup", signals: [
    { name: "property-setting", pattern: /\b(property|properties|system setting|setting|configuration option|enable|disable|toggle|behavior|controls how)\b/i, weight: 3 },
  ] },
  { artifactId: "concept_difference_lookup", signals: [
    { name: "difference", pattern: /\b(difference|different|compare|versus| vs\.? |distinguish|unlike|instead of|rather than)\b/i, weight: 4 },
  ] },
  { artifactId: "relationship_lookup", signals: [
    { name: "relationship", pattern: /\b(relationship|relates?|associated|linked|parent|child|dependency|depends on|connected|reference field|dot-walk)\b/i, weight: 3 },
  ] },
  { artifactId: "business_outcome_lookup", signals: [
    { name: "outcome-benefit", pattern: /\b(benefit|outcome|value|kpi|metric|goal|objective|improve|reduce|increase|ensure|why)\b/i, weight: 3 },
  ] },
  { artifactId: "scenario_best_tool", signals: [
    { name: "scenario-best", pattern: /\b(best|most appropriate|should use|recommend|scenario|wants to|needs to|requirement|use case|customer wants)\b/i, weight: 3 },
    { name: "application-level", pattern: /\b(application|tool|feature|method|workflow|flow|business rule|script include|ui policy|data policy)\b/i, weight: 1 },
  ] },
  { artifactId: "choose_valid_components", signals: [
    { name: "set-membership", pattern: /\b(which\s+(?:of\s+the\s+following|two|three)|select|components?|features?|states?|values?|included|contains|part of|valid)\b/i, weight: 2 },
    { name: "multi-select", pattern: /\bmultiple_select|select\s+\w+\s+answers?\b/i, weight: 3 },
  ] },
];

function normalizeQuestionFile(data: QuestionFile): Question[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.questions)) return data.questions;
  return [];
}

function questionText(question: Question): string {
  const options = question.options?.map((option) => option.text).join(" ") ?? "";
  const correct = question.explanation?.correct ?? "";
  const tags = [...(question.labels?.tags ?? []), ...(question.labels?.subtopics ?? []), question.labels?.domain ?? ""].join(" ");
  return [question.type ?? "", question.question, options, correct, tags].join("\n");
}

function classify(question: Question): Classification | null {
  const text = questionText(question);
  const scored = rules.map(({ artifactId, signals }) => {
    const matchedSignals: string[] = [];
    let score = 0;
    for (const signal of signals) {
      if (signal.pattern.test(text)) {
        matchedSignals.push(signal.name);
        score += signal.weight;
      }
    }
    return { artifactId, score, matchedSignals };
  }).filter((row) => row.score > 0);

  if (scored.length === 0) return null;
  scored.sort((a, b) => b.score - a.score || b.matchedSignals.length - a.matchedSignals.length);
  const top = scored[0];
  if (top.score < 2) return null;
  const artifact = artifactsById.get(top.artifactId);
  if (!artifact) throw new Error(`Rule references missing artifact ${top.artifactId}`);
  return {
    artifactId: top.artifactId,
    factType: artifact.factType,
    confidence: Math.min(0.95, 0.45 + top.score / 10),
    matchedSignals: top.matchedSignals,
  };
}

function percent(count: number, total: number): number {
  return total === 0 ? 0 : Number(((count / total) * 100).toFixed(1));
}

function distribution<T extends string>(counts: Map<T, number>, total: number): DistributionRow[] {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([id, count]) => ({ id, count, percentage: percent(count, total) }));
}

function generationTargets(artifactCounts: Map<string, number>, classifiedCount: number): Record<string, number> {
  const targets: Record<string, number> = {};
  for (const [artifactId, count] of [...artifactCounts.entries()].sort((a, b) => b[1] - a[1])) {
    targets[artifactId] = Math.max(5, Math.round(percent(count, classifiedCount)));
  }
  return targets;
}

function profileCert(cert: string): Profile {
  const certDir = path.join(root, "data", "questions", cert);
  const questions: Question[] = [];
  for (const file of fs.readdirSync(certDir).filter((name) => name.endsWith(".json")).sort()) {
    if (file.startsWith("_")) continue;
    const data = JSON.parse(fs.readFileSync(path.join(certDir, file), "utf8")) as QuestionFile;
    questions.push(...normalizeQuestionFile(data));
  }

  const artifactCounts = new Map<string, number>();
  const factCounts = new Map<string, number>();
  const topicCounts = new Map<string, number>();
  const classifiedQuestions: ClassifiedQuestion[] = [];
  const unmatchedExamples: Array<{ id: string; topic: string }> = [];

  for (const question of questions) {
    const classification = classify(question);
    if (!classification) {
      if (unmatchedExamples.length < 15) unmatchedExamples.push({ id: question.id, topic: question.topic });
      continue;
    }
    artifactCounts.set(classification.artifactId, (artifactCounts.get(classification.artifactId) ?? 0) + 1);
    factCounts.set(classification.factType, (factCounts.get(classification.factType) ?? 0) + 1);
    topicCounts.set(question.topic, (topicCounts.get(question.topic) ?? 0) + 1);
    classifiedQuestions.push({
      id: question.id,
      topic: question.topic,
      questionType: question.type ?? "unknown",
      ...classification,
    });
  }

  const artifactDistribution = distribution(artifactCounts, classifiedQuestions.length).map((row) => ({ ...row, artifactId: row.id }));
  const factTypeDistribution = distribution(factCounts, classifiedQuestions.length).map((row) => ({ ...row, factType: row.id }));
  const topicDistribution = distribution(topicCounts, classifiedQuestions.length).map((row) => ({ ...row, topic: row.id }));

  return {
    certification: cert,
    generatedAt: ISO_NOW,
    source: "existing_snready_questions",
    observedItemCount: questions.length,
    classifiedItemCount: classifiedQuestions.length,
    classifiedPercentage: percent(classifiedQuestions.length, questions.length),
    artifactDistribution,
    factTypeDistribution,
    topicDistribution,
    generationTargets: generationTargets(artifactCounts, classifiedQuestions.length),
    lowConfidenceExamples: classifiedQuestions.filter((row) => row.confidence < 0.7).slice(0, 15),
    unmatchedExamples,
    classifiedQuestions,
  };
}

function main() {
  const questionRoot = path.join(root, "data", "questions");
  const certs = fs.readdirSync(questionRoot)
    .filter((name) => fs.statSync(path.join(questionRoot, name)).isDirectory() && !name.endsWith(".old"))
    .filter((name) => !certFilter || name === certFilter)
    .sort();
  if (certs.length === 0) throw new Error(`No certifications found${certFilter ? ` for --cert=${certFilter}` : ""}`);
  if (writeOutput) fs.mkdirSync(profilesDir, { recursive: true });

  const profiles = certs.map(profileCert);
  for (const profile of profiles) {
    if (writeOutput) {
      fs.writeFileSync(path.join(profilesDir, `${profile.certification}-exam-profile.json`), `${JSON.stringify(profile, null, 2)}\n`);
    }
    const topArtifacts = profile.artifactDistribution.slice(0, 3).map((row) => `${row.artifactId}:${row.count}`).join(", ");
    console.log(`${profile.certification}: ${profile.classifiedItemCount}/${profile.observedItemCount} classified (${profile.classifiedPercentage}%). Top artifacts: ${topArtifacts}`);
  }
  const totalObserved = profiles.reduce((sum, profile) => sum + profile.observedItemCount, 0);
  const totalClassified = profiles.reduce((sum, profile) => sum + profile.classifiedItemCount, 0);
  console.log(`Exam-intel profiles ${writeOutput ? "written" : "checked"}: ${profiles.length} certs, ${totalClassified}/${totalObserved} classified (${percent(totalClassified, totalObserved)}%).`);
}

main();
