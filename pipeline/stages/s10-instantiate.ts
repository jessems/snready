// S10 Instantiate: (template, fact) → draft with deterministic stem, answer and distractors.
// Everything here is reproducible from the instanceId seed; the writer agent (S11) only
// polishes wording and writes explanations, it never changes which options are correct.
import { identityFor, instanceIdFor } from "../lib/ids";
import { blockedPairs } from "../lib/official-guard";
import { certFile, log, readJson, readJsonIfExists, writeJson } from "../lib/io";
import { normalize, seededRandom, shuffled } from "../lib/text";
import type { DerivedFrom, Draft, Fact, GeneratedQuestion, GenerationPlan, Identity, Template } from "../lib/types";
import { loadTemplates } from "./s8b-templates";

const OPTION_IDS = ["a", "b", "c", "d", "e", "f"];

export function renderStem(stem: string, fact: Fact): string {
  let out = stem.replace(/\{subject\}/g, fact.subject);
  if (typeof fact.value === "string") out = out.replace(/\{value\}/g, fact.value);
  if (fact.context) out = out.replace(/\{context\}/g, fact.context);
  else out = out.replace(/\s*\(\{context\}\)/g, "").replace(/,?\s+(?:in|for|within)\s+\{context\}/g, "").replace(/\{context\}/g, "");
  return out.replace(/\s+/g, " ").trim();
}

type Option = { text: string; correct: boolean; factId: string | null };

/** Docs directory of a page, e.g. "platform-security/access-control": a proxy for product area. */
export function docArea(url: string): string {
  return url.replace(/^.*\/docs\/r\/[^/]+\//, "").split("/").slice(0, -1).join("/");
}

/** Rough value shape, so a number isn't offered next to a sentence. */
export function valueShape(text: string): "numeric" | "identifier" | "name" | "phrase" {
  if (/^[\d.,:%\s-]+(?:\s*(?:seconds?|minutes?|hours?|days?|ms|mb|kb))?$/i.test(text)) return "numeric";
  if (/^[a-z0-9_.]+$/.test(text) && /[_.]/.test(text)) return "identifier";
  return text.split(/\s+/).length <= 4 ? "name" : "phrase";
}

const AREA_BOUND_FACT_TYPES = new Set(["default_value", "relationship"]);

type Candidate0 = { text: string; factId: string; score: number };

/**
 * Distractor candidates ranked by closeness to the primary fact: same context (product
 * area) first, then same domain, then same value shape. Random tie-break from the seed.
 */
function rankedPool(
  fact: Fact,
  sibs: Fact[],
  domainId: string,
  items: (f: Fact) => string[],
  shapeOf: string,
  rand: () => number,
  sameAreaOnly = false
): Candidate0[] {
  const ctx = fact.context ? normalize(fact.context) : null;
  const area = docArea(fact.sourceUrl);
  if (sameAreaOnly) sibs = sibs.filter((f) => docArea(f.sourceUrl) === area || (ctx !== null && f.context !== undefined && normalize(f.context) === ctx));
  // A number or a table/property name among prose options gives the answer away.
  const strictShape = shapeOf === "numeric" || shapeOf === "identifier";
  return sibs
    .flatMap((f) =>
      items(f).map((text) => ({
        text,
        factId: f.factId,
        score:
          (ctx && f.context && normalize(f.context) === ctx ? 4 : 0) +
          (docArea(f.sourceUrl) === area ? 3 : 0) +
          (f.domainIds.includes(domainId) ? 2 : 0) +
          (valueShape(text) === shapeOf ? 1 : 0) +
          rand() * 0.5,
      }))
    )
    .filter((c) => !strictShape || valueShape(c.text) === shapeOf)
    .sort((a, b) => b.score - a.score);
}

/** Option identity for duplicate checks: "Flow" and "Flows" count as the same option. */
const optionKey = (text: string) => normalize(text).replace(/([^s])s\b/g, "$1");

/** First `count` distinct values from a ranked pool, skipping `avoid`. */
function pick(pool: Candidate0[], avoid: Set<string>, count: number) {
  const seen = new Set([...avoid].map(optionKey));
  const out: Array<{ text: string; factId: string }> = [];
  for (const candidate of pool) {
    const key = optionKey(candidate.text);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ text: candidate.text, factId: candidate.factId });
    if (out.length === count) break;
  }
  return out;
}

/** Same fact type, different subject. */
function siblings(fact: Fact, facts: Fact[]): Fact[] {
  return facts.filter((f) => f.factId !== fact.factId && f.factType === fact.factType && normalize(f.subject) !== normalize(fact.subject));
}

