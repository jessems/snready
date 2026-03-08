import { Metadata } from "next";

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
  return children;
}
