import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCertificationBySlug,
  getTopicBySlug,
  getTopicsForCertification,
  getQuestionsForTopic,
  getAllTopicSlugs,
} from "@/lib/data";
import { breadcrumbs, generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import QuestionCard from "@/components/QuestionCard";
import TopicIntroduction from "@/components/TopicIntroduction";

interface PageProps {
  params: Promise<{ certification: string; topic: string }>;
}

export async function generateStaticParams() {
  return getAllTopicSlugs().map(({ certification, topic }) => ({
    certification,
    topic,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { certification, topic: topicSlug } = await params;
  const cert = getCertificationBySlug(certification);
  const topic = getTopicBySlug(certification, topicSlug);

  if (!cert || !topic) {
    return { title: "Topic Not Found" };
  }

  return {
    title: `${cert.name} ${topic.name} Exam Questions - Practice Test`,
    description: `Practice ${topic.questionCount}+ ${topic.name} questions for the ServiceNow ${cert.name} exam. Free sample questions with detailed explanations.`,
    keywords: [
      `${cert.name} ${topic.name} questions`,
      `ServiceNow ${topic.name} exam`,
      `${cert.name} practice test`,
      `${topic.name} quiz`,
      `ServiceNow ${cert.name} ${topic.name}`,
    ],
    alternates: {
      canonical: `/${certification}/questions/${topicSlug}`,
    },
    openGraph: {
      title: `${cert.name} ${topic.name} Questions | SNReady`,
      description: `Master ${topic.name} for the ServiceNow ${cert.name} exam with ${topic.questionCount}+ practice questions.`,
    },
  };
}

export default async function TopicQuestionsPage({ params }: PageProps) {
  const { certification, topic: topicSlug } = await params;
  const cert = getCertificationBySlug(certification);
  const topic = getTopicBySlug(certification, topicSlug);

  if (!cert || !topic) {
    notFound();
  }

  const questions = await getQuestionsForTopic(certification, topicSlug);
  const allTopics = getTopicsForCertification(certification);

  // JSON-LD structured data for FAQ
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.slice(0, 5).map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.explanation,
      },
    })),
  };

  // JSON-LD structured data - Breadcrumb schema
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(
    breadcrumbs.topic(cert.name, certification, topic.name, topicSlug)
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
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-zinc-500">
              <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">
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
              <span className="text-zinc-900 dark:text-zinc-100">{topic.name}</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <section className="bg-gradient-to-b from-emerald-50 to-white py-12 dark:from-zinc-900 dark:to-zinc-950">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/certifications/${certification}`}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    {cert.name} Certification
                  </Link>
                </div>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {topic.name} Questions
                </h1>
                <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
                  {topic.description}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
                  <span>{topic.questionCount} total questions</span>
                  <span className="text-emerald-600">
                    {topic.freeQuestionCount} free questions
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href={`/practice-tests/${certification}`}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Full {cert.name} Mock Exam
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Topic Introduction */}
          <TopicIntroduction topic={topic} />

          <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
            {/* Questions */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Practice Questions
                </h2>
                <span className="text-sm text-zinc-500">
                  {questions.length} questions available
                </span>
              </div>

              {questions.length > 0 ? (
                questions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    questionNumber={index + 1}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-zinc-500">
                    Questions for this topic are coming soon!
                  </p>
                  <Link
                    href={`/certifications/${certification}`}
                    className="mt-4 inline-flex text-emerald-600 hover:text-emerald-700"
                  >
                    Explore other {cert.name} topics →
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Key Concepts */}
              <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Key Concepts
                </h3>
                <ul className="mt-4 space-y-2">
                  {topic.keyConcepts.map((concept, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                    >
                      <span className="text-emerald-500">•</span>
                      {concept}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Other Topics */}
              <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Other {cert.name} Topics
                </h3>
                <ul className="mt-4 space-y-2">
                  {allTopics
                    .filter((t) => t.slug !== topicSlug)
                    .slice(0, 6)
                    .map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/${certification}/questions/${t.slug}`}
                          className="flex items-center justify-between text-sm text-zinc-600 hover:text-emerald-600 dark:text-zinc-400"
                        >
                          <span>{t.name}</span>
                          <span className="text-zinc-400">
                            {t.questionCount}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
                <Link
                  href={`/certifications/${certification}`}
                  className="mt-4 inline-flex text-sm text-emerald-600 hover:text-emerald-700"
                >
                  View all topics →
                </Link>
              </div>

              {/* CTA */}
              <div className="rounded-xl bg-emerald-600 p-5 text-white dark:bg-emerald-700">
                <h3 className="font-semibold">Need more practice?</h3>
                <p className="mt-2 text-sm text-emerald-100">
                  Unlock all {topic.questionCount} questions for {topic.name}{" "}
                  with detailed explanations.
                </p>
                <button className="mt-4 w-full rounded-lg bg-white py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50">
                  Unlock Full Access
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
