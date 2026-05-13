import { Metadata } from "next";
import Link from "next/link";
import { getCertificationBySlug, getTotalQuestionCount } from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title: "How to Pass CIS-ITSM — Complete ServiceNow ITSM Study Guide [2026]",
  description:
    "Complete ServiceNow CIS-ITSM study guide with official domain weights, a 4-week study calendar, hands-on ITSM implementation labs, scenario drills, common mistakes, readiness checklist, and CIS-ITSM practice questions.",
  keywords: [
    "CIS-ITSM study guide",
    "ServiceNow CIS-ITSM study guide",
    "Certified Implementation Specialist ITSM exam prep",
    "CIS-ITSM practice questions",
    "ServiceNow ITSM certification",
    "CIS-ITSM exam domains",
    "ServiceNow ITSM implementation exam",
    "CIS-ITSM mock exam",
    "ServiceNow Incident Change Problem exam",
  ],
  alternates: {
    canonical: "/cis-itsm/study-guide",
  },
  openGraph: {
    title: "How to Pass the ServiceNow CIS-ITSM Exam | SNReady",
    description:
      "A practical CIS-ITSM study plan with domain priorities, implementation labs, scenario drills, and practice-question links.",
    type: "article",
  },
};

const CERT_SLUG = "cis-itsm";

const domainFocus: Record<string, string[]> = {
  "incident-management": [
    "Incident lifecycle, state model, priority calculation, assignment, escalation, and closure behavior",
    "Major Incident Management, communication plans, outage coordination, and post-incident review decisions",
    "How incident integrates with knowledge, problem, change, SLAs, configuration items, and reporting",
  ],
  "change-management": [
    "Standard, normal, and emergency change models, risk assessment, conflicts, CAB, and approvals",
    "Change tasks, schedules, blackout windows, maintenance windows, and implementation review",
    "When to use change templates, models, policies, and automation to reduce production risk",
  ],
  "problem-management": [
    "Problem lifecycle, root cause analysis, known errors, workarounds, and permanent fixes",
    "Reactive versus proactive problem creation and linkage to incidents and changes",
    "Problem task ownership, communication, and metrics that prove recurrence reduction",
  ],
  "request-management": [
    "Service Catalog item design, variables, variable sets, order guides, and fulfillment flows",
    "Request, requested item, catalog task, approval, and SLA relationships",
    "How to keep catalog offerings simple, governed, measurable, and supportable",
  ],
  "itsm-overview": [
    "ITSM application architecture, personas, ITIL alignment, and process relationships",
    "Implementation planning, baseline configuration, data dependencies, and stakeholder decisions",
    "When to preserve out-of-box behavior versus customize process flows",
  ],
  "sla-management": [
    "SLA definitions, start/stop/pause conditions, schedules, time zones, breach handling, and retroactive start",
    "Task SLAs versus process metrics and how SLAs behave across incident, request, and change records",
    "How to test SLA behavior before production rollout",
  ],
  "reporting-metrics": [
    "Operational reports, dashboards, KPIs, Performance Analytics awareness, and trend interpretation",
    "MTTR, backlog, SLA attainment, change success, incident recurrence, and catalog fulfillment metrics",
    "Using metrics to improve process design instead of just proving activity volume",
  ],
};

const faqData = [
  {
    question: "What is the ServiceNow CIS-ITSM exam?",
    answer:
      "The Certified Implementation Specialist - IT Service Management exam validates that you can implement, configure, and support ServiceNow ITSM processes such as Incident, Problem, Change, Request, SLA Management, and reporting.",
  },
  {
    question: "How many questions are on the CIS-ITSM exam?",
    answer:
      "SNReady lists CIS-ITSM as 60 multiple-choice and multiple-select questions with a 90-minute time limit and a 70% passing score for planning purposes.",
  },
  {
    question: "Which CIS-ITSM domains should I study first?",
    answer:
      "Start with Incident Management and Change Management because each is weighted at 20%. Then study Problem Management and Request Management at 15% each before reinforcing ITSM Overview, SLA Management, and Reporting & Metrics.",
  },
  {
    question: "Is CIS-ITSM harder than CSA?",
    answer:
      "Yes for most candidates. CSA tests broad platform administration, while CIS-ITSM asks implementation-specific judgment: choosing process configuration, preserving out-of-box behavior, coordinating approvals, handling SLAs, and connecting ITIL concepts to ServiceNow records.",
  },
  {
    question: "How long should I study for CIS-ITSM?",
    answer:
      "Most CSA-certified candidates should plan four focused weeks. Candidates with hands-on ITSM implementation experience can move faster, but should still practice timed scenario questions and verify weak domains in a Personal Developer Instance.",
  },
  {
    question: "What hands-on practice helps most for CIS-ITSM?",
    answer:
      "Build a mini ITSM implementation in a Personal Developer Instance: create incident, problem, change, and request records; configure catalog fulfillment, approval paths, SLAs, assignment groups, major incidents, CAB schedules, dashboards, and process metrics.",
  },
  {
    question: "When am I ready to schedule CIS-ITSM?",
    answer:
      "Schedule after you can score 80% or higher on two timed mixed-domain mock exams, explain every missed question as an implementation decision, and complete core ITSM workflows in a PDI without following step-by-step instructions.",
  },
];

