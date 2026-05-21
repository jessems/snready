import { Metadata } from "next";
import Link from "next/link";
import { getCertificationBySlug, getTotalQuestionCount } from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title:
    "How to Pass CIS-TPRM — Complete ServiceNow Third-Party Risk Study Guide [2026]",
  description:
    "Complete ServiceNow CIS-TPRM study guide with official domain weights, a 4-week study calendar, hands-on TPRM lab checklist, scenario drills, common mistakes, readiness checklist, and CIS-TPRM practice questions.",
  keywords: [
    "CIS-TPRM study guide",
    "ServiceNow CIS-TPRM exam prep",
    "Third-Party Risk Management certification",
    "CIS-TPRM practice questions",
    "ServiceNow TPRM implementation specialist",
    "CIS-TPRM domain breakdown",
    "CIS-TPRM passing score",
    "ServiceNow risk management mock exam",
    "TPRM assessment configuration",
    "ServiceNow vendor risk certification",
  ],
  alternates: {
    canonical: "/cis-tprm/study-guide",
  },
  openGraph: {
    title: "How to Pass CIS-TPRM | Complete Study Guide | SNReady",
    description:
      "Domain-by-domain CIS-TPRM study plan with a 4-week calendar, hands-on labs, scenario drills, and practice-question links.",
    type: "article",
  },
};

const CERT_SLUG = "cis-tprm";

const domainFocus: Record<string, string[]> = {
  "assessment-configuration": [
    "External assessments, internal assessments, questionnaire templates, and document request templates",
    "Question banks, Smart Assessment Engine, template migration, scoring rules, and control objectives",
    "Event-driven assessment management and how response scoring changes third-party risk decisions",
  ],
  fundamentals: [
    "TPRM purpose, personas, due diligence workflow, risk profiles, and engagement types",
    "Third-party records, risk managers, assessors, admins, contract negotiators, and ownership boundaries",
    "Due diligence categories such as information security, financial, legal, operational, compliance, and reputation risk",
  ],
  "core-configuration": [
    "Application activation, TPRM properties, role assignment, user groups, and authentication policies",
    "Email communication setup, data import from other systems, and baseline configuration sequencing",
    "Configuration choices that determine who can launch, answer, review, and approve assessments",
  ],
  "third-party-portal": [
    "Portal access, third-party contacts, task delegation, questionnaire responses, and evidence collection",
    "Excel and SIG response handling, progress tracking, and keeping external contacts limited to portal tasks",
    "Communication patterns that keep suppliers moving without granting unnecessary platform access",
  ],
  "supporting-processes": [
    "Third-party elements, element collection, entity generation, engagement assignment, and monitoring",
    "Vendor Management Workspace touchpoints, issue follow-up, due diligence status, and remediation tracking",
    "How supporting records keep risk work connected after the initial assessment is completed",
  ],
  "application-relationships": [
    "Integration with GRC Policy and Compliance Management, risk intelligence providers, and ESG workflows",
    "Provider-based submission rules, SIG/EcoVadis/BitSight/SecurityScorecard style data flows, and external signals",
    "When TPRM should share risk context with broader IRM, vendor, contract, or compliance processes",
  ],
};

const faqData = [
  {
    question: "What is the ServiceNow CIS-TPRM exam?",
    answer:
      "The ServiceNow Certified Implementation Specialist - Third-Party Risk Management exam validates that you can implement TPRM fundamentals, core configuration, assessment configuration, the third-party portal, supporting processes, and related application integrations.",
  },
  {
    question: "How many questions are on the CIS-TPRM exam?",
    answer:
      "SNReady lists the CIS-TPRM exam as 60 multiple-choice and multiple-select questions with 90 minutes to complete and a planning passing score of 70%.",
  },
  {
    question: "Which CIS-TPRM domain should I study first?",
    answer:
      "Start with Assessment Configuration because it is the largest domain at 33%, then study TPRM Fundamentals at 23%. Together they represent 56% of the exam and explain how third parties, engagements, assessments, evidence, scoring, and due diligence decisions fit together.",
  },
  {
    question:
      "Is CIS-TPRM more about risk process or ServiceNow configuration?",
    answer:
      "It is both. The exam expects risk-program vocabulary, but questions usually test implementation judgment: which record, template, portal task, scoring rule, contact, role, workflow, or integration should support a real due diligence scenario.",
  },
  {
    question: "How long should I study for CIS-TPRM?",
    answer:
      "Most candidates with CSA-level platform knowledge and some IRM or vendor-risk exposure should plan four focused weeks. If you have not configured assessments, questionnaires, portal contacts, or third-party engagements hands-on, add extra lab time before scheduling.",
  },
  {
    question: "What hands-on practice helps most for CIS-TPRM?",
    answer:
      "Use a ServiceNow training instance or PDI to trace one third party from risk profile and engagement creation through due diligence, questionnaire assignment, portal response, evidence review, scoring, findings, remediation, and reporting.",
  },
  {
    question: "When am I ready to schedule CIS-TPRM?",
    answer:
      "Schedule after you can score 80% or higher on two timed mixed-domain mock exams, explain every missed question as a TPRM implementation decision, and complete the core assessment/portal/remediation workflow without step-by-step notes.",
  },
  {
    question: "What is the biggest CIS-TPRM mistake?",
    answer:
      "The biggest mistake is memorizing risk terms without understanding the workflow. CIS-TPRM questions often ask how a due diligence requirement becomes a configured questionnaire, assigned portal task, scored response, risk decision, and follow-up process.",
  },
];

