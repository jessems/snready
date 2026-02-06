"use client";

import { useState } from "react";
import QuestionCard from "@/components/QuestionCard";
import { CheckoutButton } from "@/components/CheckoutButton";
import { LoginModal } from "@/components/LoginModal";
import { useAccess } from "@/components/AccessProvider";
import type { Question } from "@/types";

interface QuestionsWithPaywallProps {
  freeQuestions: Question[];
  premiumQuestions: Question[];
  certification: string;
  certSlug: string;
}

export function QuestionsWithPaywall({
  freeQuestions,
  premiumQuestions,
  certification,
  certSlug,
}: QuestionsWithPaywallProps) {
  const { hasAccess, loading } = useAccess();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handlePurchase = () => {
    setShowLoginModal(false);
    // The checkout buttons handle navigation
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
          />
        ))}

        {premiumQuestions.length > 0 && (
          <div className="animate-pulse rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <div className="h-6 w-48 bg-zinc-200 rounded mx-auto dark:bg-zinc-700" />
          </div>
        )}
      </div>
    );
  }

  // If user has access, show all questions
  if (hasAccess) {
    return (
      <div className="space-y-6">
        {freeQuestions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            questionNumber={index + 1}
          />
        ))}
        {premiumQuestions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            questionNumber={freeQuestions.length + index + 1}
          />
        ))}
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
            <span className="text-xs text-zinc-400">({freeQuestions.length} of {freeQuestions.length + premiumQuestions.length})</span>
          </div>
          {freeQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              questionNumber={index + 1}
            />
          ))}
        </>
      )}

      {/* Paywall */}
      {premiumQuestions.length > 0 && (
        <div className="relative">
          {/* Blurred preview of premium questions */}
          <div className="space-y-6 blur-sm select-none pointer-events-none">
            {premiumQuestions.slice(0, 2).map((question, index) => (
              <div
                key={question.id}
                className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-400">
                    {freeQuestions.length + index + 1}
                  </span>
                  <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-400">
                    {question.cognitiveLevel}
                  </span>
                </div>
                <p className="mt-4 text-base font-medium text-zinc-400">
                  {question.question.slice(0, 80)}...
                </p>
                <div className="mt-4 space-y-2">
                  {question.options.slice(0, 3).map((opt) => (
                    <div key={opt.id} className="flex items-start gap-3 rounded-lg border border-zinc-100 p-3">
                      <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 text-xs text-zinc-300">
                        {opt.id.toUpperCase()}
                      </span>
                      <span className="text-sm text-zinc-300">{opt.text.slice(0, 50)}...</span>
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
                Unlock {premiumQuestions.length} More Questions
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Get full access to all {certification} practice questions with detailed explanations.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <CheckoutButton
                  certification={certification}
                  plan="30day"
                  className="w-full rounded-lg border-2 border-emerald-600 bg-white py-3 font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                  30 Days — $9
                </CheckoutButton>
                <CheckoutButton
                  certification={certification}
                  plan="lifetime"
                  className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  Lifetime All Certs — $49 ⭐
                </CheckoutButton>
              </div>

              <button
                onClick={() => setShowLoginModal(true)}
                className="mt-4 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                Already purchased? <span className="text-emerald-600 font-medium">Log in</span>
              </button>
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
