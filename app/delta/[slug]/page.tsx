import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCertificationBySlug,
  getAllDeltaSlugs,
  getDaysUntilDeltaDeadline,
  isDeltaWindowOpen,
  getTopicsForCertification,
  isCertificationReady,
} from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Parse slug like "csa-zurich" into { cert: "csa", release: "zurich" }
function parseSlug(slug: string): { certSlug: string; release: string } | null {
  const parts = slug.split("-");
  if (parts.length < 2) return null;

  // The release is the last part, cert is everything before
  const release = parts[parts.length - 1];
  const certSlug = parts.slice(0, -1).join("-");

  return { certSlug, release };
}

export async function generateStaticParams() {
  return getAllDeltaSlugs().map(({ certification, release }) => ({
    slug: `${certification}-${release}`,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);

  if (!parsed) {
    return { title: "Delta Exam Not Found" };
  }

  const cert = getCertificationBySlug(parsed.certSlug);
  if (!cert || !cert.deltaExam) {
    return { title: "Delta Exam Not Found" };
  }

  const release = cert.deltaExam.currentRelease;

  return {
    title: `${cert.name} ${release} Delta Exam Prep - Practice Questions & Study Guide`,
    description: `Prepare for the ServiceNow ${cert.name} ${release} Delta Exam. ${cert.deltaExam.deltaExamDetails?.questionCount || 10} questions, ${cert.deltaExam.deltaExamDetails?.duration || 20} minutes. Deadline: ${cert.deltaExam.deltaWindow?.closes || "TBD"}. Free practice questions and study tips.`,
    keywords: [
      `${cert.name} delta exam`,
      `${cert.name} ${release} delta`,
      `ServiceNow ${release} delta exam`,
      `${cert.name} certification update`,
      `${cert.name} recertification`,
      `ServiceNow delta exam practice`,
      `${cert.fullName} delta`,
    ],
    alternates: {
      canonical: `/delta/${slug}`,
    },
    openGraph: {
      title: `${cert.name} ${release} Delta Exam | SNReady`,
      description: `Pass the ServiceNow ${cert.name} ${release} Delta Exam. Practice questions and study guide for certification maintenance.`,
    },
  };
}

export default async function DeltaExamPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseSlug(slug);

  if (!parsed) {
    notFound();
  }

  const cert = getCertificationBySlug(parsed.certSlug);
  if (!cert || !cert.deltaExam || !cert.deltaExam.isMainline) {
    notFound();
  }

  const deltaInfo = cert.deltaExam;
  const daysLeft = getDaysUntilDeltaDeadline(cert);
  const isWindowOpen = isDeltaWindowOpen(cert);
  const topics = getTopicsForCertification(parsed.certSlug);
  const isReady = isCertificationReady(parsed.certSlug);

  // Determine urgency level
  const urgencyLevel =
    daysLeft !== null && daysLeft <= 14
      ? "urgent"
      : daysLeft !== null && daysLeft <= 30
        ? "warning"
        : "normal";

  // JSON-LD structured data - Breadcrumb schema
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Certifications", url: "/#certifications" },
    { name: cert.name, url: `/certifications/${cert.slug}` },
    { name: `${deltaInfo.currentRelease} Delta`, url: `/delta/${slug}` },
  ]);

  // JSON-LD structured data - FAQ schema
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the ${cert.name} ${deltaInfo.currentRelease} Delta Exam?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The ${cert.name} ${deltaInfo.currentRelease} Delta Exam is a short, non-proctored exam that validates your knowledge of new features and changes in the ServiceNow ${deltaInfo.currentRelease} release. It's required to maintain your ${cert.name} certification.`,
        },
      },
      {
        "@type": "Question",
        name: `How many questions are on the ${cert.name} Delta Exam?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The ${cert.name} Delta Exam contains approximately ${deltaInfo.deltaExamDetails?.questionCount || 10} questions. You have ${deltaInfo.deltaExamDetails?.duration || 20} minutes to complete the exam.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the deadline for the ${cert.name} ${deltaInfo.currentRelease} Delta Exam?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: deltaInfo.deltaWindow
            ? `The deadline to complete the ${cert.name} ${deltaInfo.currentRelease} Delta Exam is ${new Date(deltaInfo.deltaWindow.closes).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}. You have a 90-day window from ${new Date(deltaInfo.deltaWindow.opens).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} to complete the exam.`
            : "The delta exam window dates have not been announced yet.",
        },
      },
      {
        "@type": "Question",
        name: `Can I retake the ${cert.name} Delta Exam if I fail?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, you can retake the ${cert.name} Delta Exam up to ${deltaInfo.deltaExamDetails?.retakeAllowed || 3} times if you don't pass on your first attempt. The exam is non-proctored and can be taken on ServiceNow's Now Learning platform.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen">
        {/* Hero Section with Urgency Banner */}
        {isWindowOpen && daysLeft !== null && (
          <div
            className={`py-3 text-center text-sm font-medium ${
              urgencyLevel === "urgent"
                ? "bg-red-600 text-white"
                : urgencyLevel === "warning"
                  ? "bg-amber-500 text-white"
                  : "bg-emerald-600 text-white"
            }`}
          >
            {urgencyLevel === "urgent" ? (
              <>
                <span className="font-bold">Deadline approaching!</span> Only{" "}
                {daysLeft} days left to complete your {cert.name} delta exam
              </>
            ) : urgencyLevel === "warning" ? (
              <>
                {daysLeft} days remaining to complete your {cert.name} delta
                exam
              </>
            ) : (
              <>
                Delta exam window is open - {daysLeft} days remaining
              </>
            )}
          </div>
        )}

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 dark:from-zinc-900 dark:to-zinc-950">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 ring-1 ring-blue-200/50 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800/50">
                    Delta Exam
                  </span>
                  <span className="inline-flex items-center rounded-md bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200/50 dark:bg-violet-950 dark:text-violet-300 dark:ring-violet-800/50">
                    {deltaInfo.currentRelease} Release
                  </span>
                  {isWindowOpen ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/60 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800/60">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </span>
                      Window Open
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      Opens{" "}
                      {deltaInfo.deltaWindow?.opens
                        ? new Date(
                            deltaInfo.deltaWindow.opens
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "TBD"}
                    </span>
                  )}
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                  {cert.name} {deltaInfo.currentRelease} Delta Exam
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                  Maintain your {cert.fullName} certification by completing the{" "}
                  {deltaInfo.currentRelease} delta exam. Learn what&apos;s new
                  and validate your updated knowledge.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                {deltaInfo.studyGuideUrl && (
                  <a
                    href={deltaInfo.studyGuideUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-base font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Official Study Guide
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </a>
                )}
                <Link
                  href={`/certifications/${cert.slug}`}
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  Full {cert.name} Prep
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Delta Exam Details */}
        <section className="border-y border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {deltaInfo.deltaExamDetails?.questionCount || "~10"}
                </div>
                <div className="text-sm text-zinc-500">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {deltaInfo.deltaExamDetails?.duration || 20} min
                </div>
                <div className="text-sm text-zinc-500">Duration</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {deltaInfo.deltaExamDetails?.passingScore || 70}%
                </div>
                <div className="text-sm text-zinc-500">Passing Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">Free</div>
                <div className="text-sm text-zinc-500">Exam Cost</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {deltaInfo.deltaExamDetails?.retakeAllowed || 3}
                </div>
                <div className="text-sm text-zinc-500">Retakes Allowed</div>
              </div>
              <div>
                <div
                  className={`text-2xl font-bold ${
                    urgencyLevel === "urgent"
                      ? "text-red-600"
                      : urgencyLevel === "warning"
                        ? "text-amber-600"
                        : "text-blue-600"
                  }`}
                >
                  {daysLeft !== null ? `${daysLeft}d` : "TBD"}
                </div>
                <div className="text-sm text-zinc-500">Days Left</div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Delta Exam Timeline
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">Window Opens</div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {deltaInfo.deltaWindow?.opens
                        ? new Date(
                            deltaInfo.deltaWindow.opens
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "TBD"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      urgencyLevel === "urgent"
                        ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                        : urgencyLevel === "warning"
                          ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
                          : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    }`}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">Deadline</div>
                    <div
                      className={`font-semibold ${
                        urgencyLevel === "urgent"
                          ? "text-red-600"
                          : urgencyLevel === "warning"
                            ? "text-amber-600"
                            : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {deltaInfo.deltaWindow?.closes
                        ? new Date(
                            deltaInfo.deltaWindow.closes
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "TBD"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-300">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">Duration</div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                      90-day window
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's New Section */}
        <section className="bg-zinc-50 py-16 dark:bg-zinc-900">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              What&apos;s New in {deltaInfo.currentRelease}
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Key changes and features you need to know for the delta exam.
            </p>
            <div className="mt-8 rounded-xl border-2 border-dashed border-zinc-200 bg-white/50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-800/50">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <svg
                  className="h-6 w-6 text-blue-600 dark:text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-zinc-600 dark:text-zinc-300">
                Review the Official Study Guide
              </p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                ServiceNow provides a detailed study guide covering all{" "}
                {deltaInfo.currentRelease} release changes for the {cert.name}{" "}
                certification.
              </p>
              {deltaInfo.studyGuideUrl && (
                <a
                  href={deltaInfo.studyGuideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border-2 border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-medium text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                >
                  Open Study Guide
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Practice Section */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Prepare with Practice Questions
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Reinforce your knowledge with our {cert.name} practice materials.
            </p>
            {isReady && topics.length > 0 ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topics.slice(0, 6).map((topic) => (
                  <Link
                    key={topic.slug}
                    href={`/${cert.slug}/questions/${topic.slug}`}
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
              <div className="mt-8 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-10 text-center dark:border-zinc-700 dark:bg-zinc-800/50">
                <p className="text-lg font-medium text-zinc-600 dark:text-zinc-300">
                  Practice questions coming soon
                </p>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  In the meantime, try our CSA practice questions:
                </p>
                <Link
                  href="/certifications/csa"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border-2 border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                >
                  Try CSA Practice
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            )}
            {isReady && (
              <div className="mt-6 text-center">
                <Link
                  href={`/certifications/${cert.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  View all {cert.name} topics
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Delta Exam Tips */}
        <section className="bg-blue-50 py-16 dark:bg-zinc-900">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Delta Exam Tips
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Format & Structure
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-blue-600">•</span>
                    Non-proctored, online exam on Now Learning
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-blue-600">•</span>
                    {deltaInfo.deltaExamDetails?.questionCount || "7-10"}{" "}
                    multiple-choice questions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-blue-600">•</span>
                    {deltaInfo.deltaExamDetails?.duration || 20} minute time
                    limit
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-blue-600">•</span>
                    Up to {deltaInfo.deltaExamDetails?.retakeAllowed || 3}{" "}
                    retakes allowed
                  </li>
                </ul>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Preparation Strategy
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-600">•</span>
                    Focus on {deltaInfo.currentRelease} release notes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-600">•</span>
                    Review the official delta study guide
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-600">•</span>
                    Practice in a {deltaInfo.currentRelease} PDI instance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-600">•</span>
                    Complete any related Now Learning courses
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-600 py-16 dark:bg-blue-700">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white">
              Don&apos;t Let Your Certification Expire
            </h2>
            <p className="mt-4 text-blue-100">
              {isWindowOpen
                ? `Complete your ${cert.name} ${deltaInfo.currentRelease} delta exam before ${
                    deltaInfo.deltaWindow?.closes
                      ? new Date(
                          deltaInfo.deltaWindow.closes
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "the deadline"
                  }.`
                : `The delta exam window opens ${
                    deltaInfo.deltaWindow?.opens
                      ? new Date(
                          deltaInfo.deltaWindow.opens
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "soon"
                  }.`}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {deltaInfo.studyGuideUrl && (
                <a
                  href={deltaInfo.studyGuideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 text-base font-medium text-blue-600 transition-colors hover:bg-blue-50"
                >
                  Start Studying
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>
              )}
              <Link
                href={`/certifications/${cert.slug}`}
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white px-8 text-base font-medium text-white transition-colors hover:bg-blue-500"
              >
                Full {cert.name} Prep
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
