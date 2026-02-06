"use client";

import { useState } from "react";
import { useAccess } from "./AccessProvider";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

export function LoginModal({ isOpen, onClose, onPurchase }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAccess();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(email);
    setLoading(false);

    if (success) {
      onClose();
    } else {
      setError("No active subscription found for this email. Purchase access to continue.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Access Your Account
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Enter the email you used to purchase access.
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
            {loading ? "Checking..." : "Access My Account"}
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
            Get 30-Day Access — $9
          </button>
        </div>
      </div>
    </div>
  );
}
