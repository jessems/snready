"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { MockExamSession } from "@/types/mockExam";
import {
  saveSession,
  pauseSession,
  resumeSession,
  getRemainingMs,
  isTimeUp,
  completeSession,
  formatTime,
} from "@/lib/mockExam";

interface MockExamProps {
  initialSession: MockExamSession;
  onComplete: (sessionId: string) => void;
}

export default function MockExam({ initialSession, onComplete }: MockExamProps) {
  const router = useRouter();
  const [session, setSession] = useState<MockExamSession>(initialSession);
  const [remainingMs, setRemainingMs] = useState(() =>
    getRemainingMs(initialSession)
  );
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const hasShownWarningRef = useRef(false);

  const currentQuestion = session.questions[session.currentIndex];
  const selectedAnswers = session.answers[currentQuestion?.id] || [];
  const isMultiSelect = currentQuestion?.type === "multiple_select";
  const answeredCount = Object.keys(session.answers).length;
  const unansweredCount = session.questionCount - answeredCount;

  // Timer effect
  useEffect(() => {
    if (session.status !== "in-progress") return;

    const interval = setInterval(() => {
      const remaining = getRemainingMs(session);
      setRemainingMs(remaining);

      // Show warning at 5 minutes
      if (remaining <= 5 * 60 * 1000 && !hasShownWarningRef.current) {
        hasShownWarningRef.current = true;
        setShowTimeWarning(true);
        setTimeout(() => setShowTimeWarning(false), 5000);
      }

      // Auto-submit when time is up
      if (remaining <= 0) {
        handleSubmit();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  // Save session on changes
  useEffect(() => {
    saveSession(session);
  }, [session]);

  const handleAnswerSelect = useCallback(
    (optionId: string) => {
      if (session.status !== "in-progress") return;

      setSession((prev) => {
        const currentAnswers = prev.answers[currentQuestion.id] || [];
        let newAnswers: string[];

        if (isMultiSelect) {
          if (currentAnswers.includes(optionId)) {
            newAnswers = currentAnswers.filter((a) => a !== optionId);
          } else {
            newAnswers = [...currentAnswers, optionId];
          }
        } else {
          newAnswers = [optionId];
        }

        return {
          ...prev,
          answers: {
            ...prev.answers,
            [currentQuestion.id]: newAnswers,
          },
        };
      });
    },
    [currentQuestion?.id, isMultiSelect, session.status]
  );

  const handleNavigate = useCallback((index: number) => {
    setSession((prev) => ({
      ...prev,
      currentIndex: index,
    }));
  }, []);

  const handlePause = useCallback(() => {
    setSession((prev) => pauseSession(prev));
    setShowPauseModal(true);
  }, []);

  const handleResume = useCallback(() => {
    setSession((prev) => resumeSession(prev));
    setShowPauseModal(false);
  }, []);

  const handleSubmit = useCallback(() => {
    const result = completeSession(session);
    onComplete(result.sessionId);
  }, [session, onComplete]);

  const handleQuit = useCallback(() => {
    // Save current progress
    saveSession(pauseSession(session));
    router.push(`/${session.certSlug}/mock-exam`);
  }, [session, router]);

  // Timer warning color
  const timerColor =
    remainingMs <= 5 * 60 * 1000
      ? "text-red-600"
      : remainingMs <= 15 * 60 * 1000
        ? "text-amber-600"
        : "text-zinc-900 dark:text-zinc-100";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header with Timer */}
      <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {session.certName} Mock Exam
              </span>
              <span className="text-sm text-zinc-500">
                Question {session.currentIndex + 1} of {session.questionCount}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className={`flex items-center gap-2 font-mono text-lg ${timerColor}`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(remainingMs)}
              </div>

              {/* Pause Button */}
              <button
                onClick={handlePause}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Pause
              </button>

              {/* Submit Button */}
              <button
                onClick={() => setShowSubmitModal(true)}
                className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Submit Exam
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-2 flex gap-0.5">
            {session.questions.map((q, i) => {
              const isAnswered = !!session.answers[q.id]?.length;
              const isCurrent = i === session.currentIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => handleNavigate(i)}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    isCurrent
                      ? "bg-emerald-600"
                      : isAnswered
                        ? "bg-emerald-300"
                        : "bg-zinc-200 dark:bg-zinc-700"
                  }`}
                  title={`Question ${i + 1}${isAnswered ? " (answered)" : ""}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Time Warning Toast */}
      {showTimeWarning && (
        <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-lg">
          ⚠️ 5 minutes remaining!
        </div>
      )}

      {/* Question Area */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        {currentQuestion && (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {/* Question Text */}
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  Question {session.currentIndex + 1}
                </span>
                {isMultiSelect && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                    Select all that apply
                  </span>
                )}
              </div>
              <p className="text-lg text-zinc-900 dark:text-zinc-100">
                {currentQuestion.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswers.includes(option.id);

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-all ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950"
                        : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-750"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-zinc-300 text-zinc-500 dark:border-zinc-600"
                      }`}
                    >
                      {option.id.toUpperCase()}
                    </span>
                    <span
                      className={`pt-0.5 ${
                        isSelected
                          ? "text-emerald-900 dark:text-emerald-100"
                          : "text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => handleNavigate(session.currentIndex - 1)}
            disabled={session.currentIndex === 0}
            className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="font-medium text-emerald-600">{answeredCount}</span>
            <span>answered</span>
            {unansweredCount > 0 && (
              <>
                <span>•</span>
                <span className="font-medium text-amber-600">{unansweredCount}</span>
                <span>remaining</span>
              </>
            )}
          </div>

          <button
            onClick={() => handleNavigate(session.currentIndex + 1)}
            disabled={session.currentIndex === session.questionCount - 1}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Question Navigator */}
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Question Navigator
          </h3>
          <div className="grid grid-cols-10 gap-2">
            {session.questions.map((q, i) => {
              const isAnswered = !!session.answers[q.id]?.length;
              const isCurrent = i === session.currentIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => handleNavigate(i)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    isCurrent
                      ? "bg-emerald-600 text-white"
                      : isAnswered
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-800"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-emerald-600" />
              Current
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-emerald-100 dark:bg-emerald-900" />
              Answered
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-zinc-100 dark:bg-zinc-800" />
              Unanswered
            </div>
          </div>
        </div>
      </div>

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Exam Paused
            </h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Your progress has been saved. The timer is stopped.
            </p>
            <div className="mt-4 rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Time Remaining</span>
                <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                  {formatTime(remainingMs)}
                </span>
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-zinc-500">Questions Answered</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {answeredCount} / {session.questionCount}
                </span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleQuit}
                className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Save & Exit
              </button>
              <button
                onClick={handleResume}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Resume Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Submit Exam?
            </h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Are you sure you want to submit your exam? You cannot change your answers after submission.
            </p>

            {unansweredCount > 0 && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  ⚠️ You have <strong>{unansweredCount}</strong> unanswered question{unansweredCount > 1 ? "s" : ""}.
                </p>
              </div>
            )}

            <div className="mt-4 rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Questions Answered</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {answeredCount} / {session.questionCount}
                </span>
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-zinc-500">Time Used</span>
                <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                  {formatTime(session.durationMinutes * 60 * 1000 - remainingMs)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Continue Exam
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
