#!/usr/bin/env npx tsx
/** Check exported links and duplicate title branding after builds, or manually:
 *  npx tsx scripts/check-internal-links.ts [outDir]
 */
import fs from "node:fs";
import path from "node:path";
import { extractInternalPaths, hasRepeatedTitleBrand, matchesRedirect, parseRedirectSources } from "./internal-links";

function main() {
  const outDir = path.resolve(process.argv[2] || "out");
  if (!fs.existsSync(outDir)) {
    throw new Error(`No build output found at ${outDir}`);
  }
  const redirects = parseRedirectSources(fs.readFileSync("public/_redirects", "utf8"));
  const broken = new Map<string, Set<string>>();
  const validity = new Map<string, boolean>();
  const repeatedTitles: string[] = [];
  let scannedFiles = 0;
  let linkCount = 0;

  function walk(directory: string) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(file);
      } else if (entry.isFile() && entry.name.endsWith(".html")) {
        scannedFiles++;
        const html = fs.readFileSync(file, "utf8");
        const relativeFile = path.relative(outDir, file);
        if (hasRepeatedTitleBrand(html)) repeatedTitles.push(relativeFile);
        for (const pathname of extractInternalPaths(html)) {
          linkCount++;
          if (!validity.has(pathname)) {
            const target = path.join(outDir, pathname);
            validity.set(pathname, pathname === "/" ||
              [target, `${target}.html`, path.join(target, "index.html")].some((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ||
              matchesRedirect(pathname, redirects));
          }
          if (!validity.get(pathname)) {
            if (!broken.has(pathname)) broken.set(pathname, new Set());
            const refs = broken.get(pathname)!;
            if (refs.size < 3) refs.add(relativeFile);
          }
        }
      }
    }
  }

  walk(outDir);
  console.log(`Internal link check: ${linkCount} links (${validity.size} unique paths) across ${scannedFiles} HTML files; ${broken.size} broken paths; ${repeatedTitles.length} repeated title brands`);
  for (const [pathname, files] of [...broken].sort(([a], [b]) => a.localeCompare(b))) {
    console.error(`  ${pathname}: ${[...files].join(", ")}`);
  }
  for (const file of repeatedTitles) console.error(`  Repeated "| SNReady" in <title>: ${file}`);
  if (broken.size || repeatedTitles.length) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
