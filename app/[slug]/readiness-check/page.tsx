import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCertificationBySlug,
  getCertificationSlugs,
  getDomainsForCertification,
  getAllQuestionsForCertification,
  isCertificationReady,
} from "@/lib/data";
import { getCanonicalUrl } from "@/lib/seo";
import ReadinessCheck from "@/components/ReadinessCheck";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getCertificationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cert = getCertificationBySlug(slug);

  if (!cert) {
    return { title: "Certification Not Found" };
  }

  const title = `${cert.name} Readiness Check — Are You Exam Ready? | SNReady`;
  const description = `Free ${cert.name} readiness assessment. Answer 10 questions across all exam domains to find out if you're ready for the ServiceNow ${cert.fullName} certification exam.`;

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/${slug}/readiness-check`),
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl(`/${slug}/readiness-check`),
      type: "website",
    },
  };
}

export default async function ReadinessCheckPage({ params }: Props) {
  const { slug } = await params;
  const cert = getCertificationBySlug(slug);

  if (!cert || !isCertificationReady(slug)) {
    notFound();
  }

  const domains = getDomainsForCertification(slug);
  const allQuestions = await getAllQuestionsForCertification(slug);

  if (allQuestions.length < 10) {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-65px)] subtle-gradient py-10">
      <div className="max-w-2xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-6">
          <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/${slug}`}
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            {cert.name}
          </Link>
          <span>/</span>
          <span className="text-[var(--text-primary)]">Readiness Check</span>
        </nav>

        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[var(--accent)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                {cert.name} Readiness Check
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {cert.fullName}
              </p>
            </div>
          </div>
        </div>

        <ReadinessCheck
          certSlug={slug}
          certName={cert.name}
          certFullName={cert.fullName}
          domains={domains}
          allQuestions={allQuestions}
        />
      </div>
    </div>
  );
}
