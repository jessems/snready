import { Metadata } from "next";
import Link from "next/link";
import { getCertificationBySlug, getTotalQuestionCount } from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title:
    "How to Pass CIS-SPM — Strategic Portfolio Management Study Guide [2026]",
  description:
    "Complete ServiceNow CIS-SPM study guide with official domain weights, a 4-week study calendar, implementation labs, scenario drills, common mistakes, readiness checklist, and CIS-SPM practice questions.",
  keywords: [
    "CIS-SPM study guide",
    "ServiceNow CIS-SPM exam prep",
    "Strategic Portfolio Management certification",
    "CIS-SPM practice questions",
    "ServiceNow SPM implementation specialist",
    "CIS-SPM domain breakdown",
    "SPM Project Management exam questions",
    "SPM Resource Management exam prep",
    "ServiceNow portfolio planning workspace",
    "CIS-SPM mock exam",
  ],
  alternates: {
    canonical: "/cis-spm/study-guide",
  },
  openGraph: {
    title: "How to Pass CIS-SPM | Complete Study Guide | SNReady",
    description:
      "A CIS-SPM study plan with blueprint-weighted priorities, SPM implementation labs, scenario drills, and practice-question links.",
    type: "article",
  },
};

const CERT_SLUG = "cis-spm";

const domainFocus: Record<string, string[]> = {
  "project-management": [
    "Project creation methods, project templates, work breakdown structures, and task hierarchy",
    "Dependencies, milestones, project workbench behavior, project states, and project health indicators",
    "Risk, issue, decision, and change tracking across the project lifecycle",
  ],
  "resource-management": [
    "Resource plans, resource pools, capacity planning, allocation, and utilization",
    "Resource requests, soft versus hard allocations, conflicts, and over-allocation resolution",
    "How planned effort, confirmed allocation, actual time, and project schedules interact",
  ],
  "idea-and-demand": [
    "Idea intake, demand creation, assessment categories, scoring, prioritization, and approvals",
    "Converting ideas and demands into projects while preserving business context",
    "Using demand governance to filter low-value work before it consumes project and resource capacity",
  ],
  "spm-financials": [
    "Budgets, cost plans, benefit plans, actuals, forecasts, ROI, and cost breakdown structures",
    "How financial plans roll up from project to portfolio views",
    "Choosing financial evidence for portfolio prioritization and executive reporting",
  ],
  "portfolio-planning-workspace": [
    "Portfolio visualization, bubble charts, constraints, scenarios, and what-if analysis",
    "Comparing investment options by value, risk, alignment, cost, and resource limits",
    "Turning portfolio scenarios into defensible funding and sequencing decisions",
  ],
  "timecard-management": [
    "Timecard submission, approval, time entry policies, actual effort capture, and project actuals",
    "How timecard data supports resource utilization, cost tracking, and forecast correction",
    "Common approval and compliance decisions for project time",
  ],
  "spm-implementation-overview": [
    "SPM application architecture, stakeholder alignment, implementation sequencing, and configuration-first thinking",
    "How SPM data connects ideas, demands, projects, portfolios, resources, time, and financials",
    "Readiness questions that identify process gaps before technical configuration",
  ],
  "spm-platform-analytics-dashboards": [
    "SPM dashboards, project health metrics, portfolio KPIs, executive views, and Performance Analytics signals",
    "Matching reports to portfolio managers, project managers, resource managers, and executives",
    "Using metrics to identify delivery risk instead of only summarizing historical status",
  ],
  "spm-better-together": [
    "Connections to ITSM, Change Management, Agile, CMDB, GRC, and external planning systems",
    "When SPM should remain the work-planning system of record versus integrate with execution tools",
    "Benefits of connecting strategic demand, delivery work, operational risk, and change control",
  ],
};

