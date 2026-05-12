import { Metadata } from "next";
import Link from "next/link";
import { getCertificationBySlug, getTotalQuestionCount } from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title:
    "How to Pass CPOA — Complete ServiceNow Platform Owner Study Guide [2026]",
  description:
    "Complete ServiceNow CPOA study guide with official domain weights, a 4-week platform-owner study calendar, hands-on governance lab checklist, scenario drills, common mistakes, readiness checklist, and CPOA practice questions.",
  keywords: [
    "CPOA study guide",
    "ServiceNow CPOA study guide",
    "Certified Platform Owner Associate exam prep",
    "CPOA practice questions",
    "ServiceNow platform owner certification",
    "CPOA exam domains",
    "ServiceNow governance exam",
    "ServiceNow platform strategy certification",
    "CPOA mock exam",
  ],
  alternates: {
    canonical: "/cpoa/study-guide",
  },
  openGraph: {
    title: "How to Pass the ServiceNow CPOA Exam | SNReady",
    description:
      "A practical CPOA study plan with domain priorities, platform-governance labs, scenario drills, and practice-question links.",
    type: "article",
  },
};

const CERT_SLUG = "cpoa";

const domainFocus: Record<string, string[]> = {
  technology: [
    "Upgrade, patch, and clone planning across development, test, and production instances",
    "Instance Data Replication (IDR), adapters, monitoring dashboards, and seeding requests",
    "Hermes messaging, near/far clusters, high availability, and AHA transfer concepts",
  ],
  strategy: [
    "Platform roadmap inputs, business outcomes, release planning, and technical governance",
    "Citizen development guardrails using low-code tools, delegation, and governance controls",
    "CMDB and data-strategy implications for protecting the technology landscape",
  ],
  people: [
    "OCM Community Champions, sponsors, communications, and adoption enablement",
    "Role, partner, and certification alignment for platform-owner operating models",
    "Knowledge governance, conflict resolution, and stakeholder engagement",
  ],
  process: [
    "Now Create stages, SDLC choices, and safe code-promotion processes",
    "Update Sets, instance strategy, test/validation gates, and release discipline",
    "Agile versus Waterfall tradeoffs for platform delivery teams",
  ],
  governance: [
    "Strategic, portfolio/demand, and technical governance levels",
    "Licensing channels, fulfiller/user license implications, and catalog adoption impacts",
    "Integration options, KPI selection, CSAT, and platform value governance",
  ],
  data: [
    "Foundational versus transactional data and why quality affects automation and reporting",
    "Reporting versus Performance Analytics for time-series KPIs and platform value metrics",
    "Strategic Planning Workspace, compliance sources, and TRUST Center awareness",
  ],
};

const faqData = [
  {
    question: "What is the ServiceNow CPOA exam?",
    answer:
      "The Certified Platform Owner Associate (CPOA) exam validates that you understand how to own, govern, and scale the ServiceNow platform. It covers strategy, people, process, technology, data, and ServiceNow governance decisions that platform owners make across the platform lifecycle.",
  },
  {
    question: "How many questions are on the CPOA exam?",
    answer:
      "SNReady lists the CPOA exam as 70 multiple-choice and multiple-select questions with a 90-minute time limit and a 70% passing score for planning purposes.",
  },
  {
    question: "Which CPOA domain should I study first?",
    answer:
      "Start with Technology because it is the largest domain at 22.9%, then Strategy at 21.4%. Together they represent nearly half the exam and anchor many scenario questions about upgrades, cloning, IDR, roadmaps, governance, and platform risk.",
  },
  {
    question: "Is CPOA a technical exam or a governance exam?",
    answer:
      "It is both. CPOA is not a developer exam, but it expects enough technical understanding to make platform-owner decisions about upgrades, cloning, data replication, code promotion, data quality, integrations, licensing, and governance structures.",
  },
  {
    question: "How long should I study for CPOA?",
    answer:
      "Most candidates should plan 4 weeks of structured study. Candidates who already own ServiceNow roadmap, release, governance, and stakeholder processes may compress the plan, but should still validate technology and licensing topics with practice questions.",
  },
  {
    question: "What hands-on practice helps most for CPOA?",
    answer:
      "Use a Personal Developer Instance or sandbox to inspect release notes, clone settings, update set movement, roles, reports, Performance Analytics examples, catalog/licensing implications, and governance artifacts. The goal is decision fluency, not memorizing UI clicks.",
  },
  {
    question: "When am I ready to schedule the CPOA exam?",
    answer:
      "Schedule after you can score 80% or higher on two timed mixed-domain mock exams, explain every missed question as a platform-owner decision, and defend upgrade, data, licensing, governance, and stakeholder tradeoffs without notes.",
  },
];

