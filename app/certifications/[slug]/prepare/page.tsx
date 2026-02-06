import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCertificationBySlug,
  getCertificationSlugs,
  getTotalQuestionCount,
  isCertificationReady,
} from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { getCanonicalUrl } from "@/lib/seo";
import examPrepData from "@/data/exam-prep.json";

interface Props {
  params: Promise<{ slug: string }>;
}

type ExamPrepCert = keyof typeof examPrepData;

export async function generateStaticParams() {
  return getCertificationSlugs()
    .filter((slug) => slug in examPrepData)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const certification = getCertificationBySlug(slug);

  if (!certification) {
    return { title: "Certification Not Found" };
  }

  const title = `${certification.name} Exam Prep: Official Courses & Study Resources | SNReady`;
  const description = `Complete ${certification.name} exam preparation guide. Official Now Learning courses, documentation links, exam blueprint, and study timeline. Everything you need to pass ${certification.fullName}.`;

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/certifications/${slug}/prepare`),
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl(`/certifications/${slug}/prepare`),
      images: ["/og-default.png"],
    },
    twitter: {
      title,
      description,
      images: ["/og-default.png"],
    },
  };
}

export default async function ExamPrepPage({ params }: Props) {
  const { slug } = await params;
  const certification = getCertificationBySlug(slug);

  if (!certification || !(slug in examPrepData)) {
    notFound();
  }

  const prepData = examPrepData[slug as ExamPrepCert];
  const totalQuestions = getTotalQuestionCount(slug);
  const isReady = isCertificationReady(slug);

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Certifications", url: "/#certifications" },
    { name: certification.name, url: `/certifications/${slug}` },
    { name: "Exam Prep", url: `/certifications/${slug}/prepare` },
  ];

  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What courses do I need to prepare for ${certification.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The required courses for ${certification.name} are: ${prepData.requiredCourses.map((c) => c.name).join(", ")}. These courses are available on Now Learning and cover the essential exam domains.`,
        },
      },
      {
        "@type": "Question",
        name: `What is on the ${certification.name} exam?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The ${certification.name} exam covers ${prepData.examBlueprint.domains.length} domains: ${prepData.examBlueprint.domains.map((d) => `${d.name} (${d.percentage}%)`).join(", ")}. The exam has ${certification.examDetails.questionCount} questions and requires ${certification.examDetails.passingScore}% to pass.`,
        },
      },
      {
        "@type": "Question",
        name: `How long should I study for ${certification.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `We recommend ${prepData.studyTimeline.totalWeeks} weeks of dedicated study for the ${certification.name} exam. This includes completing required courses, hands-on practice, and taking practice exams.`,
        },
      },
    ],
  };

  // HowTo Schema for the study timeline
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Prepare for the ${certification.name} Certification Exam`,
    description: `Step-by-step guide to prepare for the ServiceNow ${certification.fullName} certification exam in ${prepData.studyTimeline.totalWeeks} weeks.`,
    totalTime: `P${prepData.studyTimeline.totalWeeks}W`,
    step: prepData.studyTimeline.phases.map((phase, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: `Week ${phase.week}: ${phase.focus}`,
      text: phase.activities.join(". "),
    })),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">Home</Link>
          <span>→</span>
          <Link href={`/certifications/${slug}`} className="hover:text-zinc-700 dark:hover:text-zinc-300">
            {certification.name}
          </Link>
          <span>→</span>
          <span className="text-zinc-900 dark:text-zinc-100">Exam Prep</span>
        </nav>

        {/* Header */}
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
              certification.level === "entry"
                ? "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300"
                : certification.level === "professional"
                  ? "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
            }`}>
              {certification.level}
            </span>
            <span className="text-sm text-zinc-500">{certification.release} Release</span>
          </div>

          <h1 className="mt-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            {certification.name} Exam Preparation Guide
          </h1>
          <p className="mt-2 text-xl text-zinc-600 dark:text-zinc-400">
            {certification.fullName}
          </p>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Everything you need to pass the {certification.name} certification: official courses, documentation, exam blueprint, and study timeline.
          </p>

          {/* Quick Links */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={prepData.officialResources.examPage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Official Exam Page
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            {isReady && (
              <Link
                href={`/certifications/${slug}`}
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              >
                Practice Questions ({totalQuestions}+)
              </Link>
            )}
          </div>
        </div>

        {/* Exam Overview */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            📋 Exam Overview
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <div className="text-2xl font-bold text-emerald-600">{certification.examDetails.questionCount}</div>
              <div className="text-sm text-zinc-500">Questions</div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <div className="text-2xl font-bold text-emerald-600">{certification.examDetails.duration} min</div>
              <div className="text-sm text-zinc-500">Duration</div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <div className="text-2xl font-bold text-emerald-600">{certification.examDetails.passingScore}%</div>
              <div className="text-sm text-zinc-500">Passing Score</div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <div className="text-2xl font-bold text-emerald-600">${certification.examDetails.cost}</div>
              <div className="text-sm text-zinc-500">Exam Fee</div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <div className="text-2xl font-bold text-emerald-600">{prepData.examBlueprint.domains.length}</div>
              <div className="text-sm text-zinc-500">Domains</div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <div className="text-2xl font-bold text-emerald-600">{prepData.studyTimeline.totalWeeks} wks</div>
              <div className="text-sm text-zinc-500">Study Time</div>
            </div>
          </div>
        </section>

        {/* Official Exam Blueprint */}
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              📊 Official Exam Blueprint
            </h2>
            <span className="text-sm text-zinc-500">
              Source: {prepData.examBlueprint.source}
            </span>
          </div>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            The exam tests your knowledge across these domains. Focus on higher-weighted areas for maximum impact.
          </p>

          <div className="mt-6 space-y-4">
            {prepData.examBlueprint.domains
              .sort((a, b) => b.percentage - a.percentage)
              .map((domain, index) => (
                <div
                  key={domain.name}
                  className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          {index + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {domain.name}
                        </h3>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          What you need to know:
                        </h4>
                        <ul className="mt-2 space-y-1">
                          {domain.objectives.map((objective, objIndex) => (
                            <li key={objIndex} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                              {objective}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-bold text-emerald-600">{domain.percentage}%</div>
                      <div className="text-sm text-zinc-500">of exam</div>
                      <div className="mt-2 h-2 w-24 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${domain.percentage * 2.5}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Required Courses */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            📚 Required Now Learning Courses
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Complete these official ServiceNow courses before taking the exam.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {prepData.requiredCourses.map((course) => (
              <a
                key={course.name}
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg border-2 border-emerald-200 bg-emerald-50 p-5 transition-all hover:border-emerald-400 hover:shadow-md dark:border-emerald-800 dark:bg-emerald-950 dark:hover:border-emerald-600"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
                        REQUIRED
                      </span>
                      <span className="text-sm text-zinc-500">{course.duration}</span>
                    </div>
                    <h3 className="mt-2 font-semibold text-zinc-900 group-hover:text-emerald-700 dark:text-zinc-100 dark:group-hover:text-emerald-400">
                      {course.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {course.description}
                    </p>
                  </div>
                  <svg className="h-5 w-5 flex-shrink-0 text-emerald-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>
            ))}
          </div>

          {prepData.recommendedCourses.length > 0 && (
            <>
              <h3 className="mt-8 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Recommended Additional Courses
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {prepData.recommendedCourses.map((course) => (
                  <a
                    key={course.name}
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-lg border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-400 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                            RECOMMENDED
                          </span>
                          <span className="text-sm text-zinc-500">{course.duration}</span>
                        </div>
                        <h3 className="mt-2 font-semibold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400">
                          {course.name}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          {course.description}
                        </p>
                      </div>
                      <svg className="h-5 w-5 flex-shrink-0 text-zinc-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Documentation */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            📖 Official Documentation to Review
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Reference these official ServiceNow docs for detailed technical information.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {prepData.documentationSections.map((doc) => (
              <a
                key={doc.name}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950"
              >
                <div className="flex items-center gap-3">
                  <span className="text-blue-600 dark:text-blue-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  <span className="font-medium text-zinc-900 group-hover:text-blue-700 dark:text-zinc-100 dark:group-hover:text-blue-400">
                    {doc.name}
                  </span>
                </div>
                <svg className="h-4 w-4 text-zinc-400 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </section>

        {/* Study Timeline */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            📅 {prepData.studyTimeline.totalWeeks}-Week Study Timeline
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Follow this structured plan to prepare systematically for your exam.
          </p>

          <div className="mt-6 space-y-4">
            {prepData.studyTimeline.phases.map((phase, index) => (
              <div
                key={phase.week}
                className="relative rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="rounded bg-zinc-100 px-2 py-1 text-sm font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        Week {phase.week}
                      </span>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {phase.focus}
                      </h3>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {phase.activities.map((activity, actIndex) => (
                        <li key={actIndex} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                          <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                          </svg>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Practice CTA */}
        {isReady && (
          <section className="mt-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 p-8 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Ready to Test Your Knowledge?</h2>
              <p className="mt-2 text-emerald-100">
                Practice with {totalQuestions}+ questions covering all exam domains
              </p>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href={`/certifications/${slug}`}
                  className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
                >
                  Start Practicing — $9
                </Link>
                <Link
                  href={`/free-questions/${slug}`}
                  className="inline-flex items-center justify-center rounded-lg border border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Try Free Questions First
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Prerequisites */}
        <section className="mt-12 rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950">
          <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100">
            ⚠️ Prerequisites
          </h2>
          <ul className="mt-4 space-y-2">
            {certification.prerequisites.map((prereq, index) => (
              <li key={index} className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-xs font-semibold text-amber-800 dark:bg-amber-800 dark:text-amber-200">
                  {index + 1}
                </span>
                {prereq}
              </li>
            ))}
          </ul>
        </section>

        {/* Related Pages */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Related Resources
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href={`/certifications/${slug}`}
              className="rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{certification.name} Overview</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Exam details & topics</p>
            </Link>
            <Link
              href={`/study-guide/${slug}`}
              className="rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Study Guide</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Topic-by-topic breakdown</p>
            </Link>
            <Link
              href={`/practice-tests/${slug}`}
              className="rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Practice Test</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Full mock exam</p>
            </Link>
            {certification.deltaExam?.studyGuideUrl && (
              <a
                href={certification.deltaExam.studyGuideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Delta Exam Guide</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Current release updates</p>
              </a>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
