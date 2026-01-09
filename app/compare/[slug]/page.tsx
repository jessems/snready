import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCertificationBySlug, getCategoryDisplayName } from "@/lib/data";
import {
  getAllComparisonSlugs,
  parseComparisonSlug,
  getComparisonRecommendation,
} from "@/lib/comparisons";
import { breadcrumbs, generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import ComparisonTable from "@/components/ComparisonTable";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllComparisonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseComparisonSlug(slug);

  if (!parsed) {
    return { title: "Comparison Not Found" };
  }

  const cert1 = getCertificationBySlug(parsed.cert1);
  const cert2 = getCertificationBySlug(parsed.cert2);

  if (!cert1 || !cert2) {
    return { title: "Comparison Not Found" };
  }

  return {
    title: `${cert1.name} vs ${cert2.name} - ServiceNow Certification Comparison`,
    description: `Compare ServiceNow ${cert1.name} and ${cert2.name} certifications. See exam details, prerequisites, costs, and which certification is right for you.`,
    keywords: [
      `${cert1.name} vs ${cert2.name}`,
      `ServiceNow ${cert1.name} comparison`,
      `ServiceNow ${cert2.name} comparison`,
      `${cert1.name} or ${cert2.name}`,
      "ServiceNow certification comparison",
    ],
    alternates: {
      canonical: `/compare/${slug}`,
    },
    openGraph: {
      title: `${cert1.name} vs ${cert2.name} Certification | SNReady`,
      description: `Which ServiceNow certification is right for you? Compare ${cert1.name} and ${cert2.name} exam details, prerequisites, and career paths.`,
    },
  };
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseComparisonSlug(slug);

  if (!parsed) {
    notFound();
  }

  const cert1 = getCertificationBySlug(parsed.cert1);
  const cert2 = getCertificationBySlug(parsed.cert2);

  if (!cert1 || !cert2) {
    notFound();
  }

  const recommendation = getComparisonRecommendation(
    cert1.level,
    cert2.level,
    cert1.name,
    cert2.name
  );

  // JSON-LD structured data - Breadcrumb schema
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(
    breadcrumbs.comparison(cert1.name, cert2.name, slug)
  );

  // JSON-LD structured data - FAQ schema
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the difference between ${cert1.name} and ${cert2.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${cert1.name} (${cert1.fullName}) focuses on ${cert1.description.slice(0, 150)}. ${cert2.name} (${cert2.fullName}) focuses on ${cert2.description.slice(0, 150)}. The ${cert1.name} exam has ${cert1.examDetails.questionCount} questions while ${cert2.name} has ${cert2.examDetails.questionCount} questions.`,
        },
      },
      {
        "@type": "Question",
        name: `Should I get ${cert1.name} or ${cert2.name} certification?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: recommendation,
        },
      },
      {
        "@type": "Question",
        name: `Which is harder: ${cert1.name} or ${cert2.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${cert1.name} requires a ${cert1.examDetails.passingScore}% score on ${cert1.examDetails.questionCount} questions in ${cert1.examDetails.duration} minutes. ${cert2.name} requires a ${cert2.examDetails.passingScore}% score on ${cert2.examDetails.questionCount} questions in ${cert2.examDetails.duration} minutes. Difficulty varies based on your background and experience.`,
        },
      },
      {
        "@type": "Question",
        name: `How much do ${cert1.name} and ${cert2.name} exams cost?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The ${cert1.name} exam costs $${cert1.examDetails.cost} USD and the ${cert2.name} exam costs $${cert2.examDetails.cost} USD.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
                {cert1.name} vs {cert2.name}
              </span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-emerald-50 to-white py-16 dark:from-zinc-900 dark:to-zinc-950">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                Certification Comparison
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                <span className="text-emerald-600">{cert1.name}</span>
                <span className="mx-3 text-zinc-400">vs</span>
                <span className="text-blue-600">{cert2.name}</span>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                Compare ServiceNow {cert1.fullName} and {cert2.fullName}{" "}
                certifications to find the right path for your career.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {/* Cert 1 Card */}
              <div className="rounded-xl border-2 border-emerald-200 bg-white p-6 dark:border-emerald-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-emerald-600">
                    {cert1.name}
                  </h2>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      cert1.level === "entry"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : cert1.level === "professional"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                    }`}
                  >
                    {cert1.level}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-500">{cert1.fullName}</p>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                  {cert1.description}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
                  <span>{getCategoryDisplayName(cert1.category)}</span>
                </div>
                <Link
                  href={`/certifications/${cert1.slug}`}
                  className="mt-4 inline-flex text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  View {cert1.name} details →
                </Link>
              </div>

              {/* Cert 2 Card */}
              <div className="rounded-xl border-2 border-blue-200 bg-white p-6 dark:border-blue-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-blue-600">
                    {cert2.name}
                  </h2>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      cert2.level === "entry"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : cert2.level === "professional"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                    }`}
                  >
                    {cert2.level}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-500">{cert2.fullName}</p>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                  {cert2.description}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
                  <span>{getCategoryDisplayName(cert2.category)}</span>
                </div>
                <Link
                  href={`/certifications/${cert2.slug}`}
                  className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View {cert2.name} details →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Side-by-Side Comparison
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Compare exam details, costs, and requirements.
            </p>

            <div className="mt-8">
              <ComparisonTable cert1={cert1} cert2={cert2} />
            </div>
          </div>
        </section>

        {/* Recommendation Section */}
        <section className="bg-zinc-50 py-16 dark:bg-zinc-900">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Which Should You Choose?
            </h2>
            <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-800">
              <p className="text-lg text-zinc-600 dark:text-zinc-300">
                {recommendation}
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-emerald-600">
                    Choose {cert1.name} if:
                  </h3>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="mt-1 text-emerald-500">•</span>
                      You work primarily with {getCategoryDisplayName(cert1.category).toLowerCase()} functions
                    </li>
                    <li className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="mt-1 text-emerald-500">•</span>
                      Your role requires {cert1.fullName.toLowerCase()} expertise
                    </li>
                    <li className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="mt-1 text-emerald-500">•</span>
                      You want to demonstrate {cert1.level}-level ServiceNow skills
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-600">
                    Choose {cert2.name} if:
                  </h3>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="mt-1 text-blue-500">•</span>
                      You work primarily with {getCategoryDisplayName(cert2.category).toLowerCase()} functions
                    </li>
                    <li className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="mt-1 text-blue-500">•</span>
                      Your role requires {cert2.fullName.toLowerCase()} expertise
                    </li>
                    <li className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="mt-1 text-blue-500">•</span>
                      You want to demonstrate {cert2.level}-level ServiceNow skills
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-600 py-16 dark:bg-emerald-700">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white">
              Ready to Start Preparing?
            </h2>
            <p className="mt-4 text-emerald-100">
              Try our free practice questions to see which certification fits
              your current knowledge.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={`/certifications/${cert1.slug}`}
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
              >
                Practice {cert1.name}
              </Link>
              <Link
                href={`/certifications/${cert2.slug}`}
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white px-8 text-base font-medium text-white transition-colors hover:bg-emerald-500"
              >
                Practice {cert2.name}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
