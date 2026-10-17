import { describe, expect, it } from "vitest";
import {
  INDEXABLE_COMPARE_SLUGS,
  INDEXABLE_DELTA_PAGES,
  INDEXABLE_TOPIC_PAGES,
  isIndexablePath,
  robotsForPath,
} from "@/lib/seo-indexing";
import { getAllComparisonSlugs } from "@/lib/comparisons";
import { getAllDeltaSlugs, getAllTopicSlugs } from "@/lib/data";
import sitemap from "@/app/sitemap";

describe("isIndexablePath (lib/seo-indexing.ts)", () => {
  it.each([
    "/",
    "/csa",
    "/csa/practice-questions",
    "/csa/practice-questions/ui-navigation",
    "/csa/delta/zurich",
    "/compare",
    "/compare/csa-vs-cis-itsm",
    "/blog/some-post",
    "/courses",
    "/courses/service-mapping",
    "/version-diff/yokohama",
  ])("indexes %s", (path) => {
    expect(isIndexablePath(path)).toBe(true);
    expect(robotsForPath(path)).toEqual({ index: true, follow: true });
  });

  it.each([
    "/csa/mock-exam",
    "/csa/dumps",
    "/csa/practice-questions/incident-management",
    "/cad/delta/zurich",
    "/compare/csa-vs-cad",
    "/salaries",
    "/salaries/developer",
    "/vs",
    "/vs/examtopics",
    "/version-diff/yokohama/itsm",
  ])("noindexes %s", (path) => {
    expect(isIndexablePath(path)).toBe(false);
    expect(robotsForPath(path)).toEqual({ index: false, follow: true });
  });

  it("only allowlists pages that exist", () => {
    const compare = new Set(getAllComparisonSlugs());
    for (const slug of INDEXABLE_COMPARE_SLUGS) expect(compare.has(slug)).toBe(true);
    const topics = new Set(getAllTopicSlugs().map((t) => `${t.certification}/${t.topic}`));
    for (const key of INDEXABLE_TOPIC_PAGES) expect(topics.has(key)).toBe(true);
    const deltas = new Set(getAllDeltaSlugs().map((d) => `${d.certification}/${d.release}`));
    for (const key of INDEXABLE_DELTA_PAGES) expect(deltas.has(key)).toBe(true);
  });
});

describe("sitemap", () => {
  it("lists only indexable URLs, each with a lastmod", async () => {
    const entries = await sitemap();
    const base = "https://snready.com";
    for (const entry of entries) {
      expect(isIndexablePath(entry.url.slice(base.length) || "/")).toBe(true);
      expect(entry.lastModified).toBeDefined();
    }
    const urls = entries.map((e) => e.url);
    expect(urls).toContain(`${base}/courses`);
    expect(urls).toContain(`${base}/courses/service-mapping`);
    expect(urls.some((u) => u.endsWith("/mock-exam"))).toBe(false);
  });
});