const howToSteps = [
  {
    name: "Take a baseline CPOA practice test",
    text: "Start with a mixed-domain diagnostic. Sort misses by decision type: roadmap, people/adoption, SDLC, technical operations, data/reporting, or governance/licensing.",
    position: 1,
  },
  {
    name: "Master Technology and Strategy first",
    text: "Technology (22.9%) and Strategy (21.4%) are the highest-weight CPOA domains. Study upgrades, cloning, IDR, Hermes, roadmap inputs, citizen development, and technical governance before lower-weight topics.",
    position: 2,
  },
  {
    name: "Connect People and Process to governance outcomes",
    text: "CPOA questions often ask what a platform owner should do when teams, sponsors, partners, or release practices create risk. Practice OCM, communication, role alignment, SDLC, Now Create, and code-promotion scenarios.",
    position: 3,
  },
  {
    name: "Learn Data and ServiceNow Governance decision points",
    text: "Study foundational versus transactional data, Performance Analytics versus reporting, TRUST Center, licensing implications, governance layers, integrations, KPIs, and catalog expansion impacts.",
    position: 4,
  },
  {
    name: "Turn concepts into platform-owner scenarios",
    text: "For every objective, ask: who owns this, what risk is reduced, what metric proves success, and which governance forum or technical control should be used?",
    position: 5,
  },
  {
    name: "Finish with timed mocks and an executive miss log",
    text: "Retake mixed mock exams until you can score 80% or higher twice and explain misses in platform-owner language: risk, value, ownership, compliance, adoption, or operational stability.",
    position: 6,
  },
];

const fourWeekPlan = [
  {
    week: "Week 1",
    title: "Platform ownership baseline",
    focus: "Diagnostic + Technology foundation",
    goal: "Establish your weakest domains and make core platform-operations concepts predictable.",
    tasks: [
      "Read the CPOA blueprint and sort all six domains by exam weight.",
      "Study upgrades, patches, clones, instance strategy, IDR, Hermes, high availability, and monitoring dashboards.",
      "Take 35-70 mixed practice questions and start a miss log grouped by platform-owner decision type.",
    ],
    success:
      "You can explain why production changes, upgrades, and clones need sub-production validation and governance controls before end-user impact.",
  },
  {
    week: "Week 2",
    title: "Strategy, roadmaps, and citizen development",
    focus: "Strategy + technical governance",
    goal: "Tie platform decisions to business outcomes and controlled platform growth.",
    tasks: [
      "Map roadmap inputs: business goals, release timing, demand, platform maturity, and risk.",
      "Review citizen development guardrails, delegated development, Flow Designer, CMDB context, and ATF value.",
      "Practice Strategy-only questions until you can defend roadmap and governance choices without keyword matching.",
    ],
    success:
      "You can describe how a platform owner balances speed, adoption, standards, security, and measurable value in a roadmap decision.",
  },
  {
    week: "Week 3",
    title: "People, process, and operating model",
    focus: "People + Process",
    goal: "Convert stakeholder and delivery-process topics into scenario judgment.",
    tasks: [
      "Compare sponsor, OCM Champion, partner, admin, developer, and governance roles in common conflict scenarios.",
      "Trace Now Create and SDLC gates from development through test/validation and production deployment.",
      "Review Update Sets, environment strategy, Agile versus Waterfall, knowledge governance, and communication planning.",
    ],
    success:
      "You can choose the right forum, role, communication, or release-control response when departments disagree or deployment risk increases.",
  },
  {
    week: "Week 4",
    title: "Data, governance, and exam simulation",
    focus: "Data + ServiceNow Governance + timed mocks",
    goal: "Bring lower-weight domains up to pass level and practice full-exam pacing.",
    tasks: [
      "Review foundational versus transactional data, reporting, Performance Analytics, TRUST Center, Strategic Planning Workspace, and value metrics.",
      "Study licensing channels, fulfiller/user implications, governance levels, integration options, CSAT, and catalog expansion risk.",
      "Take at least two 70-question timed CPOA mock exams and remediate every weak domain.",
    ],
    success:
      "You can finish a full CPOA mock exam under 90 minutes with 80%+ and no domain below 70%.",
  },
];

