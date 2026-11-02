import { describe, expect, it } from "vitest";
import {
  INDEXABLE_COMPARE_SLUGS,
  INDEXABLE_DELTA_PAGES,
  INDEXABLE_TOPIC_PAGES,
  isIndexableCertPage,
  isIndexableDeltaPage,
  isIndexablePath,
  robotsForCertPage,
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

describe("isIndexableCertPage (lib/seo-indexing.ts)", () => {
  it("noindexes landing, hub and prep pages of a cert with no questions", () => {
    for (const page of ["", "practice-questions", "prepare"]) {
      expect(isIndexableCertPage("cta", page, 0)).toBe(false);
      expect(robotsForCertPage("cta", page, 0)).toEqual({ index: false, follow: true });
      expect(isIndexableCertPage("csa", page, 216)).toBe(true);
      expect(robotsForCertPage("csa", page, 216)).toEqual({ index: true, follow: true });
    }
  });

  it("still applies the path rules", () => {
    expect(isIndexableCertPage("csa", "mock-exam", 216)).toBe(false);
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

  it("leaves out the pages of certs with no questions", async () => {
    const urls = (await sitemap()).map((e) => e.url);
    const base = "https://snready.com";
    for (const page of ["", "/practice-questions", "/prepare"]) {
      expect(urls).not.toContain(`${base}/cta${page}`);
      expect(urls).toContain(`${base}/csa${page}`);
    }
  });

  it("lists the practice questions index and every study guide, with no duplicates", async () => {
    const urls = (await sitemap()).map((e) => e.url);
    const base = "https://snready.com";
    expect(urls).toContain(`${base}/practice-questions`);
    for (const slug of ["csa", "cad", "cpoa", "cis-df", "cis-csm", "cis-discovery", "cis-ham", "cis-itsm", "cis-sam", "cis-sm", "cis-spm", "cis-tprm"]) {
      expect(urls).toContain(`${base}/${slug}/study-guide`);
    }
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("dates delta pages by their questions, never before the last review", async () => {
    const entry = (await sitemap()).find((e) => e.url.endsWith("/csa/delta/brazil"));
    expect(entry?.lastModified).toEqual(new Date("2026-10-21T00:00:00.000Z"));
  });
});
