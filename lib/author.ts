// SNReady is published as an organization, not a person. This is the byline
// shown on hubs, blog posts and courses, and the schema.org `author` of them.

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://snready.com";

export const SNREADY_TEAM = {
  name: "SNReady",
  bylineName: "the SNReady team",
  path: "/about",
} as const;

/** schema.org Organization for JSON-LD `author` fields. */
export function authorJsonLd() {
  return {
    "@type": "Organization",
    name: SNREADY_TEAM.name,
    url: `${BASE_URL}${SNREADY_TEAM.path}`,
  };
}

/** Format an ISO date (YYYY-MM-DD) as e.g. "16 October 2026". */
export function formatReviewDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
