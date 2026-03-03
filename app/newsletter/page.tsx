import { Metadata } from "next";
import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";

export const metadata: Metadata = {
  title: "ServiceNow Certification Newsletter - Free Study Tips & Updates",
  description:
    "Get weekly ServiceNow certification tips, exam updates, and study strategies delivered to your inbox. Plus a free CSA study checklist when you subscribe.",
  alternates: {
    canonical: "/newsletter",
  },
  openGraph: {
    title: "ServiceNow Certification Newsletter - Free Study Tips",
    description:
      "Weekly tips, exam updates, and a free CSA study checklist when you subscribe.",
    type: "website",
  },
};

export default function NewsletterPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What will I receive in the newsletter?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Weekly tips on ServiceNow certifications, exam updates, study strategies, and exclusive content not published on the blog.",
        },
      },
      {
        "@type": "Question",
        name: "How often do you send emails?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Once per week, usually on Tuesdays. We never spam.",
        },
      },
      {
        "@type": "Question",
        name: "Can I unsubscribe?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, every email includes an unsubscribe link. No questions asked.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <li>
              <Link href="/" className="hover:text-emerald-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-zinc-900 dark:text-zinc-100">Newsletter</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <span>📬</span> Free Weekly Tips
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100">
            Pass Your ServiceNow Exam
            <span className="block text-emerald-600">With Confidence</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Join 500+ ServiceNow professionals getting weekly certification tips, exam updates, 
            and study strategies that actually work.
          </p>
        </div>

        {/* Signup Form */}
        <div className="mx-auto mt-10 max-w-md">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
            <NewsletterSignup
              variant="stacked"
              heading="Get the weekly newsletter"
              description="Plus a free CSA Study Checklist when you subscribe."
              buttonText="Send Me the Checklist"
            />
          </div>
        </div>

        {/* What You Get */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            What You&apos;ll Get Every Week
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
              <div className="mb-4 text-3xl">📚</div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Study Strategies
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Proven techniques from people who passed. What works, what doesn&apos;t, 
                and how to avoid common mistakes.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
              <div className="mb-4 text-3xl">🎯</div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Exam Updates
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Stay current on exam changes, new certifications, and updates 
                to the ServiceNow platform.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
              <div className="mb-4 text-3xl">💡</div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Quick Tips
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Bite-sized insights you can apply immediately. 
                Perfect for busy professionals.
              </p>
            </div>
          </div>
        </div>

        {/* Free Checklist CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center text-white sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Free CSA Study Checklist
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-emerald-100">
            Subscribe now and get our comprehensive CSA study checklist — 
            the same framework that helped hundreds pass their first ServiceNow certification.
          </p>
          <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-emerald-100">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-300">✓</span>
              <span>Week-by-week study plan</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-300">✓</span>
              <span>Essential topics checklist</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-300">✓</span>
              <span>Resource recommendations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-300">✓</span>
              <span>Common mistakes to avoid</span>
            </li>
          </ul>
          <div className="mx-auto mt-8 max-w-sm rounded-xl bg-white/10 p-6 backdrop-blur-sm">
            <NewsletterSignup
              variant="stacked"
              buttonText="Get Free Checklist"
              className="text-white [&_input]:border-white/20 [&_input]:bg-white/10 [&_input]:text-white [&_input]:placeholder-white/60 [&_input:focus]:border-white/40 [&_button]:bg-white [&_button]:text-emerald-700 [&_button:hover]:bg-emerald-50"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Frequently Asked Questions
          </h2>

          <div className="mt-8 space-y-6">
            <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                What will I receive in the newsletter?
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Weekly tips on ServiceNow certifications, exam updates, study strategies, 
                and exclusive content not published on the blog. We focus on actionable 
                advice that helps you pass.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                How often do you send emails?
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Once per week, usually on Tuesdays. We never spam. Quality over quantity.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Can I unsubscribe?
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Absolutely. Every email includes an unsubscribe link at the bottom. 
                One click and you&apos;re out. No questions asked, no hard feelings.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Is it really free?
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                100% free. The newsletter and CSA checklist cost nothing. We also 
                offer premium practice tests if you want more in-depth preparation.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">
            Ready to start your ServiceNow certification journey?
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/certifications"
              className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Browse Free Questions
            </Link>
            <Link
              href="/certification-paths"
              className="rounded-lg border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Explore Career Paths
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