const howToSteps = [
  {
    name: "Take a baseline CIS-ITSM practice test",
    text: "Start with a mixed-domain diagnostic. Sort misses by process area and by cause: lifecycle, roles, configuration artifact, SLA behavior, approval/routing, or reporting interpretation.",
    position: 1,
  },
  {
    name: "Master Incident and Change first",
    text: "Incident Management and Change Management are the highest-weight domains at 20% each. Study their state flows, roles, approvals, communications, risk controls, and integration points before lower-weight domains.",
    position: 2,
  },
  {
    name: "Connect Problem and Request to real implementation scenarios",
    text: "Practice root-cause, known-error, workaround, catalog, request, requested-item, and catalog-task scenarios. Focus on what the implementer should configure or preserve out of box.",
    position: 3,
  },
  {
    name: "Validate SLAs and reporting in a PDI",
    text: "Hands-on testing prevents memorization traps. Configure representative SLA start, pause, stop, and breach cases, then build dashboards that show process health rather than activity noise.",
    position: 4,
  },
  {
    name: "Finish with timed mocks and a miss log",
    text: "Take timed mock exams until you can score 80% or higher twice, then remediate every miss by domain and implementation decision pattern.",
    position: 5,
  },
];

const fourWeekPlan = [
  {
    week: "Week 1",
    title: "ITSM implementation baseline",
    focus: "Diagnostic + ITSM Overview + Incident foundation",
    goal: "Understand the exam blueprint and make incident process behavior predictable.",
    tasks: [
      "Read the CIS-ITSM blueprint and sort all domains by exam weight.",
      "Review ITSM personas, process relationships, assignment groups, CIs, knowledge, and core record lifecycles.",
      "Build and resolve incidents in a PDI, including priority, assignment, state changes, SLAs, and closure codes.",
      "Take 40-60 mixed practice questions and start a miss log grouped by domain and implementation decision.",
    ],
    success:
      "You can explain the incident lifecycle, major incident triggers, assignment behavior, and how incidents connect to SLAs, knowledge, problem, change, and reporting.",
  },
  {
    week: "Week 2",
    title: "Change control and problem management",
    focus: "Change Management + Problem Management",
    goal: "Recognize how ServiceNow reduces production risk and recurring incidents.",
    tasks: [
      "Compare standard, normal, and emergency change flows, approvals, CAB, risk assessment, conflicts, blackout windows, and change tasks.",
      "Practice problem creation from incidents, root-cause analysis, known errors, workarounds, and change linkage for permanent fixes.",
      "Run domain-specific practice sets until Change and Problem both score 80%+ untimed.",
    ],
    success:
      "You can choose the correct change model or problem response for a scenario and defend why it reduces risk or recurrence.",
  },
  {
    week: "Week 3",
    title: "Request fulfillment, SLAs, and metrics",
    focus: "Request Management + SLA Management + Reporting",
    goal: "Turn catalog and metrics topics into implementation decisions.",
    tasks: [
      "Build a catalog item with variables, approvals, requested item records, catalog tasks, and a simple fulfillment flow.",
      "Configure or inspect SLAs with start, stop, pause, schedule, and breach behavior; test them against incident and request records.",
      "Create reports for backlog, SLA attainment, MTTR, change success, problem recurrence, and request fulfillment time.",
    ],
    success:
      "You can trace a request from catalog submission through fulfillment and explain how SLAs and dashboards prove whether the process is working.",
  },
  {
    week: "Week 4",
    title: "Timed exam simulation",
    focus: "Mixed-domain mocks + targeted remediation",
    goal: "Convert knowledge into exam pacing and scenario judgment.",
    tasks: [
      "Take at least two 60-question timed CIS-ITSM mock exams.",
      "Review every miss by domain, record lifecycle, configuration artifact, and ITIL/ServiceNow decision point.",
      "Redo weak-domain labs in the PDI, then retake mixed practice until no domain is below 70% and the overall score is 80%+.",
    ],
    success:
      "You can finish a full CIS-ITSM mock under 90 minutes with 80%+ and explain missed answers without relying on memorized keywords.",
  },
];

