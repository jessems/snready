import { Metadata } from "next";
import Link from "next/link";
import { getCertificationBySlug, getTotalQuestionCount } from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title: "How to Pass CIS-CSM — Complete ServiceNow CSM Study Guide [2026]",
  description:
    "Complete ServiceNow CIS-CSM study guide with official domain weights, a 4-week study calendar, CSM implementation lab checklist, scenario drills, common mistakes, readiness checklist, and CIS-CSM practice questions.",
  keywords: [
    "CIS-CSM study guide",
    "ServiceNow CIS-CSM exam prep",
    "Customer Service Management certification",
    "CIS-CSM practice questions",
    "ServiceNow CSM implementation specialist",
    "CIS-CSM domain breakdown",
    "CIS-CSM passing score",
    "ServiceNow CSM mock exam",
  ],
  alternates: {
    canonical: "/cis-csm/study-guide",
  },
  openGraph: {
    title: "How to Pass CIS-CSM | Complete Study Guide | SNReady",
    description:
      "Domain-by-domain CIS-CSM study plan with a 4-week calendar, hands-on labs, scenario drills, and practice-question links.",
    type: "article",
  },
};

const CERT_SLUG = "cis-csm";

const domainFocus: Record<string, string[]> = {
  "csm-configuration": [
    "CSM Guided Setup, service channels, case types, and account/contact configuration",
    "Routing, assignment, skills, queues, matching rules, and escalation paths",
    "Communication channels, email behavior, templates, and customer-facing notifications",
  ],
  "foundational-data-model": [
    "B2B, B2C, and B2B2C operating models and why each changes the data model",
    "Accounts, contacts, consumers, partners, install base, products, assets, and sold products",
    "Contracts, entitlements, service organizations, and how data drives case visibility",
  ],
  "case-management": [
    "Case lifecycle, states, case tasks, escalations, major cases, and case digests",
    "When to use parent/child cases, case actions, and task plans for complex work",
    "How CSM cases interact with ITSM incidents, field service, and other fulfiller processes",
  ],
  "best-practices-knowledge": [
    "Better Together architecture across CSM, ITSM, ITOM, FSM, and Knowledge Management",
    "Knowledge article creation, ownership, feedback, AQI, blocks, and reuse in portals/workspaces",
    "Implementation scope, process design, governance, and avoiding over-customization",
  ],
  "workspace-portals-analytics": [
    "CSM Configurable Workspace, agent assist, special handling notes, and interaction context",
    "Customer portals, Service Catalog requests, targeted communications, and self-service deflection",
    "SLA behavior, reports, dashboards, and analytics for service health and backlog visibility",
  ],
};

const faqData = [
  {
    question: "What is the ServiceNow CIS-CSM exam?",
    answer:
      "The ServiceNow Certified Implementation Specialist - Customer Service Management exam validates that you can implement CSM solutions: customer data models, CSM configuration, case management, workspace and portal experiences, analytics, knowledge, and implementation best practices.",
  },
  {
    question: "How many questions are on the CIS-CSM exam?",
    answer:
      "SNReady lists the CIS-CSM exam as 60 multiple-choice and multiple-select questions with 90 minutes to complete the exam and a planning passing score of 70%.",
  },
  {
    question: "Which CIS-CSM domains should I study first?",
    answer:
      "Start with CSM Configuration because it is the highest-weight domain at 38%, then study the CSM Foundational Data Model at 27%. Together those two domains represent 65% of the exam and shape how the remaining case, workspace, knowledge, and analytics questions behave.",
  },
  {
    question: "How long should I study for CIS-CSM?",
    answer:
      "Most candidates with CSA-level platform knowledge and some CSM exposure should plan 4 weeks of structured preparation. Candidates without hands-on case, account/contact, entitlement, and workspace experience should spend additional time in a Personal Developer Instance or training instance.",
  },
  {
    question: "Do I need hands-on CSM implementation experience?",
    answer:
      "Yes. CIS-CSM is an implementation-specialist exam. You should be able to configure or inspect accounts, contacts, consumers, products, entitlements, case types, routing, workspace behavior, portals, knowledge, SLAs, and reports—not just define the terms.",
  },
  {
    question: "Is CIS-CSM mostly case management?",
    answer:
      "No. Case Management is important, but the highest-weight areas are CSM Configuration and the CSM Foundational Data Model. Many scenario questions depend on choosing the right customer data model and configuration pattern before a case is even created.",
  },
  {
    question: "What score should I reach before scheduling CIS-CSM?",
    answer:
      "Use 80% or higher on two timed mixed-domain mock exams as a safer readiness target. Also require no domain below 70%, because weak foundational-data-model or configuration knowledge can sink otherwise strong case-management performance.",
  },
  {
    question: "What should I do during the final week before CIS-CSM?",
    answer:
      "Take two timed mock exams, review every missed question by domain, rebuild weak configuration decisions in a PDI, and rehearse scenario explanations for routing, entitlement, account/contact modeling, major cases, workspace, portals, knowledge, and SLAs.",
  },
];

