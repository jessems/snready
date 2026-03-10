import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exam Readiness Checker | Are You Ready for Your ServiceNow Exam? | SNReady",
  description:
    "Free readiness assessment for ServiceNow certifications. Get your personalized score breakdown by domain and see exactly where to focus your study time. Works for CSA, CAD, CIS-ITSM, CIS-Discovery, and 16 more certifications.",
  keywords: [
    "servicenow exam readiness",
    "servicenow practice test",
    "servicenow csa practice",
    "servicenow certification practice",
    "am i ready for servicenow exam",
    "servicenow exam preparation",
    "servicenow certification check",
    "servicenow study assessment",
    "csa exam readiness",
    "cad exam practice",
  ],
  openGraph: {
    title: "ServiceNow Exam Readiness Checker | SNReady",
    description:
      "Free quick assessment to check if you're ready for your ServiceNow certification exam. Get domain-by-domain score breakdown.",
    type: "website",
    url: "https://snready.com/readiness",
  },
  alternates: {
    canonical: "https://snready.com/readiness",
  },
};

export default function ReadinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
