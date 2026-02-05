import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCertificationBySlug,
  getTopicBySlug,
  getFreeQuestionsForTopic,
  getAllTopicSlugs,
} from "@/lib/data";
import { generateBreadcrumbJsonLd, breadcrumbs } from "@/lib/breadcrumbs";
import { getCanonicalUrl } from "@/lib/seo";
import QuestionCard from "@/components/QuestionCard";

interface Props {
  params: Promise<{
    cert: string;
    topic: string;
  }>;
}

export async function generateStaticParams() {
  return getAllTopicSlugs().map((slug) => ({
    cert: slug.certification,
    topic: slug.topic,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cert, topic } = await params;
  
  const certification = getCertificationBySlug(cert);
  const topicData = getTopicBySlug(cert, topic);
  
  if (!certification || !topicData) {
    return {
      title: "Topic Not Found",
    };
  }

  const title = `Free ${certification.name} ${topicData.name} Practice Questions | SNReady`;
  const description = `Practice free ServiceNow ${certification.name} questions for ${topicData.name}. Test your knowledge before the exam with our curated selection of practice questions.`;
  
  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/free-questions/${cert}/${topic}`),
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl(`/free-questions/${cert}/${topic}`),
      images: ['/og-default.png'],
    },
    twitter: {
      title,
      description,
      images: ['/og-default.png'],
    },
  };
}

export default async function FreeQuestionsPage({ params }: Props) {
  const { cert, topic } = await params;
  
  const certification = getCertificationBySlug(cert);
  const topicData = getTopicBySlug(cert, topic);
  const freeQuestions = await getFreeQuestionsForTopic(cert, topic);
  
  if (!certification || !topicData) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: certification.name, url: `/certifications/${cert}` },
    { name: "Free Questions", url: `/free-questions` },
    { name: topicData.name, url: `/free-questions/${cert}/${topic}` },
  ];

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How many free ${topicData.name} questions are available?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `We provide ${freeQuestions.length} free practice questions for ${topicData.name} in the ${certification.name} certification. These questions cover key concepts and exam patterns to help you prepare effectively.`,
        },
      },
      {
        "@type": "Question",
        name: `Are these questions similar to the actual ${certification.name} exam?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, our practice questions are designed to match the format, difficulty level, and content areas of the actual ${certification.name} certification exam.`,
        },
      },
      {
        "@type": "Question",
        name: "How can I access the full question bank?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `To unlock the complete question bank with detailed explanations, comprehensive coverage, and additional practice materials, upgrade to our full access plan.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbJsonLd(breadcrumbItems)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqData),
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-zinc-700">Home</Link>
            <span>→</span>
            <Link href={`/certifications/${cert}`} className="hover:text-zinc-700">
              {certification.name}
            </Link>
            <span>→</span>
            <span>Free Questions</span>
          </div>
          
          <h1 className="mt-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            Free {certification.name} Questions
          </h1>
          <h2 className="mt-2 text-2xl font-semibold text-emerald-600">
            {topicData.name}
          </h2>
          
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Practice with {freeQuestions.length} free questions from our {topicData.name} collection
          </p>
        </div>

        {/* Topic Introduction */}
        {topicData.introduction && (
          <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              About {topicData.name}
            </h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {topicData.introduction.overview}
            </p>
            {topicData.keyConcepts && topicData.keyConcepts.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Key Concepts:</h4>
                <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {topicData.keyConcepts.slice(0, 6).map((concept: string, index: number) => (
                    <li key={index} className="text-sm text-zinc-600 dark:text-zinc-400">
                      • {concept}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Questions */}
        <div className="mt-8 space-y-6">
          {freeQuestions.length > 0 ? (
            freeQuestions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                questionNumber={index + 1}
                showAnswer={false}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                No free questions available for this topic yet.
              </p>
              <p className="mt-2 text-zinc-500">
                Check back soon for updated content!
              </p>
            </div>
          )}
        </div>

        {/* Unlock CTA */}
        <div className="mt-12 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100 p-8 text-center dark:border-emerald-800 dark:from-emerald-950 dark:to-green-950">
          <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
            Unlock Full Access
          </h3>
          <p className="mt-2 text-emerald-700 dark:text-emerald-300">
            Get access to {topicData.questionCount} total questions for {topicData.name} with detailed explanations and exam insights
          </p>
          
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href={`/${cert}/questions/${topic}`}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Practice All Questions
            </Link>
            <Link
              href={`/certifications/${cert}`}
              className="inline-flex items-center justify-center rounded-lg border border-emerald-600 px-6 py-3 font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950"
            >
              View All Topics
            </Link>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href={`/practice-tests/${cert}`}
            className="rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Practice Test</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Full {certification.name} mock exam
            </p>
          </Link>
          <Link
            href={`/learn/${topic}`}
            className="rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Study Guide</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Learn {topicData.name} concepts
            </p>
          </Link>
          <Link
            href={`/study-guide/${cert}`}
            className="rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Exam Plan</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {certification.name} preparation strategy
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}