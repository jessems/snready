import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ServiceNow Certification Paths & Career Roadmap 2026",
  description: "Navigate your ServiceNow career with our certification roadmap. From CSA to CTA, discover the right path for administrators, developers, and specialists.",
  keywords: [
    "ServiceNow certification path",
    "ServiceNow career roadmap",
    "ServiceNow certification order",
    "which ServiceNow certification first",
    "ServiceNow certification guide",
    "ServiceNow admin certification path",
    "ServiceNow developer certification path",
  ],
  alternates: {
    canonical: "/certification-paths",
  },
  openGraph: {
    title: "ServiceNow Certification Paths & Career Roadmap | SNReady",
    description: "Navigate your ServiceNow career with our certification roadmap",
  },
};

interface CertificationNode {
  name: string;
  fullName: string;
  slug: string;
  description: string;
  examTime: string;
  examQuestions: number;
  passingScore: string;
  cost: string;
}

interface CareerPath {
  name: string;
  emoji: string;
  description: string;
  idealFor: string[];
  certifications: CertificationNode[];
  salary: string;
  timeToComplete: string;
}

const careerPaths: CareerPath[] = [
  {
    name: "Administrator Track",
    emoji: "⚙️",
    description: "The most common entry point into ServiceNow. Administrators configure the platform, manage users, and support day-to-day operations.",
    idealFor: [
      "IT professionals looking to enter ServiceNow",
      "Help desk or support staff wanting to level up",
      "ITSM professionals from other platforms (Jira, Zendesk)",
      "Anyone new to ServiceNow",
    ],
    certifications: [
      {
        name: "CSA",
        fullName: "Certified System Administrator",
        slug: "csa",
        description: "Foundation certification. Covers platform basics, tables, forms, lists, users, security, reporting, and ITSM modules.",
        examTime: "90 minutes",
        examQuestions: 60,
        passingScore: "70%",
        cost: "$210",
      },
    ],
    salary: "$80K - $120K",
    timeToComplete: "2-4 weeks",
  },
  {
    name: "Developer Track",
    emoji: "💻",
    description: "For those who want to build custom applications and write scripts on the ServiceNow platform.",
    idealFor: [
      "Software developers wanting to specialize in ServiceNow",
      "CSA holders looking to move into development",
      "Full-stack developers interested in enterprise platforms",
      "Anyone comfortable with JavaScript",
    ],
    certifications: [
      {
        name: "CSA",
        fullName: "Certified System Administrator",
        slug: "csa",
        description: "Required prerequisite. Ensures you understand the platform before scripting.",
        examTime: "90 minutes",
        examQuestions: 60,
        passingScore: "70%",
        cost: "$210",
      },
      {
        name: "CAD",
        fullName: "Certified Application Developer",
        slug: "cad",
        description: "Tests JavaScript skills, GlideRecord, Business Rules, Client Scripts, REST APIs, and scoped applications.",
        examTime: "90 minutes",
        examQuestions: 60,
        passingScore: "70%",
        cost: "$210",
      },
    ],
    salary: "$100K - $160K",
    timeToComplete: "4-8 weeks",
  },
  {
    name: "ITSM Specialist Track",
    emoji: "🎫",
    description: "Deepen your expertise in IT Service Management — Incident, Problem, Change, and Request Management.",
    idealFor: [
      "ITSM administrators who configure these modules daily",
      "Consultants implementing ITSM for clients",
      "IT managers overseeing service desk operations",
      "CSA holders specializing in ITSM",
    ],
    certifications: [
      {
        name: "CSA",
        fullName: "Certified System Administrator",
        slug: "csa",
        description: "Required prerequisite.",
        examTime: "90 minutes",
        examQuestions: 60,
        passingScore: "70%",
        cost: "$210",
      },
      {
        name: "CIS-ITSM",
        fullName: "Certified Implementation Specialist - ITSM",
        slug: "cis-itsm",
        description: "Implementation-level knowledge of Incident, Problem, Change, Request, and SLA configuration.",
        examTime: "90 minutes",
        examQuestions: 60,
        passingScore: "70%",
        cost: "$315",
      },
    ],
    salary: "$90K - $140K",
    timeToComplete: "4-8 weeks",
  },
  {
    name: "CMDB & Data Specialist Track",
    emoji: "🗄️",
    description: "Specialize in the Configuration Management Database — the foundation of ServiceNow's power.",
    idealFor: [
      "Data architects and managers",
      "CMDB administrators",
      "Discovery and Service Mapping specialists",
      "Anyone implementing CSDM",
    ],
    certifications: [
      {
        name: "CSA",
        fullName: "Certified System Administrator",
        slug: "csa",
        description: "Required prerequisite.",
        examTime: "90 minutes",
        examQuestions: 60,
        passingScore: "70%",
        cost: "$210",
      },
      {
        name: "CIS-DF",
        fullName: "Certified Implementation Specialist - Data Foundations",
        slug: "cis-df",
        description: "CMDB structure, CSDM, Discovery, Health monitoring, and data governance.",
        examTime: "90 minutes",
        examQuestions: 60,
        passingScore: "70%",
        cost: "$315",
      },
      {
        name: "CIS-Discovery",
        fullName: "Certified Implementation Specialist - Discovery",
        slug: "cis-discovery",
        description: "Deep dive into Discovery, patterns, probes, sensors, and CMDB population.",
        examTime: "90 minutes",
        examQuestions: 60,
        passingScore: "70%",
        cost: "$315",
      },
    ],
    salary: "$100K - $150K",
    timeToComplete: "8-12 weeks",
  },
  {
    name: "Customer Service Track",
    emoji: "🎧",
    description: "Specialize in ServiceNow's Customer Service Management (CSM) for customer-facing operations.",
    idealFor: [
      "Customer service managers",
      "CSM implementation consultants",
      "B2B support specialists",
      "Contact center administrators",
    ],
    certifications: [
      {
        name: "CSA",
        fullName: "Certified System Administrator",
        slug: "csa",
        description: "Required prerequisite.",
        examTime: "90 minutes",
        examQuestions: 60,
        passingScore: "70%",
        cost: "$210",
      },
      {
        name: "CIS-CSM",
        fullName: "Certified Implementation Specialist - CSM",
        slug: "cis-csm",
        description: "Customer Service Management configuration, cases, accounts, contacts, portals, and CSM workspaces.",
        examTime: "90 minutes",
        examQuestions: 60,
        passingScore: "70%",
        cost: "$315",
      },
    ],
    salary: "$95K - $145K",
    timeToComplete: "4-8 weeks",
  },
  {
    name: "HR Service Delivery Track",
    emoji: "👥",
    description: "Specialize in HR Service Delivery for employee experiences and HR case management.",
    idealFor: [
      "HR technology managers",
      "HRSD implementation consultants",
      "Employee experience specialists",
      "HR system administrators",
    ],
    certifications: [
      {
        name: "CSA",
        fullName: "Certified System Administrator",
        slug: "csa",
        description: "Required prerequisite.",
        examTime: "90 minutes",
        examQuestions: 60,
        passingScore: "70%",
        cost: "$210",
      },
      {
        name: "CIS-HR",
        fullName: "Certified Implementation Specialist - HR",
        slug: "cis-hr",
        description: "HR Service Delivery configuration, HR cases, employee journeys, and HR portal.",
        examTime: "90 minutes",
        examQuestions: 60,
        passingScore: "70%",
        cost: "$315",
      },
    ],
    salary: "$95K - $145K",
    timeToComplete: "4-8 weeks",
  },
  {
    name: "Security Operations Track",
    emoji: "🔐",
    description: "Focus on ServiceNow's Security Operations suite — vulnerability response and security incident response.",
    idealFor: [
      "Security operations center (SOC) analysts",
      "Security engineers",
      "Vulnerability management specialists",
      "Security consultants",
    ],
    certifications: [
      {
        name: "CSA",
        fullName: "Certified System Administrator",
        slug: "csa",
        description: "Required prerequisite.",
        examTime: "90 minutes",
        examQuestions: 60,
        passingScore: "70%",
        cost: "$210",
      },
      {
        name: "CIS-VR",
        fullName: "Certified Implementation Specialist - Vulnerability Response",
        slug: "cis-vr",
        description: "Vulnerability management, scanner integrations, remediation workflows, and risk scoring.",
        examTime: "90 minutes",
        examQuestions: 60,
        passingScore: "70%",
        cost: "$315",
      },
      {
        name: "CIS-SIR",
        fullName: "Certified Implementation Specialist - Security Incident Response",
        slug: "cis-sir",
        description: "Security incident management, playbooks, threat intelligence, and SIEM integrations.",
        examTime: "90 minutes",
        examQuestions: 60,
        passingScore: "70%",
        cost: "$315",
      },
    ],
    salary: "$110K - $170K",
    timeToComplete: "8-12 weeks",
  },
  {
    name: "Technical Architect Track",
    emoji: "🏗️",
    description: "The pinnacle of ServiceNow certification. Technical Architects design complex solutions across the platform.",
    idealFor: [
      "Senior developers with 3+ years experience",
      "Solution architects wanting ServiceNow recognition",
      "Technical leads overseeing large implementations",
      "Those pursuing CTA certification",
    ],
    certifications: [
      {
        name: "CSA",
        fullName: "Certified System Administrator",
        slug: "csa",
        description: "Required prerequisite.",
        examTime: "90 minutes",
        examQuestions: 60,
        passingScore: "70%",
        cost: "$210",
      },
      {
        name: "CAD",
        fullName: "Certified Application Developer",
        slug: "cad",
        description: "Required prerequisite.",
        examTime: "90 minutes",
        examQuestions: 60,
        passingScore: "70%",
        cost: "$210",
      },
      {
        name: "CTA",
        fullName: "Certified Technical Architect",
        slug: "cta",
        description: "Multi-day exam including design challenge, live presentation, and Q&A. The most prestigious ServiceNow certification.",
        examTime: "Multi-day",
        examQuestions: 0,
        passingScore: "Panel evaluation",
        cost: "$2,500+",
      },
    ],
    salary: "$150K - $250K+",
    timeToComplete: "1-3 years",
  },
];

