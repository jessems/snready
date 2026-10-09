import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import SiteFooter from "@/components/SiteFooter";
import { BASE_URL } from "@/lib/seo";
import { Providers } from "@/components/Providers";
import { Analytics } from "@/components/Analytics";
import { GA_MEASUREMENT_ID, GOOGLE_ADS_ID } from "@/lib/analytics";
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
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
            ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ""}
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
        <Analytics />
        <Providers>
          <Header />
          <main className="min-w-0 overflow-x-hidden">
            {children}
          </main>
        </Providers>
        <SiteFooter />
      </body>
    </html>
  );
}
