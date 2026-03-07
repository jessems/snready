"use client";

import Link from "next/link";
import { useState } from "react";
import { useAccess } from "./AccessProvider";
import { LoginModal } from "./LoginModal";
import certificationsData from "@/data/certifications.json";

const ADMIN_EMAILS = ["jessems@gmail.com"];

export default function Header() {
  const { authenticated, email, logout, loading } = useAccess();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showPracticeDropdown, setShowPracticeDropdown] = useState(false);
  
  const isAdmin = email && ADMIN_EMAILS.includes(email.toLowerCase());

  const sortedCertifications = [...certificationsData.certifications].sort((a, b) =>
    a.fullName.localeCompare(b.fullName)
  );

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-[var(--background)]/80 border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--gradient-end)] flex items-center justify-center">
                <span className="text-white font-bold text-sm">SN</span>
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)]">
                SNReady
              </span>
            </Link>
            
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="sm:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
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

              {/* Desktop Navigation */}
              <div className="hidden sm:flex sm:items-center sm:gap-1">
                {/* Practice Questions Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowPracticeDropdown(!showPracticeDropdown)}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--surface)]"
                  >
                    Practice
                    <svg className={`h-4 w-4 transition-transform ${showPracticeDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showPracticeDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowPracticeDropdown(false)}
                      />
                      <div className="absolute left-0 mt-2 w-80 max-h-[28rem] overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] py-2 shadow-xl z-20">
                        <div className="px-3 pb-2 mb-2 border-b border-[var(--border)]">
                          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Select certification</p>
                        </div>
                        <div className="space-y-0.5 px-2">
                          {sortedCertifications.map((cert) => (
                            <Link
                              key={cert.slug}
                              href={`/${cert.slug}`}
                              onClick={() => setShowPracticeDropdown(false)}
                              className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors group"
                            >
                              <span className="inline-flex items-center justify-center min-w-[4.5rem] flex-shrink-0 px-2 py-1 text-sm font-bold text-[var(--primary)] bg-[rgba(99,91,255,0.1)] rounded-md whitespace-nowrap group-hover:bg-[rgba(99,91,255,0.15)]">
                                {cert.name}
                              </span>
                              <span className="text-sm text-[var(--text-secondary)] leading-tight truncate">
                                {cert.fullName}
                              </span>
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-[var(--border)] mt-2 pt-2 px-2">
                          <Link
                            href="/certifications"
                            onClick={() => setShowPracticeDropdown(false)}
                            className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-[var(--primary)] hover:bg-[rgba(99,91,255,0.1)] rounded-lg transition-colors"
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
                  href="/blog"
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--surface)]"
                >
                  Blog
                </Link>

                <Link
                  href="/pricing"
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--surface)]"
                >
                  Pricing
                </Link>

                <Link
                  href="/resources"
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--surface)]"
                >
                  Resources
                </Link>

                <Link
                  href="/study-plan"
                  className="px-4 py-2 text-sm font-medium text-[var(--primary)] hover:bg-[rgba(99,91,255,0.1)] transition-colors rounded-lg flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Study Plan
                </Link>
              </div>

              {/* Auth Section */}
              {loading ? (
                <div className="w-20 h-9 bg-[var(--surface)] rounded-lg animate-pulse" />
              ) : authenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--text-primary)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--gradient-end)] flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">
                        {email?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="hidden sm:inline">Account</span>
                    <svg className={`h-4 w-4 text-[var(--text-muted)] transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] py-1 shadow-xl z-20">
                        <div className="px-4 py-3 border-b border-[var(--border)]">
                          <p className="text-xs text-[var(--text-muted)]">Logged in as</p>
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">{email}</p>
                        </div>
                        <Link
                          href="/account"
                          className="block px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          Account
                        </Link>
                        <Link
                          href="/certifications"
                          className="block px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          My Certifications
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin/coverage"
                            className="block px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
                            onClick={() => setShowDropdown(false)}
                          >
                            📊 Admin Dashboard
                          </Link>
                        )}
                        <div className="border-t border-[var(--border)] mt-1 pt-1">
                          <button
                            onClick={() => {
                              logout();
                              setShowDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            Log out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors"
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
        <div className="sm:hidden border-b border-[var(--border)] bg-[var(--surface-elevated)]">
          <div className="px-4 py-4 space-y-1">
            <div className="pb-4 mb-4 border-b border-[var(--border)]">
              <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Practice Questions</p>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {sortedCertifications.slice(0, 8).map((cert) => (
                  <Link
                    key={cert.slug}
                    href={`/${cert.slug}`}
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 py-2"
                  >
                    <span className="inline-flex items-center justify-center min-w-[4rem] px-2 py-1 text-sm font-bold text-[var(--primary)] bg-[rgba(99,91,255,0.1)] rounded-md">
                      {cert.name}
                    </span>
                    <span className="text-sm text-[var(--text-secondary)] truncate">
                      {cert.fullName}
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href="/certifications"
                onClick={() => setShowMobileMenu(false)}
                className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-[var(--primary)]"
              >
                View all certifications →
              </Link>
            </div>
            <Link
              href="/blog"
              onClick={() => setShowMobileMenu(false)}
              className="block py-2.5 text-sm font-medium text-[var(--text-secondary)]"
            >
              Blog
            </Link>
            <Link
              href="/pricing"
              onClick={() => setShowMobileMenu(false)}
              className="block py-2.5 text-sm font-medium text-[var(--text-secondary)]"
            >
              Pricing
            </Link>
            <Link
              href="/resources"
              onClick={() => setShowMobileMenu(false)}
              className="block py-2.5 text-sm font-medium text-[var(--text-secondary)]"
            >
              Resources
            </Link>
            <Link
              href="/study-plan"
              onClick={() => setShowMobileMenu(false)}
              className="block py-2.5 text-sm font-medium text-[var(--primary)]"
            >
              📅 Study Plan Generator
            </Link>
          </div>
        </div>
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onPurchase={() => {
          setShowLoginModal(false);
          window.location.href = "/csa";
        }}
      />
    </>
  );
}
