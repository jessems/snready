// S6/S7 Observed-question corpus: OFFICIAL exam questions only, merged into
// <quarantine>/<cert>/observed.jsonl. Our own question bank is never a source: the exam shape
// must come from the real exam, not from how we wrote questions before.
//   sample     ServiceNow's blueprint sample items  <quarantine>/<cert>/samples/*.json   (S6a)
//   measureup  official practice exams (MeasureUp)   <quarantine>/<cert>/measureup/*.json
//   dump       purchased exam dumps                  <quarantine>/<cert>/dumps/*.json    (S6b)
// Import format for all three: an array of
//   { "stem": string, "options": string[], "correct": number[] | null, "domain"?: string }
import fs from "node:fs";
import path from "node:path";
import { hash, log, paths, readJson, writeJsonl } from "../lib/io";
import { jaccard, normalize, tokens } from "../lib/text";
import type { ObservedItem, ObservedOrigin } from "../lib/types";

const NEAR_DUPLICATE = 0.85;

export const ORIGIN_DIRS: Record<ObservedOrigin, string> = { sample: "samples", measureup: "measureup", dump: "dumps" };

interface ImportItem {
  stem: string;
  options: string[];
  correct: number[] | null;
  domain?: string;
}

export function observedItemId(stem: string, options: string[]): string {
  return "o_" + hash(normalize(stem) + "||" + options.map(normalize).sort().join("|"));
}

function fromQuarantine(cert: string, origin: ObservedOrigin): ObservedItem[] {
  const dir = path.join(paths.quarantine, cert, ORIGIN_DIRS[origin]);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json") && !f.endsWith(".meta.json"))
    .flatMap((file) =>
      readJson<ImportItem[]>(path.join(dir, file)).map((item, i) => ({
        itemId: observedItemId(item.stem, item.options),
        cert,
        origin,
        originRef: `${file}#${i}`,
        type: item.correct && item.correct.length > 1 ? "multiple_select" : "multiple_choice",
        stem: item.stem,
        options: item.options,
        correct: item.correct,
        domainHint: item.domain ?? null,
      }))
    );
}

/**
 * Exact and near-duplicate removal. Official samples win over MeasureUp, and MeasureUp over
 * dumps. `seenIn` records how many origins carried the item: an item repeated across dump
 * vendors is more likely to be a real exam item.
 */
export function dedupe(items: ObservedItem[]): Array<ObservedItem & { seenIn: number }> {
  const rank: Record<ObservedOrigin, number> = { sample: 0, measureup: 1, dump: 2 };
  const sorted = [...items].sort((a, b) => rank[a.origin] - rank[b.origin]);
  const kept: Array<ObservedItem & { seenIn: number; tokens: Set<string> }> = [];
  for (const item of sorted) {
    const itemTokens = tokens(item.stem + " " + item.options.join(" "));
    const dup = kept.find((k) => k.itemId === item.itemId || jaccard(k.tokens, itemTokens) >= NEAR_DUPLICATE);
    if (dup) dup.seenIn++;
    else kept.push({ ...item, seenIn: 1, tokens: itemTokens });
  }
  return kept.map((k) => {
    const { tokens: _unused, ...rest } = k; // eslint-disable-line @typescript-eslint/no-unused-vars
    return rest;
  });
}

export function runObserved(cert: string): ObservedItem[] {
  const all = (Object.keys(ORIGIN_DIRS) as ObservedOrigin[]).flatMap((origin) => fromQuarantine(cert, origin));
  const items = dedupe(all);
  writeJsonl(paths.observed(cert), items);
  const counts = Object.fromEntries((Object.keys(ORIGIN_DIRS) as ObservedOrigin[]).map((o) => [o, items.filter((i) => i.origin === o).length]));
  log("s7", `${cert}: ${items.length} observed items after dedupe of ${all.length} ${JSON.stringify(counts)} → ${paths.observed(cert)}`);
  return items;
}
