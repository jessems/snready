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
    <div className="min-h-[calc(100vh-65px)] subtle-gradient">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <div className="border-b border-[var(--border)] bg-[var(--card-bg)]">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-light)] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[var(--accent)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                ServiceNow Version Diff
              </h1>
              <p className="text-[var(--text-secondary)]">
                What changed between releases — searchable and filterable
              </p>
            </div>
          </div>

          <p className="text-[var(--text-secondary)] leading-relaxed mt-4 max-w-3xl">
            Every ServiceNow release brings hundreds of changes across 30+
            product areas. Stop digging through 200-page release notes — search,
            filter, and find exactly what matters to your role, your upgrade, and
            your certification.
          </p>
        </div>
      </div>

      {/* Version Cards */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
          Select a Release
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {versions.map((v) => {
            // Count types
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
                className="group block p-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--accent)] hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    {v.name}
                  </h3>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {VERSION_DATES[v.slug] || ""}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="text-center p-2 rounded bg-emerald-50">
                    <div className="text-sm font-semibold text-emerald-700">
                      {typeCounts.new}
                    </div>
                    <div className="text-xs text-emerald-600">New</div>
                  </div>
                  <div className="text-center p-2 rounded bg-blue-50">
                    <div className="text-sm font-semibold text-blue-700">
                      {typeCounts.changed}
                    </div>
                    <div className="text-xs text-blue-600">Changed</div>
                  </div>
                  <div className="text-center p-2 rounded bg-amber-50">
                    <div className="text-sm font-semibold text-amber-700">
                      {typeCounts.deprecated}
                    </div>
                    <div className="text-xs text-amber-600">Deprecated</div>
                  </div>
                  <div className="text-center p-2 rounded bg-purple-50">
                    <div className="text-sm font-semibold text-purple-700">
                      {typeCounts.fixed}
                    </div>
                    <div className="text-xs text-purple-600">Fixed</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">
                    {v.totalEntries} changes · {v.products.length} products
                  </span>
                  <span className="text-sm text-[var(--accent)] group-hover:translate-x-1 transition-transform inline-block">
                    Explore →
                  </span>
                </div>

                {v.fromVersion && (
                  <p className="text-xs text-[var(--text-secondary)] mt-2">
                    Upgrading from {v.fromVersion}
                  </p>
                )}
              </Link>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-10 p-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-[var(--accent)]">
                {totalChanges.toLocaleString()}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                Total Changes Tracked
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[var(--accent)]">
                {versions.length}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                Versions Covered
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[var(--accent)]">
                {summary.products.length}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                Product Areas
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-16 space-y-8 border-t border-[var(--border)] pt-12">
          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
              Why Use a ServiceNow Version Diff Tool?
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              ServiceNow releases major platform versions twice a year, each
              containing hundreds of new features, behavioral changes, and
              deprecations. Whether you&apos;re an admin planning an upgrade, a
              developer checking API changes, or studying for a certification
              exam, finding the specific changes that affect you is
              time-consuming. Our Version Diff tool aggregates and categorizes
              every documented change, making it instantly searchable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
              Preparing for Your Upgrade?
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Each version page lets you filter changes by product area and
              impact level. Focus on high-impact changes first, then work
              through the rest. The certification filter helps exam candidates
              find version-specific changes that might appear on their test.
              Pair this with our{" "}
              <Link
                href="/certifications"
                className="text-[var(--accent)] hover:underline"
              >
                1,380+ practice questions
              </Link>{" "}
              covering 20 ServiceNow certifications.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
