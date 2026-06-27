"use client";

import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

type MagicLinkResponse = { success?: boolean; error?: string };

export function LoginModal({ isOpen, onClose, onPurchase }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json() as MagicLinkResponse;

      if (data.success) {
        setSent(true);
      } else {
        setError(data.error || "Failed to send login link");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setSent(false);
    onClose();
  };

  // Success state - email sent
  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <svg
                className="h-7 w-7 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Check Your Email
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              We sent a login link to:
            </p>
            <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">
              {email}
            </p>
            <p className="mt-4 text-sm text-zinc-500">
              Click the link in the email to log in. The link expires in 15 minutes.
            </p>
            <button
              onClick={handleClose}
              className="mt-6 w-full rounded-lg border border-zinc-300 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Close
            </button>
            <button
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              className="mt-2 text-sm text-emerald-600 hover:text-emerald-700"
            >
              Try a different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Log In
          </h2>
          <button
            onClick={handleClose}
            className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Enter your email and we&apos;ll send you a login link.
        </p>

        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />

          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Login Link"}
          </button>
        </form>

        <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-700">
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Don&apos;t have access yet?
          </p>
          <button
            onClick={onPurchase}
            className="mt-2 w-full rounded-lg border border-emerald-600 py-3 font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950"
          >
            Get Access — Starting at $9
          </button>
        </div>
      </div>
    </div>
  );
}
