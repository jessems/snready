import { Metadata } from "next";
import Link from "next/link";
import {
  getAllCertifications,
  getTotalQuestionCount,
  getTotalFreeQuestionCount,
} from "@/lib/data";

// Simple check and X icons
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Pricing - ServiceNow Practice Tests | SNReady",
  description:
    "Get lifetime access to ServiceNow certification practice questions for just $9 per certification. No subscriptions, no renewals. Compare our value vs Udemy, brain dumps, and official training.",
  keywords: [
    "snready pricing",
    "servicenow practice test cost",
    "servicenow certification practice price",
    "cheap servicenow practice tests",
    "servicenow exam prep cost",
    "udemy servicenow alternative",
  ],
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "SNReady Pricing - $9 Lifetime Access per Certification",
    description:
      "Practice for your ServiceNow certification exam without breaking the bank. $9 gets you lifetime access to 60-200+ questions per certification.",
  },
};

export default function PricingPage() {
  const certifications = getAllCertifications();
  const readyCerts = certifications.filter((c) => c.isReady);
  const totalQuestions = readyCerts.reduce(
    (sum, cert) => sum + getTotalQuestionCount(cert.slug),
    0
  );
  const totalFreeQuestions = readyCerts.reduce(
    (sum, cert) => sum + getTotalFreeQuestionCount(cert.slug),
    0
  );

  // JSON-LD for FAQ schema
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does SNReady cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SNReady costs $9 per certification for lifetime access. This is a one-time payment with no subscriptions or renewals. You get access to all questions, explanations, mock exams, and future updates for that certification forever.",
        },
      },
      {
        "@type": "Question",
        name: "Is there a free trial?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes! Each certification includes 15 free practice questions so you can try before you buy. We currently have ${totalFreeQuestions} free questions across all certifications.`,
        },
      },
      {
        "@type": "Question",
        name: "Do I need to pay again when ServiceNow releases a new version?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Your $9 payment gives you lifetime access including all future updates. When ServiceNow releases new versions (like Xanadu, Yokohama, etc.), we update the questions and you get access automatically.",
        },
      },
      {
        "@type": "Question",
        name: "How is SNReady different from Udemy courses?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Unlike Udemy courses that quickly become outdated, SNReady questions are generated directly from official ServiceNow Now Learning content. This means our questions reflect what's actually on the exam. Plus, at $9 vs $50-100+ for Udemy courses, we're significantly cheaper.",
        },
      },
      {
        "@type": "Question",
        name: "Are these brain dumps or exam dumps?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. SNReady does NOT sell brain dumps or leaked exam questions. Our questions are generated from official ServiceNow training materials to help you learn the concepts that will be tested. We believe in helping you actually understand the material, not just memorize answers.",
        },
      },
      {
        "@type": "Question",
        name: "What certifications are available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `We currently have practice questions for ${readyCerts.length} ServiceNow certifications including CSA, CAD, and all 17 CIS certifications (CIS-ITSM, CIS-DF, CIS-CSM, CIS-Discovery, and more).`,
        },
      },
      {
        "@type": "Question",
        name: "Can I get a refund?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We offer a 7-day money-back guarantee. If you're not satisfied with the quality of questions, contact us within 7 days of purchase for a full refund.",
        },
      },
    ],
  };

  // JSON-LD for Product schema
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "SNReady ServiceNow Practice Tests",
    description:
      "Practice questions for ServiceNow certification exams generated from official Now Learning content",
    brand: {
      "@type": "Brand",
      name: "SNReady",
    },
    offers: {
      "@type": "Offer",
      price: "9.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2027-12-31",
      url: "https://snready.com/pricing",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "50",
      bestRating: "5",
    },
  };

  return (
    <div className="min-h-screen">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-16 dark:from-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Simple, Honest Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            One price. Lifetime access. No subscriptions, no renewals, no
            surprises.
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mx-auto max-w-md">
            <div className="rounded-2xl border-2 border-emerald-500 bg-white p-8 shadow-lg dark:bg-zinc-900">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Per Certification
                </h2>
                <div className="mt-4 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    $9
                  </span>
                  <span className="text-lg text-zinc-500 dark:text-zinc-400">
                    one-time
                  </span>
                </div>
                <p className="mt-2 text-emerald-600 font-medium">
                  Lifetime access
                </p>
              </div>

              <ul className="mt-8 space-y-3">
                {[
                  "60-200+ practice questions per certification",
                  "Detailed explanations for every answer",
                  "Full mock exams with timer",
                  "Personalized study plan generator",
                  "Domain-based study mode",
                  "Covers latest ServiceNow release (Xanadu)",
                  "Free updates when new versions release",
                  "7-day money-back guarantee",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 flex-shrink-0 text-emerald-500 mt-0.5" />
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/certifications"
                className="mt-8 block w-full rounded-lg bg-emerald-600 py-3 text-center font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Browse Certifications
              </Link>

              <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
                {totalFreeQuestions}+ free questions available — try before you
                buy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-zinc-50 mb-12">
            How We Compare
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="py-4 pr-4 font-semibold text-zinc-900 dark:text-zinc-50">
                    Feature
                  </th>
                  <th className="py-4 px-4 font-semibold text-emerald-600">
                    SNReady
                  </th>
                  <th className="py-4 px-4 font-semibold text-zinc-500">
                    Udemy Courses
                  </th>
                  <th className="py-4 px-4 font-semibold text-zinc-500">
                    Brain Dumps
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                <tr>
                  <td className="py-4 pr-4 text-zinc-700 dark:text-zinc-300">
                    Price
                  </td>
                  <td className="py-4 px-4 text-emerald-600 font-semibold">
                    $9 lifetime
                  </td>
                  <td className="py-4 px-4 text-zinc-500">$50-100+</td>
                  <td className="py-4 px-4 text-zinc-500">$20-50</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-zinc-700 dark:text-zinc-300">
                    Content Source
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-emerald-600">
                      Official Now Learning
                    </span>
                  </td>
                  <td className="py-4 px-4 text-zinc-500">Varies by creator</td>
                  <td className="py-4 px-4 text-zinc-500">Leaked exam Qs</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-zinc-700 dark:text-zinc-300">
                    Updated for New Releases
                  </td>
                  <td className="py-4 px-4">
                    <CheckIcon className="h-5 w-5 text-emerald-500" />
                  </td>
                  <td className="py-4 px-4">
                    <XIcon className="h-5 w-5 text-red-400" />
                  </td>
                  <td className="py-4 px-4">
                    <XIcon className="h-5 w-5 text-red-400" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-zinc-700 dark:text-zinc-300">
                    Actually Helps You Learn
                  </td>
                  <td className="py-4 px-4">
                    <CheckIcon className="h-5 w-5 text-emerald-500" />
                  </td>
                  <td className="py-4 px-4">
                    <CheckIcon className="h-5 w-5 text-emerald-500" />
                  </td>
                  <td className="py-4 px-4">
                    <XIcon className="h-5 w-5 text-red-400" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-zinc-700 dark:text-zinc-300">
                    Risk to Certification
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-emerald-600">None</span>
                  </td>
                  <td className="py-4 px-4 text-zinc-500">None</td>
                  <td className="py-4 px-4 text-red-500 font-medium">
                    Ban risk
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-zinc-700 dark:text-zinc-300">
                    Mock Exam Mode
                  </td>
                  <td className="py-4 px-4">
                    <CheckIcon className="h-5 w-5 text-emerald-500" />
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-zinc-500">Sometimes</span>
                  </td>
                  <td className="py-4 px-4">
                    <XIcon className="h-5 w-5 text-red-400" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-zinc-700 dark:text-zinc-300">
                    Detailed Explanations
                  </td>
                  <td className="py-4 px-4">
                    <CheckIcon className="h-5 w-5 text-emerald-500" />
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-zinc-500">Varies</span>
                  </td>
                  <td className="py-4 px-4">
                    <XIcon className="h-5 w-5 text-red-400" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-zinc-700 dark:text-zinc-300">
                    Study Plan Generator
                  </td>
                  <td className="py-4 px-4">
                    <CheckIcon className="h-5 w-5 text-emerald-500" />
                  </td>
                  <td className="py-4 px-4">
                    <XIcon className="h-5 w-5 text-red-400" />
                  </td>
                  <td className="py-4 px-4">
                    <XIcon className="h-5 w-5 text-red-400" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-zinc-50 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            {[
              {
                q: "How much does SNReady cost?",
                a: "SNReady costs $9 per certification for lifetime access. This is a one-time payment — no subscriptions, no renewals. You get access to all questions, explanations, mock exams, and future updates for that certification forever.",
              },
              {
                q: "Is there a free trial?",
                a: `Yes! Each certification includes 15 free practice questions so you can evaluate the quality before purchasing. We currently have ${totalFreeQuestions}+ free questions across all certifications.`,
              },
              {
                q: "Do I need to pay again when ServiceNow releases a new version?",
                a: "No. Your $9 payment gives you lifetime access including all future updates. When ServiceNow releases new versions (like Xanadu, Yokohama, etc.), we update the questions and you get access automatically at no additional cost.",
              },
              {
                q: "How is SNReady different from Udemy courses?",
                a: "Unlike Udemy courses that quickly become outdated (many are still on Washington or older releases), SNReady questions are generated directly from official ServiceNow Now Learning content and updated for each major release. Plus, at $9 vs $50-100+ for quality Udemy courses, we're significantly more affordable.",
              },
              {
                q: "Are these brain dumps or leaked exam questions?",
                a: "Absolutely not. SNReady does NOT sell brain dumps or leaked exam questions. Using brain dumps violates ServiceNow's certification agreement and can result in permanent certification bans. Our questions are generated from official training materials to help you learn the concepts — not memorize answers to specific questions.",
              },
              {
                q: "What certifications do you support?",
                a: `We currently have practice questions for ${readyCerts.length} ServiceNow certifications: CSA, CAD, and all 17 CIS certifications including CIS-ITSM, CIS-DF, CIS-CSM, CIS-Discovery, CIS-HR, CIS-HAM, CIS-SAM, and more.`,
              },
              {
                q: "How many questions are included?",
                a: `Each certification includes 60-200+ practice questions covering all exam domains. In total, we have ${totalQuestions}+ questions across all certifications.`,
              },
              {
                q: "Can I get a refund?",
                a: "Yes. We offer a 7-day money-back guarantee. If you're not satisfied with the quality of questions, contact us within 7 days of purchase for a full refund, no questions asked.",
              },
            ].map((faq) => (
              <div key={faq.q}>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {faq.q}
                </h3>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-emerald-50 dark:bg-emerald-950/20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Ready to Start Practicing?
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Pick your certification and try the free questions. No account
            required.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/csa/practice-questions"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Try CSA Questions Free
            </Link>
            <Link
              href="/certifications"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Browse All Certifications
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
