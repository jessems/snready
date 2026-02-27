import { Metadata } from "next";
import Link from "next/link";
import { getAllCertifications } from "@/lib/data";

export const metadata: Metadata = {
  title: "ServiceNow Exam Blueprints - Official Certification Guides",
  description:
    "Links to official ServiceNow certification exam blueprints. Find exam specifications, domain breakdowns, and study requirements for CSA, CAD, CIS, and all ServiceNow certifications.",
  keywords: [
    "ServiceNow exam blueprint",
    "CSA exam blueprint",
    "CAD exam blueprint",
    "CIS exam specification",
    "ServiceNow certification guide",
    "ServiceNow exam domains",
  ],
  alternates: {
    canonical: "/exam-blueprints",
  },
};

// Official ServiceNow exam blueprint URLs
const blueprintUrls: Record<string, string> = {
  csa: "https://nowlearning.servicenow.com/lxp/en/credentials/certified-system-administrator-mainline-exam-blueprint?id=kb_article_view&sysparm_article=KB0011554",
  cad: "https://nowlearning.servicenow.com/lxp/en/credentials/certified-application-developer-mainline-exam-blueprint?id=kb_article_view&sysparm_article=KB0011498",
  cta: "https://nowlearning.servicenow.com/lxp/en/credentials/certified-technical-architect-mainline-exam-blueprint?id=kb_article_view&sysparm_article=KB0011505",
  cpoa: "https://nowlearning.servicenow.com/lxp/en/credentials/certified-platform-owner-associate-exam-blueprint",
  "cis-df": "https://nowlearning.servicenow.com/lxp/en/credentials/certified-implementation-specialist-cmdb-mainline-exam-blueprint?id=kb_article_view&sysparm_article=KB0011528",
  "cis-itsm": "https://nowlearning.servicenow.com/lxp/en/credentials/certified-implementation-specialist-itsm-mainline-exam-blueprint?id=kb_article_view&sysparm_article=KB0011507",
  "cis-csm": "https://nowlearning.servicenow.com/lxp/en/credentials/certified-implementation-specialist-customer-service-management?id=kb_article_view&sysparm_article=KB0011529",
  "cis-fsm": "https://nowlearning.servicenow.com/lxp/en/credentials/certified-implementation-specialist-field-service-management-mainline?id=kb_article_view&sysparm_article=KB0011561",
  "cis-hr": "https://nowlearning.servicenow.com/lxp/en/credentials/certified-implementation-specialist-human-resources-mainline-exam-blueprint?id=kb_article_view&sysparm_article=KB0011654",
  "cis-discovery": "https://nowlearning.servicenow.com/lxp/en/credentials/certified-implementation-specialist-discovery-mainline-exam-blueprint?id=kb_article_view&sysparm_article=KB0011545",
  "cis-sm": "https://nowlearning.servicenow.com/lxp/en/credentials/certified-implementation-specialist-service-mapping-mainline-exam?id=kb_article_view&sysparm_article=KB0011541",
  "cis-em": "https://nowlearning.servicenow.com/lxp/en/credentials/certified-implementation-specialist-event-management-mainline-exam?id=kb_article_view&sysparm_article=KB0011546",
  "cis-vr": "https://nowlearning.servicenow.com/lxp/en/credentials/certified-implementation-specialist-vulnerability-response-mainline-exam?id=kb_article_view&sysparm_article=KB0011555",
  "cis-sir": "https://nowlearning.servicenow.com/lxp/en/credentials/certified-implementation-specialist-security-incident-response?id=kb_article_view&sysparm_article=KB0011556",
  "cis-rc": "https://nowlearning.servicenow.com/lxp/en/credentials/certified-implementation-specialist-risk-and-compliance-mainline?id=kb_article_view&sysparm_article=KB0011540",
  "cis-tprm": "https://nowlearning.servicenow.com/lxp/en/credentials/cis-third-party-risk-management-mainline-exam-blueprint",
  "cis-sam": "https://nowlearning.servicenow.com/lxp/en/credentials/certified-implementation-specialist-software-asset-management?id=kb_article_view&sysparm_article=KB0011533",
  "cis-ham": "https://nowlearning.servicenow.com/lxp/en/credentials/certified-implementation-specialist-hardware-asset-management?id=kb_article_view&sysparm_article=KB0011534",
  "cis-spm": "https://nowlearning.servicenow.com/lxp/en/credentials/certified-implementation-specialist-strategic-portfolio-management?id=kb_article_view&sysparm_article=KB0011542",
  "cis-sp": "https://nowlearning.servicenow.com/lxp/en/credentials/certified-implementation-specialist-service-provider-mainline?id=kb_article_view&sysparm_article=KB0011569",
  "cis-pa": "https://nowlearning.servicenow.com/lxp/en/credentials/certified-implementation-specialist-performance-analytics-mainline?id=kb_article_view&sysparm_article=KB0011543",
};

