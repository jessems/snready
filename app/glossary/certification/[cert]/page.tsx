import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCertificationBySlug,
  getCertificationSlugs,
  getGlossaryForCertification,
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

  const title = `${certification.name} Glossary - ServiceNow Terms & Definitions | SNReady`;
  const description = `Master key ${certification.name} terms and concepts. Comprehensive glossary of ServiceNow definitions essential for your ${certification.name} certification exam.`;
  
  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/glossary/certification/${cert}`),
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl(`/glossary/certification/${cert}`),
      images: ['/og-default.png'],
    },
  };
}

export default async function CertificationGlossaryPage({ params }: Props) {
  const { cert } = await params;
  
  const certification = getCertificationBySlug(cert);
  
  if (!certification) {
    notFound();
  }

  const glossaryTerms = getGlossaryForCertification(cert);

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Glossary", url: "/glossary" },
    { name: certification.name, url: `/glossary/certification/${cert}` },
  ];

  // Group terms by first letter
  const groupedTerms = glossaryTerms.reduce((acc, item) => {
    const letter = item.term[0].toUpperCase();
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(item);
    return acc;
  }, {} as Record<string, typeof glossaryTerms>);

  const alphabet = Object.keys(groupedTerms).sort();

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
            <Link href="/glossary" className="hover:text-zinc-700">Glossary</Link>
            <span>→</span>
            <span>{certification.name}</span>
          </div>
          
          <h1 className="mt-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            {certification.name} Glossary
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            Key terms and definitions for the {certification.name} certification
          </p>
          
          {glossaryTerms.length > 0 && (
            <p className="mt-4 text-emerald-600">
              {glossaryTerms.length} terms
            </p>
          )}
        </div>

        {glossaryTerms.length > 0 ? (
          <>
            {/* Alphabet Navigation */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {alphabet.map((letter) => (
                <a
                  key={letter}
                  href={`#${letter}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-sm font-medium text-zinc-700 transition-colors hover:bg-emerald-100 hover:text-emerald-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-emerald-900 dark:hover:text-emerald-300"
                >
                  {letter}
                </a>
              ))}
            </div>

            {/* Terms */}
            <div className="mt-8 space-y-8">
              {alphabet.map((letter) => (
                <div key={letter} id={letter}>
                  <h2 className="sticky top-0 z-10 -mx-4 bg-white px-4 py-2 text-2xl font-bold text-emerald-600 dark:bg-zinc-900">
                    {letter}
                  </h2>
                  <dl className="mt-4 space-y-4">
                    {groupedTerms[letter].map((item, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
                      >
                        <dt className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {item.term}
                        </dt>
                        <dd className="mt-2 text-zinc-600 dark:text-zinc-400">
                          {item.definition}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* No glossary yet */
          <div className="mt-12 rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Glossary Coming Soon
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              The {certification.name} glossary is currently being developed.
            </p>
            <div className="mt-6">
              <Link
                href="/glossary"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                View All Glossaries
              </Link>
            </div>
          </div>
        )}

        {/* Related Links */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href={`/${cert}/prepare`}
            className="rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Exam Prep</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {certification.name} exam preparation
            </p>
          </Link>
          <Link
            href={`/${cert}/practice-questions`}
            className="rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Practice Questions</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {certification.name} practice questions
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}
