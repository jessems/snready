import { Metadata } from "next";
import Link from "next/link";
import { getCertificationBySlug } from "@/lib/data";
import { comparisonPairs, ComparisonPair } from "@/lib/comparisons";
import { breadcrumbs, generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title: "ServiceNow Certification Comparisons - Which Cert Is Right for You?",
  description:
    "Compare ServiceNow certifications side by side. CSA vs CAD, CIS-ITSM vs CIS-CSM, and 20+ other comparisons to help you choose the right certification path.",
  keywords: [
    "ServiceNow certification comparison",
    "compare ServiceNow certifications",
    "CSA vs CAD",
    "CIS-ITSM vs CIS-CSM",
    "which ServiceNow certification",
    "ServiceNow cert comparison",
    "best ServiceNow certification",
  ],
  alternates: {
    canonical: "/compare",
  },
  openGraph: {
    title: "ServiceNow Certification Comparisons | SNReady",
    description:
      "Compare 25+ ServiceNow certification pairs. Find the right cert for your career.",
  },
};

interface ComparisonGroup {
  name: string;
  emoji: string;
  description: string;
  pairs: ComparisonPair[];
}

// Group comparisons by category for easier navigation
function getComparisonGroups(): ComparisonGroup[] {
  const careerProgressionPairs = comparisonPairs.filter((p) =>
    p.reason.toLowerCase().includes("career progression")
  );

  const foundationPairs = comparisonPairs.filter(
    (p) =>
      p.reason.toLowerCase().includes("foundation") ||
      p.reason.toLowerCase().includes("entry point") ||
      p.reason.toLowerCase().includes("platform owner")
  );

  const itomPairs = comparisonPairs.filter((p) =>
    p.reason.toLowerCase().includes("itom")
  );

  const secopsPairs = comparisonPairs.filter((p) =>
    p.reason.toLowerCase().includes("secops")
  );

  const grcPairs = comparisonPairs.filter((p) =>
    p.reason.toLowerCase().includes("grc")
  );

  const itamPairs = comparisonPairs.filter((p) =>
    p.reason.toLowerCase().includes("itam")
  );

  const spmPairs = comparisonPairs.filter((p) =>
    p.reason.toLowerCase().includes("spm")
  );

  const servicePairs = comparisonPairs.filter(
    (p) =>
      p.reason.toLowerCase().includes("customer service") ||
      p.reason.toLowerCase().includes("field service") ||
      p.reason.toLowerCase().includes("service vs")
  );

  const specialistPairs = comparisonPairs.filter(
    (p) =>
      p.reason.toLowerCase().includes("specialist") ||
      p.reason.toLowerCase().includes("developer vs") ||
      p.reason.toLowerCase().includes("admin vs")
  );

  // Remove duplicates and assign to groups
  const usedSlugs = new Set<string>();
  const assignToGroup = (pairs: ComparisonPair[]) =>
    pairs.filter((p) => {
      const slug = `${p.cert1}-vs-${p.cert2}`;
      if (usedSlugs.has(slug)) return false;
      usedSlugs.add(slug);
      return true;
    });

  return [
    {
      name: "Career Progression",
      emoji: "🚀",
      description:
        "Certifications that build on each other — natural next steps in your ServiceNow journey.",
      pairs: assignToGroup(careerProgressionPairs),
    },
    {
      name: "Foundation Decisions",
      emoji: "🎯",
      description:
        "Starting point comparisons — which certification should you get first?",
      pairs: assignToGroup([...foundationPairs, ...specialistPairs]),
    },
    {
      name: "ITOM Suite",
      emoji: "🔍",
      description:
        "IT Operations Management certifications — Discovery, Service Mapping, Event Management.",
      pairs: assignToGroup(itomPairs),
    },
    {
      name: "Security Operations",
      emoji: "🔒",
      description:
        "SecOps certifications — Vulnerability Response vs Security Incident Response.",
      pairs: assignToGroup(secopsPairs),
    },
    {
      name: "GRC & Risk",
      emoji: "⚖️",
      description:
        "Governance, Risk, and Compliance certifications — Risk, Vendor Risk, Third-Party Risk.",
      pairs: assignToGroup(grcPairs),
    },
    {
      name: "IT Asset Management",
      emoji: "💾",
      description:
        "ITAM certifications — Software vs Hardware Asset Management.",
      pairs: assignToGroup(itamPairs),
    },
    {
      name: "Strategic Portfolio",
      emoji: "📊",
      description:
        "SPM suite certifications — Strategic Planning, Project Portfolio, Application Portfolio.",
      pairs: assignToGroup(spmPairs),
    },
    {
      name: "Service Delivery",
      emoji: "🤝",
      description:
        "Customer-facing certifications — Customer Service, Field Service, HR Service Delivery.",
      pairs: assignToGroup(servicePairs),
    },
  ].filter((g) => g.pairs.length > 0);
}

