import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCertificationBySlug,
  getCertificationSlugs,
  getTotalQuestionCount,
  isCertificationReady,
} from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { getCanonicalUrl } from "@/lib/seo";
import examPrepData from "@/data/exam-prep.json";

interface Props {
  params: Promise<{ slug: string }>;
}

type ExamPrepCert = keyof typeof examPrepData;

export async function generateStaticParams() {
  // Generate for ALL certifications, not just ones with prep data
  return getCertificationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const certification = getCertificationBySlug(slug);

  if (!certification) {
    return { title: "Certification Not Found" };
  }

  const title = `${certification.name} Exam Prep: Courses, Docs & Blueprint | SNReady`;
  const description = `Official ${certification.name} exam blueprint, required Now Learning courses, and documentation. Everything you need to prepare for ${certification.fullName}.`;

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/certifications/${slug}/prepare`),
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl(`/certifications/${slug}/prepare`),
      images: ["/og-default.png"],
    },
    twitter: {
      title,
      description,
      images: ["/og-default.png"],
    },
  };
}

// Generate fallback prep data from certification domains
function generateFallbackPrepData(certification: NonNullable<ReturnType<typeof getCertificationBySlug>>) {
  const baseUrl = "https://nowlearning.servicenow.com/lxp/en/credentials";
  return {
    officialResources: {
      examPage: `${baseUrl}/${certification.slug}`,
      blueprintUrl: `${baseUrl}/${certification.slug}`,
      studyGuideUrl: certification.deltaExam?.studyGuideUrl || null,
    },
    requiredCourses: [] as Array<{ name: string; url: string; duration: string; description: string; domains: string[] }>,
    recommendedCourses: [] as Array<{ name: string; url: string; duration: string; description: string; domains: string[] }>,
    documentationSections: [] as Array<{ name: string; url: string; domains: string[] }>,
    examBlueprint: {
      source: "ServiceNow Official Exam Blueprint",
      lastUpdated: certification.lastUpdated || "2025-01",
      domains: certification.domains.map((d) => ({
        name: d.name,
        percentage: d.percentage,
        objectives: [d.description],
      })),
    },
  };
}

export default async function ExamPrepPage({ params }: Props) {
  const { slug } = await params;
  const certification = getCertificationBySlug(slug);

  if (!certification) {
    notFound();
  }

  // Use existing prep data or generate fallback from certification domains
  const prepData = slug in examPrepData 
    ? examPrepData[slug as ExamPrepCert]
    : generateFallbackPrepData(certification);
  const totalQuestions = getTotalQuestionCount(slug);
  const isReady = isCertificationReady(slug);

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Certifications", url: "/#certifications" },
    { name: certification.name, url: `/certifications/${slug}` },
    { name: "Exam Prep", url: `/certifications/${slug}/prepare` },
  ];

  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What courses do I need for ${certification.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Required courses: ${prepData.requiredCourses.map((c) => c.name).join(", ")}. Recommended: ${prepData.recommendedCourses.map((c) => c.name).join(", ")}.`,
        },
      },
      {
        "@type": "Question",
        name: `What is on the ${certification.name} exam?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The ${certification.name} exam covers ${prepData.examBlueprint.domains.length} domains: ${prepData.examBlueprint.domains.map((d) => `${d.name} (${d.percentage}%)`).join(", ")}.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbJsonLd(breadcrumbItems)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">Home</Link>
          <span>→</span>
          <Link href={`/certifications/${slug}`} className="hover:text-zinc-700 dark:hover:text-zinc-300">
            {certification.name}
          </Link>
          <span>→</span>
          <span className="text-zinc-900 dark:text-zinc-100">Exam Prep</span>
        </nav>

        {/* Header */}
        <div className="mt-6">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            {certification.name} Exam Preparation
          </h1>
          <p className="mt-2 text-xl text-zinc-600 dark:text-zinc-400">
            {certification.fullName}
          </p>

          {/* Quick Links */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={prepData.officialResources.examPage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Official Exam Page ↗
            </a>
            {prepData.officialResources.studyGuideUrl && (
              <a
                href={prepData.officialResources.studyGuideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Official Study Guide ↗
              </a>
            )}
            {isReady && (
              <Link
                href={`/certifications/${slug}`}
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              >
                Practice Questions ({totalQuestions}+)
              </Link>
            )}
          </div>
        </div>

        {/* Exam Overview */}
        <section className="mt-10 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Exam Details
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <div className="text-2xl font-bold text-emerald-600">{certification.examDetails.questionCount}</div>
              <div className="text-sm text-zinc-500">Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{certification.examDetails.duration} min</div>
              <div className="text-sm text-zinc-500">Duration</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{certification.examDetails.passingScore}%</div>
              <div className="text-sm text-zinc-500">Passing Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">${certification.examDetails.cost}</div>
              <div className="text-sm text-zinc-500">Exam Fee</div>
            </div>
          </div>
        </section>

        {/* Exam Blueprint */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Exam Blueprint
            </h2>
            <span className="text-sm text-zinc-500">
              {prepData.examBlueprint.source}
            </span>
          </div>

          {prepData.examBlueprint.domains.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center dark:border-zinc-600 dark:bg-zinc-900">
              <p className="text-zinc-600 dark:text-zinc-400">
                Detailed blueprint coming soon. Visit the{" "}
                <a
                  href={prepData.officialResources.blueprintUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline"
                >
                  official exam page
                </a>{" "}
                for domain details.
              </p>
            </div>
          ) : (
          <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="w-full">
              <thead className="bg-zinc-100 dark:bg-zinc-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">Domain</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-zinc-900 dark:text-zinc-100">Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {prepData.examBlueprint.domains
                  .sort((a, b) => b.percentage - a.percentage)
                  .map((domain) => (
                    <tr key={domain.name} className="bg-white dark:bg-zinc-900">
                      <td className="px-4 py-4">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">{domain.name}</div>
                        <ul className="mt-2 space-y-1">
                          {domain.objectives.map((obj, i) => (
                            <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400">
                              • {obj}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-4 text-right align-top">
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          {domain.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          )}
        </section>

        {/* Required Courses */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Required Courses
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Official Now Learning courses that cover the exam content.
          </p>

          {prepData.requiredCourses.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center dark:border-zinc-600 dark:bg-zinc-900">
              <p className="text-zinc-600 dark:text-zinc-400">
                Course information coming soon. Visit the{" "}
                <a
                  href={prepData.officialResources.examPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline"
                >
                  official exam page
                </a>{" "}
                for the latest requirements.
              </p>
            </div>
          ) : (
          <div className="mt-6 space-y-4">
            {prepData.requiredCourses.map((course) => (
              <a
                key={course.name}
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border-2 border-emerald-200 bg-emerald-50 p-4 transition-colors hover:border-emerald-400 dark:border-emerald-800 dark:bg-emerald-950 dark:hover:border-emerald-600"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
                        REQUIRED
                      </span>
                      <span className="text-sm text-zinc-500">{course.duration}</span>
                    </div>
                    <div className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
                      {course.name}
                    </div>
                    <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {course.description}
                    </div>
                    {course.domains.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {course.domains.map((d) => (
                          <span key={d} className="rounded bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                            {d}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-emerald-600">↗</span>
                </div>
              </a>
            ))}
          </div>
          )}

          {prepData.recommendedCourses.length > 0 && (
            <>
              <h3 className="mt-8 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Recommended Courses
              </h3>
              <div className="mt-4 space-y-4">
                {prepData.recommendedCourses.map((course) => (
                  <a
                    key={course.name}
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                            RECOMMENDED
                          </span>
                          <span className="text-sm text-zinc-500">{course.duration}</span>
                        </div>
                        <div className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
                          {course.name}
                        </div>
                        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          {course.description}
                        </div>
                      </div>
                      <span className="text-zinc-400">↗</span>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Documentation */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Official Documentation
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            ServiceNow docs pages that map to the exam domains.
          </p>

          {prepData.documentationSections.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center dark:border-zinc-600 dark:bg-zinc-900">
              <p className="text-zinc-600 dark:text-zinc-400">
                Documentation links coming soon. Visit{" "}
                <a
                  href="https://docs.servicenow.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline"
                >
                  docs.servicenow.com
                </a>{" "}
                for the official documentation.
              </p>
            </div>
          ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {prepData.documentationSections.map((doc) => (
              <a
                key={doc.name}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950"
              >
                <div className="flex items-center gap-3">
                  <span className="text-blue-600 dark:text-blue-400">📄</span>
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{doc.name}</div>
                    {doc.domains.length > 0 && (
                      <div className="text-xs text-zinc-500">{doc.domains.join(", ")}</div>
                    )}
                  </div>
                </div>
                <span className="text-zinc-400">↗</span>
              </a>
            ))}
          </div>
          )}
        </section>

        {/* Prerequisites */}
        {certification.prerequisites.length > 0 && (
          <section className="mt-10 rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950">
            <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
              Prerequisites
            </h2>
            <ul className="mt-3 space-y-2">
              {certification.prerequisites.map((prereq, index) => (
                <li key={index} className="flex items-start gap-2 text-amber-800 dark:text-amber-200">
                  <span className="mt-0.5">•</span>
                  {prereq}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Practice CTA */}
        {isReady && (
          <section className="mt-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 p-8 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Ready to Practice?</h2>
              <p className="mt-2 text-emerald-100">
                Test your knowledge with {totalQuestions}+ practice questions
              </p>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href={`/certifications/${slug}`}
                  className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  Start Practicing — $9
                </Link>
                <Link
                  href={`/free-questions/${slug}`}
                  className="inline-flex items-center justify-center rounded-lg border border-white px-8 py-3 font-semibold text-white hover:bg-white/10"
                >
                  Try Free Questions
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
