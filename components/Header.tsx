"use client";

import Link from "next/link";
import { useState } from "react";
import { useAccess } from "./AccessProvider";
import { LoginModal } from "./LoginModal";

export default function Header() {
  const { hasAccess, email, logout, loading } = useAccess();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      <nav className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-emerald-600">
                SNReady
              </span>
            </Link>
            
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Certification Links - Hidden on mobile */}
              <div className="hidden sm:flex sm:items-center sm:gap-6">
                <Link
                  href="/certifications/csa"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  CSA
                </Link>
                <Link
                  href="/certifications/cad"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  CAD
                </Link>
                <Link
                  href="/certifications/cis-df"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  CIS-DF
                </Link>
                <Link
                  href="/certifications/cis-itsm"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  CIS-ITSM
                </Link>
                <Link
                  href="/certifications"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  All 25+ Exams
                </Link>
              </div>

              {/* Auth Section */}
              {loading ? (
                <div className="w-16 h-8 bg-zinc-100 rounded-lg animate-pulse dark:bg-zinc-800" />
              ) : hasAccess ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center dark:bg-emerald-900">
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
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
                      <div className="absolute right-0 mt-2 w-56 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg z-20 dark:border-zinc-700 dark:bg-zinc-900">
                        <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">Logged in as</p>
                          <p className="text-sm font-medium text-zinc-900 truncate dark:text-zinc-100">{email}</p>
                        </div>
                        <Link
                          href="/certifications"
                          className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          onClick={() => setShowDropdown(false)}
                        >
                          My Certifications
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
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
                  className="rounded-lg border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Log in
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onPurchase={() => {
          setShowLoginModal(false);
          window.location.href = "/certifications/csa";
        }}
      />
    </>
  );
}
