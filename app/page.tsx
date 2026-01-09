import Link from "next/link";
import {
  getAllCertifications,
  getTotalQuestionCount,
  getTotalFreeQuestionCount,
  getCertificationsGroupedByCategory,
  getCategoryDisplayName,
  getSortedCategories,
} from "@/lib/data";

export default function Home() {
  const certifications = getAllCertifications();
  const groupedCerts = getCertificationsGroupedByCategory();
  const sortedCategories = getSortedCategories();
  const csaQuestionCount = getTotalQuestionCount("csa");
  const csaFreeCount = getTotalFreeQuestionCount("csa");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-20 dark:from-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl dark:text-zinc-50">
              Pass Your{" "}
              <span className="text-emerald-600">ServiceNow</span>{" "}
              Certification
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Free practice tests, exam questions, and study guides for CSA, CAD,
              CIS-ITSM, and more. Join thousands of IT professionals who passed
              their exams with SNReady.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/certifications/csa"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-8 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Start Free CSA Practice
              </Link>
              <Link
                href="/practice-tests/csa"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-8 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                Take Full Mock Exam
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {csaQuestionCount}+
              </div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Practice Questions
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {csaFreeCount}+
              </div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Free Questions
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">20+</div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Certifications
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">94%</div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Pass Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Grid by Category */}
      <section id="certifications" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Choose Your Certification
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              {certifications.length} ServiceNow certifications across {sortedCategories.length} categories
            </p>
          </div>

          {/* Category sections */}
          <div className="mt-12 space-y-12">
            {sortedCategories.map((category) => {
              const certs = groupedCerts[category];
              if (!certs || certs.length === 0) return null;

              return (
                <div key={category}>
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                      {getCategoryDisplayName(category)}
                    </h3>
                    <span className="text-sm text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                      {certs.length} {certs.length === 1 ? "exam" : "exams"}
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {certs.map((cert) => (
                      <Link
                        key={cert.slug}
                        href={`/certifications/${cert.slug}`}
                        className="group rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              cert.level === "entry"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                : cert.level === "professional"
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                            }`}
                          >
                            {cert.level}
                          </span>
                          <span className="text-sm text-zinc-500">${cert.examDetails.cost}</span>
                        </div>
                        <h4 className="mt-3 text-lg font-semibold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100">
                          {cert.name}
                        </h4>
                        <p className="mt-1 text-sm text-zinc-500 line-clamp-1">{cert.fullName}</p>
                        <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
                          <span>{cert.examDetails.questionCount} Q</span>
                          <span>{cert.examDetails.duration} min</span>
                          <span>{cert.examDetails.passingScore}%</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Topics Preview (CSA) */}
      <section className="bg-zinc-50 py-20 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              CSA Exam Topics
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Master every domain with targeted practice questions
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Incident Management", slug: "incident-management", icon: "🚨" },
              { name: "Problem Management", slug: "problem-management", icon: "🔍" },
              { name: "Change Management", slug: "change-management", icon: "🔄" },
              { name: "User Administration", slug: "user-administration", icon: "👤" },
              { name: "Reporting", slug: "reporting-dashboards", icon: "📊" },
              { name: "Service Catalog", slug: "self-service-automation", icon: "🛒" },
              { name: "Database Admin", slug: "database-administration", icon: "🗄️" },
              { name: "UI Navigation", slug: "ui-navigation", icon: "🧭" },
            ].map((topic) => (
              <Link
                key={topic.slug}
                href={`/csa/questions/${topic.slug}`}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow dark:border-zinc-800 dark:bg-zinc-800 dark:hover:border-emerald-700"
              >
                <span className="text-2xl">{topic.icon}</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {topic.name}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/certifications/csa"
              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              View all CSA topics →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Ready to Get Certified?
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Start with our free practice questions and see how prepared you are
            for the real exam.
          </p>
          <div className="mt-8">
            <Link
              href="/free-questions/csa/incident-management"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-8 text-base font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Try 5 Free Questions Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
