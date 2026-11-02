// Display order for answer options.
//
// The question bank stores options as a, b, c, d with the correct answer skewed
// towards "b". Until the data is rebalanced, every question is shown with its
// options in a deterministic order seeded by the question id: the same order on
// the server (static HTML) and the client (no hydration mismatch), on every visit.
//
// Answers stay keyed by option id (question.correctAnswers, wrongAnswers[].choiceId,
// stored mock exam sessions), so only the order and the displayed letter change.
// Use optionLetter(index) for the letter shown to the user, never option.id.

import type { QuestionOption } from "@/types";

// Options whose meaning depends on their position stay last, in their original order.
const POSITIONAL_OPTION = /\b(all|none|both|neither) of the (above|preceding)\b/i;

export function isPositionalOption(text: string): boolean {
  return POSITIONAL_OPTION.test(text);
}

// FNV-1a, 32-bit
function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// mulberry32: small, fast, deterministic PRNG returning [0, 1)
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWith<T>(items: T[], random: () => number): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Shuffle options, keeping "All of the above"-style options at the end.
export function shuffleOptions<T extends Pick<QuestionOption, "text">>(
  options: T[],
  random: () => number = Math.random
): T[] {
  const movable = options.filter((option) => !isPositionalOption(option.text));
  const pinned = options.filter((option) => isPositionalOption(option.text));
  return [...shuffleWith(movable, random), ...pinned];
}

// Deterministic display order for a question's options, seeded by the question id.
export function orderOptionsForQuestion<T extends Pick<QuestionOption, "text">>(
  questionId: string,
  options: T[]
): T[] {
  return shuffleOptions(options, seededRandom(hashString(questionId)));
}

// Letter shown for the option at a display position: 0 → "A", 1 → "B", …
export function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

// Displayed letter for an option id within an already ordered option list.
export function letterForOptionId(options: Pick<QuestionOption, "id">[], optionId: string): string {
  const index = options.findIndex((option) => option.id === optionId);
  return index === -1 ? optionId.toUpperCase() : optionLetter(index);
}
