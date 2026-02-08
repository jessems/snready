"use client";

import { useState } from "react";
import Link from "next/link";
import type { Question } from "@/types";

interface SampleQuestionsProps {
  questions: Question[];
  certSlug: string;
  certName: string;
}

export function SampleQuestions({ questions, certSlug, certName }: SampleQuestionsProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});

  const handleOptionClick = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: [optionId]
    }));
  };

  const handleCheckAnswer = (questionId: string) => {
    setShowAnswers(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const isCorrect = (questionId: string, question: Question) => {
    const selected = selectedAnswers[questionId] || [];
    return selected.length === question.correctAnswers.length &&
      selected.every(s => question.correctAnswers.includes(s));
  };

  if (questions.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Sample Practice Questions
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Try a few questions to see what to expect on the {certName} exam
          </p>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => {
            const isExpanded = expandedQuestion === question.id;
            const hasSelected = (selectedAnswers[question.id] || []).length > 0;
            const answered = showAnswers[question.id];
            const correct = answered ? isCorrect(question.id, question) : null;

            return (
              <div
                key={question.id}
                className="rounded-xl border border-zinc-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Question Header - Always visible */}
                <button
                  onClick={() => setExpandedQuestion(isExpanded ? null : question.id)}
                  className="w-full px-5 py-4 flex items-start gap-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2">
                      {question.question}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                      <span className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
                        {question.cognitiveLevel}
                      </span>
                      <span>{question.options.length} options</span>
                    </div>
                  </div>
                  <svg
                    className={`h-5 w-5 shrink-0 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="mt-4 text-zinc-800 dark:text-zinc-200">
                      {question.question}
                    </p>

                    {/* Options */}
                    <div className="mt-4 space-y-2">
                      {question.options.map((option) => {
                        const isSelected = (selectedAnswers[question.id] || []).includes(option.id);
                        const isCorrectOption = question.correctAnswers.includes(option.id);

                        let optionStyles = "border-zinc-200 hover:border-emerald-300 dark:border-zinc-700 dark:hover:border-emerald-700";

                        if (answered) {
                          if (isCorrectOption) {
                            optionStyles = "border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-950";
                          } else if (isSelected && !isCorrectOption) {
                            optionStyles = "border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-950";
                          }
                        } else if (isSelected) {
                          optionStyles = "border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950";
                        }

                        return (
                          <button
                            key={option.id}
                            onClick={() => !answered && handleOptionClick(question.id, option.id)}
                            disabled={answered}
                            className={`w-full flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${optionStyles} ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                              answered && isCorrectOption
                                ? 'border-green-500 bg-green-500 text-white'
                                : answered && isSelected && !isCorrectOption
                                  ? 'border-red-500 bg-red-500 text-white'
                                  : isSelected
                                    ? 'border-emerald-500 bg-emerald-500 text-white'
                                    : 'border-zinc-300 text-zinc-500 dark:border-zinc-600'
                            }`}>
                              {option.id.toUpperCase()}
                            </span>
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">
                              {option.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Check Answer Button */}
                    {!answered && hasSelected && (
                      <button
                        onClick={() => handleCheckAnswer(question.id)}
                        className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                      >
                        Check Answer
                      </button>
                    )}

                    {/* Result */}
                    {answered && (
                      <div className={`mt-4 rounded-lg p-4 ${correct ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
                        <div className="flex items-center gap-2">
                          {correct ? (
                            <>
                              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="font-medium text-green-800 dark:text-green-200">Correct!</span>
                            </>
                          ) : (
                            <>
                              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span className="font-medium text-red-800 dark:text-red-200">
                                Incorrect - The correct answer is {question.correctAnswers.map(a => a.toUpperCase()).join(', ')}
                              </span>
                            </>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                          {question.explanation.correct}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href={`/practice-tests/${certSlug}`}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            View All Practice Questions
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <p className="mt-2 text-sm text-zinc-500">
            15 free questions available
          </p>
        </div>
      </div>
    </section>
  );
}