const howToSteps = [
  {
    name: "Take a baseline CIS-CSM practice test",
    text: "Start with a mixed-domain diagnostic. Group misses by CSM Configuration, Foundational Data Model, Case Management, Workspace/Portals/Analytics, and Knowledge/Best Practices.",
    position: 1,
  },
  {
    name: "Master CSM Configuration first",
    text: "CSM Configuration is 38% of the blueprint. Focus on setup sequence, channels, case types, routing, assignment, communication, and how configuration choices affect agent and customer experiences.",
    position: 2,
  },
  {
    name: "Learn the customer data model deeply",
    text: "The Foundational Data Model domain is 27%. Practice account/contact/consumer/partner/product/install-base/entitlement scenarios until you can choose the right model without keyword matching.",
    position: 3,
  },
  {
    name: "Connect cases to fulfillment and knowledge",
    text: "Study case lifecycles, major cases, tasks, escalations, knowledge reuse, and Better Together integrations so you can answer implementation scenarios end to end.",
    position: 4,
  },
  {
    name: "Validate workspace, portal, SLA, and analytics behavior",
    text: "Use hands-on review to understand what agents see in CSM Workspace, what customers see in portals, when special handling notes appear, and how SLAs/reports measure service outcomes.",
    position: 5,
  },
  {
    name: "Finish with timed mock exams and remediation",
    text: "Take full-length CIS-CSM mock exams under the 90-minute limit, then rewrite the decision rule behind every miss before retesting.",
    position: 6,
  },
];

const fourWeekPlan = [
  {
    week: "Week 1",
    title: "Blueprint, baseline, and data model",
    focus: "Foundational Data Model + diagnostic",
    goal: "Understand who the customer is and how CSM records represent them.",
    tasks: [
      "Read the CIS-CSM blueprint and sort every domain by weight.",
      "Compare B2B, B2C, and B2B2C examples; map each to account, contact, consumer, partner, product, and entitlement records.",
      "Take 30-60 mixed questions and create a domain miss log.",
    ],
    success:
      "You can model a customer scenario with the correct accounts, contacts/consumers, products, install base, contracts, and entitlements.",
  },
  {
    week: "Week 2",
    title: "Configuration and routing decisions",
    focus: "CSM Configuration (38%)",
    goal: "Win the largest domain before polishing smaller areas.",
    tasks: [
      "Walk through Guided Setup categories and identify what each configuration step enables.",
      "Practice case type, channel, routing, assignment, skill, queue, notification, and escalation decisions.",
      "Answer configuration-only questions until your explanations include the user/business impact, not only the setting name.",
    ],
    success:
      "Your CSM Configuration practice score is 80%+ and you can justify routing and assignment choices in scenario questions.",
  },
  {
    week: "Week 3",
    title: "Case, knowledge, workspace, and portals",
    focus: "Case Management + Knowledge + Workspace",
    goal: "Connect customer issues to agent work, self-service, knowledge, and fulfillment.",
    tasks: [
      "Trace simple cases, complex cases, case tasks, escalations, major cases, case digests, and parent/child relationships.",
      "Review CSM Workspace, special handling notes, portals, Service Catalog, targeted communications, and SLAs.",
      "Practice knowledge article, AQI, knowledge-block, and Better Together integration scenarios.",
    ],
    success:
      "You can explain what happens from customer contact through case resolution, knowledge reuse, and analytics visibility.",
  },
  {
    week: "Week 4",
    title: "Timed simulation and weak-domain repair",
    focus: "Full mocks + missed-question review",
    goal: "Convert implementation knowledge into reliable exam performance.",
    tasks: [
      "Take at least two 60-question timed CIS-CSM mock exams.",
      "Rebuild every miss as a rule: model, configuration, process, workspace, knowledge, or reporting decision.",
      "Retest weak domains until every domain is above 70% and mixed mocks are consistently 80%+.",
    ],
    success:
      "You can finish a full mock exam within 90 minutes with 80%+ overall and no domain below 70%.",
  },
];

