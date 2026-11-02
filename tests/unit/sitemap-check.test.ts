import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { parseRedirectSources } from "@/scripts/internal-links";
import { exportFileCandidates, extractSitemapUrls, sitemapEntryProblems } from "@/scripts/sitemap-check";

const page = (head: string) => `<!DOCTYPE html><html><head>${head}</head><body></body></html>`;
const URL_ = "https://snready.com/csa";

describe("sitemap checker", () => {
  it("extracts <loc> URLs", () => {
    expect(extractSitemapUrls("<urlset><url><loc>https://snready.com</loc></url><url><loc> https://snready.com/a?x=1&amp;y=2 </loc></url></urlset>"))
      .toEqual(["https://snready.com", "https://snready.com/a?x=1&y=2"]);
  });

  it("maps paths to export files", () => {
    expect(exportFileCandidates("/")).toEqual(["/index.html"]);
    expect(exportFileCandidates("/csa/")).toEqual(["/csa.html", "/csa/index.html"]);
  });

  it("accepts an indexable, self-canonical page", () => {
    const html = page(`<meta name="robots" content="index, follow"/><link rel="canonical" href="${URL_}"/>`);
    expect(sitemapEntryProblems(URL_, html, [])).toEqual([]);
  });

  it("rejects missing, redirected, noindexed and non-self-canonical pages", () => {
    expect(sitemapEntryProblems(URL_, null, [])).toEqual(["no exported HTML (would 404)"]);
    expect(sitemapEntryProblems("https://snready.com/csa/dumps", null, parseRedirectSources("/:cert/dumps /:cert/practice-questions 301")))
      .toEqual(["matches a _redirects rule (not a 200)"]);
    expect(sitemapEntryProblems(URL_, page(`<meta content="noindex, follow" name="robots"/><link href="${URL_}" rel="canonical"/>`), []))
      .toEqual(["robots noindex"]);
    expect(sitemapEntryProblems(URL_, page(`<link rel="canonical" href="https://snready.com/cad"/>`), []))
      .toEqual(["canonical is https://snready.com/cad"]);
    expect(sitemapEntryProblems(URL_, page(`<meta name="robots" content="index"/>`), []))
      .toEqual(["expected 1 canonical link, found 0"]);
    expect(sitemapEntryProblems(URL_, page(`<meta http-equiv="refresh" content="0;url=/x"/><link rel="canonical" href="${URL_}"/>`), []))
      .toEqual(["client-side redirect page"]);
  });
});

describe("public/_redirects", () => {
  const lines = fs.readFileSync("public/_redirects", "utf8").split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
  const rules = parseRedirectSources(lines.join("\n"));

  it("stays well under the Cloudflare Pages limit of 100 dynamic rules", () => {
    const dynamic = lines.filter((l) => /[:*]/.test(l.split(/\s+/)[0]));
    expect(dynamic.length).toBeLessThanOrEqual(90);
  });

  it("301s retired routes", () => {
    for (const pathname of ["/csa/dumps", "/study-guide", "/release/brazil", "/release/zurich", "/version-diff/xanadu/itsm", "/version-diff/washington-dc/itsm", "/certifications/category/itsm", "/cad/delta/zurich"]) {
      expect(rules.some((r) => r.test(pathname)), pathname).toBe(true);
    }
    for (const pathname of ["/version-diff/xanadu", "/version-diff/zurich/itsm", "/csa/practice-questions", "/csa/delta/brazil"]) {
      expect(rules.some((r) => r.test(pathname)), pathname).toBe(false);
    }
  });
});
