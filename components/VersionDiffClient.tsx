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
  new: { label: "New", emoji: "🆕", color: "bg-emerald-100 text-emerald-800" },
  changed: {
    label: "Changed",
    emoji: "🔄",
    color: "bg-blue-100 text-blue-800",
  },
  deprecated: {
    label: "Deprecated",
    emoji: "⚠️",
    color: "bg-amber-100 text-amber-800",
  },
  fixed: { label: "Fixed", emoji: "🐛", color: "bg-purple-100 text-purple-800" },
};

const IMPACT_CONFIG = {
  high: { label: "High", color: "bg-red-100 text-red-700" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-700" },
  low: { label: "Low", color: "bg-gray-100 text-gray-600" },
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

export default function VersionDiffClient({
  versions,
  products,
  certs,
}: {
  versions: Record<string, VersionData>;
  products: string[];
  certs: string[];
}) {
  const versionSlugs = Object.keys(versions);
  const [selectedVersion, setSelectedVersion] = useState(
    versionSlugs[versionSlugs.length - 1] || "zurich"
  );
  const [filterProduct, setFilterProduct] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterCert, setFilterCert] = useState<string>("");
  const [filterImpact, setFilterImpact] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(
    new Set()
  );

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
            return (
              e.title.toLowerCase().includes(q) ||
              e.summary.toLowerCase().includes(q)
            );
          }
          return true;
        }),
      }))
      .filter((p) => p.entries.length > 0);
  }, [version, filterProduct, filterType, filterImpact, filterCert, searchQuery]);

  const totalFiltered = filteredProducts.reduce(
    (sum, p) => sum + p.entries.length,
    0
  );

  const toggleProduct = (slug: string) => {
    setExpandedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedProducts(
      new Set(filteredProducts.map((p) => p.slug))
    );
  };

  const collapseAll = () => {
    setExpandedProducts(new Set());
  };

  // Type distribution for current view
  const typeDistribution = useMemo(() => {
    const counts = { new: 0, changed: 0, deprecated: 0, fixed: 0 };
    filteredProducts.forEach((p) =>
      p.entries.forEach((e) => counts[e.type]++)
    );
    return counts;
  }, [filteredProducts]);

  return (
    <div className="space-y-6">
      {/* Version Selector */}
      <div className="flex flex-wrap gap-2">
        {versionSlugs.map((slug) => {
          const v = versions[slug];
          return (
            <button
              key={slug}
              onClick={() => {
                setSelectedVersion(slug);
                setExpandedProducts(new Set());
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedVersion === slug
                  ? "bg-[var(--accent)] text-white shadow-md"
                  : "bg-[var(--card-bg)] text-[var(--text-secondary)] hover:bg-[var(--card-bg-hover)] border border-[var(--border)]"
              }`}
            >
              {v.name}
              <span className="ml-2 opacity-70">{v.totalEntries}</span>
            </button>
          );
        })}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(TYPE_CONFIG) as Array<keyof typeof TYPE_CONFIG>).map(
          (type) => (
            <button
              key={type}
              onClick={() =>
                setFilterType(filterType === type ? "" : type)
              }
              className={`p-3 rounded-lg border transition-all text-left ${
                filterType === type
                  ? "border-[var(--accent)] bg-[var(--accent-light)] shadow-sm"
                  : "border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--accent)]"
              }`}
            >
              <div className="text-lg">{TYPE_CONFIG[type].emoji}</div>
              <div className="text-xs text-[var(--text-secondary)]">
                {TYPE_CONFIG[type].label}
              </div>
              <div className="text-lg font-semibold text-[var(--text-primary)]">
                {typeDistribution[type]}
              </div>
            </button>
          )
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search features..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
        />
        <select
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
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
          className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
        >
          <option value="">All Certifications</option>
          {certs.map((cert) => (
            <option key={cert} value={cert}>
              {cert}
            </option>
          ))}
        </select>
        <select
          value={filterImpact}
          onChange={(e) => setFilterImpact(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
        >
          <option value="">All Impact</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">⚪ Low</option>
        </select>
      </div>

      {/* Active Filters + Result Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-secondary)]">
          Showing <span className="font-semibold text-[var(--text-primary)]">{totalFiltered}</span> changes across{" "}
          <span className="font-semibold text-[var(--text-primary)]">{filteredProducts.length}</span> products
          {(filterProduct || filterType || filterCert || filterImpact || searchQuery) && (
            <button
              onClick={() => {
                setFilterProduct("");
                setFilterType("");
                setFilterCert("");
                setFilterImpact("");
                setSearchQuery("");
              }}
              className="ml-3 text-xs text-[var(--accent)] hover:underline"
            >
              Clear filters
            </button>
          )}
        </p>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)]"
          >
            Expand all
          </button>
          <span className="text-xs text-[var(--text-secondary)]">|</span>
          <button
            onClick={collapseAll}
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)]"
          >
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
              className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card-bg)]"
            >
              <button
                onClick={() => toggleProduct(product.slug)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-[var(--card-bg-hover)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`transform transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  >
                    ▶
                  </span>
                  <span className="font-medium text-[var(--text-primary)]">
                    {product.name}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-light)] text-[var(--accent)]">
                    {product.entries.length}
                  </span>
                </div>
                <div className="flex gap-1">
                  {Object.entries(TYPE_CONFIG).map(([type, config]) => {
                    const count = product.entries.filter(
                      (e) => e.type === type
                    ).length;
                    if (!count) return null;
                    return (
                      <span
                        key={type}
                        className={`text-xs px-1.5 py-0.5 rounded ${config.color}`}
                      >
                        {config.emoji} {count}
                      </span>
                    );
                  })}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-[var(--border)]">
                  {product.entries.map((entry, i) => (
                    <div
                      key={i}
                      className={`px-5 py-4 ${
                        i > 0 ? "border-t border-[var(--border)]" : ""
                      } hover:bg-[var(--card-bg-hover)] transition-colors`}
                    >
                      <div className="flex flex-wrap items-start gap-2 mb-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            TYPE_CONFIG[entry.type].color
                          }`}
                        >
                          {TYPE_CONFIG[entry.type].emoji}{" "}
                          {TYPE_CONFIG[entry.type].label}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            IMPACT_CONFIG[entry.impact].color
                          }`}
                        >
                          {entry.impact} impact
                        </span>
                        {entry.certRelevance.map((cert) => (
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
                      <h3 className="font-medium text-[var(--text-primary)] mb-1">
                        {entry.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {entry.summary}
                      </p>
                      {entry.url && (
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[var(--accent)] hover:underline mt-2 inline-block"
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
        <div className="text-center py-12 text-[var(--text-secondary)]">
          <p className="text-lg mb-2">No changes found</p>
          <p className="text-sm">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}