const pdiLabChecklist = [
  {
    lab: "Customer data model build",
    domain: "CSM Foundational Data Model",
    outcome:
      "Create or inspect a B2B/B2C/B2B2C scenario and identify accounts, contacts, consumers, partners, products, install base, sold products, contracts, and entitlements.",
  },
  {
    lab: "Guided Setup and case configuration walkthrough",
    domain: "CSM Configuration",
    outcome:
      "Open CSM setup areas and explain how case types, channels, routing, assignment, notifications, and escalation settings affect real work.",
  },
  {
    lab: "Case lifecycle and major case drill",
    domain: "Case Management",
    outcome:
      "Trace a case from creation through assignment, tasks, escalation, resolution, and closure; then compare it with a major case affecting multiple customers.",
  },
  {
    lab: "Workspace and special handling review",
    domain: "Workspace, Portals & Analytics",
    outcome:
      "Inspect the CSM workspace context pane, special handling notes, customer details, related records, and agent actions so UI questions map to real screens.",
  },
  {
    lab: "Portal, catalog, and self-service deflection",
    domain: "Workspace, Portals & Analytics",
    outcome:
      "Review a customer portal or catalog request flow and explain when customers should self-serve versus open a case.",
  },
  {
    lab: "Knowledge and analytics validation",
    domain: "Best Practices & Knowledge Management",
    outcome:
      "Review knowledge article reuse, AQI/feedback signals, knowledge blocks, SLAs, reports, dashboards, and how they improve service quality.",
  },
];

const decisionDrills = [
  {
    prompt:
      "A manufacturer sells through distributors, but end consumers also open support cases directly.",
    test: "Can you choose the right customer model instead of forcing plain B2B or B2C?",
    answer:
      "Model the intermediary and end-customer relationship explicitly. B2B2C-style scenarios need partner/distributor and consumer context so entitlement, visibility, and routing decisions remain accurate.",
  },
  {
    prompt:
      "VIP customer cases are being assigned correctly but agents miss critical handling instructions.",
    test: "Is this a routing problem or a workspace context problem?",
    answer:
      "Assignment may be correct already. Use special handling notes or workspace-visible customer context so agents see the requirement at the moment they work the case.",
  },
  {
    prompt:
      "One defect causes similar cases from many customers after a product release.",
    test: "Do you handle each case independently or coordinate through major case management?",
    answer:
      "Use major case management when one issue affects multiple customers. It centralizes communication, resolution coordination, and customer updates while preserving individual case visibility.",
  },
  {
    prompt:
      "A customer submits an IT outage through the support portal and fulfillment belongs to ITSM.",
    test: "Can you apply the Better Together pattern?",
    answer:
      "Keep the customer-facing CSM case for communication and use integration with ITSM to create or link the fulfillment incident. CSM owns customer experience; ITSM owns restoration work.",
  },
  {
    prompt:
      "Support leadership wants fewer repetitive questions and lower case volume.",
    test: "Can you connect knowledge, portals, and analytics?",
    answer:
      "Improve knowledge quality, expose the right articles in self-service, monitor feedback/AQI and portal deflection, and use analytics to find topics that still create cases.",
  },
];

