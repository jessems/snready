import { MetadataRoute } from "next";
import { getCertificationSlugs, getAllTopicSlugs, getAllDeltaSlugs } from "@/lib/data";
import { getAllPosts } from "@/data/blog/posts";
import { getAllComparisonSlugs } from "@/lib/comparisons";
import { getReleaseSummary } from "@/lib/release-notes";
import { getAllCourses } from "@/lib/courses";
import { isIndexablePath } from "@/lib/seo-indexing";
import { LAST_REVIEWED_ISO } from "@/lib/site-facts";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://snready.com";

/**
 * SITEMAP STRATEGY
 *
 * Only indexable pages belong here: a URL that is noindexed or canonicalised
 * elsewhere must not be listed. Every candidate URL is filtered through
 * isIndexablePath (lib/seo-indexing.ts), the same rule page metadata uses for
 * the robots meta tag. Individual question pages are excluded.
 *
 * lastModified is a real content date, never the build time: blog posts and
 * courses use their own dates; every other page uses LAST_REVIEWED_ISO, the
 * date its facts were last reviewed by hand (lib/site-facts.ts).
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
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.6,
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

  // === Delta exam pages ===
  const deltaSlugs = getAllDeltaSlugs();
  const deltaPages: MetadataRoute.Sitemap = deltaSlugs.map(({ certification, release }) => ({
    url: `${BASE_URL}/${certification}/delta/${release}`,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // === Courses ===
  const courses = getAllCourses();
  const courseDates = courses.map((course) => new Date(course.updated).getTime());
  const coursePages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/courses`,
      lastModified: courseDates.length ? new Date(Math.max(...courseDates)) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    },
    ...courses.map((course) => ({
      url: `${BASE_URL}/courses/${course.slug}`,
      lastModified: new Date(course.updated),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

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

  const lastReviewed = new Date(LAST_REVIEWED_ISO);
  return [
    ...staticPages,
    ...certPages,
    ...practiceQuestionPages,
    ...topicPages,
    ...mockExamPages,
    ...comparePages,
    ...blogPages,
    ...coursePages,
    ...deltaPages,
    ...versionDiffPages,
  ]
    .filter((entry) => isIndexablePath(entry.url.slice(BASE_URL.length) || "/"))
    .map((entry) => ({ ...entry, lastModified: entry.lastModified ?? lastReviewed }));
}
