// Shared by /privacy, /terms and /refunds. Update LEGAL_UPDATED_ISO whenever
// the wording of any of the three pages changes.
export const LEGAL_UPDATED_ISO = "2026-11-02";
export const LEGAL_UPDATED_LABEL = "2 November 2026";
export const SUPPORT_EMAIL = "support@snready.com";

export const LEGAL_PAGES = [
  { href: "/privacy", label: "Privacy", title: "Privacy policy" },
  { href: "/terms", label: "Terms", title: "Terms of service" },
  { href: "/refunds", label: "Refunds", title: "Refund policy" },
] as const;
