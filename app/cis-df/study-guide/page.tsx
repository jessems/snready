import { Metadata } from "next";
import Link from "next/link";
import {
  getCertificationBySlug,
  getTotalQuestionCount,
} from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title:
    "How to Pass CIS-DF (Data Foundations) — Complete Study Guide [2026]",
  description:
    "Reddit-informed CIS-DF study guide for the ServiceNow Certified Implementation Specialist - Data Foundations exam. Domain breakdown, community study advice, common mistakes, and free practice questions. Govern (35%) is the highest-weight domain — here's how to master it.",
  keywords: [
    "CIS-DF study guide",
    "CIS-DF exam prep",
    "ServiceNow CIS-DF how to pass",
    "CIS-DF Data Foundations exam",
    "CIS-DF practice questions",
    "CIS-DF domain breakdown",
    "CIS-DF Govern topic",
    "CIS-DF Ingest topic",
    "CMDB certification study guide",
    "CSDM certification prep",
    "ServiceNow CIS-DF passing score",
    "CIS-DF exam questions",
  ],
  alternates: {
    canonical: "/cis-df/study-guide",
  },
  openGraph: {
    title: "How to Pass CIS-DF | Complete Study Guide | SNReady",
    description:
      "Domain-by-domain study plan for CIS-DF. Govern is 35% of the exam. Free practice questions included.",
    type: "article",
  },
};

const CERT_SLUG = "cis-df";

// Sample questions shown on the page (one per domain)
const SAMPLE_QUESTIONS = [
  {
    topic: "Govern",
    topicSlug: "govern",
    question:
      "In CSDM 5, what was the Service Instance table (cmdb_ci_service_auto) previously labeled as?",
    options: [
      "Business Service",
      "Application Service",
      "Technology Service",
      "Technical Service",
    ],
    correctAnswer: "Application Service",
    explanation:
      "The cmdb_ci_service_auto table was previously labeled Application Service. In CSDM 5, it was relabeled to Service Instance because there are now multiple types of service instances (Application Service, Data Service Instance, Network Service Instance, etc.).",
    weight: 35,
  },
  {
    topic: "Ingest",
    topicSlug: "ingest",
    question:
      "In the Build and Integrate domain, what is the purpose of the SDLC Component object?",
    options: [
      "Tracks software licenses and compliance",
      "Identifies individually developed parts of an application, such as microservices and APIs",
      "Manages user access to development environments",
      "Stores backup copies of source code",
    ],
    correctAnswer:
      "Identifies individually developed parts of an application, such as microservices and APIs",
    explanation:
      "The SDLC Component identifies individually developed objects within an application — for example microservices and APIs that can be developed and released separately before becoming deployed service instances.",
    weight: 19,
  },
  {
    topic: "Insight",
    topicSlug: "insight",
    question:
      "What is the purpose of the Business Service object in the Service Consumption domain?",
    options: [
      "To store the technical configuration of applications",
      "To identify business functions that depend on and are impacted by technology",
      "To manage service catalog item offerings",
      "To track incident tickets related to business functions",
    ],
    correctAnswer:
      "To identify business functions that depend on and are impacted by technology",
    explanation:
      "Business Service represents the business functions that consume technology. It enables impact analysis: when a service instance or infrastructure CI has an issue, you can identify which part of the business is affected.",
    weight: 20,
  },
  {
    topic: "Configuration",
    topicSlug: "configuration",
    question:
      "In the CSDM Foundation domain, what is the primary purpose of the lifecycle stage and stage status attributes?",
    options: [
      "To replace all existing CI attributes with one status field",
      "To provide standardized, non-customizable lifecycle tracking for assets and CIs",
      "To allow unlimited custom status values",
      "To sync status values automatically between ServiceNow instances",
    ],
    correctAnswer:
      "To provide standardized, non-customizable lifecycle tracking for assets and CIs",
    explanation:
      "Lifecycle stage and stage status attributes standardize lifecycle tracking across assets and CIs. ServiceNow intentionally limits customization so platform features can rely on consistent lifecycle values.",
    weight: 15,
  },
  {
    topic: "CSDM Fundamentals",
    topicSlug: "csdm-fundamentals",
    question: "What is the primary purpose of the Common Service Data Model (CSDM)?",
    options: [
      "To provide a standardized way to represent service data across the Now Platform",
      "To replace the CMDB with a new database schema",
      "To enable direct SQL queries against ServiceNow",
      "To configure single sign-on for external applications",
    ],
    correctAnswer:
      "To provide a standardized way to represent service data across the Now Platform",
    explanation:
      "CSDM provides a standardized, consistent data model for representing services across the Now Platform. It ensures that all ServiceNow applications use the same underlying data structures and relationships, enabling better reporting, automation, and cross-module insights.",
    weight: 11,
  },
];

