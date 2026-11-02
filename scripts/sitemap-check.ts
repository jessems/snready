/** Pure helpers for checking that sitemap URLs are 200, indexable and self-canonical in exported HTML. */
import { matchesRedirect } from "./internal-links";

export function extractSitemapUrls(xml: string): string[] {
  return Array.from(xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g), (match) => match[1].replace(/&amp;/g, "&"));
}

function attribute(tag: string, name: string): string | undefined {
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2];
}

function tags(html: string, tagName: string): string[] {
  return Array.from(html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi")), (match) => match[0]);
}

/** Candidate export files for a pathname, as Cloudflare Pages resolves them. */
export function exportFileCandidates(pathname: string): string[] {
  const clean = pathname.replace(/\/+$/, "");
  return clean ? [`${clean}.html`, `${clean}/index.html`] : ["/index.html"];
}

/**
 * Problems with one sitemap URL, given the exported HTML for its path (null when
 * no file exists). An empty list means the URL is a 200, indexable, self-canonical page.
 */
export function sitemapEntryProblems(url: string, html: string | null, redirects: RegExp[]): string[] {
  const pathname = new URL(url).pathname;
  if (matchesRedirect(pathname, redirects)) return ["matches a _redirects rule (not a 200)"];
  if (html === null) return ["no exported HTML (would 404)"];

  const problems: string[] = [];
  const metas = tags(html, "meta");
  if (metas.some((tag) => attribute(tag, "http-equiv")?.toLowerCase() === "refresh") || html.includes("NEXT_REDIRECT")) {
    problems.push("client-side redirect page");
  }
  const robots = metas.filter((tag) => /^(robots|googlebot)$/i.test(attribute(tag, "name") ?? ""));
  if (robots.some((tag) => /noindex|none/i.test(attribute(tag, "content") ?? ""))) problems.push("robots noindex");

  const canonicals = tags(html, "link").filter((tag) => attribute(tag, "rel")?.toLowerCase() === "canonical");
  if (canonicals.length !== 1) {
    problems.push(`expected 1 canonical link, found ${canonicals.length}`);
  } else {
    const href = attribute(canonicals[0], "href")?.replace(/&amp;/g, "&");
    if (href !== url) problems.push(`canonical is ${href}`);
  }
  return problems;
}
