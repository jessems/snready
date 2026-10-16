// The person behind SNReady, shown in bylines, on /about, and as the
// schema.org `author` of hubs, blog posts and courses.
//
// Only facts Jesse has confirmed belong here: name, role, country, and that
// Jesse has taken ServiceNow certification exams.
// TODO(Jesse): list exact ServiceNow certifications + Credly/LinkedIn links

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://snready.com";

export const AUTHOR = {
  name: "Jesse Szepieniec",
  jobTitle: "ServiceNow consultant",
  countryCode: "CH",
  countryName: "Switzerland",
  path: "/about",
} as const;

/** schema.org Person for JSON-LD `author` fields. */
export function authorJsonLd() {
  return {
    "@type": "Person",
    name: AUTHOR.name,
    jobTitle: AUTHOR.jobTitle,
    address: {
      "@type": "PostalAddress",
      addressCountry: AUTHOR.countryCode,
    },
    url: `${BASE_URL}${AUTHOR.path}`,
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
