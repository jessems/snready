import { Metadata } from "next";
import Link from "next/link";
import { getCertificationBySlug, getTotalQuestionCount } from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title: "How to Pass CIS-SAM — Complete ServiceNow SAM Study Guide [2026]",
  description:
    "Complete ServiceNow CIS-SAM study guide with official domain weights, a 4-week study calendar, SAM Pro implementation labs, scenario drills, common mistakes, readiness checklist, and CIS-SAM practice questions.",
  keywords: [
    "CIS-SAM study guide",
    "ServiceNow CIS-SAM exam prep",
    "Certified Implementation Specialist Software Asset Management",
    "ServiceNow SAM certification",
    "CIS-SAM practice questions",
    "CIS-SAM exam domains",
    "Software Asset Management Professional exam",
    "ServiceNow SAM Pro study guide",
    "CIS-SAM mock exam",
  ],
  alternates: {
    canonical: "/cis-sam/study-guide",
  },
  openGraph: {
    title: "How to Pass CIS-SAM | Complete Study Guide | SNReady",
    description:
      "Domain-by-domain CIS-SAM study plan with a 4-week calendar, hands-on SAM labs, scenario drills, and practice-question links.",
    type: "article",
  },
};

const CERT_SLUG = "cis-sam";

const domainFocus: Record<string, string[]> = {
  "software-compliance": [
    "Software models, discovery models, normalization, reconciliation, and how entitlements become compliance positions",
    "Publisher pack behavior, license metrics, rights calculations, remediation options, and true-up/true-down decisions",
    "How to explain over-licensed, under-licensed, unlicensed, and non-compliant software positions from the workspace",
  ],
  "data-integrity": [
    "Discovery, SCCM/Jamf/Intune-style inventory imports, normalization sources, and software installation evidence quality",
    "Company, user, device, cost center, location, and hardware/software relationships that affect compliance calculations",
    "Data completeness, duplicate or stale records, normalization gaps, and why SAM depends on trusted CMDB/asset data",
  ],
  "extending-sam": [
    "Content Service, publisher packs, custom products, custom metrics, and extending SAM when out-of-box content is not enough",
    "Software lifecycle, reclamation, reclamation candidates, workflow/Flow Designer touchpoints, and optimization use cases",
    "Integration and reporting extensions that support audit response, renewals, chargeback, and executive visibility",
  ],
  "sam-fundamentals": [
    "SAM Professional purpose, personas, workspaces, implementation sequence, and relationship to ITAM/CMDB/Discovery",
    "Entitlements, software models, discovery models, installations, allocations, subscriptions, contracts, and procurement context",
    "Why license compliance is a data-and-process discipline, not just a dashboard score",
  ],
  "operational-integration": [
    "Procurement, Contract Management, HAM/CMDB, Discovery, Service Catalog, and ITSM touchpoints that keep SAM current",
    "Renewal planning, audit preparation, reclaim processes, approval ownership, and handoffs between SAM teams and operations",
    "Dashboards, savings/avoidance reporting, risk indicators, and operating cadence after implementation go-live",
  ],
};

const faqData = [
  {
    question: "What is the ServiceNow CIS-SAM exam?",
    answer:
      "The ServiceNow Certified Implementation Specialist - Software Asset Management exam validates that you can implement and operate SAM Professional: data integrity, software compliance, entitlements, normalization, integrations, and SAM optimization processes.",
  },
  {
    question: "How many questions are on CIS-SAM?",
    answer:
      "SNReady lists CIS-SAM as a 60-question exam with a 90-minute time limit and a 70% passing score for planning purposes. The exam uses multiple-choice and multiple-select questions.",
  },
  {
    question: "Which CIS-SAM domains should I study first?",
    answer:
      "Start with Software Compliance Management at 30% and Data Integrity & Sources at 28%. Together they represent 58% of the exam and drive most scenario questions about normalization, entitlements, discovery evidence, reconciliation, and compliance positions.",
  },
  {
    question: "Is CIS-SAM more technical or process-oriented?",
    answer:
      "It is both. CIS-SAM is less scripting-heavy than CAD, but it requires technical data fluency and implementation judgment: which source provides evidence, why a compliance position is wrong, what entitlement or model is missing, and how SAM integrates with procurement, contracts, CMDB, and operations.",
  },
  {
    question: "How long should I study for CIS-SAM?",
    answer:
      "Most candidates with CSA and ITAM exposure should plan four focused weeks. Add extra time if you have never worked with SAM Professional workspaces, software models, discovery models, entitlements, publisher packs, or reconciliation results.",
  },
  {
    question: "What hands-on practice helps most for CIS-SAM?",
    answer:
      "Use a lab or training instance to inspect software installations, software models, discovery models, normalization results, entitlements, contracts, license metrics, compliance workbench results, reclamation candidates, and SAM dashboards.",
  },
  {
    question: "When am I ready to schedule CIS-SAM?",
    answer:
      "Schedule when you can score 80% or higher on two timed mixed-domain mock exams, explain every missed question as a SAM implementation decision, and troubleshoot a wrong compliance result back to source data, model mapping, entitlement, metric, or reconciliation logic.",
  },
];

