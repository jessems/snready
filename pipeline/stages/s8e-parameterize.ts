// S8e Parameterize observed items (agent stage). Proves an exam (dump, samples, our bank) is
// expressible as  archetype → template → slot bindings → answer:
//   "c.1 What is the table name for {subject}?"  subject=roles  → answer sys_user_role
//   parameterize:packets   classified items grouped by archetype, with that archetype's templates
//   parameterize:ingest    check every mapping deterministically; item-level results stay in
//                          quarantine, aggregates go to data/pipeline/<cert>/parameterization.json
//   templates:accept       promote a proposed template into data/pipeline/templates.json
import { certFile, log, paths, readJsonIfExists, readJsonl, writeJson } from "../lib/io";
import { existingPackets, readPacketOutputs, writePackets } from "../lib/packets";
import { jaccard, normalize, tokens } from "../lib/text";
import type { Archetype, Classification, Fact, ObservedItem, Template } from "../lib/types";
import { FACT_TYPE_BY_NAME } from "../lib/fact-types";
import { loadArchetypes } from "./s8-analysis";
import { loadTemplates, normalizeTemplate, rejectTemplate } from "./s8b-templates";
import { renderStem } from "./s10-instantiate";

const STAGE = "parameterize";
const ITEMS_PER_PACKET = 40;
/** Re-rendered template vs original stem (token Jaccard) at or above this counts as a faithful fit. */
const FAITHFUL = 0.5;

export interface Bindings {
  subject?: string;
  value?: string | string[];
  context?: string;
}

interface ParameterizeOutput {
  items: Array<{ itemId: string; templateId: string | null; bindings: Bindings; factId?: string | null; note?: string }>;
  proposedTemplates?: Template[];
}

export interface Parameterization {
  itemId: string;
  archetypeId: string;
  templateId: string | null;
  bindings: Bindings;
  /** Answer the template + bindings imply, in option text. */
  answer: string[];
  /** Implied answer equals the item's marked correct option(s); null when the item has no key. */
  answerConsistent: boolean | null;
  /** Token similarity between the re-rendered template and the original stem. */
  reconstruction: number;
  /** A docs fact that yields exactly this item's answer: we can regenerate the item from docs. */
  groundedFactId: string | null;
  /** The docs fact the agent says this item tests, even if its wording differs (paraphrase). */
  linkedFactId: string | null;
  note?: string;
}

export interface ParameterizationSummary {
  cert: string;
  items: number;
  parameterized: number;
  consistent: number;
  faithful: number;
  grounded: number;
  byTemplate: Record<string, { items: number; consistent: number; faithful: number; grounded: number; byOrigin: Record<string, number> }>;
  byArchetype: Record<string, { items: number; parameterized: number; byOrigin: Record<string, number> }>;
}

export function parameterizationsFile(cert: string): string {
  return `${paths.quarantine}/${cert}/parameterizations.json`;
}

export function templateProposalsFile(): string {
  return `${paths.root}/data/pipeline/template-proposals.json`;
}

export function runParameterizePackets(cert: string): void {
  const items = new Map(readJsonl<ObservedItem>(paths.observed(cert)).map((i) => [i.itemId, i]));
  const done = new Set(readJsonIfExists<Parameterization[]>(parameterizationsFile(cert), []).map((p) => p.itemId));
  const prior = existingPackets<{ items: Array<{ itemId: string }> }>(STAGE, cert);
  for (const input of prior.inputs) for (const i of input.items ?? []) done.add(i.itemId);
  const classifications = readJsonIfExists<Classification[]>(paths.classifications(cert), []).filter((c) => !done.has(c.itemId));
  const archetypes = new Map(loadArchetypes().map((a) => [a.id, a]));
  const templates = [...loadTemplates(), ...readJsonIfExists<Template[]>(templateProposalsFile(), [])];
  const facts = readJsonIfExists<{ facts: Fact[] }>(certFile(cert, "facts.json"), { facts: [] }).facts;

  const byArchetype = new Map<string, Classification[]>();
  for (const c of classifications) byArchetype.set(c.archetypeId, [...(byArchetype.get(c.archetypeId) ?? []), c]);

  const packets = [];
  for (const [archetypeId, group] of byArchetype) {
    const archetype: Archetype | undefined = archetypes.get(archetypeId);
    for (let i = 0; i < group.length; i += ITEMS_PER_PACKET) {
      packets.push({
        id: `parameterize-${String(prior.next + packets.length).padStart(3, "0")}-${archetypeId}`,
        input: {
          archetype: archetype ?? { id: archetypeId, name: archetypeId, description: "(proposed archetype)", factType: "", generationUse: "" },
          factType: archetype ? FACT_TYPE_BY_NAME.get(archetype.factType) ?? null : null,
          templates: templates.filter((t) => t.archetypeId === archetypeId),
          // Docs facts the items might test, so the agent can link an item to its source fact.
          facts: facts
            .filter((f) => f.factType === archetype?.factType || templates.some((t) => t.archetypeId === archetypeId && t.factType === f.factType))
            .map((f) => ({ factId: f.factId, factType: f.factType, subject: f.subject, value: f.value })),
          items: group.slice(i, i + ITEMS_PER_PACKET).map((c) => {
            const item = items.get(c.itemId)!;
            return { itemId: item.itemId, format: c.format, stem: item.stem, options: item.options, correct: item.correct };
          }),
        },
      });
    }
  }
  writePackets(STAGE, cert, "parameterize-items.md", packets);
  log("s8e", `${cert}: wrote ${packets.length} packets for ${classifications.length} items across ${byArchetype.size} archetypes`);
}

