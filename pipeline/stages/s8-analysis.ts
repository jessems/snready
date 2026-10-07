// S8 Analysis of the observed-question corpus (official items only).
//   classify:packets / classify:ingest   S8a  archetype + domain + format per item (agent)
//   distribution                         S8c  per-exam shares → data/pipeline/<cert>/distribution.json
// Item-level classifications stay in quarantine; only aggregates and archetype proposals
// (descriptions, no item text) are written to the repo.
import { FACT_TYPES } from "../lib/fact-types";
import { certFile, log, paths, readJson, readJsonIfExists, readJsonl, writeJson } from "../lib/io";
import { existingPackets, readPacketOutputs, writePackets } from "../lib/packets";
import type { Archetype, Blueprint, Classification, Distribution, DistributionRow, ObservedItem } from "../lib/types";

const ITEMS_PER_PACKET = 60;
/** How much one observed item counts towards the distribution, by origin. */
const ORIGIN_WEIGHT: Record<ObservedItem["origin"], number> = { sample: 1, measureup: 1, dump: 1 };
/** Below this many official items, the distribution is reported as too thin to trust. */
export const MIN_EVIDENCE = 30;
/** Below this many items, a domain's archetype mix falls back to the exam-wide mix. */
const MIN_DOMAIN_ITEMS = 15;

interface ClassifyInput {
  archetypes: Archetype[];
  factTypes: string[];
  domains: Array<{ id: string; name: string; objectives: string[] }>;
  items: Array<{ itemId: string; stem: string; options: string[]; correct: number[] | null; domainHint: string | null }>;
}

interface ClassifyOutput {
  classifications: Classification[];
  proposedArchetypes?: Array<Archetype & { itemIds: string[] }>;
}

export function loadArchetypes(): Archetype[] {
  return readJson<{ artifacts: Archetype[] }>(paths.archetypes).artifacts;
}

export function runClassifyPackets(cert: string): void {
  const blueprint = readJson<Blueprint>(certFile(cert, "blueprint.json"));
  const done = new Set(readJsonIfExists<Classification[]>(paths.classifications(cert), []).map((c) => c.itemId));
  const prior = existingPackets<ClassifyInput>("classify", cert);
  for (const input of prior.inputs) for (const i of input.items ?? []) done.add(i.itemId);
  const items = readJsonl<ObservedItem>(paths.observed(cert)).filter((i) => !done.has(i.itemId));
  const packets = [];
  for (let i = 0; i < items.length; i += ITEMS_PER_PACKET) {
    packets.push({
      id: `classify-${String(prior.next + packets.length).padStart(3, "0")}`,
      input: {
        archetypes: loadArchetypes(),
        factTypes: FACT_TYPES.map((t) => t.factType),
        domains: blueprint.domains.map((d) => ({ id: d.id, name: d.name, objectives: d.objectives.map((o) => o.name) })),
        items: items.slice(i, i + ITEMS_PER_PACKET).map(({ itemId, stem, options, correct, domainHint }) => ({ itemId, stem, options, correct, domainHint })),
      } satisfies ClassifyInput,
    });
  }
  writePackets("classify", cert, "classify-questions.md", packets);
  log("s8a", `${cert}: wrote ${packets.length} classify packets for ${items.length} items`);
}

export function runClassifyIngest(cert: string): void {
  const items = new Map(readJsonl<ObservedItem>(paths.observed(cert)).map((i) => [i.itemId, i]));
  const known = new Set(loadArchetypes().map((a) => a.id));
  // Only items still in the (official-only) observed corpus are kept.
  const results = new Map(readJsonIfExists<Classification[]>(paths.classifications(cert), []).filter((c) => items.has(c.itemId)).map((c) => [c.itemId, c]));
  const proposalsFile = certFile(cert, "archetype-proposals.json");
  // Rebuilt from all packet outputs each run, so re-ingesting never double counts.
  const proposals = new Map<string, Archetype & { itemCount: number }>();
  let rejected = 0;

  for (const { output } of readPacketOutputs<ClassifyInput, ClassifyOutput>("classify", cert)) {
    for (const p of output.proposedArchetypes ?? []) {
      if (known.has(p.id)) continue;
      const { itemIds, ...archetype } = p;
      const prior = proposals.get(p.id);
      proposals.set(p.id, { ...archetype, itemCount: (prior?.itemCount ?? 0) + itemIds.length });
    }
    for (const c of output.classifications ?? []) {
      const archetypeKnown = known.has(c.archetypeId) || proposals.has(c.archetypeId);
      if (!items.has(c.itemId) || !archetypeKnown) {
        rejected++;
        continue;
      }
      results.set(c.itemId, c);
    }
  }

  writeJson(paths.classifications(cert), [...results.values()]);
  writeJson(proposalsFile, [...proposals.values()].sort((a, b) => b.itemCount - a.itemCount));
  log("s8a", `${cert}: ${results.size}/${items.size} items classified, ${rejected} rejected, ${proposals.size} archetype proposals`);
}

