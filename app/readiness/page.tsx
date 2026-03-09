"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import certificationsData from "@/data/certifications.json";
import type { Question, ExamDomain } from "@/types";

interface Certification {
  slug: string;
  name: string;
  fullName: string;
  domains: ExamDomain[];
  isReady?: boolean;
  examDetails?: {
    questionCount: number;
    duration: number;
    passingScore: number;
  };
}

interface DomainResult {
  domain: ExamDomain;
  correct: number;
  total: number;
  percentage: number;
}

type CheckerState = "select" | "quiz" | "results";

const readyCerts = (certificationsData.certifications as Certification[])
  .filter((c) => c.isReady && c.domains && c.domains.length > 0)
  .sort((a, b) => a.name.localeCompare(b.name));

export default function ReadinessCheckerPage() {
  const [state, setState] = useState<CheckerState>("select");
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Load questions when certification is selected
  const loadQuestions = async (cert: Certification) => {
    setLoading(true);
    try {
      // Load questions from each domain's topic file
      const allQuestions: Question[] = [];
      
      for (const domain of cert.domains) {
        try {
          const response = await import(
            `@/data/questions/${cert.slug}/${domain.slug}.json`
          );
          const domainQuestions = response.questions || [];
          // Get free questions (marked as isFree)
          const freeQuestions = domainQuestions.filter((q: Question) => q.isFree);
          // Take 1-2 questions per domain
          const selectedCount = domain.percentage >= 15 ? 2 : 1;
          allQuestions.push(...freeQuestions.slice(0, selectedCount));
        } catch {
          // Domain file might not exist, continue
        }
      }

      // Shuffle questions
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);
      // Take max 12 questions
      setQuestions(shuffled.slice(0, 12));
    } catch (error) {
      console.error("Failed to load questions:", error);
      setQuestions([]);
    }
    setLoading(false);
  };

  const startQuiz = async (cert: Certification) => {
    setSelectedCert(cert);
    setAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    await loadQuestions(cert);
    setState("quiz");
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswerSelect = (optionId: string) => {
    if (!currentQuestion || showExplanation) return;

    const questionId = currentQuestion.id;
    const isMultiSelect = currentQuestion.type === "multiple_select";
    const currentAnswers = answers[questionId] || [];

    if (isMultiSelect) {
      if (currentAnswers.includes(optionId)) {
        setAnswers({
          ...answers,
          [questionId]: currentAnswers.filter((a) => a !== optionId),
        });
      } else {
        setAnswers({
          ...answers,
          [questionId]: [...currentAnswers, optionId],
        });
      }
    } else {
      setAnswers({
        ...answers,
        [questionId]: [optionId],
      });
    }
  };

  const handleSubmitAnswer = () => {
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setState("results");
    }
  };

  const isAnswerCorrect = (question: Question, userAnswers: string[]): boolean => {
    if (!userAnswers || userAnswers.length === 0) return false;
    const correct = question.correctAnswers;
    return (
      userAnswers.length === correct.length &&
      userAnswers.every((a) => correct.includes(a))
    );
  };

  // Calculate results by domain
  const domainResults = useMemo((): DomainResult[] => {
    if (!selectedCert || questions.length === 0) return [];

    const domainMap = new Map<string, { correct: number; total: number }>();

    for (const question of questions) {
      const domainSlug = question.labels?.domainSlug || question.topic;
      const userAnswers = answers[question.id] || [];
      const isCorrect = isAnswerCorrect(question, userAnswers);

      const current = domainMap.get(domainSlug) || { correct: 0, total: 0 };
      domainMap.set(domainSlug, {
        correct: current.correct + (isCorrect ? 1 : 0),
        total: current.total + 1,
      });
    }

    return selectedCert.domains
      .map((domain) => {
        const stats = domainMap.get(domain.slug) || { correct: 0, total: 0 };
        return {
          domain,
          correct: stats.correct,
          total: stats.total,
          percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        };
      })
      .filter((r) => r.total > 0)
      .sort((a, b) => a.percentage - b.percentage);
  }, [selectedCert, questions, answers]);

  const overallScore = useMemo(() => {
    const totalCorrect = domainResults.reduce((sum, r) => sum + r.correct, 0);
    const totalQuestions = domainResults.reduce((sum, r) => sum + r.total, 0);
    return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  }, [domainResults]);

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return "bg-emerald-100";
    if (score >= 70) return "bg-yellow-100";
    if (score >= 50) return "bg-orange-100";
    return "bg-red-100";
  };

  const getReadinessLevel = (score: number): { level: string; message: string; emoji: string } => {
    if (score >= 85) {
      return {
        level: "Exam Ready",
        message: "You're showing strong knowledge! Consider scheduling your exam soon.",
        emoji: "🎯",
      };
    }
    if (score >= 70) {
      return {
        level: "Almost Ready",
        message: "Good foundation! Focus on your weaker domains to push into passing territory.",
        emoji: "📈",
      };
    }
    if (score >= 50) {
      return {
        level: "Needs More Practice",
        message: "You're building knowledge but need more study time, especially in the red areas.",
        emoji: "📚",
      };
    }
    return {
      level: "Not Ready Yet",
      message: "Don't worry — this is a starting point! Focus on the fundamentals first.",
      emoji: "🌱",
    };
  };

  const restart = () => {
    setState("select");
    setSelectedCert(null);
    setQuestions([]);
    setAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
  };

  const retryWithSameCert = async () => {
    if (selectedCert) {
      await startQuiz(selectedCert);
    }
  };

  // Selection screen
  if (state === "select") {
    return (
      <div className="min-h-[calc(100vh-65px)] subtle-gradient py-10">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
              Exam Readiness Checker
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Quick assessment to gauge your exam readiness. Answer 10-12 questions and get a
              personalized score breakdown by domain.
            </p>
          </div>

          {/* How it works */}
          <div className="card p-6 mb-8">
            <h2 className="font-semibold text-[var(--text-primary)] mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm shrink-0">1</div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">Choose Certification</p>
                  <p className="text-sm text-[var(--text-secondary)]">Select which exam you&apos;re preparing for</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm shrink-0">2</div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">Answer Questions</p>
                  <p className="text-sm text-[var(--text-secondary)]">10-12 questions covering all exam domains</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm shrink-0">3</div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">Get Your Score</p>
                  <p className="text-sm text-[var(--text-secondary)]">See domain breakdown and study recommendations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Certification selection */}
          <div className="card p-6">
            <h2 className="font-semibold text-[var(--text-primary)] mb-4">Select Your Certification</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {readyCerts.map((cert) => (
                <button
                  key={cert.slug}
                  onClick={() => startQuiz(cert)}
                  className="p-4 rounded-xl border-2 border-[var(--border)] hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left group"
                >
                  <div className="font-semibold text-[var(--text-primary)] group-hover:text-blue-600 transition-colors">
                    {cert.name}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)] line-clamp-1">
                    {cert.fullName}
                  </div>
                  <div className="text-xs text-[var(--text-tertiary)] mt-1">
                    {cert.domains.length} domains • {cert.examDetails?.passingScore || 70}% to pass
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <p className="text-center text-sm text-[var(--text-tertiary)] mt-6">
            Free assessment — no account required. Results help you focus your study time.
          </p>
        </div>
      </div>
    );
  }

  // Quiz screen
  if (state === "quiz") {
    if (loading) {
      return (
        <div className="min-h-[calc(100vh-65px)] subtle-gradient py-10">
          <div className="max-w-2xl mx-auto px-6">
            <div className="card p-8 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-[var(--text-secondary)]">Loading questions...</p>
            </div>
          </div>
        </div>
      );
    }

    if (!currentQuestion) {
      return (
        <div className="min-h-[calc(100vh-65px)] subtle-gradient py-10">
          <div className="max-w-2xl mx-auto px-6">
            <div className="card p-8 text-center">
              <p className="text-[var(--text-secondary)] mb-4">No questions available for this certification yet.</p>
              <button onClick={restart} className="btn-primary">
                Try Another Certification
              </button>
            </div>
          </div>
        </div>
      );
    }

    const userAnswers = answers[currentQuestion.id] || [];
    const isCorrect = showExplanation && isAnswerCorrect(currentQuestion, userAnswers);

    return (
      <div className="min-h-[calc(100vh-65px)] subtle-gradient py-10">
        <div className="max-w-2xl mx-auto px-6">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                {selectedCert?.name} Readiness Check
              </span>
              <span className="text-sm text-[var(--text-tertiary)]">
                {currentIndex + 1} of {questions.length}
              </span>
            </div>
            <div className="h-2 bg-[var(--surface-raised)] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question card */}
          <div className="card p-6">
            {/* Domain badge */}
            <div className="mb-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {currentQuestion.labels?.domain || "General"}
              </span>
              {currentQuestion.type === "multiple_select" && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 ml-2">
                  Select all that apply
                </span>
              )}
            </div>

            {/* Question text */}
            <h2 className="text-lg font-medium text-[var(--text-primary)] mb-6">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = userAnswers.includes(option.id);
                const isCorrectAnswer = currentQuestion.correctAnswers.includes(option.id);

                let optionClass = "border-[var(--border)] hover:border-blue-400 hover:bg-blue-50/30";
                if (showExplanation) {
                  if (isCorrectAnswer) {
                    optionClass = "border-emerald-500 bg-emerald-50";
                  } else if (isSelected && !isCorrectAnswer) {
                    optionClass = "border-red-500 bg-red-50";
                  }
                } else if (isSelected) {
                  optionClass = "border-blue-500 bg-blue-50";
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={showExplanation}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${optionClass} ${showExplanation ? "cursor-default" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[var(--surface-raised)] flex items-center justify-center text-sm font-medium text-[var(--text-secondary)] shrink-0 uppercase">
                        {option.id}
                      </span>
                      <span className="text-[var(--text-primary)]">{option.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className={`mt-6 p-4 rounded-xl ${isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? (
                    <>
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-semibold text-emerald-700">Correct!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="font-semibold text-red-700">Incorrect</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  {currentQuestion.explanation?.correct || "Review this domain for more details."}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={restart}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] text-sm"
              >
                Cancel
              </button>

              {!showExplanation ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={userAnswers.length === 0}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Check Answer
                </button>
              ) : (
                <button onClick={handleNext} className="btn-primary">
                  {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (state === "results") {
    const readiness = getReadinessLevel(overallScore);
    const weakDomains = domainResults.filter((r) => r.percentage < 70);
    const strongDomains = domainResults.filter((r) => r.percentage >= 70);

    return (
      <div className="min-h-[calc(100vh-65px)] subtle-gradient py-10">
        <div className="max-w-3xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">{readiness.emoji}</span>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              {readiness.level}
            </h1>
            <p className="text-[var(--text-secondary)]">{readiness.message}</p>
          </div>

          {/* Overall Score */}
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--text-primary)]">
                Your {selectedCert?.name} Readiness Score
              </h2>
              <span className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}%
              </span>
            </div>
            <div className="h-4 bg-[var(--surface-raised)] rounded-full overflow-hidden">
              <div
                className={`h-full ${overallScore >= 70 ? "bg-emerald-500" : overallScore >= 50 ? "bg-yellow-500" : "bg-red-500"} transition-all`}
                style={{ width: `${overallScore}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-[var(--text-tertiary)]">
              <span>0%</span>
              <span className="text-[var(--text-secondary)]">Passing: {selectedCert?.examDetails?.passingScore || 70}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Domain Breakdown */}
          <div className="card p-6 mb-6">
            <h2 className="font-semibold text-[var(--text-primary)] mb-4">Domain Breakdown</h2>
            <div className="space-y-4">
              {domainResults.map((result) => (
                <div key={result.domain.slug}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[var(--text-primary)]">{result.domain.name}</span>
                    <span className={`text-sm font-medium ${getScoreColor(result.percentage)}`}>
                      {result.correct}/{result.total} ({result.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--surface-raised)] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${result.percentage >= 70 ? "bg-emerald-500" : result.percentage >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${result.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {weakDomains.length > 0 && (
            <div className="card p-6 mb-6 border-l-4 border-l-orange-400">
              <h2 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Focus Areas
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                These domains need more study time before your exam:
              </p>
              <div className="space-y-2">
                {weakDomains.map((result) => (
                  <Link
                    key={result.domain.slug}
                    href={`/practice-questions/${selectedCert?.slug}/${result.domain.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
                  >
                    <div>
                      <span className="text-[var(--text-primary)] font-medium">{result.domain.name}</span>
                      <span className={`ml-2 text-sm ${getScoreColor(result.percentage)}`}>({result.percentage}%)</span>
                    </div>
                    <span className="text-orange-600 text-sm font-medium flex items-center gap-1">
                      Practice
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Strong areas */}
          {strongDomains.length > 0 && (
            <div className="card p-6 mb-6 border-l-4 border-l-emerald-400">
              <h2 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Strong Areas
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Keep up the good work in: {strongDomains.map((r) => r.domain.name).join(", ")}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={retryWithSameCert} className="btn-secondary">
              Try Again
            </button>
            <Link
              href={`/practice-questions/${selectedCert?.slug}`}
              className="btn-primary text-center"
            >
              Full Practice Test
            </Link>
            <button onClick={restart} className="btn-secondary">
              Different Certification
            </button>
          </div>

          {/* Share */}
          <div className="text-center mt-8">
            <p className="text-sm text-[var(--text-tertiary)] mb-3">Share your result</p>
            <button
              onClick={() => {
                const text = `I scored ${overallScore}% on the ${selectedCert?.name} Readiness Check at SNReady.com! 📚\n\nCheck your exam readiness: https://snready.com/readiness`;
                if (navigator.share) {
                  navigator.share({ text });
                } else {
                  navigator.clipboard.writeText(text);
                  alert("Copied to clipboard!");
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Result
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
