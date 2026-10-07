// Family-aware selection and ordering of questions (docs/question-pipeline.md §4, S14).
// Pipeline questions carry an identity: siblings from one template share a familyKey and
// look alike; questions testing the same fact share a knowledgeKey and give each other away.
// Questions without an identity are treated as unique.

interface Identified {
  id: string;
  identity?: { instanceId: string; familyKey: string; knowledgeKeys: string[] };
}

export interface SpacingRules {
  /** Minimum number of questions between two from the same template. */
  familyGap: number;
  /** Minimum number of questions between two testing the same fact. */
  knowledgeGap: number;
}

export const DEFAULT_SPACING: SpacingRules = { familyGap: 4, knowledgeGap: 8 };

const instanceOf = (q: Identified) => q.identity?.instanceId ?? q.id;

/**
 * Pick `count` questions, preferring ones whose facts aren't already covered, and never
 * two renderings of one instance. Input order is the preference order (shuffle first).
 */
export function selectDiverse<T extends Identified>(questions: T[], count: number): T[] {
  const instances = new Set<string>();
  const knowledge = new Set<string>();
  const picked: T[] = [];
  const deferred: T[] = [];
  for (const q of questions) {
    if (picked.length === count) break;
    if (instances.has(instanceOf(q))) continue;
    const keys = q.identity?.knowledgeKeys ?? [];
    if (keys.some((k) => knowledge.has(k))) {
      deferred.push(q);
      continue;
    }
    instances.add(instanceOf(q));
    keys.forEach((k) => knowledge.add(k));
    picked.push(q);
  }
  for (const q of deferred) {
    if (picked.length === count) break;
    if (instances.has(instanceOf(q))) continue;
    instances.add(instanceOf(q));
    picked.push(q);
  }
  return picked;
}

/**
 * Reorder so that siblings are spaced out. Greedy: at each position take the first
 * remaining question that breaks no rule; if every candidate breaks one, take the one whose
 * conflict is furthest back. Order is otherwise preserved, so shuffle first for randomness.
 */
export function sequenceQuestions<T extends Identified>(questions: T[], rules: SpacingRules = DEFAULT_SPACING): T[] {
  const remaining = [...questions];
  const out: T[] = [];
  const lastFamily = new Map<string, number>();
  const lastKnowledge = new Map<string, number>();

  /** How many positions ago the closest conflict was (Infinity = no conflict). */
  const conflictDistance = (q: T): number => {
    if (!q.identity) return Infinity;
    let distance = Infinity;
    const pos = out.length;
    const fam = lastFamily.get(q.identity.familyKey);
    if (fam !== undefined && pos - fam <= rules.familyGap) distance = Math.min(distance, pos - fam);
    for (const k of q.identity.knowledgeKeys) {
      const at = lastKnowledge.get(k);
      if (at !== undefined && pos - at <= rules.knowledgeGap) distance = Math.min(distance, pos - at);
    }
    return distance;
  };

  while (remaining.length) {
    let best = 0;
    let bestDistance = -1;
    for (let i = 0; i < remaining.length; i++) {
      const d = conflictDistance(remaining[i]);
      if (d === Infinity) {
        best = i;
        bestDistance = d;
        break;
      }
      if (d > bestDistance) {
        best = i;
        bestDistance = d;
      }
    }
    const [q] = remaining.splice(best, 1);
    if (q.identity) {
      lastFamily.set(q.identity.familyKey, out.length);
      for (const k of q.identity.knowledgeKeys) lastKnowledge.set(k, out.length);
    }
    out.push(q);
  }
  return out;
}
