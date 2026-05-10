import { Metadata } from "next";
import Link from "next/link";
import { getCertificationBySlug, getTotalQuestionCount } from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title:
    "How to Pass CSA — Complete ServiceNow Administrator Study Guide [2026]",
  description:
    "Complete ServiceNow CSA study guide with official domain weights, a 4-week study calendar, PDI lab checklist, scenario drills, common mistakes, readiness checklist, and CSA practice questions.",
  keywords: [
    "CSA study guide",
    "ServiceNow CSA study guide",
    "ServiceNow Certified System Administrator exam prep",
    "CSA practice questions",
    "CSA exam domains",
    "ServiceNow administrator certification",
    "CSA passing score",
    "ServiceNow CSA mock exam",
  ],
  alternates: {
    canonical: "/csa/study-guide",
  },
  openGraph: {
    title: "How to Pass the ServiceNow CSA Exam | SNReady",
    description:
      "A practical CSA study plan with domain priorities, hands-on labs, scenario drills, and practice-question links.",
    type: "article",
  },
};

const CERT_SLUG = "csa";

const domainFocus: Record<string, string[]> = {
  "ui-navigation": [
    "Application Navigator, favorites, history, and global search",
    "List controls, filters, breadcrumbs, and personal list layouts",
    "Forms, form sections, related lists, and record activity",
  ],
  "user-administration": [
    "Users, groups, roles, and role inheritance",
    "ACL evaluation, record access, and security debugging basics",
    "Impersonation and safe testing of user access",
  ],
  "database-administration": [
    "Tables, fields, dictionary entries, and table inheritance",
    "Reference fields, choice lists, import sets, and transform maps",
    "When to extend a table versus create a new table",
  ],
  "self-service-automation": [
    "Service Catalog items, variables, variable sets, and order guides",
    "Knowledge bases, article states, publishing, and feedback",
    "Flow Designer triggers, actions, approvals, and automation choice points",
  ],
  "incident-management": [
    "Incident states, assignment, priority, impact, and urgency",
    "SLA behavior, escalation, resolution, and closure",
    "Major incidents and relationship to other ITSM processes",
  ],
  "problem-management": [
    "Problem versus incident purpose and lifecycle",
    "Root cause analysis, known errors, workarounds, and permanent fixes",
    "Reactive versus proactive problem creation",
  ],
  "change-management": [
    "Standard, normal, and emergency change models",
    "CAB approvals, risk assessment, schedules, and blackout windows",
    "Change tasks, implementation review, and conflict detection",
  ],
  "reporting-dashboards": [
    "Report Builder, report types, filters, and sharing",
    "Dashboards, widgets, scheduled reports, and subscriptions",
    "When Performance Analytics is different from standard reporting",
  ],
};

const faqData = [
  {
    question: "What is the ServiceNow CSA exam?",
    answer:
      "The ServiceNow Certified System Administrator (CSA) exam validates foundational platform administration skills: navigation, users and roles, data model basics, self-service, automation, core ITSM processes, and reporting.",
  },
  {
    question: "How many questions are on the CSA exam?",
    answer:
      "The CSA exam contains 60 questions. SNReady lists 90 minutes as the exam duration and a 70% passing score for planning purposes.",
  },
  {
    question: "What is the passing score for CSA?",
    answer:
      "Plan around a 70% passing score. For readiness, do not schedule the real exam until you can score at least 80% on timed mixed-domain practice exams.",
  },
  {
    question: "How long should I study for the ServiceNow CSA exam?",
    answer:
      "Most new administrators should plan 4 weeks of structured study, with daily hands-on practice in a Personal Developer Instance. Candidates with daily ServiceNow admin experience may compress the schedule.",
  },
  {
    question: "Which CSA domains should I study first?",
    answer:
      "Start with the 15% domains: User Interface & Navigation, User Administration & Security, and Self-Service & Automation. Then cover Reporting & Dashboards, Database Administration, Incident, Change, and Problem Management according to their blueprint weights.",
  },
  {
    question: "Do I need hands-on ServiceNow experience for CSA?",
    answer:
      "Yes. CSA questions often look simple but test platform behavior. Use a Personal Developer Instance to practice lists, forms, groups, roles, ACLs, table inheritance, catalog items, flows, incidents, changes, and reports.",
  },
  {
    question: "Is CSA harder than it looks?",
    answer:
      "CSA is an entry-level certification, but it is broad. The common failure pattern is memorizing definitions without understanding where features live in the UI or how records, roles, flows, and ITSM processes behave together.",
  },
  {
    question: "What should I do the week before the CSA exam?",
    answer:
      "Take two timed mock exams, review every wrong answer by domain, repeat weak-topic drills, and verify that you can complete core admin tasks in a PDI without following step-by-step instructions.",
  },
];

