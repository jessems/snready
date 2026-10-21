import { describe, expect, it } from "vitest";
import {
  INDEXABLE_COMPARE_SLUGS,
  INDEXABLE_DELTA_PAGES,
  INDEXABLE_TOPIC_PAGES,
  isIndexableDeltaPage,
  isIndexablePath,
  robotsForDeltaPage,
  robotsForPath,
} from "@/lib/seo-indexing";
import { getAllComparisonSlugs } from "@/lib/comparisons";
import { getAllDeltaSlugs, getAllTopicSlugs, getPublicDeltaQuestions } from "@/lib/data";
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
    "/csa/delta/brazil",
    "/cad/delta/brazil",
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

describe("isIndexableDeltaPage (lib/seo-indexing.ts)", () => {
  it("indexes an allowlisted delta page only when it has questions", () => {
    expect(isIndexableDeltaPage("csa", "zurich", 12)).toBe(true);
    expect(robotsForDeltaPage("csa", "zurich", 12)).toEqual({ index: true, follow: true });
    expect(isIndexableDeltaPage("csa", "zurich", 0)).toBe(false);
    expect(robotsForDeltaPage("csa", "zurich", 0)).toEqual({ index: false, follow: true });
  });

  it("noindexes delta pages that are not allowlisted, even with questions", () => {
    expect(isIndexableDeltaPage("cad", "zurich", 6)).toBe(false);
    expect(isIndexableDeltaPage("csa", "brazil", 5)).toBe(false);
  });

  it("noindexes every delta page that has no questions yet (Brazil)", async () => {
    for (const { certification, release } of getAllDeltaSlugs().filter((d) => d.release === "brazil")) {
      const questions = await getPublicDeltaQuestions(certification, release);
      expect(questions).toEqual([]);
      expect(isIndexableDeltaPage(certification, release, questions.length)).toBe(false);
    }
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
    expect(urls).toContain(`${base}/csa/delta/zurich`);
    expect(urls.some((u) => u.includes("/delta/brazil"))).toBe(false);
  });
});
