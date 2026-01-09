import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCertificationBySlug,
  getCertificationSlugs,
  getTopicsForCertification,
  getTotalQuestionCount,
  getTotalFreeQuestionCount,
} from "@/lib/data";
import { breadcrumbs, generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getCertificationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cert = getCertificationBySlug(slug);

  if (!cert) {
    return { title: "Certification Not Found" };
  }

  return {
    title: `${cert.name} Certification Exam Prep - Practice Tests & Questions`,
    description: `Prepare for the ServiceNow ${cert.fullName} (${cert.name}) exam with ${getTotalQuestionCount(slug)}+ practice questions. Free sample questions, study guides, and mock exams.`,
    keywords: [
      `${cert.name} practice test`,
      `${cert.name} exam questions`,
      `ServiceNow ${cert.name} certification`,
      `${cert.name} study guide`,
      `${cert.fullName} exam prep`,
    ],
    alternates: {
      canonical: `/certifications/${slug}`,
    },
    openGraph: {
      title: `${cert.name} Certification Exam Prep | SNReady`,
      description: `Pass the ServiceNow ${cert.name} exam with our comprehensive practice tests and study materials.`,
    },
  };
}

export default async function CertificationPage({ params }: PageProps) {
  const { slug } = await params;
  const cert = getCertificationBySlug(slug);

  if (!cert) {
    notFound();
  }

  const topics = getTopicsForCertification(slug);
  const totalQuestions = getTotalQuestionCount(slug);
  const freeQuestions = getTotalFreeQuestionCount(slug);

  // JSON-LD structured data - Course schema
  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `ServiceNow ${cert.fullName} (${cert.name}) Exam Preparation`,
    description: cert.description,
    provider: {
      "@type": "Organization",
      name: "SNReady",
    },
    educationalLevel: cert.level,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
    },
  };

  // JSON-LD structured data - Breadcrumb schema
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(
    breadcrumbs.certification(cert.name, slug)
  );

  // JSON-LD structured data - FAQ schema for exam details
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How many questions are on the ${cert.name} exam?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The ServiceNow ${cert.name} (${cert.fullName}) exam contains ${cert.examDetails.questionCount} questions. You have ${cert.examDetails.duration} minutes to complete the exam.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the passing score for the ${cert.name} exam?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `You need to score ${cert.examDetails.passingScore}% or higher to pass the ServiceNow ${cert.name} certification exam.`,
        },
      },
      {
        "@type": "Question",
        name: `How long is the ${cert.name} certification exam?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The ${cert.name} exam duration is ${cert.examDetails.duration} minutes. The exam format is ${cert.examDetails.format.toLowerCase()}.`,
        },
      },
      {
        "@type": "Question",
        name: `How much does the ${cert.name} exam cost?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The ServiceNow ${cert.name} certification exam costs $${cert.examDetails.cost} USD. The exam can be taken online or at a testing center.`,
        },
      },
      {
        "@type": "Question",
        name: `What are the prerequisites for the ${cert.name} certification?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            cert.prerequisites.length > 0
              ? `Prerequisites for the ${cert.name} exam include: ${cert.prerequisites.join(", ")}.`
              : `The ${cert.name} certification has no formal prerequisites, though ServiceNow recommends hands-on experience with the platform.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-emerald-50 to-white py-16 dark:from-zinc-900 dark:to-zinc-950">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      cert.level === "entry"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : cert.level === "professional"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                    }`}
                  >
                    {cert.level} level
                  </span>
                  <span className="text-sm text-zinc-500">
                    {cert.release} Release
                  </span>
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                  {cert.name} - {cert.fullName}
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                  {cert.description}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                {topics.length > 0 ? (
                  <>
                    <Link
                      href={`/${slug}/questions/${topics[0].slug}`}
                      className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
                    >
                      Start Practicing
                    </Link>
                    <Link
                      href={`/${slug}/questions/${topics[0].slug}`}
                      className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    >
                      Try Free Questions
                    </Link>
                  </>
                ) : (
                  <span className="inline-flex h-12 items-center justify-center rounded-lg bg-zinc-200 px-6 text-base font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                    Questions Coming Soon
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Exam Details */}
        <section className="border-y border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {cert.examDetails.questionCount}
                </div>
                <div className="text-sm text-zinc-500">Exam Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {cert.examDetails.duration} min
                </div>
                <div className="text-sm text-zinc-500">Duration</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {cert.examDetails.passingScore}%
                </div>
                <div className="text-sm text-zinc-500">Passing Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  ${cert.examDetails.cost}
                </div>
                <div className="text-sm text-zinc-500">Exam Cost</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {totalQuestions}+
                </div>
                <div className="text-sm text-zinc-500">Practice Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {freeQuestions}
                </div>
                <div className="text-sm text-zinc-500">Free Questions</div>
              </div>
            </div>
          </div>
        </section>

        {/* Exam Domains */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Exam Domains
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              The {cert.name} exam covers these key areas. Master each domain to
              maximize your chances of passing.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {cert.domains.map((domain) => {
                const hasTopic = topics.some((t) => t.slug === domain.slug);

                const domainContent = (
                  <>
                    <div className="flex items-center justify-between">
                      <h3
                        className={`font-semibold text-zinc-900 dark:text-zinc-100 ${
                          hasTopic ? "group-hover:text-emerald-600" : ""
                        }`}
                      >
                        {domain.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {!hasTopic && (
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                            Coming soon
                          </span>
                        )}
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          {domain.percentage}%
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {domain.description}
                    </p>
                    <div className="mt-3">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${domain.percentage}%` }}
                        />
                      </div>
                    </div>
                  </>
                );

                if (hasTopic) {
                  return (
                    <Link
                      key={domain.slug}
                      href={`/${slug}/questions/${domain.slug}`}
                      className="group rounded-lg border border-zinc-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow cursor-pointer dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      {domainContent}
                    </Link>
                  );
                }

                return (
                  <div
                    key={domain.slug}
                    className="group rounded-lg border border-zinc-200 bg-white p-5 transition-all opacity-75 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    {domainContent}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Topics with Questions */}
        <section className="bg-zinc-50 py-16 dark:bg-zinc-900">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Practice by Topic
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Focus on specific areas to strengthen your weak points.
            </p>
            {topics.length > 0 ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic) => (
                  <Link
                    key={topic.slug}
                    href={`/${slug}/questions/${topic.slug}`}
                    className="group rounded-lg border border-zinc-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow dark:border-zinc-800 dark:bg-zinc-800"
                  >
                    <h3 className="font-semibold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100">
                      {topic.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {topic.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                      <span>{topic.questionCount} questions</span>
                      <span className="text-emerald-600">
                        {topic.freeQuestionCount} free
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-800">
                <p className="text-zinc-600 dark:text-zinc-400">
                  Practice questions for {cert.name} are coming soon!
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  Check back later or explore our{" "}
                  <Link
                    href="/certifications/csa"
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    CSA practice questions
                  </Link>{" "}
                  in the meantime.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Prerequisites */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Prerequisites & Preparation
            </h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Recommended Prerequisites
                </h3>
                <ul className="mt-4 space-y-3">
                  {cert.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                        {index + 1}
                      </span>
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {prereq}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Exam Format
                </h3>
                <ul className="mt-4 space-y-3 text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-center gap-3">
                    <span className="text-emerald-600">•</span>
                    {cert.examDetails.format}
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-emerald-600">•</span>
                    Proctored online or at testing center
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-emerald-600">•</span>
                    Results available immediately
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-emerald-600">•</span>
                    Valid for current release ({cert.release})
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-600 py-16 dark:bg-emerald-700">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white">
              {topics.length > 0
                ? "Ready to Start Practicing?"
                : "Interested in This Certification?"}
            </h2>
            <p className="mt-4 text-emerald-100">
              {topics.length > 0
                ? "Begin with our free questions to assess your current knowledge level."
                : "Practice questions are coming soon. In the meantime, explore our CSA materials."}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {topics.length > 0 ? (
                <>
                  <Link
                    href={`/${slug}/questions/${topics[0].slug}`}
                    className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
                  >
                    Start Free Practice
                  </Link>
                  <Link
                    href={`/${slug}/questions/${topics[0].slug}`}
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-white px-8 text-base font-medium text-white transition-colors hover:bg-emerald-500"
                  >
                    View All Topics
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/certifications/csa"
                    className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
                  >
                    Try CSA Practice
                  </Link>
                  <Link
                    href="/#certifications"
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-white px-8 text-base font-medium text-white transition-colors hover:bg-emerald-500"
                  >
                    Browse All Exams
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
