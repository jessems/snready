"use client";

import Link from "next/link";
import type { ExamTips } from "@/types";

interface ExamTipsSnippetProps {
  tips: ExamTips;
  certSlug: string;
  certName: string;
}

function DifficultyBadge({ rating, label }: { rating: number; label: string }) {
  const colors = {
    Easy: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    Moderate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    Hard: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    "Very Hard": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };
  
  return (
    <div className="flex items-center gap-2">
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[label as keyof typeof colors] || colors.Moderate}`}>
        {label}
      </span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${star <= rating ? "text-amber-400" : "text-zinc-200 dark:text-zinc-700"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  );
}

function TimePressureBadge({ label }: { label: string }) {
  const colors = {
    Low: "text-green-600 dark:text-green-400",
    Moderate: "text-yellow-600 dark:text-yellow-400",
    High: "text-orange-600 dark:text-orange-400",
    "Very High": "text-red-600 dark:text-red-400",
  };
  
  const icons = {
    Low: "🐢",
    Moderate: "⏱️",
    High: "⚡",
    "Very High": "🔥",
  };
  
  return (
    <span className={`text-sm font-medium ${colors[label as keyof typeof colors] || colors.Moderate}`}>
      {icons[label as keyof typeof icons] || "⏱️"} {label} time pressure
    </span>
  );
}

export function ExamTipsSnippet({ tips, certSlug, certName }: ExamTipsSnippetProps) {
  const passedCount = tips.userExperiences.filter((e) => e.outcome === "passed").length;
  const failedCount = tips.userExperiences.filter((e) => e.outcome === "failed").length;
  
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          💡 Real Exam Insights
        </h2>
        <Link
          href={`/certifications/${certSlug}/prepare#real-experiences`}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
        >
          See all tips →
        </Link>
      </div>
      
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        What {tips.userExperiences.length} real test-takers say about the {certName} exam
      </p>
      
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* Difficulty */}
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Difficulty
          </div>
          <div className="mt-1">
            <DifficultyBadge rating={tips.difficulty.rating} label={tips.difficulty.label} />
          </div>
        </div>
        
        {/* Time Pressure */}
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Time Pressure
          </div>
          <div className="mt-1">
            <TimePressureBadge label={tips.timePressure.label} />
          </div>
        </div>
      </div>
      
      {/* Top insight */}
      <div className="mt-4 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
        <div className="flex gap-2">
          <span className="text-amber-600">⚠️</span>
          <p className="text-sm text-amber-800 dark:text-amber-200">
            {tips.keyInsights[0]}
          </p>
        </div>
      </div>
      
      {/* Quick stats */}
      <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <span className="text-green-500">✓</span>
          {passedCount} passed
        </span>
        <span className="flex items-center gap-1">
          <span className="text-red-500">✗</span>
          {failedCount} failed
        </span>
        <span>|</span>
        <span>{tips.tips.length} tips</span>
      </div>
      
      {/* Sample quote */}
      {tips.userExperiences[0] && (
        <blockquote className="mt-4 border-l-2 border-zinc-200 pl-3 text-sm italic text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          &ldquo;{tips.userExperiences[0].text.slice(0, 150)}
          {tips.userExperiences[0].text.length > 150 ? "..." : ""}&rdquo;
          <footer className="mt-1 text-xs text-zinc-500">
            — {tips.userExperiences[0].outcome === "passed" ? "✓ Passed" : "✗ Failed"}, {tips.userExperiences[0].source}
          </footer>
        </blockquote>
      )}
      
      <Link
        href={`/certifications/${certSlug}/prepare#real-experiences`}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
      >
        View all exam tips & experiences
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </section>
  );
}
