import { Metadata } from "next";
import Script from "next/script";

// FAQ Schema for rich snippets
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does a ServiceNow developer make?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ServiceNow developers earn an average of $105,000/year in the US, with a range from $80,000 to $140,000+ depending on experience and location. Certified developers (CAD) typically earn 10-15% more than non-certified peers.",
      },
    },
    {
      "@type": "Question",
      name: "Do ServiceNow certifications increase salary?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, significantly. On average, certified ServiceNow professionals earn 10-20% more than their non-certified counterparts. The CSA certification alone can add $8,000-$12,000 to your annual salary, while specialized certifications (CIS, CAD) can add even more.",
      },
    },
    {
      "@type": "Question",
      name: "Which ServiceNow certification pays the most?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Certified Master Architect (CMA) and Certified Technical Architect (CTA) certifications command the highest premiums, often adding $20,000-$25,000+ to base salary. For implementation specialists, CIS-Service Mapping and CIS-Discovery are among the highest-paying due to their complexity.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is this salary calculator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This calculator uses aggregated data from job postings, salary surveys, and industry reports (Glassdoor, LinkedIn, Indeed, 2024-2025). Actual salaries vary based on company size, industry, specific skills, negotiation, and market conditions. Use these figures as a general guide, not a guarantee.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "ServiceNow Salary Calculator 2025 | What's Your Earning Potential?",
  description:
    "Calculate your ServiceNow salary based on role, experience, location, and certifications. See how much ServiceNow administrators, developers, and architects earn in 2025.",
  keywords: [
    "servicenow salary",
    "servicenow developer salary",
    "servicenow admin salary",
    "servicenow consultant salary",
    "servicenow architect salary",
    "servicenow certification salary increase",
    "servicenow developer pay",
    "servicenow administrator pay",
    "servicenow salary calculator",
    "how much do servicenow developers make",
  ],
  openGraph: {
    title: "ServiceNow Salary Calculator 2025 | What's Your Earning Potential?",
    description:
      "Calculate your ServiceNow salary based on role, experience, location, and certifications. See how certifications boost your earning potential.",
    url: "https://snready.com/salary-calculator",
    type: "website",
    images: [
      {
        url: "/og-salary-calculator.png",
        width: 1200,
        height: 630,
        alt: "ServiceNow Salary Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ServiceNow Salary Calculator 2025",
    description: "Calculate your ServiceNow salary based on role, experience, location, and certifications.",
  },
  alternates: {
    canonical: "https://snready.com/salary-calculator",
  },
};

export default function SalaryCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      {children}
    </>
  );
}
