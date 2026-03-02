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
  getFreeQuestionCountForTopic,
} from "@/lib/data";
import { breadcrumbs, generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import QuestionCard from "@/components/QuestionCard";
import { CheckoutButton } from "@/components/CheckoutButton";

interface PageProps {
  params: Promise<{ cert: string; topic: string; questionId: string }>;
}

export async function generateStaticParams() {
  const allIds = await getAllQuestionIds();
  return allIds.map(({ certification, topic, questionId }) => ({
    cert: certification,
    topic,
    questionId,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { cert, topic: topicSlug, questionId } = await params;
  const certification = getCertificationBySlug(cert);
  const topic = getTopicBySlug(cert, topicSlug);
  const question = await getQuestionById(cert, topicSlug, questionId);

  if (!certification || !topic || !question) {
    return { title: "Question Not Found" };
  }

  const questionIndex = await getQuestionIndex(cert, topicSlug, questionId);
  const questionPreview = question.question.slice(0, 120) + (question.question.length > 120 ? "..." : "");

  return {
    title: `${certification.name} ${topic.name} Q${questionIndex} - Practice Question`,
    description: `${questionPreview} Practice this ${topic.name} question for your ServiceNow ${certification.name} certification exam.`,
    keywords: [
      `${certification.name} exam question`,
      `ServiceNow ${topic.name} question`,
      `${certification.name} practice test`,
      `${topic.name} quiz`,
      `ServiceNow certification question`,
    ],
    alternates: {
      canonical: `/practice-questions/${cert}/${topicSlug}/${questionId}`,
    },
    openGraph: {
      title: `${certification.name} ${topic.name} Practice Question | SNReady`,
      description: questionPreview,
    },
  };
}

export default async function QuestionPage({ params }: PageProps) {
  const { cert, topic: topicSlug, questionId } = await params;
  const certification = getCertificationBySlug(cert);
  const topic = getTopicBySlug(cert, topicSlug);
  const question = await getQuestionById(cert, topicSlug, questionId);

  if (!certification || !topic || !question) {
    notFound();
  }

  const questionIndex = await getQuestionIndex(cert, topicSlug, questionId);
  const { prev, next } = await getAdjacentQuestions(cert, topicSlug, questionId);
  const freeCount = getFreeQuestionCountForTopic(cert, topicSlug);
  const isFreeQuestion = questionIndex <= freeCount;

  // JSON-LD structured data - FAQ schema for question
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: question.question,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            typeof question.explanation === "string"
              ? question.explanation
              : question.explanation?.correct || "",
        },
      },
    ],
  };

  // JSON-LD structured data - Breadcrumb schema
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(
    breadcrumbs.question(
      certification.name,
      cert,
      topic.name,
      topicSlug,
      questionIndex,
      questionId
    )
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen">
        {/* Breadcrumb */}
        <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-zinc-500">
              <Link
                href="/"
                className="hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href={`/${cert}`}
                className="hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                {certification.name}
              </Link>
              <span>/</span>
              <Link
                href={`/practice-questions/${cert}/${topicSlug}`}
                className="hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                {topic.name}
              </Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-zinc-100">
                Q{questionIndex}
              </span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-emerald-600">
                {certification.name} · {topic.name}
              </span>
              <h1 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Question {questionIndex} of {topic.questionCount}
              </h1>
            </div>
            {isFreeQuestion ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                Free
              </span>
            ) : (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                Premium
              </span>
            )}
          </div>

          {/* Question Card */}
          <QuestionCard
            question={question}
            questionNumber={questionIndex}
            showAnswer={isFreeQuestion}
          />

          {/* Premium Upsell (if locked) */}
          {!isFreeQuestion && (
            <div className="mt-6 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
              <h3 className="text-lg font-semibold">
                Unlock This Question & More
              </h3>
              <p className="mt-2 text-emerald-100">
                Get access to all {topic.questionCount} {topic.name} questions
                with detailed explanations.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <CheckoutButton
                  certification={certification.name}
                  plan="30day"
                  className="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30"
                >
                  {certification.name} — $9
                </CheckoutButton>
                <CheckoutButton
                  certification={certification.name}
                  plan="lifetime"
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
                >
                  All Certs — $49
                </CheckoutButton>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
            {prev ? (
              <Link
                href={`/practice-questions/${cert}/${topicSlug}/${prev.id}`}
                className="flex items-center gap-2 text-sm text-zinc-600 hover:text-emerald-600 dark:text-zinc-400"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous Question
              </Link>
            ) : (
              <span />
            )}

            <Link
              href={`/practice-questions/${cert}/${topicSlug}`}
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              All {topic.name} Questions
            </Link>

            {next ? (
              <Link
                href={`/practice-questions/${cert}/${topicSlug}/${next.id}`}
                className="flex items-center gap-2 text-sm text-zinc-600 hover:text-emerald-600 dark:text-zinc-400"
              >
                Next Question
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ) : (
              <span />
            )}
          </div>

          {/* Related Topics */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              More {certification.name} Practice
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/practice-questions/${cert}`}
                className="rounded-lg bg-zinc-100 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                All Topics
              </Link>
              <Link
                href={`/${cert}/mock-exam`}
                className="rounded-lg bg-emerald-100 px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
              >
                Take Mock Exam
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
