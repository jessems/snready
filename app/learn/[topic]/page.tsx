import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllTopicSlugs,
  getCertificationBySlug,
  getTopicsForCertification,
} from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { getCanonicalUrl } from "@/lib/seo";
import type { Topic } from "@/types";

interface Props {
  params: Promise<{
    topic: string;
  }>;
}

// Find a topic by slug across all certifications
function findTopicBySlug(topicSlug: string): {
  topic: Topic;
  certification: any;
} | null {
  const allTopicSlugs = getAllTopicSlugs();
  
  for (const { certification, topic } of allTopicSlugs) {
    const cert = getCertificationBySlug(certification);
    const topics = getTopicsForCertification(certification);
    const topicData = topics.find(t => t.slug === topicSlug);
    
    if (topicData && cert) {
      return { topic: topicData, certification: cert };
    }
  }
  
  return null;
}

export async function generateStaticParams() {
  const allSlugs = getAllTopicSlugs();
  // Get unique topic slugs across all certifications
  const uniqueTopics = new Set<string>();
  
  allSlugs.forEach(({ topic }) => {
    uniqueTopics.add(topic);
  });
  
  return Array.from(uniqueTopics).map((topic) => ({
    topic,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  
  const result = findTopicBySlug(topic);
  
  if (!result) {
    return {
      title: "Topic Not Found",
    };
  }

  const { topic: topicData, certification } = result;

  const title = `${topicData.name} - ServiceNow ${certification.name} Study Guide | SNReady`;
  const description = `Learn ${topicData.name} for ServiceNow ${certification.name} certification. Comprehensive study guide with key concepts, exam tips, and practice questions.`;
  
  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/learn/${topic}`),
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl(`/learn/${topic}`),
      images: ['/og-default.png'],
    },
    twitter: {
      title,
      description,
      images: ['/og-default.png'],
    },
  };
}

export default async function LearnTopicPage({ params }: Props) {
  const { topic } = await params;
  
  const result = findTopicBySlug(topic);
  
  if (!result) {
    notFound();
  }

  const { topic: topicData, certification } = result;

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Study Guides", url: "/learn" },
    { name: topicData.name, url: `/learn/${topic}` },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${topicData.name} - ServiceNow Study Guide`,
    description: topicData.introduction?.overview || topicData.description,
    author: {
      "@type": "Organization",
      name: "SNReady",
    },
    publisher: {
      "@type": "Organization",
      name: "SNReady",
    },
    datePublished: "2026-02-05",
    dateModified: "2026-02-05",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getCanonicalUrl(`/learn/${topic}`),
    },
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
          __html: JSON.stringify(articleSchema),
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-zinc-700">Home</Link>
            <span>→</span>
            <Link href="/learn" className="hover:text-zinc-700">Study Guides</Link>
            <span>→</span>
            <span>{topicData.name}</span>
          </div>
          
          <h1 className="mt-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            {topicData.name}
          </h1>
          <p className="mt-2 text-xl text-emerald-600">
            ServiceNow {certification.name} Study Guide
          </p>
        </div>

        {/* Topic Overview */}
        {topicData.introduction && (
          <div className="mt-8">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Overview
              </h2>
              <p className="mt-3 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {topicData.introduction.overview}
              </p>
            </div>
          </div>
        )}

        {/* Why It Matters */}
        {topicData.introduction?.whyItMatters && (
          <div className="mt-6">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950">
              <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">
                Why It Matters for the Exam
              </h2>
              <p className="mt-3 text-amber-800 dark:text-amber-200 leading-relaxed">
                {topicData.introduction.whyItMatters}
              </p>
            </div>
          </div>
        )}

        {/* Key Concepts */}
        {topicData.keyConcepts && topicData.keyConcepts.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Key Concepts to Master
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {topicData.keyConcepts.map((concept: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950"
                >
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="text-emerald-800 dark:text-emerald-200">
                    {concept}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exam Tips */}
        {topicData.introduction?.examTips && (
          <div className="mt-6">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                💡 Exam Tips & Strategy
              </h2>
              <p className="mt-3 text-blue-800 dark:text-blue-200 leading-relaxed">
                {topicData.introduction.examTips}
              </p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <div className="text-2xl font-bold text-emerald-600">
              {topicData.questionCount}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Practice Questions</div>
          </div>
          <div className="text-center rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <div className="text-2xl font-bold text-emerald-600">
              {certification.domains?.find((d: { slug: string }) => d.slug === topicData.domain)?.percentage || "—"}%
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Exam Weight</div>
          </div>
          <div className="text-center rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <div className="text-2xl font-bold text-emerald-600">
              {certification.name}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Certification</div>
          </div>
        </div>

        {/* Practice Links */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Practice & Test Your Knowledge
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href={`/${certification.slug}/questions/${topicData.slug}`}
              className="rounded-lg border border-zinc-200 bg-white p-6 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                All Practice Questions
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {topicData.questionCount} questions with detailed explanations
              </p>
              <span className="mt-2 inline-block text-sm font-medium text-emerald-600">
                Start Practicing →
              </span>
            </Link>
            <Link
              href={`/certifications/${certification.slug}/prepare`}
              className="rounded-lg border border-zinc-200 bg-white p-6 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Full Exam Prep
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Complete {certification.name} preparation plan
              </p>
              <span className="mt-2 inline-block text-sm font-medium text-emerald-600">
                View Guide →
              </span>
            </Link>
          </div>
        </div>

        {/* Related Topics */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Related Topics in {certification.name}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {getTopicsForCertification(certification.slug)
              .filter(t => t.slug !== topicData.slug)
              .slice(0, 6)
              .map((relatedTopic) => (
                <Link
                  key={relatedTopic.slug}
                  href={`/learn/${relatedTopic.slug}`}
                  className="rounded border border-zinc-200 p-3 text-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    {relatedTopic.name}
                  </div>
                  <div className="text-zinc-600 dark:text-zinc-400">
                    {certification.domains?.find((d: { slug: string }) => d.slug === relatedTopic.domain)?.percentage || "—"}% • {relatedTopic.questionCount} questions
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}