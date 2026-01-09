import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCertificationBySlug,
  getTopicBySlug,
  getQuestionById,
  getAllQuestionIds,
  getQuestionIndex,
  getAdjacentQuestions,
  getQuestionsForTopic,
} from "@/lib/data";
import { breadcrumbs, generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { truncateText } from "@/lib/seo";
import QuestionCard from "@/components/QuestionCard";

interface PageProps {
  params: Promise<{
    certification: string;
    topic: string;
    questionId: string;
  }>;
}

export async function generateStaticParams() {
  return getAllQuestionIds();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { certification, topic: topicSlug, questionId } = await params;
  const cert = getCertificationBySlug(certification);
  const topic = getTopicBySlug(certification, topicSlug);
  const question = await getQuestionById(certification, topicSlug, questionId);
  const questionNumber = await getQuestionIndex(
    certification,
    topicSlug,
    questionId
  );

  if (!cert || !topic || !question) {
    return { title: "Question Not Found" };
  }

  const truncatedQuestion = truncateText(question.question, 60);

  return {
    title: `${truncatedQuestion} - ${cert.name} ${topic.name}`,
    description: `${question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)} ${cert.name} ${topic.name} practice question. ${truncateText(question.explanation, 120)}`,
    keywords: [
      `${cert.name} ${topic.name} question`,
      `ServiceNow ${topic.name} practice`,
      `${cert.name} exam question`,
      `${question.difficulty} ${cert.name} question`,
    ],
    alternates: {
      canonical: `/${certification}/questions/${topicSlug}/${questionId}`,
    },
    openGraph: {
      title: `${cert.name} Practice Question #${questionNumber} | SNReady`,
      description: `Test your ${topic.name} knowledge with this ${question.difficulty} ${cert.name} exam question.`,
    },
  };
}

export default async function QuestionPage({ params }: PageProps) {
  const { certification, topic: topicSlug, questionId } = await params;
  const cert = getCertificationBySlug(certification);
  const topic = getTopicBySlug(certification, topicSlug);
  const question = await getQuestionById(certification, topicSlug, questionId);
  const questionNumber = await getQuestionIndex(
    certification,
    topicSlug,
    questionId
  );
  const { prev, next } = await getAdjacentQuestions(
    certification,
    topicSlug,
    questionId
  );
  const allQuestions = await getQuestionsForTopic(certification, topicSlug);

  if (!cert || !topic || !question) {
    notFound();
  }

  // Get related questions (excluding current)
  const relatedQuestions = allQuestions
    .filter((q) => q.id !== questionId)
    .slice(0, 4);

  // JSON-LD structured data - Breadcrumb schema
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(
    breadcrumbs.question(
      cert.name,
      certification,
      topic.name,
      topicSlug,
      questionNumber,
      questionId
    )
  );

  // JSON-LD structured data - Question/Answer schema
  const questionJsonLd = {
    "@context": "https://schema.org",
    "@type": "Question",
    name: question.question,
    text: question.question,
    answerCount: 1,
    acceptedAnswer: {
      "@type": "Answer",
      text: question.explanation,
      author: {
        "@type": "Organization",
        name: "SNReady",
      },
    },
    author: {
      "@type": "Organization",
      name: "SNReady",
    },
    dateCreated: new Date().toISOString(),
    about: {
      "@type": "Thing",
      name: `ServiceNow ${cert.name} ${topic.name}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(questionJsonLd) }}
      />

      <div className="min-h-screen">
        {/* Breadcrumb */}
        <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-zinc-500">
              <Link
                href="/"
                className="hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href={`/certifications/${certification}`}
                className="hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                {cert.name}
              </Link>
              <span>/</span>
              <Link
                href={`/${certification}/questions/${topicSlug}`}
                className="hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                {topic.name}
              </Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-zinc-100">
                Question {questionNumber}
              </span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <section className="bg-gradient-to-b from-emerald-50 to-white py-8 dark:from-zinc-900 dark:to-zinc-950">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Link
                href={`/certifications/${certification}`}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                {cert.name} Certification
              </Link>
              <span className="text-zinc-400">/</span>
              <Link
                href={`/${certification}/questions/${topicSlug}`}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                {topic.name}
              </Link>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {cert.name} {topic.name} - Question {questionNumber}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  question.difficulty === "easy"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : question.difficulty === "medium"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {question.difficulty}
              </span>
              <span className="text-sm text-zinc-500">
                {question.type === "single"
                  ? "Single choice"
                  : "Multiple choice"}
              </span>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
            {/* Question */}
            <div className="space-y-6">
              <QuestionCard question={question} questionNumber={questionNumber} />

              {/* Navigation */}
              <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                {prev ? (
                  <Link
                    href={`/${certification}/questions/${topicSlug}/${prev.id}`}
                    className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-emerald-600 dark:text-zinc-400"
                  >
                    <span>←</span>
                    <span>Previous Question</span>
                  </Link>
                ) : (
                  <span className="text-sm text-zinc-400">No previous</span>
                )}

                <Link
                  href={`/${certification}/questions/${topicSlug}`}
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  All {topic.name} Questions
                </Link>

                {next ? (
                  <Link
                    href={`/${certification}/questions/${topicSlug}/${next.id}`}
                    className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-emerald-600 dark:text-zinc-400"
                  >
                    <span>Next Question</span>
                    <span>→</span>
                  </Link>
                ) : (
                  <span className="text-sm text-zinc-400">No next</span>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Topic Overview */}
              <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  About {topic.name}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {topic.description}
                </p>
                <div className="mt-4 text-sm text-zinc-500">
                  <span>{topic.questionCount} total questions</span>
                </div>
              </div>

              {/* Related Questions */}
              {relatedQuestions.length > 0 && (
                <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    More {topic.name} Questions
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {relatedQuestions.map((q, index) => {
                      const qIndex = allQuestions.findIndex(
                        (aq) => aq.id === q.id
                      );
                      return (
                        <li key={q.id}>
                          <Link
                            href={`/${certification}/questions/${topicSlug}/${q.id}`}
                            className="flex items-start gap-2 text-sm text-zinc-600 hover:text-emerald-600 dark:text-zinc-400"
                          >
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-100 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                              {qIndex + 1}
                            </span>
                            <span className="line-clamp-2">
                              {truncateText(q.question, 60)}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <Link
                    href={`/${certification}/questions/${topicSlug}`}
                    className="mt-4 inline-flex text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    View all questions →
                  </Link>
                </div>
              )}

              {/* CTA */}
              <div className="rounded-xl bg-emerald-600 p-5 text-white dark:bg-emerald-700">
                <h3 className="font-semibold">Practice More?</h3>
                <p className="mt-2 text-sm text-emerald-100">
                  Take a full {cert.name} mock exam to test your readiness.
                </p>
                <Link
                  href={`/practice-tests/${certification}`}
                  className="mt-4 block w-full rounded-lg bg-white py-2 text-center text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
                >
                  Start Mock Exam
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
