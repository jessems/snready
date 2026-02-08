import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCertificationBySlug,
  getTopicsForCertification,
  getCertificationSlugs,
  getTotalQuestionCount,
  getTotalFreeQuestionCount,
  isCertificationReady,
  getDomainsForCertification,
  getAllQuestionsForCertification,
  getFreeQuestionsForCertification,
  FREE_QUESTIONS_PER_CERT,
} from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { getCanonicalUrl } from "@/lib/seo";
import { QuestionsWithPaywall } from "@/components/QuestionsWithPaywall";

interface Props {
  params: Promise<{
    cert: string;
  }>;
}

export async function generateStaticParams() {
  return getCertificationSlugs().map((slug) => ({
    cert: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cert } = await params;

  const certification = getCertificationBySlug(cert);

  if (!certification) {
    return {
      title: "Certification Not Found",
    };
  }

  const title = `${certification.name} Practice Questions - Free ${certification.name} Exam Prep | SNReady`;
  const description = `Practice ${getTotalQuestionCount(cert)}+ ${certification.name} exam questions. ${FREE_QUESTIONS_PER_CERT} free questions with detailed explanations to help you pass your ServiceNow ${certification.fullName} certification.`;

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/practice-tests/${cert}`),
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl(`/practice-tests/${cert}`),
      images: ['/og-default.png'],
    },
    twitter: {
      title,
      description,
      images: ['/og-default.png'],
    },
  };
}

export default async function PracticeTestPage({ params }: Props) {
  const { cert } = await params;

  const certification = getCertificationBySlug(cert);
  const topics = getTopicsForCertification(cert);
  const domains = getDomainsForCertification(cert);
  const totalQuestions = getTotalQuestionCount(cert);
  const freeQuestionCount = getTotalFreeQuestionCount(cert);
  const isReady = isCertificationReady(cert);

  if (!certification) {
    notFound();
  }

  // Load questions if certification is ready
  const allQuestions = isReady ? await getAllQuestionsForCertification(cert) : [];
  const freeQuestions = isReady ? await getFreeQuestionsForCertification(cert) : [];

  // Get premium questions (all questions minus the free ones, by ID)
  const freeQuestionIds = new Set(freeQuestions.map(q => q.id));
  const premiumQuestions = allQuestions.filter(q => !freeQuestionIds.has(q.id));

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Practice Tests", url: "/practice-tests" },
    { name: certification.name, url: `/practice-tests/${cert}` },
  ];

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${certification.name} Practice Questions`,
    description: `Comprehensive practice questions for the ${certification.name} certification exam. Includes ${totalQuestions}+ realistic questions with detailed explanations.`,
    provider: {
      "@type": "Organization",
      name: "SNReady",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT2H",
    },
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How many free ${certification.name} practice questions are available?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `We offer ${freeQuestionCount} free ${certification.name} practice questions covering all exam domains. These questions include detailed explanations to help you understand the concepts.`,
        },
      },
      {
        "@type": "Question",
        name: `How many questions are on the actual ${certification.name} exam?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The ${certification.name} exam contains ${certification.examDetails?.questionCount || '60'} questions. You have ${certification.examDetails?.duration || '90'} minutes to complete it with a passing score of ${certification.examDetails?.passingScore || '70'}%.`,
        },
      },
      {
        "@type": "Question",
        name: `Are these questions similar to the real ${certification.name} exam?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, our practice questions are designed to match the format, difficulty, and content areas of the actual ${certification.name} certification exam. Each question includes references to official ServiceNow documentation.`,
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
          __html: JSON.stringify(courseSchema),
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
            <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">Home</Link>
            <span>→</span>
            <Link href="/practice-tests" className="hover:text-zinc-700 dark:hover:text-zinc-300">Practice Tests</Link>
            <span>→</span>
            <span>{certification.name}</span>
          </div>

          <h1 className="mt-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            {certification.name} Practice Questions
          </h1>
          <p className="mt-2 text-xl text-emerald-600">
            {certification.fullName}
          </p>

          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            {isReady
              ? `${totalQuestions} practice questions across ${topics.length} topics • ${freeQuestionCount} free`
              : `Coming soon - Practice questions for ${certification.name}`
            }
          </p>
        </div>

        {isReady ? (
          <>
            {/* Exam Overview */}
            <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Exam Overview
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {certification.examDetails?.questionCount || '60'}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Exam Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {certification.examDetails?.duration || '90'} min
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {certification.examDetails?.passingScore || '70'}%
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Passing Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    ${certification.examDetails?.cost || '500'}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Exam Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {totalQuestions}+
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Practice Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {freeQuestionCount}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Free Questions</div>
                </div>
              </div>
            </div>

            {/* Practice Questions Section */}
            <div className="mt-12">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  Practice Questions
                </h2>
                <span className="text-sm text-zinc-500">
                  {allQuestions.length} questions from {topics.length} topics
                </span>
              </div>

              <QuestionsWithPaywall
                freeQuestions={freeQuestions}
                premiumQuestions={premiumQuestions}
                certification={certification.name}
                certSlug={cert}
              />
            </div>

            {/* Topics Quick Links */}
            <div className="mt-12 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Practice by Topic
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Focus on specific areas to strengthen your weak points
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic) => (
                  <Link
                    key={topic.slug}
                    href={`/${cert}/questions/${topic.slug}`}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 transition-colors hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-700 dark:hover:border-emerald-700 dark:hover:bg-emerald-950"
                  >
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {topic.name}
                    </span>
                    <span className="text-sm text-zinc-500">
                      {topic.questionCount} Q
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Domain Breakdown */}
            {domains && domains.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Exam Domains
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {domains.map((domain, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {domain.name}
                        </h3>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-sm font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          {domain.percentage}%
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {domain.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Resources */}
            <div className="mt-12 text-center">
              <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100 p-4 sm:p-8 dark:border-emerald-800 dark:from-emerald-950 dark:to-green-950">
                <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  More Study Resources
                </h2>
                <p className="mt-2 text-emerald-700 dark:text-emerald-300">
                  Explore additional materials to boost your exam preparation
                </p>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link
                    href={`/certifications/${cert}`}
                    className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    Certification Details
                  </Link>
                  <Link
                    href={`/study-guide/${cert}`}
                    className="inline-flex items-center justify-center rounded-lg border border-emerald-600 px-8 py-3 font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950"
                  >
                    View Study Guide
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Coming Soon */}
            <div className="mt-12 text-center">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-8 dark:border-zinc-700 dark:bg-zinc-900">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  Coming Soon
                </h2>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  The {certification.name} practice questions are currently being developed.
                </p>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                  While you wait, try our comprehensive CSA practice questions with detailed explanations.
                </p>

                <div className="mt-6">
                  <Link
                    href="/practice-tests/csa"
                    className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    Try CSA Practice Questions
                  </Link>
                </div>
              </div>
            </div>

            {/* Available Certifications */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Available Practice Questions
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link
                  href="/practice-tests/csa"
                  className="rounded-lg border border-zinc-200 p-6 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    CSA - Certified System Administrator
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    100+ practice questions across all domains
                  </p>
                  <span className="mt-2 inline-block text-sm font-medium text-emerald-600">
                    Available Now →
                  </span>
                </Link>
                <Link
                  href="/practice-tests/cis-df"
                  className="rounded-lg border border-zinc-200 p-6 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    CIS-DF - Certified Data Foundations
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    CMDB, CSDM, and data management practice questions
                  </p>
                  <span className="mt-2 inline-block text-sm font-medium text-emerald-600">
                    Available Now →
                  </span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