// FAQ structured data
const faqData = [
  {
    question: "What is the CIS-DF exam and what does it certify?",
    answer:
      "The CIS-DF (Certified Implementation Specialist - Data Foundations) is a ServiceNow professional certification that validates your expertise in CMDB (Configuration Management Database) and the Common Service Data Model (CSDM). It tests your ability to build, govern, and maintain trusted configuration data — a foundational skill for any ServiceNow implementation specialist.",
  },
  {
    question: "How many questions are on the CIS-DF exam?",
    answer:
      "The CIS-DF exam contains 60 questions. You have 90 minutes to complete the exam, and you need a score of 70% or higher to pass. The exam format includes multiple-choice and multiple-select questions.",
  },
  {
    question: "What is the passing score for CIS-DF?",
    answer:
      "You need to score 70% or higher (42 out of 60 questions correct) to pass the CIS-DF exam. The exam is proctored and can be taken online or at a Pearson VUE testing center.",
  },
  {
    question: "How much does the CIS-DF exam cost?",
    answer:
      "The CIS-DF exam is provided at no additional cost beyond the standard exam registration. However, you must hold a valid CSA (Certified System Administrator) certification as a prerequisite before you can register for CIS-DF.",
  },
  {
    question: "What are the prerequisites for the CIS-DF exam?",
    answer:
      "You must hold a valid ServiceNow CSA (Certified System Administrator) certification before registering for CIS-DF. ServiceNow also recommends familiarity with CMDB concepts and the Common Service Data Model, typically gained through hands-on experience or the relevant NowLearning courses.",
  },
  {
    question: "What is the most important CIS-DF domain to study?",
    answer:
      "Govern (35% of the exam) is by far the most heavily weighted domain. It covers health KPIs, governance processes, lifecycle controls, and data quality — essentially how to maintain trusted data over time. Ingest (19%) and Insight (20%) are the next most important. Configuration (15%) and CSDM Fundamentals (11%) round out the exam.",
  },
  {
    question: "How hard is the CIS-DF exam compared to CSA?",
    answer:
      "CIS-DF is generally considered more challenging than CSA because it assumes hands-on ServiceNow experience and tests deep conceptual knowledge of data architecture. The CSDM model and CMDB governance concepts can be unfamiliar even to experienced admins. Most candidates find the Govern domain (35%) the toughest because it requires understanding not just what to do, but why — data quality decisions in production environments.",
  },
  {
    question: "How long should I study for the CIS-DF exam?",
    answer:
      "Most candidates with CSA-level ServiceNow experience spend 3-5 weeks preparing for CIS-DF, studying 1-2 hours per day. If you're new to CMDB and CSDM concepts, budget extra time for the Govern domain. We recommend starting with a practice test to identify your weakest domains, then focusing study time there.",
  },
  {
    question: "What does Reddit say is the best way to prepare for CIS-DF?",
    answer:
      "Across ServiceNow Reddit discussions, experienced practitioners repeatedly recommend three things: follow the official NowLearning learning path and exam blueprint, study the CSDM material instead of memorizing isolated table names, and use a personal developer instance for CMDB Health, relationships, Discovery/MID Server, and dashboard practice. Community advice also warns against relying on dumps because implementation-specialist exams test scenario judgment, not just definitions.",
  },
  {
    question: "Is there a delta exam for CIS-DF?",
    answer:
      "Yes. ServiceNow releases delta exams after each major release (e.g., Zurich). The delta exam covers only what changed in the new release and is a prerequisite for maintaining your certification. Delta exams typically have 10 questions, are 20 minutes long, and must be completed within the designated exam window.",
  },
  {
    question: "What jobs can you get with a CIS-DF certification?",
    answer:
      "CIS-DF is a prerequisite for all CIS specialty certifications (CIS-ITSM, CIS-HAM, CIS-SAM, CIS-Discovery, CIS-SM, CIS-SIR, CIS-VR), making it essential for roles like ServiceNow Technical Consultant, Implementation Specialist, CMDB Administrator, and Solution Architect. Employers often require it for mid-to-senior positions focused on ServiceNow data architecture and ITSM implementations.",
  },
];

