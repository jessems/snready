// S8d identity scheme. See docs/question-pipeline.md section 4.
import { hash } from "./io";
import { normalize } from "./text";
import type { Fact, Identity, Template } from "./types";

const ORDERED_FACT_TYPES = new Set(["ordered_process"]);

/** Same knowledge → same factId, regardless of which chunk or run produced it. */
export function factId(fact: Pick<Fact, "factType" | "subject" | "relation" | "value">): string {
  const values = Array.isArray(fact.value) ? fact.value.map(normalize) : [normalize(fact.value)];
  if (!ORDERED_FACT_TYPES.has(fact.factType)) values.sort();
  return "f_" + hash([fact.factType, normalize(fact.subject), normalize(fact.relation), values.join("|")].join("::"));
}

/**
 * One instance per (template, primary fact). Distractor choice, option order and stem
 * phrasing are cosmetic: they produce renderings of the same instance, not new questions.
 */
export function instanceIdFor(templateId: string, factId: string): string {
  return `${templateId}.${hash(factId, 8)}`;
}

export function identityFor(template: Template, primaryFact: Fact): Identity {
  return {
    archetypeId: template.archetypeId,
    templateId: template.templateId,
    instanceId: instanceIdFor(template.templateId, primaryFact.factId),
    familyKey: template.templateId,
    knowledgeKeys: [primaryFact.factId],
  };
}

/** Public question id used in routes; short, stable, derived from the instance. */
export function publicQuestionId(cert: string, identity: Identity): string {
  return `${cert}-g-${hash(identity.instanceId, 8)}`;
}
