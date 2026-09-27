"use client";

import { useEffect, useState } from "react";
import QuestionCard from "@/components/QuestionCard";
import { CheckoutButton } from "@/components/CheckoutButton";
import { LoginModal } from "@/components/LoginModal";
import { useAccess } from "@/components/AccessProvider";
import { trackPracticeStartOnce } from "@/lib/analytics";
import { fetchPremiumQuestions, type PremiumQuestionsResult } from "@/lib/premium-questions";
import type { Question } from "@/types";

interface QuestionsWithPaywallProps {
  freeQuestions: Question[];
  // Only the count is rendered statically; premium question content is fetched
  // from /api/questions after the access check so it never ships in the export.
  premiumQuestionCount: number;
  certification: string;
  certificationSlug: string;
  topic?: string;
  examCost?: number;
  freeQuestionCount?: number;
  featureHighlights?: string[];
}

export function QuestionsWithPaywall({
  freeQuestions,
  premiumQuestionCount,
  certification,
  certificationSlug,
  topic,
  examCost,
  freeQuestionCount,
  featureHighlights = [],
}: QuestionsWithPaywallProps) {
  const { authenticated, hasAccessTo, loading } = useAccess();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [premiumResult, setPremiumResult] = useState<{ key: string; result: PremiumQuestionsResult } | null>(null);

  const userHasAccess = !loading && hasAccessTo(certification);
  const requestKey = userHasAccess && premiumQuestionCount > 0
    ? `${certificationSlug}|${topic || ""}|${attempt}`
    : null;

  useEffect(() => {
    if (!requestKey) return;
    const controller = new AbortController();
    fetchPremiumQuestions({ certification: certificationSlug, topic, signal: controller.signal })
      .then((result) => setPremiumResult({ key: requestKey, result }))
      .catch(() => {
        // Aborted because the component unmounted or the request key changed.
      });
    return () => controller.abort();
  }, [requestKey, certificationSlug, topic]);

  const currentPremium = premiumResult && premiumResult.key === requestKey ? premiumResult.result : null;
  const totalQuestionCount = freeQuestions.length + premiumQuestionCount;

  const handlePurchase = () => {
    setShowLoginModal(false);
    // The checkout buttons handle navigation
  };

  const handleFreeAnswer = () => {
    trackPracticeStartOnce({
      certification,
      freeQuestionCount: freeQuestionCount ?? freeQuestions.length,
      totalQuestionCount,
    });
  };

  // While loading, show free questions + loading state for premium
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Free Questions */}
        {freeQuestions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            questionNumber={index + 1}
            onAnswer={handleFreeAnswer}
          />
        ))}

        {premiumQuestionCount > 0 && <PremiumLoadingPlaceholder />}
      </div>
    );
  }

  // If user has access to this certification, show free questions and load premium ones
  if (userHasAccess) {
    return (
      <div className="space-y-6">
        {freeQuestions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            questionNumber={index + 1}
          />
        ))}

        {premiumQuestionCount > 0 && !currentPremium && (
          <PremiumLoadingPlaceholder label={`Loading ${premiumQuestionCount} premium questions…`} />
        )}

        {currentPremium && !currentPremium.ok && (
          <div
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-800 dark:bg-amber-950"
          >
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">
              We couldn&apos;t load your premium questions
            </h3>
            <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">
              {currentPremium.code === "not_authenticated"
                ? "Your session has expired. Log in again to continue."
                : currentPremium.code === "no_access"
                  ? `We couldn't confirm your ${certification} purchase. Try logging in again, or contact support if this keeps happening.`
                  : "Please check your connection and try again."}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setAttempt((value) => value + 1)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Try again
              </button>
              {(currentPremium.code === "not_authenticated" || currentPremium.code === "no_access") && (
                <button
                  type="button"
                  onClick={() => setShowLoginModal(true)}
                  className="rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                >
                  Log in
                </button>
              )}
            </div>
          </div>
        )}

        {currentPremium && currentPremium.ok && currentPremium.questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            questionNumber={freeQuestions.length + index + 1}
          />
        ))}

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onPurchase={handlePurchase}
        />
      </div>
    );
  }

  // No access - show free questions + paywall
  return (
    <div className="space-y-6">
      {/* Free Questions Section */}
      {freeQuestions.length > 0 && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-emerald-600">Free Questions</span>
            <span className="text-xs text-zinc-400">({freeQuestions.length} of {totalQuestionCount})</span>
          </div>
          {freeQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              questionNumber={index + 1}
              onAnswer={handleFreeAnswer}
            />
          ))}
        </>
      )}

      {/* Paywall */}
      {premiumQuestionCount > 0 && (
        <div className="relative">
          {/* Blurred placeholder cards. Deliberately contains no premium question text. */}
          <div className="space-y-6 blur-sm select-none pointer-events-none" aria-hidden="true">
            {[0, 1].map((index) => (
              <div
                key={index}
                className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-400">
                    {freeQuestions.length + index + 1}
                  </span>
                  <span className="h-4 w-20 rounded bg-zinc-100 dark:bg-zinc-800" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
                  <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700" />
                </div>
                <div className="mt-4 space-y-2">
                  {["a", "b", "c"].map((optionId) => (
                    <div key={optionId} className="flex items-start gap-3 rounded-lg border border-zinc-100 p-3 dark:border-zinc-800">
                      <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 text-xs text-zinc-300">
                        {optionId.toUpperCase()}
                      </span>
                      <span className="mt-1 h-3 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Paywall overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/80 via-white/95 to-white dark:from-zinc-950/80 dark:via-zinc-950/95 dark:to-zinc-950">
            <div className="mx-4 max-w-lg rounded-2xl border border-emerald-200 bg-white p-6 sm:p-8 shadow-xl text-center dark:border-emerald-800 dark:bg-zinc-900">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                <svg className="h-7 w-7 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              
              <h3 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Unlock {premiumQuestionCount} More Questions
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Get full access to all {certification} practice questions, timed mock exams, and detailed explanations.
              </p>

              {featureHighlights.length > 0 && (
                <ul className="mt-5 space-y-2 rounded-xl bg-zinc-50 p-4 text-left text-sm text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                  {featureHighlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {examCost
                  ? `$9 once vs. a $${examCost} exam attempt — practice first.`
                  : "Because we want you to succeed ✨"}
              </p>

              {freeQuestionCount ? (
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  You already have {freeQuestionCount} free questions on this page.
                </p>
              ) : null}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <CheckoutButton
                  certification={certification}
                  plan="single"
                  className="w-full rounded-lg border-2 border-emerald-600 bg-white py-3 font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                  {certification} Lifetime — $9
                </CheckoutButton>
                <CheckoutButton
                  certification={certification}
                  plan="all"
                  className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  Lifetime All Certs — $49 ⭐
                </CheckoutButton>
              </div>

              {!authenticated && (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="mt-4 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  Already purchased? <span className="text-emerald-600 font-medium">Log in</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onPurchase={handlePurchase}
      />
    </div>
  );
}

function PremiumLoadingPlaceholder({ label }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-pulse rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900"
    >
      <div className="h-6 w-48 bg-zinc-200 rounded mx-auto dark:bg-zinc-700" />
      {label && <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{label}</p>}
    </div>
  );
}