// HowTo steps for the study plan
const howToSteps = [
  {
    name: "Take a diagnostic practice test",
    text: "Start with a full-length CIS-DF practice test to identify which domains need the most attention. Don't study anything before this — you want an honest baseline.",
    position: 1,
  },
  {
    name: "Master the Govern domain (35% of exam)",
    text: "Govern is the single largest domain. Focus on: data health KPIs, lifecycle stage management, CSDM data quality rules, and the difference between technical and business services. This domain tests your understanding of why data governance matters in real ServiceNow implementations.",
    position: 2,
  },
  {
    name: "Learn the CSDM structure and Service Mapping",
    text: "CSDM (Common Service Data Model) underpins the entire exam. Understand the three main domains — Foundation, Service Usage, and Service Consumption — and how CI classes relate to each other. The Insight domain (20%) tests your ability to use Query Builder and Unified Map to report on this data.",
    position: 3,
  },
  {
    name: "Understand data ingestion and reconciliation (19%)",
    text: "Learn how ServiceNow populates the CMDB through Service Graph Connectors, MID Server integrations, and manual entry. Focus on Identification and Reconciliation Rules (IRE) — how the system decides whether incoming data matches an existing CI or is new.",
    position: 4,
  },
  {
    name: "Review CMDB configuration basics (15%)",
    text: "Know how to configure the CMDB schema, define CI classes, set up class relationships, and manage the CMDB health dashboard. This is the most hands-on domain — if you have a PDI, use it.",
    position: 5,
  },
  {
    name: "Take full-length mock exams",
    text: "After studying all domains, take at least 2-3 full-length CIS-DF practice exams under timed conditions. Review every wrong answer and trace it back to the specific domain and concept. Aim for scores consistently above 80% before scheduling the real exam.",
    position: 6,
  },
];

const communityTakeaways = [
  {
    title: "Use the official blueprint as the spine",
    source:
      "r/servicenow certification threads frequently point candidates back to the module-specific NowLearning course and blueprint before using any third-party resource.",
    action:
      "Map every study session to one of the five CIS-DF domains, then spend the most review time on Govern, Insight, and Ingest because they make up 74% of the exam.",
  },
  {
    title: "Do not study CSDM as table-name trivia",
    source:
      "CSDM and CMDB comments emphasize reading the CSDM guidance, understanding service relationships, and knowing when manual relationships stop scaling.",
    action:
      "Draw the relationship chain from Business Service to Service Offering, Service Instance, Application Service, and the supporting CIs until you can explain the business reason for each link.",
  },
  {
    title: "Practice in a PDI, not only flashcards",
    source:
      "Community answers routinely recommend running the NowLearning training beside a personal developer instance so the UI and dashboards become familiar.",
    action:
      "Open CMDB Health, create a small CI relationship set, review class hierarchy, and trace how Identification and Reconciliation rules handle incoming data.",
  },
  {
    title: "Learn automated vs. manual data ownership",
    source:
      "CMDB implementation discussions warn that manual CI and relationship maintenance breaks down quickly unless scope is tiny and stable.",
    action:
      "Know when to use Discovery, Service Graph Connectors, MID Server, import sets, and governance controls — and when a manual process is only a temporary bridge.",
  },
  {
    title: "Avoid dumps; review explanations",
    source:
      "ServiceNow exam-prep comments favor official courses, blueprints, and concept review over answer dumps because CIS exams ask scenario-based questions.",
    action:
      "When you miss a practice question, write the underlying rule in your own words: what data is trusted, who owns it, how it is reconciled, and how the platform reports on it.",
  },
];

