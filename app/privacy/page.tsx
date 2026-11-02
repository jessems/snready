import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { LEGAL_UPDATED_ISO, SUPPORT_EMAIL } from "@/lib/legal";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy | SNReady" },
  description:
    "What data SNReady collects, why, which services process it (Stripe, Google Analytics and Google Ads, Resend, Cloudflare), how long it is kept, and how to ask for it to be deleted.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: { absolute: "Privacy Policy | SNReady" },
    description: "What data SNReady collects, why, who processes it, and how to ask for deletion.",
    url: "/privacy",
    type: "website",
  },
};

const mail = <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "SNReady Privacy Policy",
    url: "https://snready.com/privacy",
    dateModified: LEGAL_UPDATED_ISO,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LegalPage
        eyebrow="Legal"
        title="Privacy policy"
        intro={<p>This page explains what information SNReady collects when you use snready.com, why, which services handle it, how long it is kept and how to ask us to delete it. It describes what the site actually does today. You can practise free questions without an account and without giving us your email address.</p>}
      >
        <h2>Who we are</h2>
        <p>SNReady is an independent ServiceNow certification practice site run by the SNReady team. It is not affiliated with ServiceNow. The party responsible for your data is [Business name / address]. For any privacy question or request, email {mail}.</p>

        <h2>What we collect and why</h2>

        <h3>1. When you browse the site</h3>
        <ul>
          <li><strong>Hosting.</strong> The site and its server functions run on Cloudflare Pages. Like any web host, Cloudflare processes your IP address and request details to deliver pages and protect the service.</li>
          <li><strong>Analytics (Google Analytics 4).</strong> We load Google&apos;s <code>gtag.js</code> to measure how the site is used. It records page views (the page address, including any query parameters, and the page title) and events such as starting practice, starting or finishing a mock exam, clicking a recommendation, starting checkout and completing a purchase (plan, certification and price). Google sets its own cookies for this, such as <code>_ga</code> and <code>_ga_&lt;id&gt;</code>.</li>
          <li><strong>Advertising measurement (Google Ads).</strong> The same Google tag is configured for Google Ads so we can tell whether an ad led to a purchase. When you complete a purchase we send a conversion event with the order ID, value and currency. Google may set its own advertising cookies to do this.</li>
          <li><strong>Fonts.</strong> Two typefaces are loaded from Google Fonts (<code>fonts.googleapis.com</code>), so Google receives your IP address and browser details when those files load.</li>
          <li><strong>How you found us.</strong> Your browser stores a small record (<code>snready_attribution</code> in local storage) of the first and most recent page you landed on, the referring site, campaign tags (UTM parameters) and ad click IDs (such as <code>gclid</code>, <code>gbraid</code>, <code>wbraid</code> or <code>msclkid</code>), with timestamps. It expires after 90 days without a new visit. If you start a checkout, this record and your Google Analytics client and session IDs are sent to us and attached to your Stripe checkout session so we can see which pages and campaigns lead to purchases. We also keep daily totals (counts by source, medium, certification and plan, with no personal details).</li>
        </ul>

        <h3>2. When you buy access</h3>
        <ul>
          <li><strong>Payment (Stripe).</strong> Checkout happens on a page hosted by Stripe. You enter your card and email address there; SNReady never sees or stores your card number. Stripe processes your payment under its own privacy policy.</li>
          <li><strong>Your access record.</strong> After payment, Stripe tells us your email address, the Stripe checkout session ID, the plan and the certification you bought. We store your email address with the plan, certification(s), Stripe session ID and purchase time in Cloudflare Workers KV so you can unlock your questions on any device.</li>
        </ul>

        <h3>3. When you sign in</h3>
        <ul>
          <li><strong>Sign-in link email (Resend).</strong> To sign in you enter your email address and we send a one-time sign-in link through our email provider, Resend. The link expires after 15 minutes.</li>
          <li><strong>Account record.</strong> We store your email address with the date your account was created and the time you last signed in.</li>
          <li><strong>Session cookie.</strong> Signing in (or completing a purchase) sets one cookie, <code>snready_session</code>. It is strictly necessary to keep you signed in, is HttpOnly and Secure, and lasts 30 days. A matching session record (your email address and session dates) is stored in Cloudflare Workers KV and deleted automatically after 30 days, or straight away when you sign out.</li>
        </ul>

        <h3>4. Follow-up email and feedback</h3>
        <ul>
          <li>After a purchase we schedule one follow-up email, sent through Resend: 15 days after buying an individual certification (asking whether you passed, see our <Link href="/refunds">refund policy</Link>) or 21 days after buying All Access (asking for feedback). To do this we store your email address, what you bought, the purchase date, the send status and Resend&apos;s message ID.</li>
          <li>Every follow-up email has a link to stop customer follow-ups. If you use it, we store your email address on a do-not-send list so we don&apos;t email you again.</li>
          <li>If you fill in the optional feedback form, we store your answers (whether you took the exam, whether you passed, a 1–5 rating and any comment you write) linked to your purchase. We only feature a comment publicly if you tick the box allowing it.</li>
          <li>If you email us or reply to one of our emails, we keep the conversation so we can help you.</li>
        </ul>

        <h3>5. Salary survey</h3>
        <p>The optional salary form on the salaries pages asks for your role, pay, experience, certifications, education, country and (optionally) city and company details. It does not ask for your name or email address. Submissions are stored in a Cloudflare D1 database and used in aggregate salary statistics.</p>

        <h3>6. Stored only in your browser</h3>
        <p>These items stay on your device and are not sent to us, except as described above:</p>
        <table>
          <thead><tr><th>Key</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>snready_attribution</code></td><td>How you found the site (see above). Expires after 90 days.</td></tr>
            <tr><td><code>snready_mock_exam_*</code>, <code>snready_mock_exam_history</code></td><td>Mock exams in progress and your recent mock exam scores.</td></tr>
            <tr><td><code>snready_checkout_return</code>, <code>snready_checkout_intent</code></td><td>Where to send you back to after checkout. Removed once checkout finishes or is cancelled.</td></tr>
            <tr><td><code>snready_purchase_tracked:*</code></td><td>Stops a purchase from being reported to analytics twice.</td></tr>
            <tr><td><code>snready_salary_submitted</code></td><td>Remembers that you submitted the salary form and your result.</td></tr>
            <tr><td><code>snready_practice_start:*</code> (session storage)</td><td>Stops a practice start from being counted twice in one visit. Cleared when you close the tab.</td></tr>
          </tbody>
        </table>
        <p>You can clear these at any time in your browser settings.</p>

        <h2>Who we share data with</h2>
        <p>We do not sell your personal data. We use these service providers, who process data on our behalf or under their own terms:</p>
        <ul>
          <li><strong>Stripe</strong>: payments.</li>
          <li><strong>Google</strong>: Google Analytics, Google Ads conversion measurement and Google Fonts.</li>
          <li><strong>Resend</strong>: sending sign-in and follow-up emails.</li>
          <li><strong>Cloudflare</strong>: hosting, server functions and storage (Workers KV and D1). Our server functions write operational logs to Cloudflare, which can include your email address (for example when access is granted or an email fails to send).</li>
        </ul>
        <p>These providers may process data in the United States and other countries.</p>

        <h2>How long we keep it</h2>
        <ul>
          <li>Sign-in links: valid for 15 minutes.</li>
          <li>Sessions: 30 days, or until you sign out.</li>
          <li>Attribution record in your browser: 90 days after your last visit.</li>
          <li>Access, account, follow-up and feedback records: kept for as long as you have access to SNReady, because purchases include lifetime access. They are not deleted automatically; ask us and we will delete them.</li>
          <li>Do-not-send list: kept so we keep honouring your choice.</li>
          <li>Salary submissions: kept for the salary statistics. They contain no name or email address.</li>
          <li>Data held by Stripe, Google, Resend and Cloudflare is kept according to their own policies. Stripe keeps payment records it is legally required to keep.</li>
        </ul>

        <h2>Your choices and rights</h2>
        <ul>
          <li><strong>Access, correction or deletion.</strong> Email {mail} from the address you used at checkout or sign-in and tell us what you want. Deleting your access record removes your paid access, so we will confirm before doing it.</li>
          <li><strong>Stop follow-up emails.</strong> Use the link in any follow-up email, or email us.</li>
          <li><strong>Analytics and ad cookies.</strong> You can block or delete cookies in your browser, or use Google&apos;s <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener noreferrer">Analytics opt-out add-on</a>. The site still works without them; only the <code>snready_session</code> cookie is needed to stay signed in.</li>
          <li>Depending on where you live you may have further rights, including the right to complain to your local data protection authority.</li>
        </ul>

        <h2>Changes</h2>
        <p>If we change what we collect or how we use it, we will update this page and the date at the top.</p>

        <h2>Contact</h2>
        <p>Questions or requests: {mail}.</p>
      </LegalPage>
    </>
  );
}
