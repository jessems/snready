import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCertificationBySlug,
  getTopicsForCertification,
  getCertificationSlugs,
  getTotalQuestionCount,
  isCertificationReady,
  getDomainsForCertification,
} from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { getCanonicalUrl } from "@/lib/seo";

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

  const title = `${certification.name} Practice Test - Free Mock Exam | SNReady`;
  const description = `Take a free ${certification.name} practice test. Realistic ${certification.name} exam simulation with detailed explanations to help you pass your ServiceNow certification.`;
  
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
  const isReady = isCertificationReady(cert);
  
  if (!certification) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Practice Tests", url: "/practice-tests" },
    { name: certification.name, url: `/practice-tests/${cert}` },
  ];

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${certification.name} Practice Test`,
    description: `Comprehensive practice test for the ${certification.name} certification exam. Includes realistic questions and detailed explanations.`,
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
        name: `How many questions are in the ${certification.name} practice test?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The ${certification.name} practice test contains ${certification.examDetails?.questionCount || 'approximately 60'} questions, matching the actual exam format.`,
        },
      },
      {
        "@type": "Question",
        name: `How long do I have to complete the practice test?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `You have ${certification.examDetails?.duration || '90 minutes'} to complete the practice test, matching the actual exam duration.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the passing score?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The passing score is ${certification.examDetails?.passingScore || '70%'}, which matches the actual ${certification.name} exam requirement.`,
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
            <Link href="/" className="hover:text-zinc-700">Home</Link>
            <span>→</span>
            <Link href="/practice-tests" className="hover:text-zinc-700">Practice Tests</Link>
            <span>→</span>
            <span>{certification.name}</span>
          </div>
          
          <h1 className="mt-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            {certification.name} Practice Test
          </h1>
          <p className="mt-2 text-xl text-emerald-600">
            Free Mock Exam - {certification.name}
          </p>
          
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            {isReady 
              ? `Simulate the real exam with ${totalQuestions} practice questions`
              : `Coming soon - Practice exam for ${certification.name}`
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
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {certification.examDetails?.questionCount || '60'}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {certification.examDetails?.duration || '90 min'}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {certification.examDetails?.passingScore || '70%'}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Passing Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    ${certification.examDetails?.cost || '500'}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Exam Cost</div>
                </div>
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
                        <span className="text-sm font-medium text-emerald-600">
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

            {/* Topics Overview */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Topics Covered
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic) => (
                  <div key={topic.slug} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {topic.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {topic.questionCount} questions
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Link
                        href={`/${cert}/questions/${topic.slug}`}
                        className="text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        Practice
                      </Link>
                      <Link
                        href={`/free-questions/${cert}/${topic.slug}`}
                        className="text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        Free Questions
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Practice Test CTA */}
            <div className="mt-12 text-center">
              <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100 p-4 sm:p-8 dark:border-emerald-800 dark:from-emerald-950 dark:to-green-950">
                <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  Ready to Test Your Knowledge?
                </h2>
                <p className="mt-2 text-emerald-700 dark:text-emerald-300">
                  Take the full practice exam or choose specific topics to focus on
                </p>
                
                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link
                    href={`/certifications/${cert}`}
                    className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    Start Practice Test
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
                  The {certification.name} practice test is currently being developed.
                </p>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                  While you wait, try our comprehensive CSA practice test with detailed explanations and exam simulation.
                </p>
                
                <div className="mt-6">
                  <Link
                    href="/practice-tests/csa"
                    className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    Try CSA Practice Test
                  </Link>
                </div>
              </div>
            </div>

            {/* Available Certifications */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Available Practice Tests
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
                    Full practice test with 200+ questions
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
                    CIS-Discovery - Discovery Implementation
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Comprehensive discovery practice questions
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