// Category labels for grouping
const categoryLabels: Record<string, string> = {
  foundation: "Foundation Certifications",
  developer: "Developer Certifications",
  architect: "Architect Certifications",
  implementation: "Implementation Specialist (CIS)",
};

// Category order
const categoryOrder = ["foundation", "developer", "architect", "implementation"];

export default function ExamBlueprintsPage() {
  const certifications = getAllCertifications();

  // Group certifications by category
  const grouped = certifications.reduce(
    (acc, cert) => {
      const category = cert.category || "implementation";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(cert);
      return acc;
    },
    {} as Record<string, typeof certifications>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-zinc-900 dark:to-zinc-950">
      {/* Hero */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            ServiceNow Exam Blueprints
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Official exam specifications and domain breakdowns for all
            ServiceNow certifications. These blueprints are published by
            ServiceNow and outline exactly what&apos;s tested on each exam.
          </p>
        </div>
      </section>

      {/* Blueprints List */}
      <section className="pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {categoryOrder.map((category) => {
            const certs = grouped[category];
            if (!certs || certs.length === 0) return null;

            return (
              <div key={category} className="mb-12">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  {categoryLabels[category] || category}
                </h2>
                <div className="space-y-4">
                  {certs.map((cert) => {
                    const blueprintUrl = blueprintUrls[cert.slug];
                    return (
                      <div
                        key={cert.slug}
                        className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center rounded-md bg-emerald-100 px-2.5 py-0.5 text-sm font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                              {cert.name}
                            </span>
                            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                              {cert.fullName}
                            </h3>
                          </div>
                          {cert.examDetails && (
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                              {cert.examDetails.questionCount} questions •{" "}
                              {cert.examDetails.duration} min •{" "}
                              {cert.examDetails.passingScore}% to pass
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <Link
                            href={`/${cert.slug}`}
                            className="text-sm text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
                          >
                            Practice
                          </Link>
                          {blueprintUrl ? (
                            <a
                              href={blueprintUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                            >
                              View Blueprint
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          ) : (
                            <span className="text-sm text-zinc-400 dark:text-zinc-500">
                              Coming soon
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Info Box */}
          <div className="mt-12 rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-900/20">
            <div className="flex gap-4">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                  About Exam Blueprints
                </h3>
                <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">
                  Exam blueprints are official documents from ServiceNow that
                  detail the knowledge domains, weightings, and objectives for
                  each certification exam. Review the blueprint before studying
                  to understand exactly what topics you need to master.
                </p>
                <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">
                  Note: You&apos;ll need a Now Learning account (free) to access
                  the blueprints. Blueprint content is updated with each
                  ServiceNow release.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Ready to start practicing?
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Our practice questions are aligned with the official exam blueprints.
          </p>
          <div className="mt-6">
            <Link
              href="/certifications"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-600 px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Browse All Certifications
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