const faqs = [
  {
    question: "What ServiceNow certification should I get first?",
    answer: "CSA (Certified System Administrator) is the recommended first certification for everyone. It's the foundation that all other certifications build on, and it's required for most CIS certifications.",
  },
  {
    question: "How long does it take to get ServiceNow certified?",
    answer: "CSA typically takes 2-4 weeks of study for someone new to ServiceNow. CAD adds another 4-6 weeks. CIS certifications usually take 4-8 weeks each after CSA.",
  },
  {
    question: "Can I take CIS certifications without CSA?",
    answer: "Technically yes, but it's not recommended. CSA teaches foundational concepts that CIS exams assume you know. Without CSA knowledge, you'll struggle with CIS questions.",
  },
  {
    question: "Is CAD required before CIS certifications?",
    answer: "No. CAD is for developers. CIS certifications are for implementation specialists. You can go directly from CSA to CIS certifications if you're focused on implementation rather than development.",
  },
  {
    question: "What's the best certification path for career growth?",
    answer: "For most people: CSA → (optional CAD if technical) → 1-2 CIS specializations relevant to your role. This gives you breadth (CSA), optional depth in development (CAD), and specialization (CIS).",
  },
  {
    question: "Are ServiceNow certifications worth the cost?",
    answer: "Yes, for career growth. CSA alone can increase salary by $20K-30K. The ROI on the $210 exam fee is typically recovered within 1-2 months of a new role.",
  },
];

