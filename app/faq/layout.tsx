import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - ServiceNow Certification Questions Answered | SNReady",
  description:
    "Get answers to common questions about ServiceNow certification exams, SNReady practice tests, pricing, exam preparation strategies, and more. 30+ FAQs answered.",
  keywords: [
    "servicenow certification faq",
    "snready questions",
    "servicenow exam preparation",
    "servicenow practice test",
    "servicenow certification cost",
    "servicenow passing score",
    "servicenow exam tips",
    "csa certification questions",
    "servicenow training",
  ],
  openGraph: {
    title: "FAQ - ServiceNow Certification Questions Answered",
    description:
      "Everything you need to know about ServiceNow certifications and SNReady practice tests. 30+ commonly asked questions answered.",
    type: "website",
    url: "https://snready.com/faq",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ - ServiceNow Certification Questions Answered",
    description:
      "Everything you need to know about ServiceNow certifications and SNReady practice tests.",
  },
  alternates: {
    canonical: "https://snready.com/faq",
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