const pdiLabChecklist = [
  {
    lab: "Upgrade and clone readiness review",
    domain: "Technology",
    outcome:
      "Inspect release/upgrade planning artifacts, clone exclusions, data preservers, sub-production validation steps, and rollback considerations.",
  },
  {
    lab: "Instance and release pipeline map",
    domain: "Process / Technology",
    outcome:
      "Draw the development, test, and production path for a change and identify where update sets, testing, ATF, approvals, and validation belong.",
  },
  {
    lab: "Platform roadmap decision board",
    domain: "Strategy",
    outcome:
      "Create a simple roadmap board with business outcome, platform capability, owner, release dependency, governance risk, and success metric columns.",
  },
  {
    lab: "Governance role and escalation matrix",
    domain: "People / Governance",
    outcome:
      "Map strategic, portfolio/demand, and technical governance forums, then assign example conflicts to the correct forum and decision owner.",
  },
  {
    lab: "Data-quality and reporting drill",
    domain: "Data",
    outcome:
      "Compare a standard report with a KPI or Performance Analytics-style trend and explain when data quality blocks executive decision-making.",
  },
  {
    lab: "Licensing and integration impact review",
    domain: "ServiceNow Governance",
    outcome:
      "Trace a Service Catalog or integration expansion and identify requester, fulfiller, Integration Hub/spoke, and governance implications.",
  },
];

const decisionDrills = [
  {
    prompt:
      "A business unit wants a new low-code app delivered immediately by citizen developers.",
    test: "Can you balance speed with governance?",
    answer:
      "Enable citizen development only inside guardrails: delegated roles, approved patterns, technical governance, security review, testing, ownership, and roadmap alignment. CPOA rewards controlled enablement, not blanket denial or unmanaged speed.",
  },
  {
    prompt:
      "A team asks to apply an upgrade directly in production to meet a deadline.",
    test: "Do you prioritize schedule or operational stability?",
    answer:
      "Use sub-production validation first. Platform owners protect users and business processes by testing upgrades, cloning appropriately, validating integrations, and coordinating a controlled production window.",
  },
  {
    prompt:
      "Two departments disagree on platform priorities and both claim executive backing.",
    test: "Is this a technical admin problem or governance problem?",
    answer:
      "Route it through the right governance level. Portfolio/demand or strategic governance should reconcile priority, value, capacity, and sponsorship while technical governance handles implementation standards.",
  },
  {
    prompt:
      "A dashboard shows improving ticket counts, but executives still question platform value.",
    test: "Can you choose value-focused metrics?",
    answer:
      "Move beyond activity counts. Use value-driven KPIs such as MTTR, CSAT, adoption, cycle time, automation rate, risk reduction, and business-outcome alignment so reporting supports decisions.",
  },
  {
    prompt:
      "Service Catalog adoption is expanding to more requesters and fulfillment teams.",
    test: "Do you identify licensing and integration implications early?",
    answer:
      "Yes. Catalog growth can affect requester/user access, fulfiller/agent licensing, Integration Hub transactions, spoke usage, process ownership, reporting, and support capacity.",
  },
];