const pdiLabChecklist = [
  {
    lab: "Incident-to-resolution walkthrough",
    domain: "Incident Management",
    outcome:
      "Create incidents with different impact/urgency combinations, route them to assignment groups, observe SLA behavior, resolve/close them, and identify where knowledge or problem linkage belongs.",
  },
  {
    lab: "Major incident decision drill",
    domain: "Incident Management",
    outcome:
      "Simulate a high-impact outage and document the communication, escalation, ownership, and post-incident review artifacts an implementer must support.",
  },
  {
    lab: "Change model comparison",
    domain: "Change Management",
    outcome:
      "Compare standard, normal, and emergency changes, then inspect approvals, risk, conflict detection, change tasks, CAB timing, blackout windows, and closure review.",
  },
  {
    lab: "Problem and known-error chain",
    domain: "Problem Management",
    outcome:
      "Convert recurring incidents into a problem, document root cause and workaround, create a known error, and link a change for the permanent fix.",
  },
  {
    lab: "Catalog fulfillment build",
    domain: "Request Management",
    outcome:
      "Build a simple catalog item with variables, approvals, RITM/task fulfillment, notifications, and owner handoffs; then test the request lifecycle end to end.",
  },
  {
    lab: "SLA and dashboard validation",
    domain: "SLA Management / Reporting",
    outcome:
      "Test SLA start, pause, stop, schedule, breach, and reporting outcomes; build a dashboard that highlights process health rather than raw ticket volume.",
  },
];

const decisionDrills = [
  {
    prompt:
      "A resolver wants to close an incident immediately after applying a workaround, but the issue is recurring weekly.",
    test: "Can you separate incident restoration from problem prevention?",
    answer:
      "Resolve the incident when service is restored, but create or link a problem record for root-cause analysis, known error/workaround tracking, and a permanent fix through change if needed.",
  },
  {
    prompt:
      "A low-risk password reset fulfillment process is being handled as a manual change every time.",
    test: "Do you choose the right ITSM process?",
    answer:
      "Move repeatable user-facing fulfillment into Request Management or automation. Change Management is for controlled changes to reduce production risk, not every routine service request.",
  },
  {
    prompt:
      "A team wants to bypass CAB for a production change because the release window is soon.",
    test: "Can you protect change governance without blocking legitimate urgency?",
    answer:
      "Use the appropriate change model. Normal changes need risk review and approvals; true emergency changes still require controlled authorization, implementation, communication, and review.",
  },
  {
    prompt: "An SLA appears to breach too early for users in another region.",
    test: "Do you know what to inspect before changing the process?",
    answer:
      "Check the SLA definition, schedule, time zone, start/stop/pause conditions, retroactive start settings, and task data before assuming the SLA engine is wrong.",
  },
  {
    prompt:
      "Executives ask whether ITSM is improving, and the only dashboard shows ticket counts by assignment group.",
    test: "Can you choose outcome metrics?",
    answer:
      "Add metrics such as SLA attainment, MTTR, backlog aging, reopen rate, first-contact resolution, change success, recurrence reduction, CSAT, and fulfillment cycle time.",
  },
];

const commonMistakes = [
  {
    title: "Studying ITSM as definitions instead of lifecycles",
    body: "CIS-ITSM questions usually ask what should happen next in a process. Trace records through states, roles, approvals, SLAs, tasks, and related records.",
  },
  {
    title: "Underweighting Change and Incident",
    body: "Incident and Change together represent 40% of the exam. They should receive the most practice time and the deepest hands-on validation.",
  },
  {
    title: "Confusing incident, problem, request, and change intent",
    body: "Incident restores service, Problem removes recurrence, Request fulfills user needs, and Change controls risk to services. Keep the process intent clear in every scenario.",
  },
  {
    title: "Customizing before understanding out-of-box behavior",
    body: "Implementation specialists are expected to know when ServiceNow baseline process behavior already solves the requirement and when configuration is safer than custom code.",
  },
  {
    title: "Ignoring SLA schedules and conditions",
    body: "Many SLA misses come from schedules, pause conditions, retroactive starts, and record data. Test SLA behavior hands-on instead of memorizing one-line definitions.",
  },
];