const howToSteps = [
  {
    name: "Take a baseline CIS-SAM practice test",
    text: "Start with a mixed-domain diagnostic. Tag misses as data source, normalization, entitlement, compliance calculation, operational integration, or SAM extension topics.",
    position: 1,
  },
  {
    name: "Master compliance and data integrity first",
    text: "Software Compliance Management and Data Integrity & Sources are the highest-weight domains. Study how evidence flows from discovery sources into normalized models, entitlements, and compliance positions.",
    position: 2,
  },
  {
    name: "Trace every result to a record relationship",
    text: "For each scenario, ask which record explains the answer: software installation, discovery model, software model, entitlement, contract, user/device, company, metric, or publisher content.",
    position: 3,
  },
  {
    name: "Practice operational integration decisions",
    text: "SAM only stays accurate when procurement, contracts, Discovery, CMDB, reclamation, and operational dashboards are connected. Study handoffs and ownership, not only configuration screens.",
    position: 4,
  },
  {
    name: "Finish with timed mocks and a miss log",
    text: "Retake mixed mock exams until you score 80% or higher twice and can rewrite every miss as a rule about source data, model mapping, rights, metrics, remediation, or process ownership.",
    position: 5,
  },
];

const fourWeekPlan = [
  {
    week: "Week 1",
    title: "SAM baseline and data model",
    focus: "Diagnostic + SAM Fundamentals + Data Integrity",
    goal: "Understand the SAM record chain before studying compliance calculations.",
    tasks: [
      "Read the CIS-SAM blueprint and sort domains by weight: 30%, 28%, 15%, 14%, 13%.",
      "Map the relationship between software installations, discovery models, software models, entitlements, contracts, users, devices, companies, and CMDB/asset records.",
      "Take 40-60 mixed practice questions and create a miss log grouped by data, model, entitlement, metric, or process issue.",
    ],
    success:
      "You can explain how poor discovery or asset data creates unreliable normalization and compliance results.",
  },
  {
    week: "Week 2",
    title: "Software compliance management",
    focus: "Software Compliance Management (30%)",
    goal: "Make compliance workbench results explainable instead of mysterious.",
    tasks: [
      "Study normalization, reconciliation, publisher packs, software models, discovery models, entitlements, allocations, subscriptions, and license metrics.",
      "Practice scenarios for over-licensed, under-licensed, unlicensed, and non-compliant software positions.",
      "Run Software Compliance practice until you can identify the likely record or metric causing each result.",
    ],
    success:
      "You can troubleshoot a wrong compliance position by checking evidence, normalization, model mapping, entitlement rights, metric, and reconciliation logic.",
  },
  {
    week: "Week 3",
    title: "Extending SAM and operational handoffs",
    focus: "Extending SAM + Operational Integration",
    goal: "Connect SAM configuration to real savings, audit, renewal, and operations workflows.",
    tasks: [
      "Review Content Service, publisher packs, custom products, custom metrics, lifecycle states, and reclamation candidates.",
      "Trace operational handoffs with Procurement, Contract Management, Discovery, CMDB/HAM, ITSM, approvals, and reporting.",
      "Build scenario explanations for renewals, audits, reclamation, chargeback, and dashboard ownership.",
    ],
    success:
      "You can decide whether a scenario needs better source data, publisher content, custom modeling, entitlement cleanup, reclamation, procurement action, or operational governance.",
  },
  {
    week: "Week 4",
    title: "Timed exam simulation",
    focus: "Mixed mocks + remediation",
    goal: "Convert SAM implementation knowledge into exam-speed decisions.",
    tasks: [
      "Take at least two 60-question timed CIS-SAM mock exams.",
      "Review every miss by domain and by artifact: data source, model, entitlement, metric, compliance result, integration, or extension.",
      "Repeat weak-domain drills until no domain is below 70% and full mocks are consistently 80%+.",
    ],
    success:
      "You can finish a full CIS-SAM mock under 90 minutes, score 80%+, and explain each answer with the SAM record or process it depends on.",
  },
];

