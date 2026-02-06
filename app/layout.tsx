import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import { BASE_URL } from "@/lib/seo";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        <nav className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold text-emerald-600">
                  SNReady
                </span>
              </Link>
              <div className="hidden sm:flex sm:items-center sm:gap-6">
                <Link
                  href="/certifications/csa"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  CSA
                </Link>
                <Link
                  href="/certifications/cad"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  CAD
                </Link>
                <Link
                  href="/certifications/cis-df"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  CIS-DF
                </Link>
                <Link
                  href="/certifications/cis-itsm"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  CIS-ITSM
                </Link>
                <Link
                  href="/#certifications"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  All 25+ Exams
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-w-0 overflow-x-hidden">
          <Providers>{children}</Providers>
        </main>
        <footer className="border-t border-zinc-200 py-12 dark:border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {/* Certifications */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Certifications
                </h3>
                <div className="mt-4 space-y-3">
                  <Link
                    href="/certifications/csa"
                    className="block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    CSA
                  </Link>
                  <Link
                    href="/certifications/cis-df"
                    className="block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    CIS-DF
                  </Link>
                  <Link
                    href="/certifications/cad"
                    className="block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    CAD
                  </Link>
                  <Link
                    href="/certifications/cis-itsm"
                    className="block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    CIS-ITSM
                  </Link>
                  <Link
                    href="/certifications/cta"
                    className="block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    CTA
                  </Link>
                  <Link
                    href="/#certifications"
                    className="block text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    All Certifications
                  </Link>
                </div>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Resources
                </h3>
                <div className="mt-4 space-y-3">
                  <Link
                    href="/practice-tests/csa"
                    className="block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    Practice Tests
                  </Link>
                  <Link
                    href="/free-questions/csa/ui-navigation"
                    className="block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    Free Questions
                  </Link>
                  <Link
                    href="/study-guide/csa"
                    className="block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    Study Guides
                  </Link>
                  <Link
                    href="/compare/csa-vs-cad"
                    className="block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    Compare Certifications
                  </Link>
                </div>
              </div>

              {/* Popular Comparisons */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Popular Comparisons
                </h3>
                <div className="mt-4 space-y-3">
                  <Link
                    href="/compare/csa-vs-cad"
                    className="block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    CSA vs CAD
                  </Link>
                  <Link
                    href="/compare/csa-vs-cis-itsm"
                    className="block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    CSA vs CIS-ITSM
                  </Link>
                  <Link
                    href="/compare/cis-discovery-vs-cis-sm"
                    className="block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    CIS-Discovery vs CIS-SM
                  </Link>
                </div>
              </div>

              {/* About */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  SNReady
                </h3>
                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                  Your path to ServiceNow certification success
                </p>
              </div>
            </div>
            
            <div className="mt-8 border-t border-zinc-200 pt-8 text-center dark:border-zinc-700">
              <p className="text-sm text-zinc-500">
                SNReady - Your path to ServiceNow certification success
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
