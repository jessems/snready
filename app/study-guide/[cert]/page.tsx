import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCertificationBySlug,
  getTopicsForCertification,
  getCertificationSlugs,
  getTotalQuestionCount,
  getTotalFreeQuestionCount,
} from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { getCanonicalUrl } from "@/lib/seo";

interface Props {
  params: Promise<{
    cert: string;
  }>;
}

export async function generateStaticParams() {
  return getCertificationSlugs().map((slug) => ({
    cert: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cert } = await params;
  
  const certification = getCertificationBySlug(cert);
  
  if (!certification) {
    return {
      title: "Certification Not Found",
    };
  }

  const title = `${certification.name} Study Guide 2026 - Exam Prep Plan | SNReady`;
  const description = `Complete ${certification.name} study guide with exam overview, topic breakdown, and preparation strategy. Pass your ${certification.name} certification with our structured study plan.`;
  
  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/study-guide/${cert}`),
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl(`/study-guide/${cert}`),
      images: ['/og-default.png'],
    },
    twitter: {
      title,
      description,
      images: ['/og-default.png'],
    },
  };
}

export default async function StudyGuidePage({ params }: Props) {
  const { cert } = await params;
  
  const certification = getCertificationBySlug(cert);
  const topics = getTopicsForCertification(cert);
  const totalQuestions = getTotalQuestionCount(cert);
  const totalFreeQuestions = getTotalFreeQuestionCount(cert);
  
  if (!certification) {
    notFound();
  }

  // Sort topics by domain weight (heaviest first) for recommended order
  const getDomainWeight = (topic: typeof topics[0]) => {
    const domain = certification.domains.find(d => d.slug === topic.domain);
    return domain?.percentage || 0;
  };
  const sortedTopics = [...topics].sort((a, b) => getDomainWeight(b) - getDomainWeight(a));

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Study Guides", url: "/study-guide" },
    { name: certification.name, url: `/study-guide/${cert}` },
  ];

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How to pass ${certification.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `To pass the ${certification.name} exam, focus on the highest-weighted topics first, practice with realistic questions, and understand key concepts thoroughly. Allow 2-3 months for preparation and take multiple practice tests.`,
        },
      },
      {
        "@type": "Question",
        name: `What to study for ${certification.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Study ${certification.name} exam domains including: ${topics.slice(0, 3).map(t => t.name).join(', ')}, and other core platform concepts. Focus on hands-on experience and understanding of ServiceNow functionality.`,
        },
      },
      {
        "@type": "Question",
        name: `How long to prepare for ${certification.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Most candidates need 2-3 months of dedicated study for ${certification.name}. This includes studying theory, hands-on practice, and taking multiple practice exams. Your timeline may vary based on your ServiceNow experience.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbJsonLd(breadcrumbItems)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqData),
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-zinc-700">Home</Link>
            <span>→</span>
            <Link href="/study-guide" className="hover:text-zinc-700">Study Guides</Link>
            <span>→</span>
            <span>{certification.name}</span>
          </div>
          
          <h1 className="mt-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            {certification.name} Study Guide
          </h1>
          <p className="mt-2 text-xl text-emerald-600">
            Complete 2026 Exam Preparation Plan
          </p>
          
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Strategic study plan to pass your {certification.name} certification
          </p>
        </div>

        {/* Exam Overview */}
        <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            📋 Exam Overview
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Questions</h3>
              <p className="text-2xl font-bold text-emerald-600">
                {certification.examDetails?.questionCount || '60'}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Multiple choice & scenario
              </p>
            </div>
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Duration</h3>
              <p className="text-2xl font-bold text-emerald-600">
                {certification.examDetails?.duration || '90 minutes'}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Time to complete
              </p>
            </div>
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Passing Score</h3>
              <p className="text-2xl font-bold text-emerald-600">
                {certification.examDetails?.passingScore || '70%'}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Minimum required
              </p>
            </div>
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Cost</h3>
              <p className="text-2xl font-bold text-emerald-600">
                ${certification.examDetails?.cost || '500'}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Exam fee (USD)
              </p>
            </div>
          </div>
        </div>

        {/* Preparation Strategy */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            🎯 Recommended Study Order
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Focus on high-weight topics first for maximum impact. Topics are ordered by exam weight.
          </p>
          
          <div className="mt-6 space-y-4">
            {sortedTopics.map((topic, index) => (
              <div
                key={topic.slug}
                className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {topic.name}
                      </h3>
                      <span className="rounded bg-emerald-100 px-2 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                        {getDomainWeight(topic)}% weight
                      </span>
                    </div>
                    
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                      {topic.description}
                    </p>

                    {/* Key Concepts */}
                    {topic.keyConcepts && topic.keyConcepts.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          Key Concepts to Master:
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {topic.keyConcepts.slice(0, 5).map((concept: string, conceptIndex: number) => (
                            <span
                              key={conceptIndex}
                              className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                            >
                              {concept}
                            </span>
                          ))}
                          {topic.keyConcepts.length > 5 && (
                            <span className="text-xs text-zinc-500">
                              +{topic.keyConcepts.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/${cert}/questions/${topic.slug}`}
                        className="text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        Practice ({topic.questionCount} questions)
                      </Link>
                      <Link
                        href={`/free-questions/${cert}/${topic.slug}`}
                        className="text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        Free Questions ({topic.freeQuestionCount})
                      </Link>
                      <Link
                        href={`/learn/${topic.slug}`}
                        className="text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        Learn Concepts
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Resources */}
        <div className="mt-12 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100 p-4 sm:p-8 dark:border-emerald-800 dark:from-emerald-950 dark:to-green-950">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              Ready to Start Practicing?
            </h2>
            <p className="mt-2 text-emerald-700 dark:text-emerald-300">
              Test your knowledge with {totalQuestions} practice questions and {totalFreeQuestions} free samples
            </p>
            
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href={`/practice-tests/${cert}`}
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Practice Questions
              </Link>
              <Link
                href={`/certifications/${cert}`}
                className="inline-flex items-center justify-center rounded-lg border border-emerald-600 px-8 py-3 font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950"
              >
                Browse All Topics
              </Link>
            </div>
          </div>
        </div>

        {/* Study Tips */}
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
            💡 Study Tips & Strategy
          </h2>
          <div className="mt-4 space-y-3 text-blue-800 dark:text-blue-200">
            <p>
              <strong>1. Focus on Experience:</strong> ServiceNow exams emphasize practical knowledge. Get hands-on experience in a ServiceNow instance.
            </p>
            <p>
              <strong>2. Follow the Weight:</strong> Prioritize topics with higher exam weights for maximum score impact.
            </p>
            <p>
              <strong>3. Practice Regularly:</strong> Take practice tests weekly to identify weak areas and track progress.
            </p>
            <p>
              <strong>4. Review Explanations:</strong> Don't just memorize answers - understand why incorrect options are wrong.
            </p>
            <p>
              <strong>5. Time Management:</strong> Practice under timed conditions to ensure you can complete the exam within the time limit.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}