// Server-side question bank helpers for Cloudflare Pages Functions.
// Mirrors the free/premium split used by the static site (lib/data.ts) so the
// premium API never returns a question the static pages already show for free.

import { calculateFreeQuestionsDistribution, FREE_QUESTIONS_PER_CERT } from "../../lib/free-questions";
import { QUESTION_BANK, QUESTION_BANK_CERTIFICATIONS } from "./question-bank.generated";

export type QuestionScope = "premium" | "all";

type BankQuestion = { id: string } & Record<string, unknown>;

export function isKnownCertification(certSlug: string): boolean {
  return Object.prototype.hasOwnProperty.call(QUESTION_BANK, certSlug);
}

export function isKnownTopic(certSlug: string, topicSlug: string): boolean {
  if (!isKnownCertification(certSlug)) return false;
  return QUESTION_BANK[certSlug].topics.some((topic) => topic.slug === topicSlug);
}

function topicQuestions(certSlug: string, topicSlug: string): BankQuestion[] {
  return (QUESTION_BANK[certSlug]?.questions[topicSlug] || []) as BankQuestion[];
}

/**
 * Returns the questions for a certification (optionally one topic).
 *
 * scope "premium" excludes the free questions exactly like the static pages do:
 * - certification pages: first N per topic via the 15-question distribution,
 *   or nothing when the certification has allQuestionsFree set.
 * - topic pages: first N of that topic via the same distribution.
 *
 * scope "all" returns every question (free + premium), used by mock exams.
 */
export function getQuestions(certSlug: string, options: { topic?: string; scope?: QuestionScope } = {}): BankQuestion[] {
  const bank = QUESTION_BANK[certSlug];
  if (!bank) return [];

  const scope = options.scope || "premium";
  const topics = options.topic ? bank.topics.filter((topic) => topic.slug === options.topic) : bank.topics;
  const distribution = calculateFreeQuestionsDistribution(bank.topics, FREE_QUESTIONS_PER_CERT);
  const allQuestionsFree = !options.topic &&
    QUESTION_BANK_CERTIFICATIONS.some((cert) => cert.slug === certSlug && cert.allQuestionsFree);

  const questions: BankQuestion[] = [];
  for (const topic of topics) {
    const all = topicQuestions(certSlug, topic.slug);
    if (scope === "all") {
      questions.push(...all);
      continue;
    }
    if (allQuestionsFree) continue;
    questions.push(...all.slice(distribution.get(topic.slug) || 0));
  }

  return questions;
}
