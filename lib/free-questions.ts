// Shared free-question rules. Imported by both the Next.js static build (lib/data.ts)
// and Cloudflare Pages Functions (functions/lib/question-bank.ts), so keep this file
// dependency-free and use relative imports only.

// Free questions: 15 total per certification, distributed across topics
export const FREE_QUESTIONS_PER_CERT = 15;

export interface TopicQuestionCount {
  slug: string;
  questionCount: number;
}

// Calculate how many free questions each topic gets based on total distribution
export function calculateFreeQuestionsDistribution(
  topics: TopicQuestionCount[],
  totalFree: number = FREE_QUESTIONS_PER_CERT
): Map<string, number> {
  const distribution = new Map<string, number>();

  if (topics.length === 0) return distribution;

  const perTopic = Math.floor(totalFree / topics.length);
  let remainder = totalFree % topics.length;

  for (const topic of topics) {
    // Give each topic the base amount, plus 1 extra for first 'remainder' topics
    const count = perTopic + (remainder > 0 ? 1 : 0);
    distribution.set(topic.slug, Math.min(count, topic.questionCount));
    if (remainder > 0) remainder--;
  }

  return distribution;
}
