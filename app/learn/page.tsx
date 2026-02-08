import { Metadata } from "next";
import Link from "next/link";
import { getAllCertificationsWithReadiness } from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Learn ServiceNow - Certification Study Resources | SNReady",
  description:
    "Comprehensive learning resources for ServiceNow certifications. Study guides, key concepts, and exam preparation materials for CSA, CIS-DF, CAD, and more.",
  alternates: {
    canonical: getCanonicalUrl("/learn"),
  },
  openGraph: {
    title: "Learn ServiceNow - Certification Study Resources | SNReady",
    description:
      "Comprehensive learning resources for ServiceNow certifications.",
    url: getCanonicalUrl("/learn"),
    images: ["/og-default.png"],
  },
};

export default function LearnIndexPage() {
  const certifications = getAllCertificationsWithReadiness();
  const readyCerts = certifications.filter((cert) => cert.isReady);

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Learn", url: "/learn" },
  ];

  const resources = [
    {
      title: "Exam Prep",
      description: "Complete exam preparation with blueprints, study plans, and real experiences",
      href: "/certifications",
      icon: "📚",
    },
    {
      title: "Glossary",
      description: "Key ServiceNow terms and concepts you need to know",
      href: "/glossary",
      icon: "📖",
    },
    {
      title: "Practice Questions",
      description: "Practice questions covering all exam domains",
      href: "/practice-questions",
      icon: "📝",
    },
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
            Learn ServiceNow
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Everything you need to pass your ServiceNow certification exam
          </p>
        </div>

        {/* Resource Types */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {resources.map((resource) => (
            <Link
              key={resource.href}
              href={resource.href}
              className="group flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-emerald-600"
            >
              <span className="text-3xl">{resource.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100">
                  {resource.title}
                </h3>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  {resource.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Certification-Specific Learning */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Learn by Certification
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Choose your certification to access targeted study materials
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {readyCerts.map((cert) => (
              <div
                key={cert.slug}
                className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    {cert.level || "ENTRY"}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {cert.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {cert.fullName}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/certifications/${cert.slug}/prepare`}
                    className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-emerald-100 hover:text-emerald-700 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-emerald-900 dark:hover:text-emerald-300"
                  >
                    Exam Prep
                  </Link>
                  <Link
                    href={`/glossary/${cert.slug}`}
                    className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-emerald-100 hover:text-emerald-700 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-emerald-900 dark:hover:text-emerald-300"
                  >
                    Glossary
                  </Link>
                  <Link
                    href={`/practice-questions/${cert.slug}`}
                    className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-emerald-100 hover:text-emerald-700 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-emerald-900 dark:hover:text-emerald-300"
                  >
                    Practice Questions
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official Resources */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Official ServiceNow Resources
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <a
              href="https://nowlearning.servicenow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow dark:border-zinc-700 dark:bg-zinc-800"
            >
              <span className="text-2xl">🎓</span>
              <div>
                <h3 className="font-bold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100">
                  Now Learning
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Official ServiceNow training courses and learning paths
                </p>
              </div>
            </a>
            <a
              href="https://docs.servicenow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow dark:border-zinc-700 dark:bg-zinc-800"
            >
              <span className="text-2xl">📄</span>
              <div>
                <h3 className="font-bold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100">
                  ServiceNow Docs
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Official product documentation and release notes
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to Start Practicing?</h2>
          <p className="mt-2 text-emerald-100">
            Test your knowledge with our practice questions
          </p>
          <div className="mt-6">
            <Link
              href="/practice-questions"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              Start Practicing
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
