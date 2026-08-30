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
    slug: string;
  }>;
}

const CERT_LANDING_CONTENT: Record<
  string,
  {
    heroEyebrow: string;
    heroDescription: string;
    trustPoints: string[];
    featureHighlights: string[];
    roleFit: string[];
    urgencyNote: string;
  }
> = {
  "cis-itsm": {
    heroEyebrow: "Built for implementation specialists — not dump memorization.",
    heroDescription:
      "Practice the same decision patterns the real CIS-ITSM exam uses: incident vs. problem, CAB vs. ECAB, request fulfillment design, SLA behavior, and reporting tradeoffs.",
    trustPoints: [
      "140 scenario-style questions mapped across all 7 exam topics",
      "35 free questions before you pay anything",
      "Detailed explanations designed around official ServiceNow concepts",
    ],
    featureHighlights: [
      "Incident Management and Change Management each represent 20% of the exam",
      "Focus on implementation decisions, not just vocabulary recall",
      "One-time $9 access is far cheaper than a $315 exam retake",
    ],
    roleFit: [
      "Consultants implementing core ITSM workflows",
      "Admins moving from CSA into specialist delivery work",
      "Partners who need faster readiness before project staffing",
    ],
    urgencyNote:
      "If you're already booking the exam, use the free set to validate weak spots first — then unlock the full bank only if the scenarios feel shaky.",
  },
};

export async function generateStaticParams() {
  return getCertificationSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const certification = getCertificationBySlug(slug);

  if (!certification) {
    return {
      title: "Certification Not Found",
    };
  }

  const landingContent = CERT_LANDING_CONTENT[slug];
  const title = landingContent
    ? `${certification.name} Practice Questions - ${certification.release} Exam Prep | SNReady`
    : `${certification.name} Practice Questions - Free ${certification.name} Exam Prep | SNReady`;
  const description = landingContent
    ? `Practice ${getTotalQuestionCount(slug)}+ ${certification.name} exam questions for the ${certification.release} release. ${FREE_QUESTIONS_PER_CERT} free questions covering Incident, Change, Problem, Request, SLA, and reporting with detailed explanations.`
    : `Practice ${getTotalQuestionCount(slug)}+ ${certification.name} exam questions. ${FREE_QUESTIONS_PER_CERT} free questions with detailed explanations to help you pass your ServiceNow ${certification.fullName} certification.`;

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/${slug}/practice-questions`),
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl(`/${slug}/practice-questions`),
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
  const { slug } = await params;

  const certification = getCertificationBySlug(slug);
  const topics = getTopicsForCertification(slug);
  const domains = getDomainsForCertification(slug);
  const totalQuestions = getTotalQuestionCount(slug);
  const freeQuestionCount = getTotalFreeQuestionCount(slug);
  const isReady = isCertificationReady(slug);

  if (!certification) {
    notFound();
  }

  // Load questions if certification is ready
  const allQuestions = isReady ? await getAllQuestionsForCertification(slug) : [];
  const freeQuestions = isReady ? await getFreeQuestionsForCertification(slug) : [];
  const landingContent = CERT_LANDING_CONTENT[slug];
  const highestWeightDomains = [...domains]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);

  // Get premium questions (all questions minus the free ones, by ID)
  const freeQuestionIds = new Set(freeQuestions.map(q => q.id));
  const premiumQuestions = allQuestions.filter(q => !freeQuestionIds.has(q.id));

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Practice Questions", url: "/practice-questions" },
    { name: certification.name, url: `/${slug}/practice-questions` },
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
            <Link href="/practice-questions" className="hover:text-zinc-700 dark:hover:text-zinc-300">Practice Questions</Link>
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

            {landingContent && (
              <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6 shadow-sm dark:border-emerald-900 dark:from-emerald-950/40 dark:via-zinc-950 dark:to-cyan-950/30">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                    {landingContent.heroEyebrow}
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Pass the CIS-ITSM exam by practicing implementation decisions
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {landingContent.heroDescription}
                  </p>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                    {landingContent.trustPoints.map((point) => (
                      <li
                        key={point}
                        className="rounded-xl border border-white/70 bg-white/90 p-4 text-sm font-medium text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm text-emerald-700 dark:text-emerald-300">
                    {landingContent.urgencyNote}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      Most weighted domains
                    </h3>
                    <div className="mt-4 space-y-3">
                      {highestWeightDomains.map((domain) => (
                        <div key={domain.slug}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">
                              {domain.name}
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400">
                              {domain.percentage}%
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                            {domain.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      Best fit for
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {landingContent.roleFit.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">Why people convert:</span>{" "}
                      The free set is enough to diagnose gaps. The paid upgrade is there when you need the full question bank, mock exams, and lifetime updates.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Practice Questions Section */}
            <div id="questions" className="mt-12">
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
                examCost={certification.examDetails?.cost}
                freeQuestionCount={freeQuestionCount}
                featureHighlights={landingContent?.featureHighlights}
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
                    href={`/${slug}/practice-questions/${topic.slug}`}
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
                    href={`/${slug}`}
                    className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    Certification Details
                  </Link>
                  <Link
                    href={`/${slug}/prepare`}
                    className="inline-flex items-center justify-center rounded-lg border border-emerald-600 px-8 py-3 font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950"
                  >
                    View Exam Prep
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
                    href="/csa/practice-questions"
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
                  href="/csa/practice-questions"
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
                  href="/cis-df/practice-questions"
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