const readinessChecklist = [
  "Score 80% or higher on two full-length timed CIS-ITSM mock exams.",
  "Explain Incident and Change objectives without notes; together they make up 40% of the exam.",
  "Differentiate incident restoration, problem prevention, request fulfillment, and change risk control in scenarios.",
  "Build or inspect catalog fulfillment, approvals, SLAs, assignment rules, dashboards, and major incident workflows in a PDI.",
  "Defend when to preserve out-of-box ITSM process behavior instead of customizing.",
  "Review every missed practice question by process lifecycle, configuration artifact, and implementation decision.",
  "Complete at least one mixed-domain mock with no domain below 70%.",
];

const sampleQuestions = [
  {
    topic: "Incident Management",
    topicSlug: "incident-management",
    question:
      "A critical business service is unavailable for many users. What should an ITSM implementer ensure the incident process supports?",
    options: [
      "Immediate deletion of related SLAs",
      "Major incident escalation, communication, ownership, and post-incident review",
      "Skipping assignment groups so all users can update the record",
      "Converting every affected incident directly into a standard change",
    ],
    answer:
      "Major incident escalation, communication, ownership, and post-incident review",
  },
  {
    topic: "Change Management",
    topicSlug: "change-management",
    question:
      "Which change type is normally best for a pre-approved, low-risk, repeatable activity with documented steps?",
    options: [
      "Standard change",
      "Emergency change",
      "Unplanned outage",
      "Major incident",
    ],
    answer: "Standard change",
  },
  {
    topic: "SLA Management",
    topicSlug: "sla-management",
    question:
      "An SLA should stop when an incident reaches Resolved. What should you inspect first if it keeps running?",
    options: [
      "The SLA stop condition and task state data",
      "The color of the incident form header",
      "Only the assignment group name",
      "Whether the caller has an ITIL role",
    ],
    answer: "The SLA stop condition and task state data",
  },
];

