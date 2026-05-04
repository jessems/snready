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

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getCertificationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cert = getCertificationBySlug(slug);

  if (!cert) {
    return { title: "Certification Not Found" };
  }

  const title = `${cert.name} Dumps & Practice Questions 2026 | SNReady`;
  const description = `Stop searching for ${cert.name} dumps. SNReady offers ${getTotalQuestionCount(slug)}+ original practice questions with detailed explanations — the ethical way to pass your ${cert.fullName} exam.`;

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/${slug}/dumps`),
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl(`/${slug}/dumps`),
      images: ["/og-default.png"],
    },
  };
}

export default async function DumpsPage({ params }: Props) {
  const { slug } = await params;
  const cert = getCertificationBySlug(slug);

  if (!cert) {
    notFound();
  }

  const totalQuestions = getTotalQuestionCount(slug);
  const isReady = isCertificationReady(slug);

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Certifications", url: "/#certifications" },
    { name: cert.name, url: `/${slug}` },
    { name: `${cert.name} Dumps`, url: `/${slug}/dumps` },
  ];

  // FAQ schema targeting common dumps search queries
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Are there free ${cert.name} dumps available?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `While you may find scattered ${cert.name} questions shared in forums, free dumps are unreliable and often outdated. Using real exam dumps also violates ServiceNow's certification agreement. SNReady offers ${totalQuestions}+ original practice questions for a one-time $9 fee — a fraction of the $${cert.examDetails.cost} exam cost.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the best alternative to ${cert.name} dumps?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The best alternative to dumps is practicing with high-quality original questions that test your understanding of ServiceNow concepts. SNReady's questions are generated from official ServiceNow training materials, not leaked exams, so you learn the material while you practice.`,
        },
      },
      {
        "@type": "Question",
        name: `Is using ${cert.name} dumps dangerous?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. ServiceNow actively monitors for certification exam dump usage. If detected, your certification can be permanently revoked. Beyond the legal risk, dumps don't help you learn — they just help you memorize answers you won't understand on the job.`,
        },
      },
      {
        "@type": "Question",
        name: `How many practice questions do I need to pass ${cert.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Most candidates who pass use 200-500+ practice questions across all exam domains. SNReady currently has ${totalQuestions}+ questions for ${cert.name}, organized by topic so you can focus on weak areas.`,
        },
      },
      {
        "@type": "Question",
        name: `Can I get ${cert.name} questions from ExamTopics?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `ExamTopics may have some ${cert.name} questions, but they are crowd-sourced brain dumps — unreliable, potentially outdated, and a violation of ServiceNow's certification terms. SNReady provides original questions with detailed explanations for $9 — the ethical, effective study method.`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">Home</Link>
          <span>→</span>
          <Link href={`/${slug}`} className="hover:text-zinc-700 dark:hover:text-zinc-300">
            {cert.name}
          </Link>
          <span>→</span>
          <span className="text-zinc-900 dark:text-zinc-100">{cert.name} Dumps</span>
        </nav>

        {/* Hero */}
        <div className="mt-8 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white">
          <div className="inline rounded-lg bg-white/20 px-3 py-1 text-sm font-medium">
            ⚠️ Before you search for dumps
          </div>
          <h1 className="mt-4 text-4xl font-bold">
            Skip the {cert.name} Dumps — Pass with Practice Instead
          </h1>
          <p className="mt-3 text-xl text-emerald-100">
            SNReady has {totalQuestions}+ original practice questions for {cert.fullName}.
            Learn the material. Pass the exam. Keep your certification.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            {isReady ? (
              <Link
                href={`/${slug}/practice-questions`}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Practice Questions ({totalQuestions}+) →
              </Link>
            ) : (
              <Link
                href={`/${slug}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                See {cert.name} Practice Test →
              </Link>
            )}
            <Link
              href={`/${slug}`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-6 py-3 text-base font-medium text-white hover:bg-white/10"
            >
              Learn More About {cert.name}
            </Link>
          </div>
        </div>

        {/* Why Dumps Are Risky */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Why "{cert.name} dumps" Searches Lead Nowhere
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-red-100 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/20">
              <div className="text-2xl">🚫</div>
              <h3 className="mt-2 font-semibold text-red-800 dark:text-red-300">
                Certification at Risk
              </h3>
              <p className="mt-2 text-sm text-red-700 dark:text-red-400">
                ServiceNow can revoke your certification permanently if dump usage is detected — even months after you pass.
              </p>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/20">
              <div className="text-2xl">📵</div>
              <h3 className="mt-2 font-semibold text-red-800 dark:text-red-300">
                Outdated & Inaccurate
              </h3>
              <p className="mt-2 text-sm text-red-700 dark:text-red-400">
                Dumps reflect old exam versions the moment ServiceNow updates the exam. Most free dumps haven't been updated for the current exam version.
              </p>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/20">
              <div className="text-2xl">❌</div>
              <h3 className="mt-2 font-semibold text-red-800 dark:text-red-300">
                No Learning = No Job Skills
              </h3>
              <p className="mt-2 text-sm text-red-700 dark:text-red-400">
                Dumps help you memorize answers, not understand ServiceNow. Certified professionals who don't know the material get found out fast.
              </p>
            </div>
          </div>
        </section>

        {/* Ethical Alternative */}
        <section className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            ✅ The Ethical Alternative: Practice Questions That Help You Learn
          </h2>
          <div className="mt-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                1
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Original questions, not recycled dumps</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Every SNReady question is generated from official ServiceNow training materials — the same concepts tested on the real exam. No memorization, no shortcuts.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                2
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Detailed explanations for every answer</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Each question includes a full explanation of why the correct answer is right and why each wrong answer is wrong. You walk away understanding the concept.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                3
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Organized by exam domain</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Questions are tagged by topic so you can focus your practice on the domains where you need the most work — making your study time far more efficient than grinding through dumps.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                4
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">One-time $9 per certification</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  No subscription. No recurring fees. Pay once and practice as many times as you need. That's less than the cost of a failed exam attempt (${cert.examDetails.cost}).
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            {isReady ? (
              <Link
                href={`/${slug}/practice-questions`}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Start Practicing {cert.name} ({totalQuestions}+ questions) →
              </Link>
            ) : (
              <Link
                href={`/${slug}`}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                View {cert.name} Practice Test →
              </Link>
            )}
          </div>
        </section>

        {/* Exam Details Card */}
        <section className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="text-2xl font-bold text-emerald-600">{cert.examDetails.questionCount}</div>
            <div className="mt-1 text-sm text-zinc-500">Exam Questions</div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="text-2xl font-bold text-emerald-600">{cert.examDetails.passingScore}%</div>
            <div className="mt-1 text-sm text-zinc-500">Passing Score</div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="text-2xl font-bold text-emerald-600">{cert.examDetails.duration} min</div>
            <div className="mt-1 text-sm text-zinc-500">Exam Duration</div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="text-2xl font-bold text-emerald-600">${cert.examDetails.cost}</div>
            <div className="mt-1 text-sm text-zinc-500">Exam Fee</div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-10 rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-300">
            Ready to study the right way?
          </h2>
          <p className="mt-2 text-emerald-700 dark:text-emerald-400">
            Skip the dumps. Get {totalQuestions}+ original practice questions for {cert.name} — one-time $9, no subscription.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {isReady ? (
              <Link
                href={`/${slug}/practice-questions`}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Start Practice Test ({totalQuestions}+ Questions) →
              </Link>
            ) : (
              <Link
                href={`/${slug}`}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                View Practice Test →
              </Link>
            )}
            <Link
              href={`/${slug}/prepare`}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-5 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:bg-transparent dark:text-emerald-400"
            >
              View Study Resources
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
