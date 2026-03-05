import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCertificationBySlug,
  getDaysUntilDeltaDeadline,
  isDeltaWindowOpen,
  getAllDeltaSlugs,
  getTopicsForCertification,
  getTotalQuestionCount,
  getTotalFreeQuestionCount,
} from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import deltaTipsData from "@/data/delta-tips.json";

interface PageProps {
  params: Promise<{ slug: string; release: string }>;
}

export async function generateStaticParams() {
  return getAllDeltaSlugs().map(({ certification, release }) => ({
    slug: certification,
    release: release,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, release: releaseParam } = await params;
  const cert = getCertificationBySlug(slug);

  if (!cert) {
    return { title: "Delta Exam Not Found" };
  }

  const release = releaseParam.charAt(0).toUpperCase() + releaseParam.slice(1);

  return {
    title: `${cert.name} ${release} Delta Exam - Tips, Study Guide & Practice Questions`,
    description: `Pass your ServiceNow ${cert.name} ${release} delta exam. Reddit tips, key topics, study strategies, and practice questions. Open book exam with 10 questions.`,
    keywords: [
      `${cert.name} delta exam`,
      `${cert.name} ${release} delta`,
      `ServiceNow ${cert.name} delta`,
      `${release} delta exam`,
      `${cert.fullName} delta`,
      "ServiceNow delta exam tips",
      "delta exam study guide",
    ],
    alternates: {
      canonical: `/${slug}/delta/${releaseParam}`,
    },
    openGraph: {
      title: `${cert.name} ${release} Delta Exam | SNReady`,
      description: `Reddit tips, key topics, and practice questions for the ${cert.name} ${release} delta exam.`,
    },
  };
}

export default async function DeltaExamPage({ params }: PageProps) {
  const { slug, release: releaseParam } = await params;
  const cert = getCertificationBySlug(slug);

  if (!cert || !cert.deltaExam) {
    notFound();
  }

  const release = releaseParam.charAt(0).toUpperCase() + releaseParam.slice(1);
  const daysLeft = getDaysUntilDeltaDeadline(cert);
  const isOpen = isDeltaWindowOpen(cert);
  const topics = getTopicsForCertification(slug);
  const totalQuestions = getTotalQuestionCount(slug);
  const freeQuestions = getTotalFreeQuestionCount(slug);

  // Get delta tips for this certification
  const generalTips = deltaTipsData.general;
  const certTips = deltaTipsData.certifications[slug as keyof typeof deltaTipsData.certifications];

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: cert.name, url: `/${slug}` },
    { name: `${release} Delta Exam`, url: `/${slug}/delta/${releaseParam}` },
  ]);

  // FAQ Schema
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How many questions are on the ${cert.name} delta exam?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The ${cert.name} delta exam has ${generalTips.format.questions} questions. You have ${generalTips.format.duration} minutes to complete it.`,
        },
      },
      {
        "@type": "Question",
        name: `Is the ${cert.name} delta exam open book?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all ServiceNow delta exams are open book and non-proctored. You can use the study guide, release notes, and docs.servicenow.com during the exam.",
        },
      },
      {
        "@type": "Question",
        name: `What is the passing score for the ${cert.name} delta exam?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The passing score is ${generalTips.format.passingScore}%. You get ${generalTips.format.retakes} attempts included with your maintenance fee.`,
        },
      },
      {
        "@type": "Question",
        name: `What topics are covered on the ${cert.name} ${release} delta exam?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: certTips?.zurichTopics?.join(", ") || `The exam covers new features and changes introduced in the ${release} release for ${cert.name}.`,
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
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-12 dark:from-zinc-900 dark:to-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm text-zinc-500">
              <Link href="/" className="hover:text-violet-600">Home</Link>
              <span className="mx-2">/</span>
              <Link href={`/${slug}`} className="hover:text-violet-600">{cert.name}</Link>
              <span className="mx-2">/</span>
              <span className="text-zinc-900 dark:text-zinc-100">Delta Exam</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                Delta Exam
              </span>
              <span className="inline-flex items-center rounded-md bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                {release} Release
              </span>
              {isOpen && daysLeft !== null && (
                <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                  daysLeft <= 14
                    ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    : daysLeft <= 30
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                }`}>
                  {daysLeft} days left
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              {cert.name} {release} Delta Exam
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Everything you need to pass the {cert.fullName} delta exam for the {release} release.
              Tips from Reddit, key topics, and practice questions.
            </p>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                <div className="text-2xl font-bold text-blue-600">{generalTips.format.questions}</div>
                <div className="text-sm text-zinc-500">Questions</div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                <div className="text-2xl font-bold text-blue-600">{certTips?.estimatedTime || generalTips.format.duration}m</div>
                <div className="text-sm text-zinc-500">Est. Time</div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                <div className="text-2xl font-bold text-blue-600">{generalTips.format.passingScore}%</div>
                <div className="text-sm text-zinc-500">Pass Score</div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                <div className="text-2xl font-bold text-emerald-600">Open</div>
                <div className="text-sm text-zinc-500">Book Exam</div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer Banner */}
        <section className="border-b border-zinc-200 bg-violet-50 py-6 dark:border-zinc-800 dark:bg-violet-950/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-center sm:text-left">
                <p className="font-semibold text-violet-900 dark:text-violet-100">
                  📚 While you&apos;re here: We have {totalQuestions} {cert.name} practice questions
                </p>
                <p className="text-sm text-violet-700 dark:text-violet-300">
                  {freeQuestions} free questions • Timed mock exams • Detailed explanations
                </p>
              </div>
              <Link
                href={`/${slug}/practice-questions`}
                className="inline-flex items-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
              >
                Try Free Questions →
              </Link>
            </div>
          </div>
        </section>

        {/* Reddit Tips Section */}
        {certTips?.redditInsights && certTips.redditInsights.length > 0 && (
          <section className="border-b border-zinc-200 bg-orange-50 py-10 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
                <svg className="h-6 w-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  What Reddit Says
                </h2>
              </div>
              <div className="mt-6 space-y-4">
                {certTips.redditInsights.map((insight, index) => (
                  <blockquote
                    key={index}
                    className="rounded-lg border-l-4 border-orange-400 bg-white p-4 italic text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {insight}
                    <footer className="mt-2 text-sm text-zinc-500">— r/servicenow</footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Key Topics Section */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Key Topics for {release}
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Focus your study on these areas — they&apos;re most likely to appear on the delta exam.
            </p>

            {certTips?.zurichTopics && certTips.zurichTopics.length > 0 ? (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {certTips.zurichTopics.map((topic, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                      {index + 1}
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300">{topic}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-zinc-500">
                Check the official study guide for {release}-specific topics.
              </p>
            )}

            {/* CIS-DF Triage Order */}
            {certTips && 'triageOrder' in certTips && certTips.triageOrder && (
              <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950">
                <h3 className="flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-200">
                  <span className="text-xl">⚠️</span> CMDB Triage Order (Memorize This!)
                </h3>
                <ol className="mt-4 space-y-2">
                  {(certTips.triageOrder as string[]).map((step, index) => (
                    <li key={index} className="flex items-center gap-3 text-amber-900 dark:text-amber-100">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 font-bold text-amber-800 dark:bg-amber-800 dark:text-amber-100">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Prerequisite Warning */}
            {certTips && 'prerequisite' in certTips && (certTips as { prerequisite?: string }).prerequisite && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                <p className="font-semibold text-red-800 dark:text-red-200">
                  ⚠️ Prerequisite Required: {(certTips as { prerequisite: string }).prerequisite}
                </p>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  You must hold the {(certTips as { prerequisite: string }).prerequisite} certification before taking this delta exam.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Strategy Section */}
        <section className="border-y border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Exam Strategy
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Follow these tips from people who&apos;ve passed the delta.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">✅ Do This</h3>
                <ul className="mt-3 space-y-2">
                  {generalTips.strategy.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                      <span className="mt-1 text-emerald-500">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">❌ Avoid This</h3>
                <ul className="mt-3 space-y-2">
                  {generalTips.commonMistakes.map((mistake, index) => (
                    <li key={index} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                      <span className="mt-1 text-red-500">•</span>
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Difficulty Badge */}
            {certTips?.difficulty && (
              <div className="mt-8">
                <span className="text-sm text-zinc-500">Community Difficulty Rating:</span>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    certTips.difficulty === "easy"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : certTips.difficulty === "medium"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                  }`}>
                    {certTips.difficulty.charAt(0).toUpperCase() + certTips.difficulty.slice(1)}
                  </span>
                  <span className="text-sm text-zinc-500">
                    (~{certTips.estimatedTime || 20} minutes)
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Practice Questions Section */}
        {totalQuestions > 0 && (
          <section className="py-12">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Brush Up Before Your Delta
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Delta exams focus on new features, but knowing the fundamentals helps.
                We have {totalQuestions} {cert.name} practice questions ready for you.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {topics.slice(0, 4).map((topic) => (
                  <Link
                    key={topic.slug}
                    href={`/${slug}/practice-questions/${topic.slug}`}
                    className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-700 dark:hover:bg-violet-950"
                  >
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {topic.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      {topic.questionCount} questions
                    </p>
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/${slug}/practice-questions`}
                  className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition-colors hover:bg-violet-700"
                >
                  All {cert.name} Practice Questions
                </Link>
                <Link
                  href={`/${slug}/mock-exam`}
                  className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  Take Timed Mock Exam
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* What SNReady Offers */}
        <section className="border-t border-zinc-200 bg-gradient-to-b from-violet-50 to-white py-12 dark:border-zinc-800 dark:from-violet-950/30 dark:to-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              More Than Just Delta Prep
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              SNReady is your complete ServiceNow certification companion.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950">
                  <svg className="h-6 w-6 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-100">
                  {totalQuestions}+ Practice Questions
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Realistic questions with detailed explanations. {freeQuestions} free to try.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950">
                  <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-100">
                  Timed Mock Exams
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Simulate real exam conditions with our full-length practice tests.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-100">
                  20+ Certifications
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  CSA, CAD, CIS-ITSM, CIS-DF, and more. All in one place.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/pricing"
                className="text-violet-600 hover:text-violet-700 dark:text-violet-400"
              >
                View pricing →
              </Link>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Study Resources
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <a
                href={cert.deltaExam.studyGuideUrl || `https://nowlearning.servicenow.com/lxp/en/credentials/${slug}-delta-exam-study-guide`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Official Study Guide
                  </h3>
                  <p className="text-sm text-zinc-500">NowLearning</p>
                </div>
              </a>

              <a
                href={`https://docs.servicenow.com/bundle/${release.toLowerCase()}-release-notes/page/release-notes/summary/rn-summary-landing-page.html`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950">
                  <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {release} Release Notes
                  </h3>
                  <p className="text-sm text-zinc-500">docs.servicenow.com</p>
                </div>
              </a>

              {cert.blueprintUrl && (
                <a
                  href={cert.blueprintUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950">
                    <svg className="h-6 w-6 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Exam Blueprint
                    </h3>
                    <p className="text-sm text-zinc-500">Official topics &amp; weights</p>
                  </div>
                </a>
              )}

              <Link
                href={`/${slug}`}
                className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-violet-300 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <svg className="h-6 w-6 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Full {cert.name} Prep
                  </h3>
                  <p className="text-sm text-zinc-500">Complete certification guide</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 py-12 dark:bg-blue-700">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white">
              Ready for the {cert.name} {release} Delta?
            </h2>
            <p className="mt-4 text-blue-100">
              Remember: It&apos;s open book. Have your study guide and release notes ready.
              {daysLeft !== null && daysLeft > 0 && (
                <span className="block mt-2 font-semibold">
                  {daysLeft} days left until the deadline!
                </span>
              )}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="https://www.webassessor.com/SERVICE_NOW"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                Take Delta Exam →
              </a>
              <Link
                href={`/${slug}/practice-questions`}
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/30 px-8 text-base font-medium text-white transition-colors hover:bg-white/10"
              >
                Practice First
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
