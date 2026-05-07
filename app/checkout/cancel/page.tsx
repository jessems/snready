import { Suspense } from "react";
import { Metadata } from "next";
import CancelContent from "./CancelContent";

export const metadata: Metadata = {
  title: "Checkout Paused | SNReady",
  description: "Your payment was cancelled. No charges were made — resume checkout or keep browsing SNReady practice questions.",
};

function LoadingState() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Loading checkout details...
        </p>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CancelContent />
    </Suspense>
  );
}
