/** Lowercase, strip punctuation and markdown escapes, collapse whitespace. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\\([()[\]_*])/g, "$1")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const STOPWORDS = new Set(
  "a an the of to in on for and or is are be by with which what when where how that this from as at it its can do does you your".split(" ")
);

export function tokens(text: string): Set<string> {
  return new Set(normalize(text).split(" ").filter((t) => t && !STOPWORDS.has(t)));
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
}

/**
 * True when `quote` appears in `source`, ignoring case, punctuation and whitespace. A quote
 * may join several verbatim fragments with "..." (lists spread over table rows or bullets).
 */
export function containsQuote(source: string, quote: string): boolean {
  const haystack = normalize(source);
  const fragments = quote.split(/\s*(?:\.\.\.|…)\s*/).map(normalize).filter(Boolean);
  return fragments.length > 0 && fragments.every((f) => haystack.includes(f));
}

/** Deterministic PRNG so instantiation and option shuffling are reproducible. */
export function seededRandom(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function shuffled<T>(items: T[], rand: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