const labChecklist = [
  {
    lab: "SAM record-chain walkthrough",
    domain: "SAM Overview & Fundamentals",
    outcome:
      "Trace a software installation to its discovery model, normalized software model, entitlement, contract, and compliance result so the core data flow is visible.",
  },
  {
    lab: "Inventory and normalization review",
    domain: "Data Integrity & Sources",
    outcome:
      "Compare discovery/import evidence, normalization status, stale or duplicate records, and missing company/user/device relationships that can distort SAM results.",
  },
  {
    lab: "Compliance workbench drill",
    domain: "Software Compliance Management",
    outcome:
      "Review compliant, under-licensed, over-licensed, and unlicensed positions; identify whether each result is driven by install evidence, model mapping, entitlement rights, or metrics.",
  },
  {
    lab: "Entitlement and metric validation",
    domain: "Software Compliance Management",
    outcome:
      "Inspect entitlement quantities, allocations, subscription details, license metrics, downgrade/upgrade rights, and publisher-specific rules before accepting a compliance position.",
  },
  {
    lab: "Reclamation and optimization scenario",
    domain: "Extending SAM",
    outcome:
      "Identify reclaim candidates, define ownership and approval flow, and explain how reclamation ties to savings, compliance risk, and user communication.",
  },
  {
    lab: "Operational integration map",
    domain: "Operational Integration",
    outcome:
      "Draw how SAM exchanges data and decisions with Discovery, CMDB/HAM, Procurement, Contract Management, Service Catalog, ITSM, and reporting stakeholders.",
  },
];

const decisionDrills = [
  {
    prompt:
      "A publisher compliance position shows under-licensed even though procurement says enough licenses were purchased.",
    test: "Do you trust the purchase record, or inspect entitlement and metric details?",
    answer:
      "Inspect entitlement records, allocations, license metric, downgrade/upgrade rights, contract linkage, model mapping, and normalization. Purchases alone do not prove usable compliance rights.",
  },
  {
    prompt:
      "A discovered application does not normalize to the expected software model.",
    test: "Can you separate inventory evidence from content/model mapping?",
    answer:
      "Check discovery model evidence, normalization status, publisher/product/version values, Content Service coverage, software model mapping, and whether a custom model or content update is needed.",
  },
  {
    prompt:
      "A team wants to reclaim licenses immediately from all users with low usage.",
    test: "Can you balance savings with governance and user impact?",
    answer:
      "Use a controlled reclamation process with usage evidence, approvals, exceptions, communication, and rollback/fulfillment path. SAM optimization should reduce waste without disrupting valid business need.",
  },
  {
    prompt:
      "SAM dashboards are inconsistent with asset reports for the same software estate.",
    test: "Is this a dashboard problem or data-source alignment problem?",
    answer:
      "Start with data lineage: inventory source timing, duplicate/stale devices, company/user relationships, normalization, software model mapping, and report filters before changing dashboard design.",
  },
  {
    prompt:
      "A renewal is due and the SAM team cannot explain current usage, compliance, or reclaim candidates.",
    test: "Can you connect SAM to renewal operations?",
    answer:
      "Use compliance positions, usage evidence, reclamation candidates, contract data, and optimization dashboards to prepare negotiation and true-up decisions before renewal deadlines.",
  },
];

const commonMistakes = [
  {
    title: "Studying compliance results without the data path",
    body: "CIS-SAM questions often become easy once you trace source inventory, discovery models, software models, entitlements, metrics, and reconciliation. Do not memorize dashboard labels in isolation.",
    icon: "🧭",
  },
  {
    title: "Underweighting data integrity",
    body: "Data Integrity & Sources is 28% of the exam. Bad device, user, company, discovery, or normalization data can invalidate otherwise correct entitlement work.",
    icon: "🧹",
  },
  {
    title: "Treating entitlements as purchase receipts only",
    body: "Entitlements represent rights. Compliance depends on quantities, allocations, license metrics, model linkage, contracts, subscriptions, and publisher rules—not just a purchase count.",
    icon: "📄",
  },
  {
    title: "Ignoring publisher content and normalization",
    body: "Publisher packs, Content Service, software models, and discovery models decide how raw evidence becomes manageable software products. Normalization gaps are common exam traps.",
    icon: "📦",
  },
  {
    title: "Separating SAM from operations",
    body: "SAM Professional succeeds when procurement, contracts, CMDB/HAM, Discovery, reclamation, and reporting cadence are integrated. The exam tests those handoffs.",
    icon: "🔗",
  },
  {
    title: "Optimizing licenses without approvals",
    body: "Reclamation and remediation need usage evidence, business owner input, user communication, and governance. Fast license removal without process can create service disruption.",
    icon: "⚖️",
  },
];

