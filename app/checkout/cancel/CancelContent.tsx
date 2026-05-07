"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckoutButton } from "@/components/CheckoutButton";

type PlanType = "single" | "all";

interface StoredCheckoutIntent {
  certification?: string;
  plan?: PlanType;
  returnUrl?: string;
  startedAt?: number;
}

function normalizePlan(plan: string | null | undefined): PlanType | undefined {
  if (plan === "all") return "all";
  if (plan === "single") return "single";
  return undefined;
}

function cleanCertification(certification: string | null | undefined) {
  if (!certification || certification === "all") return undefined;
  return certification.toLowerCase();
}

function formatCertificationName(certification?: string) {
  if (!certification) return "your ServiceNow exam";
  return certification.toUpperCase();
}

export default function CancelContent() {
  const searchParams = useSearchParams();
  const [storedIntent] = useState<StoredCheckoutIntent | null>(() => {
    if (typeof window === "undefined") return null;

    const rawIntent = localStorage.getItem("snready_checkout_intent");
    if (!rawIntent) return null;

    try {
      return JSON.parse(rawIntent) as StoredCheckoutIntent;
    } catch {
      localStorage.removeItem("snready_checkout_intent");
      return null;
    }
  });

  const checkoutIntent = useMemo(() => {
    const queryPlan = normalizePlan(searchParams.get("plan"));
    const queryCertification = cleanCertification(searchParams.get("certification"));

    return {
      plan: queryPlan || storedIntent?.plan || "single",
      certification: queryCertification || cleanCertification(storedIntent?.certification),
      returnUrl: searchParams.get("return_to") || storedIntent?.returnUrl,
      sessionId: searchParams.get("session_id"),
    };
  }, [searchParams, storedIntent]);

  const isAllPlan = checkoutIntent.plan === "all";
  const certificationName = isAllPlan
    ? "All Certifications"
    : formatCertificationName(checkoutIntent.certification);
  const primaryPrice = isAllPlan ? "$49" : "$9";

  const continueHref = checkoutIntent.returnUrl || (checkoutIntent.certification ? `/${checkoutIntent.certification}` : "/certifications");
  const practiceHref = checkoutIntent.certification
    ? `/${checkoutIntent.certification}/practice-questions`
    : "/practice-questions";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
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
              d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 0 0-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
            />
          </svg>
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
          No charge was made
        </p>
        <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Still preparing for {certificationName}?
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          You left checkout before finishing. Your practice access is still one click away — lifetime access, no subscription, and no renewal surprises.
        </p>

        {checkoutIntent.sessionId && (
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
            Checkout session saved for diagnostics: {checkoutIntent.sessionId.slice(0, 18)}…
          </p>
        )}

        <div className="mt-8 grid gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-left dark:border-emerald-900 dark:bg-emerald-950/40 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Resume your {primaryPrice} checkout
            </h2>
            <p className="mt-2 text-zinc-700 dark:text-zinc-300">
              Get realistic ServiceNow practice questions, explanations, and mock exam prep for {certificationName}.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              <li>✓ Original questions based on official ServiceNow training concepts</li>
              <li>✓ Detailed explanations so you learn the material, not just answers</li>
              <li>✓ Lifetime access with future updates included</li>
            </ul>
          </div>
          <CheckoutButton
            certification={checkoutIntent.certification}
            plan={checkoutIntent.plan}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Resume Checkout — {primaryPrice}
          </CheckoutButton>
        </div>

        {!isAllPlan && (
          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-6 text-left dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                  Better value
                </p>
                <h2 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Studying for more than one cert?
                </h2>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  Upgrade to All Certifications for $49 and unlock every current and future SNReady question bank.
                </p>
              </div>
              <CheckoutButton
                plan="all"
                className="inline-flex items-center justify-center rounded-lg border border-emerald-600 px-6 py-3 text-center font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950"
              >
                Get All Certs — $49
              </CheckoutButton>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href={continueHref}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Review exam details
          </Link>
          <Link
            href={practiceHref}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Browse free questions
          </Link>
        </div>
      </div>
    </div>
  );
}
