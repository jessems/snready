// S8f Ground official items in the docs (agent stage). For each parameterized official item, find
// the docs fact that supports its answer. That fact is what the exam tests, in docs wording rather
// than the item's, and it drives restructured questions (same fact, different template).
//   ground:packets   item + top-ranked docs chunks → packet (quarantine: contains item text)
//   ground:ingest    validate facts like S5, add them to facts.json (examTargeted), link items
import { FACT_TYPE_BY_NAME } from "../lib/fact-types";
import { factId } from "../lib/ids";
import { certFile, log, paths, readJson, readJsonIfExists, readJsonl, writeJson } from "../lib/io";
import { existingPackets, readPacketOutputs, writePackets } from "../lib/packets";
import { tokens } from "../lib/text";
import type { Chunk, Fact, ObservedItem, Template } from "../lib/types";
import { chunksFile } from "./s4-chunk";
import { rejectFact } from "./s5-facts";
import { loadTemplates } from "./s8b-templates";
import { parameterizationsFile, runParameterizeIngest, type Parameterization } from "./s8e-parameterize";

const STAGE = "ground";
const CHUNKS_PER_ITEM = 6;
const ITEMS_PER_PACKET = 10;

export function factLinksFile(cert: string): string {
  return `${paths.quarantine}/${cert}/fact-links.json`;
}

/** Rank chunks by idf-weighted overlap with the query. Plain TF-IDF is enough to shortlist for an agent. */
export function rankChunks(query: string, chunks: Chunk[], k: number): Chunk[] {
  const q = tokens(query);
  const docTokens = chunks.map((c) => tokens(`${c.pageTitle} ${c.heading} ${c.text}`));
  const df = new Map<string, number>();
  for (const t of q) df.set(t, docTokens.filter((d) => d.has(t)).length);
  const idf = (t: string) => Math.log((chunks.length + 1) / ((df.get(t) ?? 0) + 1));
  return chunks
    .map((c, i) => ({ c, score: [...q].reduce((s, t) => s + (docTokens[i].has(t) ? idf(t) : 0), 0) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.c);
}

interface GroundOutput {
  items: Array<{
    itemId: string;
    fact: { chunkId: string; subject: string; value: string | string[]; context?: string; quote: string } | null;
    note?: string;
  }>;
}

export function runGroundPackets(cert: string): void {
  const items = new Map(readJsonl<ObservedItem>(paths.observed(cert)).map((i) => [i.itemId, i]));
  const templates = new Map(loadTemplates().map((t) => [t.templateId, t]));
  const links = readJsonIfExists<Record<string, string>>(factLinksFile(cert), {});
  const prior = existingPackets<{ items: Array<{ itemId: string }> }>(STAGE, cert);
  const packeted = new Set(prior.inputs.flatMap((i) => i.items.map((x) => x.itemId)));
  const chunks = readJsonl<Chunk>(chunksFile(cert));

  // Only items with an accepted, extractable template can be grounded into a usable fact.
  const todo = readJsonIfExists<Parameterization[]>(parameterizationsFile(cert), []).filter(
    (p) => p.templateId && templates.has(p.templateId) && FACT_TYPE_BY_NAME.has(templates.get(p.templateId)!.factType) && !p.groundedFactId && !links[p.itemId] && !packeted.has(p.itemId)
  );

  const entries = todo.map((p) => {
    const item = items.get(p.itemId)!;
    const template = templates.get(p.templateId!) as Template;
    const query = [p.bindings.subject, ...(Array.isArray(p.bindings.value) ? p.bindings.value : [p.bindings.value]), p.bindings.context, ...p.answer, item.stem].filter(Boolean).join(" ");
    return {
      itemId: p.itemId,
      stem: item.stem,
      options: item.options,
      answer: p.answer,
      template: { templateId: template.templateId, stem: template.stems[0], answer: template.answer, factType: template.factType },
      factTypeSpec: FACT_TYPE_BY_NAME.get(template.factType),
      bindings: p.bindings,
      chunks: rankChunks(query, chunks, CHUNKS_PER_ITEM).map((c) => ({ chunkId: c.chunkId, pageTitle: c.pageTitle, heading: c.heading, canonicalUrl: c.canonicalUrl, text: c.text })),
    };
  });

  const packets = [];
  for (let i = 0; i < entries.length; i += ITEMS_PER_PACKET) {
    packets.push({ id: `ground-${String(prior.next + packets.length).padStart(3, "0")}`, input: { items: entries.slice(i, i + ITEMS_PER_PACKET) } });
  }
  writePackets(STAGE, cert, "ground-items.md", packets);
  log("s8f", `${cert}: wrote ${packets.length} packets for ${entries.length} items`);
}

export function runGroundIngest(cert: string): void {
  const chunks = new Map(readJsonl<Chunk>(chunksFile(cert)).map((c) => [c.chunkId, c]));
  const templates = new Map(loadTemplates().map((t) => [t.templateId, t]));
  const params = new Map(readJsonIfExists<Parameterization[]>(parameterizationsFile(cert), []).map((p) => [p.itemId, p]));
  const store = readJson<{ cert: string; processedChunks: string[]; facts: Fact[] }>(certFile(cert, "facts.json"));
  const facts = new Map(store.facts.map((f) => [f.factId, f]));
  const links = readJsonIfExists<Record<string, string>>(factLinksFile(cert), {});
  let added = 0;
  let linked = 0;
  const rejected: string[] = [];

  for (const { output } of readPacketOutputs<unknown, GroundOutput>(STAGE, cert)) {
    for (const out of output.items ?? []) {
      const p = params.get(out.itemId);
      const template = p?.templateId ? templates.get(p.templateId) : undefined;
      if (!out.fact || !p || !template) continue;
      const spec = FACT_TYPE_BY_NAME.get(template.factType)!;
      const raw = { ...out.fact, factType: template.factType };
      const chunk = chunks.get(raw.chunkId);
      const reason = rejectFact(raw, chunk);
      if (reason || !chunk) {
        rejected.push(`${out.itemId}: ${reason}`);
        continue;
      }
      const value = Array.isArray(raw.value) ? raw.value.map((v) => v.trim()) : raw.value.trim();
      const base = { factType: raw.factType, subject: raw.subject.trim(), relation: spec.relation, value };
      const id = factId(base);
      if (!facts.has(id)) {
        facts.set(id, {
          factId: id,
          ...base,
          ...(raw.context?.trim() ? { context: raw.context.trim() } : {}),
          quote: raw.quote.trim(),
          chunkId: chunk.chunkId,
          sourceUrl: chunk.canonicalUrl,
          release: chunk.release,
          domainIds: chunk.domainIds,
          objectiveIds: chunk.objectiveIds,
          examTargeted: true,
        });
        added++;
      } else facts.get(id)!.examTargeted = true;
      links[out.itemId] = id;
      linked++;
    }
  }

  const list = [...facts.values()].sort((a, b) => a.factType.localeCompare(b.factType) || a.subject.localeCompare(b.subject));
  writeJson(certFile(cert, "facts.json"), { ...store, facts: list });
  writeJson(factLinksFile(cert), links);
  log("s8f", `${cert}: ${linked} items linked to docs facts (${added} new exam-targeted facts)${rejected.length ? `; rejected: ${rejected.join("; ")}` : ""}`);
  // Re-check every item with its new link: exact answer match → grounded, otherwise linked.
  runParameterizeIngest(cert);
}
