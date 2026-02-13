"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifySession } from "@/lib/access";
import { useAccess } from "@/components/AccessProvider";

type PlanType = "30day" | "lifetime";

interface SessionResult {
  success: boolean;
  email?: string;
  plan?: PlanType;
  expiresAt?: number;
  certification?: string;
  error?: string;
}

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "missing">("loading");
  const [result, setResult] = useState<SessionResult | null>(null);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);
  const { refresh } = useAccess();

  useEffect(() => {
    // Get the return URL from localStorage
    const storedReturnUrl = localStorage.getItem("snready_checkout_return");
    if (storedReturnUrl) {
      setReturnUrl(storedReturnUrl);
      localStorage.removeItem("snready_checkout_return");
    }
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setStatus("missing");
      return;
    }

    verifySession(sessionId).then(async (data) => {
      if (data.success && data.email && data.expiresAt) {
        // Session cookie is set by the API response — refresh the auth provider
        await refresh();
        setResult(data as SessionResult);
        setStatus("success");
      } else {
        setResult(data as SessionResult);
        setStatus("error");
      }
    });
  }, [sessionId, refresh]);

  // Missing session ID - user navigated here directly
  if (status === "missing") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
            <svg
              className="h-8 w-8 text-amber-600 dark:text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            No Payment Session Found
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            It looks like you navigated here directly without completing a purchase.
          </p>
          <p className="mt-2 text-zinc-500">
            If you recently completed a purchase, check your email for confirmation.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/certifications"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              View Certifications
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <svg
              className="h-8 w-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Verification Failed
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            {result?.error || "We couldn't verify your payment."}
          </p>
          <p className="mt-2 text-zinc-500">
            If you completed payment, please contact support.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isLifetime = result?.plan === "lifetime";
  const planName = isLifetime ? "Lifetime" : "30-Day";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
          <svg
            className="h-8 w-8 text-emerald-600 dark:text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Payment Successful!
        </h1>

        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Thank you for your purchase. Your {planName} access is now active.
        </p>

        {result?.email && (
          <p className="mt-2 text-zinc-500 dark:text-zinc-500">
            Access granted to <span className="font-medium">{result.email}</span>
          </p>
        )}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href={returnUrl || "/certifications"}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            {returnUrl ? "Continue Practicing" : "Start Practicing"}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-12 rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-left dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
            What&apos;s included:
          </h2>
          <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li className="flex items-start gap-2">
              <svg className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Full access to all practice questions
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Detailed explanations with source references
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              All practice questions unlocked
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {isLifetime ? (
                <span><strong>Lifetime access</strong> — never expires</span>
              ) : (
                <span>30-day access from today</span>
              )}
            </li>
            {isLifetime && (
              <>
                <li className="flex items-start gap-2">
                  <svg className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span><strong>All certifications</strong> — CSA, CIS-DF, CAD, CIS-ITSM &amp; more</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Future updates included</strong></span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