const howToSteps = [
  {
    name: "Take a baseline CSA practice test",
    text: "Start with a mixed-domain diagnostic so your study plan is based on evidence, not confidence. Capture misses by domain and concept.",
    position: 1,
  },
  {
    name: "Master navigation and security first",
    text: "UI navigation and user administration are both high-weight domains and appear in nearly every admin workflow. Practice lists, forms, groups, roles, and ACL scenarios in a PDI.",
    position: 2,
  },
  {
    name: "Learn the platform data model",
    text: "Understand tables, fields, dictionary entries, reference fields, and inheritance before studying ITSM processes. Many CSA questions depend on knowing how records are stored and related.",
    position: 3,
  },
  {
    name: "Build catalog, knowledge, flow, and ITSM muscle memory",
    text: "Create or inspect catalog items, knowledge articles, flows, incidents, problems, and changes so exam terms map to real UI behavior.",
    position: 4,
  },
  {
    name: "Use reports to validate your understanding",
    text: "Create list, bar, and dashboard-style reports from task-based tables. Reporting questions reward knowing which visualization and sharing option fits the scenario.",
    position: 5,
  },
  {
    name: "Finish with timed mock exams and miss-log review",
    text: "Retake mixed practice exams until you can score 80% or higher twice, finish within 90 minutes, and explain every missed concept without memorizing the stem.",
    position: 6,
  },
];

const fourWeekPlan = [
  {
    week: "Week 1",
    title: "Platform orientation and baseline",
    focus: "UI & Navigation + diagnostic",
    goal: "Make the platform feel familiar before deeper admin topics.",
    tasks: [
      "Read the CSA blueprint and rank all eight domains by weight.",
      "Practice Application Navigator, favorites, lists, filters, forms, related lists, and global search.",
      "Take 30-60 mixed practice questions and create a domain miss log.",
    ],
    success:
      "You can find records, filter lists, adjust forms, and explain list versus form behavior without notes.",
  },
  {
    week: "Week 2",
    title: "Security and data model",
    focus: "User Administration + Database Administration",
    goal: "Understand how access and records work before automating anything.",
    tasks: [
      "Create test users, groups, and roles; practice impersonation safely.",
      "Review ACL purpose and how roles differ from record-level access.",
      "Inspect task table inheritance, reference fields, dictionary entries, import sets, and transform maps.",
    ],
    success:
      "You can explain why a user can see an application module but may still be blocked from a record or field.",
  },
  {
    week: "Week 3",
    title: "Self-service and ITSM processes",
    focus: "Catalog, Knowledge, Flow, Incident, Problem, Change",
    goal: "Connect admin features to real service-management outcomes.",
    tasks: [
      "Compare catalog items, record producers, variables, variable sets, and order guides.",
      "Trace Incident, Problem, and Change lifecycles from creation through closure or review.",
      "Build a simple Flow Designer automation and identify trigger/action/approval behavior.",
    ],
    success:
      "You can choose between incident, problem, change, catalog, knowledge, and flow options in scenario questions.",
  },
  {
    week: "Week 4",
    title: "Reporting, review, and exam simulation",
    focus: "Reporting & Dashboards + timed mocks",
    goal: "Convert broad knowledge into consistent exam performance.",
    tasks: [
      "Create standard reports and dashboards; practice sharing and scheduled reports.",
      "Take at least two 60-question timed CSA mock exams.",
      "Review missed questions by domain and repeat topic drills until weak domains reach 80%+.",
    ],
    success:
      "You can finish a full mock exam under time pressure with 80%+ and no domain below 70%.",
  },
];

const pdiLabChecklist = [
  {
    lab: "List and form fluency drill",
    domain: "User Interface & Navigation",
    outcome:
      "Filter a task list, save a favorite, open a form, inspect related lists, and explain what is personal versus administrator-controlled.",
  },
  {
    lab: "Users, groups, roles, and impersonation",
    domain: "User Administration & Security",
    outcome:
      "Create a test user, add group membership, grant a role through the group, impersonate the user, and verify visible modules and records.",
  },
  {
    lab: "Table inheritance and dictionary review",
    domain: "Database Administration",
    outcome:
      "Open tables that extend Task, identify inherited fields, inspect a dictionary entry, and explain when reference fields are used.",
  },
  {
    lab: "Catalog item and Flow Designer walkthrough",
    domain: "Self-Service & Automation",
    outcome:
      "Inspect a catalog item, identify variables and fulfillment logic, then review a flow trigger, action, condition, and approval step.",
  },
  {
    lab: "Incident, Problem, Change lifecycle trace",
    domain: "ITSM Processes",
    outcome:
      "Create or inspect records for each process and explain how incident restoration, problem root-cause analysis, and change risk control differ.",
  },
  {
    lab: "Report and dashboard build",
    domain: "Reporting & Dashboards",
    outcome:
      "Create a filtered task report, choose an appropriate visualization, add it to a dashboard, and explain sharing/scheduling choices.",
  },
];

