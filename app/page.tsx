import Link from "next/link";
import {
  getAllCertifications,
  getTotalQuestionCount,
  getTotalFreeQuestionCount,
  getCertificationsGroupedByCategoryWithReadiness,
  getCategoryDisplayName,
  getSortedCategories,
  isCertificationReady,
} from "@/lib/data";
import CertificationCard from "@/components/CertificationCard";

export default function Home() {
  const certifications = getAllCertifications();
  const groupedCerts = getCertificationsGroupedByCategoryWithReadiness();
  const sortedCategories = getSortedCategories();
  
  // Calculate total questions across all ready certifications
  const readyCerts = ["csa", "cis-df", "cad", "cis-itsm"];
  const totalQuestions = readyCerts.reduce((sum, cert) => sum + getTotalQuestionCount(cert), 0);
  const totalFreeQuestions = readyCerts.reduce((sum, cert) => sum + getTotalFreeQuestionCount(cert), 0);
  const activeCertifications = readyCerts.length;

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
              Free practice tests, exam questions, and study guides for CSA, CIS-DF, CAD,
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
            </div>
          </div>
        </div>
      </section>

      {/* Why SNReady Section */}
      <section className="py-16 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Stop Wasting Money on Stale Udemy Courses
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
              Generic exam dumps become outdated the moment ServiceNow releases a new version. 
              SNReady questions are generated from official Now Learning content — always current, always accurate.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Benefit 1 */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-2xl dark:bg-emerald-900">
                🎯
              </div>
              <h3 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Questions From Real Course Content
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Every question is derived from official ServiceNow training materials — the same content tested on the actual exam. No guessing, no outdated braindumps.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-2xl dark:bg-emerald-900">
                📚
              </div>
              <h3 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Learn Why You're Wrong
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Detailed explanations for every answer — correct and incorrect. Each explanation links back to the source material so you actually learn, not just memorize.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-2xl dark:bg-emerald-900">
                ⏱️
              </div>
              <h3 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Realistic Practice Tests
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Full-length mock exams that mirror the real test format. Time yourself, review your results, and identify weak areas before exam day.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
              <span>💡</span>
              <span>Questions updated for Xanadu & Yokohama releases</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {totalQuestions}+
              </div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Practice Questions
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {totalFreeQuestions}+
              </div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Free Questions
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">25+</div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Certifications
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{activeCertifications}</div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Active Certifications
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
                      <CertificationCard key={cert.slug} certification={cert} />
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

      {/* Topics Preview (CAD) */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              CAD Exam Topics
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Master ServiceNow application development with 130+ practice questions
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Scripting & APIs", slug: "scripting-apis", icon: "💻" },
              { name: "Business Rules", slug: "business-rules", icon: "⚙️" },
              { name: "Client Scripts", slug: "client-scripts", icon: "🖥️" },
              { name: "UI Policies", slug: "ui-policies-actions", icon: "🎨" },
              { name: "Script Includes", slug: "script-includes", icon: "📦" },
              { name: "REST APIs", slug: "integration-rest", icon: "🔗" },
              { name: "App Development", slug: "application-development", icon: "🏗️" },
            ].map((topic) => (
              <Link
                key={topic.slug}
                href={`/cad/questions/${topic.slug}`}
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
              href="/certifications/cad"
              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              View all CAD topics →
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
