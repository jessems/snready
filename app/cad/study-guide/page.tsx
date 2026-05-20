import { Metadata } from "next";
import Link from "next/link";
import { getCertificationBySlug, getTotalQuestionCount } from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title:
    "How to Pass CAD — Complete ServiceNow Application Developer Study Guide [2026]",
  description:
    "Complete ServiceNow CAD study guide with official domain weights, a 4-week developer study calendar, hands-on app-building lab checklist, scenario drills, common mistakes, readiness checklist, and CAD practice questions.",
  keywords: [
    "CAD study guide",
    "ServiceNow CAD study guide",
    "ServiceNow Certified Application Developer exam prep",
    "CAD practice questions",
    "CAD exam domains",
    "ServiceNow application developer certification",
    "GlideRecord exam questions",
    "ServiceNow scripting certification",
    "CAD mock exam",
    "ServiceNow CAD decision matrix",
    "CAD GlideRecord practice",
    "CAD Business Rule timing",
  ],
  alternates: {
    canonical: "/cad/study-guide",
  },
  openGraph: {
    title: "How to Pass the ServiceNow CAD Exam | SNReady",
    description:
      "A practical CAD study plan with scripting priorities, application-development labs, scenario drills, and practice-question links.",
    type: "article",
  },
};

const CERT_SLUG = "cad";

const domainFocus: Record<string, string[]> = {
  "scripting-apis": [
    "GlideRecord query, insert, update, delete, and encoded-query patterns",
    "GlideSystem utilities, user/session methods, messages, logging, and debugging",
    "When to use GlideAjax, GlideAggregate, and server-side scripts instead of client-side code",
  ],
  "business-rules": [
    "Before, after, async, display, and query rule timing",
    "current and previous objects, conditions, order, and recursion prevention",
    "Using display rules and g_scratchpad to prepare data for client scripts",
  ],
  "client-scripts": [
    "onLoad, onChange, onSubmit, and onCellEdit script behavior",
    "g_form, g_user, and client-side validation limitations",
    "Choosing GlideAjax when the browser needs server-side data",
  ],
  "ui-policies-actions": [
    "UI Policy conditions, actions, reverse-if-false behavior, and execution order",
    "When UI Policies are better than Client Scripts for field behavior",
    "Form buttons, list choices, context menus, and client/server UI Action execution",
  ],
  "script-includes": [
    "Prototype structure, initialize(), type, and reusable server-side classes",
    "Client-callable Script Includes with AbstractAjaxProcessor and getParameter()",
    "Scope, accessibility, and cross-scope application access rules",
  ],
  "integration-rest": [
    "Table API versus Scripted REST API decision points",
    "Outbound REST Messages, authentication, payload parsing, and error handling",
    "Import Sets, Transform Maps, coalesce fields, and integration data loading",
  ],
  "application-development": [
    "Scoped applications, Studio, custom tables, roles, and application files",
    "Update sets, app repository/source control, deployment, and rollback thinking",
    "ATF test design, application security, and cross-scope privileges",
  ],
};

