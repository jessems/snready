// Comparison utilities for certification vs certification pages

export interface ComparisonPair {
  cert1: string;
  cert2: string;
  reason: string;
}

/**
 * Meaningful comparison pairs for SEO
 * These are hand-curated pairs that users commonly search for
 */
export const comparisonPairs: ComparisonPair[] = [
  // Career progression paths
  { cert1: "csa", cert2: "cad", reason: "Career progression - admin to developer" },
  { cert1: "cad", cert2: "cta", reason: "Career progression - developer to architect" },
  { cert1: "csa", cert2: "cta", reason: "Career progression - admin to architect" },

  // Foundation comparisons
  { cert1: "csa", cert2: "cpoa", reason: "Foundation level comparison" },

  // Popular entry point decisions
  { cert1: "csa", cert2: "cis-itsm", reason: "Admin vs ITSM specialist" },
  { cert1: "csa", cert2: "cis-csm", reason: "Admin vs Customer Service" },
  { cert1: "cad", cert2: "cis-itsm", reason: "Developer vs ITSM specialist" },

  // ITOM suite comparisons
  { cert1: "cis-discovery", cert2: "cis-sm", reason: "ITOM Discovery vs Service Mapping" },
  { cert1: "cis-em", cert2: "cis-cpg", reason: "ITOM Event Management vs Cloud Provisioning" },
  { cert1: "cis-discovery", cert2: "cis-em", reason: "ITOM Discovery vs Event Management" },
  { cert1: "cis-sm", cert2: "cis-em", reason: "ITOM Service Mapping vs Event Management" },

  // SecOps comparisons
  { cert1: "cis-vr", cert2: "cis-sir", reason: "SecOps VR vs SIR" },

  // GRC suite comparisons
  { cert1: "cis-rci", cert2: "cis-vrm", reason: "GRC Risk Compliance vs Vendor Risk" },
  { cert1: "cis-rci", cert2: "cis-tprm", reason: "GRC Risk Compliance vs Third Party Risk" },
  { cert1: "cis-vrm", cert2: "cis-tprm", reason: "GRC Vendor Risk vs Third Party Risk" },

  // ITAM comparisons
  { cert1: "cis-sam", cert2: "cis-ham", reason: "ITAM Software vs Hardware Asset" },

  // SPM suite comparisons
  { cert1: "cis-spm", cert2: "cis-ppm", reason: "SPM Strategic vs Project Portfolio" },
  { cert1: "cis-spm", cert2: "cis-apm", reason: "SPM Strategic vs Application Portfolio" },
  { cert1: "cis-ppm", cert2: "cis-apm", reason: "SPM Project vs Application Portfolio" },

  // Customer Service comparisons
  { cert1: "cis-csm", cert2: "cis-fsm", reason: "Customer Service vs Field Service" },

  // Cross-category popular comparisons
  { cert1: "cis-itsm", cert2: "cis-csm", reason: "ITSM vs Customer Service" },
  { cert1: "cis-itsm", cert2: "cis-hr", reason: "ITSM vs HR Service Delivery" },
  { cert1: "cis-csm", cert2: "cis-hr", reason: "Customer Service vs HR" },

  // Developer vs Specialist
  { cert1: "cad", cert2: "cas-pa", reason: "Developer vs Process Automation Specialist" },

  // Platform strategy comparisons
  { cert1: "cpoa", cert2: "cis-itsm", reason: "Platform Owner vs ITSM Implementer" },
  { cert1: "cpoa", cert2: "cad", reason: "Platform Owner vs Developer" },
];

/**
 * Get all comparison slugs for static generation
 */
export function getAllComparisonSlugs(): string[] {
  return comparisonPairs.map((pair) => `${pair.cert1}-vs-${pair.cert2}`);
}

/**
 * Parse a comparison slug into cert slugs
 */
export function parseComparisonSlug(slug: string): { cert1: string; cert2: string } | null {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return null;
  return { cert1: parts[0], cert2: parts[1] };
}

/**
 * Get comparison pair data by slug
 */
export function getComparisonBySlug(slug: string): ComparisonPair | undefined {
  const parsed = parseComparisonSlug(slug);
  if (!parsed) return undefined;

  return comparisonPairs.find(
    (pair) =>
      (pair.cert1 === parsed.cert1 && pair.cert2 === parsed.cert2) ||
      (pair.cert1 === parsed.cert2 && pair.cert2 === parsed.cert1)
  );
}

/**
 * Generate comparison recommendation text
 */
export function getComparisonRecommendation(
  cert1Level: string,
  cert2Level: string,
  cert1Name: string,
  cert2Name: string
): string {
  if (cert1Level === "entry" && cert2Level !== "entry") {
    return `Start with ${cert1Name} if you're new to ServiceNow. It provides the foundational knowledge needed before pursuing ${cert2Name}.`;
  }
  if (cert2Level === "entry" && cert1Level !== "entry") {
    return `Start with ${cert2Name} if you're new to ServiceNow. It provides the foundational knowledge needed before pursuing ${cert1Name}.`;
  }
  if (cert1Level === "expert" || cert2Level === "expert") {
    return `Both certifications are advanced. Consider your career goals and current role to determine which aligns better with your professional development path.`;
  }
  return `Both certifications are at a similar level. Choose based on your job responsibilities, career goals, and the specific ServiceNow modules you work with most frequently.`;
}