const faqData = [
  {
    question: "What is the CIS-SPM exam?",
    answer:
      "The ServiceNow Certified Implementation Specialist - Strategic Portfolio Management exam validates that you can implement SPM processes for ideas, demands, projects, resources, timecards, financials, portfolio planning, analytics, and cross-application integration.",
  },
  {
    question: "How many questions are on the CIS-SPM exam?",
    answer:
      "SNReady lists CIS-SPM as a 60-question exam with a 90-minute time limit and 70% passing score for study planning. The format is multiple choice and multiple select.",
  },
  {
    question: "Which CIS-SPM domain should I study first?",
    answer:
      "Start with Project Management because it is the largest domain at 30%. Then study Resource Management at 23% and Idea and Demand at 18%. Together, those three domains represent 71% of the exam.",
  },
  {
    question: "How long should I study for CIS-SPM?",
    answer:
      "Most candidates should plan four focused weeks if they already understand ServiceNow administration and project or portfolio concepts. Add extra time if resource planning, financial planning, or Portfolio Planning Workspace are new to you.",
  },
  {
    question: "Do I need hands-on SPM implementation experience?",
    answer:
      "Yes. CIS-SPM is implementation focused. You should be able to trace work from idea intake through demand assessment, project planning, resource allocation, time capture, financial tracking, and portfolio reporting.",
  },
  {
    question: "What makes CIS-SPM difficult?",
    answer:
      "The difficult part is not isolated vocabulary. The exam asks you to choose the right SPM object or process for a scenario, especially when project schedule, resource capacity, financial data, and portfolio priorities conflict.",
  },
  {
    question: "When am I ready to book the CIS-SPM exam?",
    answer:
      "Book the exam after you score 80% or higher on two timed mixed-domain mock exams, can explain every missed question by SPM lifecycle stage, and can complete the hands-on labs without step-by-step notes.",
  },
  {
    question: "What should I drill during the final week?",
    answer:
      "Drill project and resource scenarios first, then idea-to-demand conversion, SPM financial rollups, timecard actuals, Portfolio Planning Workspace scenarios, and dashboard or integration questions. Review misses by decision type, not by memorized stem.",
  },
];

const howToSteps = [
  {
    name: "Take a baseline CIS-SPM practice test",
    text: "Start with mixed-domain questions so you can identify whether your misses come from project lifecycle, resource capacity, intake governance, financials, or portfolio planning.",
    position: 1,
  },
  {
    name: "Prioritize the 71% core",
    text: "Project Management, Resource Management, and Idea and Demand make up most of the blueprint. Master the flow from intake to project delivery before spending heavy time on smaller domains.",
    position: 2,
  },
  {
    name: "Connect project plans to resource reality",
    text: "Practice the difference between project tasks, resource plans, allocations, capacity, utilization, timecards, and actuals. Many scenarios test what changes when capacity or actual effort conflicts with the plan.",
    position: 3,
  },
  {
    name: "Add financial and portfolio decision context",
    text: "Use budgets, costs, benefits, ROI, scenarios, constraints, and portfolio views to explain why one demand or project should be prioritized over another.",
    position: 4,
  },
  {
    name: "Review dashboards and integrations last",
    text: "The small domains still matter, but they are best understood after the delivery lifecycle is clear. Learn which dashboard, KPI, or integration supports each stakeholder decision.",
    position: 5,
  },
  {
    name: "Finish with timed mocks and a decision miss log",
    text: "Retake full-length mock exams until you consistently clear 80% and can explain every miss as an SPM object, process, lifecycle, capacity, financial, or reporting decision.",
    position: 6,
  },
];

const fourWeekPlan = [
  {
    week: "Week 1",
    title: "SPM lifecycle and intake baseline",
    focus: "Idea and Demand + implementation overview",
    goal: "Understand how potential work enters SPM and becomes governed demand.",
    tasks: [
      "Read the official blueprint and sort domains by exam weight.",
      "Map the lifecycle from idea to demand to project to portfolio reporting.",
      "Take 30-60 diagnostic questions and record misses by lifecycle stage.",
    ],
    success:
      "You can explain why a request should remain an idea, become a demand, or be converted into a project.",
  },
  {
    week: "Week 2",
    title: "Project Management mastery",
    focus: "Project Management (30%)",
    goal: "Win the highest-weight domain before adding resource and financial complexity.",
    tasks: [
      "Create or inspect projects, templates, WBS hierarchy, tasks, milestones, dependencies, risks, and issues.",
      "Practice project workbench and project health questions until status decisions are automatic.",
      "Drill Project Management questions until domain scores reach at least 80%.",
    ],
    success:
      "You can trace a project from creation through planning, execution, risk handling, status reporting, and closure.",
  },
  {
    week: "Week 3",
    title: "Resources, time, and financials",
    focus: "Resource Management + Timecards + Financials",
    goal: "Connect project plans to capacity, actual effort, and money.",
    tasks: [
      "Compare resource pools, resource plans, allocations, capacity, utilization, and conflicts.",
      "Trace a timecard from submission and approval into project actuals.",
      "Review budget, cost plan, benefit plan, ROI, forecast, and actual-cost scenarios.",
    ],
    success:
      "You can explain how a schedule risk changes resource plans, actuals, forecasts, and portfolio decisions.",
  },
  {
    week: "Week 4",
    title: "Portfolio decisions and exam simulation",
    focus: "Portfolio Planning Workspace + analytics + timed mocks",
    goal: "Turn implementation knowledge into fast scenario judgment.",
    tasks: [
      "Use portfolio constraints, bubble charts, what-if scenarios, and prioritization criteria in decision drills.",
      "Review dashboards, KPIs, Performance Analytics, Better Together integrations, and stakeholder reporting.",
      "Take at least two 60-question timed mock exams and remediate every weak domain.",
    ],
    success:
      "You can finish a full mock exam under 90 minutes with 80%+ and no major domain below 70%.",
  },
];