const commonMistakes = [
  {
    title: "Studying CPOA like a vocabulary list",
    body: "CPOA asks what a platform owner should decide. Convert every term into a risk, owner, process, metric, and governance forum.",
  },
  {
    title: "Underweighting Technology",
    body: "Technology is the largest domain. Upgrade, clone, IDR, Hermes, high availability, and instance-management concepts often decide close scenario questions.",
  },
  {
    title: "Treating governance as only meetings",
    body: "Governance includes decision rights, demand intake, technical standards, licensing, integrations, data quality, KPIs, and escalation paths.",
  },
  {
    title: "Ignoring licensing impacts",
    body: "Platform owners must anticipate how catalog, fulfiller, integration, and subscription decisions affect cost and operating model.",
  },
  {
    title: "Skipping data and metrics because the domain is smaller",
    body: "Data is the lowest-weight domain, but weak data quality undermines reporting, automation, compliance, and executive trust across the platform.",
  },
];

const readinessChecklist = [
  "Score 80% or higher on two full-length timed CPOA mock exams.",
  "Explain Technology and Strategy objectives without notes; they make up 44.3% of the exam.",
  "Defend when to use strategic, portfolio/demand, or technical governance for a scenario.",
  "Describe a safe upgrade/clone/change-promotion path across sub-production and production.",
  "Compare reporting, Performance Analytics, value metrics, CSAT, and data-quality signals.",
  "Identify licensing and integration implications before expanding catalog or automation scope.",
  "Review every missed practice question by risk, owner, metric, and decision forum.",
];

const sampleQuestions = [
  {
    topic: "Technology",
    topicSlug: "technology",
    question:
      "A platform owner is planning a major release upgrade. What is the safest first principle?",
    options: [
      "Apply the upgrade directly in production to reduce timeline risk",
      "Validate in sub-production, test integrations, and coordinate a controlled production window",
      "Skip clone planning because clones are unrelated to upgrades",
      "Let each department test only after production users report issues",
    ],
    answer:
      "Validate in sub-production, test integrations, and coordinate a controlled production window",
  },
  {
    topic: "Strategy",
    topicSlug: "strategy",
    question:
      "What is the best platform-owner response to growing citizen-development demand?",
    options: [
      "Block all low-code work indefinitely",
      "Allow any user to build production workflows without review",
      "Enable citizen development with delegated roles, standards, testing, and governance guardrails",
      "Move every request to custom code",
    ],
    answer:
      "Enable citizen development with delegated roles, standards, testing, and governance guardrails",
  },
  {
    topic: "ServiceNow Governance",
    topicSlug: "governance",
    question:
      "A catalog expansion adds new requesters, fulfillers, and Integration Hub spokes. What should the platform owner evaluate early?",
    options: [
      "Only the catalog item description",
      "Licensing, transaction, support, integration, and governance impacts",
      "Only the color of the portal widget",
      "Whether the fulfiller groups prefer email",
    ],
    answer:
      "Licensing, transaction, support, integration, and governance impacts",
  },
];

