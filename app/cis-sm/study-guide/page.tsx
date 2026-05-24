import { Metadata } from "next";
import Link from "next/link";
import { getCertificationBySlug, getTotalQuestionCount } from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title:
    "How to Pass CIS-SM — Complete ServiceNow Service Mapping Study Guide [2026]",
  description:
    "Complete CIS-SM study guide for the ServiceNow Certified Implementation Specialist - Service Mapping exam. Includes official domain weights, a 4-week study calendar, Service Mapping labs, scenario drills, common mistakes, readiness checklist, and 121+ practice questions.",
  keywords: [
    "CIS-SM study guide",
    "ServiceNow Service Mapping certification",
    "CIS-SM exam prep",
    "ServiceNow Service Mapping practice questions",
    "CIS-SM mock exam",
    "Service Mapping Pattern Designer exam",
    "ServiceNow service map certification",
    "ServiceNow Discovery Service Mapping",
    "CIS-SM domain breakdown",
    "ServiceNow Service Mapping implementation",
  ],
  alternates: {
    canonical: "/cis-sm/study-guide",
  },
  openGraph: {
    title: "How to Pass the ServiceNow CIS-SM Exam | SNReady",
    description:
      "Domain-by-domain CIS-SM study plan with Pattern Design priorities, service map configuration labs, scenario drills, and timed practice-question links.",
    type: "article",
  },
};

const CERT_SLUG = "cis-sm";

const domainFocus: Record<string, string[]> = {
  "pattern-design": [
    "Pattern Designer operations, steps, shared libraries, temporary variables, parsing strategies, tables, and debug workflow",
    "Horizontal discovery patterns versus Service Mapping application patterns, including connection sections and application identification",
    "Regex, command-line console output, WMI/SSH/SNMP scripting, process classification, and payload-to-CI mapping decisions",
  ],
  "sm-configuration": [
    "Service Mapping setup, entry points, CI types, credentials, connection sections, service groups, schedules, and technical services",
    "Top-down mapping, tag-based mapping, traffic-based discovery context, suggested connections, and service candidate review",
    "Tuning maps after discovery: endpoints, load balancers, boundaries, CI inclusion, and ownership of application service records",
  ],
  "discovery-configuration": [
    "Discovery schedules, behaviors, MID Servers, credentials, IP services, ECC Queue, Discovery Status, and PCIE phases",
    "Why Service Mapping depends on Discovery fundamentals for host classification, process data, and infrastructure CI quality",
    "Authentication troubleshooting, credential affinity, firewall access, and operational readiness before mapping business services",
  ],
  "cmdb-integration": [
    "CI Class Manager, service and infrastructure class hierarchy, Application Service records, relationships, and dependency quality",
    "Identification rules, reconciliation/source precedence, duplicates, de-duplication tasks, reclassification, and CMDB Health",
    "How service maps support incident impact, change risk, operations visibility, and CSDM-aligned service reporting",
  ],
  "machine-learning": [
    "Service Mapping Workspace, ML-powered mapping guidance, service candidates, and recommended mapping methods",
    "When machine learning accelerates candidate discovery and when human validation is still required",
    "Reviewing map suggestions, confidence signals, and candidate scope before accepting or promoting services",
  ],
  "engagement-readiness": [
    "Defining business services, technical services, shared services, owners, entry points, implementation scope, and measurable KPIs",
    "MID Server sizing, credential ownership, network prerequisites, application-owner workshops, schedule windows, and support handoff",
    "Communicating Service Mapping value: impact analysis, change-risk awareness, operational dependency visibility, and CMDB trust",
  ],
};