const pdiLabChecklist = [
  {
    lab: "Idea-to-demand intake trace",
    domain: "Idea and Demand",
    outcome:
      "Submit or inspect an idea, identify assessment criteria, scoring, approvals, and the point where it should become a demand or project.",
  },
  {
    lab: "Project template and WBS build",
    domain: "Project Management",
    outcome:
      "Create or inspect a project template, work breakdown structure, milestones, dependencies, risks, issues, and project health fields.",
  },
  {
    lab: "Resource capacity conflict drill",
    domain: "Resource Management",
    outcome:
      "Create or inspect a resource plan, resource pool, allocation, capacity view, and over-allocation scenario; document the resolution path.",
  },
  {
    lab: "Timecard actuals workflow",
    domain: "Timecard Management",
    outcome:
      "Submit or inspect timecards, approvals, and the way approved time updates project actuals, utilization, and financial tracking.",
  },
  {
    lab: "Budget, cost, and benefit rollup",
    domain: "SPM Financials",
    outcome:
      "Trace planned cost, actual cost, budget, forecast, benefit, and ROI from project-level data into portfolio decision context.",
  },
  {
    lab: "Portfolio Planning Workspace scenario",
    domain: "Portfolio Planning Workspace",
    outcome:
      "Compare at least two portfolio scenarios using value, risk, cost, resource constraints, alignment, and what-if analysis.",
  },
  {
    lab: "SPM dashboard stakeholder review",
    domain: "Analytics / Better Together",
    outcome:
      "Match project, resource, financial, portfolio, and executive dashboards to stakeholder questions and integration touchpoints.",
  },
];

const decisionDrills = [
  {
    prompt:
      "A business unit submits several possible initiatives, but leadership has not approved funding or capacity.",
    test: "Idea, demand, or project?",
    answer:
      "Use idea or demand governance before project creation. A project should represent approved delivery work with enough planning context to manage schedule, resources, and financials.",
  },
  {
    prompt:
      "A project plan looks healthy, but the assigned team is already over capacity for the same period.",
    test: "Is the issue project schedule only, or resource management too?",
    answer:
      "It is a resource management decision. Review resource pools, capacity, allocations, conflicts, and utilization before trusting the schedule.",
  },
  {
    prompt:
      "Executives want to choose between two projects with different cost, risk, strategic value, and staffing needs.",
    test: "Which SPM area supports the decision?",
    answer:
      "Use Portfolio Planning Workspace with financial, resource, risk, and alignment data. The exam often tests portfolio tradeoffs rather than a single project field.",
  },
  {
    prompt:
      "Approved timecards are lower than planned effort, but the project status still shows on track.",
    test: "What evidence should you review?",
    answer:
      "Compare planned effort, allocations, approved actuals, remaining work, schedule, and cost forecast. Timecard actuals can reveal delivery or reporting risk.",
  },
  {
    prompt:
      "A project manager asks why change records and project tasks should be connected.",
    test: "Is this an SPM Better Together scenario?",
    answer:
      "Yes. Connecting SPM with Change Management links strategic delivery work to operational change control, risk, scheduling, and implementation governance.",
  },
];

const commonMistakes = [
  {
    title: "Studying project fields without lifecycle context",
    body: "CIS-SPM scenarios expect you to know how intake, demand, project, resource, time, financial, and portfolio data move together. Do not memorize forms in isolation.",
    icon: "🧭",
  },
  {
    title: "Underweighting Resource Management",
    body: "Resource Management is 23% of the exam. Capacity, allocations, utilization, and conflicts are core decisions, not administrative side topics.",
    icon: "👥",
  },
  {
    title: "Treating financials as accounting trivia",
    body: "Financial questions often support prioritization: budget, actual cost, forecast, benefit, ROI, and portfolio tradeoffs. Know why the numbers matter.",
    icon: "💰",
  },
  {
    title: "Skipping Portfolio Planning Workspace",
    body: "Even at 8%, the workspace can decide whether you understand strategic portfolio decisions. Practice bubble charts, scenarios, constraints, and what-if analysis.",
    icon: "📊",
  },
  {
    title: "Confusing planned work with actual work",
    body: "Project tasks and resource plans describe intent. Timecards, actuals, status, and utilization show reality. Exam scenarios often hinge on that gap.",
    icon: "⏱️",
  },
  {
    title: "Ignoring integration context",
    body: "SPM works best with ITSM, Change, Agile, GRC, CMDB, and external systems. Better Together questions test business value, not just plug-in names.",
    icon: "🔗",
  },
];

