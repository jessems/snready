// Server-side question bank helpers for Cloudflare Pages Functions.
// Mirrors the free/premium split used by the static site (lib/data.ts) so the
// premium API never returns a question the static pages already show for free.

import { isFreeCertification } from "../../lib/free-certs";
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

/**
 * True when every question for this certification is public: certifications listed in
 * lib/free-certs.ts, plus the legacy allQuestionsFree flag in certifications.json.
 * Matches isCertificationFree() in lib/data.ts used by the static pages.
 */
export function isCertificationFree(certSlug: string): boolean {
  return isFreeCertification(certSlug) ||
    QUESTION_BANK_CERTIFICATIONS.some((cert) => cert.slug === certSlug && cert.allQuestionsFree);
}

function topicQuestions(certSlug: string, topicSlug: string): BankQuestion[] {
  return (QUESTION_BANK[certSlug]?.questions[topicSlug] || []) as BankQuestion[];
}

/**
 * Returns the questions for a certification (optionally one topic).
 *
 * scope "premium" excludes the free questions exactly like the static pages do:
 * - certification pages: first N per topic via the 15-question distribution.
 * - topic pages: first N of that topic via the same distribution.
 * - free certifications (isCertificationFree): nothing, because the static pages
 *   already render every question.
 *
 * scope "all" returns every question (free + premium), used by mock exams.
 */
export function getQuestions(certSlug: string, options: { topic?: string; scope?: QuestionScope } = {}): BankQuestion[] {
  const bank = QUESTION_BANK[certSlug];
  if (!bank) return [];

  const scope = options.scope || "premium";
  const topics = options.topic ? bank.topics.filter((topic) => topic.slug === options.topic) : bank.topics;
  const distribution = calculateFreeQuestionsDistribution(bank.topics, FREE_QUESTIONS_PER_CERT);
  const allQuestionsFree = isCertificationFree(certSlug);

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