export default async function CISITSMStudyGuidePage() {
  const cert = getCertificationBySlug(CERT_SLUG)!;
  const totalQuestions = getTotalQuestionCount(CERT_SLUG);
  const domains = [...cert.domains].sort(
    (a, b) => (b.percentage ?? 0) - (a.percentage ?? 0),
  );

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Certifications", url: "/certifications" },
    { name: "CIS-ITSM", url: "/cis-itsm" },
    { name: "Study Guide", url: "/cis-itsm/study-guide" },
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
    name: "How to Pass the CIS-ITSM Exam",
    description:
      "A four-week study plan for passing the ServiceNow Certified Implementation Specialist - IT Service Management exam.",
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
    name: "CIS-ITSM Certified Implementation Specialist - ITSM Exam Preparation",
    description:
      "Complete study guide for the ServiceNow CIS-ITSM certification exam, covering Incident, Problem, Change, Request, SLA Management, Reporting, and implementation strategy.",
    provider: {
      "@type": "Organization",
      name: "SNReady",
      url: "https://snready.com",
    },
    educationalLevel: "Professional",
    about: {
      "@type": "Thing",
      name: "ServiceNow CIS-ITSM",
      description: cert.fullName,
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
              <Link href="/cis-itsm" className="hover:text-emerald-600">
                CIS-ITSM
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
              How to Pass the CIS-ITSM Exam
              <span className="mt-2 block text-lg font-normal text-zinc-500 dark:text-zinc-400 sm:text-xl">
                Certified Implementation Specialist - IT Service Management
              </span>
            </h1>

            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300">
              CIS-ITSM is the ServiceNow certification for implementation
              specialists who configure core IT Service Management processes.
              This guide follows the CIS-DF-style SNReady pattern: start from
              the official domain weights, practice in a PDI, and convert every
              topic into an implementation decision about lifecycle, ownership,
              controls, SLAs, and metrics.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                {
                  label: "Questions",
                  value: String(cert.examDetails.questionCount),
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
                href="/cis-itsm/mock-exam"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Take a Timed Mock Exam
              </Link>
              <Link
                href="/cis-itsm/practice-questions"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                View All {totalQuestions}+ Questions
              </Link>
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-4xl space-y-14 px-4 py-14 sm:px-6 lg:px-8">
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              About the CIS-ITSM Exam
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              The CIS-ITSM exam validates implementation skill across Incident,
              Problem, Change, Request, SLA Management, Reporting, and overall
              ITSM solution design. Expect scenario questions that test process
              intent, ServiceNow record behavior, approval and task routing,
              out-of-box configuration judgment, and measurable service
              outcomes.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-zinc-50 p-5 dark:bg-zinc-900">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Recommended background
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {cert.prerequisites.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-zinc-50 p-5 dark:bg-zinc-900">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Exam format
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <li>{cert.examDetails.questionCount} questions</li>
                  <li>{cert.examDetails.duration} minutes</li>
                  <li>{cert.examDetails.passingScore}% planning pass score</li>
                  <li>{cert.examDetails.format}</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Official Domain Breakdown
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              Study in weight order. Incident and Change drive the largest share
              of the score, but the lower-weight domains often decide close
              scenario questions because they connect process behavior to SLAs,
              catalog fulfillment, and metrics.
            </p>
            <div className="mt-6 space-y-4">
              {domains.map((domain) => (
                <div
                  key={domain.slug}
                  className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {domain.name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {domain.description}
                      </p>
                    </div>
                    <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {domain.percentage}%
                    </div>
                  </div>
                  <ul className="mt-4 grid gap-2 text-sm text-zinc-600 dark:text-zinc-400 sm:grid-cols-3">
                    {(domainFocus[domain.slug] ?? []).map((item) => (
                      <li
                        key={item}
                        className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              4-Week CIS-ITSM Study Calendar
            </h2>
            <div className="mt-6 grid gap-5">
              {fourWeekPlan.map((week) => (
                <article
                  key={week.week}
                  className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
                >
                  <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {week.week} · {week.focus}
                  </div>
                  <h3 className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    {week.title}
                  </h3>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    {week.goal}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {week.tasks.map((task) => (
                      <li key={task} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {task}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                    Exit criteria: {week.success}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Hands-On Lab Checklist
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {pdiLabChecklist.map((lab) => (
                <div
                  key={lab.lab}
                  className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
                >
                  <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {lab.domain}
                  </div>
                  <h3 className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
                    {lab.lab}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {lab.outcome}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Scenario and Decision Drills
            </h2>
            <div className="mt-6 space-y-4">
              {decisionDrills.map((drill) => (
                <div
                  key={drill.prompt}
                  className="rounded-xl bg-zinc-50 p-5 dark:bg-zinc-900"
                >
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {drill.prompt}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    Drill: {drill.test}
                  </p>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {drill.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Common CIS-ITSM Mistakes
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {commonMistakes.map((mistake) => (
                <div
                  key={mistake.title}
                  className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/60 dark:bg-amber-950/20"
                >
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {mistake.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                    {mistake.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Sample CIS-ITSM Questions
            </h2>
            <div className="mt-6 space-y-5">
              {sampleQuestions.map((sample) => (
                <div
                  key={sample.question}
                  className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
                >
                  <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {sample.topic}
                  </div>
                  <h3 className="mt-2 font-semibold text-zinc-900 dark:text-zinc-100">
                    {sample.question}
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {sample.options.map((option) => (
                      <li
                        key={option}
                        className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-900"
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    Correct answer: {sample.answer}
                  </p>
                  <Link
                    href={`/cis-itsm/practice-questions/${sample.topicSlug}`}
                    className="mt-3 inline-flex text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                  >
                    Practice more {sample.topic} questions →
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-emerald-600 p-8 text-white">
            <h2 className="text-2xl font-bold">Final Readiness Checklist</h2>
            <ul className="mt-5 space-y-3">
              {readinessChecklist.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cis-itsm/mock-exam"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-6 text-base font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
              >
                Start CIS-ITSM Mock Exam
              </Link>
              <Link
                href="/cis-itsm/practice-questions"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/40 px-6 text-base font-medium text-white transition-colors hover:bg-white/10"
              >
                Practice All {totalQuestions}+ Questions
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              CIS-ITSM FAQ
            </h2>
            <div className="mt-6 divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
              {faqData.map((item) => (
                <div key={item.question} className="p-5">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
