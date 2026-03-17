import summaryData from "@/data/release-notes/summary.json";

export interface ReleaseEntry {
  title: string;
  type: "new" | "changed" | "deprecated" | "fixed";
  impact: "high" | "medium" | "low";
  summary: string;
  url: string | null;
  certRelevance: string[];
}

export interface ProductArea {
  name: string;
  slug: string;
  entryCount: number;
  entries: ReleaseEntry[];
}

export interface VersionData {
  name: string;
  slug: string;
  fromVersion: string | null;
  totalEntries: number;
  products: ProductArea[];
}

export interface ReleaseSummary {
  versions: Record<string, VersionData>;
  products: string[];
  generatedAt: string;
}

const data = summaryData as unknown as ReleaseSummary;

export function getReleaseSummary(): ReleaseSummary {
  return data;
}

export function getVersions(): string[] {
  return Object.keys(data.versions);
}

export function getVersionData(slug: string): VersionData | null {
  return data.versions[slug] || null;
}

export function getAllProducts(): string[] {
  return data.products;
}

// Get entries for a specific version, optionally filtered
export function getFilteredEntries(
  versionSlug: string,
  options?: {
    product?: string;
    type?: string;
    impact?: string;
    cert?: string;
    search?: string;
  }
): { product: string; entries: ReleaseEntry[] }[] {
  const version = data.versions[versionSlug];
  if (!version) return [];

  return version.products
    .filter((p) => !options?.product || p.slug === options.product)
    .map((p) => ({
      product: p.name,
      entries: p.entries.filter((e) => {
        if (options?.type && e.type !== options.type) return false;
        if (options?.impact && e.impact !== options.impact) return false;
        if (options?.cert && !e.certRelevance.includes(options.cert))
          return false;
        if (options?.search) {
          const q = options.search.toLowerCase();
          return (
            e.title.toLowerCase().includes(q) ||
            e.summary.toLowerCase().includes(q)
          );
        }
        return true;
      }),
    }))
    .filter((p) => p.entries.length > 0);
}

// Compare two versions - find products in common and their differences
export function compareVersions(
  fromSlug: string,
  toSlug: string
): {
  onlyInFrom: string[];
  onlyInTo: string[];
  inBoth: string[];
  fromVersion: VersionData | null;
  toVersion: VersionData | null;
} {
  const from = data.versions[fromSlug];
  const to = data.versions[toSlug];

  if (!from || !to) {
    return {
      onlyInFrom: [],
      onlyInTo: [],
      inBoth: [],
      fromVersion: from || null,
      toVersion: to || null,
    };
  }

  const fromProducts = new Set(from.products.map((p) => p.name));
  const toProducts = new Set(to.products.map((p) => p.name));

  return {
    onlyInFrom: [...fromProducts].filter((p) => !toProducts.has(p)),
    onlyInTo: [...toProducts].filter((p) => !fromProducts.has(p)),
    inBoth: [...fromProducts].filter((p) => toProducts.has(p)),
    fromVersion: from,
    toVersion: to,
  };
}