const sampleQuestions = [
  {
    topic: "Project Management",
    topicSlug: "project-management",
    weight: 30,
    question:
      "A project manager needs repeatable phases, tasks, and milestones for similar implementation projects. Which SPM capability best supports this?",
    options: [
      "Project template",
      "Timecard policy",
      "Portfolio bubble chart",
      "Demand assessment metric",
    ],
    correctAnswer: "Project template",
    explanation:
      "Project templates standardize repeatable project structure such as phases, tasks, and milestones so teams do not rebuild common plans from scratch.",
  },
  {
    topic: "Resource Management",
    topicSlug: "resource-management",
    weight: 23,
    question:
      "A team member is assigned to multiple projects in the same period and exceeds available capacity. What should you review first?",
    options: [
      "Resource allocations and capacity",
      "Only the project short description",
      "Knowledge article ownership",
      "The demand category label",
    ],
    correctAnswer: "Resource allocations and capacity",
    explanation:
      "Over-allocation is a resource management issue. Review resource plans, allocations, resource pools, capacity, and utilization to resolve the conflict.",
  },
  {
    topic: "Idea and Demand",
    topicSlug: "idea-and-demand",
    weight: 18,
    question:
      "Why assess and score a demand before converting it into a project?",
    options: [
      "To confirm every idea becomes a project automatically",
      "To evaluate value, priority, feasibility, and approval before committing delivery resources",
      "To bypass portfolio planning",
      "To create timecards before work exists",
    ],
    correctAnswer:
      "To evaluate value, priority, feasibility, and approval before committing delivery resources",
    explanation:
      "Demand assessment helps organizations filter and prioritize work before it consumes project management, resource, and financial capacity.",
  },
  {
    topic: "Portfolio Planning Workspace",
    topicSlug: "portfolio-planning-workspace",
    weight: 8,
    question:
      "Which activity is most aligned with Portfolio Planning Workspace?",
    options: [
      "Comparing what-if portfolio scenarios under budget and resource constraints",
      "Creating a user group for incident assignment",
      "Writing a Client Script for a form field",
      "Approving a single weekly timecard",
    ],
    correctAnswer:
      "Comparing what-if portfolio scenarios under budget and resource constraints",
    explanation:
      "Portfolio Planning Workspace supports strategic planning activities such as visualization, scenario comparison, optimization, and constraint-based tradeoffs.",
  },
];

const readinessChecklist = [
  "Score 80% or higher on two full-length timed CIS-SPM mock exams.",
  "Explain the flow from idea to demand to project to portfolio reporting.",
  "Complete project template, WBS, resource allocation, timecard, financial, and portfolio workspace labs.",
  "Resolve scenario questions involving resource conflicts, project risk, budget limits, and portfolio tradeoffs.",
  "Differentiate planned effort, allocated capacity, approved actuals, forecast, and utilization.",
  "Review every missed practice question by SPM decision type and rewrite the underlying rule in your own words.",
];

