import { Metadata } from "next";
import Link from "next/link";
import { getCertificationBySlug, getTotalQuestionCount } from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title:
    "How to Pass CIS-HAM — Complete Hardware Asset Management Study Guide [2026]",
  description:
    "Complete CIS-HAM study guide for the ServiceNow Certified Implementation Specialist - Hardware Asset Management exam. Includes domain weights, a 4-week study calendar, PDI lab checklist, scenario drills, common mistakes, and practice questions.",
  keywords: [
    "CIS-HAM study guide",
    "CIS-HAM exam prep",
    "ServiceNow Hardware Asset Management certification",
    "CIS-HAM practice questions",
    "ServiceNow HAM exam domains",
    "hardware asset management study plan",
    "CIS-HAM passing score",
    "ServiceNow ITAM certification",
  ],
  alternates: {
    canonical: "/cis-ham/study-guide",
  },
  openGraph: {
    title: "How to Pass CIS-HAM | Complete Study Guide | SNReady",
    description:
      "Domain-by-domain CIS-HAM study plan with a 4-week calendar, hands-on HAM labs, readiness checklist, and practice questions.",
    type: "article",
  },
};

const CERT_SLUG = "cis-ham";

const SAMPLE_QUESTIONS = [
  {
    domain: "Practical Asset Management",
    slug: "practical-management",
    weight: 30,
    question: "In which table are consumable assets stored in ServiceNow?",
    options: [
      "Hardware Asset [alm_hardware]",
      "Consumable [alm_consumable]",
      "Asset [alm_asset]",
      "Consumable Model [cmdb_consumable_product_model]",
    ],
    answer: "Consumable [alm_consumable]",
    explanation:
      "Consumable assets are stored in the Consumable [alm_consumable] table. Consumables are tracked as groups of the same model rather than as individually serialized assets.",
  },
  {
    domain: "Data Integrity & Sources",
    slug: "data-integrity",
    weight: 27,
    question:
      "A laptop is discovered as a CI but does not have a trustworthy asset record. What should a HAM implementer investigate first?",
    options: [
      "Whether discovery can create or update the hardware asset relationship correctly",
      "Whether the depreciation schedule is monthly or yearly",
      "Whether the catalog item has a two-step checkout process",
      "Whether the disposal vendor accepts encrypted disks",
    ],
    answer:
      "Whether discovery can create or update the hardware asset relationship correctly",
    explanation:
      "CIS-HAM emphasizes trustworthy asset and CI data. When a discovered CI is not aligned to the asset record, start with the data source, normalization, and asset-CI relationship before downstream financial or retirement questions.",
  },
  {
    domain: "ITAM Overview & Fundamentals",
    slug: "itam-fundamentals",
    weight: 20,
    question: "Why is CIS-DF listed as a prerequisite for CIS-HAM candidates?",
    options: [
      "HAM uses trusted CMDB and CSDM data to connect hardware assets with services and operational records",
      "HAM requires custom CMDB tables for every procurement process",
      "CIS-HAM is only available to Discovery administrators",
      "Hardware assets cannot exist unless every CI relationship is manually created",
    ],
    answer:
      "HAM uses trusted CMDB and CSDM data to connect hardware assets with services and operational records",
    explanation:
      "Hardware Asset Management depends on reliable asset, model, CI, and lifecycle data. CIS-DF prepares candidates for the data-governance and CMDB concepts that support HAM implementations.",
  },
  {
    domain: "Operational Integration",
    slug: "operational-integration",
    weight: 18,
    question:
      "A manager wants a weekly report showing laptops approaching end of life by department. Which HAM skill does this test?",
    options: [
      "Operational reporting and asset hygiene using Hardware Asset Workspace dashboards",
      "Creating a new currency conversion rate",
      "Changing the global incident priority matrix",
      "Disabling model normalization for imported assets",
    ],
    answer:
      "Operational reporting and asset hygiene using Hardware Asset Workspace dashboards",
    explanation:
      "Operational Integration covers reports, dashboards, Hardware Asset Workspace, requests, procurement, data certification, and hygiene — the practical reporting layer that turns HAM data into decisions.",
  },
  {
    domain: "Financial Management",
    slug: "financial-management",
    weight: 5,
    question:
      "Which topic belongs most directly to the CIS-HAM Financial Management domain?",
    options: [
      "Depreciation and total cost of ownership",
      "MID Server credential affinity",
      "CSDM service portfolio taxonomy",
      "Major incident state flow",
    ],
    answer: "Depreciation and total cost of ownership",
    explanation:
      "Financial Management is only 5% of the blueprint, but it still appears on the exam. Know hardware contract financials, expense lines, depreciation, fixed assets, and total cost of ownership.",
  },
];

