// Which pages Google may index. Used by page metadata (robots meta) and by
// app/sitemap.ts, so a noindexed page can never end up in the sitemap.
//
// Thin or templated sections are noindexed but stay live for users (SEO
// recovery plan, week 1, 2026-10-16). Noindexed pages keep "follow" so links
// through them still count.

import type { Metadata } from "next";

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
export const INDEXABLE_DELTA_PAGES = new Set([
  "csa/brazil",
  "cad/brazil",
  "cis-df/brazil",
  "cis-itsm/brazil",
]);

/** Human-readable list of the noindexed URL patterns, for docs and reports. */
export const NOINDEX_PATTERNS = [
  "/{cert} when the cert has no questions yet (e.g. cta)",
  "/{cert}/practice-questions (canonicalises to the /{cert} hub; see lib/hubs.ts)",
  "/{cert}/mock-exam",
  "/{cert}/practice-questions/{topic} (except cad/ui-policies-actions, cis-df/csdm-fundamentals, csa/ui-navigation)",
  "/{cert}/delta/{release} (except csa, cad, cis-df and cis-itsm brazil; always when it has no questions)",
  "/salaries and /salaries/{segment}",
  "/version-diff/{version}/{product}",
] as const;

// First path segments that are site sections, not certification slugs.
const SECTION_ROOTS = new Set([
  "blog",
  "certifications",
  "compare",
  "courses",
  "salaries",
  "version-diff",
  "vs",
]);

/** Whether a site path (e.g. "/csa/mock-exam") may be indexed and listed in the sitemap. */
export function isIndexablePath(path: string): boolean {
  const parts = path.split(/[?#]/)[0].split("/").filter(Boolean);
  const [first, second, third, fourth] = parts;

  // /compare and /vs 301 elsewhere (lib/hubs.ts); salaries have no sourced data in the HTML.
  if (first === "salaries" || first === "vs" || first === "compare") return false;
  if (first === "version-diff") return parts.length <= 2;
  if (!first || SECTION_ROOTS.has(first)) return true;

  // /{cert}/...
  if (second === "mock-exam") return false;
  // The /{cert} hub is canonical; the full question list is a noindexed duplicate.
  if (second === "practice-questions" && !third) return false;
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

/** Cert pages that only make sense once the cert has practice questions. */
const CERT_CONTENT_PAGES = new Set(["", "practice-questions"]);

/**
 * Whether a cert page (`/{cert}` or `/{cert}/practice-questions`) may be
 * indexed. A cert with no questions yet (e.g. cta) is a "coming soon"
 * placeholder and stays noindexed until questions ship.
 * `page` is the path below the cert slug ("" for the landing page).
 */
export function isIndexableCertPage(cert: string, page: string, questionCount: number): boolean {
  if (questionCount === 0 && CERT_CONTENT_PAGES.has(page)) return false;
  return isIndexablePath(page ? `/${cert}/${page}` : `/${cert}`);
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

/** robots metadata for a cert page; see isIndexableCertPage. */
export function robotsForCertPage(cert: string, page: string, questionCount: number): Metadata["robots"] {
  return isIndexableCertPage(cert, page, questionCount) ? INDEX_FOLLOW : NOINDEX_FOLLOW;
}
