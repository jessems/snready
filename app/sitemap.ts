import { MetadataRoute } from "next";
import {
  getCertificationSlugs,
  getAllTopicSlugs,
  getTopicsForCertification,
  getAllCategories,
  getAllQuestionIds,
  getAllDeltaSlugs,
  getActiveReleases,
  getAllGlossaryTermSlugs,
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
  const glossaryTermSlugs = getAllGlossaryTermSlugs();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/certifications`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/practice-questions`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/learn`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  // Certification hub pages
  const certPages: MetadataRoute.Sitemap = certSlugs.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Prepare pages for each certification
  const preparePages: MetadataRoute.Sitemap = certSlugs.map((slug) => ({
    url: `${BASE_URL}/${slug}/prepare`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
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

  // Practice question pages
  const practiceTestPages: MetadataRoute.Sitemap = certSlugs.map((slug) => ({
    url: `${BASE_URL}/${slug}/practice-questions`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Mock exam pages
  const mockExamPages: MetadataRoute.Sitemap = certSlugs.map((slug) => ({
    url: `${BASE_URL}/${slug}/mock-exam`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Topic question pages
  const topicPages: MetadataRoute.Sitemap = topicSlugs.map(
    ({ certification, topic }) => ({
      url: `${BASE_URL}/${certification}/practice-questions/${topic}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  // Individual question pages (NEW)
  const individualQuestionPages: MetadataRoute.Sitemap = questionIds.map(
    ({ certification, topic, questionId }) => ({
      url: `${BASE_URL}/${certification}/practice-questions/${topic}/${questionId}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })
  );

  // Learn pages (concept explainers) - deduplicated since topics can appear in multiple certs
  const uniqueLearnSlugs = new Set<string>();
  for (const certSlug of certSlugs) {
    const topics = getTopicsForCertification(certSlug);
    for (const topic of topics) {
      uniqueLearnSlugs.add(topic.slug);
    }
  }
  const learnPages: MetadataRoute.Sitemap = Array.from(uniqueLearnSlugs).map(
    (slug) => ({
      url: `${BASE_URL}/learn/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

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

  // Glossary pages
  const glossaryPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/glossary`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    // Glossary by certification
    ...certSlugs.map((slug) => ({
      url: `${BASE_URL}/glossary/certification/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // Individual glossary terms
    ...glossaryTermSlugs.map((slug) => ({
      url: `${BASE_URL}/glossary/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [
    ...staticPages,
    ...certPages,
    ...preparePages,
    ...categoryPages,
    ...comparisonPages,
    ...deltaPages,
    ...releasePages,
    ...practiceTestPages,
    ...mockExamPages,
    ...topicPages,
    ...individualQuestionPages,
    ...learnPages,
    ...glossaryPages,
  ];
}
