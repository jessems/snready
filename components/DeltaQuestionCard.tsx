"use client";

import { useState } from "react";

// Delta questions have a simpler format than regular questions
interface DeltaQuestion {
  id: string;
  question: string;
  type: "single" | "multiple";
  options: string[];
  correctAnswers: string[];
  explanation: {
    correct: string;
    wrongAnswers?: Record<string, string>;
  };
  topic?: string;
  source?: string;
}

interface DeltaQuestionCardProps {
  question: DeltaQuestion;
  index: number;
}

export function DeltaQuestionCard({ question, index }: DeltaQuestionCardProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const isMultiple = question.type === "multiple";
  const correctAnswers = question.correctAnswers;

  const handleSelect = (option: string) => {
    if (showResult) return;

    const letter = option.charAt(0);
    if (isMultiple) {
      setSelectedAnswers((prev) =>
        prev.includes(letter)
          ? prev.filter((a) => a !== letter)
          : [...prev, letter]
      );
    } else {
      setSelectedAnswers([letter]);
    }
  };

  const handleCheck = () => {
    setShowResult(true);
  };

  const isCorrect =
    showResult &&
    selectedAnswers.length === correctAnswers.length &&
    selectedAnswers.every((a) => correctAnswers.includes(a));

  const getOptionClass = (option: string) => {
    const letter = option.charAt(0);
    const isSelected = selectedAnswers.includes(letter);
    const isCorrectAnswer = correctAnswers.includes(letter);

    if (!showResult) {
      return isSelected
        ? "border-violet-500 bg-violet-50 dark:bg-violet-950/50"
        : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600";
    }

    if (isCorrectAnswer) {
      return "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50";
    }
    if (isSelected && !isCorrectAnswer) {
      return "border-red-500 bg-red-50 dark:bg-red-950/50";
    }
    return "border-zinc-200 dark:border-zinc-700 opacity-60";
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          {index + 1}
        </span>
        {isMultiple && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            Select {correctAnswers.length}
          </span>
        )}
      </div>

      <p className="mt-4 text-zinc-900 dark:text-zinc-100">{question.question}</p>

      <div className="mt-4 space-y-2">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            disabled={showResult}
            className={`w-full rounded-lg border p-3 text-left transition-colors ${getOptionClass(option)}`}
          >
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              {option}
            </span>
          </button>
        ))}
      </div>

      {!showResult && selectedAnswers.length > 0 && (
        <button
          onClick={handleCheck}
          className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          Check Answer
        </button>
      )}

      {showResult && (
        <div
          className={`mt-4 rounded-lg p-4 ${
            isCorrect
              ? "bg-emerald-50 dark:bg-emerald-950/30"
              : "bg-red-50 dark:bg-red-950/30"
          }`}
        >
          <p
            className={`font-medium ${
              isCorrect
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-red-700 dark:text-red-300"
            }`}
          >
            {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {question.explanation.correct}
          </p>
          {question.source && (
            <p className="mt-2 text-xs text-zinc-500">
              Source: {question.source}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Export the type for use in the page
export type { DeltaQuestion };