const faqData = [
  {
    question: "What is the CIS-HAM certification?",
    answer:
      "CIS-HAM is the ServiceNow Certified Implementation Specialist - Hardware Asset Management certification. It validates your ability to implement Hardware Asset Management, including hardware asset lifecycle processes, data integrity, inventory, procurement, operational integration, and financial management.",
  },
  {
    question: "How many questions are on the CIS-HAM exam?",
    answer:
      "The CIS-HAM exam has 60 multiple-choice and multiple-select questions. Candidates have 90 minutes and need a 70% or higher score to pass.",
  },
  {
    question: "What are the CIS-HAM prerequisites?",
    answer:
      "ServiceNow lists CSA, CIS-DF, hardware asset management experience, and understanding of the asset lifecycle as prerequisites or expected background for CIS-HAM candidates.",
  },
  {
    question: "What CIS-HAM domain should I study first?",
    answer:
      "Start with Practical Asset Management because it is the largest domain at 30%, then Data Integrity & Sources at 27%. Together they represent 57% of the exam and cover the most scenario-heavy implementation decisions.",
  },
  {
    question: "How long should I study for CIS-HAM?",
    answer:
      "Most CSA/CIS-DF-level candidates should budget 4 weeks: one week for ITAM foundations, one week for data integrity, one week for practical asset processes and operational integration, and one week for timed mock exams and remediation.",
  },
  {
    question: "Is CIS-HAM mostly memorization or scenario based?",
    answer:
      "Expect a mix. You need table, lifecycle, workspace, and model-normalization vocabulary, but the hardest questions usually ask what an implementer should configure, validate, or troubleshoot in a realistic asset-management scenario.",
  },
];

const howToSteps = [
  {
    name: "Map the official blueprint to your study tracker",
    text: "Sort every objective by domain weight, and mark Practical Asset Management plus Data Integrity & Sources as high-priority because they are 57% of the exam.",
  },
  {
    name: "Build the ITAM and HAM foundation",
    text: "Learn core personas, roles, asset lifecycle states, hardware models, asset vs. CI relationships, and the purpose of Hardware Asset Workspace.",
  },
  {
    name: "Master data integrity before process automation",
    text: "Practice normalization, data sources, asset-CI alignment, discovery-fed data, and why untrusted data breaks procurement, inventory, and retirement decisions.",
  },
  {
    name: "Practice the end-to-end asset lifecycle",
    text: "Trace hardware from request and procurement through receiving, stockroom, assignment, transfer, repair, return, retirement, and disposal.",
  },
  {
    name: "Use timed mock exams and a miss log",
    text: "Take full-length practice exams, group missed questions by domain, and keep retesting until your scores are consistently above 80%.",
  },
];

