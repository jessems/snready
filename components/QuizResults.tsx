"use client";

import { Question, QuizResult } from "@/types/quiz";

interface QuizResultsProps {
  questions: Question[];
  results: QuizResult[];
  onRetry: () => void;
  onReviewQuestion: (index: number) => void;
}

export default function QuizResults({
  questions,
  results,
  onRetry,
  onReviewQuestion,
}: QuizResultsProps) {
  const correctCount = results.filter((r) => r.isCorrect).length;
  const totalQuestions = questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = percentage >= 70;

  return (
    <div>
      {/* Score Display */}
      <div className="text-center mb-8">
        <div
          className={`inline-flex items-center justify-center w-28 h-28 rounded-2xl mb-4 ${
            passed ? "bg-[var(--success-light)]" : "bg-[var(--error-light)]"
          }`}
        >
          <span
            className={`text-4xl font-bold ${
              passed ? "text-[var(--success)]" : "text-[var(--error)]"
            }`}
          >
            {percentage}%
          </span>
        </div>

        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
          {passed ? "Congratulations!" : "Keep Practicing!"}
        </h2>

        <p className="text-[var(--text-secondary)] mb-3">
          You scored {correctCount} out of {totalQuestions} questions correctly.
        </p>

        <span
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            passed
              ? "bg-[var(--success-light)] text-[var(--success)]"
              : "bg-[var(--error-light)] text-[var(--error)]"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              passed ? "bg-[var(--success)]" : "bg-[var(--error)]"
            }`}
          />
          {passed ? "Passed" : "Not Passed"} (70% required)
        </span>
      </div>

      {/* Question Summary */}
      <div className="mb-6">
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">
          Question Summary
        </p>
        <div className="space-y-2">
          {results.map((result, index) => {
            const question = questions.find((q) => q.id === result.questionId);
            return (
              <button
                key={result.questionId}
                onClick={() => onReviewQuestion(index)}
                className="w-full p-3.5 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--border)] transition-all text-left flex items-center gap-3 group"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    result.isCorrect
                      ? "bg-[var(--success-light)] text-[var(--success)]"
                      : "bg-[var(--error-light)] text-[var(--error)]"
                  }`}
                >
                  {result.isCorrect ? (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <p className="flex-1 text-sm text-[var(--text-secondary)] truncate group-hover:text-[var(--text-primary)]">
                  <span className="text-[var(--text-muted)]">Q{index + 1}:</span>{" "}
                  {question?.text}
                </p>
                <svg
                  className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            );
          })}
        </div>
      </div>

      {/* Retry Button */}
      <button onClick={onRetry} className="btn-primary w-full py-3.5">
        Try Again
      </button>
    </div>
  );
}
