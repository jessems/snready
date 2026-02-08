"use client";

import Link from "next/link";
import { useState } from "react";
import { useAccess } from "./AccessProvider";
import { LoginModal } from "./LoginModal";
import certificationsData from "@/data/certifications.json";

export default function Header() {
  const { hasAccess, email, logout, loading } = useAccess();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showPracticeDropdown, setShowPracticeDropdown] = useState(false);

  // Sort certifications alphabetically by fullName
  const sortedCertifications = [...certificationsData.certifications].sort((a, b) =>
    a.fullName.localeCompare(b.fullName)
  );

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
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="sm:hidden p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                aria-label="Menu"
              >
                {showMobileMenu ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>

              {/* Navigation Links - Hidden on mobile */}
              <div className="hidden sm:flex sm:items-center sm:gap-6">
                {/* Practice Questions Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowPracticeDropdown(!showPracticeDropdown)}
                    className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 flex items-center gap-1"
                  >
                    Practice Questions
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showPracticeDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowPracticeDropdown(false)}
                      />
                      <div className="absolute left-0 mt-2 w-80 max-h-[28rem] overflow-y-auto rounded-xl border border-zinc-200 bg-white py-2 shadow-xl z-20 dark:border-zinc-700 dark:bg-zinc-900">
                        <div className="px-3 pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800">
                          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Select certification</p>
                        </div>
                        <div className="space-y-0.5 px-2">
                          {sortedCertifications.map((cert) => (
                            <Link
                              key={cert.slug}
                              href={`/certifications/${cert.slug}`}
                              onClick={() => setShowPracticeDropdown(false)}
                              className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group"
                            >
                              <span className="inline-flex items-center justify-center min-w-[4.5rem] px-2 py-1 text-sm font-bold text-emerald-700 bg-emerald-50 rounded-md group-hover:bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/40 dark:group-hover:bg-emerald-900/60">
                                {cert.name}
                              </span>
                              <span className="text-sm text-zinc-600 dark:text-zinc-400 leading-tight">
                                {cert.fullName}
                              </span>
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-zinc-100 mt-2 pt-2 px-2 dark:border-zinc-800">
                          <Link
                            href="/certifications"
                            onClick={() => setShowPracticeDropdown(false)}
                            className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                          >
                            View all certifications
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <Link
                  href="/study-guide"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Study Guides
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

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="sm:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="px-4 py-3 space-y-1">
            <div className="pb-3 mb-3 border-b border-zinc-100 dark:border-zinc-800">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Practice Questions</p>
              <div className="max-h-72 overflow-y-auto space-y-1">
                {sortedCertifications.map((cert) => (
                  <Link
                    key={cert.slug}
                    href={`/certifications/${cert.slug}`}
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 py-2"
                  >
                    <span className="inline-flex items-center justify-center min-w-[4.5rem] px-2 py-1 text-sm font-bold text-emerald-700 bg-emerald-50 rounded-md dark:text-emerald-300 dark:bg-emerald-900/40">
                      {cert.name}
                    </span>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400 leading-tight">
                      {cert.fullName}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/certifications"
              onClick={() => setShowMobileMenu(false)}
              className="block py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400"
            >
              View all certifications →
            </Link>
            <Link
              href="/study-guide"
              onClick={() => setShowMobileMenu(false)}
              className="block py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400"
            >
              Study Guides
            </Link>
          </div>
        </div>
      )}

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