const fourWeekPlan = [
  {
    week: "Week 1",
    title: "ITAM and HAM foundation",
    focus: "ITAM Overview & Fundamentals",
    tasks: [
      "Read the official CIS-HAM blueprint and copy each objective into a study tracker.",
      "Define asset, CI, hardware model, stockroom, consumable, contract, and lifecycle state in your own words.",
      "Take a 25-question diagnostic quiz to identify weak domains before deep study.",
    ],
    success:
      "You can explain the asset lifecycle and the difference between an asset record, a CI, and a hardware model without notes.",
  },
  {
    week: "Week 2",
    title: "Data integrity and sources",
    focus: "Data Integrity & Sources (27%)",
    tasks: [
      "Review normalization, model categories, hardware model normalization, and trusted data sources.",
      "Trace how discovered CIs relate to hardware asset records and where data-quality issues appear.",
      "Practice data-integrity questions until you can justify the source of truth for each attribute.",
    ],
    success:
      "You can diagnose duplicate, stale, or unnormalized hardware data and explain the operational impact.",
  },
  {
    week: "Week 3",
    title: "Lifecycle execution",
    focus: "Practical Asset Management + Operational Integration",
    tasks: [
      "Walk through request, procure, receive, stock, deploy, maintain, transfer, retire, and dispose flows.",
      "Review consumables, inventory stock, asset tasks, contracts, automation, reports, dashboards, and Hardware Asset Workspace.",
      "Run domain-specific practice questions for Practical Asset Management until it is your strongest area.",
    ],
    success:
      "You can choose the right HAM process step for realistic stockroom, consumable, procurement, repair, and disposal scenarios.",
  },
  {
    week: "Week 4",
    title: "Mock exams and remediation",
    focus: "Full exam simulation",
    tasks: [
      "Take two 60-question timed mock exams under a strict 90-minute limit.",
      "Build a miss log by blueprint domain and rewrite the governing rule for every miss.",
      "Review the small but testable Financial Management domain so easy points are not lost.",
    ],
    success:
      "You score 80%+ twice, finish with time to review, and can explain each missed question by domain.",
  },
];

const labChecklist = [
  {
    lab: "Asset vs. CI relationship trace",
    domain: "Data Integrity & Sources",
    outcome:
      "Open hardware asset and CI records, identify how they relate, and explain which fields belong to operational CMDB data vs. asset lifecycle data.",
  },
  {
    lab: "Hardware model normalization review",
    domain: "Data Integrity & Sources",
    outcome:
      "Inspect hardware models and model categories, then document how normalization supports reporting, lifecycle decisions, and procurement accuracy.",
  },
  {
    lab: "Stockroom and inventory movement",
    domain: "Practical Asset Management",
    outcome:
      "Trace a device or consumable through stockroom, transfer, assignment, return, and inventory audit activities.",
  },
  {
    lab: "Request-to-fulfillment walkthrough",
    domain: "Practical Asset Management / Operational Integration",
    outcome:
      "Follow a hardware request through approval, procurement, receiving, fulfillment, and asset record updates.",
  },
  {
    lab: "Hardware Asset Workspace dashboard review",
    domain: "Operational Integration",
    outcome:
      "Identify at least three dashboard insights that would drive asset hygiene, lifecycle, or procurement actions.",
  },
  {
    lab: "Retirement and disposal scenario",
    domain: "Practical Asset Management / Financial Management",
    outcome:
      "Document what changes when an asset moves from active use to retirement/disposal, including ownership, data wipe, contract, and financial considerations.",
  },
];

const decisionDrills = [
  {
    prompt:
      "A batch import creates hardware assets with inconsistent manufacturer and model names.",
    test: "Do you fix reports, or fix the data-normalization problem first?",
    answer:
      "Fix normalization and source data first. Reports built on unnormalized models will keep producing misleading lifecycle, stock, and cost conclusions.",
  },
  {
    prompt:
      "A discovered laptop has a CI record but the asset team cannot track ownership or stockroom history.",
    test: "Can you separate CMDB operational data from HAM lifecycle data?",
    answer:
      "Discovery may create or update CIs, but HAM needs asset lifecycle fields, ownership, stockroom, assignment, and procurement context. Validate the asset-CI relationship and asset data source.",
  },
  {
    prompt:
      "Finance asks why depreciation matters if Financial Management is only 5% of the exam.",
    test: "Can you explain why small domains still matter?",
    answer:
      "Financial Management is lightly weighted, but depreciation, fixed assets, expense lines, and total cost of ownership are easy points and important implementation conversations.",
  },
  {
    prompt:
      "A team wants to skip stockroom processes and update assigned_to manually after deployment.",
    test: "Can you identify lifecycle and audit risk?",
    answer:
      "Manual updates can hide procurement, receiving, transfer, return, and audit steps. Use the standard HAM lifecycle so inventory, ownership, and retirement data remain trustworthy.",
  },
];