/** Builds the option set, or returns null when the fact store can't support this instance. */
export function buildOptions(template: Template, fact: Fact, facts: Fact[], domainId: string, seed: string): Option[] | null {
  const rand = seededRandom(seed);
  const sibs = siblings(fact, facts);
  const n = template.optionCount;
  const ownItems = Array.isArray(fact.value) ? fact.value : [fact.value];
  const own = new Set(ownItems.map(normalize));
  // List items, defaults and relationships are only comparable within one product area.
  const sameAreaOnly = template.answer.mode === "members" || template.answer.mode === "non_member" || AREA_BOUND_FACT_TYPES.has(fact.factType);
  const pool = (items: (f: Fact) => string[], shapeOf: string) => (k: number, avoid: Set<string>) =>
    pick(rankedPool(fact, sibs, domainId, items, shapeOf, rand, sameAreaOnly), avoid, k);
  const listItems = (f: Fact) => (Array.isArray(f.value) ? f.value : []);
  const textValue = (f: Fact) => (typeof f.value === "string" ? [f.value] : []);

  switch (template.answer.mode) {
    case "single": {
      if (typeof fact.value !== "string") return null;
      const wrong = pool(textValue, valueShape(fact.value))(n - 1, own);
      if (wrong.length < n - 1) return null;
      return [{ text: fact.value, correct: true, factId: fact.factId }, ...wrong.map((w) => ({ ...w, correct: false }))];
    }
    case "reverse": {
      if (typeof fact.value !== "string") return null;
      const subjects = pool((f) => (typeof f.value === "string" ? [f.subject] : []), valueShape(fact.subject));
      const wrong = subjects(n - 1, new Set([normalize(fact.subject)]));
      if (wrong.length < n - 1) return null;
      return [{ text: fact.subject, correct: true, factId: fact.factId }, ...wrong.map((w) => ({ ...w, correct: false }))];
    }
    case "members": {
      const k = template.answer.correctCount;
      if (ownItems.length < k) return null;
      const right = shuffled(ownItems, rand).slice(0, k);
      const wrong = pool(listItems, valueShape(right[0]))(n - k, own);
      if (wrong.length < n - k) return null;
      return [...right.map((text) => ({ text, correct: true, factId: fact.factId })), ...wrong.map((w) => ({ ...w, correct: false }))];
    }
    case "non_member": {
      if (ownItems.length < n - 1) return null;
      const members = shuffled(ownItems, rand).slice(0, n - 1);
      const outsider = pool(listItems, valueShape(members[0]))(1, own);
      if (!outsider.length) return null;
      return [...members.map((text) => ({ text, correct: false, factId: fact.factId })), { ...outsider[0], correct: true }];
    }
    case "ordinal": {
      if (ownItems.length < 3) return null;
      const answer = template.answer.position === "first" ? ownItems[0] : ownItems[ownItems.length - 1];
      const others = shuffled(ownItems.filter((v) => v !== answer), rand).slice(0, n - 1);
      return [{ text: answer, correct: true, factId: fact.factId }, ...others.map((text) => ({ text, correct: false, factId: fact.factId }))];
    }
  }
}

const GIVEAWAY_STOPWORDS = new Set(["servicenow", "which", "following", "what", "record", "records", "option", "options", "user", "users"]);

function significantWords(text: string): Set<string> {
  return new Set(
    normalize(text)
      .split(" ")
      .filter((w) => w.length >= 4 && !GIVEAWAY_STOPWORDS.has(w))
      .map((w) => w.replace(/ies$/, "y").replace(/([^s])s$/, "$1")) // crude plural folding
  );
}

/** True when only correct options share a significant word with the stem. */
export function isGiveaway(stem: string, options: Option[]): boolean {
  const words = significantWords(stem);
  const overlaps = (o: Option) => [...significantWords(o.text)].some((w) => words.has(w));
  return options.some((o) => o.correct && overlaps(o)) && !options.some((o) => !o.correct && overlaps(o));
}

export function chooseStem(template: Template, seed: string): string {
  return template.stems[Math.floor(seededRandom(seed + "#stem")() * template.stems.length)];
}

export interface Candidate {
  template: Template;
  fact: Fact;
  identity: Identity;
}

/** A (template, fact) pair that yields a fair question, or null. */
export function viableCandidate(template: Template, fact: Fact, facts: Fact[], domainId: string): Candidate | null {
  if (fact.factType !== template.factType || !template.relations.includes(fact.relation)) return null;
  const identity = identityFor(template, fact);
  const options = buildOptions(template, fact, facts, domainId, identity.instanceId);
  if (!options || isGiveaway(renderStem(chooseStem(template, identity.instanceId), fact), options)) return null;
  return { template, fact, identity };
}

/** Every (template, fact) pair that could produce a question for this domain and archetype. */
export function candidateInstances(domainId: string, archetypeId: string, templates: Template[], facts: Fact[]): Candidate[] {
  return templates
    .filter((t) => t.archetypeId === archetypeId)
    .flatMap((t) => facts.filter((f) => f.domainIds.includes(domainId)).map((f) => viableCandidate(t, f, facts, domainId)))
    .filter((c): c is Candidate => c !== null);
}