const faqData = [
  {
    question: "What is the ServiceNow CIS-SM exam?",
    answer:
      "The Certified Implementation Specialist - Service Mapping exam validates that you can implement ServiceNow Service Mapping, configure application service maps, design and troubleshoot patterns, connect Discovery output to the CMDB, and prepare an organization to operate service maps after go-live.",
  },
  {
    question: "How many questions are on CIS-SM?",
    answer:
      "SNReady lists CIS-SM as a 60-question exam with a 90-minute time limit and a 70% passing score for planning purposes. The exam uses multiple-choice and multiple-select questions.",
  },
  {
    question: "Which CIS-SM domains should I study first?",
    answer:
      "Start with Service Mapping Pattern Design at 30%, then Service Mapping Configuration at 20%. Together they account for half the exam. Next cover CMDB Integration and Discovery Configuration at 15% each, then Machine Learning and Engagement Readiness at 10% each.",
  },
  {
    question: "Is CIS-SM harder than CIS-Discovery?",
    answer:
      "For many candidates, CIS-SM feels harder because it builds on Discovery fundamentals and adds application service modeling, entry points, dependency boundaries, service candidate validation, and business-facing map quality. If your Discovery foundation is weak, start by reviewing MID Server, credentials, PCIE phases, and Pattern Designer basics.",
  },
  {
    question: "How long should I study for CIS-SM?",
    answer:
      "Plan four focused weeks if you already understand CSA, CIS-DF, and basic Discovery concepts. Add extra lab time if you have not configured entry points, reviewed Pattern Designer output, or worked with Application Service records and CMDB relationships.",
  },
  {
    question: "What hands-on labs help most for CIS-SM?",
    answer:
      "The most valuable labs are creating or inspecting an application service, defining entry points, reviewing service map dependencies, debugging pattern steps, checking Discovery Status and ECC Queue records, validating credentials, reviewing service candidates in Service Mapping Workspace, and checking CMDB Health for relationship quality.",
  },
  {
    question: "When am I ready to schedule CIS-SM?",
    answer:
      "Schedule when you can score 80% or higher on two timed mixed-domain mock exams, explain every missed question as a mapping or CMDB decision, and troubleshoot a service map from entry point to MID Server, credential, pattern, identification rule, relationship, or service-candidate validation.",
  },
];

const howToSteps = [
  {
    name: "Take a baseline CIS-SM practice test",
    text: "Start with a mixed-domain diagnostic before studying. Tag misses as Pattern Design, Service Mapping Configuration, Discovery Configuration, CMDB Integration, Machine Learning, or Engagement Readiness.",
    position: 1,
  },
  {
    name: "Master Pattern Design first",
    text: "Pattern Design is the largest domain at 30%. Spend the most time on Pattern Designer operations, temporary variables, parsing, regex, command output, connection sections, application identification, and debugging.",
    position: 2,
  },
  {
    name: "Build Service Mapping configuration judgment",
    text: "Learn entry points, credentials, schedules, service groups, CI types, service candidates, map tuning, and when to adjust boundaries or suggested connections instead of forcing manual relationships.",
    position: 3,
  },
  {
    name: "Connect maps to Discovery and CMDB outcomes",
    text: "Service Mapping relies on trusted Discovery and CMDB data. Review MID Server troubleshooting, PCIE phases, identification and reconciliation, Application Service records, dependency relationships, duplicates, and CMDB Health.",
    position: 4,
  },
  {
    name: "Practice readiness and ML scenarios",
    text: "Engagement Readiness and Machine Learning are lower-weight domains, but they often decide close scenario questions about service definition, scope, ownership, service candidates, and recommended mapping methods.",
    position: 5,
  },
  {
    name: "Finish with timed mocks and a map-quality miss log",
    text: "Take timed mock exams until you score at least 80% twice. For every miss, write the artifact you would inspect: service map, entry point, Discovery Status, ECC Queue, Pattern Designer debug output, CI identifier, or Service Mapping Workspace recommendation.",
    position: 6,
  },
];