const howToSteps = [
  {
    name: "Take a baseline CIS-TPRM practice test",
    text: "Start with a mixed-domain diagnostic and tag misses by workflow step: third-party setup, engagement, assessment template, portal response, scoring, remediation, or integration.",
    position: 1,
  },
  {
    name: "Master assessments before smaller domains",
    text: "Assessment Configuration is 33% of the exam. Learn questionnaire templates, document requests, question banks, scoring rules, SAE, events, and control objectives before trying to memorize edge integrations.",
    position: 2,
  },
  {
    name: "Connect fundamentals to implementation records",
    text: "Study personas, due diligence types, risk profiles, engagement types, and the third-party lifecycle until you can explain why each record exists and who owns it.",
    position: 3,
  },
  {
    name: "Build the core configuration and portal flow",
    text: "Review TPRM properties, roles, user groups, authentication, email setup, third-party contacts, portal task delegation, Excel/SIG responses, and progress tracking.",
    position: 4,
  },
  {
    name: "Practice supporting processes and application relationships",
    text: "Study element collection, entity generation, engagement assignment, monitoring, GRC Policy and Compliance integration, risk intelligence providers, and ESG-related connections.",
    position: 5,
  },
  {
    name: "Finish with timed mocks and a workflow miss log",
    text: "Retake mixed mock exams until you score 80% or higher twice and can rewrite every miss as a rule about workflow, ownership, scoring, evidence, access, or integration.",
    position: 6,
  },
];

const fourWeekPlan = [
  {
    week: "Week 1",
    title: "TPRM workflow foundation and baseline",
    focus: "Fundamentals + diagnostic",
    goal: "Understand the end-to-end third-party risk lifecycle before drilling configuration details.",
    tasks: [
      "Read the CIS-TPRM blueprint and sort all six domains by exam weight.",
      "Map the due diligence workflow from third-party intake through engagement, assessment, response, review, scoring, and follow-up.",
      "Take 30-60 mixed practice questions and build a miss log grouped by workflow step and domain.",
    ],
    success:
      "You can explain third party, risk profile, engagement, due diligence, assessment, questionnaire, evidence, and remediation in one coherent workflow.",
  },
  {
    week: "Week 2",
    title: "Assessment configuration deep dive",
    focus: "Assessment Configuration (33%)",
    goal: "Win the highest-weight domain by understanding how assessment artifacts are built and scored.",
    tasks: [
      "Compare external assessments, internal assessments, IRQ, questionnaire templates, document request templates, and question banks.",
      "Study scoring rules, control objectives, Smart Assessment Engine, template migration, and event-driven assessment behavior.",
      "Drill assessment-only questions until you can defend why each configuration choice fits the scenario.",
    ],
    success:
      "Assessment Configuration practice scores are 80%+ and misses are limited to edge cases, not core workflow confusion.",
  },
  {
    week: "Week 3",
    title: "Core setup and third-party portal execution",
    focus: "Core Configuration + Third-party Portal",
    goal: "Make internal roles and external contact experiences predictable.",
    tasks: [
      "Review TPRM activation, properties, role assignment, user groups, authentication policies, email communication, and data imports.",
      "Trace third-party contacts through portal access, task delegation, questionnaire completion, evidence upload, Excel/SIG response handling, and progress tracking.",
      "Use practice questions to compare internal fulfiller configuration with external portal behavior.",
    ],
    success:
      "You can choose the right role, contact, portal task, communication, and access pattern for common supplier-risk scenarios.",
  },
  {
    week: "Week 4",
    title: "Supporting processes, integrations, and exam simulation",
    focus: "Supporting Processes + Application Relationships + timed mocks",
    goal: "Close lower-weight gaps and convert workflow knowledge into exam-speed decisions.",
    tasks: [
      "Study third-party elements, element collection, entity generation, engagement assignment, monitoring, and Vendor Management Workspace touchpoints.",
      "Review GRC Policy and Compliance relationships, risk intelligence provider integrations, provider-based submission rules, and ESG connections.",
      "Take at least two 60-question timed CIS-TPRM mock exams and remediate every weak domain.",
    ],
    success:
      "You can finish a full CIS-TPRM mock exam under 90 minutes with 80%+ and no domain below 70%.",
  },
];

