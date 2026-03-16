"use client";

import Link from "next/link";
import { useAccess } from "@/components/AccessProvider";
import { CheckoutButton } from "@/components/CheckoutButton";
import { LoginModal } from "@/components/LoginModal";
import { useState } from "react";

export default function AccountPage() {
  const { authenticated, hasAccess, email, plan, expiresAt, loading, logout } = useAccess();
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Account</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Log in to view your account.
          </p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Log In
          </button>
        </div>
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onPurchase={() => setShowLoginModal(false)}
        />
      </div>
    );
  }

  const isAllCerts = plan === "all";
  const expiresDate = expiresAt ? new Date(expiresAt) : null;
  const isExpired = !hasAccess && expiresAt != null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Account</h1>

      <div className="mt-8 space-y-6">
        {/* Email */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Email</h2>
          <p className="mt-1 text-lg font-medium text-zinc-900 dark:text-zinc-100">{email}</p>
        </div>

        {/* Subscription Status */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Subscription</h2>
          {hasAccess ? (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  Active
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {isAllCerts ? "All Certifications" : "Single Certification"} — Lifetime
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Your lifetime access never expires.
              </p>
            </div>
          ) : (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {isExpired ? "Expired" : "No Active Plan"}
                </span>
              </div>
              {isExpired && expiresDate && (
                <p className="mt-2 text-sm text-zinc-500">
                  Your plan expired on {expiresDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.
                </p>
              )}
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                Get access to unlock all practice questions with detailed explanations.
              </p>
              <div className="mt-4 grid gap-3">
                <CheckoutButton
                  plan="all"
                  className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  Lifetime All Certs — $49
                </CheckoutButton>
                <Link
                  href="/certifications"
                  className="w-full rounded-lg border-2 border-emerald-600 bg-white py-3 text-center font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                  Or buy a single cert — $9
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Quick Links</h2>
          <div className="mt-3 space-y-2">
            <Link
              href="/certifications"
              className="block text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              Browse Certifications
            </Link>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full rounded-lg border border-zinc-300 py-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
