import { Metadata } from "next";
import Link from "next/link";
import { getCertificationBySlug, getTotalQuestionCount } from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title:
    "How to Pass CIS-Discovery — Complete ServiceNow Discovery Study Guide [2026]",
  description:
    "Complete ServiceNow CIS-Discovery study guide with official domain weights, a 4-week study calendar, MID Server and Pattern Designer labs, scenario drills, common mistakes, readiness checklist, and 100 CIS-Discovery practice questions.",
  keywords: [
    "CIS-Discovery study guide",
    "ServiceNow Discovery certification",
    "CIS-Discovery exam prep",
    "ServiceNow Discovery practice questions",
    "CIS-Discovery mock exam",
    "Discovery Pattern Designer exam",
    "MID Server certification questions",
    "ServiceNow PCIE Discovery phases",
    "ServiceNow Discovery configuration",
    "CMDB Discovery certification",
  ],
  alternates: {
    canonical: "/cis-discovery/study-guide",
  },
  openGraph: {
    title: "How to Pass the ServiceNow CIS-Discovery Exam | SNReady",
    description:
      "Domain-by-domain CIS-Discovery study plan with Pattern Designer priorities, MID Server labs, scenario drills, and timed practice-question links.",
    type: "article",
  },
};

const CERT_SLUG = "cis-discovery";

const domainFocus: Record<string, string[]> = {
  "pattern-design": [
    "Pattern Designer navigation, debug mode, pattern operations, variables, tables, shared libraries, and payload inspection",
    "Horizontal patterns versus application patterns, including process classification and application identification sections",
    "Regex, parsing strategies, temporary variables, CI attributes, and troubleshooting pattern step failures",
  ],
  "discovery-configuration": [
    "Discovery schedules, ranges, behaviors, clusters, IP services, credentials, credential aliases, and credential affinity",
    "PCIE phases: Scanning, Classification, Identification, and Exploration, including where Shazzam, classify probes, sensors, and patterns fit",
    "ECC Queue, Discovery Status, MID Server communication, common errors, and systematic troubleshooting paths",
  ],
  "cmdb-integration": [
    "CI Class Manager, class hierarchy, cmdb_ci extensions, model categories, and how discovered CIs become useful operational records",
    "Identification rules, reconciliation/source precedence, duplicate prevention, de-duplication tasks, and reclassification decisions",
    "CMDB Health metrics: completeness, compliance, correctness, orphan/stale/duplicate indicators, and relationship quality",
  ],
  "engagement-readiness": [
    "MID Server installation prerequisites, sizing, clustering, validation, dashboards, and operational monitoring",
    "Discovery implementation planning: stakeholders, network access, credentials, schedule design, error ownership, and support readiness",
    "How to explain Discovery business value: automated CMDB population, impact analysis, service visibility, and operational risk reduction",
  ],
};

const faqData = [
  {
    question: "What is the ServiceNow CIS-Discovery exam?",
    answer:
      "The ServiceNow Certified Implementation Specialist - Discovery exam validates that you can implement Discovery, configure MID Servers and credentials, design or troubleshoot patterns, populate the CMDB correctly, and prepare an organization to operate Discovery after go-live.",
  },
  {
    question: "How many questions are on CIS-Discovery?",
    answer:
      "SNReady lists CIS-Discovery as a 60-question exam with a 90-minute time limit and a 70% passing score for planning purposes. The exam uses multiple-choice and multiple-select questions.",
  },
  {
    question: "Which CIS-Discovery domains should I study first?",
    answer:
      "Start with Discovery Pattern Design and Discovery Configuration because each is weighted at 35%. Together they account for 70% of the exam. Then study CMDB Integration and Engagement Readiness, which are 15% each.",
  },
  {
    question: "Is CIS-Discovery harder than CSA or CIS-DF?",
    answer:
      "For most candidates, yes. CSA is broad platform administration and CIS-DF is CMDB/CSDM governance. CIS-Discovery adds technical implementation judgment: MID Server architecture, network credentials, PCIE troubleshooting, pattern parsing, and CMDB identification decisions.",
  },
  {
    question: "How long should I study for CIS-Discovery?",
    answer:
      "Plan four focused weeks if you already have CSA and CIS-DF-level CMDB understanding. Add extra time if you have not configured MID Servers, credentials, schedules, or Pattern Designer in a real or lab instance.",
  },
  {
    question: "What hands-on labs help most for CIS-Discovery?",
    answer:
      "The most valuable labs are validating a MID Server, creating a Discovery schedule, testing credentials, tracing a Discovery Status through PCIE phases, debugging a pattern step, reviewing ECC Queue records, and checking how discovered CIs affect CMDB Health.",
  },
  {
    question: "When am I ready to schedule CIS-Discovery?",
    answer:
      "Schedule when you can score 80% or higher on two timed mixed-domain mock exams, explain every missed question as a Discovery implementation decision, and troubleshoot a failed discovery from status record to MID Server, credential, PCIE phase, pattern, or CMDB rule.",
  },
];

