"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAccess } from "@/components/AccessProvider";

type Status = "loading" | "success" | "error" | "expired" | "no-access";

type VerifyResponse = {
  success?: boolean;
  email?: string;
  hasAccess?: boolean;
  error?: string;
};

export default function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const redirect = searchParams.get("redirect");
  const safeRedirect = redirect?.startsWith("/") && !redirect.startsWith("//") ? redirect : null;
  const [status, setStatus] = useState<Status>(token ? "loading" : "error");
  const [error, setError] = useState<string>(token ? "" : "No login token provided");
  const [email, setEmail] = useState<string>("");
  const { refresh } = useAccess();

  useEffect(() => {
    if (!token) return;

    // The verify endpoint sets an httpOnly session cookie on the response
    fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`, {
      credentials: "include",
    })
      .then((res) => res.json() as Promise<VerifyResponse>)
      .then(async (data) => {
        if (data.success && data.email) {
          // Refresh the auth provider — it will read the session cookie
          await refresh();
          setEmail(data.email);
          setStatus(data.hasAccess ? "success" : "no-access");

          // Redirect after 2 seconds
          setTimeout(() => {
            router.push(safeRedirect ?? (data.hasAccess ? "/certifications" : "/account"));
          }, 2000);
        } else if (data.error?.includes("expired")) {
          setStatus("expired");
          setError(data.error);
        } else {
          setStatus("error");
          setError(data.error || "Verification failed");
        }
      })
      .catch(() => {
        setStatus("error");
        setError("Failed to verify login link");
      });
  }, [token, safeRedirect, refresh, router]);

  if (status === "loading") {
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

  if (status === "success") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
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
          <h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            You&apos;re logged in!
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Welcome back, <span className="font-medium">{email}</span>
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            Redirecting you to practice questions...
          </p>
          <Link
            href="/certifications"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Start Practicing Now
          </Link>
        </div>
      </div>
    );
  }

  if (status === "no-access") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
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
          <h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            You&apos;re logged in!
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Welcome, <span className="font-medium">{email}</span>
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            You don&apos;t have an active subscription yet. Get access to unlock all practice questions.
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Redirecting you to your account...
          </p>
          <Link
            href="/account"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Go to Account
          </Link>
        </div>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Link Expired
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            This login link has expired. Please request a new one.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
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
        <h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Verification Failed
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {error || "Something went wrong. Please try again."}
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
