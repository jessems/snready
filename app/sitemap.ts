import { MetadataRoute } from "next";
import { getCertificationSlugs, getAllTopicSlugs, getAllDeltaSlugs, getPublicDeltaQuestions, getTotalQuestionCount } from "@/lib/data";
import { getPublishedPosts } from "@/lib/blog";
import { getStudyGuideSlugs } from "@/lib/study-guides";
import { getReleaseSummary } from "@/lib/release-notes";
import { getAllCourses } from "@/lib/courses";
import { isIndexableCertPage, isIndexableDeltaPage, isIndexablePath } from "@/lib/seo-indexing";
import { LAST_REVIEWED_ISO, METHODOLOGY_UPDATED_ISO } from "@/lib/site-facts";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://snready.com";

/**
 * SITEMAP STRATEGY
 *
 * Only indexable pages belong here: a URL that is noindexed or canonicalised
 * elsewhere must not be listed. Every candidate URL is filtered through
 * isIndexablePath (lib/seo-indexing.ts), the same rule page metadata uses for
 * the robots meta tag. Cert pages need the cert to have questions
 * (isIndexableCertPage) and delta pages need at least one question
 * (isIndexableDeltaPage). Individual question pages are excluded.
 *
 * Each cert has one hub, /{cert} (lib/hubs.ts). /{cert}/practice-questions is
 * noindexed (canonical to the hub), /{cert}/prepare, /compare/* and /vs/* 301
 * elsewhere, and blog posts that 301 to a hub are not published.
 * scripts/check-sitemap.ts verifies the exported HTML after every build: each
 * listed URL must exist, be indexable and canonicalise to itself.
 *
 * lastModified is a real content date, never the build time: blog posts and
 * courses use their own dates, delta pages the date their questions were
 * written; every other page uses LAST_REVIEWED_ISO, the date its facts were
 * last reviewed by hand (lib/site-facts.ts).
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const certSlugs = getCertificationSlugs();
  const blogPosts = getPublishedPosts();
  const topicSlugs = getAllTopicSlugs();

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
      url: `${BASE_URL}/practice-questions`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/how-questions-are-made`,
      lastModified: new Date(METHODOLOGY_UPDATED_ISO),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/certification-paths`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/version-diff`,
      changeFrequency: "monthly",
      priority: 0.85,
    },
  ];

  // === Certification hubs (one per cert) ===
  // Certs without questions yet ("coming soon") are noindexed and left out.
  const certPages: MetadataRoute.Sitemap = [];
  for (const slug of certSlugs) {
    if (isIndexableCertPage(slug, "", getTotalQuestionCount(slug))) {
      certPages.push({ url: `${BASE_URL}/${slug}`, changeFrequency: "weekly", priority: 0.9 });
    }
  }

  // === Study guides (hand-written long-form, one per cert where it exists) ===
  const studyGuidePages: MetadataRoute.Sitemap = getStudyGuideSlugs().map((slug) => ({
    url: `${BASE_URL}/${slug}/study-guide`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

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

  // === Delta exam pages (only those with questions; empty ones are noindexed) ===
  const deltaPages: MetadataRoute.Sitemap = [];
  for (const { certification, release } of getAllDeltaSlugs()) {
    const questions = await getPublicDeltaQuestions(certification, release);
    if (!isIndexableDeltaPage(certification, release, questions.length)) continue;
    // The page changed when its newest questions were written, if after the last review.
    const written = questions.map((q) => Date.parse(q.meta?.generatedAt ?? "")).filter(Number.isFinite);
    const newest = Math.max(Date.parse(LAST_REVIEWED_ISO), ...written);
    deltaPages.push({
      url: `${BASE_URL}/${certification}/delta/${release}`,
      lastModified: new Date(newest),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    });
  }

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
    ...studyGuidePages,
    ...topicPages,
    ...mockExamPages,
    ...blogPages,
    ...coursePages,
    ...deltaPages,
    ...versionDiffPages,
  ]
    .filter((entry) => isIndexablePath(entry.url.slice(BASE_URL.length) || "/"))
    .map((entry) => ({ ...entry, lastModified: entry.lastModified ?? lastReviewed }));
}