const howToSteps = [
  {
    name: "Take a baseline CIS-Discovery practice test",
    text: "Start with a mixed-domain diagnostic before studying. Sort misses into Pattern Design, Discovery Configuration, CMDB Integration, and Engagement Readiness, then tag the cause: terminology, platform navigation, PCIE phase, MID Server, credential, pattern, or CMDB rule.",
    position: 1,
  },
  {
    name: "Master Pattern Design and Discovery Configuration first",
    text: "The two 35% domains are the exam. Spend most of your study time on Pattern Designer operations, parsing and regex, application identification, schedules, credentials, behaviors, PCIE phases, ECC Queue, and Discovery Status troubleshooting.",
    position: 2,
  },
  {
    name: "Connect Discovery output to CMDB outcomes",
    text: "Discovery is not finished when a device responds. You must know how discovered data becomes CIs, how identification and reconciliation prevent duplicates, and how CMDB Health reveals stale, incomplete, orphaned, or duplicate records.",
    position: 3,
  },
  {
    name: "Practice implementation-readiness scenarios",
    text: "Engagement Readiness questions test whether you can plan a deployment: MID Server sizing, credentials, firewall access, schedules, ownership, dashboards, support handoff, and explaining business value to stakeholders.",
    position: 4,
  },
  {
    name: "Finish with timed mocks and a miss log",
    text: "Take timed mock exams until you score at least 80% twice. For every miss, write the underlying rule and the exact artifact you would inspect in ServiceNow: Discovery Status, ECC Queue, MID Server dashboard, credential test, pattern debug output, or CMDB Health.",
    position: 5,
  },
];

const fourWeekPlan = [
  {
    week: "Week 1",
    title: "Discovery architecture baseline",
    focus: "Diagnostic + PCIE + MID Server foundation",
    goal: "Understand how Discovery traffic flows before memorizing pattern details.",
    tasks: [
      "Read the CIS-Discovery blueprint and sort all domains by weight: 35%, 35%, 15%, 15%.",
      "Draw the PCIE flow from Shazzam scanning through classification, identification, and exploration.",
      "Review MID Server installation, validation, clustering, dashboards, ECC Queue communication, and credential testing.",
      "Take 40-60 mixed practice questions and start a miss log grouped by failed artifact or decision point.",
    ],
    success:
      "You can explain why Discovery failed by choosing a likely PCIE phase and the first record or dashboard you would inspect.",
  },
  {
    week: "Week 2",
    title: "Pattern Designer and parsing decisions",
    focus: "Pattern Design (35%)",
    goal: "Make pattern operations, variables, parsing, and debugging predictable.",
    tasks: [
      "Open Pattern Designer and review horizontal patterns, application patterns, sections, operations, variables, and CI attribute mapping.",
      "Practice regex and parsing decisions: match, parse variable, parse file, temporary variables, and table outputs.",
      "Debug representative pattern failures and describe whether the issue is input payload, parsing logic, CI mapping, or identification.",
    ],
    success:
      "Pattern Design practice scores are 80%+ and you can explain how an application identification section differs from horizontal infrastructure discovery.",
  },
  {
    week: "Week 3",
    title: "Configuration, credentials, and CMDB impact",
    focus: "Discovery Configuration + CMDB Integration",
    goal: "Trace a device from schedule configuration to a trusted CI in the CMDB.",
    tasks: [
      "Configure or inspect schedules, ranges, behaviors, clusters, IP services, credential aliases, credential affinity, and credential-less discovery.",
      "Review CI Class Manager, CMDB table hierarchy, model categories, identification rules, reconciliation/source precedence, and de-duplication.",
      "Use CMDB Health to connect Discovery data quality to completeness, compliance, correctness, stale records, orphan records, and duplicates.",
    ],
    success:
      "You can explain how a device scan becomes a CI and when to fix credentials, schedule scope, pattern logic, identifier criteria, or reconciliation precedence.",
  },
  {
    week: "Week 4",
    title: "Timed scenario simulation",
    focus: "Engagement Readiness + mixed mocks",
    goal: "Convert platform knowledge into exam-speed implementation judgment.",
    tasks: [
      "Take at least two 60-question timed CIS-Discovery mock exams.",
      "Review implementation planning: MID Server sizing, support ownership, schedule windows, network/firewall prerequisites, dashboards, and business outcomes.",
      "Redo weak-domain labs, then retake mixed practice until no domain is below 70% and the overall score is 80%+.",
    ],
    success:
      "You can complete 60 questions in under 90 minutes, score 80%+, and justify every answer with the ServiceNow artifact or design principle involved.",
  },
];

