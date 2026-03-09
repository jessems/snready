// ServiceNow Salaries - Type Definitions

export const ROLES = [
  "Administrator",
  "Developer",
  "Architect",
  "Consultant",
  "Manager",
  "Business Analyst",
  "Project Manager",
  "Technical Lead",
  "Other",
] as const;

export const SPECIALIZATIONS = [
  "ITSM",
  "ITOM",
  "CMDB/CSDM",
  "CSM",
  "HRSD",
  "SecOps",
  "GRC/IRM",
  "Custom Apps",
  "Integration",
  "Platform",
  "Other",
] as const;

export const EMPLOYMENT_TYPES = [
  "Full-time Employee",
  "Contractor (W2)",
  "Independent (1099)",
  "Freelance",
] as const;

export const COMPANY_TYPES = [
  "ServiceNow (the company)",
  "Partner/Consultancy",
  "End-user/Customer",
] as const;

export const CERTIFICATIONS = [
  "CSA",
  "CAD",
  "CIS-ITSM",
  "CIS-DF",
  "CIS-Discovery",
  "CIS-CSM",
  "CIS-HR",
  "CIS-SAM",
  "CIS-HAM",
  "CIS-PA",
  "CIS-SM",
  "CIS-EM",
  "CIS-VR",
  "CIS-SIR",
  "CIS-FSM",
  "CIS-RC",
  "CIS-SP",
  "CIS-SPM",
  "CIS-TPRM",
  "CPOA",
  "CTA",
  "None",
] as const;

export const EXPERIENCE_RANGES = [
  "< 1 year",
  "1-2 years",
  "3-5 years",
  "6-10 years",
  "10+ years",
] as const;

export const COMPANY_SIZES = [
  "1-50",
  "51-200",
  "201-1,000",
  "1,001-5,000",
  "5,000+",
] as const;

export const REMOTE_OPTIONS = [
  { value: 0, label: "Fully On-site" },
  { value: 25, label: "Mostly On-site (25% remote)" },
  { value: 50, label: "Hybrid (50% remote)" },
  { value: 75, label: "Mostly Remote (75% remote)" },
  { value: 100, label: "Fully Remote" },
] as const;

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
] as const;

export interface SalarySubmission {
  id?: string;
  createdAt?: string;

  // Role
  role: (typeof ROLES)[number];
  specializations: (typeof SPECIALIZATIONS)[number][];
  employmentType: (typeof EMPLOYMENT_TYPES)[number];
  companyType: (typeof COMPANY_TYPES)[number];

  // Compensation
  baseSalary?: number;
  bonus?: number;
  signingBonus?: number;
  equity?: number;
  hourlyRate?: number;
  currency: string;

  // Background
  certifications: string[];
  yoeServiceNow: (typeof EXPERIENCE_RANGES)[number];
  yoeTotal: (typeof EXPERIENCE_RANGES)[number];
  education?: string;

  // Location
  country: string;
  city?: string;
  remotePct: number;

  // Company
  companyName?: string;
  companySize?: (typeof COMPANY_SIZES)[number];

  // Verification
  linkedinUrl?: string;
  workEmail?: string;
  verified?: boolean;
}

export interface SalaryStats {
  count: number;
  median: number;
  p25: number;
  p75: number;
  min: number;
  max: number;
}

export interface SalaryFilter {
  role?: string;
  country?: string;
  city?: string;
  certification?: string;
  employmentType?: string;
  companyType?: string;
  yoeServiceNow?: string;
}

export interface PercentileResult {
  percentile: number;
  yourSalary: number;
  median: number;
  p25: number;
  p75: number;
  sampleSize: number;
  comparisonGroup: string;
}