const commonMistakes = [
  {
    title: "Studying case states before customer data",
    body: "Case behavior depends on who the customer is, what product or service they own, and what entitlement applies. Start with the data model before memorizing case actions.",
    icon: "🧩",
  },
  {
    title: "Underweighting CSM Configuration",
    body: "At 38%, configuration is the largest CIS-CSM domain. Routing, assignment, channels, setup sequence, and communication decisions deserve the most practice time.",
    icon: "⚙️",
  },
  {
    title: "Confusing contacts, consumers, and accounts",
    body: "B2B, B2C, and B2B2C scenarios use different record relationships. Mis-modeling the customer usually leads to wrong entitlement and visibility choices.",
    icon: "👥",
  },
  {
    title: "Treating major cases as high-priority cases",
    body: "Major case management is about a common issue affecting multiple customers, not simply an important individual case.",
    icon: "📣",
  },
  {
    title: "Ignoring the agent workspace experience",
    body: "Implementation questions often ask where agents see context, actions, customer history, and special handling notes. Review the workspace, not just backend tables.",
    icon: "🖥️",
  },
  {
    title: "Separating CSM from the rest of the platform",
    body: "CSM is frequently better together with ITSM, FSM, Knowledge, and analytics. Know when a CSM case should create or link work in another application.",
    icon: "🔗",
  },
];

const sampleQuestions = [
  {
    topic: "CSM Configuration",
    topicSlug: "csm-configuration",
    weight: 38,
    question: "What is the purpose of CSM Guided Setup?",
    options: [
      "To provide interactive tutorials for end users",
      "To guide administrators through CSM configuration tasks in a structured sequence",
      "To automatically configure CSM from industry templates without review",
      "To generate customer service reports",
    ],
    correctAnswer:
      "To guide administrators through CSM configuration tasks in a structured sequence",
    explanation:
      "CSM Guided Setup organizes administrator configuration tasks by category and links to the pages where settings are completed. It guides setup; it does not replace implementation decisions.",
  },
  {
    topic: "CSM Foundational Data Model",
    topicSlug: "foundational-data-model",
    weight: 27,
    question:
      "Which business model applies when a company sells products or services directly to individual consumers?",
    options: ["B2B", "B2C", "B2B2C", "B2B2E"],
    correctAnswer: "B2C",
    explanation:
      "B2C means Business-to-Consumer: the provider sells directly to individual consumers. B2B and B2B2C introduce business customers or intermediaries.",
  },
  {
    topic: "Case Management",
    topicSlug: "case-management",
    weight: 17,
    question: "What is the primary purpose of major case management in CSM?",
    options: [
      "To handle only cases submitted by major customers",
      "To coordinate communication and resolution for an issue affecting multiple customers",
      "To escalate every case to senior management",
      "To replace ITSM incident management",
    ],
    correctAnswer:
      "To coordinate communication and resolution for an issue affecting multiple customers",
    explanation:
      "Major cases centralize work and communication when one issue impacts many customers. The trigger is shared impact, not simply customer importance.",
  },
  {
    topic: "Workspace, Portals & Analytics",
    topicSlug: "workspace-portals-analytics",
    weight: 8,
    question: "What are special handling notes used for in CSM?",
    options: [
      "To document technical troubleshooting steps",
      "To bring important customer information to an agent's attention during case handling",
      "To record agent performance feedback",
      "To store reusable case resolution templates",
    ],
    correctAnswer:
      "To bring important customer information to an agent's attention during case handling",
    explanation:
      "Special handling notes surface important customer or case context—such as VIP requirements or special procedures—while agents work the case.",
  },
];

const readinessChecklist = [
  "Score 80% or higher on two full-length timed CIS-CSM mock exams.",
  "No CIS-CSM domain is below 70% on the most recent mixed practice exam.",
  "Explain B2B, B2C, and B2B2C customer models with the right records and relationships.",
  "Choose routing, assignment, communication, escalation, and entitlement options for common CSM scenarios.",
  "Trace a case through workspace, tasks, major case handling, knowledge reuse, SLAs, and analytics.",
  "Review every missed practice question by domain and rewrite the implementation rule in your own words.",
];