const faqData = [
  {
    question: "What is the ServiceNow CAD exam?",
    answer:
      "The ServiceNow Certified Application Developer (CAD) exam validates that you can design, build, script, secure, integrate, test, and deploy custom applications on the Now Platform.",
  },
  {
    question: "How many questions are on the CAD exam?",
    answer:
      "SNReady lists the CAD exam as 60 multiple-choice and multiple-select questions with a 90-minute time limit and a 70% passing score for planning purposes.",
  },
  {
    question: "Which CAD domain should I study first?",
    answer:
      "Start with Scripting & APIs because it is the largest CAD domain at 25% and it supports the rest of the exam. Then study Business Rules and Integration & REST APIs at 15% each before reinforcing client-side and application lifecycle topics.",
  },
  {
    question: "Do I need to know JavaScript for CAD?",
    answer:
      "Yes. CAD is a developer certification. You do not need advanced frontend-framework knowledge, but you should be comfortable reading and writing JavaScript in ServiceNow scripting contexts such as Business Rules, Client Scripts, Script Includes, and REST integrations.",
  },
  {
    question: "How long should I study for the CAD exam?",
    answer:
      "Most candidates with CSA-level knowledge should plan 4 weeks of focused CAD preparation. If you have not built ServiceNow apps or used GlideRecord regularly, extend the plan and spend extra time in a Personal Developer Instance.",
  },
  {
    question: "Is CAD harder than CSA?",
    answer:
      "For most candidates, CAD is harder than CSA because it expects implementation judgment and scripting fluency. CSA tests broad administration knowledge; CAD asks you to choose the right development artifact, API, execution timing, and deployment approach.",
  },
  {
    question: "What hands-on practice matters most for CAD?",
    answer:
      "Build a small scoped app in a Personal Developer Instance with a custom table, roles, ACLs, Business Rules, Client Scripts or UI Policies, Script Includes, GlideAjax, an import/transform path, a REST call, update-set movement, and at least one ATF test.",
  },
  {
    question: "When am I ready to schedule the CAD exam?",
    answer:
      "Schedule the exam after you can score 80% or higher on two timed mixed-domain mock exams, explain every missed question by execution context, and complete core app-development tasks without following step-by-step instructions.",
  },
  {
    question:
      "What is the fastest way to improve CAD scenario-question accuracy?",
    answer:
      "Build a decision matrix for common ServiceNow developer artifacts. For every missed question, label the requirement as data validation, form behavior, server automation, reusable logic, integration, security, or deployment. Then map it to the correct tool and execution context instead of memorizing isolated definitions.",
  },
  {
    question: "Which CAD topics should I drill the week before the exam?",
    answer:
      "In the final week, drill GlideRecord and GlideAjax patterns, Business Rule timing, UI Policy versus Client Script decisions, Script Include reuse, REST/import scenarios, ACL and cross-scope behavior, update sets or app repository movement, and ATF validation. These topics appear as mixed implementation scenarios rather than standalone vocabulary.",
  },
];

const howToSteps = [
  {
    name: "Take a baseline CAD practice test",
    text: "Start with a mixed-domain diagnostic to identify whether misses come from JavaScript syntax, ServiceNow API knowledge, execution timing, or application-lifecycle concepts.",
    position: 1,
  },
  {
    name: "Master scripting contexts and GlideRecord",
    text: "Scripting & APIs is the largest domain. Practice server-side GlideRecord, GlideSystem, GlideAggregate, logging, and safe query patterns until the API choice is automatic.",
    position: 2,
  },
  {
    name: "Learn execution timing for rules and client behavior",
    text: "Business Rules, Client Scripts, UI Policies, and UI Actions often test when code runs and what objects are available. Build examples for before, after, async, display, onLoad, onChange, and onSubmit behavior.",
    position: 3,
  },
  {
    name: "Build reusable and integrated application logic",
    text: "Use Script Includes for shared server logic, GlideAjax for client-server calls, REST APIs for integrations, and Import Sets plus Transform Maps for bulk loads.",
    position: 4,
  },
  {
    name: "Practice scoped-app lifecycle and security",
    text: "Create a scoped app in Studio, configure roles and ACLs, handle cross-scope access, move work with update sets or app repository/source control, and validate behavior with ATF.",
    position: 5,
  },
  {
    name: "Finish with timed mocks and a code-decision miss log",
    text: "Retake mixed mock exams until you can score 80% or higher twice and explain every miss as an artifact, API, timing, scope, or deployment decision.",
    position: 6,
  },
];

