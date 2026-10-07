// S8b Templates (agent stage). For each archetype the pipeline can generate, an agent writes
// parameterized templates from the archetype's observed examples. Templates are global (not
// per cert) and live in data/pipeline/templates.json.
import { FACT_TYPE_BY_NAME, FACT_TYPES } from "../lib/fact-types";
import { log, paths, readJsonIfExists, readJsonl, writeJson } from "../lib/io";
import { readPacketOutputs, writePackets } from "../lib/packets";
import type { Archetype, Classification, ObservedItem, Template } from "../lib/types";
import { loadArchetypes } from "./s8-analysis";

const EXAMPLES_PER_ARCHETYPE = 8;

interface TemplatesInput {
  factTypes: typeof FACT_TYPES;
  answerModes: Record<string, string>;
  archetypes: Array<Archetype & { examples: Array<{ stem: string; options: string[] }> }>;
  existingTemplates: Template[];
}

const ANSWER_MODES = {
  single: "valueKind text. Correct option = the fact's value; distractors = values of other facts of the same factType. Stems use {subject}.",
  reverse: "valueKind text. Stem shows the fact's value via {value}; correct option = the fact's subject; distractors = subjects of other facts of the same factType.",
  members: "valueKind list. multiple_select: `correctCount` members of the list are correct; distractors are items from other lists of the same factType.",
  non_member: "valueKind list. multiple_choice_negative: (optionCount-1) members of the list are wrong options; the correct option is an item from another list of the same factType that is NOT a member.",
  ordinal: "valueKind ordered_list. Ask for the first or last step (`position`); distractors are the other steps.",
};

export function loadTemplates(): Template[] {
  return readJsonIfExists<{ templates: Template[] }>(paths.templates, { templates: [] }).templates;
}

export function runTemplatePackets(certs: string[]): void {
  const archetypes = loadArchetypes();
  const examples = new Map<string, Array<{ stem: string; options: string[] }>>();
  for (const cert of certs) {
    const items = new Map(readJsonl<ObservedItem>(paths.observed(cert)).map((i) => [i.itemId, i]));
    for (const c of readJsonIfExists<Classification[]>(paths.classifications(cert), [])) {
      const item = items.get(c.itemId);
      if (!item) continue;
      const list = examples.get(c.archetypeId) ?? [];
      if (list.length < EXAMPLES_PER_ARCHETYPE) list.push({ stem: item.stem, options: item.options });
      examples.set(c.archetypeId, list);
    }
  }
  const input: TemplatesInput = {
    factTypes: FACT_TYPES,
    answerModes: ANSWER_MODES,
    archetypes: archetypes.map((a) => ({ ...a, examples: examples.get(a.id) ?? [] })),
    existingTemplates: loadTemplates(),
  };
  writePackets("templates", "all", "write-templates.md", [{ id: "templates-001", input }]);
  log("s8b", `wrote templates packet for ${archetypes.length} archetypes`);
}

/** Fix common agent slips before validation: fixed counts written as a slot, synonym levels. */
export function normalizeTemplate(t: Template): Template {
  const count = t.answer?.mode === "members" ? String(t.answer.correctCount) : "";
  const level = ({ comprehension: "understanding", recall: "knowledge", analysis: "application" } as Record<string, Template["cognitiveLevel"]>)[t.cognitiveLevel];
  return {
    ...t,
    cognitiveLevel: level ?? t.cognitiveLevel,
    stems: (t.stems ?? []).map((s) => (count ? s.replace(/\{correctCount\}/g, count) : s)),
  };
}

/** Returns a rejection reason, or null when the template is usable. */
/**
 * With `allowUnknownFactType`, a template may name a fact type the pipeline can't extract yet:
 * it can still describe observed items (parameterization), it just can't generate questions.
 */
export function rejectTemplate(t: Template, archetypeIds: Set<string>, opts: { allowUnknownFactType?: boolean } = {}): string | null {
  const known = FACT_TYPE_BY_NAME.get(t.factType);
  if (!archetypeIds.has(t.archetypeId)) return `unknown archetype ${t.archetypeId}`;
  if (!known && !opts.allowUnknownFactType) return `unknown factType ${t.factType}`;
  // Unknown fact types get a value kind implied by the answer mode.
  const spec = known ?? {
    relation: t.relations?.[0] ?? "",
    valueKind: { single: "text", reverse: "text", members: "list", non_member: "list", ordinal: "ordered_list" }[t.answer?.mode] ?? "text",
  };
  if (!t.templateId?.startsWith(`${t.archetypeId}.t`)) return "templateId must be <archetypeId>.tNN";
  if (!t.relations?.length || t.relations.some((r) => r !== spec.relation)) return `relations must be [${spec.relation}]`;
  const slot = t.answer?.mode === "reverse" ? "{value}" : "{subject}";
  if (!t.stems?.length || t.stems.some((s) => !s.includes(slot))) return `every stem needs ${slot}`;
  if (t.answer?.mode === "reverse" && t.stems.some((s) => s.includes("{subject}"))) return "reverse stems must not contain {subject}";
  const kindFor = { single: ["text"], reverse: ["text"], members: ["list"], non_member: ["list"], ordinal: ["ordered_list"] } as const;
  if (!(kindFor[t.answer?.mode] as readonly string[] | undefined)?.includes(spec.valueKind)) return `answer mode ${t.answer?.mode} does not fit ${spec.valueKind}`;
  const formatFor = { single: "multiple_choice", reverse: "multiple_choice", members: "multiple_select", non_member: "multiple_choice_negative", ordinal: "multiple_choice" } as const;
  if (t.format !== formatFor[t.answer.mode]) return `format must be ${formatFor[t.answer.mode]} for mode ${t.answer.mode}`;
  if (t.answer.mode === "members" && !(t.answer.correctCount >= 2 && t.answer.correctCount < t.optionCount)) return "members.correctCount must be 2..optionCount-1";
  if (!(t.optionCount >= 4 && t.optionCount <= 6)) return "optionCount must be 4..6";
  if (!["knowledge", "understanding", "application"].includes(t.cognitiveLevel)) return `unknown cognitiveLevel ${t.cognitiveLevel}`;
  const unknownSlot = t.stems.flatMap((s) => s.match(/\{[a-zA-Z]+\}/g) ?? []).find((slot) => !["{subject}", "{value}", "{context}"].includes(slot));
  if (unknownSlot) return `unknown slot ${unknownSlot}`;
  return null;
}

export function runTemplateIngest(): Template[] {
  const archetypeIds = new Set(loadArchetypes().map((a) => a.id));
  const templates = new Map(loadTemplates().map((t) => [t.templateId, t]));
  let rejected = 0;
  for (const { output } of readPacketOutputs<TemplatesInput, { templates: Template[] }>("templates", "all")) {
    for (const raw of output.templates ?? []) {
      const t = normalizeTemplate(raw);
      const reason = rejectTemplate(t, archetypeIds);
      if (reason) {
        log("s8b", `rejected ${t.templateId}: ${reason}`);
        rejected++;
        continue;
      }
      templates.set(t.templateId, t);
    }
  }
  const list = [...templates.values()].sort((a, b) => a.templateId.localeCompare(b.templateId));
  writeJson(paths.templates, { templates: list });
  log("s8b", `${list.length} templates (${rejected} rejected) across ${new Set(list.map((t) => t.archetypeId)).size} archetypes`);
  return list;
}
