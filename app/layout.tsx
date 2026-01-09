import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BASE_URL } from "@/lib/seo";
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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <a href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold text-emerald-600">
                  SNReady
                </span>
              </a>
              <div className="hidden sm:flex sm:items-center sm:gap-6">
                <a
                  href="/certifications/csa"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  CSA
                </a>
                <a
                  href="/certifications/cad"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  CAD
                </a>
                <a
                  href="/certifications/cis-itsm"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  CIS-ITSM
                </a>
                <a
                  href="/#certifications"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  All 25+ Exams
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-zinc-200 py-8 dark:border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 text-center text-sm text-zinc-500">
            <p>SNReady - Your path to ServiceNow certification success</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