const pdiLabChecklist = [
  {
    lab: "Third-party lifecycle map",
    domain: "Fundamentals",
    outcome:
      "Create a one-page map from third-party record to risk profile, engagement, due diligence workflow, assessment, evidence, score, and remediation.",
  },
  {
    lab: "Questionnaire and template build",
    domain: "Assessment Configuration",
    outcome:
      "Inspect or build a questionnaire template, question bank entries, document requests, scoring rules, and control-objective mapping.",
  },
  {
    lab: "External assessment and portal handoff",
    domain: "Third-party Portal",
    outcome:
      "Trace how a third-party contact receives a portal task, answers a questionnaire, uploads evidence, delegates work, and tracks completion.",
  },
  {
    lab: "Core properties and role review",
    domain: "Core Configuration",
    outcome:
      "Review TPRM properties, user groups, roles, authentication policies, email communication settings, and imported third-party data paths.",
  },
  {
    lab: "Scoring-to-remediation trace",
    domain: "Assessment Configuration / Supporting Processes",
    outcome:
      "Follow a risky response from scoring through finding or issue handling, remediation assignment, due diligence status, and risk monitoring.",
  },
  {
    lab: "Application relationship review",
    domain: "Other Application Relationships",
    outcome:
      "Identify where TPRM connects to Policy and Compliance, risk intelligence providers, ESG, Vendor Management, contracts, or broader IRM reporting.",
  },
];

const decisionDrills = [
  {
    prompt:
      "A high-risk supplier needs evidence reviewed before approval, but the questionnaire alone is not enough.",
    test: "Do you rely only on question scoring, or add evidence/document request controls?",
    answer:
      "Use assessment configuration that captures required evidence or document requests and routes review to the right internal owners. High-risk due diligence should produce defensible evidence, not just a numeric score.",
  },
  {
    prompt:
      "A supplier contact should complete only assigned due diligence tasks and should not access internal risk records.",
    test: "Do you create an internal fulfiller user or use the third-party portal model?",
    answer:
      "Use third-party portal access and contact/task delegation patterns so external users can complete assigned questionnaires and upload evidence without broad platform visibility.",
  },
  {
    prompt:
      "A new risk intelligence provider should influence third-party decisions automatically.",
    test: "Is this just an assessment template change?",
    answer:
      "No. Review application relationships, provider integration, provider-based submission rules, data mapping, and how external signals affect risk profiles, engagement decisions, or reassessment triggers.",
  },
  {
    prompt:
      "Several engagements are delayed because suppliers are not completing questionnaires on time.",
    test: "Do you change scoring rules, communication, or portal/task process first?",
    answer:
      "Start with process visibility: portal progress, task assignment, contacts, reminders/email communication, delegation, and due-date ownership. Scoring rules matter after responses arrive.",
  },
  {
    prompt:
      "An assessment identifies a critical control gap that must be tracked after approval.",
    test: "Does the work end when the questionnaire is submitted?",
    answer:
      "No. Use supporting processes to track findings, issues, remediation, monitoring, and ownership so due diligence produces ongoing risk treatment instead of a one-time form.",
  },
];

