import Link from "next/link";
import {
  getAllCertifications,
  getTotalQuestionCount,
  getTotalFreeQuestionCount,
  getTopicsForCertification,
} from "@/lib/data";
import CertificationCard from "@/components/CertificationCard";

export default function Home() {
  const certifications = getAllCertifications();
  
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
              CIS-ITSM, and more. Practice with questions generated directly from official
              Now Learning content.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/csa/practice-questions"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-8 text-base font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Start CSA Practice
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
                Practice tests that mirror the real exam format. Review your results and identify weak areas before exam day.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
              <span>💡</span>
              <span>Questions updated for Zurich release</span>
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

      {/* Pricing Section */}
      <section className="py-16 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Try free questions first. Upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Single Certification */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Single Certification
                </h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">$9</span>
                  <span className="text-zinc-600 dark:text-zinc-400"> / 30 days</span>
                </div>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                  Full access to one certification of your choice
                </p>
                <ul className="mt-6 space-y-3 text-left text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
                    All practice questions for one cert
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
                    Detailed explanations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
                    30-day access
                  </li>
                </ul>
              </div>
            </div>

            {/* Lifetime All Access */}
            <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-8 dark:bg-emerald-950/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-emerald-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                  Best Value
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Lifetime All Access
                </h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-emerald-600">$49</span>
                  <span className="text-zinc-600 dark:text-zinc-400"> / forever</span>
                </div>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                  Every certification, current and future
                </p>
                <ul className="mt-6 space-y-3 text-left text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
                    <strong>All</strong> certifications included
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
                    CSA, CIS-DF, CAD, CIS-ITSM &amp; more
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
                    Future certifications included
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
                    Lifetime access — never expires
                  </li>
                </ul>
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
              {certifications.length} ServiceNow certifications — 4 available now
            </p>
          </div>

          {/* Ready Now Section */}
          <div className="mt-12">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Available Now
              </h3>
              <span className="text-sm text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-400 px-2 py-1 rounded">
                Start practicing today
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {["csa", "cis-df", "cad", "cis-itsm"].map((slug) => {
                const cert = certifications.find(c => c.slug === slug);
                if (!cert) return null;
                return (
                  <CertificationCard 
                    key={cert.slug} 
                    certification={{
                      ...cert,
                      isReady: true,
                      topicCount: getTopicsForCertification(cert.slug).length,
                      totalQuestions: getTotalQuestionCount(cert.slug),
                    }} 
                  />
                );
              })}
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Coming Soon
              </h3>
              <span className="text-sm text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                More certifications on the way
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {certifications
                .filter(cert => !["csa", "cis-df", "cad", "cis-itsm"].includes(cert.slug))
                .map((cert) => (
                  <CertificationCard 
                    key={cert.slug} 
                    certification={{
                      ...cert,
                      isReady: false,
                      topicCount: 0,
                      totalQuestions: 0,
                    }} 
                  />
                ))}
            </div>
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
                href={`/csa/practice-questions/${topic.slug}`}
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
              href="/csa"
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
                href={`/cad/practice-questions/${topic.slug}`}
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
              href="/cad"
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
              href="/practice-questions/csa"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-8 text-base font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Start Practicing Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
