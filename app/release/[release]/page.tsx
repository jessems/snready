import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCertificationsByRelease,
  getActiveReleases,
  getReleaseInfo,
  getReleaseDisplayName,
  getDaysUntilDeltaDeadline,
  isDeltaWindowOpen,
} from "@/lib/data";
import type { ServiceNowRelease, Certification } from "@/types";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

interface PageProps {
  params: Promise<{ release: string }>;
}

// Convert URL param to ServiceNowRelease type
function normalizeRelease(release: string): ServiceNowRelease | null {
  const normalized = release.charAt(0).toUpperCase() + release.slice(1).toLowerCase();
  const validReleases: ServiceNowRelease[] = ["Vancouver", "Washington", "Xanadu", "Yokohama", "Zurich"];
  return validReleases.includes(normalized as ServiceNowRelease) ? (normalized as ServiceNowRelease) : null;
}

export async function generateStaticParams() {
  return getActiveReleases().map((release) => ({
    release: release.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { release: releaseParam } = await params;
  const release = normalizeRelease(releaseParam);

  if (!release) {
    return { title: "Release Not Found" };
  }

  const releaseInfo = getReleaseInfo(release);
  const certs = getCertificationsByRelease(release);

  return {
    title: `ServiceNow ${release} Release - Delta Exams & Certifications`,
    description: `All ServiceNow ${release} release certifications and delta exams. ${certs.length} certifications updated for ${release} (${releaseInfo.season} ${releaseInfo.year}). Practice questions and study guides.`,
    keywords: [
      `ServiceNow ${release}`,
      `${release} release`,
      `${release} delta exam`,
      `ServiceNow ${release} certifications`,
      `${release} certification update`,
      "ServiceNow delta exam",
    ],
    alternates: {
      canonical: `/release/${releaseParam}`,
    },
    openGraph: {
      title: `ServiceNow ${release} Release | SNReady`,
      description: `All ${certs.length} ServiceNow certifications for the ${release} release. Delta exams, practice questions, and study guides.`,
    },
  };
}

export default async function ReleasePage({ params }: PageProps) {
  const { release: releaseParam } = await params;
  const release = normalizeRelease(releaseParam);

  if (!release) {
    notFound();
  }

  const certs = getCertificationsByRelease(release);
  const releaseInfo = getReleaseInfo(release);

  if (certs.length === 0) {
    notFound();
  }

  // Group certifications by category
  const certsByCategory = certs.reduce((acc, cert) => {
    if (!acc[cert.category]) {
      acc[cert.category] = [];
    }
    acc[cert.category].push(cert);
    return acc;
  }, {} as Record<string, Certification[]>);

  // Get first cert with delta window info
  const sampleCert = certs.find((c) => c.deltaExam?.deltaWindow);
  const deltaWindow = sampleCert?.deltaExam?.deltaWindow;

  // JSON-LD structured data
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Releases", url: "/#releases" },
    { name: `${release} Release`, url: `/release/${releaseParam}` },
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `ServiceNow ${release} Release Certifications`,
    description: `All certifications updated for the ServiceNow ${release} release`,
    numberOfItems: certs.length,
    itemListElement: certs.map((cert, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: cert.fullName,
      url: `https://snready.com/certifications/${cert.slug}`,
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
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-violet-50 to-white py-16 dark:from-zinc-900 dark:to-zinc-950">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-violet-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700 ring-1 ring-violet-200/50 dark:bg-violet-950 dark:text-violet-300 dark:ring-violet-800/50">
                    ServiceNow Release
                  </span>
                  <span className="text-sm text-zinc-500">
                    {releaseInfo.season} {releaseInfo.year}
                  </span>
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                  {release} Release
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                  {certs.length} ServiceNow certifications are updated for the {release} release.
                  Complete your delta exams to maintain your certifications.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/#certifications"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-violet-600 px-6 text-base font-medium text-white transition-colors hover:bg-violet-700"
                >
                  Browse All Certifications
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Delta Window Info */}
        {deltaWindow && (
          <section className="border-y border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                <div>
                  <div className="text-2xl font-bold text-violet-600">
                    {certs.length}
                  </div>
                  <div className="text-sm text-zinc-500">Certifications</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-violet-600">
                    {new Date(deltaWindow.opens).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-sm text-zinc-500">Delta Opens</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-violet-600">
                    {new Date(deltaWindow.closes).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-sm text-zinc-500">Deadline</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-violet-600">90</div>
                  <div className="text-sm text-zinc-500">Day Window</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Certifications List */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {release} Certifications
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              All certifications updated to the {release} release.
            </p>

            <div className="mt-8 space-y-12">
              {Object.entries(certsByCategory).map(([category, categoryCerts]) => (
                <div key={category}>
                  <h3 className="mb-4 text-lg font-semibold capitalize text-zinc-900 dark:text-zinc-100">
                    {category.replace("-", " ")}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryCerts.map((cert) => {
                      const daysLeft = getDaysUntilDeltaDeadline(cert);
                      const isOpen = isDeltaWindowOpen(cert);
                      const urgencyLevel =
                        daysLeft !== null && daysLeft <= 14
                          ? "urgent"
                          : daysLeft !== null && daysLeft <= 30
                            ? "warning"
                            : "normal";

                      return (
                        <div
                          key={cert.slug}
                          className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                                {cert.name}
                              </h4>
                              <p className="text-sm text-zinc-500">
                                {cert.fullName}
                              </p>
                            </div>
                            {isOpen && daysLeft !== null && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  urgencyLevel === "urgent"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                    : urgencyLevel === "warning"
                                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                                }`}
                              >
                                {daysLeft}d left
                              </span>
                            )}
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Link
                              href={`/delta/${cert.slug}-${release.toLowerCase()}`}
                              className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
                            >
                              Delta Exam
                            </Link>
                            <Link
                              href={`/certifications/${cert.slug}`}
                              className="inline-flex items-center rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
                            >
                              Full Prep
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-violet-600 py-16 dark:bg-violet-700">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white">
              Stay Current with {release}
            </h2>
            <p className="mt-4 text-violet-100">
              Complete your delta exams to maintain your ServiceNow certifications.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/#certifications"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-medium text-violet-600 transition-colors hover:bg-violet-50"
              >
                Browse All Certifications
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