const commonMistakes = [
  {
    title: "Studying risk vocabulary without the workflow",
    body: "CIS-TPRM questions reward knowing how a third-party risk requirement becomes records, tasks, templates, scoring, evidence, and remediation in ServiceNow.",
    icon: "🧭",
  },
  {
    title: "Underweighting Assessment Configuration",
    body: "Assessment Configuration is 33% of the exam. Questionnaire templates, document requests, scoring rules, SAE, and control objectives deserve the most practice time.",
    icon: "📝",
  },
  {
    title: "Confusing internal users with third-party contacts",
    body: "External contacts should complete assigned portal work without internal platform access. Role, portal, and contact decisions are common scenario traps.",
    icon: "🔐",
  },
  {
    title: "Ignoring evidence and remediation",
    body: "A mature TPRM workflow does not stop at questionnaire submission. Evidence review, findings, issues, remediation, and monitoring often decide the best answer.",
    icon: "✅",
  },
  {
    title: "Treating integrations as trivia",
    body: "Application relationships are only 6%, but provider integrations, Policy and Compliance, ESG, and submission rules can appear as decisive details in mixed scenarios.",
    icon: "🔗",
  },
  {
    title: "Not practicing with timed mixed questions",
    body: "The exam mixes risk-process and configuration clues. Timed practice teaches you to identify the workflow step before choosing the artifact.",
    icon: "⏱️",
  },
];

const sampleQuestions = [
  {
    topic: "Assessment Configuration",
    topicSlug: "assessment-configuration",
    weight: 33,
    question:
      "A risk team needs reusable questions and evidence requirements for different supplier due diligence types. Which area should they configure first?",
    options: [
      "Questionnaire templates, question banks, scoring rules, and document request templates",
      "Only the third-party portal theme",
      "Only Vendor Management Workspace favorites",
      "A custom incident category for suppliers",
    ],
    correctAnswer:
      "Questionnaire templates, question banks, scoring rules, and document request templates",
    explanation:
      "Assessment Configuration is where reusable questionnaires, question banks, document requests, scoring rules, and due diligence templates are built. Portal branding or workspace favorites do not define assessment logic.",
  },
  {
    topic: "TPRM Fundamentals",
    topicSlug: "fundamentals",
    weight: 23,
    question:
      "Why should you understand engagement types before configuring assessment automation?",
    options: [
      "Engagement type helps determine the due diligence workflow, participants, and assessment needs",
      "Engagement type replaces third-party records",
      "Engagement type controls all user passwords",
      "Engagement type is used only for cosmetic reporting labels",
    ],
    correctAnswer:
      "Engagement type helps determine the due diligence workflow, participants, and assessment needs",
    explanation:
      "Engagements represent the work or relationship being evaluated. Their type and risk context influence which due diligence, assessments, contacts, and approvals are appropriate.",
  },
  {
    topic: "Core Configuration",
    topicSlug: "core-configuration",
    weight: 14,
    question:
      "A team is preparing initial CIS-TPRM implementation. Which task belongs in Core Configuration?",
    options: [
      "Configuring TPRM properties, roles, user groups, authentication policies, and email communication",
      "Closing all vendor findings without review",
      "Deleting question banks after assessments are sent",
      "Building unrelated incident SLAs",
    ],
    correctAnswer:
      "Configuring TPRM properties, roles, user groups, authentication policies, and email communication",
    explanation:
      "Core Configuration establishes the application baseline: activation, properties, access, groups, authentication, communications, and imported data needed before mature TPRM workflows run.",
  },
  {
    topic: "Third-party Portal",
    topicSlug: "third-party-portal",
    weight: 12,
    question: "What is the primary value of the third-party portal in TPRM?",
    options: [
      "It lets external contacts complete assigned questionnaires and upload evidence without broad internal platform access",
      "It gives every supplier administrator access to internal risk records",
      "It replaces assessment scoring rules",
      "It is used only for ServiceNow employee onboarding",
    ],
    correctAnswer:
      "It lets external contacts complete assigned questionnaires and upload evidence without broad internal platform access",
    explanation:
      "The portal provides controlled external participation: third-party contacts can respond to tasks, upload evidence, delegate work, and track progress without becoming internal fulfillers.",
  },
];

const readinessChecklist = [
  "Score 80% or higher on two full-length timed CIS-TPRM mock exams.",
  "No CIS-TPRM domain is below 70% on the most recent mixed practice exam.",
  "Trace a third party from profile and engagement through assessment, portal response, evidence review, scoring, and remediation.",
  "Explain questionnaire templates, question banks, document request templates, scoring rules, SAE, and control objectives without notes.",
  "Choose the correct access model for internal risk teams versus external third-party contacts.",
  "Review every missed question by workflow step and rewrite the implementation rule in your own words.",
];