export default function CertificationPathsPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
            ServiceNow Certification Paths
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Navigate your ServiceNow career with the right certifications. Find your path from entry-level to architect.
          </p>
        </div>

        {/* Quick Start */}
        <div className="mb-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-950">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-emerald-900 dark:text-emerald-100">
            <span>🚀</span> Quick Start: Where Should You Begin?
          </h2>
          <p className="mt-2 text-emerald-800 dark:text-emerald-200">
            <strong>New to ServiceNow?</strong> Start with CSA (Certified System Administrator). 
            It's the foundation certification that 95% of ServiceNow professionals have, and it's 
            required or recommended for almost every other certification.
          </p>
          <div className="mt-4">
            <Link
              href="/csa"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Start CSA Prep →
            </Link>
          </div>
        </div>

        {/* Career Paths */}
        <div className="space-y-8">
          {careerPaths.map((path) => (
            <div
              key={path.name}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    <span>{path.emoji}</span> {path.name}
                  </h2>
                  <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                    {path.description}
                  </p>
                </div>
                <div className="flex flex-shrink-0 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {path.salary}
                    </div>
                    <div className="text-zinc-500">Salary Range</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {path.timeToComplete}
                    </div>
                    <div className="text-zinc-500">Study Time</div>
                  </div>
                </div>
              </div>

              {/* Ideal For */}
              <div className="mt-4">
                <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Ideal for:
                </div>
                <ul className="mt-1 flex flex-wrap gap-2">
                  {path.idealFor.map((item) => (
                    <li
                      key={item}
                      className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Certification Flow */}
              <div className="mt-6">
                <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  Certification Progression:
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {path.certifications.map((cert, index) => (
                    <div key={cert.name} className="flex items-center gap-2">
                      <Link
                        href={`/${cert.slug}`}
                        className="group flex flex-col rounded-lg border border-zinc-200 bg-zinc-50 p-3 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-emerald-700 dark:hover:bg-emerald-950"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-900 group-hover:text-emerald-700 dark:text-zinc-100 dark:group-hover:text-emerald-400">
                            {cert.name}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {cert.cost}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {cert.fullName}
                        </span>
                      </Link>
                      {index < path.certifications.length - 1 && (
                        <span className="text-2xl text-zinc-400">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {faq.question}
                </h3>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Ready to Start?
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Begin your ServiceNow certification journey with free practice questions.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/csa/practice-questions"
              className="rounded-lg bg-emerald-600 px-6 py-3 text-white hover:bg-emerald-700"
            >
              CSA Practice Questions
            </Link>
            <Link
              href="/certifications"
              className="rounded-lg border border-zinc-300 bg-white px-6 py-3 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Browse All Certifications
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
