"use client";

import { Question } from "@/types/quiz";

interface QuizQuestionProps {
  question: Question;
  selectedAnswers: number[];
  onAnswerSelect: (answerIndex: number) => void;
  isSubmitted: boolean;
}

export default function QuizQuestion({
  question,
  selectedAnswers,
  onAnswerSelect,
  isSubmitted,
}: QuizQuestionProps) {
  const isCorrect = (optionIndex: number) =>
    question.correctAnswers.includes(optionIndex);
  const isSelected = (optionIndex: number) =>
    selectedAnswers.includes(optionIndex);

  const getOptionClass = (optionIndex: number) => {
    const base = "option w-full text-left flex items-start gap-3";

    if (!isSubmitted) {
      return `${base} ${isSelected(optionIndex) ? "option-selected" : ""} ${
        isSubmitted ? "cursor-default" : "cursor-pointer"
      }`;
    }

    if (isCorrect(optionIndex)) {
      return `${base} option-correct cursor-default`;
    }

    if (isSelected(optionIndex) && !isCorrect(optionIndex)) {
      return `${base} option-incorrect cursor-default`;
    }

    return `${base} opacity-60 cursor-default`;
  };

  const getIndicatorClass = (optionIndex: number) => {
    const base = `w-5 h-5 mt-0.5 ${
      question.multiSelect ? "rounded" : "rounded-full"
    } border-2 flex-shrink-0 flex items-center justify-center transition-all`;

    if (!isSubmitted) {
      return `${base} ${
        isSelected(optionIndex)
          ? "border-[var(--accent)] bg-[var(--accent)]"
          : "border-[var(--border-dark)]"
      }`;
    }

    if (isCorrect(optionIndex)) {
      return `${base} border-[var(--success)] bg-[var(--success)]`;
    }

    if (isSelected(optionIndex) && !isCorrect(optionIndex)) {
      return `${base} border-[var(--error)] bg-[var(--error)]`;
    }

    return `${base} border-[var(--border)]`;
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
        {question.text}
      </h2>

      {question.multiSelect && (
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Select {question.correctAnswers.length} answers
        </p>
      )}

      <div className="space-y-2.5 mt-5">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !isSubmitted && onAnswerSelect(index)}
            disabled={isSubmitted}
            className={getOptionClass(index)}
          >
            <div className={getIndicatorClass(index)}>
              {(isSelected(index) || (isSubmitted && isCorrect(index))) && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span
              className={`text-[var(--text-secondary)] ${
                isSelected(index) && !isSubmitted
                  ? "text-[var(--text-primary)]"
                  : ""
              } ${isSubmitted && isCorrect(index) ? "text-[var(--success)] font-medium" : ""}`}
            >
              {option}
            </span>
          </button>
        ))}
      </div>

      {isSubmitted && question.explanation && (
        <div className="mt-6 p-4 bg-[var(--accent-light)] border border-[var(--accent)]/20 rounded-xl">
          <p className="text-sm font-medium text-[var(--accent)] mb-1">
            Explanation
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