const decisionDrills = [
  {
    prompt:
      "A user can open the Incident application but cannot read a specific incident record.",
    test: "Do you look at module roles only, or record-level ACL access too?",
    answer:
      "Check both. Roles can expose applications and modules, but ACLs control whether a user can read, write, create, or delete records and fields.",
  },
  {
    prompt:
      "A requester needs to submit information that creates a task-like fulfillment record.",
    test: "Can you choose between a catalog item and a record producer?",
    answer:
      "Use the option that matches the desired record and user experience. Catalog items request goods/services; record producers create records from portal-style inputs.",
  },
  {
    prompt:
      "A recurring outage has been restored repeatedly but keeps returning.",
    test: "Is this still only Incident Management?",
    answer:
      "Incident Management restores service. Recurring incidents should trigger Problem Management to investigate root cause, document workarounds, and pursue a permanent fix.",
  },
  {
    prompt:
      "A low-risk routine update is performed often and follows a proven path.",
    test: "Should every occurrence require full CAB review?",
    answer:
      "Usually no. A standard change model can pre-approve repeatable, low-risk work while still keeping documentation and control.",
  },
  {
    prompt: "A manager asks for weekly incident counts by assignment group.",
    test: "Can you choose a report type and sharing method?",
    answer:
      "Build a report filtered to incidents, group by assignment group, choose a clear chart or list, then share or schedule it based on the audience.",
  },
];

const commonMistakes = [
  {
    title: "Treating CSA as pure vocabulary",
    body: "The exam tests what an administrator would do in a scenario. Pair every definition with a PDI action so the UI, record behavior, and process purpose stick.",
    icon: "📚",
  },
  {
    title: "Confusing roles with ACLs",
    body: "Roles and groups are not the whole security story. ACLs decide record and field access, so scenario questions often require both concepts.",
    icon: "🔐",
  },
  {
    title: "Skipping table inheritance",
    body: "Task inheritance explains why incident, problem, and change records share fields. Missing this concept makes database and ITSM questions harder.",
    icon: "🧱",
  },
  {
    title: "Memorizing ITSM states without purpose",
    body: "Know why each process exists: incidents restore service, problems remove root cause, and changes control risk. State names alone are not enough.",
    icon: "🔄",
  },
  {
    title: "Ignoring Flow Designer basics",
    body: "Modern CSA prep should include triggers, actions, conditions, approvals, and when Flow Designer is preferable to older automation patterns.",
    icon: "⚙️",
  },
  {
    title: "Not practicing reports",
    body: "Reporting is weighted enough to matter. Build reports and dashboards so chart-type, filter, sharing, and scheduling questions feel obvious.",
    icon: "📊",
  },
];

const sampleQuestions = [
  {
    topic: "User Interface & Navigation",
    topicSlug: "ui-navigation",
    weight: 15,
    question: "What does a list in ServiceNow display?",
    options: [
      "A single record with all field sections",
      "A set of records from a table in rows and columns",
      "Only Knowledge Base articles",
      "Only records assigned to the logged-in user",
    ],
    correctAnswer: "A set of records from a table in rows and columns",
    explanation:
      "Lists show multiple records from a table with selected columns. Forms show a single record with fields, sections, and related lists.",
  },
  {
    topic: "User Administration & Security",
    topicSlug: "user-administration",
    weight: 15,
    question:
      "Which mechanism controls record-level access to data in ServiceNow?",
    options: ["Favorites", "ACLs", "Update Sets", "Application Menus"],
    correctAnswer: "ACLs",
    explanation:
      "Access Control Lists determine whether users can read, write, create, or delete records and fields after role and condition checks are evaluated.",
  },
  {
    topic: "Change Management",
    topicSlug: "change-management",
    weight: 10,
    question:
      "Which change type is typically pre-approved for routine, low-risk work?",
    options: ["Emergency", "Normal", "Standard", "Major"],
    correctAnswer: "Standard",
    explanation:
      "Standard changes are repeatable, low risk, and pre-approved through a change model. Normal and emergency changes follow different approval paths.",
  },
  {
    topic: "Reporting & Dashboards",
    topicSlug: "reporting-dashboards",
    weight: 13,
    question: "What is the main purpose of a dashboard?",
    options: [
      "Store transform map scripts",
      "Combine reports and widgets for at-a-glance visibility",
      "Replace all access controls",
      "Create catalog item variables",
    ],
    correctAnswer: "Combine reports and widgets for at-a-glance visibility",
    explanation:
      "Dashboards bring multiple reports, charts, and widgets together so users can monitor work, trends, and KPIs from one place.",
  },
];