const fourWeekPlan = [
  {
    week: "Week 1",
    title: "Scripting foundation and baseline",
    focus: "Scripting & APIs + diagnostic",
    goal: "Make ServiceNow server-side JavaScript and API selection feel predictable.",
    tasks: [
      "Read the CAD blueprint and sort all domains by exam weight.",
      "Write GlideRecord examples for query, insert, update, delete, addQuery(), addEncodedQuery(), and getValue() versus getDisplayValue().",
      "Take 30-60 mixed practice questions and create a miss log grouped by API, context, and artifact type.",
    ],
    success:
      "You can explain why a script belongs on the server, on the client, or behind GlideAjax before writing code.",
  },
  {
    week: "Week 2",
    title: "Automation timing and form behavior",
    focus: "Business Rules + Client Scripts + UI Policies",
    goal: "Stop memorizing artifact names and learn when each one executes.",
    tasks: [
      "Build before, after, async, and display Business Rules and note which objects are available.",
      "Create onLoad, onChange, and onSubmit Client Scripts using g_form and guard clauses such as isLoading.",
      "Rebuild simple mandatory/visible/read-only behavior as a UI Policy and compare it with scripted client logic.",
    ],
    success:
      "You can choose Business Rule, Client Script, UI Policy, Data Policy, or UI Action from a scenario and defend the choice.",
  },
  {
    week: "Week 3",
    title: "Reusable logic and integrations",
    focus: "Script Includes + Integration & REST APIs",
    goal: "Connect custom application logic to users, clients, and external systems safely.",
    tasks: [
      "Create a Script Include and a client-callable Script Include that extends AbstractAjaxProcessor.",
      "Build a GlideAjax call from a Client Script and explain getParameter()/answer handling.",
      "Review Table API, Scripted REST APIs, RESTMessageV2, Import Sets, Transform Maps, and coalesce behavior.",
    ],
    success:
      "You can decide between synchronous server logic, asynchronous client-server calls, inbound APIs, outbound APIs, and import/transform pipelines.",
  },
  {
    week: "Week 4",
    title: "Application lifecycle and exam simulation",
    focus: "Scoped apps + security + timed mocks",
    goal: "Turn coding knowledge into deployable application-development judgment.",
    tasks: [
      "Build or inspect a scoped app with custom tables, application files, roles, ACLs, and cross-scope access decisions.",
      "Create or review ATF tests and trace how update sets/app repository/source control move changes.",
      "Take at least two 60-question timed CAD mock exams and remediate every weak domain.",
    ],
    success:
      "You can finish a full CAD mock exam under time pressure with 80%+ and no major domain below 70%.",
  },
];

const pdiLabChecklist = [
  {
    lab: "Scoped app from scratch",
    domain: "Application Development",
    outcome:
      "Create a scoped application, add a custom table, set a menu/module, create records, and identify which artifacts belong to the app scope.",
  },
  {
    lab: "GlideRecord CRUD and query drill",
    domain: "Scripting & APIs",
    outcome:
      "Write scripts for query, insert, update, delete, addQuery(), addEncodedQuery(), and GlideAggregate so API behavior is muscle memory.",
  },
  {
    lab: "Business Rule execution comparison",
    domain: "Business Rules",
    outcome:
      "Create before, after, async, and display rules and document how current, previous, update behavior, and g_scratchpad differ.",
  },
  {
    lab: "Client behavior decision lab",
    domain: "Client Scripts / UI Policies",
    outcome:
      "Implement the same field behavior with a UI Policy and a Client Script, then explain which option is cleaner and why.",
  },
  {
    lab: "GlideAjax and Script Include lab",
    domain: "Script Includes",
    outcome:
      "Create a client-callable Script Include, pass a parameter from the browser, return a value, and explain why GlideRecord cannot run directly in client scripts.",
  },
  {
    lab: "Integration and data-load lab",
    domain: "Integration & REST APIs",
    outcome:
      "Inspect Table API versus Scripted REST API use cases, run an outbound REST Message, and trace an Import Set through a Transform Map with a coalesce field.",
  },
  {
    lab: "Security, deployment, and ATF lab",
    domain: "Application Development",
    outcome:
      "Add roles and ACLs, review cross-scope access, move a change with an update set or app repository flow, and validate a scenario with ATF.",
  },
];

const decisionDrills = [
  {
    prompt:
      "A form field needs to become mandatory when a simple condition is true across desktop and mobile experiences.",
    test: "Do you write a Client Script first, or use a UI Policy?",
    answer:
      "Prefer a UI Policy for simple mandatory, visible, and read-only behavior. Use a Client Script when the logic truly requires scripting or client-side API calls.",
  },
  {
    prompt:
      "A Client Script needs data that only exists on the server, such as a GlideRecord lookup.",
    test: "Can the browser run GlideRecord directly?",
    answer:
      "No. Client Scripts run in the browser. Put server logic in a client-callable Script Include and call it asynchronously with GlideAjax.",
  },
  {
    prompt:
      "A related record should be created after an incident is saved, but the current record itself should not be modified before insert.",
    test: "Which Business Rule timing fits?",
    answer:
      "An after Business Rule is usually appropriate for related-record side effects after the current record is committed. Before rules are better for validating or changing the current record before save.",
  },
  {
    prompt:
      "An integration must expose a custom endpoint that applies business logic before returning data.",
    test: "Table API or Scripted REST API?",
    answer:
      "Use a Scripted REST API when the endpoint and response require custom logic. Use the Table API when standard table operations are sufficient.",
  },
  {
    prompt:
      "A scoped application script needs to read data from a global table and is blocked.",
    test: "Is this only a JavaScript error?",
    answer:
      "No. CAD questions often test scope and security. Check application access, cross-scope privileges, ACLs, and whether the target API/table is allowed from the current scope.",
  },
];

