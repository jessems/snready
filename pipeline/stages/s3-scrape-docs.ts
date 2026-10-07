// S3a Docs scrape: crawl each doc seed's subtree in the markdown mirror.
// S3b (course scraping) is not implemented yet; courses stay "skipped" in sources.json.
import path from "node:path";
import { canonicalDocUrl, fetchDocMarkdown, frontmatter, linkedSubpaths } from "../lib/docs";
import { certFile, log, readJson, writeJson } from "../lib/io";
import type { CorpusPage, SourceManifest } from "../lib/types";

const MAX_DEPTH = 2;
const MAX_PAGES_PER_SEED = 20;
const CONCURRENCY = 6;

export async function runScrapeDocs(cert: string): Promise<CorpusPage[]> {
  const manifest = readJson<SourceManifest>(certFile(cert, "sources.json"));
  const pages = new Map<string, CorpusPage>();
  let missing = 0;

  for (const seed of manifest.docs) {
    // Only follow links that stay inside the seed's own docs directory.
    const scope = path.posix.dirname(seed.subpath) + "/";
    let frontier = [seed.subpath];
    let seedCount = 0;

    for (let depth = 0; depth <= MAX_DEPTH && frontier.length && seedCount < MAX_PAGES_PER_SEED; depth++) {
      const batch = frontier.filter((s) => !pages.has(s)).slice(0, MAX_PAGES_PER_SEED - seedCount);
      const next: string[] = [];
      for (let i = 0; i < batch.length; i += CONCURRENCY) {
        const results = await Promise.all(
          batch.slice(i, i + CONCURRENCY).map(async (subpath) => ({ subpath, md: await fetchDocMarkdown(subpath, manifest.release) }))
        );
        for (const { subpath, md } of results) {
          if (md === null) {
            missing++;
            continue;
          }
          const fm = frontmatter(md);
          pages.set(subpath, {
            subpath,
            canonicalUrl: fm.canonical_url || canonicalDocUrl(subpath, manifest.release),
            title: fm.title || subpath,
            seedSubpath: seed.subpath,
            depth,
          });
          seedCount++;
          next.push(...linkedSubpaths(md, manifest.release).filter((s) => s.startsWith(scope)));
        }
      }
      frontier = [...new Set(next)];
    }
  }

  const list = [...pages.values()];
  writeJson(certFile(cert, "corpus.json"), { cert, release: manifest.release, pages: list });
  log("s3", `${cert}: ${list.length} pages from ${manifest.docs.length} seeds (${missing} not in mirror)`);
  return list;
}
