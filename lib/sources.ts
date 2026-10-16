// Registry of the external sources behind the long-form guide pages (cert
// hubs, /certification-paths, the CSA and CAD blog guides). Every factual
// claim on those pages links inline to one of these entries and the page
// lists them again under "Sources". Each URL was fetched and read when the
// page was last reviewed (see LAST_REVIEWED_ISO in lib/site-facts.ts).
//
// Only ServiceNow-owned sources belong here: servicenow.com/docs, the
// ServiceNow Community, Now Learning / ServiceNow University, and the URLs in
// data/cert-sources/cert-sources.csv. Add a source before writing the claim.

export interface Source {
  label: string;
  href: string;
}

const DOCS = "https://www.servicenow.com/docs/r/australia";

export const SOURCES = {
  // ---- Exam logistics (ServiceNow Community) ----
  examChanges2026: {
    label: "Mark Roethof, “2026 exam vouchers, courses, exams & retakes – major changes explained”, ServiceNow Community, 18 Jan 2026",
    href: "https://www.servicenow.com/community/training-and-certifications/2026-exam-vouchers-courses-exams-amp-retakes-major-changes/ba-p/3464930",
  },
  cutScoreThread: {
    label: "“CSA Exam” (cut score question), ServiceNow Community SysAdmin forum, 16 Jul 2026",
    href: "https://www.servicenow.com/community/sysadmin-forum/csa-exam/m-p/3574806",
  },
  csaLengthThread: {
    label: "“Length in time of CSA exam”, ServiceNow Community, 25 Feb 2020",
    href: "https://www.servicenow.com/community/training-and-certifications/length-in-time-of-csa-exam/td-p/345981",
  },
  csaPrepThread: {
    label: "“csa PREP”, ServiceNow Community SysAdmin forum, 2 Jul 2026",
    href: "https://www.servicenow.com/community/sysadmin-forum/csa-prep/td-p/3567903",
  },
  voucherEligibilityThread: {
    label: "“Exam vouchers eligibility”, ServiceNow Community, 6–8 Jul 2026",
    href: "https://www.servicenow.com/community/community-central-forum/exam-vouchers-eligibility/td-p/3569553",
  },
  cadVoucherThread: {
    label: "“CAD Voucher”, ServiceNow Community Developer forum, 3 May 2026",
    href: "https://www.servicenow.com/community/developer-forum/cad-voucher/m-p/3536175",
  },
  cisDfExperience: {
    label: "Shashank Jain, “From Preparation to Pass: My CIS – Data Foundation Exam Experience”, ServiceNow Community, 17 Feb 2026",
    href: "https://www.servicenow.com/community/cmdb-forum/from-preparation-to-pass-my-cis-data-foundation-exam-experience/m-p/3536181",
  },
  cpoaExamThread: {
    label: "“Platform Owner Exam”, ServiceNow Community Platform Owners forum, 2026",
    href: "https://www.servicenow.com/community/platform-owners-forum/platform-owner-exam/td-p/3603399",
  },

  // ---- Official exam blueprints (Now Learning; URLs from cert-sources.csv) ----
  csaBlueprint: {
    label: "CSA exam blueprint, KB0011554 (updated January 2026)",
    href: "https://learning.servicenow.com/kb?id=kb_article_view&sysparm_article=KB0011554",
  },
  cadBlueprint: {
    label: "CAD exam blueprint, KB0011498 (updated January 2026)",
    href: "https://learning.servicenow.com/kb?id=kb_article_view&sysparm_article=KB0011498",
  },
  cisDfBlueprint: {
    label: "CIS-Data Foundations exam blueprint, KB0012913 (updated November 2025)",
    href: "https://learning.servicenow.com/kb?id=kb_article_view&sysparm_article=KB0012913",
  },
  cpoaBlueprint: {
    label: "CPOA exam blueprint, KB0012914 (updated November 2025)",
    href: "https://learning.servicenow.com/kb?id=kb_article_view&sysparm_article=KB0012914",
  },
  adminFundamentalsCourse: {
    label: "ServiceNow Administration Fundamentals (Now Learning course page)",
    href: "https://learning.servicenow.com/lxp?id=learning_course_prev&course_id=fbb6cc4847f5dd505cbdaf44846d436a",
  },
  welcomeCourse: {
    label: "Welcome to ServiceNow (Now Learning course page)",
    href: "https://learning.servicenow.com/lxp?id=learning_course_prev&course_id=386f3cf847b36a90c00af235126d430c",
  },
  platformImplementationCourse: {
    label: "ServiceNow Platform Implementation (Now Learning course page)",
    href: "https://learning.servicenow.com/lxp?id=learning_course_prev&course_id=120ba63fc3545ad4cfdf34ee050131e9",
  },
  cmdbFundamentalsCourse: {
    label: "CMDB Fundamentals (Now Learning course page)",
    href: "https://learning.servicenow.com/lxp?id=learning_course_prev&course_id=c03ca22847ec66547faa0415f16d43f4",
  },
  cmdbHealthDeepDiveCourse: {
    label: "CMDB Health Deep Dive (Now Learning course page)",
    href: "https://learning.servicenow.com/lxp?id=learning_course_prev&course_id=5c01c5fd93f90690fb94b4886cba109d",
  },
  developerSite: {
    label: "ServiceNow Developer site",
    href: "https://developer.servicenow.com/dev.do",
  },

  // ---- Product documentation (Australia release unless noted) ----
  docsAcl: { label: "Explore Access Control Lists", href: `${DOCS}/platform-security/access-control/exploring-access-control-list.html` },
  docsClientScripts: { label: "Client scripts", href: `${DOCS}/api-reference/scripts/client-scripts.html` },
  docsBusinessRules: { label: "Classic business rules", href: `${DOCS}/build-workflows/business-rules-classic/c_BusinessRules.html` },
  docsScriptIncludes: { label: "Script includes", href: `${DOCS}/api-reference/scripts/c_ScriptIncludes.html` },
  docsAppScope: { label: "Application scope", href: `${DOCS}/application-development/c_ApplicationScope.html` },
  docsFlowDesigner: { label: "Flow Designer", href: `${DOCS}/application-development/flow-designer.html` },
  docsScriptedRest: { label: "Scripted REST APIs", href: `${DOCS}/api-reference/rest-api-explorer/c_CustomWebServices.html` },
  docsDelegatedDev: { label: "Delegated development and deployment", href: `${DOCS}/application-development/delegated-development-and-deployment/c_DelegatedDevelopment.html` },
  docsAtf: { label: "Automated Test Framework", href: `${DOCS}/application-development/automated-test-framework-atf/atf-landing-page.html` },
  docsImportSets: { label: "Import sets", href: `${DOCS}/integrate-applications/system-import-sets/import-sets-landing-page.html` },
  docsUpdateSets: { label: "System update sets", href: `${DOCS}/application-development/system-update-sets/system-update-sets.html` },
  docsServiceCatalog: { label: "Exploring Service Catalog", href: `${DOCS}/servicenow-platform/service-catalog/exploring-service-catalog.html` },
  docsKnowledge: { label: "Knowledge Management", href: `${DOCS}/servicenow-platform/knowledge-management/knowledge-management.html` },
  docsSecurityCenter: { label: "Security Center", href: `${DOCS}/platform-security/security-center/sec-center-landing.html` },
  docsCmdb: { label: "Configuration Management Database (CMDB)", href: `${DOCS}/servicenow-platform/configuration-management-database-cmdb/c_ITILConfigurationManagement.html` },
  docsCiClassManager: { label: "CI Class Manager", href: `${DOCS}/servicenow-platform/configuration-management-database-cmdb/ci-class-manager-landing-page.html` },
  docsIre: { label: "Identification and Reconciliation Engine (IRE)", href: `${DOCS}/servicenow-platform/configuration-management-database-cmdb/ire.html` },
  docsCmdbHealth: { label: "CMDB Health KPIs and metrics", href: `${DOCS}/servicenow-platform/configuration-management-database-cmdb/r_CMDBHealthMetrics.html` },
  docsDataManager: { label: "CMDB Data Manager", href: `${DOCS}/servicenow-platform/configuration-management-database-cmdb/cmdb-data-management-landing.html` },
  docsDedup: { label: "Duplicate CI remediation", href: `${DOCS}/servicenow-platform/configuration-management-database-cmdb/de-duplication-tasks.html` },
  docsCsdm: { label: "Common Service Data Model (CSDM)", href: `${DOCS}/servicenow-platform/common-service-data-model-csdm/csdm-landing-page.html` },
  docsCsdmFoundation: { label: "Foundation domain in the CSDM model (Zurich)", href: "https://www.servicenow.com/docs/r/zurich/servicenow-platform/common-service-data-model-csdm/foundation-domain.html" },
  docsUpgrade: { label: "Upgrade management", href: `${DOCS}/platform-administration/upgrade-management/um-landing-page.html` },
  docsClone: { label: "Instance Clone", href: `${DOCS}/platform-administration/system-clone-landing.html` },
  docsDomainSeparation: { label: "Domain separation", href: `${DOCS}/platform-security/domain-sep-landing-page.html` },
  docsPlatformAnalytics: { label: "Platform Analytics and reporting", href: `${DOCS}/now-intelligence/c_performanceAnalyticsAndReporting.html` },
} satisfies Record<string, Source>;

export type SourceKey = keyof typeof SOURCES;
