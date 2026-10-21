// Which pages Google may index. Used by page metadata (robots meta) and by
// app/sitemap.ts, so a noindexed page can never end up in the sitemap.
//
// Thin or templated sections are noindexed but stay live for users (SEO
// recovery plan, week 1, 2026-10-16). Noindexed pages keep "follow" so links
// through them still count.

import type { Metadata } from "next";

/** Compare pages that had search impressions and stay indexed. */
export const INDEXABLE_COMPARE_SLUGS = new Set([
  "csa-vs-cis-itsm",
  "csa-vs-cis-csm",
  "cis-itsm-vs-cis-csm",
]);

/** Topic practice pages (`/{cert}/practice-questions/{topic}`) that stay indexed. */
export const INDEXABLE_TOPIC_PAGES = new Set([
  "cad/ui-policies-actions",
  "cis-df/csdm-fundamentals",
  "csa/ui-navigation",
]);

/**
 * Delta pages (`/{cert}/delta/{release}`) that stay indexed, provided they show
 * at least one practice question (see isIndexableDeltaPage).
 */
export const INDEXABLE_DELTA_PAGES = new Set(["csa/zurich"]);

/** Human-readable list of the noindexed URL patterns, for docs and reports. */
export const NOINDEX_PATTERNS = [
  "/{cert}/mock-exam",
  "/{cert}/dumps",
  "/{cert}/practice-questions/{topic} (except cad/ui-policies-actions, cis-df/csdm-fundamentals, csa/ui-navigation)",
  "/{cert}/delta/{release} (except /csa/delta/zurich; always when it has no questions)",
  "/compare/{slug} (except csa-vs-cis-itsm, csa-vs-cis-csm, cis-itsm-vs-cis-csm)",
  "/salaries and /salaries/{segment}",
  "/vs and /vs/{competitor}",
  "/version-diff/{version}/{product}",
] as const;

// First path segments that are site sections, not certification slugs.
const SECTION_ROOTS = new Set([
  "blog",
  "certifications",
  "compare",
  "courses",
  "release",
  "salaries",
  "version-diff",
  "vs",
]);

/** Whether a site path (e.g. "/csa/mock-exam") may be indexed and listed in the sitemap. */
export function isIndexablePath(path: string): boolean {
  const parts = path.split(/[?#]/)[0].split("/").filter(Boolean);
  const [first, second, third, fourth] = parts;

  if (first === "salaries" || first === "vs") return false;
  if (first === "compare") return !second || INDEXABLE_COMPARE_SLUGS.has(second);
  if (first === "version-diff") return parts.length <= 2;
  if (!first || SECTION_ROOTS.has(first)) return true;

  // /{cert}/...
  if (second === "mock-exam" || second === "dumps") return false;
  if (second === "practice-questions" && third && !fourth) {
    return INDEXABLE_TOPIC_PAGES.has(`${first}/${third}`);
  }
  if (second === "delta" && third) return INDEXABLE_DELTA_PAGES.has(`${first}/${third}`);
  return true;
}

/**
 * Whether a delta page may be indexed: it must be allowlisted (isIndexablePath)
 * and actually render practice questions. A delta page with no questions yet
 * (e.g. a newly announced release) is a placeholder and stays noindexed.
 */
export function isIndexableDeltaPage(cert: string, release: string, questionCount: number): boolean {
  return questionCount > 0 && isIndexablePath(`/${cert}/delta/${release}`);
}

const INDEX_FOLLOW: Metadata["robots"] = { index: true, follow: true };
const NOINDEX_FOLLOW: Metadata["robots"] = { index: false, follow: true };

/**
 * robots metadata for a page: "noindex, follow" when the path is not
 * indexable, otherwise "index, follow". Always explicit: setting robots to
 * undefined in page metadata drops the layout default instead of inheriting it.
 */
export function robotsForPath(path: string): Metadata["robots"] {
  return isIndexablePath(path) ? INDEX_FOLLOW : NOINDEX_FOLLOW;
}

/** robots metadata for a delta page; see isIndexableDeltaPage. */
export function robotsForDeltaPage(cert: string, release: string, questionCount: number): Metadata["robots"] {
  return isIndexableDeltaPage(cert, release, questionCount) ? INDEX_FOLLOW : NOINDEX_FOLLOW;
}
