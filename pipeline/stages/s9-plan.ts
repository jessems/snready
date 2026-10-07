// S9 Generation plan: blueprint weights × archetype distribution → quotas per (domain, archetype),
// capped by how many instances the fact store can actually support.
import { certFile, log, readJson, readJsonIfExists, writeJson } from "../lib/io";
import { jaccard, normalize, seededRandom, shuffled, tokens } from "../lib/text";
import type { Blueprint, DerivedTarget, Distribution, Fact, GenerationPlan, PlanQuota, Template } from "../lib/types";
import { parameterizationsFile, type Parameterization } from "./s8e-parameterize";
import { loadTemplates } from "./s8b-templates";
import { loadGenerated } from "./s11-write";
import { candidateInstances, docArea, takenInstances, usableFacts, viableCandidate, type Candidate } from "./s10-instantiate";

/** Largest-remainder rounding: integers that sum to `total` in proportion to `weights`. */
export function apportion(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum === 0 || total === 0) return weights.map(() => 0);
  const exact = weights.map((w) => (w / sum) * total);
  const floors = exact.map(Math.floor);
  let rest = total - floors.reduce((a, b) => a + b, 0);
  const order = exact.map((e, i) => ({ i, r: e - Math.floor(e) })).sort((a, b) => b.r - a.r);
  for (const { i } of order) {
    if (rest-- <= 0) break;
    floors[i]++;
  }
  return floors;
}

export function buildPlan(
  blueprint: Blueprint,
  distribution: Distribution,
  templates: Template[],
  facts: Fact[],
  taken: Set<string>,
  totalTarget: number,
  existing: Array<{ domainId: string; archetypeId: string }> = []
): GenerationPlan {
  // totalTarget is the desired bank size; questions already generated count towards it.
  const have = new Map<string, number>();
  for (const q of existing) have.set(`${q.domainId}|${q.archetypeId}`, (have.get(`${q.domainId}|${q.archetypeId}`) ?? 0) + 1);
  const generatable = new Set(templates.map((t) => t.archetypeId));
  const quotas: PlanQuota[] = [];
  const gaps: GenerationPlan["gaps"] = [];
  const domainTargets = apportion(totalTarget, blueprint.domains.map((d) => d.weight));

  blueprint.domains.forEach((domain, di) => {
    const mix = (distribution.byDomain[domain.id] ?? distribution.archetypes).filter((r) => {
      if (generatable.has(r.key)) return true;
      gaps.push({ domainId: domain.id, archetypeId: r.key, reason: "no template for archetype" });
      return false;
    });
    const available = new Map(
      mix.map((r) => [r.key, candidateInstances(domain.id, r.key, templates, facts).filter((c) => !taken.has(c.identity.instanceId)).length])
    );

    // First pass by observed share; then hand shortfall to archetypes that still have room.
    let targets = apportion(domainTargets[di], mix.map((r) => r.share)).map((t, i) => Math.max(0, t - (have.get(`${domain.id}|${mix[i].key}`) ?? 0)));
    let shortfall = 0;
    targets = targets.map((t, i) => {
      const cap = available.get(mix[i].key) ?? 0;
      if (t > cap) {
        gaps.push({ domainId: domain.id, archetypeId: mix[i].key, reason: `wanted ${t}, only ${cap} instances available` });
        shortfall += t - cap;
        return cap;
      }
      return t;
    });
    while (shortfall > 0) {
      const room = mix.map((r, i) => Math.max(0, (available.get(r.key) ?? 0) - targets[i]));
      if (room.every((r) => r === 0)) break;
      const extra = apportion(Math.min(shortfall, room.reduce((a, b) => a + b, 0)), room).map((e, i) => Math.min(e, room[i]));
      const given = extra.reduce((a, b) => a + b, 0);
      if (given === 0) break;
      targets = targets.map((t, i) => t + extra[i]);
      shortfall -= given;
    }
    if (shortfall > 0) gaps.push({ domainId: domain.id, archetypeId: "*", reason: `${shortfall} questions short: not enough facts (run more facts packets for this domain)` });

    mix.forEach((r, i) => {
      if (targets[i] > 0 || (available.get(r.key) ?? 0) > 0)
        quotas.push({ domainId: domain.id, archetypeId: r.key, target: targets[i], availableInstances: available.get(r.key) ?? 0 });
    });
  });

  return { cert: blueprint.cert, totalTarget, quotas, gaps };
}

export function runPlan(cert: string, totalTarget: number): GenerationPlan {
  const blueprint = readJson<Blueprint>(certFile(cert, "blueprint.json"));
  const distribution = readJson<Distribution>(certFile(cert, "distribution.json"));
  const facts = usableFacts(cert);
  const existing = loadGenerated(cert).map((q) => ({ domainId: q.domainId, archetypeId: q.identity.archetypeId }));
  const plan = buildPlan(blueprint, distribution, loadTemplates(), facts, takenInstances(cert), totalTarget, existing);
  writeJson(certFile(cert, "plan.json"), plan);
  const planned = plan.quotas.reduce((n, q) => n + q.target, 0);
  log("s9", `${cert}: planned ${planned} new (${existing.length} existing, target ${totalTarget}) across ${plan.quotas.filter((q) => q.target > 0).length} quotas, ${plan.gaps.length} gaps`);
  return plan;
}

// ---------- plan:observed: derive questions from official items ----------

