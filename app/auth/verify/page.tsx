import { Suspense } from "react";
import { Metadata } from "next";
import VerifyContent from "./VerifyContent";

export const metadata: Metadata = {
  title: "Verifying Login | SNReady",
  description: "Verifying your magic link login.",
};

function LoadingState() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Verifying your login...
        </p>
      </div>
    </div>
  );
}

export default function AuthVerifyPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VerifyContent />
    </Suspense>
  );
}