export default function CISTPRMStudyGuidePage() {
  const cert = getCertificationBySlug(CERT_SLUG)!;
  const totalQuestions = getTotalQuestionCount(CERT_SLUG);
  const domains = [...cert.domains].sort((a, b) => b.percentage - a.percentage);
  const topDomains = domains.filter((domain) => domain.percentage >= 20);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Certifications", url: "/certifications" },
    { name: "CIS-TPRM", url: "/cis-tprm" },
    { name: "Study Guide", url: "/cis-tprm/study-guide" },
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
    name: "How to Pass the ServiceNow CIS-TPRM Exam",
    description:
      "A four-week study plan for passing the ServiceNow Certified Implementation Specialist - Third-Party Risk Management exam with hands-on labs and timed mock exams.",
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
    name: "ServiceNow CIS-TPRM Exam Preparation",
    description:
      "Complete study guide for the ServiceNow Third-Party Risk Management implementation specialist exam, covering all official CIS-TPRM domains with labs, scenario drills, and practice questions.",
    provider: {
      "@type": "Organization",
      name: "SNReady",
      url: "https://snready.com",
    },
    educationalLevel: "Professional",
    about: {
      "@type": "Thing",
      name: "ServiceNow CIS-TPRM",
      description:
        "Certified Implementation Specialist - Third-Party Risk Management covering TPRM fundamentals, core configuration, assessments, portals, supporting processes, and application relationships.",
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
              <Link href="/cis-tprm" className="hover:text-emerald-600">
                CIS-TPRM
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
              How to Pass the ServiceNow CIS-TPRM Exam
              <span className="mt-2 block text-lg font-normal text-zinc-500 dark:text-zinc-400 sm:text-xl">
                Certified Implementation Specialist — Third-Party Risk
                Management
              </span>
            </h1>

            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300">
              CIS-TPRM validates that you can implement third-party risk on the
              Now Platform: due diligence workflows, assessments, scoring,
              third-party portal collaboration, remediation, and application
              integrations. This CIS-DF-style guide turns the blueprint into a
              practical 4-week plan with hands-on labs, scenario drills, and
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
                href="/cis-tprm/mock-exam"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Take a Timed CIS-TPRM Mock Exam
              </Link>
              <Link
                href="/cis-tprm/practice-questions"
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
              About the CIS-TPRM Exam
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              The CIS-TPRM exam is an implementation-specialist certification
              for ServiceNow Third-Party Risk Management. Expect questions that
              combine vendor-risk process knowledge with ServiceNow decisions
              about records, assessment configuration, portal access, scoring,
              remediation, and integrations.
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
              CIS-TPRM Domain Breakdown
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Study time should follow the official blueprint. Assessment
              Configuration (33%) and Third-party Risk Management Fundamentals
              (23%) represent 56% of the exam, so they should drive your first
              two weeks.
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
                        href={`/cis-tprm/practice-questions/${domain.slug}`}
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
                  official CIS-TPRM exam blueprint on NowLearning →
                </a>
              </p>
            )}
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              How to Study for CIS-TPRM
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Follow this sequence so third-party data, due diligence,
              assessment configuration, portal collaboration, and remediation
              build on each other.
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
                  A realistic CIS-TPRM prep plan
                </h2>
              </div>
              <Link
                href="/cis-tprm/mock-exam"
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
              CIS-TPRM Hands-On Lab Checklist
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Do these labs in a ServiceNow training instance or Personal
              Developer Instance. CIS-TPRM rewards candidates who can connect
              risk workflow choices to actual records, portal tasks, and
              assessment behavior.
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
              Scenario Drills: Think Like a TPRM Implementer
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              CIS-TPRM questions often test the best implementation choice. Use
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
              Common CIS-TPRM Mistakes to Avoid
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
                  Free CIS-TPRM Practice Questions
                </h2>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  Sample questions from high-yield CIS-TPRM domains. Use the
                  full question bank for timed readiness checks.
                </p>
              </div>
              <Link
                href="/cis-tprm/practice-questions"
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
                href="/cis-tprm/mock-exam"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-8 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Take the Full CIS-TPRM Mock Exam
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
                Final CIS-TPRM Readiness Checklist
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
                  href="/cis-tprm/mock-exam"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Start a CIS-TPRM Mock Exam
                </Link>
                <Link
                  href="/cis-tprm/practice-questions"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-emerald-300 bg-white px-6 text-base font-medium text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-700 dark:bg-zinc-900 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                >
                  Drill CIS-TPRM Practice Questions
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
