"use client";

import { useState, useMemo } from "react";
import { Question, QuizResult } from "@/types/quiz";
import QuizProgress from "./QuizProgress";
import QuizQuestion from "./QuizQuestion";
import QuizNavigation from "./QuizNavigation";
import QuizResults from "./QuizResults";

interface QuizProps {
  questions: Question[];
}

export default function Quiz({ questions }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex];

  const answeredQuestions = useMemo(
    () => new Set(Object.keys(answers).map(Number)),
    [answers]
  );

  const results: QuizResult[] = useMemo(() => {
    return questions.map((question) => {
      const userAnswers = answers[question.id] || [];
      const correctAnswers = question.correctAnswers;

      const isCorrect =
        userAnswers.length === correctAnswers.length &&
        userAnswers.every((a) => correctAnswers.includes(a));

      return {
        questionId: question.id,
        userAnswers,
        correctAnswers,
        isCorrect,
      };
    });
  }, [questions, answers]);

  const handleAnswerSelect = (answerIndex: number) => {
    const questionId = currentQuestion.id;
    const currentAnswers = answers[questionId] || [];

    if (currentQuestion.multiSelect) {
      if (currentAnswers.includes(answerIndex)) {
        setAnswers({
          ...answers,
          [questionId]: currentAnswers.filter((a) => a !== answerIndex),
        });
      } else {
        setAnswers({
          ...answers,
          [questionId]: [...currentAnswers, answerIndex],
        });
      }
    } else {
      setAnswers({
        ...answers,
        [questionId]: [answerIndex],
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowResults(true);
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setIsSubmitted(false);
    setShowResults(false);
  };

  const handleReviewQuestion = (index: number) => {
    setShowResults(false);
    setCurrentIndex(index);
  };

  const handleBackToResults = () => {
    setShowResults(true);
  };

  if (showResults) {
    return (
      <div className="card p-6 md:p-8">
        <QuizResults
          questions={questions}
          results={results}
          onRetry={handleRetry}
          onReviewQuestion={handleReviewQuestion}
        />
      </div>
    );
  }

  return (
    <div className="card p-6 md:p-8">
      <QuizProgress
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        answeredQuestions={answeredQuestions}
      />

      <QuizQuestion
        question={currentQuestion}
        selectedAnswers={answers[currentQuestion.id] || []}
        onAnswerSelect={handleAnswerSelect}
        isSubmitted={isSubmitted}
      />

      {isSubmitted && !showResults && (
        <div className="mt-6">
          <button
            onClick={handleBackToResults}
            className="text-[var(--accent)] hover:underline font-medium flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
            Back to Results
          </button>
        </div>
      )}

      <QuizNavigation
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        canGoBack={currentIndex > 0}
        canGoForward={currentIndex < questions.length - 1}
        isLastQuestion={currentIndex === questions.length - 1}
        isSubmitted={isSubmitted}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
