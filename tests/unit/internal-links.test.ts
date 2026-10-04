import { describe, expect, it } from "vitest";
import { extractInternalPaths, hasRepeatedTitleBrand, matchesRedirect, parseRedirectSources } from "@/scripts/internal-links";

describe("internal link checker", () => {
  it("extracts root-relative hrefs, decodes ampersands, and removes query/hash suffixes", () => {
    expect(extractInternalPaths(`
      <a href="/cad?mode=all&amp;page=2#questions">CAD</a>
      <a href='/csa#overview'>CSA</a><a href="/a&amp;b">Ampersand</a>
      <a href="/">Home</a><link href="/styles.css" />
      <a href="//example.com/path">External</a><a href="https://example.com">External</a>
      <a href="/_next/static/app.js">Asset</a><a href="/api/questions">API</a>
      <a href="#local">Local</a><a href="relative">Relative</a>
    `)).toEqual(["/cad", "/csa", "/a&b", "/", "/styles.css"]);
  });

  it("matches only exact redirect sources, whole parameters, and trailing splats", () => {
    const rules = parseRedirectSources(`
      # Ignored comment
      /old /new 301
      /practice/:cert/:topic /:cert/practice-questions/:topic 301
      /legacy/:cert/* /:cert/:splat 301
      /literal.html /new 301
    `);
    for (const pathname of ["/old", "/practice/cad/scripts", "/legacy/csa/", "/legacy/csa/a/b", "/literal.html"]) {
      expect(matchesRedirect(pathname, rules), pathname).toBe(true);
    }
    for (const pathname of ["/older", "/new", "/old/extra", "/practice/cad", "/practice//scripts", "/practice/cad/scripts/extra", "/literalXhtml"]) {
      expect(matchesRedirect(pathname, rules), pathname).toBe(false);
    }
  });

  it("flags repeated branding within a title only", () => {
    expect(hasRepeatedTitleBrand("<title>CAD | SNReady | SNReady</title>")).toBe(true);
    expect(hasRepeatedTitleBrand("<title>CAD | SNReady</title><p>| SNReady</p>")).toBe(false);
    expect(hasRepeatedTitleBrand("<title>CAD</title>")).toBe(false);
  });
});