/** The answer a template implies for given bindings, in option text, or null if not derivable. */
export function impliedAnswer(template: Template, bindings: Bindings, options: string[]): string[] | null {
  const list = Array.isArray(bindings.value) ? bindings.value : null;
  const inList = (o: string) => !!list?.some((v) => normalize(v) === normalize(o));
  switch (template.answer.mode) {
    case "single":
      return typeof bindings.value === "string" ? [bindings.value] : null;
    case "reverse":
      return bindings.subject ? [bindings.subject] : null;
    case "members":
      return list ? options.filter(inList) : null;
    case "non_member":
      return list ? options.filter((o) => !inList(o)) : null;
    case "ordinal":
      return list?.length ? [template.answer.position === "first" ? list[0] : list[list.length - 1]] : null;
  }
}

function sameAnswers(a: string[], b: string[]): boolean {
  const norm = (xs: string[]) => xs.map(normalize).sort().join("|");
  return norm(a) === norm(b);
}

export function checkParameterization(
  item: ObservedItem,
  archetypeId: string,
  template: Template | undefined,
  bindings: Bindings,
  facts: Fact[],
  factId?: string | null
): Omit<Parameterization, "note"> {
  const base = { itemId: item.itemId, archetypeId, templateId: template?.templateId ?? null, bindings };
  if (!template) return { ...base, answer: [], answerConsistent: null, reconstruction: 0, groundedFactId: null, linkedFactId: null };

  const answer = impliedAnswer(template, bindings, item.options) ?? [];
  const keyed = item.correct?.map((i) => item.options[i]).filter(Boolean) ?? null;
  const answerConsistent = keyed && keyed.length ? answer.length > 0 && sameAnswers(answer, keyed) : null;

  const pseudoFact = { subject: bindings.subject ?? "", value: bindings.value ?? "", context: bindings.context } as Fact;
  const original = tokens(item.stem);
  const reconstruction = Math.max(...template.stems.map((s) => jaccard(tokens(renderStem(s, pseudoFact)), original)));

  // Grounded: the agent linked a docs fact, and that fact really yields this item's answer.
  const fact = factId ? facts.find((f) => f.factId === factId) : undefined;
  const factAnswer = fact ? impliedAnswer(template, { subject: fact.subject, value: fact.value, context: fact.context }, item.options) : null;
  const grounded = fact && factAnswer?.length && answer.length && sameAnswers(factAnswer, answer) ? fact : undefined;

  return {
    ...base,
    answer,
    answerConsistent,
    reconstruction: Math.round(reconstruction * 100) / 100,
    groundedFactId: grounded?.factId ?? null,
    linkedFactId: fact?.factId ?? null,
  };
}

