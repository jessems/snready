"use client";

import { useState } from "react";
import type { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  showAnswer?: boolean;
  onAnswer?: (questionId: string, selectedAnswers: string[]) => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  showAnswer = false,
  onAnswer,
}: QuestionCardProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(showAnswer);

  const isMultipleChoice = question.type === "multiple";
  const isCorrect =
    selectedAnswers.length === question.correctAnswers.length &&
    selectedAnswers.every((a) => question.correctAnswers.includes(a));

  const handleOptionClick = (optionId: string) => {
    if (revealed) return;

    let newAnswers: string[];
    if (isMultipleChoice) {
      if (selectedAnswers.includes(optionId)) {
        newAnswers = selectedAnswers.filter((a) => a !== optionId);
      } else {
        newAnswers = [...selectedAnswers, optionId];
      }
    } else {
      newAnswers = [optionId];
    }

    setSelectedAnswers(newAnswers);
    onAnswer?.(question.id, newAnswers);
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  const getOptionClasses = (optionId: string) => {
    const base =
      "flex items-start gap-3 rounded-lg border p-4 transition-all cursor-pointer";
    const isSelected = selectedAnswers.includes(optionId);
    const isCorrectAnswer = question.correctAnswers.includes(optionId);

    if (!revealed) {
      if (isSelected) {
        return `${base} border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950`;
      }
      return `${base} border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800`;
    }

    // Revealed state
    if (isCorrectAnswer) {
      return `${base} border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-950`;
    }
    if (isSelected && !isCorrectAnswer) {
      return `${base} border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-950`;
    }
    return `${base} border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 opacity-60`;
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      {/* Question Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            {questionNumber}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${
                question.difficulty === "easy"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : question.difficulty === "medium"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {question.difficulty}
            </span>
            {isMultipleChoice && (
              <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Select all that apply
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Question Text */}
      <p className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
        {question.question}
      </p>

      {/* Options */}
      <div className="mt-6 space-y-3">
        {question.options.map((option) => (
          <div
            key={option.id}
            className={getOptionClasses(option.id)}
            onClick={() => handleOptionClick(option.id)}
          >
            <span
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-sm font-medium ${
                selectedAnswers.includes(option.id)
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-zinc-300 text-zinc-500 dark:border-zinc-600"
              }`}
            >
              {option.id.toUpperCase()}
            </span>
            <span className="text-zinc-700 dark:text-zinc-300">
              {option.text}
            </span>
          </div>
        ))}
      </div>

      {/* Check Answer Button */}
      {selectedAnswers.length > 0 && !revealed && (
        <div className="mt-6">
          <button
            onClick={handleReveal}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Check Answer
          </button>
        </div>
      )}

      {/* Explanation */}
      {revealed && (
        <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <>
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  Correct!
                </span>
              </>
            ) : (
              <>
                <span className="text-red-600 dark:text-red-400">✗</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  Incorrect
                </span>
              </>
            )}
          </div>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            {question.explanation}
          </p>
          {question.references && question.references.length > 0 && (
            <div className="mt-3">
              <span className="text-xs font-medium text-zinc-500">
                References:{" "}
              </span>
              <span className="text-xs text-zinc-500">
                {question.references.join(", ")}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
