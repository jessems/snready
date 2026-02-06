import { Metadata } from "next";
import Link from "next/link";
import {
  getAllCertificationsWithReadiness,
  getTopicsForCertification,
} from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free ServiceNow Practice Questions | SNReady",
  description:
    "Practice free ServiceNow certification questions for CSA, CIS-DF, CAD, CIS-ITSM, and more. No signup required — start practicing immediately.",
  alternates: {
    canonical: getCanonicalUrl("/free-questions"),
  },
  openGraph: {
    title: "Free ServiceNow Practice Questions | SNReady",
    description:
      "Practice free ServiceNow certification questions for CSA, CIS-DF, CAD, CIS-ITSM, and more.",
    url: getCanonicalUrl("/free-questions"),
    images: ["/og-default.png"],
  },
};

export default function FreeQuestionsIndexPage() {
  const certifications = getAllCertificationsWithReadiness().filter(
    (cert) => cert.isReady
  );

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Free Questions", url: "/free-questions" },
  ];

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
            Free Practice Questions
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Start practicing immediately — no signup required
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 flex justify-center gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-emerald-600">
              {certifications.reduce(
                (sum, cert) =>
                  sum +
                  getTopicsForCertification(cert.slug).reduce(
                    (topicSum, topic) => topicSum + Math.min(10, topic.questionCount),
                    0
                  ),
                0
              )}+
            </div>
            <div className="text-sm text-zinc-500">Free Questions</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-600">
              {certifications.length}
            </div>
            <div className="text-sm text-zinc-500">Certifications</div>
          </div>
        </div>

        {/* Certification Grid */}
        <div className="mt-12 space-y-12">
          {certifications.map((cert) => {
            const topics = getTopicsForCertification(cert.slug);
            const totalFreeQuestions = topics.reduce(
              (sum, topic) => sum + Math.min(10, topic.questionCount),
              0
            );

            return (
              <div key={cert.slug}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      {cert.name} — {cert.fullName}
                    </h2>
                    <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                      {totalFreeQuestions} free questions across {topics.length} topics
                    </p>
                  </div>
                  <Link
                    href={`/certifications/${cert.slug}`}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    View all →
                  </Link>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {topics.map((topic) => {
                    const freeCount = Math.min(10, topic.questionCount);
                    return (
                      <Link
                        key={topic.slug}
                        href={`/free-questions/${cert.slug}/${topic.slug}`}
                        className="group rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-emerald-600"
                      >
                        <h3 className="font-semibold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100">
                          {topic.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                          {topic.description}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <span className="font-medium text-emerald-600">
                            {freeCount} free questions
                          </span>
                          <span className="text-zinc-400">
                            {topic.questionCount} total
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Want More Practice Questions?</h2>
          <p className="mt-2 text-emerald-100">
            Unlock full access to all questions with detailed explanations
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/certifications/csa"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              Get CSA Access — $9
            </Link>
            <Link
              href="/#certifications"
              className="inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              View All Certifications
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
