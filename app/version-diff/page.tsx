import { Metadata } from "next";
import Link from "next/link";
import { getReleaseSummary } from "@/lib/release-notes";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

const VERSION_DATES: Record<string, string> = {
  "washington-dc": "March 2024",
  xanadu: "September 2024",
  yokohama: "March 2025",
  zurich: "September 2025",
};

export const metadata: Metadata = {
  title: "ServiceNow Version Diff — What Changed Between Releases | SNReady",
  description:
    "Compare ServiceNow releases side by side. 1,073 documented changes across Washington DC, Xanadu, Yokohama, and Zurich. Filter by product, certification, and impact.",
  keywords: [
    "servicenow release notes",
    "servicenow version comparison",
    "servicenow upgrade changes",
    "servicenow new features",
    "servicenow deprecated features",
    "servicenow xanadu vs yokohama",
  ],
  openGraph: {
    title: "ServiceNow Version Diff — What Changed Between Releases",
    description:
      "1,073 documented changes across 4 ServiceNow releases. Searchable, filterable, and mapped to certifications.",
    url: "https://snready.com/version-diff",
    type: "website",
  },
};

export default function VersionDiffIndexPage() {
  const summary = getReleaseSummary();
  const versions = Object.values(summary.versions);
  const totalChanges = versions.reduce((sum, v) => sum + v.totalEntries, 0);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "https://snready.com" },
    { name: "Version Diff", url: "https://snready.com/version-diff" },
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the latest ServiceNow release?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Zurich is the latest ServiceNow release (September 2025), with 341 documented changes across 33 product areas including major updates to Now Assist, ITSM, and AI Platform capabilities.",
        },
      },
      {
        "@type": "Question",
        name: "How often does ServiceNow release new versions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ServiceNow releases two major versions per year, typically in March and September. Recent releases include Washington DC (March 2024), Xanadu (September 2024), Yokohama (March 2025), and Zurich (September 2025).",
        },
      },
      {
        "@type": "Question",
        name: "How do I find what changed in a ServiceNow upgrade?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use SNReady's Version Diff tool to search and filter 1,073+ documented changes across 4 major ServiceNow releases. Filter by product area (ITSM, CSM, ITOM, etc.), change type (new, changed, deprecated), impact level, and even certification relevance.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-16 dark:from-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900">
              <svg
                className="h-8 w-8 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
              ServiceNow{" "}
              <span className="text-emerald-600">Version Diff</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Stop digging through 200-page release notes.{" "}
              {totalChanges.toLocaleString()} documented changes across{" "}
              {versions.length} releases — searchable, filterable, and mapped to
              certifications.
            </p>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-4">
            <div className="rounded-xl border border-emerald-200 bg-white p-4 text-center shadow-sm dark:border-emerald-800 dark:bg-zinc-900">
              <div className="text-3xl font-bold text-emerald-600">
                {totalChanges.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Changes Tracked
              </div>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-white p-4 text-center shadow-sm dark:border-emerald-800 dark:bg-zinc-900">
              <div className="text-3xl font-bold text-emerald-600">
                {versions.length}
              </div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Versions
              </div>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-white p-4 text-center shadow-sm dark:border-emerald-800 dark:bg-zinc-900">
              <div className="text-3xl font-bold text-emerald-600">
                {summary.products.length}
              </div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Product Areas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Version Cards */}
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Select a Release
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {versions.map((v) => {
              const typeCounts = { new: 0, changed: 0, deprecated: 0, fixed: 0 };
              v.products.forEach((p) =>
                p.entries.forEach(
                  (e) => typeCounts[e.type as keyof typeof typeCounts]++
                )
              );

              return (
                <Link
                  key={v.slug}
                  href={`/version-diff/${v.slug}`}
                  className="group rounded-xl border border-zinc-200 bg-zinc-50 p-6 transition-all hover:border-emerald-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-zinc-900 group-hover:text-emerald-600 transition-colors dark:text-zinc-100">
                      {v.name}
                    </h3>
                    <span className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                      {VERSION_DATES[v.slug]}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-5">
                    <div className="rounded-lg bg-emerald-50 p-2.5 text-center dark:bg-emerald-950">
                      <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                        {typeCounts.new}
                      </div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-500">
                        New
                      </div>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-2.5 text-center dark:bg-blue-950">
                      <div className="text-lg font-bold text-blue-700 dark:text-blue-400">
                        {typeCounts.changed}
                      </div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-blue-600 dark:text-blue-500">
                        Changed
                      </div>
                    </div>
                    <div className="rounded-lg bg-amber-50 p-2.5 text-center dark:bg-amber-950">
                      <div className="text-lg font-bold text-amber-700 dark:text-amber-400">
                        {typeCounts.deprecated}
                      </div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-500">
                        Deprecated
                      </div>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-2.5 text-center dark:bg-purple-950">
                      <div className="text-lg font-bold text-purple-700 dark:text-purple-400">
                        {typeCounts.fixed}
                      </div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-purple-600 dark:text-purple-500">
                        Fixed
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {v.totalEntries} changes · {v.products.length} products
                    </span>
                    <span className="text-sm font-medium text-emerald-600 group-hover:translate-x-1 transition-transform inline-block dark:text-emerald-400">
                      Explore →
                    </span>
                  </div>

                  {v.fromVersion && (
                    <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
                      Upgrade path from {v.fromVersion}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                Why Use a Version Diff Tool?
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                ServiceNow releases major platform versions twice a year, each
                containing hundreds of new features, behavioral changes, and
                deprecations. Whether you&apos;re planning an upgrade, checking API
                changes, or studying for a certification, our tool lets you
                instantly find what matters to your role.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                Preparing for Your Upgrade?
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Filter changes by product area and impact level. Focus on
                high-impact changes first. The certification filter helps exam
                candidates spot version-specific changes. Pair with our{" "}
                <Link
                  href="/certifications"
                  className="text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  1,380+ practice questions
                </Link>{" "}
                across 20 certifications.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