const pdiLabChecklist = [
  {
    lab: "MID Server health and validation walkthrough",
    domain: "Engagement Readiness / Discovery Configuration",
    outcome:
      "Inspect MID Server status, capabilities, validation, clustering or load distribution, dashboard health, and how ECC Queue traffic confirms instance-to-network communication.",
  },
  {
    lab: "Discovery schedule and range design",
    domain: "Discovery Configuration",
    outcome:
      "Create or inspect a schedule with ranges, behaviors, IP services, credentials, and execution windows; explain how scope affects scan time, credential noise, and CMDB quality.",
  },
  {
    lab: "Credential test and affinity drill",
    domain: "Discovery Configuration",
    outcome:
      "Test Windows, SSH, SNMP, or PowerShell credentials, review credential affinity behavior, and document the first troubleshooting step for failed authentication.",
  },
  {
    lab: "PCIE status trace",
    domain: "Discovery Configuration",
    outcome:
      "Trace a Discovery Status through Scanning, Classification, Identification, and Exploration; identify where Shazzam, classify probes, sensors, patterns, and CI updates appear.",
  },
  {
    lab: "Pattern Designer debug session",
    domain: "Pattern Design",
    outcome:
      "Open a pattern, review sections and operations, inspect payload and temporary variables, debug a parse step, and explain why the output maps or fails to map to CI attributes.",
  },
  {
    lab: "CMDB Health and duplicate review",
    domain: "CMDB Integration",
    outcome:
      "Inspect CI Class Manager, identifiers, CMDB Health, duplicate indicators, stale/orphan records, and source precedence to connect Discovery output to governance outcomes.",
  },
];

const decisionDrills = [
  {
    prompt:
      "A server is reachable by ping, but Discovery never gets past initial scanning.",
    test: "Do you start with the pattern or with scan/classification evidence?",
    answer:
      "Start before the pattern. Confirm Shazzam/open ports, schedule scope, IP services, firewall access, and Discovery Status details. Pattern exploration only matters after classification and identification reach the relevant pattern stage.",
  },
  {
    prompt:
      "A Windows host discovers intermittently and different credentials appear to be tried each run.",
    test: "Can you separate credential validity from credential affinity behavior?",
    answer:
      "Test credential validity first, then review credential affinity and aliases. Affinity should help Discovery reuse working credentials, but bad or inconsistent credential setup creates noisy failures.",
  },
  {
    prompt:
      "A pattern returns data in debug mode, but the CI record is incomplete after a schedule runs.",
    test: "Do you inspect parsing only, or also CI mapping and identification/reconciliation?",
    answer:
      "Inspect the parsed variables, CI attribute mapping, identification rules, and reconciliation/source precedence. Pattern output does not guarantee accepted CMDB updates.",
  },
  {
    prompt:
      "A stakeholder wants to run Discovery across every subnet during business hours to finish faster.",
    test: "Can you balance implementation speed with operational risk?",
    answer:
      "Design controlled schedules and ranges with network, security, and operations input. Discovery should reduce risk, not create scan noise, credential lockouts, or unowned errors.",
  },
];