/**
 * For each parameterized official item:
 *   variants      its template with other facts of the same type (same structure, new knowledge)
 *   restructures  its docs fact under other templates (new structure, same knowledge)
 * The item's own (template, fact) pair is in `taken`, so the official question is never rebuilt.
 */
export function buildObservedPlan(
  cert: string,
  params: Parameterization[],
  templates: Template[],
  facts: Fact[],
  taken: Set<string>,
  opts: { variants: number; restructures: number }
): GenerationPlan {
  const byId = new Map(templates.map((t) => [t.templateId, t]));
  const factById = new Map(facts.map((f) => [f.factId, f]));
  const usedFacts = new Set<string>();
  const chosen = new Set(taken);
  const derived: DerivedTarget[] = [];
  const gaps: GenerationPlan["gaps"] = [];

  /** `ordered`: candidates are already ranked by relevance; otherwise shuffle deterministically. */
  const pick = (observedItemId: string, relation: DerivedTarget["relation"], candidates: Candidate[], n: number, ordered = false) => {
    const base = ordered ? candidates : shuffled(candidates, seededRandom(`${observedItemId}:${relation}`));
    const ranked = [...base].sort((a, b) => Number(usedFacts.has(a.fact.factId)) - Number(usedFacts.has(b.fact.factId)));
    let count = 0;
    for (const c of ranked) {
      if (count >= n) break;
      if (chosen.has(c.identity.instanceId)) continue;
      chosen.add(c.identity.instanceId);
      usedFacts.add(c.fact.factId);
      derived.push({
        observedItemId,
        relation,
        templateId: c.template.templateId,
        factId: c.fact.factId,
        domainId: c.fact.domainIds[0] ?? "",
        instanceId: c.identity.instanceId,
      });
      count++;
    }
    return count;
  };

  for (const p of params) {
    const template = p.templateId ? byId.get(p.templateId) : undefined;
    const fact = factById.get(p.groundedFactId ?? p.linkedFactId ?? "");
    const domainId = fact?.domainIds[0] ?? "";
    if (!template) {
      gaps.push({ domainId, archetypeId: p.archetypeId, reason: `${p.itemId}: no accepted template` });
      continue;
    }
    // Variants: same template, other facts. Skip facts about the item's own subject, and prefer
    // facts close to the item's own knowledge, so a variant tests the neighbouring topic.
    const ownSubject = normalize(p.bindings.subject ?? "");
    const itemWords = tokens([p.bindings.subject, ...(Array.isArray(p.bindings.value) ? p.bindings.value : [p.bindings.value]), p.bindings.context, ...p.answer].filter(Boolean).join(" "));
    const relatedness = (f: Fact) =>
      (fact && docArea(f.sourceUrl) === docArea(fact.sourceUrl) ? 3 : 0) +
      (fact?.context && f.context && normalize(f.context) === normalize(fact.context) ? 2 : 0) +
      (fact && f.objectiveIds.some((o) => fact.objectiveIds.includes(o)) ? 2 : 0) +
      (fact && f.domainIds.some((d) => fact.domainIds.includes(d)) ? 1 : 0) +
      3 * jaccard(tokens(`${f.subject} ${String(f.value)} ${f.context ?? ""}`), itemWords);
    const variantPool = facts
      .filter((f) => f.factId !== fact?.factId && normalize(f.subject) !== ownSubject)
      .map((f) => viableCandidate(template, f, facts, f.domainIds[0] ?? domainId))
      .filter((c): c is Candidate => c !== null)
      .sort((a, b) => relatedness(b.fact) - relatedness(a.fact));
    if (pick(p.itemId, "variant", variantPool, opts.variants, true) < opts.variants) {
      gaps.push({ domainId, archetypeId: p.archetypeId, reason: `${p.itemId}: not enough ${template.factType} facts for ${opts.variants} variants` });
    }
    // Restructures: same fact, other templates.
    if (!fact) {
      gaps.push({ domainId, archetypeId: p.archetypeId, reason: `${p.itemId}: no docs fact linked (run ground), so no restructures` });
      continue;
    }
    const restructurePool = templates
      .filter((t) => t.templateId !== template.templateId)
      .map((t) => viableCandidate(t, fact, facts, domainId))
      .filter((c): c is Candidate => c !== null);
    if (pick(p.itemId, "restructure", restructurePool, opts.restructures) < opts.restructures) {
      gaps.push({ domainId, archetypeId: p.archetypeId, reason: `${p.itemId}: only ${restructurePool.length} other templates fit fact type ${fact.factType}` });
    }
  }

  return { cert, totalTarget: derived.length, quotas: [], gaps, derived };
}

export function runObservedPlan(cert: string, opts: { variants: number; restructures: number }): GenerationPlan {
  const params = readJsonIfExists<Parameterization[]>(parameterizationsFile(cert), []);
  if (!params.length) throw new Error(`No parameterized official items for ${cert}; run parameterize first`);
  const plan = buildObservedPlan(cert, params, loadTemplates(), usableFacts(cert), takenInstances(cert), opts);
  writeJson(certFile(cert, "plan.json"), plan);
  const variants = plan.derived!.filter((d) => d.relation === "variant").length;
  log("s9", `${cert}: ${plan.derived!.length} derived from ${params.length} official items (${variants} variants, ${plan.derived!.length - variants} restructures), ${plan.gaps.length} gaps`);
  return plan;
}
