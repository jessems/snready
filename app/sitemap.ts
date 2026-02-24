import { MetadataRoute } from "next";
import { getCertificationSlugs } from "@/lib/data";
import { getAllPosts } from "@/data/blog/posts";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://snready.com";

/**
 * SITEMAP STRATEGY - Phase 1 (New Domain)
 * 
 * Only submit ~25 high-value pages to Google until we have:
 * - Core pages indexed
 * - Some backlinks/authority
 * 
 * All other pages still exist and work — they just aren't in the sitemap.
 * Google can discover them via internal links once we have crawl budget.
 * 
 * Phase 2: Add topic-level pages (~100 pages) after core pages index
 * Phase 3: Add individual question pages after 50+ indexed + backlinks
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const certSlugs = getCertificationSlugs();
  const blogPosts = getAllPosts();

  // === PHASE 1: Core pages only (~25 URLs) ===

  // Homepage - highest priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // Certification landing pages - these are our money pages
  const certPages: MetadataRoute.Sitemap = certSlugs.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Blog - fresh content signals life to Google
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

  // === PHASE 2: Uncomment after core pages are indexed ===
  // 
  // const topicSlugs = getAllTopicSlugs();
  // const topicPages: MetadataRoute.Sitemap = topicSlugs.map(
  //   ({ certification, topic }) => ({
  //     url: `${BASE_URL}/${certification}/practice-questions/${topic}`,
  //     lastModified: new Date(),
  //     changeFrequency: "weekly" as const,
  //     priority: 0.8,
  //   })
  // );
  // 
  // const practiceTestPages: MetadataRoute.Sitemap = certSlugs.map((slug) => ({
  //   url: `${BASE_URL}/${slug}/practice-questions`,
  //   lastModified: new Date(),
  //   changeFrequency: "weekly" as const,
  //   priority: 0.8,
  // }));
  // 
  // const mockExamPages: MetadataRoute.Sitemap = certSlugs.map((slug) => ({
  //   url: `${BASE_URL}/${slug}/mock-exam`,
  //   lastModified: new Date(),
  //   changeFrequency: "weekly" as const,
  //   priority: 0.85,
  // }));

  // === PHASE 3: Uncomment after 50+ indexed pages + backlinks ===
  // 
  // const questionIds = await getAllQuestionIds();
  // const individualQuestionPages: MetadataRoute.Sitemap = questionIds.map(
  //   ({ certification, topic, questionId }) => ({
  //     url: `${BASE_URL}/${certification}/practice-questions/${topic}/${questionId}`,
  //     lastModified: new Date(),
  //     changeFrequency: "monthly" as const,
  //     priority: 0.5,
  //   })
  // );
  // 
  // const glossaryTermSlugs = getAllGlossaryTermSlugs();
  // const glossaryTermPages = glossaryTermSlugs.map((slug) => ({
  //   url: `${BASE_URL}/glossary/${slug}`,
  //   lastModified: new Date(),
  //   changeFrequency: "monthly" as const,
  //   priority: 0.6,
  // }));

  return [
    ...staticPages,
    ...certPages,
    ...blogPages,
    // Phase 2: ...practiceTestPages, ...mockExamPages, ...topicPages,
    // Phase 3: ...individualQuestionPages, ...glossaryTermPages,
  ];
}