const commonMistakes = [
  {
    title: "Studying JavaScript without ServiceNow context",
    body: "CAD is not a generic JavaScript exam. Every script runs in a specific ServiceNow artifact with specific objects, timing, and security constraints.",
    icon: "🧠",
  },
  {
    title: "Confusing client-side and server-side APIs",
    body: "g_form and g_user are client-side. GlideRecord and GlideSystem are server-side. GlideAjax bridges the two when the browser needs server data.",
    icon: "↔️",
  },
  {
    title: "Memorizing Business Rule types without timing",
    body: "Before, after, async, display, and query rules differ because of when they run and what they can safely change. Scenario questions target that distinction.",
    icon: "⏱️",
  },
  {
    title: "Over-scripting simple form behavior",
    body: "UI Policies and Data Policies exist for predictable field behavior and server-side enforcement. Do not default to Client Scripts for every requirement.",
    icon: "🧩",
  },
  {
    title: "Ignoring scope and security",
    body: "Scoped apps, cross-scope access, roles, and ACLs are developer concerns. Code that works as admin may fail for real users or from another scope.",
    icon: "🔐",
  },
  {
    title: "Skipping deployment and testing topics",
    body: "Update sets, app repository/source control, and ATF appear in application lifecycle questions. CAD is about shipping safe apps, not just writing scripts.",
    icon: "🚢",
  },
];

const cadDecisionMatrix = [
  {
    requirement: "Set or validate a value before a record is saved",
    bestTool: "Before Business Rule or Data Policy",
    why: "Use server-side enforcement for data integrity. A before rule can set values on current; a Data Policy enforces field rules beyond the form.",
    examTrap:
      "Choosing an after Business Rule and calling current.update(), which can cause recursion or unnecessary writes.",
  },
  {
    requirement: "Show, hide, require, or make fields read-only on a form",
    bestTool: "UI Policy first; Client Script when logic is too complex",
    why: "UI Policies express simple field behavior declaratively and are easier to maintain than script-heavy form logic.",
    examTrap:
      "Using Client Scripts for every form requirement and forgetting reverse-if-false or server-side enforcement needs.",
  },
  {
    requirement: "Let a Client Script retrieve server-side data",
    bestTool: "GlideAjax with a client-callable Script Include",
    why: "The browser cannot safely run server APIs directly. GlideAjax keeps server logic reusable while returning only the needed answer.",
    examTrap:
      "Trying to use GlideRecord in client code or putting sensitive logic in the browser.",
  },
  {
    requirement: "Reuse business logic across rules, APIs, and jobs",
    bestTool: "Script Include",
    why: "Script Includes centralize server-side logic, reduce duplicate code, and can be scoped or exposed intentionally.",
    examTrap:
      "Copying the same code into multiple Business Rules and missing scope or accessibility settings.",
  },
  {
    requirement: "Load external records and transform them into a table",
    bestTool: "Import Set + Transform Map",
    why: "Import Sets stage incoming data; Transform Maps handle field mapping, transform scripts, and coalesce behavior.",
    examTrap:
      "Writing a custom integration before recognizing the built-in staging and transform pattern.",
  },
  {
    requirement: "Expose custom server logic to external systems",
    bestTool: "Scripted REST API",
    why: "Scripted REST APIs define resources, HTTP methods, request parsing, response shape, and application-specific behavior.",
    examTrap:
      "Confusing inbound custom APIs with outbound REST Messages or generic Table API access.",
  },
];

const codePatternChecklist = [
  "Write GlideRecord queries with addQuery(), addEncodedQuery(), query(), next(), getValue(), and setValue() until you can predict each result.",
  "Compare before, after, async, display, and query Business Rules in a table that logs execution order and available objects.",
  "Build one Client Script that uses g_form only and one that calls GlideAjax, then explain why the second needed a Script Include.",
  "Create a UI Policy and an equivalent Client Script for the same behavior; document which is easier to audit and maintain.",
  "Build a Transform Map with coalesce enabled and test what happens when incoming data matches versus creates a record.",
  "Move a small scoped-app change through update-set or app repository flow, then verify the behavior with an ATF test.",
];

