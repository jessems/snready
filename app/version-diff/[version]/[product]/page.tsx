import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getReleaseSummary } from "@/lib/release-notes";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

interface PageProps {
  params: Promise<{ version: string; product: string }>;
}

const VERSION_NAMES: Record<string, string> = {
  "washington-dc": "Washington DC",
  xanadu: "Xanadu",
  yokohama: "Yokohama",
  zurich: "Zurich",
};

const VERSION_DATES: Record<string, string> = {
  "washington-dc": "March 2024",
  xanadu: "September 2024",
  yokohama: "March 2025",
  zurich: "September 2025",
};

const TYPE_CONFIG = {
  new: {
    label: "New",
    emoji: "🆕",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
  changed: {
    label: "Changed",
    emoji: "🔄",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  deprecated: {
    label: "Deprecated",
    emoji: "⚠️",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  fixed: {
    label: "Fixed",
    emoji: "🐛",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
};

const IMPACT_BADGE = {
  high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  low: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

export async function generateStaticParams() {
  const summary = getReleaseSummary();
  const params: { version: string; product: string }[] = [];
  for (const [versionSlug, versionData] of Object.entries(summary.versions)) {
    for (const product of versionData.products) {
      params.push({ version: versionSlug, product: product.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { version, product } = await params;
  const versionName = VERSION_NAMES[version];
  if (!versionName) return {};

  const summary = getReleaseSummary();
  const productData = summary.versions[version]?.products.find((p) => p.slug === product);
  if (!productData) return {};

  const date = VERSION_DATES[version] || "";
  return {
    title: `${productData.name} Changes in ServiceNow ${versionName} (${date}) | SNReady`,
    description: `${productData.entryCount} ${productData.name} changes in ServiceNow ${versionName}. New features, updates, and deprecations.`,
    openGraph: {
      title: `${productData.name} in ServiceNow ${versionName} — ${productData.entryCount} Changes`,
      url: `https://snready.com/version-diff/${version}/${product}`,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { version, product } = await params;
  const versionName = VERSION_NAMES[version];
  if (!versionName) notFound();

  const summary = getReleaseSummary();
  const versionData = summary.versions[version];
  if (!versionData) notFound();

  const productData = versionData.products.find((p) => p.slug === product);
  if (!productData) notFound();

  const date = VERSION_DATES[version] || "";

  const typeCounts = { new: 0, changed: 0, deprecated: 0, fixed: 0 };
  productData.entries.forEach((e) => typeCounts[e.type as keyof typeof typeCounts]++);

  const relatedCerts = new Set<string>();
  productData.entries.forEach((e) => e.certRelevance.forEach((c) => relatedCerts.add(c)));

  const otherVersions = Object.entries(summary.versions)
    .filter(([slug]) => slug !== version)
    .map(([slug, v]) => {
      const p = v.products.find((p) => p.slug === product);
      return p ? { slug, name: VERSION_NAMES[slug], count: p.entryCount } : null;
    })
    .filter(Boolean) as { slug: string; name: string; count: number }[];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "https://snready.com" },
    { name: "Version Diff", url: "https://snready.com/version-diff" },
    { name: versionName, url: `https://snready.com/version-diff/${version}` },
    { name: productData.name, url: `https://snready.com/version-diff/${version}/${product}` },
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What changed in ${productData.name} in ServiceNow ${versionName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `ServiceNow ${versionName} (${date}) introduced ${productData.entryCount} changes to ${productData.name}, including ${typeCounts.new} new features, ${typeCounts.changed} behavioral changes, and ${typeCounts.deprecated} deprecations.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="border-b border-zinc-200 bg-gradient-to-b from-zinc-50 to-white dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
          <nav className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
            <Link href="/version-diff" className="hover:text-emerald-600 dark:hover:text-emerald-400">Version Diff</Link>
            <span className="mx-2">›</span>
            <Link href={`/version-diff/${version}`} className="hover:text-emerald-600 dark:hover:text-emerald-400">{versionName}</Link>
            <span className="mx-2">›</span>
            <span className="text-zinc-900 dark:text-zinc-100">{productData.name}</span>
          </nav>

          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {productData.name} in <span className="text-emerald-600">{versionName}</span>
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {productData.entryCount} documented changes · {date}
          </p>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-4 gap-3 max-w-md">
            {(Object.entries(TYPE_CONFIG) as [keyof typeof TYPE_CONFIG, (typeof TYPE_CONFIG)[keyof typeof TYPE_CONFIG]][]).map(([type, config]) => (
              <div key={type} className={`rounded-lg p-3 text-center ${
                type === 'new' ? 'bg-emerald-50 dark:bg-emerald-950' :
                type === 'changed' ? 'bg-blue-50 dark:bg-blue-950' :
                type === 'deprecated' ? 'bg-amber-50 dark:bg-amber-950' :
                'bg-purple-50 dark:bg-purple-950'
              }`}>
                <div className={`text-xl font-bold ${
                  type === 'new' ? 'text-emerald-700 dark:text-emerald-400' :
                  type === 'changed' ? 'text-blue-700 dark:text-blue-400' :
                  type === 'deprecated' ? 'text-amber-700 dark:text-amber-400' :
                  'text-purple-700 dark:text-purple-400'
                }`}>{typeCounts[type]}</div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{config.label}</div>
              </div>
            ))}
          </div>

          {/* Cert badges */}
          {relatedCerts.size > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Relevant to:</span>
              {[...relatedCerts].map((cert) => (
                <Link
                  key={cert}
                  href={`/certifications/${cert.toLowerCase()}`}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                >
                  {cert}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Entries */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-4">
          {productData.entries.map((entry, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-emerald-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
            >
              <div className="mb-2 flex flex-wrap items-start gap-1.5">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_CONFIG[entry.type].badge}`}>
                  {TYPE_CONFIG[entry.type].emoji} {TYPE_CONFIG[entry.type].label}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${IMPACT_BADGE[entry.impact]}`}>
                  {entry.impact} impact
                </span>
              </div>
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">{entry.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{entry.summary}</p>
              {entry.url && (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  View in ServiceNow docs →
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Other versions */}
        {otherVersions.length > 0 && (
          <div className="mt-14 border-t border-zinc-200 pt-10 dark:border-zinc-800">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              {productData.name} in Other Releases
            </h2>
            <div className="flex flex-wrap gap-3">
              {otherVersions.map((ov) => (
                <Link
                  key={ov.slug}
                  href={`/version-diff/${ov.slug}/${product}`}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 transition-all hover:border-emerald-300 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-emerald-700"
                >
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{ov.name}</span>
                  <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">({ov.count} changes)</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back nav */}
        <div className="mt-10 flex gap-4">
          <Link href={`/version-diff/${version}`} className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400">
            ← All {versionName} changes
          </Link>
          <Link href="/version-diff" className="text-sm text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400">
            All versions
          </Link>
        </div>
      </section>
    </div>
  );
}
