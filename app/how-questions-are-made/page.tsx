import type { Metadata } from "next";
import Link from "next/link";
import { authorJsonLd } from "@/lib/author";
import { getAllCertifications, getAllQuestionsForCertification, isCertificationReady } from "@/lib/data";
import { METHODOLOGY_UPDATED_ISO } from "@/lib/site-facts";
import { TeamByline } from "@/components/TeamByline";
import questionChangelog from "@/data/question-changelog.json";

interface ChangelogEntry {
  date: string;
  certification: string;
  summary: string;
  counts: Record<string, number | undefined>;
  changes: string[];
}

const changelogEntries = questionChangelog.entries as ChangelogEntry[];

const CHANGELOG_COUNT_LABELS: Record<string, string> = {
  freeQuestionsBefore: "free questions before",
  rewritten: "rewritten",
  answersCorrected: "answers corrected",
  duplicatesRemoved: "duplicates removed",
  linksFixed: "doc links fixed",
  flaggedUnchanged: "flagged, left unchanged",
};

function formatChangelogDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export const metadata: Metadata = {
  title: { absolute: "How SNReady questions are made" },
  description:
    "How SNReady practice questions are drafted with AI against ServiceNow documentation and exam blueprints, how they are checked, how many have been reviewed, and how to report an error.",
  alternates: { canonical: "/how-questions-are-made" },
  openGraph: {
    title: { absolute: "How SNReady questions are made" },
    description: "AI-assisted drafts, written against ServiceNow documentation and exam blueprints. How they are checked and updated.",
    url: "/how-questions-are-made",
    type: "article",
  },
};

const linkClass = "text-emerald-700 underline dark:text-emerald-300";

