import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { LEGAL_UPDATED_ISO, SUPPORT_EMAIL } from "@/lib/legal";
import {
  INDIVIDUAL_GUARANTEE_COPY,
  INDIVIDUAL_GUARANTEE_DAYS,
  INDIVIDUAL_GUARANTEE_SCOPE,
  INDIVIDUAL_GUARANTEE_TITLE,
} from "@/lib/purchase-guarantee";

export const metadata: Metadata = {
  title: { absolute: "Refund Policy | SNReady" },
  description:
    "SNReady's refund policy: individual certification purchases can be refunded in full if you didn't pass, or on request at any time, no questions asked. The All Access plan is excluded.",
  alternates: { canonical: "/refunds" },
  openGraph: {
    title: { absolute: "Refund Policy | SNReady" },
    description: "Individual certification purchases: pass your exam or your money back.",
    url: "/refunds",
    type: "website",
  },
};

const mail = <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;

export default function RefundsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "SNReady Refund Policy",
    url: "https://snready.com/refunds",
    dateModified: LEGAL_UPDATED_ISO,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LegalPage
        eyebrow="Legal"
        title="Refund policy"
        intro={<>
          <p><strong>{INDIVIDUAL_GUARANTEE_TITLE}</strong></p>
          <p className="mt-3">{INDIVIDUAL_GUARANTEE_COPY}</p>
          <p className="mt-3">{INDIVIDUAL_GUARANTEE_SCOPE}</p>
        </>}
      >
        <h2>What this covers</h2>
        <ul>
          <li>Purchases of a single, individual certification on SNReady.</li>
          <li>It does not cover the All Access plan, which unlocks every paid certification.</li>
          <li>The CSA practice questions are free, so there is nothing to refund there.</li>
        </ul>

        <h2>How to get a refund</h2>
        <ul>
          <li><strong>Reply to our check-in email.</strong> {INDIVIDUAL_GUARANTEE_DAYS} days after you buy an individual certification, we email you to ask whether you passed. If you didn&apos;t, reply &ldquo;no&rdquo; and we will refund that purchase in full. No form or proof is needed.</li>
          <li><strong>Or ask us at any time.</strong> You don&apos;t have to wait for the email. Write to {mail} from the email address you used at checkout and ask for a refund. No questions asked.</li>
          <li>If you turned off customer follow-up emails, you won&apos;t get the check-in email, but you can still ask for a refund by email at any time.</li>
        </ul>

        <h2>Your access after a refund</h2>
        <p>A refund does not remove your access. You keep the questions you bought, including future updates, for as long as SNReady operates.</p>

        <h2>How refunds are paid</h2>
        <p>Payments are processed by Stripe, and refunds go back to the card or payment method you used. How long the money takes to appear depends on your bank or card issuer.</p>

        <h2>Questions</h2>
        <p>Email {mail}. See also our <Link href="/terms">terms of service</Link> and <Link href="/pricing">pricing</Link>.</p>
      </LegalPage>
    </>
  );
}
