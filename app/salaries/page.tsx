import { Metadata } from "next";
import SalariesClient from "./SalariesClient";

export const metadata: Metadata = {
  title: "ServiceNow Salaries 2026 | Real Compensation Data",
  description:
    "See what ServiceNow professionals really make. Anonymous salary data from 800+ admins, developers, architects, and consultants. Submit yours to unlock full insights.",
  keywords: [
    "servicenow salary",
    "servicenow developer salary",
    "servicenow admin salary",
    "servicenow consultant rate",
    "servicenow architect salary",
    "servicenow compensation",
  ],
  openGraph: {
    title: "ServiceNow Salaries 2026 | Real Compensation Data",
    description:
      "See what ServiceNow professionals really make. 800+ anonymous submissions.",
    url: "https://snready.com/salaries",
    type: "website",
  },
};

export default function SalariesPage() {
  return <SalariesClient />;
}
