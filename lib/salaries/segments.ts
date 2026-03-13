// Salary segment definitions for SEO subpages

export type SegmentType = 'role' | 'country';

export interface SalarySegment {
  slug: string;
  type: SegmentType;
  value: string; // Database value
  displayName: string;
  title: string;
  description: string;
  keywords: string[];
}

// Role-based segments
export const ROLE_SEGMENTS: SalarySegment[] = [
  {
    slug: 'developer',
    type: 'role',
    value: 'Developer',
    displayName: 'ServiceNow Developer',
    title: 'ServiceNow Developer Salary 2026 | Real Compensation Data',
    description: 'What do ServiceNow developers really make? See real salary data from 60+ developers. Median base: $121K. Compare by experience, location, and certifications.',
    keywords: ['servicenow developer salary', 'servicenow developer pay', 'servicenow developer compensation', 'snow developer salary'],
  },
  {
    slug: 'architect',
    type: 'role',
    value: 'Architect',
    displayName: 'ServiceNow Architect',
    title: 'ServiceNow Architect Salary 2026 | Senior-Level Compensation',
    description: 'ServiceNow architects command top salaries. See real data from 20+ architects. Median: $177K. CTA certification impact, experience progression, and more.',
    keywords: ['servicenow architect salary', 'servicenow solution architect pay', 'servicenow technical architect salary', 'cta salary'],
  },
  {
    slug: 'administrator',
    type: 'role',
    value: 'Administrator',
    displayName: 'ServiceNow Administrator',
    title: 'ServiceNow Admin Salary 2026 | Entry to Senior Compensation',
    description: 'ServiceNow admin salaries from entry-level to senior. Real data from certified admins. Median: $76K. CSA certification impact and career progression.',
    keywords: ['servicenow admin salary', 'servicenow administrator salary', 'servicenow system admin pay', 'csa salary'],
  },
  {
    slug: 'consultant',
    type: 'role',
    value: 'Consultant',
    displayName: 'ServiceNow Consultant',
    title: 'ServiceNow Consultant Salary & Rates 2026 | Partner vs Client-Side',
    description: 'ServiceNow consultant compensation: W2 salaries and contractor rates. Partner vs end-user pay differences. Median: $155K for full-time consultants.',
    keywords: ['servicenow consultant salary', 'servicenow consultant rate', 'servicenow consulting pay', 'servicenow partner salary'],
  },
  {
    slug: 'manager',
    type: 'role',
    value: 'Manager',
    displayName: 'ServiceNow Manager',
    title: 'ServiceNow Manager Salary 2026 | Platform & Delivery Management',
    description: 'ServiceNow manager compensation for platform owners, delivery leads, and practice managers. Real salary data from ServiceNow management roles.',
    keywords: ['servicenow manager salary', 'servicenow platform owner salary', 'servicenow delivery manager pay', 'servicenow practice lead salary'],
  },
];

// Country-based segments
export const COUNTRY_SEGMENTS: SalarySegment[] = [
  {
    slug: 'usa',
    type: 'country',
    value: 'US',
    displayName: 'United States',
    title: 'ServiceNow Salaries in USA 2026 | State-by-State Compensation',
    description: 'ServiceNow salaries in the United States. 70+ data points across developers, architects, admins. Remote vs on-site pay differences.',
    keywords: ['servicenow salary usa', 'servicenow salary united states', 'servicenow salary us', 'servicenow developer salary usa'],
  },
  {
    slug: 'canada',
    type: 'country',
    value: 'CA',
    displayName: 'Canada',
    title: 'ServiceNow Salaries in Canada 2026 | CAD Compensation Data',
    description: 'ServiceNow salaries in Canada. 30+ data points from Toronto, Vancouver, Calgary and more. See how Canadian SN pay compares to US.',
    keywords: ['servicenow salary canada', 'servicenow salary toronto', 'servicenow salary vancouver', 'servicenow developer salary canada'],
  },
  {
    slug: 'uk',
    type: 'country',
    value: 'GB',
    displayName: 'United Kingdom',
    title: 'ServiceNow Salaries in UK 2026 | GBP Compensation Data',
    description: 'ServiceNow salaries in the United Kingdom. London and regional pay data. Contractor day rates vs permanent salaries.',
    keywords: ['servicenow salary uk', 'servicenow salary london', 'servicenow developer salary uk', 'servicenow day rate uk'],
  },
  {
    slug: 'germany',
    type: 'country',
    value: 'DE',
    displayName: 'Germany',
    title: 'ServiceNow Salaries in Germany 2026 | EUR Compensation',
    description: 'ServiceNow salaries in Germany. See what German SN professionals earn. Munich, Berlin, Frankfurt market data.',
    keywords: ['servicenow salary germany', 'servicenow gehalt', 'servicenow developer salary germany', 'servicenow deutschland gehalt'],
  },
];

// All segments combined
export const ALL_SEGMENTS = [...ROLE_SEGMENTS, ...COUNTRY_SEGMENTS];

// Lookup helpers
export function getSegmentBySlug(slug: string): SalarySegment | undefined {
  return ALL_SEGMENTS.find((s) => s.slug === slug);
}

export function getRoleSegments(): SalarySegment[] {
  return ROLE_SEGMENTS;
}

export function getCountrySegments(): SalarySegment[] {
  return COUNTRY_SEGMENTS;
}

// Format helpers
export function formatSalary(amount: number, countryCode?: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: countryCode === 'GB' ? 'GBP' : countryCode === 'CA' ? 'CAD' : 'USD',
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}

export function formatCompact(amount: number): string {
  if (amount >= 1000) {
    return `$${Math.round(amount / 1000)}K`;
  }
  return `$${amount}`;
}
