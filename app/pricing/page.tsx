import { Metadata } from "next";
import Link from "next/link";
import { CheckoutButton } from "@/components/CheckoutButton";
import { getAllCertifications, getTotalQuestionCount } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pricing - SNReady ServiceNow Practice Tests",
  description:
    "Affordable ServiceNow certification practice tests. $9 per certification or $49 for lifetime access to all certifications. Free questions available.",
  keywords: [
    "ServiceNow practice test price",
    "SNReady pricing",
    "ServiceNow certification cost",
    "CSA practice test price",
    "ServiceNow exam prep pricing",
  ],
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingPage() {
  const certifications = getAllCertifications();
  const readyCerts = certifications.filter((c) => c.isReady);
  const totalQuestions = readyCerts.reduce(
    (sum, cert) => sum + getTotalQuestionCount(cert.slug),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-zinc-900 dark:to-zinc-950">
      {/* Hero */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Pay once, access forever. No subscriptions, no recurring fees.
            Start with free questions to see the quality before you buy.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Free Tier */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Free
                </h2>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-zinc-900 dark:text-zinc-50">
                    $0
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Forever free
                </p>
              </div>

              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    5 free questions per topic
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    All {readyCerts.length} certifications
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Detailed explanations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Glossary & study guides
                  </span>
                </li>
                <li className="flex items-start gap-3 opacity-50">
                  <span className="text-zinc-400">✗</span>
                  <span className="text-zinc-500 dark:text-zinc-500">
                    Full question bank
                  </span>
                </li>
                <li className="flex items-start gap-3 opacity-50">
                  <span className="text-zinc-400">✗</span>
                  <span className="text-zinc-500 dark:text-zinc-500">
                    Timed mock exams
                  </span>
                </li>
              </ul>

              <div className="mt-8">
                <Link
                  href="/certifications"
                  className="block w-full rounded-lg border border-zinc-300 bg-white py-3 text-center font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Start Free
                </Link>
              </div>
            </div>

            {/* Single Certification */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Single Certification
                </h2>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-zinc-900 dark:text-zinc-50">
                    $9
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  One-time payment
                </p>
              </div>

              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    All questions for 1 cert
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Detailed explanations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Timed mock exams
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Lifetime access
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Future question updates
                  </span>
                </li>
              </ul>

              <div className="mt-8">
                <Link
                  href="/certifications"
                  className="block w-full rounded-lg bg-zinc-900 py-3 text-center font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Choose Certification
                </Link>
              </div>
            </div>

            {/* All Access */}
            <div className="relative rounded-2xl border-2 border-emerald-500 bg-white p-8 dark:bg-zinc-900">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-emerald-500 px-4 py-1 text-sm font-medium text-white">
                  Best Value
                </span>
              </div>

              <div className="text-center">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  All Certifications
                </h2>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-emerald-600">
                    $49
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  One-time payment
                </p>
              </div>

              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    <strong>{totalQuestions.toLocaleString()}+</strong> questions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    All {readyCerts.length} certifications
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Timed mock exams
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Lifetime access
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    All future certifications
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Priority support
                  </span>
                </li>
              </ul>

              <div className="mt-8">
                <CheckoutButton
                  plan="lifetime"
                  className="block w-full rounded-lg bg-emerald-600 py-3 text-center font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Get All Access
                </CheckoutButton>
              </div>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-6 py-3 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
              <span className="text-xl">🛡️</span>
              <span className="font-medium">
                30-day money-back guarantee — no questions asked
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Frequently Asked Questions
          </h2>

          <div className="mt-10 space-y-8">
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                How long does access last?
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Forever. All purchases are one-time payments with lifetime
                access. No subscriptions, no renewals.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Do I get access to future updates?
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Yes! When ServiceNow releases new versions, we update our
                questions. Your purchase includes all future updates for the
                certification(s) you purchased.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                What&apos;s included in the All Certifications plan?
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Everything. All {readyCerts.length} current certifications plus
                any new certifications we add in the future. It&apos;s the best
                value if you plan to pursue multiple ServiceNow certifications.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Can I try before I buy?
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Absolutely. Every certification has free practice questions —
                typically 3-5 per topic. Try them out to see our question
                quality and explanations before purchasing.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                What if I don&apos;t pass?
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                We offer a 30-day money-back guarantee. If you&apos;re not
                satisfied for any reason, contact us for a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Ready to pass your ServiceNow certification?
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Join thousands of ServiceNow professionals who use SNReady to
            prepare for their exams.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/certifications"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-600 px-8 text-base font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Browse Certifications
            </Link>
            <Link
              href="/csa/practice-questions"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-8 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Try Free Questions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
