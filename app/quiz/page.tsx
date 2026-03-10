import { Metadata } from "next";
import CertificationQuiz from "@/components/quiz/CertificationQuiz";

export const metadata: Metadata = {
  title: "Which ServiceNow Certification Should I Get? | Free Quiz",
  description:
    "Take our free 2-minute quiz to find the perfect ServiceNow certification for your career goals. Get personalized recommendations based on your experience and interests.",
  keywords: [
    "which ServiceNow certification",
    "ServiceNow certification quiz",
    "ServiceNow certification recommendation",
    "best ServiceNow certification",
    "ServiceNow certification for beginners",
    "ServiceNow career quiz",
    "ServiceNow cert finder",
  ],
  alternates: {
    canonical: "/quiz",
  },
  openGraph: {
    title: "Which ServiceNow Certification Should I Get? | Free Quiz",
    description:
      "Take our free 2-minute quiz to find the perfect ServiceNow certification for your career goals.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Which ServiceNow Certification? Take the Quiz",
    description:
      "Find your perfect ServiceNow certification in 2 minutes. Free quiz with personalized recommendations.",
  },
};

export default function QuizPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Schema.org Quiz markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Quiz",
            name: "ServiceNow Certification Finder Quiz",
            description:
              "Find the perfect ServiceNow certification for your career goals",
            educationalAlignment: {
              "@type": "AlignmentObject",
              alignmentType: "educationalSubject",
              targetName: "ServiceNow Platform",
            },
            about: {
              "@type": "Thing",
              name: "ServiceNow Certifications",
            },
          }),
        }}
      />

      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Which ServiceNow Certification Should I Get?
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Answer 6 quick questions and we&apos;ll recommend the perfect
          certification path for your career goals and experience level.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          ⏱️ Takes less than 2 minutes • 🎯 Personalized recommendations
        </p>
      </header>

      <CertificationQuiz />

      {/* SEO content below the quiz */}
      <section className="mt-16 prose prose-gray max-w-none">
        <h2>How We Recommend Your ServiceNow Certification</h2>
        <p>
          Our quiz considers several factors to match you with the right
          ServiceNow certification:
        </p>
        <ul>
          <li>
            <strong>Your current role</strong> — Whether you&apos;re in IT
            support, development, consulting, or new to tech
          </li>
          <li>
            <strong>ServiceNow experience</strong> — From complete beginner to
            experienced admin looking to specialize
          </li>
          <li>
            <strong>Career goals</strong> — Job security, higher salary,
            consulting work, or leadership
          </li>
          <li>
            <strong>Areas of interest</strong> — ITSM, development, CMDB, HR,
            security, and more
          </li>
          <li>
            <strong>Work style preference</strong> — Technical scripting vs.
            functional configuration
          </li>
        </ul>

        <h2>ServiceNow Certification Overview</h2>
        <p>
          ServiceNow offers over 30 certifications across different tracks. The
          most popular starting points are:
        </p>
        <ul>
          <li>
            <strong>CSA (Certified System Administrator)</strong> — The
            foundation certification for everyone. Required before most other
            certs.
          </li>
          <li>
            <strong>CAD (Certified Application Developer)</strong> — For those
            who want to write code and build custom apps.
          </li>
          <li>
            <strong>CIS (Certified Implementation Specialist)</strong> — For
            specialists in specific areas like ITSM, CSM, HR, etc.
          </li>
        </ul>

        <h2>Still Not Sure?</h2>
        <p>
          Check out our{" "}
          <a href="/certification-paths">certification paths guide</a> for a
          detailed breakdown of each track, or start practicing with our{" "}
          <a href="/certifications">free practice questions</a>.
        </p>
      </section>
    </div>
  );
}