const sampleQuestions = [
  {
    topic: "Scripting & APIs",
    topicSlug: "scripting-apis",
    weight: 25,
    question:
      "Which ServiceNow API is used server-side to query and update records in a table?",
    options: ["g_form", "GlideRecord", "GlideAjax", "NOW.user"],
    correctAnswer: "GlideRecord",
    explanation:
      "GlideRecord is the server-side API for querying, inserting, updating, and deleting records. g_form is client-side, while GlideAjax calls server logic from the client.",
  },
  {
    topic: "Business Rules",
    topicSlug: "business-rules",
    weight: 15,
    question:
      "Which Business Rule timing is best when you need to modify values on the current record before it is saved?",
    options: ["Before", "After", "Async", "Display"],
    correctAnswer: "Before",
    explanation:
      "Before Business Rules run before the database operation and can modify current record values without a separate update() call.",
  },
  {
    topic: "Client Scripts",
    topicSlug: "client-scripts",
    weight: 12,
    question:
      "A Client Script needs to retrieve server-side data. What pattern should a developer normally use?",
    options: [
      "Direct GlideRecord in the browser",
      "GlideAjax",
      "gs.getUser()",
      "A Transform Map",
    ],
    correctAnswer: "GlideAjax",
    explanation:
      "Client Scripts cannot run server-side GlideRecord directly. GlideAjax calls a client-callable Script Include to retrieve server data asynchronously.",
  },
  {
    topic: "Integration & REST APIs",
    topicSlug: "integration-rest",
    weight: 15,
    question:
      "Which feature is most appropriate when incoming data must be staged before being transformed into a target table?",
    options: [
      "Import Sets and Transform Maps",
      "UI Policies",
      "Favorites",
      "Display Business Rules",
    ],
    correctAnswer: "Import Sets and Transform Maps",
    explanation:
      "Import Sets stage incoming data, and Transform Maps define how fields are mapped, transformed, coalesced, and written to target tables.",
  },
];

const readinessChecklist = [
  "Score 80% or higher on two full-length timed CAD mock exams.",
  "Complete the scoped-app, GlideRecord, Business Rule, client behavior, GlideAjax, integration, security, and ATF labs without step-by-step notes.",
  "Explain whether each scenario belongs in a Business Rule, Client Script, UI Policy, Data Policy, UI Action, Script Include, REST API, or Transform Map.",
  "Describe before, after, async, display, onLoad, onChange, and onSubmit execution timing from memory.",
  "Explain scoped-app access, roles, ACLs, and cross-scope privileges using a real example.",
  "Review every missed practice question by artifact, API, execution context, and application lifecycle stage.",
];

