import { MetadataRoute } from "next";
import {
  getCertificationSlugs,
  getAllTopicSlugs,
  getTopicsForCertification,
  getAllCategories,
  getAllQuestionIds,
  getAllDeltaSlugs,
  getActiveReleases,
} from "@/lib/data";
import { getAllComparisonSlugs } from "@/lib/comparisons";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://snready.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const certSlugs = getCertificationSlugs();
  const topicSlugs = getAllTopicSlugs();
  const categories = getAllCategories();
  const comparisonSlugs = getAllComparisonSlugs();
  const questionIds = await getAllQuestionIds();
  const deltaSlugs = getAllDeltaSlugs();
  const activeReleases = getActiveReleases();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // Certification hub pages
  const certPages: MetadataRoute.Sitemap = certSlugs.map((slug) => ({
    url: `${BASE_URL}/certifications/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Category landing pages (NEW)
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/certifications/category/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Comparison pages (NEW)
  const comparisonPages: MetadataRoute.Sitemap = comparisonSlugs.map(
    (slug) => ({
      url: `${BASE_URL}/compare/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  // Practice test pages
  const practiceTestPages: MetadataRoute.Sitemap = certSlugs.map((slug) => ({
    url: `${BASE_URL}/practice-tests/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Topic question pages
  const topicPages: MetadataRoute.Sitemap = topicSlugs.map(
    ({ certification, topic }) => ({
      url: `${BASE_URL}/${certification}/questions/${topic}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  // Individual question pages (NEW)
  const individualQuestionPages: MetadataRoute.Sitemap = questionIds.map(
    ({ certification, topic, questionId }) => ({
      url: `${BASE_URL}/${certification}/questions/${topic}/${questionId}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })
  );

  // Free question pages
  const freeQuestionPages: MetadataRoute.Sitemap = topicSlugs.map(
    ({ certification, topic }) => ({
      url: `${BASE_URL}/free-questions/${certification}/${topic}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  // Learn pages (concept explainers)
  const learnPages: MetadataRoute.Sitemap = [];
  for (const certSlug of certSlugs) {
    const topics = getTopicsForCertification(certSlug);
    for (const topic of topics) {
      learnPages.push({
        url: `${BASE_URL}/learn/${topic.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    }
  }

  // Delta exam pages (HIGH PRIORITY for SEO during delta season)
  const deltaPages: MetadataRoute.Sitemap = deltaSlugs.map(
    ({ certification, release }) => ({
      url: `${BASE_URL}/delta/${certification}-${release}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9, // High priority - timely content
    })
  );

  // Release hub pages
  const releasePages: MetadataRoute.Sitemap = activeReleases.map((release) => ({
    url: `${BASE_URL}/release/${release.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...certPages,
    ...categoryPages,
    ...comparisonPages,
    ...deltaPages,
    ...releasePages,
    ...practiceTestPages,
    ...topicPages,
    ...individualQuestionPages,
    ...freeQuestionPages,
    ...learnPages,
  ];
}
