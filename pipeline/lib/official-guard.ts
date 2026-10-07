// Guard against republishing official exam items (blueprint samples, MeasureUp, dumps).
// We may learn structure and tested facts from them, but never publish their questions.
// Three layers:
//   1. blockedPairs: never instantiate an official item's own (template, fact) combination
//   2. tooCloseToOfficial: reject generated wording or options that resemble an official item
//   3. publish runs check 2 again over everything it's about to write
import fs from "node:fs";
import { paths, readJsonIfExists, readJsonl } from "./io";
import { jaccard, normalize, tokens } from "./text";
import type { ObservedItem } from "./types";

/** Stems this similar are copies, whatever the options. */
const STEM_COPY = 0.6;
/** Moderately similar stems with mostly the same options are copies too. */
const STEM_NEAR = 0.4;
const OPTION_OVERLAP = 0.75;

export interface OfficialFingerprint {
  itemId: string;
  origin: ObservedItem["origin"];
  stem: Set<string>;
  options: Set<string>;
}

export function officialFingerprints(cert: string): OfficialFingerprint[] {
  return readJsonl<ObservedItem>(paths.observed(cert)).map((i) => ({
    itemId: i.itemId,
    origin: i.origin,
    stem: tokens(i.stem),
    options: new Set(i.options.map(normalize)),
  }));
}

export interface Closeness {
  itemId: string;
  stemSimilarity: number;
  optionOverlap: number;
}

/** The official item closest to a question, by stem similarity and then option overlap. */
export function closestOfficial(stem: string, options: string[], official: OfficialFingerprint[]): Closeness | null {
  const stemTokens = tokens(stem);
  const opts = options.map(normalize);
  let best: Closeness | null = null;
  for (const o of official) {
    const stemSimilarity = jaccard(stemTokens, o.stem);
    const optionOverlap = opts.length ? opts.filter((x) => o.options.has(x)).length / opts.length : 0;
    if (!best || stemSimilarity > best.stemSimilarity || (stemSimilarity === best.stemSimilarity && optionOverlap > best.optionOverlap)) {
      best = { itemId: o.itemId, stemSimilarity, optionOverlap };
    }
  }
  return best;
}

export function tooCloseToOfficial(c: Closeness | null): boolean {
  if (!c) return false;
  return c.stemSimilarity >= STEM_COPY || (c.stemSimilarity >= STEM_NEAR && c.optionOverlap >= OPTION_OVERLAP);
}

/** (templateId|factId) pairs official items already use: generating one would rebuild that item. */
export function blockedPairs(cert: string): Set<string> {
  const file = `${paths.quarantine}/${cert}/parameterizations.json`;
  if (!fs.existsSync(file)) return new Set();
  const params = readJsonIfExists<Array<{ templateId: string | null; groundedFactId: string | null; linkedFactId: string | null }>>(file, []);
  const pairs = new Set<string>();
  for (const p of params) {
    if (!p.templateId) continue;
    for (const factId of [p.groundedFactId, p.linkedFactId]) if (factId) pairs.add(`${p.templateId}|${factId}`);
  }
  return pairs;
}