const fourWeekPlan = [
  {
    week: "Week 1",
    title: "Service Mapping architecture baseline",
    focus: "Diagnostic + Service Mapping and Discovery foundation",
    goal: "Understand how Service Mapping uses Discovery, entry points, patterns, and CMDB relationships before memorizing feature names.",
    tasks: [
      "Read the CIS-SM blueprint and rank domains by weight: 30%, 20%, 15%, 15%, 10%, 10%.",
      "Take 40-60 mixed practice questions and create a miss log grouped by domain and ServiceNow artifact.",
      "Review how MID Servers, credentials, PCIE phases, patterns, Application Services, and CMDB relationships fit together.",
    ],
    success:
      "You can draw the flow from entry point to discovered infrastructure, pattern execution, dependency relationship, and service map output.",
  },
  {
    week: "Week 2",
    title: "Pattern Design mastery",
    focus: "Service Mapping Pattern Design (30%)",
    goal: "Make pattern operations, parsing, temporary variables, command output, and application identification predictable.",
    tasks: [
      "Open Pattern Designer and review sections, operations, variables, connection logic, payloads, and CI attribute mapping.",
      "Practice regex, parse command output, table parsing, WMI/SSH/SNMP examples, and debug-output interpretation.",
      "Answer Pattern Design-only questions until you can explain why a pattern fails and which step to inspect next.",
    ],
    success:
      "Pattern Design practice scores are 80%+ and you can explain how application identification differs from generic infrastructure discovery.",
  },
  {
    week: "Week 3",
    title: "Configuration, candidates, and CMDB quality",
    focus: "Service Mapping Configuration + CMDB Integration",
    goal: "Trace a service map from configuration choices to trustworthy Application Service and CI relationship records.",
    tasks: [
      "Inspect entry points, credentials, service groups, schedules, technical services, suggested connections, and map boundaries.",
      "Review Service Mapping Workspace, mapping-method recommendations, service candidates, ML suggestions, and validation before promotion.",
      "Use CMDB Health and CI Class Manager to understand duplicates, stale relationships, source precedence, and service-dependency quality.",
    ],
    success:
      "You can decide whether to fix entry point scope, credentials, schedule design, pattern logic, service-candidate validation, or CMDB identification rules.",
  },
  {
    week: "Week 4",
    title: "Readiness and timed exam simulation",
    focus: "Engagement Readiness + mixed mocks",
    goal: "Turn platform knowledge into exam-speed implementation judgment.",
    tasks: [
      "Take at least two 60-question timed CIS-SM mock exams.",
      "Review service-definition workshops, owner alignment, shared services, MID Server sizing, network prerequisites, credential ownership, support dashboards, and KPIs.",
      "Redo weak-domain labs, then retake mixed practice until no domain is below 70% and the overall score is 80%+.",
    ],
    success:
      "You can complete 60 questions in under 90 minutes, score 80%+, and justify every answer with the map artifact or implementation principle involved.",
  },
];

const labChecklist = [
  {
    lab: "Application service and entry point walkthrough",
    domain: "Service Mapping Configuration",
    outcome:
      "Create or inspect an Application Service, define entry points, review discovered dependencies, and explain how entry-point scope controls map quality.",
  },
  {
    lab: "Pattern Designer debug session",
    domain: "Pattern Design",
    outcome:
      "Open a Service Mapping pattern, inspect sections, operations, temporary variables, command output, and CI mapping, then explain the next step for a failed parse.",
  },
  {
    lab: "MID Server, credential, and Discovery Status trace",
    domain: "Discovery Configuration",
    outcome:
      "Validate MID Server status, test credentials, review ECC Queue or Discovery Status records, and identify whether a mapping failure starts before or inside the pattern.",
  },
  {
    lab: "Service Mapping Workspace candidate review",
    domain: "Machine Learning",
    outcome:
      "Review service candidates or mapping recommendations, identify confidence and scope signals, and decide what needs owner validation before promotion.",
  },
  {
    lab: "CMDB relationship quality check",
    domain: "CMDB Integration",
    outcome:
      "Inspect Application Service relationships, CI Class Manager, identifiers, duplicate indicators, stale relationships, and CMDB Health to connect map output to trusted operations data.",
  },
  {
    lab: "Implementation readiness board",
    domain: "Engagement Readiness",
    outcome:
      "Document service owner, application owner, entry points, credentials, MID Server capacity, network prerequisites, scan windows, support handoff, and KPI targets for one service mapping rollout.",
  },
];

