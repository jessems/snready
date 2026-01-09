import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCategories,
  getCertificationsByCategory,
  getCategoryDisplayName,
  getCategoryDescription,
  getTotalQuestionCount,
} from "@/lib/data";
import { breadcrumbs, generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import type { CertificationCategory } from "@/types";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const displayName = getCategoryDisplayName(category as CertificationCategory);
  const certs = getCertificationsByCategory(category as CertificationCategory);
  const description = getCategoryDescription(category as CertificationCategory);

  if (certs.length === 0) {
    return { title: "Category Not Found" };
  }

  return {
    title: `ServiceNow ${displayName} Certifications - Complete Guide`,
    description: `Explore ${certs.length} ServiceNow ${displayName} certifications. ${description.slice(0, 120)}...`,
    keywords: [
      `ServiceNow ${displayName} certification`,
      `${displayName} exam prep`,
      `ServiceNow ${displayName} practice test`,
      ...certs.map((c) => `${c.name} certification`),
    ],
    alternates: {
      canonical: `/certifications/category/${category}`,
    },
    openGraph: {
      title: `ServiceNow ${displayName} Certifications | SNReady`,
      description: `Master ServiceNow ${displayName} with ${certs.length} certification paths and practice tests.`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const displayName = getCategoryDisplayName(category as CertificationCategory);
  const description = getCategoryDescription(category as CertificationCategory);
  const certs = getCertificationsByCategory(category as CertificationCategory);

  if (certs.length === 0) {
    notFound();
  }

  // Calculate totals
  const totalQuestions = certs.reduce(
    (sum, cert) => sum + getTotalQuestionCount(cert.slug),
    0
  );

  // JSON-LD structured data - Breadcrumb schema
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(
    breadcrumbs.category(displayName, category)
  );

  // JSON-LD structured data - ItemList schema for certifications
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `ServiceNow ${displayName} Certifications`,
    description: description,
    numberOfItems: certs.length,
    itemListElement: certs.map((cert, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        name: cert.fullName,
        description: cert.description,
        provider: {
          "@type": "Organization",
          name: "ServiceNow",
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
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
              <Link
                href="/#certifications"
                className="hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                Certifications
              </Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-zinc-100">
                {displayName}
              </span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-emerald-50 to-white py-16 dark:from-zinc-900 dark:to-zinc-950">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  {certs.length} Certification{certs.length !== 1 ? "s" : ""}
                </span>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                  ServiceNow {displayName} Certifications
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                  {description}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href={`/certifications/${certs[0].slug}`}
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Start with {certs[0].name}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {certs.length}
                </div>
                <div className="text-sm text-zinc-500">Certifications</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {totalQuestions}+
                </div>
                <div className="text-sm text-zinc-500">Practice Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {certs.filter((c) => c.level === "entry").length > 0
                    ? "Entry"
                    : certs.filter((c) => c.level === "professional").length > 0
                      ? "Professional"
                      : "Expert"}
                </div>
                <div className="text-sm text-zinc-500">Starting Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  ${Math.min(...certs.map((c) => c.examDetails.cost))}
                </div>
                <div className="text-sm text-zinc-500">Starting Cost</div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications Grid */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              All {displayName} Certifications
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Choose a certification to view exam details and start practicing.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certs.map((cert) => (
                <Link
                  key={cert.slug}
                  href={`/certifications/${cert.slug}`}
                  className="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
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
                    <span className="text-xs text-zinc-500">
                      {cert.release}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100">
                    {cert.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">{cert.fullName}</p>

                  <p className="mt-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {cert.description}
                  </p>

                  <div className="mt-4 flex items-center gap-4 border-t border-zinc-100 pt-4 text-xs text-zinc-500 dark:border-zinc-800">
                    <span>{cert.examDetails.questionCount} questions</span>
                    <span>{cert.examDetails.duration} min</span>
                    <span>${cert.examDetails.cost}</span>
                  </div>

                  <div className="mt-4 text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                    Start practicing →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Related Categories */}
        <section className="bg-zinc-50 py-16 dark:bg-zinc-900">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Explore Other Categories
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {getAllCategories()
                .filter((cat) => cat !== category)
                .slice(0, 8)
                .map((cat) => (
                  <Link
                    key={cat}
                    href={`/certifications/category/${cat}`}
                    className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {getCategoryDisplayName(cat as CertificationCategory)}
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-600 py-16 dark:bg-emerald-700">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white">
              Ready to Get {displayName} Certified?
            </h2>
            <p className="mt-4 text-emerald-100">
              Start with free practice questions and build your confidence
              before the exam.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={`/certifications/${certs[0].slug}`}
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
              >
                Start Free Practice
              </Link>
              <Link
                href="/#certifications"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white px-8 text-base font-medium text-white transition-colors hover:bg-emerald-500"
              >
                View All Certifications
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
