// Per-certification content clusters: the hub, practice hub, study guide,
// relevant architecture course and blog guide link to each other with
// descriptive anchor text. Only indexable pages belong here.

export interface ClusterLink {
  href: string;
  /** Descriptive anchor text, e.g. "CAD exam study guide". */
  label: string;
  description: string;
}

const CLUSTERS: Record<string, ClusterLink[]> = {
  csa: [
    { href: "/csa", label: "CSA exam overview", description: "Blueprint domains, how the platform fits together, exam logistics." },
    { href: "/csa/practice-questions", label: "Free CSA practice questions", description: "Every CSA question is free, with explanations." },
    { href: "/csa/study-guide", label: "CSA study guide", description: "Domain-by-domain study notes." },
    { href: "/blog/how-to-pass-servicenow-csa-first-time", label: "How to pass the CSA exam", description: "Preparation strategy, booking and retake rules." },
    { href: "/blog/servicenow-certification-cost-2026", label: "ServiceNow certification cost in 2026", description: "Exam fees, retakes and training options." },
  ],
  cad: [
    { href: "/cad", label: "CAD exam overview", description: "Blueprint domains, the scoped-app mental model, exam logistics." },
    { href: "/cad/practice-questions", label: "CAD practice questions", description: "Practice by blueprint area, with free samples." },
    { href: "/cad/study-guide", label: "CAD study guide", description: "Domain-by-domain study notes." },
    { href: "/blog/servicenow-cad-exam-complete-guide-2026", label: "CAD exam study guide (blog)", description: "How to prepare, what each domain really asks." },
    { href: "/csa", label: "CSA exam overview", description: "The platform foundation CAD builds on." },
  ],
  "cis-df": [
    { href: "/cis-df", label: "CIS-Data Foundations exam overview", description: "Blueprint domains, CMDB and CSDM concepts, exam logistics." },
    { href: "/cis-df/practice-questions", label: "CIS-DF practice questions", description: "Practice by blueprint area, with free samples." },
    { href: "/cis-df/study-guide", label: "CIS-DF study guide", description: "Govern, Ingest and Insight study notes." },
    { href: "/courses/service-mapping", label: "Service Mapping for architects (course)", description: "How mapped application services land in the CMDB." },
    { href: "/certification-paths", label: "ServiceNow certification paths", description: "Which CIS exams require CIS-DF first." },
  ],
  cpoa: [
    { href: "/cpoa", label: "CPOA exam overview", description: "Blueprint domains, the platform-owner operating model, exam logistics." },
    { href: "/cpoa/practice-questions", label: "CPOA practice questions", description: "Practice by blueprint area, with free samples." },
    { href: "/cpoa/study-guide", label: "CPOA study guide", description: "Domain-by-domain study notes." },
    { href: "/courses/financial-management", label: "Financial Management for architects (course)", description: "Cost models and showback, useful context for platform value conversations." },
    { href: "/certification-paths", label: "ServiceNow certification paths", description: "Where CPOA sits next to CSA and the CIS exams." },
  ],
};

export function getCertCluster(certSlug: string): ClusterLink[] {
  return CLUSTERS[certSlug] ?? [];
}

export function hasCertCluster(certSlug: string): boolean {
  return certSlug in CLUSTERS;
}
