// Long-form architecture courses under app/courses/. Add an entry here when
// adding a course page so it appears on /courses and in the sitemap.

export interface CourseSummary {
  slug: string;
  title: string;
  description: string;
  topics: string[];
  /** Date the course content last changed (YYYY-MM-DD), used for sitemap lastmod. */
  updated: string;
}

export const COURSES: CourseSummary[] = [
  {
    slug: "service-mapping",
    title: "ServiceNow Service Mapping for Architects",
    description:
      "How Service Mapping turns infrastructure data into service context: application service design, CMDB and CSDM alignment, discovery methods, MID Servers, patterns, and troubleshooting untrusted maps.",
    topics: ["ITOM", "CMDB", "CSDM", "Discovery"],
    updated: "2026-07-05",
  },
  {
    slug: "financial-management",
    title: "ServiceNow Financial Management for Architects",
    description:
      "Cost models, IT shared services, allocation rules, application TCO and showback, with SPM and APM alignment, implementation phases, and governance.",
    topics: ["ITFM", "SPM", "APM", "Cost models"],
    updated: "2026-07-05",
  },
];

export function getAllCourses(): CourseSummary[] {
  return COURSES;
}
