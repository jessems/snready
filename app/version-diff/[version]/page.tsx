import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getReleaseSummary } from "@/lib/release-notes";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import VersionDiffClient from "@/components/VersionDiffClient";

interface PageProps {
  params: Promise<{ version: string }>;
}

const VERSION_META: Record<
  string,
  { name: string; date: string; year: string }
> = {
  "washington-dc": {
    name: "Washington DC",
    date: "March 2024",
    year: "2024",
  },
  xanadu: { name: "Xanadu", date: "September 2024", year: "2024" },
  yokohama: { name: "Yokohama", date: "March 2025", year: "2025" },
  zurich: { name: "Zurich", date: "September 2025", year: "2025" },
};

export async function generateStaticParams() {
  return Object.keys(VERSION_META).map((version) => ({ version }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { version } = await params;
  const meta = VERSION_META[version];
  if (!meta) return {};

  const summary = getReleaseSummary();
  const versionData = summary.versions[version];
  if (!versionData) return {};

  return {
    title: `ServiceNow ${meta.name} Release Notes: ${versionData.totalEntries} Changes Across ${versionData.products.length} Products (${meta.year}) | SNReady`,
    description: `What's new in ServiceNow ${meta.name} (${meta.date}). ${versionData.totalEntries} documented changes across ${versionData.products.length} product areas. Filter by product, impact level, and certification relevance.`,
    keywords: [
      `servicenow ${meta.name.toLowerCase()} new features`,
      `servicenow ${meta.name.toLowerCase()} release notes`,
      `servicenow ${meta.name.toLowerCase()} changes`,
      `servicenow ${meta.name.toLowerCase()} what's new`,
      `servicenow ${meta.name.toLowerCase()} deprecated features`,
      `servicenow ${meta.name.toLowerCase()} upgrade`,
    ],
    openGraph: {
      title: `ServiceNow ${meta.name} Release Notes — ${versionData.totalEntries} Changes (${meta.year})`,
      description: `${versionData.totalEntries} documented changes across ${versionData.products.length} products in ServiceNow ${meta.name}. Searchable and filterable.`,
      url: `https://snready.com/version-diff/${version}`,
      type: "website",
    },
  };
}

export default async function VersionPage({ params }: PageProps) {
  const { version } = await params;
  const meta = VERSION_META[version];
  if (!meta) notFound();

  const summary = getReleaseSummary();
  const versionData = summary.versions[version];
  if (!versionData) notFound();

  // Collect certs
  const allCerts = new Set<string>();
  versionData.products.forEach((p) =>
    p.entries.forEach((e) => e.certRelevance.forEach((c) => allCerts.add(c)))
  );
  const certs = [...allCerts].sort();

  // Type counts
  const typeCounts = { new: 0, changed: 0, deprecated: 0, fixed: 0 };
  versionData.products.forEach((p) =>
    p.entries.forEach(
      (e) => typeCounts[e.type as keyof typeof typeCounts]++
    )
  );

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "https://snready.com" },
    { name: "Version Diff", url: "https://snready.com/version-diff" },
    {
      name: meta.name,
      url: `https://snready.com/version-diff/${version}`,
    },
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What's new in ServiceNow ${meta.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `ServiceNow ${meta.name} (${meta.date}) introduced ${versionData.totalEntries} changes across ${versionData.products.length} product areas. Key areas include ${versionData.products
            .sort((a, b) => b.entryCount - a.entryCount)
            .slice(0, 5)
            .map((p) => p.name)
            .join(", ")}.`,
        },
      },
      {
        "@type": "Question",
        name: `What was deprecated in ServiceNow ${meta.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            typeCounts.deprecated > 0
              ? `${typeCounts.deprecated} features or behaviors were deprecated in the ${meta.name} release. Use the filter tool above to see all deprecations by product area.`
              : `The ${meta.name} release documentation does not highlight specific deprecations in the N-1 upgrade path.`,
        },
      },
      {
        "@type": "Question",
        name: `How many products changed in ServiceNow ${meta.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${versionData.products.length} product areas received updates in ServiceNow ${meta.name}, with a total of ${versionData.totalEntries} documented changes.${
            versionData.fromVersion
              ? ` These notes cover upgrades from ${versionData.fromVersion}.`
              : ""
          }`,
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
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Breadcrumb */}
          <nav className="text-sm text-[var(--text-secondary)] mb-4">
            <Link href="/version-diff" className="hover:text-[var(--accent)]">
              Version Diff
            </Link>
            <span className="mx-2">›</span>
            <span className="text-[var(--text-primary)]">{meta.name}</span>
          </nav>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[var(--accent)]"
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
                ServiceNow {meta.name} Release Notes
              </h1>
              <p className="text-[var(--text-secondary)]">
                {meta.date} ·{" "}
                {versionData.fromVersion
                  ? `Upgrading from ${versionData.fromVersion}`
                  : `${versionData.totalEntries} changes`}
              </p>
            </div>
          </div>

          <p className="text-[var(--text-secondary)] leading-relaxed mt-3 max-w-3xl">
            {versionData.totalEntries} documented changes across{" "}
            {versionData.products.length} product areas in ServiceNow{" "}
            {meta.name}. Search by keyword, filter by product or certification,
            and focus on what matters to your upgrade.
          </p>

          {/* Version nav */}
          <div className="flex flex-wrap gap-2 mt-5">
            {Object.entries(VERSION_META).map(([slug, m]) => (
              <Link
                key={slug}
                href={`/version-diff/${slug}`}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  slug === version
                    ? "bg-[var(--accent)] text-white shadow-md"
                    : "bg-[var(--card-bg)] text-[var(--text-secondary)] hover:bg-[var(--card-bg-hover)] border border-[var(--border)]"
                }`}
              >
                {m.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <VersionDiffClient
          versions={{ [version]: versionData }}
          products={summary.products}
          certs={certs}
        />

        {/* Product Area Links */}
        <div className="mt-12 border-t border-[var(--border)] pt-8">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Browse by Product Area
          </h2>
          <div className="flex flex-wrap gap-2">
            {versionData.products
              .sort((a, b) => b.entryCount - a.entryCount)
              .map((p) => (
                <Link
                  key={p.slug}
                  href={`/version-diff/${version}/${p.slug}`}
                  className="px-3 py-1.5 rounded-lg text-sm border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                >
                  {p.name}{" "}
                  <span className="text-xs opacity-60">({p.entryCount})</span>
                </Link>
              ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-12 border-t border-[var(--border)] pt-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
              What&apos;s New in ServiceNow {meta.name}?
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              The ServiceNow {meta.name} release ({meta.date}) brought{" "}
              {versionData.totalEntries} documented changes across{" "}
              {versionData.products.length} product areas. The biggest updates
              were in{" "}
              {versionData.products
                .sort((a, b) => b.entryCount - a.entryCount)
                .slice(0, 3)
                .map((p) => `${p.name} (${p.entryCount} changes)`)
                .join(", ")}
              .
              {versionData.fromVersion &&
                ` These release notes cover the upgrade path from ${versionData.fromVersion} to ${meta.name}.`}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
              Studying for a Certification?
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Use the certification filter above to see only the {meta.name}{" "}
              changes relevant to your exam. Then practice with our{" "}
              <Link
                href="/certifications"
                className="text-[var(--accent)] hover:underline"
              >
                practice questions
              </Link>{" "}
              — 20 certifications, 1,380+ questions, all based on official
              course content.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
