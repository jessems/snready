import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import Link from "next/link";
import { BASE_URL } from "@/lib/seo";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "SNReady - ServiceNow Certification Exam Prep",
    template: "%s | SNReady",
  },
  alternates: {
    canonical: "/",
  },
  description:
    "Pass your ServiceNow certification exams with confidence. Free practice tests, exam questions, and study guides for CSA, CAD, CIS-ITSM, and more.",
  keywords: [
    "ServiceNow certification",
    "CSA practice test",
    "ServiceNow exam questions",
    "CAD certification",
    "CIS-ITSM exam prep",
    "ServiceNow study guide",
  ],
  authors: [{ name: "SNReady" }],
  creator: "SNReady",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SNReady",
    title: "SNReady - ServiceNow Certification Exam Prep",
    description:
      "Pass your ServiceNow certification exams with confidence. Free practice tests and exam questions.",
    images: ['/og-default.png'],
  },
  twitter: {
    card: "summary_large_image",
    title: "SNReady - ServiceNow Certification Exam Prep",
    description:
      "Pass your ServiceNow certification exams with confidence. Free practice tests and exam questions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SNReady",
    url: "https://snready.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://snready.com/#certifications?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SNReady",
    url: "https://snready.com",
  };

  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-21R4T0V162"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-21R4T0V162');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <Providers>
          <Header />
          <main className="min-w-0 overflow-x-hidden">
            {children}
          </main>
        </Providers>
        
        {/* Stripe-style Footer */}
        <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {/* Brand Column */}
              <div className="col-span-2 md:col-span-1">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--gradient-end)] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SN</span>
                  </div>
                  <span className="text-lg font-bold text-[var(--text-primary)]">
                    SNReady
                  </span>
                </Link>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Practice questions derived from official Now Learning content. Pass your certification with confidence.
                </p>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                  Certifications
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "CSA", href: "/csa" },
                    { name: "CAD", href: "/cad" },
                    { name: "CIS-ITSM", href: "/cis-itsm" },
                    { name: "CIS-DF", href: "/cis-df" },
                    { name: "CIS-Discovery", href: "/cis-discovery" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    href="/certifications"
                    className="block text-sm text-[var(--primary)] font-medium"
                  >
                    All Certifications →
                  </Link>
                </div>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                  Resources
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Study Plan Generator", href: "/study-plan" },
                    { name: "Certification Quiz", href: "/quiz" },
                    { name: "Certification Paths", href: "/certification-paths" },
                    { name: "Glossary", href: "/glossary" },
                    { name: "Blog", href: "/blog" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Compare */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                  Compare
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "CSA vs CAD", href: "/compare/csa-vs-cad" },
                    { name: "CSA vs CIS-ITSM", href: "/compare/csa-vs-cis-itsm" },
                    { name: "CIS-Discovery vs CIS-SM", href: "/compare/cis-discovery-vs-cis-sm" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    href="/compare"
                    className="block text-sm text-[var(--primary)] font-medium"
                  >
                    All Comparisons →
                  </Link>
                </div>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                  Company
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Pricing", href: "/pricing" },
                    { name: "Contact", href: "mailto:hello@snready.com" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-12 pt-8 border-t border-[var(--border)]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-[var(--text-muted)]">
                  © {new Date().getFullYear()} SNReady. All rights reserved.
                </p>
                <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
                  <span>20 certifications</span>
                  <span className="opacity-30">•</span>
                  <span>1,400+ questions</span>
                  <span className="opacity-30">•</span>
                  <span>$9 lifetime access</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