export default function CISCSMStudyGuidePage() {
  const cert = getCertificationBySlug(CERT_SLUG)!;
  const totalQuestions = getTotalQuestionCount(CERT_SLUG);
  const domains = [...cert.domains].sort((a, b) => b.percentage - a.percentage);
  const topDomains = domains.filter((domain) => domain.percentage >= 20);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Certifications", url: "/certifications" },
    { name: "CIS-CSM", url: "/cis-csm" },
    { name: "Study Guide", url: "/cis-csm/study-guide" },
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
    name: "How to Pass the ServiceNow CIS-CSM Exam",
    description:
      "A four-week study plan for passing the ServiceNow Certified Implementation Specialist - Customer Service Management exam with hands-on labs and timed mock exams.",
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
    name: "ServiceNow CIS-CSM Exam Preparation",
    description:
      "Complete study guide for the ServiceNow Customer Service Management implementation specialist exam, covering all official CIS-CSM domains with labs, scenario drills, and practice questions.",
    provider: {
      "@type": "Organization",
      name: "SNReady",
      url: "https://snready.com",
    },
    educationalLevel: "Professional",
    about: {
      "@type": "Thing",
      name: "ServiceNow CIS-CSM",
      description:
        "Certified Implementation Specialist - Customer Service Management covering CSM data models, configuration, case management, workspace, portals, analytics, knowledge, and best practices.",
    },
  };

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
        <section className="bg-gradient-to-b from-emerald-50 via-white to-white py-16 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
              <Link href="/" className="hover:text-emerald-600">
                Home
              </Link>
              <span>/</span>
              <Link href="/certifications" className="hover:text-emerald-600">
                Certifications
              </Link>
              <span>/</span>
              <Link href="/cis-csm" className="hover:text-emerald-600">
                CIS-CSM
              </Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-zinc-300">
                Study Guide
              </span>
            </nav>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              Complete Study Guide
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              How to Pass the ServiceNow CIS-CSM Exam
              <span className="mt-2 block text-lg font-normal text-zinc-500 dark:text-zinc-400 sm:text-xl">
                Certified Implementation Specialist — Customer Service
                Management
              </span>
            </h1>

            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300">
              CIS-CSM validates that you can implement customer service on the
              Now Platform: data models, case configuration, routing, workspace,
              portals, knowledge, analytics, and cross-product fulfillment. This
              CIS-DF-style guide turns the blueprint into a practical 4-week
              plan with hands-on labs, scenario drills, and readiness gates.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                {
                  label: "Exam Questions",
                  value: cert.examDetails.questionCount,
                },
                {
                  label: "Duration",
                  value: `${cert.examDetails.duration} min`,
                },
                {
                  label: "Pass Score",
                  value: `${cert.examDetails.passingScore}%`,
                },
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

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cis-csm/mock-exam"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Take a Timed CIS-CSM Mock Exam
              </Link>
              <Link
                href="/cis-csm/practice-questions"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                View All {totalQuestions}+ Questions
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              About the CIS-CSM Exam
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              The CIS-CSM exam is an implementation-specialist certification for
              ServiceNow Customer Service Management. Expect questions that
              combine customer data modeling, CSM configuration, case lifecycle,
              agent/customer experiences, knowledge, analytics, and platform
              best practices.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-5 shadow-sm dark:bg-zinc-900">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Prerequisites
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {cert.prerequisites.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-white p-5 shadow-sm dark:bg-zinc-900">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Exam Format
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <li>60 multiple-choice and multiple-select questions</li>
                  <li>90 minutes to complete</li>
                  <li>Plan for a 70% passing score</li>
                  <li>Online proctored or test-center delivery</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              CIS-CSM Domain Breakdown
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Study time should follow the official blueprint. CSM Configuration
              (38%) and the Foundational Data Model (27%) represent 65% of the
              exam, so they should drive your first two weeks.
            </p>

            <div className="mt-8 space-y-4">
              {domains.map((domain) => (
                <div
                  key={domain.slug}
                  className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {domain.name}
                        </h3>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          {domain.percentage}%
                        </span>
                        {topDomains.some(
                          (item) => item.slug === domain.slug,
                        ) && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                            High priority
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {domain.description}
                      </p>
                      <ul className="mt-3 space-y-1">
                        {(domainFocus[domain.slug] || []).map((topic) => (
                          <li
                            key={topic}
                            className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
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
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${domain.percentage}%` }}
                        />
                      </div>
                      <Link
                        href={`/cis-csm/practice-questions/${domain.slug}`}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        Practice →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cert.blueprintUrl && (
              <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                Domain percentages sourced from the{" "}
                <a
                  href={cert.blueprintUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  official CIS-CSM exam blueprint on NowLearning →
                </a>
              </p>
            )}
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              How to Study for CIS-CSM
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Follow this sequence so customer model, configuration, case
              process, and experience layers build on each other.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {howToSteps.map((step) => (
                <div
                  key={step.position}
                  className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="text-xs font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    Step {step.position}
                  </div>
                  <h3 className="mt-2 font-semibold text-zinc-900 dark:text-zinc-100">
                    {step.name}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                  4-week study calendar
                </p>
                <h2 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  A realistic CIS-CSM prep plan
                </h2>
              </div>
              <Link
                href="/cis-csm/mock-exam"
                className="inline-flex items-center justify-center rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
              >
                Start with a baseline mock exam →
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {fourWeekPlan.map((week) => (
                <div
                  key={week.week}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {week.week}
                    </span>
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {week.focus}
                    </span>
                  </div>
                  <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-100">
                    {week.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {week.goal}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {week.tasks.map((task) => (
                      <li
                        key={task}
                        className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        {task}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 rounded-lg border border-emerald-100 bg-white p-3 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-100">
                    <span className="font-semibold">Ready to move on:</span>{" "}
                    {week.success}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              CIS-CSM Hands-On Lab Checklist
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Do these labs in a ServiceNow training instance or Personal
              Developer Instance. CIS-CSM rewards candidates who can connect
              configuration choices to real customer and agent behavior.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {pdiLabChecklist.map((lab) => (
                <div
                  key={lab.lab}
                  className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    {lab.domain}
                  </div>
                  <h3 className="mt-2 font-semibold text-zinc-900 dark:text-zinc-100">
                    {lab.lab}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {lab.outcome}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 py-16 dark:border-zinc-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Scenario Drills: Think Like a CSM Implementer
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              CIS-CSM questions often test the best implementation choice. Use
              these prompts as mini oral exams before you rely on memorized
              terms.
            </p>
            <div className="mt-8 space-y-4">
              {decisionDrills.map((drill) => (
                <div
                  key={drill.prompt}
                  className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {drill.prompt}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-amber-700 dark:text-amber-300">
                    Exam test: {drill.test}
                  </p>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                      Strong answer:
                    </span>{" "}
                    {drill.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Common CIS-CSM Mistakes to Avoid
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              These traps make implementation-specialist questions harder than
              they need to be. Fix them before your final mock exams.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {commonMistakes.map((pitfall) => (
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

        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  Free CIS-CSM Practice Questions
                </h2>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  Sample questions from high-yield CIS-CSM domains. Use the full
                  question bank for timed readiness checks.
                </p>
              </div>
              <Link
                href="/cis-csm/practice-questions"
                className="hidden text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 sm:block"
              >
                See all {totalQuestions}+ questions →
              </Link>
            </div>

            <div className="mt-8 space-y-6">
              {sampleQuestions.map((q, i) => (
                <div
                  key={q.question}
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
                      Question {i + 1} of {sampleQuestions.length}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {q.question}
                    </p>
                    <div className="mt-4 space-y-2">
                      {q.options.map((option) => (
                        <div
                          key={option}
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
                href="/cis-csm/mock-exam"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-8 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Take the Full CIS-CSM Mock Exam
              </Link>
              <p className="mt-3 text-sm text-zinc-500">
                {totalQuestions} questions · Timed · Instant results
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 py-16 dark:border-zinc-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Final CIS-CSM Readiness Checklist
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Do not schedule the real exam until each item is true. The goal
                is confident implementation judgment, not answer memorization.
              </p>
              <ul className="mt-6 space-y-3">
                {readinessChecklist.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                      ✓
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/cis-csm/mock-exam"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Start a CIS-CSM Mock Exam
                </Link>
                <Link
                  href="/cis-csm/practice-questions"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-emerald-300 bg-white px-6 text-base font-medium text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-700 dark:bg-zinc-900 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                >
                  Drill CIS-CSM Practice Questions
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
