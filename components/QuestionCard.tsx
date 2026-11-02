"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Question } from "@/types";
import { letterForOptionId, optionLetter, orderOptionsForQuestion } from "@/lib/option-order";
import {
  correctExplanationText,
  docLinkLabel,
  getQuestionReferences,
  splitTextWithUrls,
} from "@/lib/doc-links";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  showAnswer?: boolean;
  onAnswer?: (questionId: string, selectedAnswers: string[]) => void;
  // Render the answer and explanation in the initial HTML inside a collapsed
  // <details>. Only pass this for free questions.
  explanationInHtml?: boolean;
}

export default function QuestionCard({
  question,
  questionNumber,
  showAnswer = false,
  onAnswer,
  explanationInHtml = false,
}: QuestionCardProps) {
  // Display order is deterministic per question id (see lib/option-order.ts);
  // answers are still keyed by option id.
  const options = useMemo(
    () => orderOptionsForQuestion(question.id, question.options),
    [question.id, question.options]
  );
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(showAnswer);

  const isMultipleSelect = question.type === "multiple_select";
  const isCorrect =
    selectedAnswers.length === question.correctAnswers.length &&
    selectedAnswers.every((a) => question.correctAnswers.includes(a));

  // Define callbacks first
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

  // Keyboard navigation
  useEffect(() => {
    if (revealed) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();

      // A-D or 1-4 to select options
      const optionKeys: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, "1": 0, "2": 1, "3": 2, "4": 3 };
      if (key in optionKeys) {
        const optionIndex = optionKeys[key];
        if (options[optionIndex]) {
          handleOptionClick(options[optionIndex].id);
        }
        return;
      }

      // Enter to reveal answer (when answer is selected)
      if (e.key === "Enter" && selectedAnswers.length > 0) {
        handleReveal();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [revealed, options, selectedAnswers.length, handleReveal, handleOptionClick]);

  const getOptionClasses = (optionId: string) => {
    const base =
      "flex items-start gap-3 rounded-lg border p-3 sm:p-4 transition-all cursor-pointer";
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

  const getCognitiveLevelStyles = (level: string) => {
    switch (level) {
      case "knowledge":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "understanding":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
      case "application":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300";
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
    <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
      {/* Question Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
          {questionNumber}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 text-xs font-medium ${getCognitiveLevelStyles(question.cognitiveLevel)}`}
          >
            {question.cognitiveLevel}
          </span>
          {isMultipleSelect && (
            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              Select all that apply
            </span>
          )}
        </div>
      </div>

      {/* Question Text */}
      <p className="mt-4 text-base sm:text-lg font-medium leading-relaxed text-zinc-900 dark:text-zinc-100">
        {question.question}
      </p>

      {/* Options */}
      <div className="mt-6 space-y-3">
        {options.map((option, index) => (
          <div
            key={option.id}
            className={getOptionClasses(option.id)}
            onClick={() => handleOptionClick(option.id)}
          >
            <span
              className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                selectedAnswers.includes(option.id)
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-zinc-300 text-zinc-500 dark:border-zinc-600"
              }`}
            >
              {optionLetter(index)}
            </span>
            <span className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {option.text}
            </span>
          </div>
        ))}
      </div>

      {/* Interaction hint or Check Answer Button */}
      <div className="mt-6">
        {selectedAnswers.length === 0 && !revealed && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
            👆 Click an option above to select your answer
          </p>
        )}
        {selectedAnswers.length > 0 && !revealed && (
          <button
            onClick={handleReveal}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-700 animate-pulse hover:animate-none"
          >
            ✓ Check Answer
          </button>
        )}
      </div>

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

          {/* Main explanation */}
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            <LinkedText text={correctExplanationText(question)} />
          </p>

          {/* Wrong answer explanations for selected wrong answers */}
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
                    className="mt-3 border-l-2 border-red-300 pl-3 dark:border-red-700"
                  >
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium">
                        Why {letterForOptionId(options, wrongId)} is wrong:{" "}
                      </span>
                      {wrongExplanation.explanation}
                    </p>
                    {wrongExplanation.reference && (
                      <p className="mt-1 text-xs text-zinc-500">
                        Reference: <LinkedText text={wrongExplanation.reference} />
                      </p>
                    )}
                  </div>
                );
              })}

          <QuestionReferenceList question={question} />
        </div>
      )}

      {/* Static answer + explanation for free questions, collapsed until opened.
          Replaced by the interactive explanation above once the answer is checked. */}
      {explanationInHtml && !revealed && (
        <details className="group mt-6 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
          <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-zinc-700 hover:text-emerald-700 dark:text-zinc-300 dark:hover:text-emerald-400">
            Show answer and explanation
          </summary>
          <div className="border-t border-zinc-200 px-4 pb-4 dark:border-zinc-700">
            <p className="mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Correct answer:{" "}
              {options
                .map((option, index) => ({ option, index }))
                .filter(({ option }) => question.correctAnswers.includes(option.id))
                .map(({ option, index }) => `${optionLetter(index)}. ${option.text}`)
                .join("; ")}
            </p>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              <LinkedText text={correctExplanationText(question)} />
            </p>
            {typeof question.explanation !== "string" &&
              (question.explanation.wrongAnswers?.length ?? 0) > 0 && (
                <ul className="mt-3 space-y-2">
                  {options
                    .map((option, index) => ({ option, index, wrong: getWrongAnswerExplanation(option.id) }))
                    .filter(({ option, wrong }) => wrong && !question.correctAnswers.includes(option.id))
                    .map(({ option, index, wrong }) => (
                      <li
                        key={option.id}
                        className="border-l-2 border-zinc-300 pl-3 text-sm text-zinc-600 dark:border-zinc-600 dark:text-zinc-400"
                      >
                        <span className="font-medium">Why {optionLetter(index)} is wrong: </span>
                        {wrong!.explanation}
                      </li>
                    ))}
                </ul>
              )}
            <QuestionReferenceList question={question} />
          </div>
        </details>
      )}
    </div>
  );
}

const linkClassName =
  "text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-800 dark:text-emerald-400 dark:decoration-emerald-700 dark:hover:text-emerald-300";

// Text with any URLs rendered as real links (labelled by site, not the raw URL).
function LinkedText({ text }: { text: string }) {
  return (
    <>
      {splitTextWithUrls(text).map((segment, index) =>
        segment.type === "link" ? (
          <a
            key={index}
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            {docLinkLabel(segment.href)}
          </a>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </>
  );
}

function QuestionReferenceList({ question }: { question: Question }) {
  const { links, notes } = getQuestionReferences(question);
  if (links.length === 0 && notes.length === 0) return null;
  // Several links can share a label (e.g. two course lessons); number the repeats.
  const labelCounts = new Map<string, number>();
  const labels = links.map(({ href, title }) => {
    const label = title ?? docLinkLabel(href);
    const count = (labelCounts.get(label) ?? 0) + 1;
    labelCounts.set(label, count);
    return count > 1 ? `${label} (${count})` : label;
  });
  return (
    <div className="mt-3 text-xs text-zinc-500">
      <span className="font-medium">References: </span>
      {links.map(({ href }, index) => (
        <span key={href}>
          {index > 0 && ", "}
          <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
            {labels[index]}
          </a>
        </span>
      ))}
      {notes.length > 0 && (
        <span>
          {links.length > 0 && ", "}
          {notes.join(", ")}
        </span>
      )}
    </div>
  );
}
