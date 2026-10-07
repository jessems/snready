// ServiceNow docs access. Content comes from the official LLM-oriented markdown mirror
// (github.com/ServiceNow/ServiceNowDocs), search from the docs site's khub API.
import fs from "node:fs";
import path from "node:path";
import { hash, paths, readJson, writeJson } from "./io";

const RAW_BASE = "https://raw.githubusercontent.com/ServiceNow/ServiceNowDocs";

/** "https://www.servicenow.com/docs/r/australia/a/b/c.html" → "a/b/c" (release stripped). */
export function docSubpath(url: string, release: string): string | null {
  const docsMatch = url.match(/\/docs\/r\/(.+?)(?:\.html)?(?:[?#].*)?$/);
  if (docsMatch) return stripRelease(docsMatch[1], release);
  const rawMatch = url.match(/\/ServiceNowDocs\/[^/]+\/markdown\/(.+?)\.md$/);
  if (rawMatch) return stripRelease(rawMatch[1], release);
  return null;
}

function stripRelease(subpath: string, release: string): string {
  return subpath.startsWith(`${release}/`) ? subpath.slice(release.length + 1) : subpath;
}

export function canonicalDocUrl(subpath: string, release: string): string {
  return `https://www.servicenow.com/docs/r/${release}/${subpath}.html`;
}

/** Fetch a page as markdown, cached on disk. Returns null when the mirror has no such page. */
export async function fetchDocMarkdown(subpath: string, release: string): Promise<string | null> {
  const cacheFile = path.join(paths.docsCache(release), `${subpath}.md`);
  const missFile = `${cacheFile}.missing`;
  if (fs.existsSync(cacheFile)) return fs.readFileSync(cacheFile, "utf8");
  if (fs.existsSync(missFile)) return null;

  const res = await fetch(`${RAW_BASE}/${release}/markdown/${subpath}.md`);
  fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
  if (res.status === 404) {
    fs.writeFileSync(missFile, "");
    return null;
  }
  if (!res.ok) throw new Error(`docs fetch ${subpath}: HTTP ${res.status}`);
  const text = await res.text();
  fs.writeFileSync(cacheFile, text);
  return text;
}

/** Links from a mirror page to other mirror pages, as subpaths. */
export function linkedSubpaths(markdown: string, release: string): string[] {
  const out = new Set<string>();
  for (const match of markdown.matchAll(/\]\((https:\/\/raw\.githubusercontent\.com\/ServiceNow\/ServiceNowDocs\/[^)\s]+\.md)\)/g)) {
    const subpath = docSubpath(match[1], release);
    if (subpath) out.add(subpath);
  }
  return [...out];
}

export function frontmatter(markdown: string): Record<string, string> {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  return Object.fromEntries(
    match[1]
      .split("\n")
      .map((line) => line.match(/^([a-z_]+):\s*(.*)$/))
      .filter((m): m is RegExpMatchArray => m !== null)
      .map((m) => [m[1], m[2].replace(/^"|"$/g, "").replace(/\\([_()[\]*])/g, "$1")]) // drop markdown escapes
  );
}

export interface SearchHit {
  title: string;
  mapTitle: string;
  readerUrl: string;
}

/** khub search, cached. Only hits for the requested release are returned. */
export async function searchDocs(query: string, release: string, perPage = 10): Promise<SearchHit[]> {
  const cacheFile = path.join(paths.work, "search", release, `${hash(query)}.json`);
  if (fs.existsSync(cacheFile)) return readJson<SearchHit[]>(cacheFile);

  const res = await fetch("https://www.servicenow.com/docs/api/khub/topics/search", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ query, contentLocale: "en-US", scope: "DEFAULT", page: 1, perPage }),
  });
  if (!res.ok) throw new Error(`docs search '${query}': HTTP ${res.status}`);
  const body = (await res.json()) as {
    results?: Array<{ htmlTitle?: string; mapTitle?: string; occurrences?: Array<{ readerUrl?: string }> }>;
  };
  const hits: SearchHit[] = [];
  for (const result of body.results ?? []) {
    const readerUrl = result.occurrences?.map((o) => o.readerUrl).find((u) => u?.includes(`/r/${release}/`));
    if (!readerUrl) continue;
    hits.push({
      title: (result.htmlTitle ?? "").replace(/<[^>]+>/g, ""),
      mapTitle: result.mapTitle ?? "",
      readerUrl,
    });
  }
  writeJson(cacheFile, hits);
  return hits;
}