export default async function CPOAStudyGuidePage() {
  const cert = getCertificationBySlug(CERT_SLUG)!;
  const totalQuestions = getTotalQuestionCount(CERT_SLUG);
  const domains = [...cert.domains].sort(
    (a, b) => (b.percentage ?? 0) - (a.percentage ?? 0),
  );

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Certifications", url: "/certifications" },
    { name: "CPOA", url: "/cpoa" },
    { name: "Study Guide", url: "/cpoa/study-guide" },
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
    name: "How to Pass the CPOA Exam",
    description:
      "A four-week study plan for passing the ServiceNow Certified Platform Owner Associate exam.",
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
    name: "CPOA Certified Platform Owner Associate Exam Preparation",
    description:
      "Complete study guide for the ServiceNow CPOA certification exam, covering platform strategy, people, process, technology, data, and governance.",
    provider: {
      "@type": "Organization",
      name: "SNReady",
      url: "https://snready.com",
    },
    educationalLevel: "Professional",
    about: {
      "@type": "Thing",
      name: "ServiceNow CPOA",
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
              <Link href="/cpoa" className="hover:text-emerald-600">
                CPOA
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
              How to Pass the CPOA Exam
              <span className="mt-2 block text-lg font-normal text-zinc-500 dark:text-zinc-400 sm:text-xl">
                Certified Platform Owner Associate
              </span>
            </h1>

            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300">
              CPOA is the ServiceNow certification for people who own platform
              outcomes: roadmaps, operating model, upgrades, governance, data,
              licensing, adoption, and value metrics. This guide gives you a
              blueprint-weighted plan, practical labs, and decision drills so
              you can study like a platform owner instead of memorizing isolated
              terms.
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
                href="/cpoa/mock-exam"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Take a Timed Mock Exam
              </Link>
              <Link
                href="/cpoa/practice-questions"
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
              About the CPOA Exam
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              The CPOA exam validates platform-owner judgment across six
              domains: Strategy, People, Process, Technology, Data, and
              ServiceNow Governance. Expect scenario questions that ask how to
              reduce risk, align to business outcomes, maintain operational
              stability, and show platform value.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-5 shadow-sm dark:bg-zinc-900">
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
              <div className="rounded-lg bg-white p-5 shadow-sm dark:bg-zinc-900">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Exam format
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {cert.examDetails.questionCount} multiple-choice and
                    multiple-select questions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {cert.examDetails.duration} minutes with a{" "}
                    {cert.examDetails.passingScore}% planning pass score
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Format: {cert.examDetails.format}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              CPOA Domain Breakdown
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Study time should follow blueprint weight. Technology and Strategy
              are the highest-value domains and should be mastered before lower
              weight governance/data topics.
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
                        {(domain.percentage ?? 0) >= 20 && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
                            High weight
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {domain.description}
                      </p>
                      <ul className="mt-3 space-y-1">
                        {(domainFocus[domain.slug] ?? []).map((topic) => (
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
                        href={`/cpoa/practice-questions/${domain.slug}`}
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
              Domain percentages follow the CPOA certification metadata and the{" "}
              <a
                href={cert.blueprintUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                official ServiceNow exam blueprint →
              </a>
            </p>
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              How to Study for CPOA
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Follow this order to study according to exam weight and platform
              owner decision complexity.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {howToSteps.map((step) => (
                <div
                  key={step.position}
                  className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
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
                  A realistic CPOA prep plan
                </h2>
              </div>
              <Link
                href="/cpoa/mock-exam"
                className="inline-flex items-center justify-center rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
              >
                Start with a baseline mock exam →
              </Link>
            </div>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              This calendar mirrors the CIS-DF guide pattern: clear weekly
              focus, official-domain weighting, and concrete exit criteria
              before moving on.
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
              CPOA Hands-on Lab Checklist
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              CPOA is about decision quality. Use these labs to connect exam
              terms to real platform-owner artifacts and tradeoffs.
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
              Scenario Drills: Think Like a Platform Owner
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              If you can explain the decision, risk, owner, and metric, you are
              studying at the right level for CPOA.
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
              Common CPOA Study Mistakes
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
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Sample CPOA Questions
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              These examples show the decision-oriented style to practice before
              taking full mock exams.
            </p>
            <div className="mt-8 space-y-4">
              {sampleQuestions.map((item) => (
                <div
                  key={item.question}
                  className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <Link
                    href={`/cpoa/practice-questions/${item.topicSlug}`}
                    className="text-xs font-semibold uppercase tracking-wide text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                  >
                    {item.topic} practice questions →
                  </Link>
                  <h3 className="mt-2 font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.question}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {item.options.map((option) => (
                      <li
                        key={option}
                        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-300">
                    <span className="font-semibold">Best answer:</span>{" "}
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/cpoa/practice-questions"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Practice all {totalQuestions}+ CPOA questions →
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Final CPOA Readiness Checklist
            </h2>
            <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <ul className="space-y-3">
                {readinessChecklist.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 rounded-2xl bg-emerald-600 p-8 text-center text-white">
              <h2 className="text-2xl font-bold">
                Ready to test your CPOA readiness?
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-emerald-50">
                Take a timed mock exam, review misses by platform-owner decision
                type, then drill weak domains until your score is safely above
                passing.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/cpoa/mock-exam"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-6 text-base font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  Start CPOA Mock Exam
                </Link>
                <Link
                  href="/cpoa/practice-questions"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-emerald-300 px-6 text-base font-semibold text-white hover:bg-emerald-700"
                >
                  Browse Practice Questions
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 py-16 dark:border-zinc-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              CPOA FAQ
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
