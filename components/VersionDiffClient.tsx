"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface ReleaseEntry {
  title: string;
  type: "new" | "changed" | "deprecated" | "fixed";
  impact: "high" | "medium" | "low";
  summary: string;
  url: string | null;
  certRelevance: string[];
}

interface ProductArea {
  name: string;
  slug: string;
  entryCount: number;
  entries: ReleaseEntry[];
}

interface VersionData {
  name: string;
  slug: string;
  fromVersion: string | null;
  totalEntries: number;
  products: ProductArea[];
}

const TYPE_CONFIG = {
  new: {
    label: "New",
    emoji: "🆕",
    bg: "bg-emerald-50 dark:bg-emerald-950",
    text: "text-emerald-700 dark:text-emerald-400",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
  changed: {
    label: "Changed",
    emoji: "🔄",
    bg: "bg-blue-50 dark:bg-blue-950",
    text: "text-blue-700 dark:text-blue-400",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  deprecated: {
    label: "Deprecated",
    emoji: "⚠️",
    bg: "bg-amber-50 dark:bg-amber-950",
    text: "text-amber-700 dark:text-amber-400",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  fixed: {
    label: "Fixed",
    emoji: "🐛",
    bg: "bg-purple-50 dark:bg-purple-950",
    text: "text-purple-700 dark:text-purple-400",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
};

const IMPACT_BADGE = {
  high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  low: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function VersionDiffClient({
  versions,
  products,
  certs,
  versionSlug,
}: {
  versions: Record<string, VersionData>;
  products: string[];
  certs: string[];
  versionSlug?: string;
}) {
  const versionSlugs = Object.keys(versions);
  const [selectedVersion, setSelectedVersion] = useState(
    versionSlugs[versionSlugs.length - 1] || versionSlugs[0]
  );
  const [filterProduct, setFilterProduct] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCert, setFilterCert] = useState("");
  const [filterImpact, setFilterImpact] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());

  const version = versions[selectedVersion];

  const filteredProducts = useMemo(() => {
    if (!version) return [];
    return version.products
      .filter((p) => !filterProduct || p.slug === filterProduct)
      .map((p) => ({
        ...p,
        entries: p.entries.filter((e) => {
          if (filterType && e.type !== filterType) return false;
          if (filterImpact && e.impact !== filterImpact) return false;
          if (filterCert && !e.certRelevance.includes(filterCert)) return false;
          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return e.title.toLowerCase().includes(q) || e.summary.toLowerCase().includes(q);
          }
          return true;
        }),
      }))
      .filter((p) => p.entries.length > 0);
  }, [version, filterProduct, filterType, filterImpact, filterCert, searchQuery]);

  const totalFiltered = filteredProducts.reduce((sum, p) => sum + p.entries.length, 0);

  const toggleProduct = (slug: string) => {
    setExpandedProducts((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  const expandAll = () => setExpandedProducts(new Set(filteredProducts.map((p) => p.slug)));
  const collapseAll = () => setExpandedProducts(new Set());

  const typeDistribution = useMemo(() => {
    const counts = { new: 0, changed: 0, deprecated: 0, fixed: 0 };
    filteredProducts.forEach((p) => p.entries.forEach((e) => counts[e.type]++));
    return counts;
  }, [filteredProducts]);

  const hasFilters = filterProduct || filterType || filterCert || filterImpact || searchQuery;

  return (
    <div className="space-y-6">
      {/* Type filter cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.keys(TYPE_CONFIG) as Array<keyof typeof TYPE_CONFIG>).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(filterType === type ? "" : type)}
            className={`rounded-xl border p-3 text-left transition-all ${
              filterType === type
                ? "border-emerald-400 bg-emerald-50 shadow-sm ring-1 ring-emerald-200 dark:border-emerald-600 dark:bg-emerald-950 dark:ring-emerald-800"
                : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
            }`}
          >
            <div className="text-lg">{TYPE_CONFIG[type].emoji}</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {TYPE_CONFIG[type].label}
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {typeDistribution[type]}
            </div>
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search features, APIs, products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-600"
          />
        </div>
        <select
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 focus:border-emerald-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <option value="">All Products</option>
          {version?.products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name} ({p.entryCount})
            </option>
          ))}
        </select>
        <select
          value={filterCert}
          onChange={(e) => setFilterCert(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 focus:border-emerald-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <option value="">All Certifications</option>
          {certs.map((cert) => (
            <option key={cert} value={cert}>{cert}</option>
          ))}
        </select>
        <select
          value={filterImpact}
          onChange={(e) => setFilterImpact(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 focus:border-emerald-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <option value="">All Impact</option>
          <option value="high">🔴 High Impact</option>
          <option value="medium">🟡 Medium Impact</option>
          <option value="low">⚪ Low Impact</option>
        </select>
      </div>

      {/* Result count + actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalFiltered}</span> changes across{" "}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{filteredProducts.length}</span> products
          {hasFilters && (
            <button
              onClick={() => {
                setFilterProduct("");
                setFilterType("");
                setFilterCert("");
                setFilterImpact("");
                setSearchQuery("");
              }}
              className="ml-3 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Clear filters
            </button>
          )}
        </p>
        <div className="flex gap-3 text-xs">
          <button onClick={expandAll} className="text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400">
            Expand all
          </button>
          <span className="text-zinc-300 dark:text-zinc-600">|</span>
          <button onClick={collapseAll} className="text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400">
            Collapse all
          </button>
        </div>
      </div>

      {/* Product Sections */}
      <div className="space-y-3">
        {filteredProducts.map((product) => {
          const isExpanded = expandedProducts.has(product.slug);
          return (
            <div
              key={product.slug}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            >
              <button
                onClick={() => toggleProduct(product.slug)}
                className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className={`h-4 w-4 text-zinc-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {product.name}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    {product.entries.length}
                  </span>
                </div>
                <div className="hidden sm:flex gap-1.5">
                  {(Object.entries(TYPE_CONFIG) as [keyof typeof TYPE_CONFIG, (typeof TYPE_CONFIG)[keyof typeof TYPE_CONFIG]][]).map(
                    ([type, config]) => {
                      const count = product.entries.filter((e) => e.type === type).length;
                      if (!count) return null;
                      return (
                        <span key={type} className={`rounded px-1.5 py-0.5 text-xs font-medium ${config.badge}`}>
                          {config.emoji} {count}
                        </span>
                      );
                    }
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-zinc-100 dark:border-zinc-800">
                  {versionSlug && (
                    <Link
                      href={`/version-diff/${versionSlug}/${product.slug}`}
                      className="flex items-center justify-between px-5 py-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900"
                    >
                      <span className="text-sm font-medium">
                        View all {product.name} changes →
                      </span>
                      <span className="text-xs rounded-full bg-emerald-200 px-2 py-0.5 font-medium dark:bg-emerald-800">
                        {product.entries.length} entries
                      </span>
                    </Link>
                  )}
                  {product.entries.map((entry, i) => (
                    <div
                      key={i}
                      className={`px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
                        i > 0 ? "border-t border-zinc-100 dark:border-zinc-800" : ""
                      }`}
                    >
                      <div className="mb-2 flex flex-wrap items-start gap-1.5">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_CONFIG[entry.type].badge}`}>
                          {TYPE_CONFIG[entry.type].emoji} {TYPE_CONFIG[entry.type].label}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${IMPACT_BADGE[entry.impact]}`}>
                          {entry.impact}
                        </span>
                        {entry.certRelevance.map((cert) => (
                          <Link
                            key={cert}
                            href={`/certifications/${cert.toLowerCase()}`}
                            className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900"
                          >
                            {cert}
                          </Link>
                        ))}
                      </div>
                      <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                        {entry.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {entry.summary}
                      </p>
                      {entry.url && (
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          View in ServiceNow docs →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">No changes found</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}
    </div>
  );
}