const commonMistakes = [
  {
    title: "Treating assets and CIs as the same thing",
    body: "CIs support operational service management; assets track lifecycle, ownership, financial, stock, and procurement context. HAM questions often test the boundary.",
  },
  {
    title: "Understudying Practical Asset Management",
    body: "At 30%, this is the largest domain. Spend extra time on consumables, inventory, stockrooms, automation, asset flows, contracts, and retirement.",
  },
  {
    title: "Ignoring data integrity until the end",
    body: "Data Integrity & Sources is 27% and drives realistic implementation scenarios. Learn normalization, trusted data, discovery, and asset-CI alignment early.",
  },
  {
    title: "Only memorizing workspace names",
    body: "Know what Hardware Asset Workspace helps a practitioner decide: data hygiene, lifecycle action, requests, procurement, dashboard insights, and operational exceptions.",
  },
  {
    title: "Skipping the small financial domain",
    body: "Financial Management is only 5%, but it can include straightforward exam points about contracts, depreciation, fixed assets, expense lines, and TCO.",
  },
  {
    title: "Not practicing full timed exams",
    body: "CIS-HAM has 60 questions in 90 minutes. Timed practice forces you to recognize whether you truly understand the asset scenario or are guessing from keywords.",
  },
];

const readinessChecklist = [
  "Score 80% or higher on two timed CIS-HAM mock exams.",
  "Explain asset vs. CI vs. hardware model using a real implementation example.",
  "Trace a hardware asset from request/procurement through retirement/disposal.",
  "Diagnose a data-quality issue involving normalization, source data, or asset-CI mismatch.",
  "Use a PDI to locate Hardware Asset Workspace, asset records, hardware models, stockrooms, and consumables.",
  "Review missed questions by blueprint domain and restudy Practical Asset Management plus Data Integrity first.",
];