const commonMistakes = [
  {
    title: "Understudying Pattern Design because it feels too technical",
    body: "Pattern Design is 35% of the exam. You need to understand operations, variables, parsing, regex, application identification sections, and debug workflow — not just vocabulary.",
    icon: "🧩",
  },
  {
    title: "Confusing the PCIE phases",
    body: "Scanning, Classification, Identification, and Exploration each answer a different question. Many troubleshooting questions are solvable once you know which phase failed.",
    icon: "🔎",
  },
  {
    title: "Treating MID Server as a black box",
    body: "Know validation, dashboards, ECC Queue communication, capacity, clustering, network reachability, and credential execution. MID Server is central to implementation readiness.",
    icon: "🖥️",
  },
  {
    title: "Forgetting CMDB consequences",
    body: "The exam does not stop at device discovery. Identification rules, reconciliation, duplicates, stale records, relationships, and CMDB Health determine whether Discovery creates trusted data.",
    icon: "🗃️",
  },
  {
    title: "Memorizing ports without troubleshooting context",
    body: "Ports matter, but exam scenarios often ask what to inspect next: Shazzam results, credentials, classify probes, ECC Queue, Discovery Status, pattern logs, or CMDB rules.",
    icon: "🔌",
  },
  {
    title: "Skipping implementation planning",
    body: "Engagement Readiness is 15%. Be ready for stakeholder, schedule, sizing, support, dashboard, credential ownership, and rollout questions.",
    icon: "📋",
  },
];

const sampleQuestions = [
  {
    topic: "Discovery Configuration",
    topicSlug: "discovery-configuration",
    weight: 35,
    question: "What is the purpose of the Shazzam probe during Discovery?",
    options: [
      "To authenticate with target devices using credentials",
      "To detect open ports on devices in the network",
      "To update configuration items in the CMDB",
      "To collect detailed hardware specifications",
    ],
    correctAnswer: "To detect open ports on devices in the network",
    explanation:
      "Shazzam runs during the scanning phase to detect open ports. That port evidence helps ServiceNow decide which classification probes should run next.",
  },
  {
    topic: "Pattern Design",
    topicSlug: "pattern-design",
    weight: 35,
    question:
      "A pattern step extracts the right process output in debug mode but the downstream CI fields stay empty. What should you inspect next?",
    options: [
      "Only the MID Server service account password",
      "The pattern operation output, temporary variables, and CI attribute mapping",
      "The user notification preferences for Discovery administrators",
      "Only the business service offering record",
    ],
    correctAnswer:
      "The pattern operation output, temporary variables, and CI attribute mapping",
    explanation:
      "Pattern troubleshooting follows the data: source payload, parse operation, variables/tables, and mapping to CI attributes before checking CMDB rules.",
  },
  {
    topic: "CMDB Integration",
    topicSlug: "cmdb-integration",
    weight: 15,
    question:
      "Discovery creates duplicate server CIs after a new credential and schedule rollout. Which CMDB area is most relevant first?",
    options: [
      "Identification rules and identifier criteria",
      "Portal theme records",
      "Catalog variable sets",
      "Email inbound action classification",
    ],
    correctAnswer: "Identification rules and identifier criteria",
    explanation:
      "Duplicates usually mean incoming data was not recognized as an existing CI. Identification rules and identifier criteria determine matching before reconciliation updates attributes.",
  },
  {
    topic: "Engagement Readiness",
    topicSlug: "engagement-readiness",
    weight: 15,
    question:
      "Before expanding Discovery to production subnets, which planning action is most important?",
    options: [
      "Run every range continuously to maximize CI count",
      "Coordinate network access, credential ownership, scan windows, MID Server capacity, and support monitoring",
      "Disable CMDB Health until all subnets have been scanned",
      "Replace all identification rules with manual CI creation",
    ],
    correctAnswer:
      "Coordinate network access, credential ownership, scan windows, MID Server capacity, and support monitoring",
    explanation:
      "Engagement readiness focuses on safe, supportable rollout. Discovery must be scheduled, owned, monitored, and sized to avoid operational disruption and bad data.",
  },
];

