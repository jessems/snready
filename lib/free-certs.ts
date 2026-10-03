// Certifications that are completely free: every practice question, topic page,
// delta page and timed mock exam is public, with no login and nothing for sale.
//
// Shared by the Next.js static build (lib/data.ts, pages, components) and the
// Cloudflare Pages Functions (functions/api/questions.ts, functions/api/checkout.ts),
// so keep this file dependency-free and use relative imports only.
//
// To make another certification free (or to put CSA back on sale), edit this list.
// Existing buyers' access records are never touched; their purchase simply keeps
// working alongside the free access.

export const FREE_CERTIFICATIONS: readonly string[] = ["csa"];

/** True when every question for this certification is free. Case-insensitive ("CSA" or "csa"). */
export function isFreeCertification(certification: string | null | undefined): boolean {
  if (!certification) return false;
  const slug = certification.trim().toLowerCase();
  return FREE_CERTIFICATIONS.includes(slug);
}

/** Display names of the free certifications, e.g. ["CSA"]. */
export function freeCertificationLabels(): string[] {
  return FREE_CERTIFICATIONS.map((slug) => slug.toUpperCase());
}