/** Human review step: move a proposal into the archetype registry. */
export function acceptArchetype(cert: string, id: string): void {
  const proposalsFile = certFile(cert, "archetype-proposals.json");
  const proposals = readJsonIfExists<Array<Archetype & { itemCount: number }>>(proposalsFile, []);
  const proposal = proposals.find((p) => p.id === id);
  if (!proposal) throw new Error(`No proposal '${id}' in ${proposalsFile}`);
  const registry = readJson<{ artifacts: Archetype[] }>(paths.archetypes);
  if (registry.artifacts.some((a) => a.id === id)) throw new Error(`Archetype '${id}' already exists`);
  registry.artifacts.push({
    id: proposal.id,
    name: proposal.name,
    description: proposal.description,
    factType: proposal.factType,
    generationUse: proposal.generationUse,
  });
  writeJson(paths.archetypes, registry);
  writeJson(proposalsFile, proposals.filter((p) => p.id !== id));
  log("s8a", `accepted archetype ${id}`);
}

function rows(weights: Map<string, number>): DistributionRow[] {
  const total = [...weights.values()].reduce((a, b) => a + b, 0) || 1;
  return [...weights.entries()]
    .map(([key, count]) => ({ key, count: Math.round(count * 10) / 10, share: Math.round((count / total) * 1000) / 1000 }))
    .sort((a, b) => b.count - a.count);
}

export function computeDistribution(cert: string, items: ObservedItem[], classifications: Classification[]): Distribution {
  const byId = new Map(items.map((i) => [i.itemId, i]));
  const archetypes = new Map<string, number>();
  const formats = new Map<string, number>();
  const levels = new Map<string, number>();
  const domains = new Map<string, Map<string, number>>();
  const origins: Record<string, number> = {};
  const add = (m: Map<string, number>, k: string, w: number) => m.set(k, (m.get(k) ?? 0) + w);

  for (const c of classifications) {
    const item = byId.get(c.itemId);
    const w = item ? ORIGIN_WEIGHT[item.origin] : undefined;
    if (!item || w === undefined) continue; // unknown origins never shape the exam
    origins[item.origin] = (origins[item.origin] ?? 0) + 1;
    add(archetypes, c.archetypeId, w);
    add(formats, c.format, w);
    add(levels, c.cognitiveLevel, w);
    if (c.domainId) {
      if (!domains.has(c.domainId)) domains.set(c.domainId, new Map());
      add(domains.get(c.domainId)!, c.archetypeId, w);
    }
  }

  const global = rows(archetypes);
  const byDomain: Record<string, DistributionRow[]> = {};
  for (const [domainId, weights] of domains) {
    const n = [...weights.values()].reduce((a, b) => a + b, 0);
    byDomain[domainId] = n >= MIN_DOMAIN_ITEMS ? rows(weights) : global;
  }

  return {
    cert,
    basis: { observedItems: classifications.length, origins },
    archetypes: global,
    formats: rows(formats),
    cognitiveLevels: rows(levels),
    byDomain,
  };
}

export function runDistribution(cert: string): Distribution {
  const items = readJsonl<ObservedItem>(paths.observed(cert));
  const ids = new Set(items.map((i) => i.itemId));
  const classifications = readJsonIfExists<Classification[]>(paths.classifications(cert), []).filter((c) => ids.has(c.itemId));
  if (!classifications.length) throw new Error(`No classified official items for ${cert}; add samples/MeasureUp/dumps, then run observed and classify`);
  const distribution = computeDistribution(cert, items, classifications);
  if (distribution.basis.observedItems < MIN_EVIDENCE) {
    log("s8c", `warning: only ${distribution.basis.observedItems} official items (< ${MIN_EVIDENCE}); shares are not reliable`);
  }
  writeJson(certFile(cert, "distribution.json"), distribution);
  log("s8c", `${cert}: ${distribution.archetypes.length} archetypes over ${classifications.length} items; top: ${distribution.archetypes.slice(0, 4).map((r) => `${r.key} ${Math.round(r.share * 100)}%`).join(", ")}`);
  return distribution;
}
