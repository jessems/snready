import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Cancelled | SNReady",
  description: "Your payment was cancelled. No charges were made.",
};

export default function CheckoutCancel() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <svg
            className="h-8 w-8 text-zinc-500"
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
          Payment Cancelled
        </h1>

        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          No worries! Your payment was cancelled and no charges were made.
        </p>

        <p className="mt-2 text-zinc-500 dark:text-zinc-500">
          You can try again whenever you&apos;re ready.
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

        <div className="mt-12 rounded-lg border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-950">
          <h2 className="font-semibold text-emerald-900 dark:text-emerald-100">
            Still have questions?
          </h2>
          <p className="mt-2 text-emerald-700 dark:text-emerald-300">
            Try our free practice questions first — no payment required.
          </p>
          <Link
            href="/free-questions"
            className="mt-4 inline-flex items-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Browse free questions →
          </Link>
        </div>
      </div>
    </div>
  );
}
