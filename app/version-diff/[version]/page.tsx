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
  "washington-dc": { name: "Washington DC", date: "March 2024", year: "2024" },
  xanadu: { name: "Xanadu", date: "September 2024", year: "2024" },
  yokohama: { name: "Yokohama", date: "March 2025", year: "2025" },
  zurich: { name: "Zurich", date: "September 2025", year: "2025" },
};

export async function generateStaticParams() {
  return Object.keys(VERSION_META).map((version) => ({ version }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { version } = await params;
  const meta = VERSION_META[version];
  if (!meta) return {};

  const summary = getReleaseSummary();
  const versionData = summary.versions[version];
  if (!versionData) return {};

  return {
    title: `ServiceNow ${meta.name} Release Notes: ${versionData.totalEntries} Changes (${meta.year}) | SNReady`,
    description: `What's new in ServiceNow ${meta.name} (${meta.date}). ${versionData.totalEntries} documented changes across ${versionData.products.length} product areas. Filter by product, impact, and certification.`,
    keywords: [
      `servicenow ${meta.name.toLowerCase()} new features`,
      `servicenow ${meta.name.toLowerCase()} release notes`,
      `servicenow ${meta.name.toLowerCase()} changes`,
      `servicenow ${meta.name.toLowerCase()} deprecated features`,
    ],
    openGraph: {
      title: `ServiceNow ${meta.name} Release Notes — ${versionData.totalEntries} Changes`,
      description: `${versionData.totalEntries} documented changes across ${versionData.products.length} products in ServiceNow ${meta.name}.`,
      url: `https://snready.com/version-diff/${version}`,
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

  const allCerts = new Set<string>();
  versionData.products.forEach((p) =>
    p.entries.forEach((e) => e.certRelevance.forEach((c) => allCerts.add(c)))
  );
  const certs = [...allCerts].sort();

  const typeCounts = { new: 0, changed: 0, deprecated: 0, fixed: 0 };
  versionData.products.forEach((p) =>
    p.entries.forEach((e) => typeCounts[e.type as keyof typeof typeCounts]++)
  );

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "https://snready.com" },
    { name: "Version Diff", url: "https://snready.com/version-diff" },
    { name: meta.name, url: `https://snready.com/version-diff/${version}` },
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
          text: `ServiceNow ${meta.name} (${meta.date}) introduced ${versionData.totalEntries} changes across ${versionData.products.length} product areas. Key areas include ${versionData.products.sort((a, b) => b.entryCount - a.entryCount).slice(0, 5).map((p) => p.name).join(", ")}.`,
        },
      },
      {
        "@type": "Question",
        name: `What was deprecated in ServiceNow ${meta.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: typeCounts.deprecated > 0
            ? `${typeCounts.deprecated} features were deprecated in ${meta.name}. Use the filter tool to see all deprecations by product area.`
            : `The ${meta.name} release notes do not highlight specific deprecations in the N-1 upgrade path.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="border-b border-zinc-200 bg-gradient-to-b from-emerald-50 to-white dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <nav className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
            <Link href="/version-diff" className="hover:text-emerald-600 dark:hover:text-emerald-400">
              Version Diff
            </Link>
            <span className="mx-2">›</span>
            <span className="text-zinc-900 dark:text-zinc-100">{meta.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                ServiceNow <span className="text-emerald-600">{meta.name}</span>
              </h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                {meta.date} · {versionData.totalEntries} changes · {versionData.products.length} products
                {versionData.fromVersion && ` · Upgrading from ${versionData.fromVersion}`}
              </p>
            </div>
          </div>

          {/* Version nav pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {Object.entries(VERSION_META).map(([slug, m]) => (
              <Link
                key={slug}
                href={`/version-diff/${slug}`}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  slug === version
                    ? "bg-emerald-600 text-white shadow-md"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:border-emerald-300 hover:text-emerald-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-emerald-600"
                }`}
              >
                {m.name}
              </Link>
            ))}
          </div>

          {/* Type stats */}
          <div className="mt-6 grid grid-cols-4 gap-3 max-w-lg">
            <div className="rounded-lg bg-emerald-50 p-3 text-center dark:bg-emerald-950">
              <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{typeCounts.new}</div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-500">New</div>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-950">
              <div className="text-xl font-bold text-blue-700 dark:text-blue-400">{typeCounts.changed}</div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-blue-600 dark:text-blue-500">Changed</div>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 text-center dark:bg-amber-950">
              <div className="text-xl font-bold text-amber-700 dark:text-amber-400">{typeCounts.deprecated}</div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-500">Deprecated</div>
            </div>
            <div className="rounded-lg bg-purple-50 p-3 text-center dark:bg-purple-950">
              <div className="text-xl font-bold text-purple-700 dark:text-purple-400">{typeCounts.fixed}</div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-purple-600 dark:text-purple-500">Fixed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <VersionDiffClient
          versions={{ [version]: versionData }}
          products={summary.products}
          certs={certs}
          versionSlug={version}
        />

        {/* Browse by Product */}
        <div className="mt-14 border-t border-zinc-200 pt-10 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Browse by Product Area
          </h2>
          <div className="flex flex-wrap gap-2">
            {versionData.products
              .sort((a, b) => b.entryCount - a.entryCount)
              .map((p) => (
                <Link
                  key={p.slug}
                  href={`/version-diff/${version}/${p.slug}`}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-600 transition-all hover:border-emerald-300 hover:text-emerald-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-emerald-600"
                >
                  {p.name}{" "}
                  <span className="text-zinc-400 dark:text-zinc-500">
                    ({p.entryCount})
                  </span>
                </Link>
              ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-14 border-t border-zinc-200 pt-10 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            What&apos;s New in ServiceNow {meta.name}?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            The ServiceNow {meta.name} release ({meta.date}) brought{" "}
            {versionData.totalEntries} documented changes across{" "}
            {versionData.products.length} product areas. The biggest updates were in{" "}
            {versionData.products
              .sort((a, b) => b.entryCount - a.entryCount)
              .slice(0, 3)
              .map((p) => `${p.name} (${p.entryCount} changes)`)
              .join(", ")}
            . Practice with our{" "}
            <Link href="/certifications" className="text-emerald-600 hover:underline dark:text-emerald-400">
              certification prep questions
            </Link>{" "}
            to stay current.
          </p>
        </div>
      </section>
    </div>
  );
}