/** Review and citation counts across every published question, computed at build time. */
async function getQuestionBankStatus() {
  let total = 0;
  let reviewed = 0;
  let cited = 0;
  for (const cert of getAllCertifications()) {
    if (!isCertificationReady(cert.slug)) continue;
    for (const q of await getAllQuestionsForCertification(cert.slug)) {
      total++;
      if (q.meta?.reviewed === true) reviewed++;
      const text = JSON.stringify([q.explanation, q.references ?? []]);
      if (/https?:\/\/[^"\s]*servicenow\.com/.test(text)) cited++;
    }
  }
  return { total, reviewed, cited };
}

export default async function HowQuestionsAreMadePage() {
  const { total, reviewed, cited } = await getQuestionBankStatus();
  const fmt = (n: number) => n.toLocaleString("en-US");
  const reviewedSentence = reviewed === 0
    ? `none of the ${fmt(total)} published questions had been individually reviewed by a person yet`
    : `${fmt(reviewed)} of the ${fmt(total)} published questions had been individually reviewed by a person`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "How SNReady questions are made",
    url: "https://snready.com/how-questions-are-made",
    dateModified: METHODOLOGY_UPDATED_ISO,
    author: authorJsonLd(),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Methodology</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">How SNReady questions are made</h1>
        <TeamByline reviewed={METHODOLOGY_UPDATED_ISO} className="mt-4" />

        <section className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-base leading-7 text-zinc-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-zinc-200">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">The short version</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>SNReady practice questions are <strong>AI-assisted drafts</strong>, written against ServiceNow&apos;s official product documentation and published exam blueprints.</li>
            <li>Every question passes automated checks before it is published. Individual human review is still in progress: when this page was built, {reviewedSentence}.</li>
            <li>They are original practice questions, not copied from ServiceNow&apos;s certification exams.</li>
            <li>If you find a mistake, <Link href="/feedback" className={linkClass}>report it</Link> and we will check it against the documentation.</li>
          </ul>
        </section>

        <section id="sources" className="mt-14 space-y-5 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">What the questions are written against</h2>
          <p>
            <strong>Exam blueprints.</strong> Each certification&apos;s topics and topic weights follow ServiceNow&apos;s published exam blueprint for that exam (see{" "}
            <Link href="/exam-blueprints" className={linkClass}>exam blueprints</Link>). Questions are written to test the objectives listed there.
          </p>
          <p>
            <strong>ServiceNow documentation.</strong> The facts in each question and explanation come from ServiceNow&apos;s own published material: product documentation and release notes, and for many older questions, ServiceNow training content. For delta exams, questions are written against the release notes for that release.
          </p>
          <p>
            We do not use questions from ServiceNow&apos;s certification exams. Sharing exam content breaks ServiceNow&apos;s certification agreement, and practice questions are only useful if they teach the concept rather than an answer.
          </p>
        </section>

        <section id="drafting" className="mt-14 space-y-5 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">How drafts are produced</h2>
          <p>
            Questions, answer options and explanations are drafted with AI models, working from a blueprint objective and the relevant documentation. We say this plainly because it matters for how you should use them: a draft can be wrong, out of date, or easier to guess than the questions on the exam.
          </p>
          <p>
            Each draft is tagged with its certification and topic and, for most questions, the date it was drafted. Question listings show the date of the newest question on the page.
          </p>
        </section>

        <section id="checks" className="mt-14 space-y-5 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">How questions are checked</h2>
          <p><strong>Automated checks.</strong> Every build checks each question, and the site will not build if one fails:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>every question has a stem, at least two answer options and an explanation of the correct answer;</li>
            <li>every correct answer matches one of the options;</li>
            <li>each question belongs to the certification and topic it is listed under.</li>
          </ul>
          <p>Our test suite also rejects duplicate question IDs and duplicate answer-option IDs. These checks catch broken questions; they cannot tell whether an answer is technically right.</p>
          <p>
            <strong>Source links.</strong> Our standard is that every explanation links to an official ServiceNow source. Not every question meets it yet: when this page was built, {fmt(cited)} of {fmt(total)} explanations linked to a servicenow.com page. Many older explanations link to ServiceNow training pages rather than product documentation, and we are replacing those links with documentation links. Newer sets, such as the Brazil delta questions, link to the documentation or release notes they were written against.
          </p>
          <p>
            <strong>Human review.</strong> A question counts as reviewed only when a person has checked the question, every option and the explanation against current ServiceNow documentation, and it is marked as reviewed in our data. When this page was built, {reviewedSentence}. Pages that list unreviewed questions say so next to the date, instead of showing a review date.
          </p>
          <p>
            <strong>Known weaknesses we are fixing.</strong> In older question sets the correct answer is not spread evenly across the option letters, the longest option is too often the right one, some questions are near-duplicates, and some reference earlier ServiceNow releases. Treat a practice score as a study signal, not a prediction of your exam result.
          </p>
        </section>

        <section id="changelog" className="mt-14 space-y-5 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">Question changelog</h2>
          <p>Dated corrections and rewrites to published questions, newest first.</p>
          {changelogEntries.map((entry, index) => (
            <div key={`${entry.date}-${entry.certification}-${index}`} className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
                <time dateTime={entry.date}>{formatChangelogDate(entry.date)}</time> · {entry.certification.toUpperCase()}
              </h3>
              <p className="mt-2 text-base leading-7">{entry.summary}</p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {Object.entries(entry.counts)
                  .filter(([key, value]) => key in CHANGELOG_COUNT_LABELS && typeof value === "number")
                  .map(([key, value]) => `${value} ${CHANGELOG_COUNT_LABELS[key]}`)
                  .join(" · ")}
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-6 text-base leading-7">
                {entry.changes.map((change) => (
                  <li key={change}>{change}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section id="report-an-error"className="mt-14 space-y-5 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">How to report an error</h2>
          <p>
            If a question, answer or explanation looks wrong, see{" "}
            <Link href="/feedback" className={linkClass}>report an error</Link>. Tell us the certification, the first few words of the question, what you think is wrong and, if you can, a link to the ServiceNow documentation that supports it. We check each report against the documentation and correct or remove the question if it is wrong.
          </p>
        </section>

        <section id="updates" className="mt-14 space-y-5 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">Update policy</h2>
          <ul className="list-disc space-y-3 pl-6">
            <li>When ServiceNow ships a new family release or changes an exam blueprint, we check the affected topics, add or rewrite questions, and remove questions that no longer apply.</li>
            <li>When a delta exam opens for a release, we publish delta practice questions written against that release&apos;s notes.</li>
            <li>Reported errors are corrected or the question is removed.</li>
            <li>Updates are included for anyone who has bought access; there is nothing extra to pay.</li>
            <li>This page is updated when the process or the review status changes. The date at the top shows when it last changed.</li>
          </ul>
        </section>

        <section className="mt-14 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">Related</h2>
          <ul className="mt-3 space-y-2 text-base">
            <li><Link href="/about" className={linkClass}>About SNReady</Link>, including what SNReady is not</li>
            <li><Link href="/practice-questions" className={linkClass}>Practice questions by certification</Link></li>
            <li><Link href="/exam-blueprints" className={linkClass}>Official ServiceNow exam blueprints</Link></li>
          </ul>
        </section>
      </article>
    </>
  );
}
