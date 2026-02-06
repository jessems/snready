"use client";

import Link from "next/link";
import { useState } from "react";
import { useAccess } from "./AccessProvider";
import { LoginModal } from "./LoginModal";
import { CheckoutButton } from "./CheckoutButton";

export default function Header() {
  const { hasAccess, email, logout, loading } = useAccess();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">SN</span>
            </div>
            <span className="font-semibold text-lg text-[var(--text-primary)]">
              SNReady
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-[var(--accent)] bg-[var(--accent-light)] px-3 py-1.5 rounded-full">
              Beta
            </span>

            {loading ? (
              <div className="w-20 h-8 bg-zinc-100 rounded-lg animate-pulse" />
            ) : hasAccess ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-xs font-semibold text-emerald-700">
                      {email?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="hidden sm:inline">Account</span>
                  <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg z-20">
                      <div className="px-4 py-2 border-b border-zinc-100">
                        <p className="text-xs text-zinc-500">Logged in as</p>
                        <p className="text-sm font-medium text-zinc-900 truncate">{email}</p>
                      </div>
                      <Link
                        href="/certifications"
                        className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                        onClick={() => setShowDropdown(false)}
                      >
                        My Certifications
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="rounded-lg border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onPurchase={() => {
          setShowLoginModal(false);
          // Navigate to CSA certification page as default
          window.location.href = "/certifications/csa";
        }}
      />
    </>
  );
}
