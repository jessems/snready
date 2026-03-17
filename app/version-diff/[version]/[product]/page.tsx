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
  new: { label: "New", emoji: "🆕", color: "bg-emerald-100 text-emerald-800" },
  changed: { label: "Changed", emoji: "🔄", color: "bg-blue-100 text-blue-800" },
  deprecated: { label: "Deprecated", emoji: "⚠️", color: "bg-amber-100 text-amber-800" },
  fixed: { label: "Fixed", emoji: "🐛", color: "bg-purple-100 text-purple-800" },
};

const IMPACT_CONFIG = {
  high: { label: "High Impact", color: "bg-red-100 text-red-700" },
  medium: { label: "Medium Impact", color: "bg-yellow-100 text-yellow-700" },
  low: { label: "Low Impact", color: "bg-gray-100 text-gray-600" },
};

const CERT_COLORS: Record<string, string> = {
  CSA: "bg-blue-50 text-blue-700 border-blue-200",
  CAD: "bg-indigo-50 text-indigo-700 border-indigo-200",
  "CIS-ITSM": "bg-green-50 text-green-700 border-green-200",
  "CIS-CSM": "bg-teal-50 text-teal-700 border-teal-200",
  "CIS-HR": "bg-pink-50 text-pink-700 border-pink-200",
  "CIS-Discovery": "bg-orange-50 text-orange-700 border-orange-200",
  "CIS-HAM": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "CIS-SAM": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "CIS-PA": "bg-violet-50 text-violet-700 border-violet-200",
  "CIS-SIR": "bg-rose-50 text-rose-700 border-rose-200",
  "CIS-RC": "bg-amber-50 text-amber-700 border-amber-200",
  "CIS-FSM": "bg-lime-50 text-lime-700 border-lime-200",
  "CIS-SPM": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
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
  const versionData = summary.versions[version];
  const productData = versionData?.products.find((p) => p.slug === product);
  if (!productData) return {};

  const date = VERSION_DATES[version] || "";

  return {
    title: `${productData.name} Changes in ServiceNow ${versionName} (${date}) | SNReady`,
    description: `${productData.entryCount} ${productData.name} changes in ServiceNow ${versionName}. New features, updates, and deprecations for ${productData.name} in the ${versionName} release.`,
    keywords: [
      `servicenow ${versionName.toLowerCase()} ${productData.name.toLowerCase()}`,
      `servicenow ${productData.name.toLowerCase()} release notes`,
      `${productData.name.toLowerCase()} changes ${versionName.toLowerCase()}`,
    ],
    openGraph: {
      title: `${productData.name} in ServiceNow ${versionName} — ${productData.entryCount} Changes`,
      description: `${productData.entryCount} documented changes for ${productData.name} in ServiceNow ${versionName} (${date}).`,
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

  // Type counts for this product
  const typeCounts = { new: 0, changed: 0, deprecated: 0, fixed: 0 };
  productData.entries.forEach(
    (e) => typeCounts[e.type as keyof typeof typeCounts]++
  );

  // Collect certs for this product
  const relatedCerts = new Set<string>();
  productData.entries.forEach((e) =>
    e.certRelevance.forEach((c) => relatedCerts.add(c))
  );

  // Find this product in other versions
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
    {
      name: productData.name,
      url: `https://snready.com/version-diff/${version}/${product}`,
    },
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
          <nav className="text-sm text-[var(--text-secondary)] mb-4">
            <Link href="/version-diff" className="hover:text-[var(--accent)]">
              Version Diff
            </Link>
            <span className="mx-2">›</span>
            <Link
              href={`/version-diff/${version}`}
              className="hover:text-[var(--accent)]"
            >
              {versionName}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-[var(--text-primary)]">
              {productData.name}
            </span>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
            {productData.name} in ServiceNow {versionName}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {productData.entryCount} documented changes · {date}
          </p>

          <div className="grid grid-cols-4 gap-2 mt-5 max-w-md">
            {(
              Object.entries(TYPE_CONFIG) as [
                keyof typeof TYPE_CONFIG,
                (typeof TYPE_CONFIG)[keyof typeof TYPE_CONFIG]
              ][]
            ).map(([type, config]) => (
              <div
                key={type}
                className={`text-center p-2 rounded ${config.color}`}
              >
                <div className="text-sm font-semibold">{typeCounts[type]}</div>
                <div className="text-xs">{config.label}</div>
              </div>
            ))}
          </div>

          {relatedCerts.size > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs text-[var(--text-secondary)] self-center">
                Relevant to:
              </span>
              {[...relatedCerts].map((cert) => (
                <Link
                  key={cert}
                  href={`/certifications/${cert.toLowerCase()}`}
                  className={`text-xs px-2 py-0.5 rounded-full border hover:opacity-80 ${
                    CERT_COLORS[cert] ||
                    "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  {cert}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Entries */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {productData.entries.map((entry, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--accent)] transition-colors"
            >
              <div className="flex flex-wrap items-start gap-2 mb-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    TYPE_CONFIG[entry.type].color
                  }`}
                >
                  {TYPE_CONFIG[entry.type].emoji} {TYPE_CONFIG[entry.type].label}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    IMPACT_CONFIG[entry.impact].color
                  }`}
                >
                  {IMPACT_CONFIG[entry.impact].label}
                </span>
              </div>
              <h2 className="font-medium text-[var(--text-primary)] mb-2">
                {entry.title}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {entry.summary}
              </p>
              {entry.url && (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--accent)] hover:underline mt-3 inline-block"
                >
                  View in ServiceNow docs →
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Same product in other versions */}
        {otherVersions.length > 0 && (
          <div className="mt-12 border-t border-[var(--border)] pt-8">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              {productData.name} in Other Releases
            </h2>
            <div className="flex flex-wrap gap-3">
              {otherVersions.map((ov) => (
                <Link
                  key={ov.slug}
                  href={`/version-diff/${ov.slug}/${product}`}
                  className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--accent)] transition-all text-sm"
                >
                  <span className="font-medium text-[var(--text-primary)]">
                    {ov.name}
                  </span>
                  <span className="text-[var(--text-secondary)] ml-2">
                    ({ov.count} changes)
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back navigation */}
        <div className="mt-8 flex gap-3">
          <Link
            href={`/version-diff/${version}`}
            className="text-sm text-[var(--accent)] hover:underline"
          >
            ← All {versionName} changes
          </Link>
          <Link
            href="/version-diff"
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]"
          >
            All versions
          </Link>
        </div>
      </div>
    </div>
  );
}
