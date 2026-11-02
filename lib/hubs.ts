// One canonical hub per certification (hub consolidation, 2026-11).
//
// The hub is the cert landing page, /{cert}. Search Console showed it earning
// far more clicks than /{cert}/practice-questions (e.g. /csa 49 vs 5, /cis-df
// 159, /cad 61, /cpoa 92 over 16 months), and a placeholder redirect into it
// (/:cert/prepare -> /:cert) is safe, whereas redirecting /:cert would also catch
// /pricing, /blog and every other one-segment path.
//
// Pages consolidated into the hub:
// - /{cert}/prepare: official blueprint, courses and docs moved into the hub;
//   the route is gone and public/_redirects 301s it to /{cert}.
// - /{cert}/practice-questions: stays live for visitors and paid-search
//   landings, but is noindexed and canonicalises to /{cert}.
// - Blog posts that targeted "{cert} practice test": 301 to the hub (below).
//
// Section pages without sourced data were retired the same way: /compare/*
// (templated from two certification records) and /vs/* (unsourced competitor
// claims) 301 to the pages below. Every redirect here must have a matching
// rule in public/_redirects; tests/unit/hubs.test.ts checks this.

/** Path of a certification's canonical hub. */
export function certHubPath(certSlug: string): string {
  return `/${certSlug}`;
}

/** Anchor of the practice-question list on the hub. */
export const HUB_QUESTIONS_ANCHOR = "practice-questions";

/** Blog posts that duplicated a hub's intent, mapped to the hub they 301 to. */
export const REDIRECTED_BLOG_POSTS: Record<string, string> = {
  "servicenow-csa-practice-test-200-questions-2026": "/csa",
  "servicenow-cad-practice-test-200-questions-2026": "/cad",
  "servicenow-cis-itsm-practice-test-160-questions-2026": "/cis-itsm",
};

/** Retired sections and the page they 301 to. */
export const RETIRED_SECTION_TARGETS = {
  compare: "/certification-paths",
  vs: "/how-questions-are-made",
} as const;

// First path segments that are site sections, not certification slugs.
const NON_CERT_ROOTS = new Set([
  "about", "account", "admin", "api", "auth", "blog", "certification-paths",
  "certifications", "checkout", "courses", "exam-blueprints", "feedback",
  "how-questions-are-made", "practice-questions", "pricing", "quiz", "resources",
  "salaries", "study-plan", "version-diff",
]);

/**
 * The URL an internal link should use: consolidated pages map to the page
 * that replaced them, so links never point at a redirect or at a noindexed
 * duplicate of a hub. Query strings and fragments are kept. Other paths are
 * returned unchanged.
 */
export function canonicalInternalHref(href: string): string {
  const match = href.match(/^(\/[^?#]*)(.*)$/);
  if (!match) return href;
  const [, path, suffix] = match;
  const parts = path.split("/").filter(Boolean);
  const [first, second, third] = parts;

  if (first === "compare") return RETIRED_SECTION_TARGETS.compare + suffix;
  if (first === "vs") return RETIRED_SECTION_TARGETS.vs + suffix;
  if (first === "blog" && second && !third && REDIRECTED_BLOG_POSTS[second]) {
    return REDIRECTED_BLOG_POSTS[second] + suffix;
  }
  if (first && !NON_CERT_ROOTS.has(first) && parts.length === 2) {
    if (second === "prepare") return certHubPath(first) + (suffix.startsWith("#") ? "" : suffix);
    if (second === "practice-questions") {
      return certHubPath(first) + (suffix || `#${HUB_QUESTIONS_ANCHOR}`);
    }
  }
  return href;
}