const decisionDrills = [
  {
    prompt:
      "A service map starts from a valid URL but misses several downstream application components.",
    test: "Do you immediately add manual relationships, or inspect entry points, connection logic, and pattern output first?",
    answer:
      "Inspect the map path first: entry-point scope, discovered connections, pattern output, credentials, and CI relationship mapping. Manual relationships can hide the root cause and produce brittle maps.",
  },
  {
    prompt:
      "Pattern debug shows process data, but the Application Service record does not show the expected dependency.",
    test: "Can you separate parsing success from relationship and CMDB acceptance?",
    answer:
      "Yes. Parsed data is only one step. Review CI mapping, relationship creation, identification rules, reconciliation/source precedence, and whether the dependency is inside the map boundary.",
  },
  {
    prompt:
      "A service candidate appears in Service Mapping Workspace, but the owner is unsure whether to promote it.",
    test: "Do you accept the ML suggestion automatically?",
    answer:
      "No. Treat ML as guidance. Validate owner, entry points, business context, dependency completeness, CI quality, and support model before promoting a candidate into a managed service.",
  },
  {
    prompt:
      "An application team wants to map every shared database and load balancer as part of their service without clarifying ownership.",
    test: "Can you define boundaries without losing useful dependency visibility?",
    answer:
      "Model dependencies accurately but clarify service boundaries, shared-service ownership, and support responsibility. CIS-SM scenario questions reward maps that are operationally useful, not just visually complete.",
  },
  {
    prompt:
      "A map works in a lab but fails in production after credentials rotate.",
    test: "Is this a map-design issue, a readiness issue, or both?",
    answer:
      "Start with readiness and operations: credential ownership, rotation process, MID Server access, monitoring, and support handoff. A technically correct map still fails if operational ownership is weak.",
  },
];

const commonMistakes = [
  {
    title: "Treating Service Mapping as Discovery with prettier diagrams",
    body: "Service Mapping uses Discovery fundamentals, but the exam tests business-service context: entry points, application services, service candidates, dependency boundaries, and operational value.",
    icon: "🗺️",
  },
  {
    title: "Understudying Pattern Design",
    body: "Pattern Design is 30% of CIS-SM. Know operations, variables, parsing, regex, debug output, connection sections, command outputs, and application identification decisions.",
    icon: "🧩",
  },
  {
    title: "Skipping Discovery troubleshooting fundamentals",
    body: "MID Server, credentials, ECC Queue, Discovery Status, IP services, behaviors, and PCIE phases still matter because mapping failures often start before Service Mapping-specific logic runs.",
    icon: "🖥️",
  },
  {
    title: "Accepting ML or candidate suggestions without validation",
    body: "Machine learning can identify possible services, but the implementer still validates owners, boundaries, entry points, dependency quality, and business meaning before promoting candidates.",
    icon: "🤖",
  },
  {
    title: "Forgetting CMDB consequences",
    body: "A service map is only useful if Application Service records, CIs, and relationships are trusted. Identification, reconciliation, duplicates, stale CIs, and CMDB Health remain exam-relevant.",
    icon: "🗃️",
  },
  {
    title: "Ignoring engagement readiness",
    body: "Service Mapping projects fail when owners, credentials, network access, scan windows, MID Server capacity, support handoff, and KPIs are not defined before rollout.",
    icon: "📋",
  },
];

