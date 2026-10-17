import type { Metadata } from "next";
import Link from "next/link";
import { authorJsonLd } from "@/lib/author";
import { LAST_REVIEWED_ISO } from "@/lib/site-facts";
import { TeamByline } from "@/components/TeamByline";

export const metadata: Metadata = {
  title: { absolute: "About SNReady" },
  description:
    "How the ServiceNow practice questions are written and reviewed, and what SNReady is not: not affiliated with ServiceNow, and not real exam questions.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: { absolute: "About SNReady" },
    description: "How the SNReady practice questions are written and reviewed.",
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About SNReady",
    url: "https://snready.com/about",
    dateModified: LAST_REVIEWED_ISO,
    mainEntity: { "@context": "https://schema.org", ...authorJsonLd() },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">About</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">About SNReady</h1>
        <TeamByline reviewed={LAST_REVIEWED_ISO} className="mt-4" />

        <section id="who-we-are" className="mt-10 space-y-5 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">The SNReady team</h2>
          <p>
            SNReady is an independent study resource for ServiceNow certification exams. SNReady aims to explain <em>why</em> an answer is right and tie it back to ServiceNow&apos;s own documentation.
          </p>
          <p>
            The long-form guides on this site (the certification overviews, the <Link href="/certification-paths" className="text-emerald-700 underline dark:text-emerald-300">certification paths</Link> page and the <Link href="/courses" className="text-emerald-700 underline dark:text-emerald-300">architecture courses</Link>) are reviewed by the SNReady team and show the date they were last reviewed.
          </p>
        </section>

        <section id="how-questions-are-made" className="mt-14 space-y-5 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">How the questions are written and reviewed</h2>
          <ol className="list-decimal space-y-4 pl-6">
            <li>
              <strong>Start from the official scope.</strong> Each certification&apos;s topics follow the domains and objectives in ServiceNow&apos;s published exam blueprint for that exam, and the facts come from ServiceNow&apos;s product documentation and Now Learning material.
            </li>
            <li>
              <strong>AI-assisted drafting.</strong> Questions and explanations are drafted with the help of AI models, working from those blueprints and documentation pages. We say this plainly because it matters for how you should use them.
            </li>
            <li>
              <strong>Review before publishing.</strong> Drafts are reviewed against the documentation before they are published, and our question standard requires every explanation to link to an official ServiceNow source. Older questions don&apos;t all meet that standard yet; we are adding documentation citations question by question.
            </li>
          </ol>
        </section>

        <section id="what-snready-is-not" className="mt-14 space-y-5 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">What SNReady is not</h2>
          <ul className="list-disc space-y-3 pl-6">
            <li>
              <strong>Not real exam questions.</strong> SNReady questions are original practice questions. They are not copied from, and do not reproduce, ServiceNow certification exams, and we don&apos;t sell exam dumps.
            </li>
            <li>
              <strong>Not affiliated with ServiceNow.</strong> SNReady is an independent study resource. ServiceNow, Now Learning and the certification names are trademarks of ServiceNow, Inc.
            </li>
            <li>
              <strong>Not a guarantee.</strong> Practice scores are a study signal. ServiceNow doesn&apos;t publish its cut scores, so no practice score maps exactly to a pass.
            </li>
          </ul>
        </section>

        <section className="mt-14 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">Start here</h2>
          <ul className="mt-3 space-y-2 text-base">
            <li><Link href="/csa" className="text-emerald-700 underline dark:text-emerald-300">CSA exam overview and free CSA practice questions</Link></li>
            <li><Link href="/cis-df" className="text-emerald-700 underline dark:text-emerald-300">CIS-Data Foundations exam overview</Link></li>
            <li><Link href="/cad" className="text-emerald-700 underline dark:text-emerald-300">CAD exam overview</Link></li>
            <li><Link href="/certification-paths" className="text-emerald-700 underline dark:text-emerald-300">Which ServiceNow certification to take next</Link></li>
          </ul>
        </section>
      </article>
    </>
  );
}
