import { MetadataRoute } from "next";
import { getCertificationSlugs, getAllTopicSlugs, getAllDeltaSlugs } from "@/lib/data";
import { getAllPosts } from "@/data/blog/posts";
import { getAllComparisonSlugs } from "@/lib/comparisons";
import { getAllCompetitorSlugs } from "@/data/competitor-comparisons";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://snready.com";

/**
 * SITEMAP STRATEGY - Expanded
 *
 * Including all valuable pages to help Google discover content faster.
 * Individual question pages are still excluded (Phase 3).
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const certSlugs = getCertificationSlugs();
  const blogPosts = getAllPosts();
  const topicSlugs = getAllTopicSlugs();
  const comparisonSlugs = getAllComparisonSlugs();

  // === Static pages ===
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
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/glossary`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/learn`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/resources`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/exam-blueprints`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/certification-paths`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/readiness`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // === Certification landing pages ===
  const certPages: MetadataRoute.Sitemap = certSlugs.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // === Practice question pages (per cert) ===
  const practiceQuestionPages: MetadataRoute.Sitemap = certSlugs.map(
    (slug) => ({
      url: `${BASE_URL}/${slug}/practice-questions`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })
  );

  // === Topic pages (long-tail keywords) ===
  const topicPages: MetadataRoute.Sitemap = topicSlugs.map(
    ({ certification, topic }) => ({
      url: `${BASE_URL}/${certification}/practice-questions/${topic}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  // === Mock exam pages (conversion pages) ===
  const mockExamPages: MetadataRoute.Sitemap = certSlugs.map((slug) => ({
    url: `${BASE_URL}/${slug}/mock-exam`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // === Compare pages ===
  const comparePages: MetadataRoute.Sitemap = comparisonSlugs.map((slug) => ({
    url: `${BASE_URL}/compare/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // === Blog pages ===
  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...blogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // === Competitor comparison pages (vs) ===
  const competitorSlugs = getAllCompetitorSlugs();
  const competitorPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/vs`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    },
    ...competitorSlugs.map((slug) => ({
      url: `${BASE_URL}/vs/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  // === Delta exam pages ===
  const deltaSlugs = getAllDeltaSlugs();
  const deltaPages: MetadataRoute.Sitemap = deltaSlugs.map(({ certification, release }) => ({
    url: `${BASE_URL}/${certification}/delta/${release}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // === Future: Individual question pages (Phase 3) ===
  // const questionIds = await getAllQuestionIds();
  // const individualQuestionPages = questionIds.map(...)

  return [
    ...staticPages,
    ...certPages,
    ...practiceQuestionPages,
    ...topicPages,
    ...mockExamPages,
    ...comparePages,
    ...blogPages,
    ...competitorPages,
    ...deltaPages,
  ];
}
