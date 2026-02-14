"use client";

import { useState } from "react";
import Link from "next/link";
import type { MockExamResult } from "@/types/mockExam";
import { formatDuration } from "@/lib/mockExam";

interface MockExamResultsProps {
  result: MockExamResult;
}

export default function MockExamResults({ result }: MockExamResultsProps) {
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);
  const [showOnlyIncorrect, setShowOnlyIncorrect] = useState(false);

  const questionsToShow = showOnlyIncorrect
    ? result.questionResults.filter((r) => !r.isCorrect)
    : result.questionResults;

  const incorrectCount = result.totalQuestions - result.correctAnswers;

  // Group by domain for analytics
  const domainStats: Record<string, { correct: number; total: number }> = {};
  for (const qr of result.questionResults) {
    const domain = qr.domain || "General";
    if (!domainStats[domain]) {
      domainStats[domain] = { correct: 0, total: 0 };
    }
    domainStats[domain].total++;
    if (qr.isCorrect) {
      domainStats[domain].correct++;
    }
  }

  const sortedDomains = Object.entries(domainStats).sort(
    (a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Results Header */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Pass/Fail Banner */}
          <div
            className={`mb-6 rounded-2xl p-6 text-center ${
              result.passed
                ? "bg-gradient-to-br from-emerald-500 to-green-600"
                : "bg-gradient-to-br from-red-500 to-rose-600"
            }`}
          >
            <div className="mb-2 text-6xl">
              {result.passed ? "🎉" : "📚"}
            </div>
            <h1 className="text-3xl font-bold text-white">
              {result.passed ? "Congratulations!" : "Keep Studying!"}
            </h1>
            <p className="mt-2 text-lg text-white/90">
              {result.passed
                ? `You passed the ${result.certName} mock exam!`
                : `You didn't pass this time, but don't give up!`}
            </p>
          </div>

          {/* Score Card */}
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-800">
              <div
                className={`text-4xl font-bold ${
                  result.passed ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {result.score}%
              </div>
              <div className="mt-1 text-sm text-zinc-500">Your Score</div>
              <div className="mt-1 text-xs text-zinc-400">
                Pass: {result.passingScore}%
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-800">
              <div className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                {result.correctAnswers}
                <span className="text-lg text-zinc-400">
                  /{result.totalQuestions}
                </span>
              </div>
              <div className="mt-1 text-sm text-zinc-500">Correct</div>
              <div className="mt-1 text-xs text-zinc-400">
                {incorrectCount} incorrect
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-800">
              <div className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                {formatDuration(result.timeUsedMs)}
              </div>
              <div className="mt-1 text-sm text-zinc-500">Time Used</div>
              <div className="mt-1 text-xs text-zinc-400">
                of {result.durationMinutes} min
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-800">
              <div className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                {Math.round(
                  (result.timeUsedMs / 1000 / result.totalQuestions)
                )}s
              </div>
              <div className="mt-1 text-sm text-zinc-500">Per Question</div>
              <div className="mt-1 text-xs text-zinc-400">avg time</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Domain Breakdown */}
        <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Performance by Domain
          </h2>
          <div className="space-y-3">
            {sortedDomains.map(([domain, stats]) => {
              const percent = Math.round((stats.correct / stats.total) * 100);
              const isPassing = percent >= result.passingScore;

              return (
                <div key={domain}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {domain}
                    </span>
                    <span
                      className={`font-medium ${
                        isPassing ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {stats.correct}/{stats.total} ({percent}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isPassing ? "bg-emerald-500" : "bg-red-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Section */}
        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Review Questions
            </h2>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <input
                type="checkbox"
                checked={showOnlyIncorrect}
                onChange={(e) => setShowOnlyIncorrect(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600"
              />
              Show only incorrect ({incorrectCount})
            </label>
          </div>

          {/* Question List */}
          <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {questionsToShow.map((qr, idx) => {
              const originalIndex = result.questionResults.findIndex(
                (r) => r.questionId === qr.questionId
              );
              const isExpanded = reviewIndex === originalIndex;

              return (
                <div key={qr.questionId} className="p-4">
                  <button
                    onClick={() =>
                      setReviewIndex(isExpanded ? null : originalIndex)
                    }
                    className="flex w-full items-start gap-3 text-left"
                  >
                    <span
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                        qr.isCorrect
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {qr.isCorrect ? "✓" : "✗"}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-500">
                          Q{originalIndex + 1}
                        </span>
                        {qr.domain && (
                          <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">
                            {qr.domain}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                        {qr.question}
                      </p>
                    </div>
                    <svg
                      className={`h-5 w-5 flex-shrink-0 text-zinc-400 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Expanded Review */}
                  {isExpanded && (
                    <div className="mt-4 space-y-4 pl-9">
                      {/* Options */}
                      <div className="space-y-2">
                        {qr.options.map((opt) => {
                          const isCorrect = qr.correctAnswers.includes(opt.id);
                          const wasSelected = qr.userAnswers.includes(opt.id);
                          const isWrong = wasSelected && !isCorrect;

                          let bgColor = "bg-zinc-50 dark:bg-zinc-800";
                          let borderColor =
                            "border-zinc-200 dark:border-zinc-700";
                          let textColor =
                            "text-zinc-700 dark:text-zinc-300";

                          if (isCorrect) {
                            bgColor = "bg-emerald-50 dark:bg-emerald-950";
                            borderColor =
                              "border-emerald-300 dark:border-emerald-700";
                            textColor =
                              "text-emerald-900 dark:text-emerald-100";
                          } else if (isWrong) {
                            bgColor = "bg-red-50 dark:bg-red-950";
                            borderColor = "border-red-300 dark:border-red-700";
                            textColor = "text-red-900 dark:text-red-100";
                          }

                          return (
                            <div
                              key={opt.id}
                              className={`flex items-start gap-3 rounded-lg border p-3 ${bgColor} ${borderColor}`}
                            >
                              <span
                                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-medium ${
                                  isCorrect
                                    ? "border-emerald-500 bg-emerald-500 text-white"
                                    : isWrong
                                      ? "border-red-500 bg-red-500 text-white"
                                      : "border-zinc-300 text-zinc-500 dark:border-zinc-600"
                                }`}
                              >
                                {opt.id.toUpperCase()}
                              </span>
                              <div className="flex-1">
                                <span className={textColor}>{opt.text}</span>
                                {wasSelected && (
                                  <span className="ml-2 text-xs text-zinc-500">
                                    (your answer)
                                  </span>
                                )}
                                {isCorrect && !wasSelected && (
                                  <span className="ml-2 text-xs text-emerald-600">
                                    (correct answer)
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {qr.explanation && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                          <h4 className="mb-2 font-medium text-blue-900 dark:text-blue-100">
                            Explanation
                          </h4>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            {qr.explanation.correct}
                          </p>
                          {qr.explanation.wrongAnswers &&
                            qr.explanation.wrongAnswers.length > 0 && (
                              <div className="mt-3 space-y-2">
                                <h5 className="text-xs font-medium uppercase text-blue-700 dark:text-blue-300">
                                  Why other options are wrong:
                                </h5>
                                {qr.explanation.wrongAnswers.map((wa) => (
                                  <p
                                    key={wa.choiceId}
                                    className="text-sm text-blue-700 dark:text-blue-300"
                                  >
                                    <strong>{wa.choiceId.toUpperCase()}:</strong>{" "}
                                    {wa.explanation}
                                  </p>
                                ))}
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href={`/${result.certSlug}/mock-exam`}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Take Another Exam
          </Link>
          <Link
            href={`/${result.certSlug}/practice-questions`}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-8 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Practice More Questions
          </Link>
          <Link
            href={`/${result.certSlug}`}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-8 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Back to {result.certName}
          </Link>
        </div>
      </div>
    </div>
  );
}
