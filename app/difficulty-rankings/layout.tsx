import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ServiceNow Certification Difficulty Rankings 2026 | Easiest to Hardest | SNReady",
  description:
    "Compare all 20 ServiceNow certifications ranked by difficulty, study time, and pass rates. Find which certification is easiest for beginners and which are the most challenging.",
  keywords: [
    "servicenow certification difficulty",
    "easiest servicenow certification",
    "hardest servicenow certification",
    "servicenow certification ranking",
    "servicenow csa difficulty",
    "servicenow certification pass rate",
    "servicenow certification comparison",
    "which servicenow certification is easiest",
    "servicenow certification study time",
    "servicenow exam difficulty",
  ],
  openGraph: {
    title: "ServiceNow Certification Difficulty Rankings 2026",
    description:
      "Compare all 20 ServiceNow certifications ranked from easiest to hardest. Includes study time estimates and pass rates.",
    type: "website",
    url: "https://snready.com/difficulty-rankings",
  },
  alternates: {
    canonical: "https://snready.com/difficulty-rankings",
  },
};

export default function DifficultyRankingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
