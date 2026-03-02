import { Metadata } from "next";
import Link from "next/link";
import {
  getAllCertificationsWithReadiness,
  getTotalQuestionCount,
} from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ServiceNow Practice Questions | SNReady",
  description:
    "ServiceNow certification practice questions for CSA, CIS-DF, CAD, CIS-ITSM with detailed explanations and free questions.",
  alternates: {
    canonical: getCanonicalUrl("/practice-questions"),
  },
  openGraph: {
    title: "ServiceNow Practice Questions | SNReady",
    description:
      "ServiceNow certification practice questions with detailed explanations.",
    url: getCanonicalUrl("/practice-questions"),
    images: ["/og-default.png"],
  },
};

export default function PracticeTestsIndexPage() {
  const certifications = getAllCertificationsWithReadiness();
  const readyCerts = certifications.filter((cert) => cert.isReady);
  const comingSoonCerts = certifications.filter((cert) => !cert.isReady);

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Practice Questions", url: "/practice-questions" },
  ];

  const totalQuestions = readyCerts.reduce(
    (sum, cert) => sum + getTotalQuestionCount(cert.slug),
    0
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbJsonLd(breadcrumbItems)),
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            ServiceNow Practice Questions
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Realistic exam questions to help you pass your certification
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 flex justify-center gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-emerald-600">
              {totalQuestions}+
            </div>
            <div className="text-sm text-zinc-500">Practice Questions</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-600">
              {readyCerts.length}
            </div>
            <div className="text-sm text-zinc-500">Certifications Available</div>
          </div>
        </div>

        {/* Available Practice Questions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Available Practice Questions
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {readyCerts.map((cert) => {
              const questionCount = getTotalQuestionCount(cert.slug);
              return (
                <Link
                  key={cert.slug}
                  href={`/${cert.slug}/practice-questions`}
                  className="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-emerald-600"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                        {cert.level || "ENTRY"}
                      </span>
                      <h3 className="mt-2 text-xl font-bold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100">
                        {cert.name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {cert.fullName}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600">
                        {questionCount}
                      </div>
                      <div className="text-xs text-zinc-500">questions</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
                    <span>{cert.examDetails?.questionCount || 60} exam questions</span>
                    <span>•</span>
                    <span>{cert.examDetails?.duration || "90 min"}</span>
                    <span>•</span>
                    <span>{cert.examDetails?.passingScore || "70%"} to pass</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                      Start Practice Questions →
                    </span>
                    <span className="text-xs text-zinc-400">
                      Free questions available
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Coming Soon */}
        {comingSoonCerts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Coming Soon
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {comingSoonCerts.slice(0, 6).map((cert) => (
                <div
                  key={cert.slug}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50"
                >
                  <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {cert.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    {cert.fullName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to Pass Your Exam?</h2>
          <p className="mt-2 text-emerald-100">
            Get unlimited access to all practice questions with detailed explanations
          </p>
          <div className="mt-6">
            <Link
              href="/certifications"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              View All Certifications
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