const sampleQuestions = [
  {
    topic: "Software Compliance Management",
    topicSlug: "software-compliance",
    weight: 30,
    question:
      "A software product appears under-licensed after reconciliation. Which record type is most important to inspect to confirm purchased rights and license metric details?",
    options: [
      "Entitlement",
      "Knowledge article",
      "Incident category",
      "Portal theme",
    ],
    correctAnswer: "Entitlement",
    explanation:
      "Entitlements represent license rights and include quantities, metrics, allocations, contracts, and product/model relationships that drive compliance calculations.",
  },
  {
    topic: "Data Integrity & Sources",
    topicSlug: "data-integrity",
    weight: 28,
    question:
      "A compliance position looks wrong because software installs are missing for several devices. What should a SAM implementer check first?",
    options: [
      "Inventory/discovery source completeness and normalization status",
      "The color of the dashboard card",
      "Only the user notification preference",
      "The incident closure code list",
    ],
    correctAnswer:
      "Inventory/discovery source completeness and normalization status",
    explanation:
      "SAM compliance depends on trusted source evidence. Missing or stale inventory and unresolved normalization can distort installs, models, and compliance outcomes.",
  },
  {
    topic: "Extending SAM",
    topicSlug: "extending-sam",
    weight: 15,
    question:
      "An application is not covered by out-of-box publisher content but must be tracked for compliance. What may be required?",
    options: [
      "Custom software model or metric configuration",
      "Deleting all software installations",
      "Turning off contract management",
      "Creating a CAB meeting for every install",
    ],
    correctAnswer: "Custom software model or metric configuration",
    explanation:
      "When out-of-box content is insufficient, SAM may need custom products, models, metrics, or mappings so software evidence can be managed correctly.",
  },
  {
    topic: "Operational Integration",
    topicSlug: "operational-integration",
    weight: 13,
    question: "Which integration outcome best supports a renewal negotiation?",
    options: [
      "Current compliance, usage, entitlement, contract, and reclaim-candidate data",
      "Only the number of open incidents",
      "A list of portal fonts",
      "Unreviewed software installation records only",
    ],
    correctAnswer:
      "Current compliance, usage, entitlement, contract, and reclaim-candidate data",
    explanation:
      "Renewals require an operational SAM view: what is owned, what is used, where risk exists, and what can be reclaimed or optimized before negotiation.",
  },
];

const readinessChecklist = [
  "Score 80% or higher on two timed CIS-SAM mock exams.",
  "Explain Software Compliance Management and Data Integrity without notes; together they are 58% of the exam.",
  "Trace a compliance result from installation evidence through discovery model, software model, entitlement, metric, and reconciliation.",
  "Identify when bad source data, normalization gaps, missing entitlements, incorrect metrics, or duplicate/stale records explain a wrong result.",
  "Describe how SAM integrates with Discovery, CMDB/HAM, Procurement, Contract Management, reclamation, Service Catalog, ITSM, and reporting.",
  "Maintain a miss log where every wrong answer is rewritten as an implementation rule instead of a memorized stem.",
];

