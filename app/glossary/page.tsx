import { Metadata } from "next";
import Link from "next/link";
import { getGlossaryTermsGroupedAlphabetically } from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ServiceNow Glossary - Key Terms & Concepts | SNReady",
  description: "Complete glossary of ServiceNow terms and concepts for certification exams. Learn definitions of key platform concepts for CSA, CAD, CIS-ITSM, and other certifications.",
  alternates: {
    canonical: getCanonicalUrl("/glossary"),
  },
  openGraph: {
    title: "ServiceNow Glossary - Key Terms & Concepts | SNReady",
    description: "Complete glossary of ServiceNow terms and concepts for certification exams. Learn definitions of key platform concepts for CSA, CAD, CIS-ITSM, and other certifications.",
    url: getCanonicalUrl("/glossary"),
    images: ['/og-default.png'],
  },
  twitter: {
    title: "ServiceNow Glossary - Key Terms & Concepts | SNReady",
    description: "Complete glossary of ServiceNow terms and concepts for certification exams. Learn definitions of key platform concepts for CSA, CAD, CIS-ITSM, and other certifications.",
    images: ['/og-default.png'],
  },
};

export default function GlossaryIndexPage() {
  const groupedTerms = getGlossaryTermsGroupedAlphabetically();
  const alphabeticalSections = Object.keys(groupedTerms).sort();

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Glossary", url: "/glossary" },
  ];

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
            <span>Glossary</span>
          </div>
          
          <h1 className="mt-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            ServiceNow Glossary
          </h1>
          <p className="mt-2 text-xl text-emerald-600">
            Key Terms & Concepts for Certification Success
          </p>
          
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Essential ServiceNow concepts organized alphabetically. Perfect for exam preparation and quick reference.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Quick Navigation
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {alphabeticalSections.map((letter) => (
              <a
                key={letter}
                href={`#section-${letter}`}
                className="rounded bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-800"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>

        {/* Terms by Letter */}
        <div className="mt-8 space-y-8">
          {alphabeticalSections.map((letter) => (
            <div key={letter} id={`section-${letter}`}>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {letter}
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groupedTerms[letter].map((term) => (
                  <Link
                    key={term.slug}
                    href={`/glossary/${term.slug}`}
                    className="group rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-emerald-600"
                  >
                    <h3 className="font-semibold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400">
                      {term.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      Used in {term.certifications.length} certification{term.certifications.length !== 1 ? 's' : ''}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {term.certifications.slice(0, 3).map((cert) => (
                        <span
                          key={cert.certSlug}
                          className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        >
                          {cert.certSlug.toUpperCase()}
                        </span>
                      ))}
                      {term.certifications.length > 3 && (
                        <span className="text-xs text-zinc-500">
                          +{term.certifications.length - 3} more
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Study Resources */}
        <div className="mt-12 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100 p-4 sm:p-8 text-center dark:border-emerald-800 dark:from-emerald-950 dark:to-green-950">
          <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
            Master These Concepts
          </h2>
          <p className="mt-2 text-emerald-700 dark:text-emerald-300">
            Ready to test your knowledge? Try our practice questions and study guides.
          </p>
          
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/csa/practice-questions"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              CSA Practice Questions
            </Link>
            <Link
              href="/csa/prepare"
              className="inline-flex items-center justify-center rounded-lg border border-emerald-600 px-8 py-3 font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950"
            >
              Exam Prep
            </Link>
          </div>
        </div>

        {/* Related Resources */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Related Resources
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/learn/ui-navigation"
              className="rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Study Guides</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                In-depth concept explanations
              </p>
            </Link>
            <Link
              href="/csa/practice-questions"
              className="rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Practice Questions</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Practice questions
              </p>
            </Link>
            <Link
              href="/#certifications"
              className="rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">All Certifications</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Browse 25+ certifications
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}