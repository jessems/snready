import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { LEGAL_UPDATED_ISO, SUPPORT_EMAIL } from "@/lib/legal";

export const metadata: Metadata = {
  title: { absolute: "Terms of Service | SNReady" },
  description:
    "The terms for using SNReady: free and paid ServiceNow practice questions, one-time purchases through Stripe, lifetime access, acceptable use and the limits of what practice questions can promise.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: { absolute: "Terms of Service | SNReady" },
    description: "The terms for using SNReady's ServiceNow practice questions.",
    url: "/terms",
    type: "website",
  },
};

const mail = <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;

export default function TermsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "SNReady Terms of Service",
    url: "https://snready.com/terms",
    dateModified: LEGAL_UPDATED_ISO,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LegalPage
        eyebrow="Legal"
        title="Terms of service"
        intro={<p>These terms apply when you use snready.com (&ldquo;SNReady&rdquo;), which is operated by SNReady (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By using the site or buying access, you agree to them. If you don&apos;t agree, please don&apos;t use the site.</p>}
      >
        <h2>What SNReady is</h2>
        <ul>
          <li>SNReady is an independent study resource with practice questions, mock exams and guides for ServiceNow certification exams.</li>
          <li>SNReady is not affiliated with, endorsed by or sponsored by ServiceNow. ServiceNow and related names are trademarks of ServiceNow, Inc.</li>
          <li>Our questions are original practice questions written against ServiceNow documentation and published exam blueprints. They are not copied from ServiceNow exams. They are drafted with AI assistance and checked as described on <Link href="/how-questions-are-made">How questions are made</Link>. They may contain mistakes; if you find one, tell us.</li>
          <li>Practice questions help you prepare. They do not guarantee that you will pass an exam. Our only promise about exam results is the refund described in our <Link href="/refunds">refund policy</Link>.</li>
        </ul>

        <h2>Free and paid content</h2>
        <ul>
          <li>Some content is free to everyone, including all CSA practice questions and a set of free questions for other certifications. You don&apos;t need an account to use free content.</li>
          <li>Other content requires a one-time purchase, either for an individual certification or for the All Access plan. Current prices are shown on the <Link href="/pricing">pricing page</Link> and at checkout. There is no subscription and no automatic renewal.</li>
          <li>Payments are processed by Stripe. Your purchase is linked to the email address you enter at checkout, and you sign in with a link sent to that address.</li>
          <li>&ldquo;Lifetime access&rdquo; means your access to the content you bought does not expire and includes future updates to that content, for as long as SNReady operates the service.</li>
        </ul>

        <h2>Refunds</h2>
        <p>Refunds are covered by our <Link href="/refunds">refund policy</Link>. A refund does not remove your access to the content you bought. Nothing in these terms limits any rights you have under consumer law.</p>

        <h2>Your account and acceptable use</h2>
        <p>Your access is for your own personal study. Please don&apos;t:</p>
        <ul>
          <li>share your sign-in or access with other people;</li>
          <li>copy, republish, resell or redistribute paid questions, explanations or other site content;</li>
          <li>scrape the site or use automated tools to download content in bulk;</li>
          <li>try to get around access controls or interfere with the site.</li>
        </ul>
        <p>We may suspend access that breaks these rules. You must also follow ServiceNow&apos;s own certification rules; never share real exam content with us or anyone else.</p>

        <h2>Our content</h2>
        <p>The questions, explanations, guides and design of SNReady belong to SNReady or its licensors. Links to ServiceNow documentation and other third-party sites are provided for your convenience; we are not responsible for their content.</p>

        <h2>Disclaimers and liability</h2>
        <p>To the extent the law allows, SNReady is provided &ldquo;as is&rdquo;, without warranties of any kind, and we are not liable for indirect or consequential losses, including a failed exam attempt or exam fees. Where the law allows us to limit our liability, our total liability to you is limited to the amount you paid us. Nothing in these terms excludes liability that cannot be excluded by law.</p>

        <h2>Privacy</h2>
        <p>How we handle your data is explained in our <Link href="/privacy">privacy policy</Link>.</p>

        <h2>Changes</h2>
        <p>We may update these terms. When we do, we will change the date at the top of this page. Changes do not take away access you have already paid for.</p>

        <h2>Governing law</h2>
        <p>These terms are governed by the laws of Switzerland, and the courts of Switzerland have jurisdiction over any dispute about them. This does not take away any mandatory consumer protection you have under the law of the country where you live.</p>

        <h2>Contact</h2>
        <p>Questions about these terms: {mail}.</p>
      </LegalPage>
    </>
  );
}