export default function CISHAMStudyGuidePage() {
  const cert = getCertificationBySlug(CERT_SLUG)!;
  const totalQuestions = getTotalQuestionCount(CERT_SLUG);
  const domains = [...cert.domains].sort((a, b) => b.percentage - a.percentage);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Certifications", url: "/certifications" },
    { name: "CIS-HAM", url: "/cis-ham" },
    { name: "Study Guide", url: "/cis-ham/study-guide" },
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
    name: "How to Pass the CIS-HAM Exam",
    description:
      "A step-by-step 4-week study plan for passing the ServiceNow CIS-HAM Hardware Asset Management certification exam.",
    totalTime: "P4W",
    step: howToSteps.map((step, index) => ({
      "@type": "HowToStep",
      name: step.name,
      text: step.text,
      position: index + 1,
    })),
  };

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "CIS-HAM Hardware Asset Management Exam Preparation",
    description:
      "Complete study guide for the ServiceNow CIS-HAM certification exam, covering all five Hardware Asset Management exam domains with labs, drills, and practice questions.",
    provider: {
      "@type": "Organization",
      name: "SNReady",
      url: "https://snready.com",
    },
    educationalLevel: "Professional",
    about: {
      "@type": "Thing",
      name: "ServiceNow CIS-HAM",
      description:
        "Certified Implementation Specialist - Hardware Asset Management covering ITAM foundations, data integrity, lifecycle processes, operations, and financial management.",
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

      <main className="min-h-screen">
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
              <Link href="/cis-ham" className="hover:text-emerald-600">
                CIS-HAM
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
              How to Pass the CIS-HAM Exam
              <span className="mt-2 block text-lg font-normal text-zinc-500 dark:text-zinc-400 sm:text-xl">
                Certified Implementation Specialist — Hardware Asset Management
              </span>
            </h1>

            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300">
              CIS-HAM validates whether you can implement ServiceNow Hardware
              Asset Management as a complete lifecycle program — not just create
              asset records. Use this guide to prioritize the highest-weight
              domains, practice realistic implementation decisions, and turn HAM
              data into trustworthy operational and financial insight.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Questions", value: cert.examDetails.questionCount },
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
                href="/cis-ham/mock-exam"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Take a Timed Mock Exam
              </Link>
              <Link
                href="/cis-ham/practice-questions"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                View All {totalQuestions}+ Questions
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              About the CIS-HAM Exam
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              The official blueprint covers five domains. The exam rewards
              candidates who understand how hardware asset data is sourced,
              normalized, governed, moved through lifecycle processes, surfaced
              in workspaces, and connected to financial outcomes.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-5 shadow-sm dark:bg-zinc-900">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Prerequisites
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {cert.prerequisites.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-white p-5 shadow-sm dark:bg-zinc-900">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Exam Format
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <li>60 multiple-choice and multiple-select questions</li>
                  <li>90 minutes to complete the exam</li>
                  <li>70% passing score</li>
                  <li>Blueprint release tracked in SNReady: {cert.release}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              CIS-HAM Domain Breakdown
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Study in blueprint-weight order. Practical Asset Management and
              Data Integrity & Sources together make up 57% of the exam, so they
              should receive the most practice time.
            </p>

            <div className="mt-8 space-y-4">
              {domains.map((domain) => (
                <div
                  key={domain.slug}
                  className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {domain.name}
                        </h3>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          {domain.percentage}%
                        </span>
                        {domain.percentage >= 27 && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
                            High priority
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {domain.description}
                      </p>
                    </div>
                    <div className="sm:min-w-36">
                      <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${domain.percentage}%` }}
                        />
                      </div>
                      <Link
                        href={`/cis-ham/practice-questions/${domain.slug}`}
                        className="mt-3 block text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                      >
                        Practice this domain →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              Domain percentages are sourced from the official ServiceNow
              CIS-HAM exam blueprint. Use the blueprint as the source of truth
              for registration and release-specific updates.
            </p>
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              How to Study for CIS-HAM
            </h2>
            <div className="mt-8 space-y-4">
              {howToSteps.map((step, index) => (
                <div
                  key={step.name}
                  className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    Step {index + 1}
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

        <section className="border-t border-zinc-200 py-16 dark:border-zinc-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                  4-week study calendar
                </p>
                <h2 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  A realistic CIS-HAM prep plan
                </h2>
              </div>
              <Link
                href="/cis-ham/mock-exam"
                className="inline-flex items-center justify-center rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300"
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

        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              CIS-HAM PDI Lab Checklist
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Use a Personal Developer Instance to connect the blueprint to the
              product. These labs are designed to make the scenario questions
              feel obvious.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {labChecklist.map((lab) => (
                <div
                  key={lab.lab}
                  className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
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
              Scenario Drills: Think Like a HAM Implementer
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Use these as decision drills. The goal is to explain the
              implementation tradeoff, not just match a keyword.
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

        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Common CIS-HAM Mistakes to Avoid
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {commonMistakes.map((mistake) => (
                <div
                  key={mistake.title}
                  className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
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

        <section className="border-t border-zinc-200 py-16 dark:border-zinc-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  Free CIS-HAM Practice Questions
                </h2>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  One sample question from each exam domain, with the correct
                  answer highlighted.
                </p>
              </div>
              <Link
                href="/cis-ham/practice-questions"
                className="hidden text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 sm:block"
              >
                See all {totalQuestions}+ questions →
              </Link>
            </div>

            <div className="mt-8 space-y-6">
              {SAMPLE_QUESTIONS.map((q, index) => (
                <div
                  key={q.question}
                  className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {q.domain}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {q.weight}% of exam
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400">
                      Question {index + 1} of {SAMPLE_QUESTIONS.length}
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
                            option === q.answer
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
                              : "border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          {option}
                          {option === q.answer && (
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
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Final CIS-HAM Readiness Checklist
              </h2>
              <ul className="mt-6 space-y-3">
                {readinessChecklist.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/cis-ham/mock-exam"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Take the CIS-HAM Mock Exam
                </Link>
                <Link
                  href="/cis-ham/practice-questions"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-emerald-300 bg-white px-6 text-base font-medium text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-700 dark:bg-zinc-900 dark:text-emerald-300"
                >
                  Practice by Domain
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
