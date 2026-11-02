import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { REDIRECTED_BLOG_POSTS, RETIRED_SECTION_TARGETS, canonicalInternalHref, certHubPath } from "@/lib/hubs";
import { getPublishedPosts } from "@/lib/blog";
import { getAllPosts } from "@/data/blog/posts";
import { getCertificationSlugs } from "@/lib/data";

const redirects = fs
  .readFileSync(path.join(process.cwd(), "public/_redirects"), "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"))
  .map((line) => line.split(/\s+/));

describe("hub consolidation redirects (public/_redirects)", () => {
  it("stays within the rule budget", () => {
    expect(redirects.length).toBeLessThanOrEqual(90);
  });

  it("301s /{cert}/prepare to the hub with one placeholder rule", () => {
    expect(redirects).toContainEqual(["/:cert/prepare", "/:cert", "301"]);
  });

  it("301s every merged blog post to its hub", () => {
    const slugs = new Set(getAllPosts().map((post) => post.slug));
    const certs = new Set(getCertificationSlugs());
    for (const [slug, hub] of Object.entries(REDIRECTED_BLOG_POSTS)) {
      expect(slugs.has(slug)).toBe(true);
      expect(certs.has(hub.slice(1))).toBe(true);
      expect(redirects).toContainEqual([`/blog/${slug}`, hub, "301"]);
    }
  });

  it("301s retired sections, index and children", () => {
    for (const [section, target] of Object.entries(RETIRED_SECTION_TARGETS)) {
      expect(redirects).toContainEqual([`/${section}`, target, "301"]);
      expect(redirects).toContainEqual([`/${section}/*`, target, "301"]);
    }
  });

  it("never redirects to a URL that is itself consolidated (no chains)", () => {
    for (const [, destination] of redirects) {
      expect(destination).not.toMatch(/\/(practice-questions|prepare)$/);
      expect(destination).not.toMatch(/^\/(compare|vs)(\/|$)/);
    }
  });
});

describe("published blog posts", () => {
  it("exclude posts that redirect to a hub", () => {
    const published = getPublishedPosts().map((post) => post.slug);
    for (const slug of Object.keys(REDIRECTED_BLOG_POSTS)) expect(published).not.toContain(slug);
    expect(published.length).toBe(getAllPosts().length - Object.keys(REDIRECTED_BLOG_POSTS).length);
  });
});

describe("canonicalInternalHref", () => {
  it.each([
    ["/csa/practice-questions", "/csa#practice-questions"],
    ["/cis-itsm/practice-questions#questions", "/cis-itsm#questions"],
    ["/cad/prepare", "/cad"],
    ["/cad/prepare#real-experiences", "/cad"],
    ["/blog/servicenow-csa-practice-test-200-questions-2026", "/csa"],
    ["/compare/csa-vs-cad", "/certification-paths"],
    ["/vs/examtopics", "/how-questions-are-made"],
  ])("maps %s to %s", (href, expected) => {
    expect(canonicalInternalHref(href)).toBe(expected);
  });

  it.each([
    "/csa",
    "/practice-questions",
    "/csa/practice-questions/ui-navigation",
    "/csa/study-guide",
    "/blog/how-to-pass-servicenow-csa-first-time",
    "/salaries",
  ])("leaves %s alone", (href) => {
    expect(canonicalInternalHref(href)).toBe(href);
  });

  it("uses /{cert} as the hub", () => {
    expect(certHubPath("cis-df")).toBe("/cis-df");
  });
});
