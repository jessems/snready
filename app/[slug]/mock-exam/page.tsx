import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCertificationBySlug,
  getCertificationSlugs,
  getTotalQuestionCount,
  isCertificationReady,
} from "@/lib/data";
import { getCanonicalUrl } from "@/lib/seo";
import MockExamLanding from "./MockExamLanding";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getCertificationSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const certification = getCertificationBySlug(slug);

  if (!certification) {
    return { title: "Certification Not Found" };
  }

  const title = `${certification.name} Timed Mock Exam - Realistic Exam Simulation | SNReady`;
  const description = `Take a timed ${certification.name} mock exam that simulates real test conditions. ${certification.examDetails?.questionCount || 60} questions, ${certification.examDetails?.duration || 90} minutes, ${certification.examDetails?.passingScore || 70}% to pass. Track your progress and review detailed explanations.`;

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/${slug}/mock-exam`),
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl(`/${slug}/mock-exam`),
      images: ["/og-default.png"],
    },
  };
}

export default async function MockExamPage({ params }: Props) {
  const { slug } = await params;
  const certification = getCertificationBySlug(slug);
  const isReady = isCertificationReady(slug);
  const totalQuestions = getTotalQuestionCount(slug);

  if (!certification) {
    notFound();
  }

  const examConfig = {
    certSlug: slug,
    certName: certification.name,
    questionCount: certification.examDetails?.questionCount || 60,
    durationMinutes: certification.examDetails?.duration || 90,
    passingScore: certification.examDetails?.passingScore || 70,
  };

  const hasEnoughQuestions = totalQuestions >= examConfig.questionCount;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">
              Home
            </Link>
            <span>→</span>
            <Link href={`/${slug}`} className="hover:text-zinc-700 dark:hover:text-zinc-300">
              {certification.name}
            </Link>
            <span>→</span>
            <span>Mock Exam</span>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {certification.name} Timed Mock Exam
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            {certification.fullName}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {!isReady || !hasEnoughQuestions ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 text-5xl">🚧</div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Coming Soon
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              The {certification.name} mock exam requires at least{" "}
              {examConfig.questionCount} questions.
              {totalQuestions > 0 && (
                <span>
                  {" "}
                  We currently have {totalQuestions} questions available.
                </span>
              )}
            </p>
            <div className="mt-6">
              <Link
                href={`/${slug}/free-questions`}
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Try Practice Questions Instead
              </Link>
            </div>
          </div>
        ) : (
          <MockExamLanding
            certification={certification}
            examConfig={examConfig}
            totalQuestions={totalQuestions}
          />
        )}
      </div>
    </div>
  );
}
