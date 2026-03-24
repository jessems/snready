"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import type { Question, ExamDomain } from "@/types";

interface DomainQuestions {
  domain: ExamDomain;
  questions: Question[];
}

interface ReadinessCheckProps {
  certSlug: string;
  certName: string;
  certFullName: string;
  domains: ExamDomain[];
  allQuestions: Question[];
}

interface DomainResult {
  domain: string;
  domainSlug: string;
  correct: number;
  total: number;
  percentage: number;
}

type Phase = "intro" | "quiz" | "results";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function selectQuestions(
  domains: ExamDomain[],
  allQuestions: Question[],
  totalCount: number = 10
): { question: Question; domainSlug: string }[] {
  // Group questions by domain — question.topic matches domain.slug
  const questionsByDomain = new Map<string, Question[]>();
  const domainSlugs = new Set(domains.map((d) => d.slug));

  for (const domain of domains) {
    questionsByDomain.set(domain.slug, []);
  }

  for (const q of allQuestions) {
    if (domainSlugs.has(q.topic)) {
      questionsByDomain.get(q.topic)!.push(q);
    }
  }

  // Allocate questions proportionally by domain percentage
  const allocation = new Map<string, number>();
  let allocated = 0;
  const sortedDomains = [...domains].sort((a, b) => b.percentage - a.percentage);

  for (let i = 0; i < sortedDomains.length; i++) {
    const domain = sortedDomains[i];
    if (i === sortedDomains.length - 1) {
      allocation.set(domain.slug, totalCount - allocated);
    } else {
      const count = Math.max(1, Math.round((domain.percentage / 100) * totalCount));
      allocation.set(domain.slug, count);
      allocated += count;
    }
  }

  // Adjust if over-allocated
  let total = Array.from(allocation.values()).reduce((a, b) => a + b, 0);
  while (total > totalCount) {
    for (const domain of sortedDomains) {
      const current = allocation.get(domain.slug) || 0;
      if (current > 1) {
        allocation.set(domain.slug, current - 1);
        total--;
        if (total <= totalCount) break;
      }
    }
  }

  // Select random questions from each domain
  const selected: { question: Question; domainSlug: string }[] = [];
  for (const domain of domains) {
    const count = allocation.get(domain.slug) || 0;
    const available = shuffleArray(questionsByDomain.get(domain.slug) || []);
    for (let i = 0; i < Math.min(count, available.length); i++) {
      selected.push({ question: available[i], domainSlug: domain.slug });
    }
  }

  return shuffleArray(selected);
}

function getReadinessLevel(score: number): {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  message: string;
} {
  if (score >= 80) {
    return {
      label: "Ready",
      emoji: "🟢",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      message: "You're looking strong! You have a solid grasp across the exam domains. Consider taking a full mock exam to confirm.",
    };
  }
  if (score >= 60) {
    return {
      label: "Almost There",
      emoji: "🟡",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      message: "You're close but have some gaps to fill. Focus on your weakest domains below before booking your exam.",
    };
  }
  return {
    label: "Not Yet",
    emoji: "🔴",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    message: "You need more preparation. Don't worry — targeted practice on the weak areas below will get you there.",
  };
}

const STORAGE_KEY_PREFIX = "snready-readiness-";

interface StoredResult {
  date: string;
  score: number;
  domainResults: DomainResult[];
}

function saveResult(certSlug: string, score: number, domainResults: DomainResult[]) {
  try {
    const key = STORAGE_KEY_PREFIX + certSlug;
    const existing: StoredResult[] = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push({
      date: new Date().toISOString(),
      score,
      domainResults,
    });
    // Keep last 10
    if (existing.length > 10) existing.splice(0, existing.length - 10);
    localStorage.setItem(key, JSON.stringify(existing));
  } catch {}
}

function getHistory(certSlug: string): StoredResult[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + certSlug) || "[]");
  } catch {
    return [];
  }
}

