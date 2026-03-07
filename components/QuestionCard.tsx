"use client";

import { useState, useEffect, useCallback } from "react";
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

  const isMultipleSelect = question.type === "multiple_select";
  const isCorrect =
    selectedAnswers.length === question.correctAnswers.length &&
    selectedAnswers.every((a) => question.correctAnswers.includes(a));

  const handleOptionClick = useCallback((optionId: string) => {
    if (revealed) return;

    let newAnswers: string[];
    if (isMultipleSelect) {
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
  }, [revealed, isMultipleSelect, selectedAnswers, question.id, onAnswer]);

  const handleReveal = useCallback(() => {
    setRevealed(true);
  }, []);

  useEffect(() => {
    if (revealed) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();
      const optionKeys: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, "1": 0, "2": 1, "3": 2, "4": 3 };
      
      if (key in optionKeys) {
        const optionIndex = optionKeys[key];
        if (question.options[optionIndex]) {
          handleOptionClick(question.options[optionIndex].id);
        }
        return;
      }

      if (e.key === "Enter" && selectedAnswers.length > 0) {
        handleReveal();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [revealed, question.options, selectedAnswers.length, handleReveal, handleOptionClick]);

  const getOptionClasses = (optionId: string) => {
    const base = "flex items-start gap-3 rounded-xl border p-4 transition-all cursor-pointer";
    const isSelected = selectedAnswers.includes(optionId);
    const isCorrectAnswer = question.correctAnswers.includes(optionId);

    if (!revealed) {
      if (isSelected) {
        return `${base} border-[var(--primary)] bg-[rgba(99,91,255,0.05)] shadow-sm`;
      }
      return `${base} border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--surface)]`;
    }

    if (isCorrectAnswer) {
      return `${base} border-[var(--success)] bg-[var(--success-bg)]`;
    }
    if (isSelected && !isCorrectAnswer) {
      return `${base} border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-950/30`;
    }
    return `${base} border-[var(--border)] bg-[var(--surface)] opacity-50`;
  };

  const getCognitiveLevelStyles = (level: string) => {
    switch (level) {
      case "knowledge":
        return "bg-[var(--success-bg)] text-[var(--success)]";
      case "understanding":
        return "bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300";
      case "application":
        return "bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-300";
      default:
        return "bg-[var(--surface)] text-[var(--text-muted)]";
    }
  };

  const getWrongAnswerExplanation = (optionId: string) => {
    if (typeof question.explanation === "string") {
      return null;
    }
    return question.explanation.wrongAnswers?.find(
      (wa) => wa.choiceId === optionId
    );
  };

  return (
    <div className="stripe-card p-6">
      {/* Question Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--gradient-end)] text-sm font-bold text-white">
          {questionNumber}
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${getCognitiveLevelStyles(question.cognitiveLevel)}`}>
            {question.cognitiveLevel}
          </span>
          {isMultipleSelect && (
            <span className="rounded-md bg-[rgba(99,91,255,0.1)] px-2.5 py-1 text-xs font-semibold text-[var(--primary)]">
              Select all that apply
            </span>
          )}
        </div>
      </div>

      {/* Question Text */}
      <p className="mt-5 text-lg font-medium leading-relaxed text-[var(--text-primary)]">
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
              className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border-2 text-sm font-semibold transition-all ${
                selectedAnswers.includes(option.id)
                  ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                  : "border-[var(--border)] text-[var(--text-muted)]"
              }`}
            >
              {option.id.toUpperCase()}
            </span>
            <span className="text-[var(--text-secondary)] leading-relaxed">
              {option.text}
            </span>
          </div>
        ))}
      </div>

      {/* Interaction hint or Check Answer Button */}
      <div className="mt-6">
        {selectedAnswers.length === 0 && !revealed && (
          <p className="text-sm text-[var(--text-muted)] flex items-center gap-2">
            <span className="text-lg">👆</span>
            Select an option above to continue
          </p>
        )}
        {selectedAnswers.length > 0 && !revealed && (
          <button
            onClick={handleReveal}
            className="btn-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Check Answer
          </button>
        )}
      </div>

      {/* Explanation */}
      {revealed && (
        <div className={`mt-6 rounded-xl p-5 ${isCorrect ? 'bg-[var(--success-bg)] border border-[var(--success)]/20' : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'}`}>
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <>
                <svg className="w-5 h-5 text-[var(--success)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-[var(--success)]">Correct!</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-red-600 dark:text-red-400">Incorrect</span>
              </>
            )}
          </div>

          <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
            {typeof question.explanation === "string"
              ? question.explanation
              : question.explanation.correct}
          </p>

          {!isCorrect &&
            typeof question.explanation !== "string" &&
            selectedAnswers
              .filter((id) => !question.correctAnswers.includes(id))
              .map((wrongId) => {
                const wrongExplanation = getWrongAnswerExplanation(wrongId);
                if (!wrongExplanation) return null;
                return (
                  <div
                    key={wrongId}
                    className="mt-4 border-l-2 border-red-300 pl-4 dark:border-red-700"
                  >
                    <p className="text-sm text-[var(--text-secondary)]">
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        Why {wrongId.toUpperCase()} is wrong:{" "}
                      </span>
                      {wrongExplanation.explanation}
                    </p>
                    {wrongExplanation.reference && (
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        Reference: {wrongExplanation.reference}
                      </p>
                    )}
                  </div>
                );
              })}

          {question.references && question.references.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                References
              </span>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                {question.references.join(", ")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
