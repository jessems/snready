import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCertificationBySlug,
  getTopicsForCertification,
  getCertificationSlugs,
  isCertificationReady,
} from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { getCanonicalUrl } from "@/lib/seo";

interface Props {
  params: Promise<{
    cert: string;
  }>;
}

export async function generateStaticParams() {
  return getCertificationSlugs().map((slug) => ({
    cert: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cert } = await params;
  
  const certification = getCertificationBySlug(cert);
  
  if (!certification) {
    return {
      title: "Certification Not Found",
    };
  }

  const title = `Free ${certification.name} Practice Questions | SNReady`;
  const description = `Practice free ${certification.name} certification questions. No signup required — start testing your ServiceNow knowledge immediately.`;
  
  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/free-questions/${cert}`),
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl(`/free-questions/${cert}`),
      images: ['/og-default.png'],
    },
  };
}

export default async function CertificationFreeQuestionsPage({ params }: Props) {
  const { cert } = await params;
  
  const certification = getCertificationBySlug(cert);
  const topics = getTopicsForCertification(cert);
  const isReady = isCertificationReady(cert);
  
  if (!certification) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Free Questions", url: "/free-questions" },
    { name: certification.name, url: `/free-questions/${cert}` },
  ];

  const totalFreeQuestions = topics.reduce(
    (sum, topic) => sum + Math.min(10, topic.questionCount),
    0
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbJsonLd(breadcrumbItems)),
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-zinc-700">Home</Link>
            <span>→</span>
            <Link href="/free-questions" className="hover:text-zinc-700">Free Questions</Link>
            <span>→</span>
            <span>{certification.name}</span>
          </div>
          
          <h1 className="mt-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            Free {certification.name} Questions
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            {certification.fullName}
          </p>
          
          {isReady && (
            <p className="mt-4 text-emerald-600 font-medium">
              {totalFreeQuestions} free questions across {topics.length} topics
            </p>
          )}
        </div>

        {isReady ? (
          <>
            {/* Topics Grid */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => {
                const freeCount = Math.min(10, topic.questionCount);
                return (
                  <Link
                    key={topic.slug}
                    href={`/free-questions/${cert}/${topic.slug}`}
                    className="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-emerald-600"
                  >
                    <h3 className="font-bold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100">
                      {topic.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {topic.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-sm">
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

            {/* CTA */}
            <div className="mt-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 p-8 text-center text-white">
              <h2 className="text-2xl font-bold">Want Full Access?</h2>
              <p className="mt-2 text-emerald-100">
                Unlock all {certification.name} questions with detailed explanations
              </p>
              <div className="mt-6">
                <Link
                  href={`/certifications/${cert}`}
                  className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
                >
                  Get {certification.name} Access
                </Link>
              </div>
            </div>
          </>
        ) : (
          /* Coming Soon */
          <div className="mt-12 rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Coming Soon
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Free questions for {certification.name} are currently being developed.
            </p>
            <div className="mt-6">
              <Link
                href="/free-questions"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                View Available Questions
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
