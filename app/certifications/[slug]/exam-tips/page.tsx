import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCertificationBySlug,
  getCertificationSlugs,
  getExamTips,
  hasExamTips,
} from "@/lib/data";
import { breadcrumbs, generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import type { ExamTips, UserExperience, RecommendedResource } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getCertificationSlugs()
    .filter((slug) => hasExamTips(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cert = getCertificationBySlug(slug);
  const tips = getExamTips(slug);

  if (!cert || !tips) {
    return { title: "Exam Tips Not Found" };
  }

  return {
    title: `${cert.name} Exam Tips & Real Experiences | SNReady`,
    description: `Real exam insights from ${tips.userExperiences.length} test-takers. Difficulty: ${tips.difficulty.label}. Learn what to expect, common gotchas, and how to prepare for the ServiceNow ${cert.name} certification exam.`,
    keywords: [
      `${cert.name} exam tips`,
      `${cert.name} exam difficulty`,
      `${cert.name} exam experience`,
      `ServiceNow ${cert.name} preparation`,
      `${cert.name} exam review`,
    ],
    alternates: {
      canonical: `/certifications/${slug}/exam-tips`,
    },
  };
}

function DifficultyStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-5 w-5 ${star <= rating ? "text-amber-400" : "text-zinc-200 dark:text-zinc-700"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function MetricCard({ 
  label, 
  value, 
  description, 
  icon 
}: { 
  label: string; 
  value: React.ReactNode; 
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
      </div>
      <div className="mt-2">{value}</div>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}

function QuestionBreakdownChart({ breakdown }: { breakdown: ExamTips["questionBreakdown"] }) {
  const items = [
    { label: "Scenario-Based", value: breakdown.scenarioBased, color: "bg-blue-500" },
    { label: "Theory/Recall", value: breakdown.straightTheory, color: "bg-emerald-500" },
    { label: "Drag & Drop", value: breakdown.dragAndDrop, color: "bg-purple-500" },
    { label: "Navigation", value: breakdown.navigation, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-700 dark:text-zinc-300">{item.label}</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.value}%</span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className={`h-full ${item.color} transition-all duration-500`}
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperienceCard({ experience }: { experience: UserExperience }) {
  const isPassed = experience.outcome === "passed";
  
  return (
    <div className={`rounded-lg border p-4 ${
      isPassed 
        ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30" 
        : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
    }`}>
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          isPassed 
            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
        }`}>
          {isPassed ? "✓ Passed" : "✗ Failed"}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {experience.source} • {experience.date}
        </span>
      </div>
      <blockquote className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
        &ldquo;{experience.text}&rdquo;
      </blockquote>
    </div>
  );
}

function ResourceCard({ resource }: { resource: RecommendedResource }) {
  const priorityColors = {
    essential: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    recommended: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    optional: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  };
  
  const typeIcons = {
    course: "📚",
    practice: "✍️",
    "hands-on": "🛠️",
    documentation: "📄",
  };

  return (
    <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <span className="text-xl">{typeIcons[resource.type]}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {resource.url ? (
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-zinc-900 hover:text-emerald-600 dark:text-zinc-100"
            >
              {resource.name} ↗
            </a>
          ) : (
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{resource.name}</span>
          )}
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[resource.priority]}`}>
            {resource.priority}
          </span>
        </div>
        {resource.note && (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{resource.note}</p>
        )}
      </div>
    </div>
  );
}

export default async function ExamTipsPage({ params }: PageProps) {
  const { slug } = await params;
  const cert = getCertificationBySlug(slug);
  const tips = getExamTips(slug);

  if (!cert || !tips) {
    notFound();
  }

  const passedCount = tips.userExperiences.filter((e) => e.outcome === "passed").length;
  const failedCount = tips.userExperiences.filter((e) => e.outcome === "failed").length;

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    ...breadcrumbs.certification(cert.name, slug),
    { name: "Exam Tips", url: `/certifications/${slug}/exam-tips` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-b from-amber-50 to-white py-12 dark:from-zinc-900 dark:to-zinc-950">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Link 
              href={`/certifications/${slug}`}
              className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              ← Back to {cert.name}
            </Link>
            
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              💡 {cert.name} Exam Tips & Real Experiences
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Insights from {tips.userExperiences.length} real test-takers who took the 
              ServiceNow {cert.fullName} certification exam.
            </p>
            
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs dark:bg-green-900">✓</span>
                {passedCount} passed
              </span>
              <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs dark:bg-red-900">✗</span>
                {failedCount} failed
              </span>
              <span className="text-zinc-400">|</span>
              <span className="text-zinc-600 dark:text-zinc-400">
                Last updated: {new Date(tips.lastUpdated).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="border-b border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                icon="📊"
                label="Difficulty"
                value={
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      {tips.difficulty.label}
                    </span>
                    <DifficultyStars rating={tips.difficulty.rating} />
                  </div>
                }
                description={tips.difficulty.description}
              />
              <MetricCard
                icon="⏱️"
                label="Time Pressure"
                value={
                  <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {tips.timePressure.label}
                  </span>
                }
                description={tips.timePressure.description}
              />
              <MetricCard
                icon="❓"
                label="Question Style"
                value={
                  <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {tips.questionBreakdown.scenarioBased}% Scenario
                  </span>
                }
                description="Majority of questions are scenario-based, not straight recall."
              />
            </div>
          </div>
        </section>

        {/* Question Breakdown */}
        <section className="py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  Question Type Breakdown
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Based on user-reported experiences. Percentages may overlap.
                </p>
                <div className="mt-6">
                  <QuestionBreakdownChart breakdown={tips.questionBreakdown} />
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  ⚠️ Key Insights
                </h2>
                <ul className="mt-4 space-y-3">
                  {tips.keyInsights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                        {index + 1}
                      </span>
                      <span className="text-zinc-700 dark:text-zinc-300">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Common Gotchas */}
        <section className="bg-red-50 py-12 dark:bg-red-950/20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              🚨 Common Gotchas
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Watch out for these tricky areas that catch many test-takers off guard.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {tips.commonGotchas.map((gotcha, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-2 rounded-lg bg-white p-4 dark:bg-zinc-900"
                >
                  <span className="text-red-500">⚡</span>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{gotcha}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pro Tips */}
        <section className="py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              💪 Pro Tips from Those Who Passed
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {tips.tips.map((tip, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30"
                >
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recommended Resources */}
        <section className="bg-zinc-50 py-12 dark:bg-zinc-900">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              📚 Recommended Resources
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Resources frequently cited by successful candidates.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {tips.recommendedResources.map((resource, index) => (
                <ResourceCard key={index} resource={resource} />
              ))}
            </div>
          </div>
        </section>

        {/* Exam Platform Info */}
        {tips.examPlatform && (
          <section className="py-12">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                🖥️ Exam Platform
              </h2>
              <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {tips.examPlatform.provider}
                  </span>
                  {tips.examPlatform.note && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {tips.examPlatform.note}
                    </span>
                  )}
                </div>
                
                {tips.examPlatform.recommendation && (
                  <div className="mt-4 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      💡 {tips.examPlatform.recommendation}
                    </p>
                  </div>
                )}
                
                {tips.examPlatform.onlineIssues && tips.examPlatform.onlineIssues.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Common online proctored issues:
                    </p>
                    <ul className="mt-2 space-y-1">
                      {tips.examPlatform.onlineIssues.map((issue, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                          <span className="text-red-500">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* User Experiences */}
        <section className="bg-zinc-50 py-12 dark:bg-zinc-900">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              🗣️ Real Experiences
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              What actual test-takers said about this exam.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {tips.userExperiences.map((experience, index) => (
                <ExperienceCard key={index} experience={experience} />
              ))}
            </div>
          </div>
        </section>

        {/* Prerequisite Warning */}
        {tips.prerequisites && tips.prerequisites.note && (
          <section className="border-t border-zinc-200 bg-amber-50 py-8 dark:border-zinc-800 dark:bg-amber-950/20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-200">
                    Important Prerequisite Notice
                  </p>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                    {tips.prerequisites.note}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-emerald-600 py-12 dark:bg-emerald-700">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white">
              Ready to Practice?
            </h2>
            <p className="mt-3 text-emerald-100">
              Put these tips into action with our {cert.name} practice questions.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={`/certifications/${slug}`}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-6 font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
              >
                Start Practicing
              </Link>
              <Link
                href={`/certifications/${slug}/study-guide`}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-white px-6 font-medium text-white transition-colors hover:bg-emerald-500"
              >
                View Study Guide
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