export default function ReadinessCheck({
  certSlug,
  certName,
  certFullName,
  domains,
  allQuestions,
}: ReadinessCheckProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [selectedQuestions, setSelectedQuestions] = useState<
    { question: Question; domainSlug: string }[]
  >([]);
  const [domainResults, setDomainResults] = useState<DomainResult[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  const startCheck = useCallback(() => {
    const selected = selectQuestions(domains, allQuestions, 10);
    setSelectedQuestions(selected);
    setAnswers({});
    setCurrentIndex(0);
    setPhase("quiz");
  }, [domains, allQuestions]);

  const currentItem = selectedQuestions[currentIndex];
  const currentQuestion = currentItem?.question;
  const selectedAnswers = currentQuestion ? answers[currentQuestion.id] || [] : [];
  const isMultiSelect = currentQuestion?.type === "multiple_select" || currentQuestion?.type === "compound_true_false" || currentQuestion?.type === "true_false_compound";

  const handleSelect = useCallback(
    (optionId: string) => {
      if (!currentQuestion) return;
      setAnswers((prev) => {
        const current = prev[currentQuestion.id] || [];
        let next: string[];
        if (isMultiSelect) {
          next = current.includes(optionId)
            ? current.filter((a) => a !== optionId)
            : [...current, optionId];
        } else {
          next = [optionId];
        }
        return { ...prev, [currentQuestion.id]: next };
      });
    },
    [currentQuestion, isMultiSelect]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < selectedQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, selectedQuestions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const handleFinish = useCallback(() => {
    // Calculate results
    const domainScores = new Map<
      string,
      { correct: number; total: number; name: string }
    >();

    for (const domain of domains) {
      domainScores.set(domain.slug, { correct: 0, total: 0, name: domain.name });
    }

    for (const item of selectedQuestions) {
      const q = item.question;
      const userAnswer = answers[q.id] || [];
      const entry = domainScores.get(item.domainSlug);
      if (entry) {
        entry.total++;
        const isCorrect =
          userAnswer.length === q.correctAnswers.length &&
          userAnswer.every((a) => q.correctAnswers.includes(a));
        if (isCorrect) entry.correct++;
      }
    }

    const results: DomainResult[] = [];
    let totalCorrect = 0;
    let totalQuestions = 0;

    for (const [slug, data] of domainScores) {
      if (data.total > 0) {
        results.push({
          domain: data.name,
          domainSlug: slug,
          correct: data.correct,
          total: data.total,
          percentage: Math.round((data.correct / data.total) * 100),
        });
        totalCorrect += data.correct;
        totalQuestions += data.total;
      }
    }

    const score = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    setDomainResults(results.sort((a, b) => a.percentage - b.percentage));
    setOverallScore(score);
    saveResult(certSlug, score, results);
    setPhase("results");
  }, [selectedQuestions, answers, domains, certSlug]);

  const history = useMemo(() => (phase === "results" ? getHistory(certSlug) : []), [phase, certSlug]);
  const readiness = getReadinessLevel(overallScore);

  // INTRO
  if (phase === "intro") {
    return (
      <div className="space-y-6">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent-light)] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Are You Exam Ready?
          </h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
            Take this quick 10-question diagnostic to find out if you&apos;re ready for the{" "}
            <strong>{certFullName}</strong> exam. Questions are sampled across all exam domains.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-[var(--text-secondary)] mb-8">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ~3 minutes
            </span>
            <span className="hidden sm:block">·</span>
            <span>10 questions</span>
            <span className="hidden sm:block">·</span>
            <span>100% free</span>
          </div>
          <button
            onClick={startCheck}
            className="btn-primary px-8 py-3 text-base font-semibold"
          >
            Start Readiness Check
          </button>
        </div>

        {history.length > 0 && (
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              Previous Attempts
            </h3>
            <div className="space-y-2">
              {history.slice(-5).reverse().map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
                >
                  <span className="text-sm text-[var(--text-secondary)]">
                    {new Date(r.date).toLocaleDateString()}
                  </span>
                  <span className={`text-sm font-semibold ${r.score >= 80 ? "text-green-400" : r.score >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                    {r.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // QUIZ
  if (phase === "quiz" && currentQuestion) {
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="space-y-6">
        {/* Progress */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--text-secondary)]">
              Question {currentIndex + 1} of {selectedQuestions.length}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">
              {answeredCount} answered
            </span>
          </div>
          <div className="w-full h-2 bg-[var(--surface-hover)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / selectedQuestions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="card p-6">
          {isMultiSelect && (
            <span className="inline-block text-xs font-medium text-[var(--accent)] bg-[var(--accent-light)] px-2 py-1 rounded mb-3">
              Select all that apply
            </span>
          )}
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-6">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswers.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-[var(--accent)] bg-[var(--accent-light)]"
                      : "border-[var(--border)] hover:border-[var(--border-hover)] bg-[var(--surface)]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-semibold ${
                        isSelected
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--surface-hover)] text-[var(--text-secondary)]"
                      }`}
                    >
                      {option.id.toUpperCase()}
                    </span>
                    <span
                      className={`text-sm pt-0.5 ${
                        isSelected
                          ? "text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {option.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          {currentIndex === selectedQuestions.length - 1 ? (
            <button
              onClick={handleFinish}
              disabled={answeredCount < selectedQuestions.length}
              className="btn-primary px-6 py-2.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              See Results
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-primary px-6 py-2.5 text-sm font-semibold"
            >
              Next →
            </button>
          )}
        </div>

        {/* Question dots */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {selectedQuestions.map((_, i) => {
            const qId = selectedQuestions[i].question.id;
            const isAnswered = !!answers[qId];
            const isCurrent = i === currentIndex;
            return (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  isCurrent
                    ? "bg-[var(--accent)] text-white"
                    : isAnswered
                    ? "bg-[var(--accent-light)] text-[var(--accent)]"
                    : "bg-[var(--surface-hover)] text-[var(--text-secondary)]"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // RESULTS
  if (phase === "results") {
    return (
      <div className="space-y-6">
        {/* Overall Score */}
        <div className={`card p-8 text-center ${readiness.bgColor}`}>
          <div className="text-5xl mb-3">{readiness.emoji}</div>
          <div className="text-4xl font-bold text-[var(--text-primary)] mb-1">
            {overallScore}%
          </div>
          <div className={`text-lg font-semibold ${readiness.color} mb-3`}>
            {readiness.label}
          </div>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto text-sm">
            {readiness.message}
          </p>
        </div>

        {/* Domain Breakdown */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">
            Domain Breakdown
          </h3>
          <div className="space-y-4">
            {domainResults.map((result) => (
              <div key={result.domainSlug}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-[var(--text-primary)] font-medium">
                    {result.domain}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      result.percentage >= 80
                        ? "text-green-400"
                        : result.percentage >= 60
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {result.correct}/{result.total}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[var(--surface-hover)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      result.percentage >= 80
                        ? "bg-green-500"
                        : result.percentage >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${result.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak areas recommendation */}
        {domainResults.some((r) => r.percentage < 80) && (
          <div className="card p-6 border-l-4 border-[var(--accent)]">
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">
              📚 Focus Areas
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Strengthen these domains before your exam:
            </p>
            <ul className="space-y-1.5">
              {domainResults
                .filter((r) => r.percentage < 80)
                .map((r) => (
                  <li key={r.domainSlug} className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                    <span className={r.percentage < 60 ? "text-red-400" : "text-yellow-400"}>
                      {r.percentage < 60 ? "🔴" : "🟡"}
                    </span>
                    {r.domain}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* History trend */}
        {history.length > 1 && (
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              Your Progress
            </h3>
            <div className="flex items-end gap-2 h-20">
              {history.slice(-8).map((r, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-[var(--text-secondary)]">{r.score}%</span>
                  <div
                    className={`w-full rounded-t ${
                      r.score >= 80 ? "bg-green-500" : r.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ height: `${Math.max(r.score * 0.6, 4)}px` }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/${certSlug}/practice-questions`}
            className="btn-primary flex-1 text-center py-3 font-semibold"
          >
            Practice Full Question Bank →
          </Link>
          <button
            onClick={startCheck}
            className="flex-1 py-3 font-semibold text-[var(--text-secondary)] border border-[var(--border)] rounded-xl hover:bg-[var(--surface-hover)] transition-colors"
          >
            Retake Check
          </button>
        </div>

        <div className="text-center">
          <Link
            href={`/${certSlug}/mock-exam`}
            className="text-sm text-[var(--accent)] hover:underline"
          >
            Or try a full timed mock exam →
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