const sampleQuestions = [
  {
    topic: "Pattern Design",
    topicSlug: "pattern-design",
    weight: 30,
    question:
      "A Service Mapping pattern step returns command output, but a downstream CI attribute remains blank. What should you inspect first?",
    options: [
      "The parsed variables and CI attribute mapping in the pattern",
      "Only the user notification preferences",
      "The catalog item variable set",
      "Only the application service owner field",
    ],
    correctAnswer:
      "The parsed variables and CI attribute mapping in the pattern",
    explanation:
      "Pattern troubleshooting follows the data path: command output, parse operation, variables or tables, and mapping to CI attributes before broader CMDB checks.",
  },
  {
    topic: "Service Mapping Configuration",
    topicSlug: "sm-configuration",
    weight: 20,
    question:
      "A map includes unrelated components after an entry point is added. Which configuration area is most relevant?",
    options: [
      "Entry-point scope, map boundaries, and connection suggestions",
      "Knowledge article retirement workflow",
      "Password policy lockout text",
      "Inbound email watermark parsing",
    ],
    correctAnswer:
      "Entry-point scope, map boundaries, and connection suggestions",
    explanation:
      "Entry points and map boundaries strongly influence what Service Mapping includes. Tune those before accepting an overly broad or noisy dependency map.",
  },
  {
    topic: "CMDB Integration",
    topicSlug: "cmdb-integration",
    weight: 15,
    question:
      "A service map shows duplicate infrastructure CIs supporting the same application service. Which CMDB concept should you review?",
    options: [
      "Identification rules and duplicate/de-duplication behavior",
      "Portal widget color variables",
      "Survey trigger conditions",
      "Report chart color palettes",
    ],
    correctAnswer: "Identification rules and duplicate/de-duplication behavior",
    explanation:
      "Duplicates usually mean incoming data was not matched to an existing CI. Identification rules and de-duplication behavior are central to trusted map output.",
  },
  {
    topic: "Machine Learning",
    topicSlug: "machine-learning",
    weight: 10,
    question:
      "Service Mapping Workspace suggests a service candidate. What should an implementer do before promoting it?",
    options: [
      "Validate owner, scope, entry points, dependencies, and business meaning",
      "Promote every candidate immediately to maximize map count",
      "Disable all CMDB Health rules",
      "Delete related Discovery schedules",
    ],
    correctAnswer:
      "Validate owner, scope, entry points, dependencies, and business meaning",
    explanation:
      "ML recommendations accelerate discovery of candidates, but human validation is required before a candidate becomes an operational service map.",
  },
];

const readinessChecklist = [
  "Score 80% or higher on two timed CIS-SM mock exams.",
  "Explain Pattern Design and Service Mapping Configuration without notes; together they are 50% of the exam.",
  "Trace a failed service map through entry point, MID Server, credential, Discovery Status, pattern debug output, CI mapping, and CMDB rules.",
  "Decide when to fix map boundaries, pattern logic, credentials, candidate validation, identifier criteria, or relationship quality.",
  "Use a lab instance to inspect Service Mapping Workspace, Pattern Designer, Application Service records, MID Server dashboards, credentials, and CMDB Health.",
  "Maintain a miss log where every wrong answer is rewritten as a map-quality or implementation-readiness rule.",
];