export function makeDraft(c: Candidate, facts: Fact[], cert: string, domainId: string, derivedFrom?: DerivedFrom): Draft {
  const seed = c.identity.instanceId;
  const options = shuffled(buildOptions(c.template, c.fact, facts, domainId, seed)!, seededRandom(seed + "#order"));
  const stem = chooseStem(c.template, seed);
  const byId = new Map(facts.map((f) => [f.factId, f]));
  const distractorFacts = [...new Set(options.filter((o) => o.factId && o.factId !== c.fact.factId).map((o) => o.factId!))].map((id) => byId.get(id)!);
  return {
    identity: c.identity,
    cert,
    domainId,
    format: c.template.format,
    cognitiveLevel: c.template.cognitiveLevel,
    stem: renderStem(stem, c.fact),
    options: options.map((o, i) => ({ id: OPTION_IDS[i], ...o })),
    primaryFact: c.fact,
    distractorFacts,
    ...(derivedFrom ? { derivedFrom } : {}),
  };
}

/**
 * Fill each quota, spreading across templates and facts: a fact already used in this batch
 * (same knowledgeKey) is only reused when nothing else is left.
 */
export function selectDrafts(plan: GenerationPlan, templates: Template[], facts: Fact[], taken: Set<string>): Draft[] {
  const usedFacts = new Set<string>();
  const drafts: Draft[] = [];
  for (const quota of plan.quotas.filter((q) => q.target > 0)) {
    const rand = seededRandom(`${plan.cert}:${quota.domainId}:${quota.archetypeId}`);
    const pool = shuffled(candidateInstances(quota.domainId, quota.archetypeId, templates, facts), rand).filter((c) => !taken.has(c.identity.instanceId));
    const templateUse = new Map<string, number>();
    for (let i = 0; i < quota.target && pool.length; i++) {
      pool.sort(
        (a, b) =>
          Number(usedFacts.has(a.fact.factId)) - Number(usedFacts.has(b.fact.factId)) ||
          (templateUse.get(a.template.templateId) ?? 0) - (templateUse.get(b.template.templateId) ?? 0)
      );
      const next = pool.shift()!;
      usedFacts.add(next.fact.factId);
      taken.add(next.identity.instanceId);
      templateUse.set(next.template.templateId, (templateUse.get(next.template.templateId) ?? 0) + 1);
      drafts.push(makeDraft(next, facts, plan.cert, quota.domainId));
    }
  }
  return drafts;
}

/**
 * Instances never to draft: already generated, rejected, or an official item's own
 * (template, fact) pair. Generating that last kind would rebuild the official question.
 */
export function takenInstances(cert: string): Set<string> {
  const generated = readJsonIfExists<{ questions: GeneratedQuestion[] }>(certFile(cert, "generated.json"), { questions: [] }).questions;
  const rejected = readJsonIfExists<Array<{ instanceId: string }>>(certFile(cert, "rejections.json"), []);
  const official = [...blockedPairs(cert)].map((pair) => instanceIdFor(...(pair.split("|") as [string, string])));
  return new Set([...generated.map((q) => q.identity.instanceId), ...rejected.map((r) => r.instanceId), ...official]);
}

/** Drafts for a `plan:observed` plan: each target names its template, fact and official origin. */
export function derivedDrafts(plan: GenerationPlan, templates: Template[], facts: Fact[], taken: Set<string>): Draft[] {
  const templateById = new Map(templates.map((t) => [t.templateId, t]));
  const factById = new Map(facts.map((f) => [f.factId, f]));
  const drafts: Draft[] = [];
  for (const target of plan.derived ?? []) {
    const template = templateById.get(target.templateId);
    const fact = factById.get(target.factId);
    if (!template || !fact || taken.has(target.instanceId)) continue;
    const candidate = viableCandidate(template, fact, facts, target.domainId);
    if (!candidate) continue;
    taken.add(target.instanceId);
    drafts.push(makeDraft(candidate, facts, plan.cert, target.domainId, { observedItemId: target.observedItemId, relation: target.relation }));
  }
  return drafts;
}

/** Facts usable for generation: everything except those writers flagged as trivia. */
export function usableFacts(cert: string): Fact[] {
  const blocked = new Set(readJsonIfExists<Array<{ kind?: string; factId: string }>>(certFile(cert, "rejections.json"), []).filter((r) => r.kind === "trivia").map((r) => r.factId));
  return readJson<{ facts: Fact[] }>(certFile(cert, "facts.json")).facts.filter((f) => !blocked.has(f.factId));
}

export function runInstantiate(cert: string): Draft[] {
  const plan = readJson<GenerationPlan>(certFile(cert, "plan.json"));
  const facts = usableFacts(cert);
  const taken = takenInstances(cert);
  const templates = loadTemplates();
  const drafts = plan.derived ? derivedDrafts(plan, templates, facts, taken) : selectDrafts(plan, templates, facts, taken);
  // Cumulative: earlier rounds' drafts stay, so their packet outputs can still be ingested.
  const prior = readJsonIfExists<{ drafts: Draft[] }>(certFile(cert, "drafts.json"), { drafts: [] }).drafts;
  const merged = new Map([...prior, ...drafts].map((d) => [d.identity.instanceId, d]));
  writeJson(certFile(cert, "drafts.json"), { cert, drafts: [...merged.values()] });
  log("s10", `${cert}: ${drafts.length} drafts from ${new Set(drafts.map((d) => d.identity.templateId)).size} templates, ${new Set(drafts.flatMap((d) => d.identity.knowledgeKeys)).size} distinct facts`);
  return drafts;
}
