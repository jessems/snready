import { MetadataRoute } from "next";
import { getCertificationSlugs, getAllTopicSlugs, getAllDeltaSlugs } from "@/lib/data";
import { getAllPosts } from "@/data/blog/posts";
import { getAllComparisonSlugs } from "@/lib/comparisons";
import { getAllCompetitorSlugs } from "@/data/competitor-comparisons";
import { ALL_SEGMENTS } from "@/lib/salaries/segments";
import { getReleaseSummary } from "@/lib/release-notes";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://snready.com";

/**
 * SITEMAP STRATEGY
 *
 * Only indexable pages belong here: a URL that is noindexed or canonicalised
 * elsewhere must not be listed. Version-diff product pages and /[cert]/dumps
 * are noindexed and so are excluded. Individual question pages are excluded.
 *
 * lastModified is only set where we know when the content really changed
 * (blog posts). Google ignores lastmod once it proves inaccurate, and stamping
 * every URL with the build time made it inaccurate.
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
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/certifications`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pricing`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/resources`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/exam-blueprints`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/certification-paths`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/compare`,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/version-diff`,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/salaries`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // === Certification landing pages ===
  const certPages: MetadataRoute.Sitemap = certSlugs.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // === Practice question pages (per cert) ===
  const practiceQuestionPages: MetadataRoute.Sitemap = certSlugs.map(
    (slug) => ({
      url: `${BASE_URL}/${slug}/practice-questions`,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })
  );

  // === Topic pages (long-tail keywords) ===
  const topicPages: MetadataRoute.Sitemap = topicSlugs.map(
    ({ certification, topic }) => ({
      url: `${BASE_URL}/${certification}/practice-questions/${topic}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  // === Mock exam pages (conversion pages) ===
  const mockExamPages: MetadataRoute.Sitemap = certSlugs.map((slug) => ({
    url: `${BASE_URL}/${slug}/mock-exam`,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // === Compare pages ===
  const comparePages: MetadataRoute.Sitemap = comparisonSlugs.map((slug) => ({
    url: `${BASE_URL}/compare/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // === Blog pages ===
  const blogDates = blogPosts.map((post) => new Date(post.updatedAt || post.publishedAt).getTime());
  const latestBlogDate = blogDates.length ? new Date(Math.max(...blogDates)) : undefined;
  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog`,
      lastModified: latestBlogDate,
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
      changeFrequency: "monthly" as const,
      priority: 0.85,
    },
    ...competitorSlugs.map((slug) => ({
      url: `${BASE_URL}/vs/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  // === Delta exam pages ===
  const deltaSlugs = getAllDeltaSlugs();
  const deltaPages: MetadataRoute.Sitemap = deltaSlugs.map(({ certification, release }) => ({
    url: `${BASE_URL}/${certification}/delta/${release}`,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // === Salary segment pages (role + country specific) ===
  const salarySegmentPages: MetadataRoute.Sitemap = ALL_SEGMENTS.map((segment) => ({
    url: `${BASE_URL}/salaries/${segment.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // === Future: Individual question pages (Phase 3) ===
  // const questionIds = await getAllQuestionIds();
  // const individualQuestionPages = questionIds.map(...)

  // Version Diff pages
  const releaseSummary = getReleaseSummary();
  const versionDiffPages: MetadataRoute.Sitemap = [];
  for (const versionSlug of Object.keys(releaseSummary.versions)) {
    versionDiffPages.push({
      url: `${BASE_URL}/version-diff/${versionSlug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    });
  }

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
    ...salarySegmentPages,
    ...versionDiffPages,
  ];
}
