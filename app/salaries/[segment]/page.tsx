import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getSegmentBySlug,
  ALL_SEGMENTS,
  getRoleSegments,
  getCountrySegments,
  formatCompact,
  type SalarySegment,
} from "@/lib/salaries/segments";
import SalarySegmentClient from "./SalarySegmentClient";

interface PageProps {
  params: Promise<{ segment: string }>;
}

// Generate static paths for all segments
export async function generateStaticParams() {
  return ALL_SEGMENTS.map((segment) => ({
    segment: segment.slug,
  }));
}

// Generate metadata for each segment
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { segment: slug } = await params;
  const segment = getSegmentBySlug(slug);

  if (!segment) {
    return {
      title: "Salary Data Not Found | SNReady",
    };
  }

  return {
    title: segment.title,
    description: segment.description,
    keywords: segment.keywords,
    openGraph: {
      title: segment.title,
      description: segment.description,
      url: `https://snready.com/salaries/${segment.slug}`,
      type: "website",
    },
    alternates: {
      canonical: `https://snready.com/salaries/${segment.slug}`,
    },
  };
}

// Structured data for SEO
function generateStructuredData(segment: SalarySegment) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: segment.title,
    description: segment.description,
    url: `https://snready.com/salaries/${segment.slug}`,
    keywords: segment.keywords.join(", "),
    creator: {
      "@type": "Organization",
      name: "SNReady",
      url: "https://snready.com",
    },
    temporalCoverage: "2024/2026",
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "Base Salary",
        description: "Annual base compensation in local currency",
      },
    ],
  };
}

export default async function SalarySegmentPage({ params }: PageProps) {
  const { segment: slug } = await params;
  const segment = getSegmentBySlug(slug);

  if (!segment) {
    notFound();
  }

  const roleSegments = getRoleSegments();
  const countrySegments = getCountrySegments();
  const structuredData = generateStructuredData(segment);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Breadcrumbs */}
          <nav className="text-sm mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                  Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href="/salaries" className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                  Salaries
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 dark:text-white font-medium">
                {segment.displayName}
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {segment.type === "role" ? (
              <>{segment.displayName} Salary</>
            ) : (
              <>ServiceNow Salaries in {segment.displayName}</>
            )}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            {segment.description}
          </p>
        </div>
      </header>

      {/* Main Content - Client Component with live data */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <SalarySegmentClient segment={segment} />

        {/* Related Pages */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Explore More Salary Data
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Other Roles */}
            {segment.type === "role" ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Other Roles
                </h3>
                <ul className="space-y-2">
                  {roleSegments
                    .filter((r) => r.slug !== segment.slug)
                    .map((role) => (
                      <li key={role.slug}>
                        <Link
                          href={`/salaries/${role.slug}`}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {role.displayName} Salary →
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Browse by Role
                </h3>
                <ul className="space-y-2">
                  {roleSegments.map((role) => (
                    <li key={role.slug}>
                      <Link
                        href={`/salaries/${role.slug}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {role.displayName} Salary →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Countries */}
            {segment.type === "country" ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Other Countries
                </h3>
                <ul className="space-y-2">
                  {countrySegments
                    .filter((c) => c.slug !== segment.slug)
                    .map((country) => (
                      <li key={country.slug}>
                        <Link
                          href={`/salaries/${country.slug}`}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Salaries in {country.displayName} →
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Browse by Country
                </h3>
                <ul className="space-y-2">
                  {countrySegments.map((country) => (
                    <li key={country.slug}>
                      <Link
                        href={`/salaries/${country.slug}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Salaries in {country.displayName} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Help us improve this data
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Share your anonymous salary to help the ServiceNow community benchmark compensation.
            Unlock full insights once you contribute.
          </p>
          <Link
            href="/salaries"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Share Your Salary →
          </Link>
        </section>
      </main>
    </div>
  );
}
