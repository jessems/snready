"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Certification, Question } from "@/types";
import type { MockExamConfig, MockExamSession, MockExamHistoryEntry, MockExamResult } from "@/types/mockExam";
import {
  getInProgressSessions,
  getExamHistory,
  deleteSession,
  formatDuration,
  formatTime,
  getRemainingMs,
  loadSession,
  saveSession,
  createMockExamSession,
} from "@/lib/mockExam";
import MockExam from "@/components/MockExam";
import MockExamResults from "@/components/MockExamResults";

interface MockExamLandingProps {
  certification: Certification;
  examConfig: MockExamConfig;
  totalQuestions: number;
}

type ViewMode = "landing" | "exam" | "results";

export default function MockExamLanding({
  certification,
  examConfig,
  totalQuestions,
}: MockExamLandingProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("landing");
  const [currentSession, setCurrentSession] = useState<MockExamSession | null>(null);
  const [currentResult, setCurrentResult] = useState<MockExamResult | null>(null);
  const [inProgressSessions, setInProgressSessions] = useState<MockExamSession[]>([]);
  const [history, setHistory] = useState<MockExamHistoryEntry[]>([]);
  const [isStarting, setIsStarting] = useState(false);

  // Load sessions and history on mount
  useEffect(() => {
    setInProgressSessions(getInProgressSessions(examConfig.certSlug));
    setHistory(getExamHistory(examConfig.certSlug).slice(0, 10));
  }, [examConfig.certSlug]);

  const handleStartExam = useCallback(async () => {
    setIsStarting(true);

    try {
      // Dynamically load all questions
      const { getAllQuestionsForCertification } = await import("@/lib/data");
      const allQuestions = await getAllQuestionsForCertification(examConfig.certSlug);

      // Create new session
      const newSession = createMockExamSession(examConfig, allQuestions);
      saveSession(newSession);

      setCurrentSession(newSession);
      setViewMode("exam");
    } catch (error) {
      console.error("Failed to start exam:", error);
      alert("Failed to start exam. Please try again.");
    } finally {
      setIsStarting(false);
    }
  }, [examConfig]);

  const handleResumeSession = useCallback((sessionId: string) => {
    const session = loadSession(sessionId);
    if (session) {
      setCurrentSession(session);
      setViewMode("exam");
    }
  }, []);

  const handleDeleteSession = useCallback((sessionId: string) => {
    if (confirm("Are you sure you want to delete this exam session? Your progress will be lost.")) {
      deleteSession(sessionId);
      setInProgressSessions(getInProgressSessions(examConfig.certSlug));
    }
  }, [examConfig.certSlug]);

  const handleExamComplete = useCallback((sessionId: string) => {
    const completedSession = loadSession(sessionId);
    if (!completedSession) return;

    // Generate result
    const questionResults = completedSession.questions.map((q) => {
      const userAnswers = completedSession.answers[q.id] || [];
      const isCorrect =
        userAnswers.length === q.correctAnswers.length &&
        userAnswers.every((a) => q.correctAnswers.includes(a)) &&
        q.correctAnswers.every((a) => userAnswers.includes(a));

      return {
        questionId: q.id,
        question: q.question,
        options: q.options,
        userAnswers,
        correctAnswers: q.correctAnswers,
        isCorrect,
        explanation: q.explanation,
        topic: q.topic,
        domain: q.domain,
      };
    });

    const correctCount = questionResults.filter((r) => r.isCorrect).length;
    const score = Math.round((correctCount / completedSession.questionCount) * 100);

    const startTime = new Date(completedSession.startedAt).getTime();
    const endTime = completedSession.completedAt
      ? new Date(completedSession.completedAt).getTime()
      : Date.now();
    const timeUsedMs = endTime - startTime - completedSession.totalPausedMs;

    const result: MockExamResult = {
      sessionId: completedSession.id,
      certSlug: completedSession.certSlug,
      certName: completedSession.certName,
      completedAt: completedSession.completedAt || new Date().toISOString(),
      totalQuestions: completedSession.questionCount,
      correctAnswers: correctCount,
      score,
      passingScore: completedSession.passingScore,
      passed: score >= completedSession.passingScore,
      timeUsedMs,
      durationMinutes: completedSession.durationMinutes,
      questionResults,
    };

    setCurrentResult(result);
    setViewMode("results");

    // Refresh history
    setHistory(getExamHistory(examConfig.certSlug).slice(0, 10));
    setInProgressSessions(getInProgressSessions(examConfig.certSlug));
  }, [examConfig.certSlug]);

  const handleBackToLanding = useCallback(() => {
    setViewMode("landing");
    setCurrentSession(null);
    setCurrentResult(null);
    setInProgressSessions(getInProgressSessions(examConfig.certSlug));
    setHistory(getExamHistory(examConfig.certSlug).slice(0, 10));
  }, [examConfig.certSlug]);

  // Render exam view
  if (viewMode === "exam" && currentSession) {
    return <MockExam initialSession={currentSession} onComplete={handleExamComplete} />;
  }

  // Render results view
  if (viewMode === "results" && currentResult) {
    return (
      <div>
        <MockExamResults result={currentResult} />
        <div className="mx-auto max-w-4xl px-4 pb-8">
          <button
            onClick={handleBackToLanding}
            className="w-full rounded-lg border border-zinc-300 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Back to Mock Exam Home
          </button>
        </div>
      </div>
    );
  }

  // Landing view
  const avgScore =
    history.length > 0
      ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length)
      : null;

  const passRate =
    history.length > 0
      ? Math.round((history.filter((h) => h.passed).length / history.length) * 100)
      : null;

  return (
    <div className="space-y-8">
      {/* Exam Details Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Exam Details
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          This mock exam simulates real {certification.name} exam conditions.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-zinc-50 p-4 text-center dark:bg-zinc-800">
            <div className="text-2xl font-bold text-emerald-600">
              {examConfig.questionCount}
            </div>
            <div className="mt-1 text-sm text-zinc-500">Questions</div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4 text-center dark:bg-zinc-800">
            <div className="text-2xl font-bold text-emerald-600">
              {examConfig.durationMinutes} min
            </div>
            <div className="mt-1 text-sm text-zinc-500">Time Limit</div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4 text-center dark:bg-zinc-800">
            <div className="text-2xl font-bold text-emerald-600">
              {examConfig.passingScore}%
            </div>
            <div className="mt-1 text-sm text-zinc-500">To Pass</div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4 text-center dark:bg-zinc-800">
            <div className="text-2xl font-bold text-zinc-700 dark:text-zinc-300">
              {totalQuestions}+
            </div>
            <div className="mt-1 text-sm text-zinc-500">Question Pool</div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
          <h3 className="font-medium text-amber-900 dark:text-amber-100">
            ⚡ Real Exam Simulation
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-amber-800 dark:text-amber-200">
            <li>• Questions are randomly selected from our question bank</li>
            <li>• No feedback during the exam — results shown at the end</li>
            <li>• Timer runs continuously (you can pause if needed)</li>
            <li>• Review all questions and explanations after submission</li>
          </ul>
        </div>

        <div className="mt-6">
          <button
            onClick={handleStartExam}
            disabled={isStarting}
            className="w-full rounded-lg bg-emerald-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isStarting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Starting Exam...
              </span>
            ) : (
              "Start Mock Exam"
            )}
          </button>
        </div>
      </div>

      {/* In-Progress Sessions */}
      {inProgressSessions.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-amber-900 dark:text-amber-100">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Resume In-Progress Exam
          </h2>
          <div className="mt-4 space-y-3">
            {inProgressSessions.map((session) => {
              const remaining = getRemainingMs(session);
              const answered = Object.keys(session.answers).length;

              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border border-amber-300 bg-white p-4 dark:border-amber-700 dark:bg-amber-900/30"
                >
                  <div>
                    <div className="font-medium text-amber-900 dark:text-amber-100">
                      Started {new Date(session.startedAt).toLocaleDateString()} at{" "}
                      {new Date(session.startedAt).toLocaleTimeString()}
                    </div>
                    <div className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                      {answered}/{session.questionCount} answered •{" "}
                      {formatTime(remaining)} remaining
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleResumeSession(session.id)}
                      className="rounded-lg bg-amber-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-700"
                    >
                      Resume
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Your Stats */}
      {history.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Your Stats
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-zinc-50 p-4 text-center dark:bg-zinc-800">
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {history.length}
              </div>
              <div className="mt-1 text-sm text-zinc-500">Attempts</div>
            </div>
            <div className="rounded-lg bg-zinc-50 p-4 text-center dark:bg-zinc-800">
              <div
                className={`text-2xl font-bold ${
                  avgScore !== null && avgScore >= examConfig.passingScore
                    ? "text-emerald-600"
                    : "text-amber-600"
                }`}
              >
                {avgScore !== null ? `${avgScore}%` : "—"}
              </div>
              <div className="mt-1 text-sm text-zinc-500">Avg Score</div>
            </div>
            <div className="rounded-lg bg-zinc-50 p-4 text-center dark:bg-zinc-800">
              <div
                className={`text-2xl font-bold ${
                  passRate !== null && passRate >= 50
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {passRate !== null ? `${passRate}%` : "—"}
              </div>
              <div className="mt-1 text-sm text-zinc-500">Pass Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Recent Attempts
          </h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="w-full">
              <thead className="bg-zinc-50 text-sm text-zinc-500 dark:bg-zinc-800">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-center">Score</th>
                  <th className="px-4 py-2 text-center">Result</th>
                  <th className="px-4 py-2 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {history.map((entry) => (
                  <tr key={entry.sessionId}>
                    <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">
                      {new Date(entry.completedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`font-medium ${
                          entry.passed ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {entry.score}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {entry.passed ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          PASSED
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300">
                          FAILED
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-500">
                      {formatDuration(entry.timeUsedMs)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Related Links */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link
          href={`/${examConfig.certSlug}/practice-questions`}
          className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Practice Questions
        </Link>
        <Link
          href={`/${examConfig.certSlug}`}
          className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {examConfig.certName} Overview
        </Link>
      </div>
    </div>
  );
}