function ComparisonCard({ pair }: { pair: ComparisonPair }) {
  const cert1 = getCertificationBySlug(pair.cert1);
  const cert2 = getCertificationBySlug(pair.cert2);

  if (!cert1 || !cert2) return null;

  const slug = `${pair.cert1}-vs-${pair.cert2}`;

  return (
    <Link
      href={`/compare/${slug}`}
      className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-emerald-600 group-hover:text-emerald-700">
            {cert1.name}
          </span>
          <span className="text-zinc-400">vs</span>
          <span className="text-lg font-bold text-blue-600 group-hover:text-blue-700">
            {cert2.name}
          </span>
        </div>
        <svg
          className="h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            cert1.level === "entry"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : cert1.level === "professional"
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
          }`}
        >
          {cert1.name}: {cert1.level}
        </span>
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            cert2.level === "entry"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : cert2.level === "professional"
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
          }`}
        >
          {cert2.name}: {cert2.level}
        </span>
      </div>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        Compare exam details, prerequisites, costs, and career paths for{" "}
        {cert1.fullName} and {cert2.fullName}.
      </p>
    </Link>
  );
}

export default function ComparePage() {
  const groups = getComparisonGroups();

  // FAQ schema for rich snippets
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I choose between ServiceNow certifications?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Consider your current role, career goals, and the ServiceNow modules you work with most. Entry-level professionals should start with CSA (System Administrator). Developers should progress to CAD. Specialists should choose CIS certifications that match their area of focus (ITSM, CSM, Discovery, etc.).",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between CSA and CAD certifications?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CSA (Certified System Administrator) covers platform configuration and administration without coding. CAD (Certified Application Developer) focuses on JavaScript scripting, custom applications, APIs, and advanced development. CSA is the prerequisite for CAD.",
        },
      },
      {
        "@type": "Question",
        name: "Which ServiceNow certification should I get first?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For most people, the Certified System Administrator (CSA) is the best starting point. It's required as a prerequisite for most other certifications and provides the foundational knowledge you need to work effectively on the ServiceNow platform.",
        },
      },
      {
        "@type": "Question",
        name: "Are CIS certifications worth it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, CIS (Certified Implementation Specialist) certifications demonstrate deep expertise in specific ServiceNow modules like ITSM, CSM, Discovery, or HR. They're valuable for consultants, implementers, and specialists who configure these modules for clients or their organizations.",
        },
      },
    ],
  };

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Compare Certifications", url: "/compare" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen">
        {/* Breadcrumb */}
        <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-zinc-500">
              <Link
                href="/"
                className="hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                Home
              </Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-zinc-100">
                Compare Certifications
              </span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-emerald-50 to-white py-16 dark:from-zinc-900 dark:to-zinc-950">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                {comparisonPairs.length} Comparisons Available
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                ServiceNow Certification Comparisons
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                Not sure which certification to pursue? Compare ServiceNow
                certifications side by side — exam details, prerequisites,
                costs, and career impact.
              </p>
            </div>

            {/* Popular Comparisons Quick Links */}
            <div className="mt-12">
              <h2 className="text-center text-sm font-medium uppercase tracking-wider text-zinc-500">
                Most Popular Comparisons
              </h2>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Link
                  href="/compare/csa-vs-cad"
                  className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-800 dark:bg-zinc-800 dark:text-emerald-400 dark:hover:bg-zinc-700"
                >
                  CSA vs CAD
                </Link>
                <Link
                  href="/compare/csa-vs-cis-itsm"
                  className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-800 dark:bg-zinc-800 dark:text-emerald-400 dark:hover:bg-zinc-700"
                >
                  CSA vs CIS-ITSM
                </Link>
                <Link
                  href="/compare/cis-discovery-vs-cis-sm"
                  className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-800 dark:bg-zinc-800 dark:text-emerald-400 dark:hover:bg-zinc-700"
                >
                  Discovery vs Service Mapping
                </Link>
                <Link
                  href="/compare/cis-vr-vs-cis-sir"
                  className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-800 dark:bg-zinc-800 dark:text-emerald-400 dark:hover:bg-zinc-700"
                >
                  VR vs SIR
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Groups */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {groups.map((group) => (
                <div key={group.name}>
                  <div className="mb-6">
                    <h2 className="flex items-center gap-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                      <span>{group.emoji}</span>
                      {group.name}
                    </h2>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                      {group.description}
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.pairs.map((pair) => (
                      <ComparisonCard
                        key={`${pair.cert1}-vs-${pair.cert2}`}
                        pair={pair}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-emerald-600 py-16 dark:bg-emerald-700">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white">
              Ready to Start Preparing?
            </h2>
            <p className="mt-4 text-emerald-100">
              Once you&apos;ve chosen your certification, practice with our
              exam-style questions.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/certifications"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
              >
                Browse All Certifications
              </Link>
              <Link
                href="/certification-paths"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white px-8 text-base font-medium text-white transition-colors hover:bg-emerald-500"
              >
                View Career Paths
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