export default function CISSAMStudyGuidePage() {
  const cert = getCertificationBySlug(CERT_SLUG)!;
  const totalQuestions = getTotalQuestionCount(CERT_SLUG);
  const domains = [...cert.domains].sort((a, b) => b.percentage - a.percentage);
  const topDomains = domains.filter((domain) => domain.percentage >= 25);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Certifications", url: "/certifications" },
    { name: "CIS-SAM", url: "/cis-sam" },
    { name: "Study Guide", url: "/cis-sam/study-guide" },
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
    name: "How to Pass the ServiceNow CIS-SAM Exam",
    description:
      "A four-week, domain-weighted study plan for the ServiceNow Certified Implementation Specialist - Software Asset Management exam.",
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
    name: "ServiceNow CIS-SAM Exam Preparation",
    description:
      "Complete SNReady study guide for the ServiceNow CIS-SAM certification exam, covering SAM fundamentals, data integrity, software compliance, operational integration, and extending SAM.",
    provider: {
      "@type": "Organization",
      name: "SNReady",
      url: "https://snready.com",
    },
    educationalLevel: "Professional",
    about: {
      "@type": "Thing",
      name: "ServiceNow CIS-SAM",
      description:
        "Certified Implementation Specialist - Software Asset Management covering SAM Professional implementation, compliance, data sources, entitlements, and optimization.",
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
              <Link href="/cis-sam" className="hover:text-emerald-600">
                CIS-SAM
              </Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-zinc-300">
                Study Guide
              </span>
            </nav>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              Complete ITAM Study Guide
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              How to Pass the ServiceNow CIS-SAM Exam
              <span className="mt-2 block text-lg font-normal text-zinc-500 dark:text-zinc-400 sm:text-xl">
                Certified Implementation Specialist — Software Asset Management
              </span>
            </h1>

            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300">
              CIS-SAM validates that you can implement ServiceNow Software Asset
              Management Professional and explain license compliance from raw
              inventory evidence through normalized models, entitlements,
              metrics, remediation, and operational governance. This
              CIS-DF-style guide turns the blueprint into a four-week plan with
              hands-on labs, scenario drills, common mistakes, and final
              readiness gates.
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
                href="/cis-sam/mock-exam"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Take a Timed CIS-SAM Mock Exam
              </Link>
              <Link
                href="/cis-sam/practice-questions"
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
              About the CIS-SAM Exam
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              The CIS-SAM exam is an implementation-specialist certification for
              ServiceNow Software Asset Management. Expect questions about data
              sources, normalization, software models, entitlements, compliance
              results, publisher content, operational integrations, and
              optimization workflows such as reclamation and renewal planning.
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
                  <li>
                    {cert.examDetails.questionCount} multiple-choice and
                    multiple-select questions
                  </li>
                  <li>{cert.examDetails.duration} minutes to complete</li>
                  <li>{cert.examDetails.passingScore}% planning pass score</li>
                  <li>Format: {cert.examDetails.format}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              CIS-SAM Domain Breakdown
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Study time should follow official blueprint weight. Software
              Compliance Management and Data Integrity & Sources account for 58%
              of the exam, so they should dominate your first two weeks.
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
                        href={`/cis-sam/practice-questions/${domain.slug}`}
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
                  official CIS-SAM exam blueprint on NowLearning →
                </a>
              </p>
            )}
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              How to Study for CIS-SAM
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Follow this order so source data, normalization, compliance, and
              operational handoffs reinforce each other.
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
                  A realistic CIS-SAM prep plan
                </h2>
              </div>
              <Link
                href="/cis-sam/mock-exam"
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
              CIS-SAM Hands-on Lab Checklist
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Do these labs in a ServiceNow training, sandbox, or PDI-style
              environment where SAM Professional records are available. The goal
              is to connect exam terms to the records that drive compliance.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {labChecklist.map((lab) => (
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
              Scenario Drills: Think Like a SAM Implementer
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              CIS-SAM questions reward candidates who can identify the record,
              source, metric, or process that explains a compliance outcome.
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
              Common CIS-SAM Mistakes to Avoid
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              These mistakes make SAM questions feel unpredictable. Avoid them
              by tracing each answer back to data, rights, metrics, and
              ownership.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {commonMistakes.map((mistake) => (
                <div
                  key={mistake.title}
                  className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="mb-3 text-2xl">{mistake.icon}</div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {mistake.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {mistake.body}
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
                  Free CIS-SAM Practice Questions
                </h2>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  Sample questions from high-impact SAM areas. Use the full bank
                  for timed mixed-domain practice.
                </p>
              </div>
              <Link
                href="/cis-sam/practice-questions"
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
                    <Link
                      href={`/cis-sam/practice-questions/${q.topicSlug}`}
                      className="mt-4 inline-flex text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                    >
                      Practice more {q.topic} questions →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/cis-sam/mock-exam"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-8 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Take the Full CIS-SAM Mock Exam
              </Link>
              <p className="mt-3 text-sm text-zinc-500">
                {totalQuestions} questions · Timed · Instant results
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    Final gate
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    Schedule CIS-SAM only when these are true
                  </h2>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    Use observable readiness signals instead of vague
                    confidence.
                  </p>
                </div>
                <Link
                  href="/cis-sam/practice-questions"
                  className="inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Drill weak domains →
                </Link>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {readinessChecklist.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-emerald-600 py-16 dark:bg-emerald-700">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white">
              Ready to Prove CIS-SAM Readiness?
            </h2>
            <p className="mt-4 text-emerald-100">
              {totalQuestions}+ CIS-SAM practice questions across every official
              domain. Drill compliance and data-integrity weak spots first, then
              validate with a timed mock exam.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/cis-sam/mock-exam"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-6 text-base font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Start CIS-SAM Mock Exam
              </Link>
              <Link
                href="/cis-sam/practice-questions"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-emerald-300 px-6 text-base font-semibold text-white hover:bg-emerald-700"
              >
                Practice by SAM Domain
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 py-16 dark:border-zinc-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              CIS-SAM FAQ
            </h2>
            <div className="mt-8 space-y-4">
              {faqData.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <summary className="cursor-pointer list-none font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