export default function CADStudyGuidePage() {
  const cert = getCertificationBySlug(CERT_SLUG)!;
  const totalQuestions = getTotalQuestionCount(CERT_SLUG);
  const domains = [...cert.domains].sort((a, b) => b.percentage - a.percentage);
  const topDomains = domains.filter((domain) => domain.percentage >= 15);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Certifications", url: "/certifications" },
    { name: "CAD", url: "/cad" },
    { name: "Study Guide", url: "/cad/study-guide" },
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
    name: "How to Pass the ServiceNow CAD Exam",
    description:
      "A four-week study plan for passing the ServiceNow Certified Application Developer exam with hands-on app-building labs and timed practice exams.",
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
    name: "ServiceNow CAD Exam Preparation",
    description:
      "Complete study guide for the ServiceNow Certified Application Developer exam, covering all official CAD domains with labs, scenario drills, and practice questions.",
    provider: {
      "@type": "Organization",
      name: "SNReady",
      url: "https://snready.com",
    },
    educationalLevel: "Professional",
    about: {
      "@type": "Thing",
      name: "ServiceNow Certified Application Developer",
      description:
        "ServiceNow application-development certification covering scripting, APIs, Business Rules, Client Scripts, integrations, scoped apps, and deployment.",
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
              <Link href="/cad" className="hover:text-emerald-600">
                CAD
              </Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-zinc-300">
                Study Guide
              </span>
            </nav>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              Complete Developer Study Guide
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              How to Pass the ServiceNow CAD Exam
              <span className="mt-2 block text-lg font-normal text-zinc-500 dark:text-zinc-400 sm:text-xl">
                Certified Application Developer
              </span>
            </h1>

            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300">
              CAD is the developer bridge from platform administration to custom
              application delivery. This guide follows the CIS-DF-style SNReady
              pattern: official domain weights, a 4-week plan, Personal
              Developer Instance labs, scenario drills, common mistakes, and a
              final readiness gate before you schedule the exam.
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
                href="/cad/mock-exam"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Take a Timed CAD Mock Exam
              </Link>
              <Link
                href="/cad/practice-questions"
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
              About the CAD Exam
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              The ServiceNow CAD exam validates that you can build maintainable
              Now Platform applications. Expect scenario questions about where a
              requirement belongs, which API fits, when code executes, how scope
              and security affect behavior, and how to move and test changes.
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
                  <li>
                    Heavy emphasis on scripting and implementation judgment
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              CAD Domain Breakdown
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Study time should follow official blueprint weight. Scripting &
              APIs is the largest domain, but CAD questions often blend
              scripting with Business Rules, Client Scripts, integrations, and
              scoped-app lifecycle decisions.
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
                        href={`/cad/practice-questions/${domain.slug}`}
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
                  official CAD exam blueprint on NowLearning →
                </a>
              </p>
            )}
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                CAD scenario decision matrix
              </p>
              <h2 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Choose the right ServiceNow development artifact
              </h2>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                CAD rarely rewards memorizing one API in isolation. It rewards
                picking the safest artifact for a requirement, then explaining
                execution context, maintainability, scope, and data integrity.
                Use this matrix when reviewing missed questions.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {cadDecisionMatrix.map((item) => (
                <div
                  key={item.requirement}
                  className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Requirement
                      </div>
                      <h3 className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.requirement}
                      </h3>
                      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {item.why}
                      </p>
                    </div>
                    <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                      <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                        Best tool
                      </div>
                      <p className="mt-1 font-semibold text-emerald-900 dark:text-emerald-100">
                        {item.bestTool}
                      </p>
                      <p className="mt-3 text-sm text-amber-800 dark:text-amber-200">
                        <span className="font-semibold">Exam trap:</span>{" "}
                        {item.examTrap}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Week-before code pattern checklist
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Complete these drills before relying on timed mocks. Each one
                turns a common CAD vocabulary topic into implementation
                judgment.
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {codePatternChecklist.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              How to Study for CAD
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Follow this sequence so JavaScript syntax, platform APIs,
              execution timing, integrations, and application lifecycle topics
              reinforce each other.
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
                  A realistic CAD prep plan
                </h2>
              </div>
              <Link
                href="/cad/mock-exam"
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
              CAD Hands-on Lab Checklist
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Do these labs in a ServiceNow Personal Developer Instance. CAD
              rewards candidates who can reason from actual platform behavior,
              not only remember definitions.
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
              Scenario Drills: Think Like a ServiceNow Developer
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              CAD questions often ask for the best implementation choice, not a
              memorized syntax snippet. Practice explaining each decision.
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
              Common CAD Mistakes to Avoid
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              These are the mistakes that turn otherwise good developers into
              inconsistent CAD exam takers.
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
                  Free CAD Practice Questions
                </h2>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  A few sample questions from high-impact exam domains. Use the
                  full practice bank to build speed and accuracy.
                </p>
              </div>
              <Link
                href="/cad/practice-questions"
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
                href="/cad/mock-exam"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-8 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Take the Full CAD Mock Exam
              </Link>
              <p className="mt-3 text-sm text-zinc-500">
                {totalQuestions} questions · Timed · Instant results
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 py-16 dark:border-zinc-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Final CAD Readiness Checklist
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                If these are not true yet, keep practicing before you pay for
                the exam. CAD rewards implementation judgment under time
                pressure.
              </p>
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
                  href="/cad/mock-exam"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Start CAD Mock Exam
                </Link>
                <Link
                  href="/cad/practice-questions"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-emerald-300 bg-white px-6 text-base font-medium text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-800 dark:bg-zinc-900 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                >
                  Practice by CAD Domain
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