export default function CISSPMStudyGuidePage() {
  const cert = getCertificationBySlug(CERT_SLUG)!;
  const totalQuestions = getTotalQuestionCount(CERT_SLUG);
  const domains = [...cert.domains].sort((a, b) => b.percentage - a.percentage);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Certifications", url: "/certifications" },
    { name: "CIS-SPM", url: "/cis-spm" },
    { name: "Study Guide", url: "/cis-spm/study-guide" },
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
    name: "How to Pass the ServiceNow CIS-SPM Exam",
    description:
      "A four-week blueprint-weighted study plan for passing the ServiceNow CIS-SPM exam with SPM labs, scenario drills, and timed practice exams.",
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
    name: "CIS-SPM Strategic Portfolio Management Exam Preparation",
    description:
      "Complete study guide for the ServiceNow CIS-SPM certification exam, covering all official Strategic Portfolio Management domains with labs, scenario drills, and practice questions.",
    provider: {
      "@type": "Organization",
      name: "SNReady",
      url: "https://snready.com",
    },
    educationalLevel: "Professional",
    about: {
      "@type": "Thing",
      name: "ServiceNow Strategic Portfolio Management",
      description:
        "Implementation specialist certification covering ideas, demands, projects, resources, financials, portfolio planning, analytics, and integrations.",
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
              <Link href="/cis-spm" className="hover:text-emerald-600">
                CIS-SPM
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
              How to Pass the CIS-SPM Exam
              <span className="mt-2 block text-lg font-normal text-zinc-500 dark:text-zinc-400 sm:text-xl">
                Certified Implementation Specialist — Strategic Portfolio
                Management
              </span>
            </h1>

            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300">
              CIS-SPM tests whether you can turn strategy into governed work:
              ideas, demands, projects, resources, timecards, financials, and
              portfolio decisions. This guide follows the CIS-DF page pattern
              with official domain weights, a four-week calendar, implementation
              labs, scenario drills, common mistakes, and a final readiness
              gate.
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
                href="/cis-spm/mock-exam"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Take a Timed Mock Exam
              </Link>
              <Link
                href="/cis-spm/practice-questions"
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
              About the CIS-SPM Exam
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              CIS-SPM validates implementation knowledge for ServiceNow
              Strategic Portfolio Management. The exam favors scenario judgment:
              choosing the right object, process, workspace, metric, or
              integration when stakeholders need to prioritize and deliver work.
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
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {cert.examDetails.questionCount} multiple-choice and
                    multiple-select questions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {cert.examDetails.duration} minutes to complete
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Blueprint-weighted domains with Project Management as the
                    largest section
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              CIS-SPM Domain Breakdown
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Study time should follow blueprint weight. Project Management,
              Resource Management, and Idea and Demand account for 71% of the
              exam, so they should dominate your first three weeks.
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
                        {domain.percentage >= 18 && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
                            Core domain
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
                        href={`/cis-spm/practice-questions/${domain.slug}`}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        Practice → {domain.name}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              Domain percentages are from the{" "}
              <a
                href={cert.blueprintUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                official ServiceNow CIS-SPM exam blueprint →
              </a>
            </p>
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              How to Study for CIS-SPM
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {howToSteps.map((step) => (
                <div
                  key={step.position}
                  className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="mb-2 text-xs font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    Step {step.position}
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
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
                  A realistic CIS-SPM prep plan
                </h2>
              </div>
              <Link
                href="/cis-spm/mock-exam"
                className="inline-flex items-center justify-center rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
              >
                Start with a baseline mock exam →
              </Link>
            </div>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              This calendar is weighted by blueprint value and uses exit
              criteria so each week ends with observable readiness, not vague
              confidence.
            </p>

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
              CIS-SPM Hands-on Lab Checklist
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Use these labs in a Personal Developer Instance or training
              instance so the exam topics become implementation decisions, not
              just definitions.
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
              Scenario Drills: Think Like the Exam
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              CIS-SPM questions often describe stakeholder tension. Use these
              drills to practice choosing the right process or artifact.
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
              Common CIS-SPM Mistakes to Avoid
            </h2>
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
                  Free CIS-SPM Practice Questions
                </h2>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  Sample questions from the most important domains. Use the full
                  bank for timed practice and weak-domain drilling.
                </p>
              </div>
              <Link
                href="/cis-spm/practice-questions"
                className="hidden text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 sm:block"
              >
                See all {totalQuestions}+ questions →
              </Link>
            </div>

            <div className="mt-8 space-y-6">
              {sampleQuestions.map((q, index) => (
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
                      Question {index + 1} of {sampleQuestions.length}
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
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    Final readiness checklist
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    Book the exam only when these are true
                  </h2>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    These are concrete readiness signals for CIS-SPM. If any
                    item feels weak, drill that domain before scheduling the
                    exam.
                  </p>
                </div>
                <Link
                  href="/cis-spm/practice-questions"
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
              Ready to Pass CIS-SPM?
            </h2>
            <p className="mt-4 text-emerald-100">
              {totalQuestions}+ practice questions across all nine CIS-SPM
              domains. Use topic drills first, then finish with a timed mock
              exam.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/cis-spm/mock-exam"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
              >
                Take the CIS-SPM Timed Mock Exam
              </Link>
              <Link
                href="/cis-spm/practice-questions"
                className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-emerald-400 px-8 text-base font-medium text-white transition-colors hover:bg-emerald-600"
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
