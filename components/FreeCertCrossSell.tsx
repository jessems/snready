"use client";

import Link from "next/link";
import { CheckoutButton } from "@/components/CheckoutButton";
import { useAccess } from "@/components/AccessProvider";
import { trackFreeCertCrossSellClick } from "@/lib/analytics";

interface FreeCertCrossSellProps {
  /** Display name of the free certification, e.g. "CSA". */
  certification: string;
  /** Number of paid certifications included in all access (e.g. 19). */
  paidCertCount: number;
  /** Where the block is rendered, sent with the click event. */
  placement: string;
  variant?: "card" | "compact";
  className?: string;
}

/**
 * Soft cross-sell shown on free certification pages (lib/free-certs.ts) instead of a
 * paywall. Suggests the natural next certification and the all access plan.
 * Never offers to buy the free certification itself.
 */
export function FreeCertCrossSell({
  certification,
  paidCertCount,
  placement,
  variant = "card",
  className = "",
}: FreeCertCrossSellProps) {
  const { plan } = useAccess();
  const track = (target: string) => trackFreeCertCrossSellClick({ certification, target, placement });

  // All access members already own everything; nothing to suggest.
  if (plan === "all") return null;

  if (variant === "compact") {
    return (
      <div
        data-testid="free-cert-cross-sell"
        className={`rounded-xl bg-emerald-600 p-5 text-white dark:bg-emerald-700 ${className}`}
      >
        <h3 className="font-semibold">{certification} is free</h3>
        <p className="mt-2 text-sm text-emerald-100">
          Every {certification} question and mock exam is open to everyone. No login needed.
        </p>
        <p className="mt-3 text-sm font-medium">Next step: CAD or a CIS exam.</p>
        <div className="mt-4 space-y-2">
          <Link
            href="/cad"
            onClick={() => track("cad")}
            className="block w-full rounded-lg bg-white/20 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-white/30"
          >
            Explore CAD
          </Link>
          <CheckoutButton
            plan="all"
            className="w-full rounded-lg bg-white py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
          >
            All {paidCertCount} paid certs — $49
          </CheckoutButton>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="free-cert-cross-sell"
      className={`rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-800 dark:bg-emerald-950/40 ${className}`}
    >
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
        {certification} is free. Next step: CAD or a CIS exam.
      </h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        That&apos;s every {certification} question. When you&apos;re ready for the next certification,
        each one is $9 for lifetime access, or get all {paidCertCount} paid certifications for $49
        ({certification} stays free).
      </p>
      <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/cad"
          onClick={() => track("cad")}
          className="inline-flex items-center justify-center rounded-lg border-2 border-emerald-600 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 dark:bg-zinc-900 dark:text-emerald-300 dark:hover:bg-zinc-800"
        >
          Try CAD free questions
        </Link>
        <Link
          href="/certifications"
          onClick={() => track("cis")}
          className="inline-flex items-center justify-center rounded-lg border-2 border-emerald-600 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 dark:bg-zinc-900 dark:text-emerald-300 dark:hover:bg-zinc-800"
        >
          Browse CIS exams
        </Link>
        <CheckoutButton
          plan="all"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          All {paidCertCount} paid certs — $49
        </CheckoutButton>
      </div>
    </div>
  );
}
