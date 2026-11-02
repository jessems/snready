#!/usr/bin/env npx tsx
/**
 * Fails when out/sitemap.xml lists a URL that is not a 200, indexable,
 * self-canonical page in the static export. Runs after `npm run build`
 * (postbuild). Run manually:
 *   npx tsx scripts/check-sitemap.ts [outDir]
 */
import fs from "node:fs";
import path from "node:path";
import { parseRedirectSources } from "./internal-links";
import { exportFileCandidates, extractSitemapUrls, sitemapEntryProblems } from "./sitemap-check";

function main() {
  const outDir = path.resolve(process.argv[2] || "out");
  const sitemapFile = path.join(outDir, "sitemap.xml");
  if (!fs.existsSync(sitemapFile)) throw new Error(`No sitemap found at ${sitemapFile}. Run \`npm run build\` first.`);

  const redirects = parseRedirectSources(fs.readFileSync("public/_redirects", "utf8"));
  const urls = extractSitemapUrls(fs.readFileSync(sitemapFile, "utf8"));
  const failures: string[] = [];
  const seen = new Set<string>();
  for (const url of urls) {
    if (seen.has(url)) failures.push(`  ${url}: listed twice`);
    seen.add(url);
    const file = exportFileCandidates(new URL(url).pathname)
      .map((candidate) => path.join(outDir, candidate))
      .find((candidate) => fs.existsSync(candidate));
    const problems = sitemapEntryProblems(url, file ? fs.readFileSync(file, "utf8") : null, redirects);
    if (problems.length) failures.push(`  ${url}: ${problems.join("; ")}`);
  }

  console.log(`Sitemap check: ${urls.length} URLs; ${failures.length} problems`);
  for (const failure of failures) console.error(failure);
  if (!urls.length || failures.length) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
