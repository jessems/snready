import { Metadata } from "next";
import Link from "next/link";
import { getAllCertifications, isCertificationReady } from "@/lib/data";

export const metadata: Metadata = {
  title: "ServiceNow Study Guides - Certification Exam Prep",
  description:
    "Comprehensive study guides for all ServiceNow certifications. Exam blueprints, key topics, and preparation strategies for CSA, CIS-DF, CAD, and more.",
  alternates: {
    canonical: "/study-guide",
  },
};

export default function StudyGuidesPage() {
  const certifications = getAllCertifications();
  const readyCerts = certifications.filter((c) => isCertificationReady(c.slug));
  const comingSoonCerts = certifications.filter((c) => !isCertificationReady(c.slug));

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-emerald-50 to-white py-16 dark:from-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            ServiceNow Study Guides
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Comprehensive exam prep guides with blueprints, key topics, and study strategies.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
            Available Study Guides
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {readyCerts.map((cert) => (
              <Link
                key={cert.slug}
                href={`/study-guide/${cert.slug}`}
                className="group rounded-lg border border-zinc-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100">
                    {cert.name}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    Available
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {cert.fullName}
                </p>
              </Link>
            ))}
          </div>

          {comingSoonCerts.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6 mt-12">
                Coming Soon
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {comingSoonCerts.slice(0, 9).map((cert) => (
                  <div
                    key={cert.slug}
                    className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
                  >
                    <h3 className="font-medium text-zinc-500 dark:text-zinc-400">
                      {cert.name}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                      {cert.fullName}
                    </p>
                  </div>
                ))}
              </div>
              {comingSoonCerts.length > 9 && (
                <p className="mt-4 text-sm text-zinc-500 text-center">
                  +{comingSoonCerts.length - 9} more certifications coming soon
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
