// S5 Fact extraction (agent stage).
//   facts:packets  chunks → packets for an agent (pipeline/prompts/extract-facts.md)
//   facts:ingest   packet outputs → validated, deduped data/pipeline/<cert>/facts.json
import { FACT_TYPE_BY_NAME, FACT_TYPES } from "../lib/fact-types";
import { factId } from "../lib/ids";
import { certFile, log, readJson, readJsonIfExists, readJsonl, writeJson } from "../lib/io";
import { existingPackets, readPacketOutputs, writePackets } from "../lib/packets";
import { containsQuote } from "../lib/text";
import type { Chunk, CorpusPage, Fact } from "../lib/types";
import { chunksFile } from "./s4-chunk";

const STAGE = "facts";
const PACKET_CHARS = 20000;
const MAX_ITEM_CHARS = 120; // values become answer options

interface FactsInput {
  factTypes: typeof FACT_TYPES;
  chunks: Array<Pick<Chunk, "chunkId" | "pageTitle" | "heading" | "canonicalUrl" | "text">>;
}

interface RawFact {
  chunkId: string;
  factType: string;
  subject: string;
  value: string | string[];
  context?: string;
  quote: string;
}

export function runFactPackets(cert: string, opts: { domain?: string; limit?: number }): void {
  const corpus = readJson<{ pages: CorpusPage[] }>(certFile(cert, "corpus.json"));
  const depth = new Map(corpus.pages.map((p) => [p.subpath, p.depth]));
  const done = new Set(readJsonIfExists<{ processedChunks: string[] }>(certFile(cert, "facts.json"), { processedChunks: [] }).processedChunks);
  const prior = existingPackets<FactsInput>(STAGE, cert);
  for (const input of prior.inputs) for (const c of input.chunks) done.add(c.chunkId);

  // Pages closest to a blueprint seed first: they are the most exam-relevant.
  const chunks = readJsonl<Chunk>(chunksFile(cert))
    .filter((c) => !done.has(c.chunkId))
    .filter((c) => !opts.domain || c.domainIds.includes(opts.domain))
    .sort((a, b) => (depth.get(a.subpath) ?? 9) - (depth.get(b.subpath) ?? 9) || a.subpath.localeCompare(b.subpath));

  const packets: Array<{ id: string; input: FactsInput }> = [];
  let current: FactsInput["chunks"] = [];
  let size = 0;
  const flush = () => {
    if (!current.length) return;
    packets.push({ id: `facts-${String(prior.next + packets.length).padStart(3, "0")}`, input: { factTypes: FACT_TYPES, chunks: current } });
    current = [];
    size = 0;
  };
  for (const c of chunks) {
    if (size + c.text.length > PACKET_CHARS) flush();
    if (opts.limit && packets.length >= opts.limit) break;
    current.push({ chunkId: c.chunkId, pageTitle: c.pageTitle, heading: c.heading, canonicalUrl: c.canonicalUrl, text: c.text });
    size += c.text.length;
  }
  if (!opts.limit || packets.length < opts.limit) flush();

  writePackets(STAGE, cert, "extract-facts.md", packets);
  const chunkCount = packets.reduce((n, p) => n + p.input.chunks.length, 0);
  log("s5", `${cert}: wrote ${packets.length} packets covering ${chunkCount} of ${chunks.length} unprocessed chunks`);
}

/** Returns a rejection reason, or null when the raw fact is usable. */
export function rejectFact(raw: RawFact, chunk: Chunk | undefined): string | null {
  const spec = FACT_TYPE_BY_NAME.get(raw.factType);
  if (!spec) return `unknown factType '${raw.factType}'`;
  if (!chunk) return `unknown chunkId '${raw.chunkId}'`;
  if (!raw.subject?.trim()) return "empty subject";
  if (!raw.quote?.trim() || !containsQuote(chunk.text, raw.quote)) return "quote not found in chunk";
  const isList = spec.valueKind !== "text";
  if (isList !== Array.isArray(raw.value)) return `value must be ${isList ? "a list" : "a string"}`;
  const items = Array.isArray(raw.value) ? raw.value : [raw.value];
  if (items.some((v) => typeof v !== "string" || !v.trim())) return "empty value";
  if (items.some((v) => v.length > MAX_ITEM_CHARS)) return "value too long for an answer option";
  if (isList && items.length < 3) return "list needs at least 3 items";
  // List items are often spread over table rows the quote can't span, so check each item.
  if (isList && items.some((v) => !containsQuote(chunk.text, v))) return "list item not found in chunk";
  return null;
}

export function runFactIngest(cert: string): Fact[] {
  const chunks = new Map(readJsonl<Chunk>(chunksFile(cert)).map((c) => [c.chunkId, c]));
  const existing = readJsonIfExists<{ facts: Fact[]; processedChunks: string[] }>(certFile(cert, "facts.json"), {
    facts: [],
    processedChunks: [],
  });
  // Re-check stored facts too, so tightened rules apply to earlier runs.
  const facts = new Map(existing.facts.filter((f) => rejectFact(f, chunks.get(f.chunkId)) === null).map((f) => [f.factId, f]));
  const processed = new Set(existing.processedChunks);
  const rejections = new Map<string, number>();

  for (const { packet, output } of readPacketOutputs<FactsInput, { facts: RawFact[] }>(STAGE, cert)) {
    for (const c of packet.input.chunks) processed.add(c.chunkId);
    for (const raw of output.facts ?? []) {
      const chunk = chunks.get(raw.chunkId);
      const reason = rejectFact(raw, chunk);
      if (reason || !chunk) {
        rejections.set(reason ?? "", (rejections.get(reason ?? "") ?? 0) + 1);
        continue;
      }
      const spec = FACT_TYPE_BY_NAME.get(raw.factType)!;
      const value = Array.isArray(raw.value) ? raw.value.map((v) => v.trim()) : raw.value.trim();
      const base = { factType: raw.factType, subject: raw.subject.trim(), relation: spec.relation, value };
      const id = factId(base);
      const prior = facts.get(id);
      if (prior) {
        prior.domainIds = [...new Set([...prior.domainIds, ...chunk.domainIds])];
        prior.objectiveIds = [...new Set([...prior.objectiveIds, ...chunk.objectiveIds])];
        continue;
      }
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
      });
    }
  }

  const list = [...facts.values()].sort((a, b) => a.factType.localeCompare(b.factType) || a.subject.localeCompare(b.subject));
  writeJson(certFile(cert, "facts.json"), { cert, processedChunks: [...processed].sort(), facts: list });
  const byType = Object.fromEntries(FACT_TYPES.map((t) => [t.factType, list.filter((f) => f.factType === t.factType).length]));
  log("s5", `${cert}: ${list.length} facts from ${processed.size} chunks ${JSON.stringify(byType)}`);
  if (rejections.size) log("s5", `rejected: ${JSON.stringify(Object.fromEntries(rejections))}`);
  return list;
}