export default async function CISSMStudyGuidePage() {
  const cert = getCertificationBySlug(CERT_SLUG)!;
  const totalQuestions = getTotalQuestionCount(CERT_SLUG);
  const domains = [...cert.domains]
    .sort((a, b) => b.percentage - a.percentage)
    .map((domain) => ({
      ...domain,
      keyTopics: domainFocus[domain.slug] ?? [domain.description],
    }));

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Certifications", url: "/certifications" },
    { name: "CIS-SM", url: "/cis-sm" },
    { name: "Study Guide", url: "/cis-sm/study-guide" },
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
    name: "How to Pass the CIS-SM Exam",
    description:
      "A four-week, domain-weighted study plan for the ServiceNow Certified Implementation Specialist - Service Mapping exam.",
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
    name: "CIS-SM Service Mapping Exam Preparation",
    description:
      "Complete SNReady study guide for the ServiceNow CIS-SM certification exam, covering Service Mapping Pattern Design, Service Mapping Configuration, Discovery Configuration, Machine Learning, CMDB Integration, and Engagement Readiness.",
    provider: {
      "@type": "Organization",
      name: "SNReady",
      url: "https://snready.com",
    },
    educationalLevel: "Professional",
    about: {
      "@type": "Thing",
      name: "ServiceNow CIS-SM",
      description:
        "Certified Implementation Specialist - Service Mapping covering service maps, Pattern Designer, Discovery dependencies, ML service candidates, and CMDB relationships.",
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
              <Link href="/cis-sm" className="hover:text-emerald-600">
                CIS-SM
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
              How to Pass the CIS-SM Exam
              <span className="mt-2 block text-lg font-normal text-zinc-500 dark:text-zinc-400 sm:text-xl">
                Certified Implementation Specialist — Service Mapping
              </span>
            </h1>

            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300">
              CIS-SM rewards candidates who can convert technical discovery data
              into accurate application service maps. This guide follows the
              CIS-DF-style study-guide pattern: official domain weights, a
              four-week calendar, hands-on labs, scenario drills, common
              mistakes, sample questions, and readiness criteria before you book
              the exam.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                {
                  label: "Questions",
                  value: `${cert.examDetails.questionCount}`,
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
                href="/cis-sm/mock-exam"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Take a Timed Mock Exam
              </Link>
              <Link
                href="/cis-sm/practice-questions"
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
              About the CIS-SM Exam
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              The exam validates your ability to implement Service Mapping and
              keep resulting application-service data trustworthy. Expect
              scenario questions about Pattern Designer, entry points, service
              candidates, MID Servers, credentials, Discovery Status, machine
              learning recommendations, Application Service records, CMDB
              relationships, and implementation readiness.
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
                    {cert.examDetails.passingScore}% passing score
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              CIS-SM Domain Breakdown
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Study time should match blueprint weight. Pattern Design (30%) and
              Service Mapping Configuration (20%) should dominate your first
              pass, then reinforce Discovery, CMDB, Machine Learning, and
              Engagement Readiness scenarios.
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
                        href={`/cis-sm/practice-questions/${domain.slug}`}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        Practice {domain.name} →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              Domain percentages are based on the official ServiceNow exam
              blueprint data stored in SNReady.
            </p>
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              How to Study for CIS-SM
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Follow the exam weight, then use labs to convert memorized facts
              into mapping and implementation judgment.
            </p>
            <div className="mt-8 grid gap-4">
              {howToSteps.map((step) => (
                <div
                  key={step.position}
                  className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    Step {step.position}
                  </div>
                  <h3 className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
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
                  A practical CIS-SM prep plan
                </h2>
              </div>
              <Link
                href="/cis-sm/mock-exam"
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
              CIS-SM Hands-on Lab Checklist
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Use a Personal Developer Instance or lab environment to verify the
              concepts that exam questions turn into scenarios.
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
              Scenario Drills: Think Like a Service Mapping Implementer
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Use these as decision drills. If you can explain which map,
              pattern, Discovery, or CMDB artifact to inspect next, you are
              studying implementation logic rather than memorizing keywords.
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
              Common CIS-SM Mistakes to Avoid
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
                  Free CIS-SM Practice Questions
                </h2>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  Representative questions from high-value domains. Use the full
                  bank for timed readiness practice.
                </p>
              </div>
              <Link
                href="/cis-sm/practice-questions"
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
                      <Link
                        href={`/cis-sm/practice-questions/${q.topicSlug}`}
                        className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 hover:text-emerald-700 dark:bg-zinc-800 dark:text-zinc-400"
                      >
                        {q.topic}
                      </Link>
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
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-emerald-50 py-16 dark:border-zinc-800 dark:bg-emerald-950/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-emerald-200 bg-white p-8 dark:border-emerald-900/60 dark:bg-zinc-900">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Final CIS-SM Readiness Checklist
              </h2>
              <ul className="mt-6 space-y-3">
                {readinessChecklist.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/cis-sm/mock-exam"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Take the CIS-SM Mock Exam
                </Link>
                <Link
                  href="/cis-sm/practice-questions"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  Practice All {totalQuestions}+ Questions
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 py-16 dark:border-zinc-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              CIS-SM FAQ
            </h2>
            <div className="mt-8 space-y-4">
              {faqData.map((faq) => (
                <details
                  key={faq.question}
                  className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <summary className="cursor-pointer font-semibold text-zinc-900 dark:text-zinc-100">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {faq.answer}
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