const readinessChecklist = [
  "Score 80% or higher on two timed CIS-Discovery mock exams.",
  "Explain Pattern Design and Discovery Configuration without notes; together they are 70% of the exam.",
  "Trace a failed scan through Discovery Status, PCIE phase, ECC Queue, MID Server, credentials, pattern debug output, and CMDB rules.",
  "Describe when to change schedule scope, credentials, behavior, pattern logic, identifier criteria, or reconciliation precedence.",
  "Use a lab instance to inspect Pattern Designer, MID Server dashboards, Discovery schedules, credential tests, CI Class Manager, and CMDB Health.",
  "Maintain a miss log where every wrong answer is rewritten as an implementation rule, not a memorized answer.",
];

export default async function CISDiscoveryStudyGuidePage() {
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
    { name: "CIS-Discovery", url: "/cis-discovery" },
    { name: "Study Guide", url: "/cis-discovery/study-guide" },
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
    name: "How to Pass the CIS-Discovery Exam",
    description:
      "A four-week, domain-weighted study plan for the ServiceNow Certified Implementation Specialist - Discovery exam.",
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
    name: "CIS-Discovery Exam Preparation",
    description:
      "Complete SNReady study guide for the ServiceNow CIS-Discovery certification exam, covering Pattern Design, Discovery Configuration, CMDB Integration, and Engagement Readiness.",
    provider: {
      "@type": "Organization",
      name: "SNReady",
      url: "https://snready.com",
    },
    educationalLevel: "Professional",
    about: {
      "@type": "Thing",
      name: "ServiceNow CIS-Discovery",
      description:
        "Certified Implementation Specialist - Discovery covering MID Servers, Discovery configuration, patterns, and CMDB population.",
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
              <Link href="/cis-discovery" className="hover:text-emerald-600">
                CIS-Discovery
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
              How to Pass the CIS-Discovery Exam
              <span className="mt-2 block text-lg font-normal text-zinc-500 dark:text-zinc-400 sm:text-xl">
                Certified Implementation Specialist — Discovery
              </span>
            </h1>

            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300">
              CIS-Discovery rewards candidates who can troubleshoot real
              discovery behavior: MID Server reachability, credentials, PCIE
              phases, pattern parsing, and CMDB outcomes. This guide follows the
              CIS-DF study-guide pattern and turns the official blueprint into a
              four-week plan with labs, scenario drills, and timed mock exams.
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
                href="/cis-discovery/mock-exam"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Take a Timed Mock Exam
              </Link>
              <Link
                href="/cis-discovery/practice-questions"
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
              About the CIS-Discovery Exam
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              The exam validates your ability to implement ServiceNow Discovery
              and keep the resulting data trustworthy. Expect scenario questions
              about Pattern Designer, schedules, credentials, MID Servers,
              Discovery Status, ECC Queue, identification/reconciliation, CMDB
              Health, and implementation readiness.
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
              CIS-Discovery Domain Breakdown
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Study time should match blueprint weight. Pattern Design and
              Discovery Configuration are each 35%, so they should dominate your
              prep time before you move to CMDB Integration and Engagement
              Readiness.
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
                        href={`/cis-discovery/practice-questions/${domain.slug}`}
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
              How to Study for CIS-Discovery
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Follow the exam weight, then use labs to convert memorized facts
              into implementation judgment.
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
                  A practical CIS-Discovery prep plan
                </h2>
              </div>
              <Link
                href="/cis-discovery/mock-exam"
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
              CIS-Discovery Hands-on Lab Checklist
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Use a Personal Developer Instance or lab environment to verify the
              concepts that exam questions turn into scenarios.
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
              Scenario Drills: Think Like a Discovery Implementer
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Use these as decision drills. If you can explain the next artifact
              to inspect, you are studying implementation logic rather than
              memorizing keywords.
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
              Common CIS-Discovery Mistakes to Avoid
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
                  Free CIS-Discovery Practice Questions
                </h2>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  One representative question from each domain. Use the full
                  bank for timed readiness practice.
                </p>
              </div>
              <Link
                href="/cis-discovery/practice-questions"
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
                        href={`/cis-discovery/practice-questions/${q.topicSlug}`}
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
                Final Readiness Checklist
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
                  href="/cis-discovery/mock-exam"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Take the CIS-Discovery Mock Exam
                </Link>
                <Link
                  href="/cis-discovery/practice-questions"
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
              CIS-Discovery FAQ
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