export function runParameterizeIngest(cert: string): ParameterizationSummary {
  const items = new Map(readJsonl<ObservedItem>(paths.observed(cert)).map((i) => [i.itemId, i]));
  const classified = new Map(readJsonIfExists<Classification[]>(paths.classifications(cert), []).map((c) => [c.itemId, c]));
  const facts = readJsonIfExists<{ facts: Fact[] }>(certFile(cert, "facts.json"), { facts: [] }).facts;
  // Archetypes still under review can carry templates too.
  const archetypeIds = new Set([
    ...loadArchetypes().map((a) => a.id),
    ...readJsonIfExists<Array<{ id: string }>>(certFile(cert, "archetype-proposals.json"), []).map((a) => a.id),
  ]);

  // Proposals are rebuilt from packet outputs; accepted ones already live in templates.json.
  const accepted = new Map(loadTemplates().map((t) => [t.templateId, t]));
  // Rebuilt from current packet outputs only, so proposals never outlive their evidence.
  const proposals = new Map<string, Template>();
  const outputs = readPacketOutputs<unknown, ParameterizeOutput>(STAGE, cert);
  for (const { output } of outputs) {
    for (const raw of output.proposedTemplates ?? []) {
      const t = normalizeTemplate(raw);
      if (accepted.has(t.templateId)) continue;
      const reason = rejectTemplate(t, archetypeIds, { allowUnknownFactType: true });
      if (reason) log("s8e", `proposal ${t.templateId} rejected: ${reason}`);
      else proposals.set(t.templateId, t);
    }
  }
  const templates = new Map([...accepted, ...proposals]);

  const links = readJsonIfExists<Record<string, string>>(`${paths.quarantine}/${cert}/fact-links.json`, {});
  const results = new Map<string, Parameterization>();
  for (const { output } of outputs) {
    for (const p of output.items ?? []) {
      const item = items.get(p.itemId);
      const c = classified.get(p.itemId);
      if (!item || !c) continue;
      const template = p.templateId ? templates.get(p.templateId) : undefined;
      if (p.templateId && !template) log("s8e", `${p.itemId}: unknown template ${p.templateId}`);
      // A link from S8f (docs grounding) wins over the parameterizing agent's guess.
      const factId = links[p.itemId] ?? p.factId;
      results.set(p.itemId, { ...checkParameterization(item, c.archetypeId, template, p.bindings ?? {}, facts, factId), ...(p.note ? { note: p.note } : {}) });
    }
  }

  writeJson(parameterizationsFile(cert), [...results.values()]);
  writeJson(templateProposalsFile(), [...proposals.values()].sort((a, b) => a.templateId.localeCompare(b.templateId)));
  const summary = summarize(cert, items, classified, [...results.values()]);
  writeJson(certFile(cert, "parameterization.json"), summary);
  log(
    "s8e",
    `${cert}: ${summary.parameterized}/${summary.items} items parameterized, ${summary.consistent} answer-consistent, ${summary.faithful} faithful, ${summary.grounded} grounded in docs facts; ${proposals.size} template proposals`
  );
  return summary;
}

function summarize(cert: string, items: Map<string, ObservedItem>, classified: Map<string, Classification>, results: Parameterization[]): ParameterizationSummary {
  const byTemplate: ParameterizationSummary["byTemplate"] = {};
  const byArchetype: ParameterizationSummary["byArchetype"] = {};
  for (const c of classified.values()) {
    const origin = items.get(c.itemId)?.origin ?? "unknown";
    const a = (byArchetype[c.archetypeId] ??= { items: 0, parameterized: 0, byOrigin: {} });
    a.items++;
    a.byOrigin[origin] = (a.byOrigin[origin] ?? 0) + 1;
  }
  for (const r of results) {
    if (!r.templateId) continue;
    const origin = items.get(r.itemId)?.origin ?? "unknown";
    byArchetype[r.archetypeId].parameterized++;
    const t = (byTemplate[r.templateId] ??= { items: 0, consistent: 0, faithful: 0, grounded: 0, byOrigin: {} });
    t.items++;
    t.byOrigin[origin] = (t.byOrigin[origin] ?? 0) + 1;
    if (r.answerConsistent) t.consistent++;
    if (r.reconstruction >= FAITHFUL) t.faithful++;
    if (r.groundedFactId) t.grounded++;
  }
  const withTemplate = results.filter((r) => r.templateId);
  return {
    cert,
    items: classified.size,
    parameterized: withTemplate.length,
    consistent: withTemplate.filter((r) => r.answerConsistent).length,
    faithful: withTemplate.filter((r) => r.reconstruction >= FAITHFUL).length,
    grounded: withTemplate.filter((r) => r.groundedFactId).length,
    byTemplate,
    byArchetype,
  };
}

export function acceptTemplate(id: string): void {
  const proposals = readJsonIfExists<Template[]>(templateProposalsFile(), []);
  const proposal = proposals.find((t) => t.templateId === id);
  if (!proposal) throw new Error(`No template proposal '${id}'`);
  if (!FACT_TYPE_BY_NAME.has(proposal.factType)) {
    throw new Error(`'${id}' uses fact type '${proposal.factType}', which pipeline/lib/fact-types.ts doesn't define yet; add it first`);
  }
  const current = readJsonIfExists<{ templates: Template[] }>(paths.templates, { templates: [] });
  writeJson(paths.templates, { templates: [...current.templates, proposal].sort((a, b) => a.templateId.localeCompare(b.templateId)) });
  writeJson(templateProposalsFile(), proposals.filter((t) => t.templateId !== id));
  log("s8e", `accepted template ${id}`);
}

export { FAITHFUL };
