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
    "/csa/delta/brazil",
    "/cad/delta/brazil",
    "/cis-df/delta/brazil",
    "/cis-itsm/delta/brazil",
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
    "/csa/delta/zurich",
    "/cta/delta/brazil",
    "/cis-csm/delta/brazil",
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
    expect(isIndexableDeltaPage("csa", "brazil", 20)).toBe(true);
    expect(robotsForDeltaPage("csa", "brazil", 20)).toEqual({ index: true, follow: true });
    expect(isIndexableDeltaPage("csa", "brazil", 0)).toBe(false);
    expect(robotsForDeltaPage("csa", "brazil", 0)).toEqual({ index: false, follow: true });
  });

  it("noindexes delta pages that are not allowlisted, even with questions", () => {
    expect(isIndexableDeltaPage("cta", "brazil", 5)).toBe(false);
    expect(isIndexableDeltaPage("csa", "zurich", 12)).toBe(false);
  });

  it("indexes exactly the Brazil delta pages that have questions", async () => {
    const withQuestions: string[] = [];
    for (const { certification, release } of getAllDeltaSlugs()) {
      const questions = await getPublicDeltaQuestions(certification, release);
      const indexable = isIndexableDeltaPage(certification, release, questions.length);
      if (questions.length > 0) withQuestions.push(`${certification}/${release}`);
      expect(indexable).toBe(questions.length > 0);
    }
    expect(withQuestions.sort()).toEqual([...INDEXABLE_DELTA_PAGES].sort());
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
    for (const key of INDEXABLE_DELTA_PAGES) {
      const [cert, release] = key.split("/");
      expect(urls).toContain(`${base}/${cert}/delta/${release}`);
    }
    expect(urls.some((u) => u.includes("/delta/zurich"))).toBe(false);
    expect(urls).not.toContain(`${base}/cta/delta/brazil`);
  });
});