export default async function CISDFStudyGuidePage() {
  const cert = getCertificationBySlug(CERT_SLUG)!;
  const totalQuestions = getTotalQuestionCount(CERT_SLUG);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Certifications", url: "/certifications" },
    { name: "CIS-DF", url: "/cis-df" },
    { name: "Study Guide", url: "/cis-df/study-guide" },
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Pass the CIS-DF Exam",
    description:
      "A step-by-step study plan for passing the ServiceNow CIS-DF (Certified Implementation Specialist - Data Foundations) certification exam on your first attempt.",
    totalTime: "P4W",
    step: howToSteps.map((step) => ({
      "@type": "HowToStep",
      name: step.name,
      text: step.text,
      position: step.position,
    })),
  };

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "CIS-DF Data Foundations Exam Preparation",
    description:
      "Complete study guide for the ServiceNow CIS-DF certification exam, covering all five exam domains with practice questions, study plans, and expert tips.",
    provider: {
      "@type": "Organization",
      name: "SNReady",
      url: "https://snready.com",
    },
    educationalLevel: "Professional",
    about: {
      "@type": "Thing",
      name: "ServiceNow CIS-DF",
      description:
        "Certified Implementation Specialist - Data Foundations covering CMDB, CSDM, and data governance",
    },
  };

  // Domain data sorted by weight
  const domains = [
    {
      name: "Govern",
      slug: "govern",
      percentage: 35,
      description:
        "Apply health KPIs, governance processes, and lifecycle controls for trusted data. This is the highest-weight domain and the most critical to master.",
      keyTopics: [
        "Data health KPIs and thresholds",
        "Lifecycle stage and stage status management",
        "CSDM data quality rules",
        "Technical vs. Business Service distinction",
        "Data governance processes and policies",
      ],
    },
    {
      name: "Insight",
      slug: "insight",
      percentage: 20,
      description:
        "Use Query Builder, dashboards, and Unified Map for reporting and impact analysis on CMDB data.",
      keyTopics: [
        "Query Builder and CMDB query techniques",
        "Unified Navigation Map (UNM) and Unified Map",
        "CMDB health dashboard configuration",
        "Impact analysis and service dependency mapping",
        "Reporting on configuration items",
      ],
    },
    {
      name: "Ingest",
      slug: "ingest",
      percentage: 19,
      description:
        "Import, normalize, and reconcile CI data using IRE (Identification and Reconciliation Engine) and Service Graph Connectors.",
      keyTopics: [
        "Service Graph Connectors and data sources",
        "MID Server configuration for discovery",
        "Identification and Reconciliation Rules (IRE)",
        "CMDB class normalizations and transformations",
        "Automated vs. manual CI creation",
      ],
    },
    {
      name: "Configuration",
      slug: "configuration",
      percentage: 15,
      description:
        "Build and manage the CMDB schema, define CI classes, set up relationships, and configure the CMDB health framework.",
      keyTopics: [
        "CMDB schema design and CI class hierarchy",
        "Class relationships (1:1, 1:N, N:N)",
        "CMDB Health dashboard configuration",
        "Defining identifiers and key fields",
        "Authorization rules and ACLs on CMDB",
      ],
    },
    {
      name: "CSDM Fundamentals",
      slug: "csdm-fundamentals",
      percentage: 11,
      description:
        "Apply the Common Service Data Model to represent services across their full lifecycle from design to retirement.",
      keyTopics: [
        "CSDM Foundation domain (Data, Life Cycle, Usage)",
        "Service Consumption domain (Business Services)",
        "Service Usage domain (Applications, Infrastructure)",
        "CSDM Service Mapping and alignment",
        "CSDM vs. classic CMDB approach",
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-b from-emerald-50 via-white to-white py-16 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb hint */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
              <Link href="/" className="hover:text-emerald-600">
                Home
              </Link>
              <span>/</span>
              <Link href="/certifications" className="hover:text-emerald-600">
                Certifications
              </Link>
              <span>/</span>
              <Link href="/cis-df" className="hover:text-emerald-600">
                CIS-DF
              </Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-zinc-300">
                Study Guide
              </span>
            </nav>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Complete Study Guide
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              How to Pass the CIS-DF Exam
              <span className="mt-2 block text-lg font-normal text-zinc-500 dark:text-zinc-400 sm:text-xl">
                Certified Implementation Specialist — Data Foundations
              </span>
            </h1>

            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300">
              CIS-DF is the gateway to all ServiceNow CIS specialty certifications.
              The exam tests your ability to build, govern, and report on trusted
              configuration data using the CMDB and CSDM. This guide gives you a
              domain-by-domain breakdown, a proven study plan, and free practice
              questions — everything you need to pass.
            </p>

            {/* Quick stats */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Questions", value: "60" },
                { label: "Duration", value: "90 min" },
                { label: "Pass Score", value: "70%" },
                { label: "Practice Qs", value: `${totalQuestions}+` },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {stat.value}
                  </div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cis-df/mock-exam"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Take a Free Mock Exam
              </Link>
              <Link
                href="/cis-df/practice-questions"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                View All {totalQuestions}+ Questions
              </Link>
            </div>
          </div>
        </section>

        {/* Exam Overview */}
        <section className="border-y border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              About the CIS-DF Exam
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              The CIS-DF exam validates your ability to design, implement, and
              govern a trusted CMDB using ServiceNow&apos;s Common Service Data Model
              (CSDM). It is a core prerequisite for all CIS specialty
              certifications including CIS-ITSM, CIS-HAM, CIS-SAM, CIS-Discovery,
              CIS-SM, CIS-SIR, and CIS-VR.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-5 shadow-sm dark:bg-zinc-900">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Prerequisites
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Valid ServiceNow CSA certification
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Hands-on CMDB configuration experience
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Understanding of CSDM concepts
                  </li>
                </ul>
              </div>
              <div className="rounded-lg bg-white p-5 shadow-sm dark:bg-zinc-900">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Exam Format
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    60 multiple-choice and multiple-select questions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    90 minutes to complete
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Online proctored or Pearson VUE testing center
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Domain Breakdown */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              CIS-DF Domain Breakdown
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              The five exam domains and their weightings from the official
              ServiceNow exam blueprint. Study time should be proportional to
              domain weight — especially for Govern (35%).
            </p>

            <div className="mt-8 space-y-4">
              {domains.map((domain) => (
                <div
                  key={domain.slug}
                  className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {domain.name}
                        </h3>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          {domain.percentage}%
                        </span>
                        {domain.percentage >= 30 && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
                            Highest weight
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {domain.description}
                      </p>
                      <ul className="mt-3 space-y-1">
                        {domain.keyTopics.map((topic) => (
                          <li
                            key={topic}
                            className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                          >
                            <svg
                              className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4"
                              />
                            </svg>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col items-end gap-2 sm:min-w-[120px]">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {domain.percentage}%
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${domain.percentage}%` }}
                        />
                      </div>
                      <Link
                        href={`/cis-df/practice-questions/${domain.slug}`}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        Practice →{" "}
                        {cert.domains.find((d) => d.slug === domain.slug)
                          ?.name || domain.name}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              Domain percentages sourced from the{" "}
              <a
                href="https://nowlearning.servicenow.com/lxp/en/credentials/certified-implementation-specialist-cmdb-mainline-exam-blueprint?id=kb_article_view&sysparm_article=KB0011528"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                official CIS-DF exam blueprint on NowLearning →
              </a>
            </p>
          </div>
        </section>

        {/* Study Plan (HowTo) */}
        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              How to Study for CIS-DF
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              A proven, step-by-step study plan. Follow this order — it mirrors
              the domain weights so you spend your time where it matters most.
            </p>

            <div className="mt-8 relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 h-full w-px bg-emerald-200 dark:bg-emerald-800 sm:left-1/2" />

              <div className="space-y-8">
                {howToSteps.map((step, i) => (
                  <div
                    key={step.position}
                    className="relative pl-10 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-8"
                  >
                    {/* Dot */}
                    <div className="absolute left-3 top-1 h-6 w-6 rounded-full border-2 border-emerald-500 bg-white dark:bg-zinc-900 sm:left-1/2 sm:-translate-x-1/2">
                      <div className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-emerald-500" />
                    </div>

                    {/* Content */}
                    <div
                      className={
                        i % 2 === 0
                          ? "sm:mr-auto sm:pr-8 sm:text-right"
                          : "sm:ml-auto sm:pl-8 sm:col-start-2"
                      }
                    >
                      <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mb-1 text-xs font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                          Step {step.position}
                        </div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {step.name}
                        </h3>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Community / Reddit Takeaways */}
        <section className="border-t border-zinc-200 py-16 dark:border-zinc-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-emerald-700 shadow-sm dark:bg-zinc-900 dark:text-emerald-300">
                Reddit-informed study notes
              </div>
              <h2 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                What ServiceNow Reddit Comments Reveal About Passing CIS-DF
              </h2>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                Reddit does not have many CIS-DF-specific exam reports yet, but
                the recurring advice across r/servicenow CMDB, CSDM, Discovery,
                and implementation-specialist certification threads is consistent:
                use the official blueprint, practice hands-on, and learn why
                data governance decisions are made — not just what fields are
                named.
              </p>

              <div className="mt-8 space-y-4">
                {communityTakeaways.map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                          <span className="font-medium text-zinc-900 dark:text-zinc-200">
                            Reddit pattern:
                          </span>{" "}
                          {item.source}
                        </p>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                          <span className="font-medium text-zinc-900 dark:text-zinc-200">
                            Study action:
                          </span>{" "}
                          {item.action}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Common Pitfalls */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Common CIS-DF Mistakes to Avoid
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              These are the errors that trip up even experienced ServiceNow
              professionals. Learn from them before your exam.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Memorizing CSDM without understanding it",
                  body: "The exam tests conceptual understanding, not rote memorization. Understand why CSDM separates Technical Services from Business Services — that's a question that appears in multiple domains.",
                  icon: "📚",
                },
                {
                  title: "Neglecting the Govern domain",
                  body: "At 35% of the exam, Govern is not optional. Candidates often spend too much time on hands-on Configuration (15%) and underprepare for the governance concepts that dominate Govern.",
                  icon: "⚖️",
                },
                {
                  title: "Confusing identification vs. reconciliation",
                  body: "Identification determines if a CI is NEW. Reconciliation decides how to MERGE or UPDATE existing CIs. These are distinct IRE concepts — the exam tests the difference carefully.",
                  icon: "🔄",
                },
                {
                  title: "Skipping hands-on practice",
                  body: "CIS-DF is not purely theoretical. Knowing the CMDB Health dashboard metrics, configuring class relationships, and building a Service Map — these require a PDI to truly understand.",
                  icon: "🛠️",
                },
                {
                  title: "Not knowing CSDM 5 changes",
                  body: "CSDM 5 renamed the Service Instance table from 'Application Service' to 'Service Instance.' This is a frequently-tested detail that trips up candidates who studied older material.",
                  icon: "📝",
                },
                {
                  title: "Ignoring MID Server for discovery",
                  body: "Understanding when and why MID Server is used for CMDB discovery — vs. cloud discovery — is a subtle but testable topic, especially in the Ingest domain.",
                  icon: "🌐",
                },
              ].map((pitfall) => (
                <div
                  key={pitfall.title}
                  className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="mb-3 text-2xl">{pitfall.icon}</div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {pitfall.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {pitfall.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sample Questions */}
        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  Free CIS-DF Practice Questions
                </h2>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  One sample question from each exam domain. Full practice tests
                  available after signup.
                </p>
              </div>
              <Link
                href="/cis-df/practice-questions"
                className="hidden text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 sm:block"
              >
                See all {totalQuestions}+ questions →
              </Link>
            </div>

            <div className="mt-8 space-y-6">
              {SAMPLE_QUESTIONS.map((q, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {q.topic}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {q.weight}% of exam
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400">
                      Question {i + 1} of {SAMPLE_QUESTIONS.length}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {q.question}
                    </p>
                    <div className="mt-4 space-y-2">
                      {q.options.map((option, j) => (
                        <div
                          key={j}
                          className={`rounded-lg border px-4 py-3 text-sm ${
                            option === q.correctAnswer
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
                              : "border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          {option}
                          {option === q.correctAnswer && (
                            <span className="ml-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                              ✓ Correct
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                      <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Explanation
                      </div>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/cis-df/mock-exam"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-8 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Take the Full CIS-DF Mock Exam
              </Link>
              <p className="mt-3 text-sm text-zinc-500">
                {totalQuestions} questions · Timed · Instant results
              </p>
            </div>
          </div>
        </section>

        {/* Career Value */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Why CIS-DF Matters for Your Career
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                {
                  title: "Gateway to All CIS Certs",
                  body: "CIS-DF is a hard prerequisite for 7 other CIS specialty certifications. Without it, you can't pursue CIS-ITSM, CIS-HAM, CIS-SAM, CIS-Discovery, CIS-SM, CIS-SIR, or CIS-VR. It's the foundation of the entire CIS track.",
                  icon: (
                    <svg
                      className="h-6 w-6 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "High-Demand Skill",
                  body: "CMDB and CSDM expertise is among the most sought-after ServiceNow skills. Organizations running ITSM, Security Operations, or HR Service Delivery all depend on a well-governed CMDB. CIS-DF holders command premium consulting rates.",
                  icon: (
                    <svg
                      className="h-6 w-6 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Real-World Impact",
                  body: "CIS-DF isn't academic — it's directly applicable to every ServiceNow implementation. A properly governed CMDB enables accurate incident impact analysis, efficient change risk assessment, and trustworthy asset reporting. These are day-to-day skills that make you valuable to any employer.",
                  icon: (
                    <svg
                      className="h-6 w-6 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Certifications */}
        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Continue Your ServiceNow Journey
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              CIS-DF opens the door to these certifications. Build on your
              Data Foundations knowledge.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "CIS-ITSM",
                  fullName: "Certified Implementation Specialist - IT Service Management",
                  href: "/cis-itsm",
                  weight: "20% Change, 20% Incident",
                },
                {
                  name: "CIS-HAM",
                  fullName: "Certified Implementation Specialist - Hardware Asset Management",
                  href: "/cis-ham",
                  weight: "Requires CIS-DF",
                },
                {
                  name: "CIS-SAM",
                  fullName: "Certified Implementation Specialist - Software Asset Management",
                  href: "/cis-sam",
                  weight: "Requires CIS-DF",
                },
                {
                  name: "CSA",
                  fullName: "Certified System Administrator",
                  href: "/csa",
                  weight: "Prerequisite for CIS-DF",
                },
                {
                  name: "CAD",
                  fullName: "Certified Application Developer",
                  href: "/cad",
                  weight: "Scripting & APIs",
                },
                {
                  name: "CPOA",
                  fullName: "Certified Platform Owner Associate",
                  href: "/cpoa",
                  weight: "Platform governance",
                },
              ].map((related) => (
                <Link
                  key={related.name}
                  href={related.href}
                  className="group rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800 dark:hover:bg-emerald-900/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-700 group-hover:text-emerald-800 dark:text-emerald-400 dark:group-hover:text-emerald-300">
                      {related.name}
                    </span>
                    <svg
                      className="h-4 w-4 text-zinc-400 group-hover:text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {related.fullName}
                  </p>
                  <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {related.weight}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-emerald-600 py-16 dark:bg-emerald-700">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white">
              Ready to Pass CIS-DF on Your First Attempt?
            </h2>
            <p className="mt-4 text-emerald-100">
              {totalQuestions}+ practice questions covering all 5 exam domains.
              Instant results, detailed explanations, and a mock exam to
              simulate the real test.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/cis-df/mock-exam"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 text-base font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
              >
                Take the CIS-DF Mock Exam — Free
              </Link>
              <Link
                href="/cis-df/practice-questions"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-emerald-400 px-8 text-base font-medium text-white transition-colors hover:bg-emerald-600"
              >
                Browse All Questions
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
