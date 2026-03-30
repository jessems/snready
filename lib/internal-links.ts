/**
 * Internal linking map: connects certifications to blog posts, tools, and resources.
 * This powers the "Related Resources" sections on cert pages and blog posts.
 */

// Map certification slugs to related blog post slugs
export const certToBlogPosts: Record<string, string[]> = {
  csa: [
    "how-to-pass-servicenow-csa-first-time",
    "csa-exam-reddit-tips-that-actually-work",
    "servicenow-csa-exam-what-they-dont-tell-you",
    "csa-vs-cad-real-talk",
    "why-servicenow-brain-dumps-will-fail-you",
    "servicenow-certification-worth-it-2026",
    "servicenow-practice-test-comparison-2026",
    "free-servicenow-practice-questions-2026",
  ],
  cad: [
    "servicenow-cad-exam-complete-guide-2026",
    "csa-vs-cad-real-talk",
    "why-servicenow-brain-dumps-will-fail-you",
    "servicenow-certification-worth-it-2026",
    "free-servicenow-practice-questions-2026",
  ],
  "cis-itsm": [
    "cis-itsm-implementation-exam-reality",
    "servicenow-certification-worth-it-2026",
    "why-servicenow-brain-dumps-will-fail-you",
    "free-servicenow-practice-questions-2026",
  ],
  "cis-discovery": [
    "servicenow-cis-discovery-exam-guide-2026",
    "servicenow-certification-worth-it-2026",
    "free-servicenow-practice-questions-2026",
  ],
  "cis-csm": [
    "servicenow-cis-csm-exam-guide-2026",
    "servicenow-certification-worth-it-2026",
    "free-servicenow-practice-questions-2026",
  ],
  "cis-hr": [
    "servicenow-cis-hr-exam-guide-2026",
    "servicenow-certification-worth-it-2026",
    "free-servicenow-practice-questions-2026",
  ],
  "cis-df": [
    "servicenow-certification-worth-it-2026",
    "why-servicenow-brain-dumps-will-fail-you",
    "free-servicenow-practice-questions-2026",
  ],
};

// Reverse map: blog post slug → related certification slugs
export function getBlogRelatedCerts(blogSlug: string): string[] {
  const certs: string[] = [];
  for (const [cert, posts] of Object.entries(certToBlogPosts)) {
    if (posts.includes(blogSlug)) {
      certs.push(cert);
    }
  }
  return certs;
}

// Get blog posts related to a certification
export function getCertRelatedBlogPosts(certSlug: string): string[] {
  return certToBlogPosts[certSlug] ?? [];
}

// Related tools/pages for every certification
export interface RelatedTool {
  title: string;
  description: string;
  href: string;
  icon: "quiz" | "plan" | "salary" | "paths" | "compare" | "blog" | "mock";
}

export function getCertRelatedTools(certSlug: string): RelatedTool[] {
  const tools: RelatedTool[] = [
    {
      title: "Take a Mock Exam",
      description: "Timed exam simulation with pass/fail scoring",
      href: `/${certSlug}/mock-exam`,
      icon: "mock",
    },
    {
      title: "Create a Study Plan",
      description: "Personalized week-by-week schedule",
      href: `/study-plan?cert=${certSlug}`,
      icon: "plan",
    },
    {
      title: "Which Cert Is Right for You?",
      description: "Take our 2-minute quiz",
      href: "/quiz",
      icon: "quiz",
    },
    {
      title: "Career Paths",
      description: "See where this cert fits in your career",
      href: "/certification-paths",
      icon: "paths",
    },
    {
      title: "ServiceNow Salaries",
      description: "What certified professionals actually earn",
      href: "/salaries",
      icon: "salary",
    },
  ];

  return tools;
}
