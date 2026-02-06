import { Metadata } from "next";
import Link from "next/link";
import {
  getAllCertifications,
  getCertificationsGroupedByCategoryWithReadiness,
  getCategoryDisplayName,
  getSortedCategories,
  isCertificationReady,
  getTotalQuestionCount,
  getTotalFreeQuestionCount,
} from "@/lib/data";
import CertificationCard from "@/components/CertificationCard";
import { breadcrumbs, generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title: "All ServiceNow Certifications - Practice Tests & Exam Prep | SNReady",
  description:
    "Browse all 25+ ServiceNow certifications. Free practice questions and study materials for CSA, CIS-DF, CAD, CIS-ITSM, and more.",
  keywords: [
    "ServiceNow certifications",
    "ServiceNow exam prep",
    "CSA certification",
    "CIS certification",
    "ServiceNow practice test",
  ],
  alternates: {
    canonical: "/certifications",
  },
  openGraph: {
    title: "All ServiceNow Certifications | SNReady",
    description:
      "Browse all ServiceNow certifications with free practice questions and study materials.",
  },
};

export default function CertificationsPage() {
  const certifications = getAllCertifications();
  const groupedCerts = getCertificationsGroupedByCategoryWithReadiness();
  const sortedCategories = getSortedCategories();

  // Calculate totals
  const readyCerts = certifications.filter((c) => isCertificationReady(c.slug));
  const totalQuestions = readyCerts.reduce(
    (sum, cert) => sum + getTotalQuestionCount(cert.slug),
    0
  );
  const totalFreeQuestions = readyCerts.reduce(
    (sum, cert) => sum + getTotalFreeQuestionCount(cert.slug),
    0
  );

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Certifications", url: "/certifications" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen">
        {/* Header */}
        <section className="bg-gradient-to-b from-emerald-50 to-white py-16 dark:from-zinc-900 dark:to-zinc-950">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                All ServiceNow Certifications
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                Practice tests and study materials for {certifications.length}{" "}
                ServiceNow certifications across {sortedCategories.length}{" "}
                categories.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-3xl mx-auto">
              <div className="rounded-lg bg-white p-4 text-center shadow-sm dark:bg-zinc-800">
                <div className="text-2xl font-bold text-emerald-600">
                  {readyCerts.length}
                </div>
                <div className="text-sm text-zinc-500">Active Exams</div>
              </div>
              <div className="rounded-lg bg-white p-4 text-center shadow-sm dark:bg-zinc-800">
                <div className="text-2xl font-bold text-emerald-600">
                  {totalQuestions}+
                </div>
                <div className="text-sm text-zinc-500">Questions</div>
              </div>
              <div className="rounded-lg bg-white p-4 text-center shadow-sm dark:bg-zinc-800">
                <div className="text-2xl font-bold text-emerald-600">
                  {totalFreeQuestions}
                </div>
                <div className="text-sm text-zinc-500">Free Questions</div>
              </div>
              <div className="rounded-lg bg-white p-4 text-center shadow-sm dark:bg-zinc-800">
                <div className="text-2xl font-bold text-emerald-600">
                  {certifications.length}
                </div>
                <div className="text-sm text-zinc-500">Total Certs</div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications by Category */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {sortedCategories.map((category) => {
              const certs = groupedCerts[category];
              if (!certs || certs.length === 0) return null;

              return (
                <div key={category} className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                      {getCategoryDisplayName(category)}
                    </h2>
                    <span className="text-sm text-zinc-500">
                      {certs.length} certification
                      {certs.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {certs.map((cert) => (
                      <CertificationCard
                        key={cert.slug}
                        certification={cert}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-600 py-16 dark:bg-emerald-700">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white">
              Ready to Start Practicing?
            </h2>
            <p className="mt-4 text-emerald-100">
              Begin with our most popular certification — CSA (Certified System
              Administrator).
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/certifications/csa"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
              >
                Start CSA Practice
              </Link>
              <Link
                href="/free-questions/csa/ui-navigation"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white px-8 text-base font-medium text-white transition-colors hover:bg-emerald-500"
              >
                Try Free Questions
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