const readinessChecklist = [
  "Score 80% or higher on two full-length timed CSA mock exams.",
  "Complete every PDI lab in this guide without step-by-step notes.",
  "Explain the difference between list, form, table, field, and record.",
  "Explain how users, groups, roles, and ACLs work together.",
  "Choose the right process for incident, problem, change, catalog, knowledge, flow, and reporting scenarios.",
  "Review every missed practice question by domain and rewrite the underlying rule in your own words.",
];

export default function CSAStudyGuidePage() {
  const cert = getCertificationBySlug(CERT_SLUG)!;
  const totalQuestions = getTotalQuestionCount(CERT_SLUG);
  const domains = [...cert.domains].sort((a, b) => b.percentage - a.percentage);
  const topDomains = domains.filter((domain) => domain.percentage >= 15);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Certifications", url: "/certifications" },
    { name: "CSA", url: "/csa" },
    { name: "Study Guide", url: "/csa/study-guide" },
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
    name: "How to Pass the ServiceNow CSA Exam",
    description:
      "A four-week study plan for passing the ServiceNow Certified System Administrator exam with hands-on labs and timed practice exams.",
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
    name: "ServiceNow CSA Exam Preparation",
    description:
      "Complete study guide for the ServiceNow Certified System Administrator exam, covering all official CSA domains with labs, scenario drills, and practice questions.",
    provider: {
      "@type": "Organization",
      name: "SNReady",
      url: "https://snready.com",
    },
    educationalLevel: "Entry",
    about: {
      "@type": "Thing",
      name: "ServiceNow Certified System Administrator",
      description:
        "Foundational ServiceNow administration certification covering platform navigation, security, data, automation, ITSM, and reporting.",
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
              <Link href="/csa" className="hover:text-emerald-600">
                CSA
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
              How to Pass the ServiceNow CSA Exam
              <span className="mt-2 block text-lg font-normal text-zinc-500 dark:text-zinc-400 sm:text-xl">
                Certified System Administrator
              </span>
            </h1>

            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300">
              CSA is the foundation of almost every ServiceNow certification
              path. This guide adapts the CIS-DF study-guide pattern for new
              administrators: official domain weights, a 4-week calendar,
              Personal Developer Instance labs, scenario drills, common
              mistakes, and a final readiness gate before you book the exam.
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
                href="/csa/mock-exam"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Take a Timed CSA Mock Exam
              </Link>
              <Link
                href="/csa/practice-questions"
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
              About the CSA Exam
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              The ServiceNow CSA exam validates that you can administer the Now
              Platform at a foundational level. It is broad rather than deep:
              expect questions across navigation, security, data, catalog,
              knowledge, automation, ITSM processes, and reporting.
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
              CSA Domain Breakdown
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Study time should follow official blueprint weight. CSA has three
              15% domains, so do not over-focus on only ITSM terminology.
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
                        href={`/csa/practice-questions/${domain.slug}`}
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
                  official CSA exam blueprint on NowLearning →
                </a>
              </p>
            )}
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              How to Study for CSA
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Follow this sequence so each topic builds on the previous one.
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
                  A realistic CSA prep plan
                </h2>
              </div>
              <Link
                href="/csa/mock-exam"
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
              CSA PDI Lab Checklist
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Do these labs in a ServiceNow Personal Developer Instance before
              you rely on flashcards. CSA rewards platform familiarity.
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
              Scenario Drills: Think Like a ServiceNow Administrator
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              CSA questions often ask for the best administrative choice, not a
              pasted definition. Practice explaining each decision.
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
              Common CSA Mistakes to Avoid
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              These are the mistakes that make an entry-level exam feel harder
              than expected.
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
                  Free CSA Practice Questions
                </h2>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  Sample questions from high-impact CSA areas. Use the full bank
                  for timed mixed-domain practice.
                </p>
              </div>
              <Link
                href="/csa/practice-questions"
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
                      href={`/csa/practice-questions/${q.topicSlug}`}
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
                href="/csa/mock-exam"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-8 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Take the Full CSA Mock Exam
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
                    Book the CSA exam only when these are true
                  </h2>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    Convert vague confidence into observable readiness signals.
                  </p>
                </div>
                <Link
                  href="/csa/practice-questions"
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
              Ready to Pass CSA on Your First Attempt?
            </h2>
            <p className="mt-4 text-emerald-100">
              {totalQuestions}+ CSA practice questions across all official exam
              domains. Use topic drills for weak areas, then prove readiness
              with a timed mock exam.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/csa/mock-exam"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
              >
                Take the CSA Timed Mock Exam
              </Link>
              <Link
                href="/csa/practice-questions"
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
