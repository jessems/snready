import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ServiceNow Study Plan Generator | Free Week-by-Week Schedule | SNReady",
  description:
    "Create a personalized ServiceNow certification study plan. Get a week-by-week schedule for CSA, CAD, CIS-DF, CIS-ITSM, and 15+ certifications based on your timeline and availability.",
  keywords: [
    "servicenow study plan",
    "servicenow csa study schedule",
    "servicenow certification study guide",
    "servicenow exam preparation",
    "csa study plan",
    "cad study schedule",
    "servicenow exam timeline",
    "how long to study for servicenow certification",
  ],
  openGraph: {
    title: "ServiceNow Study Plan Generator | SNReady",
    description:
      "Create a personalized week-by-week study schedule for any ServiceNow certification. Free tool from SNReady.",
    url: "https://snready.com/study-plan",
    siteName: "SNReady",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ServiceNow Study Plan Generator",
    description:
      "Create a personalized week-by-week study schedule for any ServiceNow certification.",
  },
  alternates: {
    canonical: "https://snready.com/study-plan",
  },
};

export default function StudyPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
