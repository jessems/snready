#!/usr/bin/env node
/**
 * Verifies the hub consolidation (lib/hubs.ts) against a static export and
 * public/_redirects. Run after `npm run build`:
 *
 *   node scripts/verify-consolidation.mjs [outDir] [--before <oldOutDir>]
 *
 * 1. Every removed or demoted URL must either match a 301 rule in
 *    public/_redirects whose (substituted) target is a built, indexable page
 *    that is not itself redirected, or be a built page with robots noindex.
 *    Removed/demoted URLs are the manifest below plus, with --before, every
 *    page that was indexable in an older export but is no longer an indexable
 *    200 page.
 * 2. Every sitemap URL must be a built page that no redirect rule matches and
 *    that is not noindexed (and canonicalises to itself).
 * 3. Links on indexable pages must not point at a redirected URL or at a
 *    noindexed duplicate of a hub (/{cert}/practice-questions).
 *
 * Cloudflare Pages applies _redirects before static assets, first match wins,
 * so a URL that matches a rule is a redirect even if HTML for it was built.
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const beforeIndex = args.indexOf("--before");
const beforeDir = beforeIndex >= 0 ? path.resolve(args[beforeIndex + 1]) : null;
const positional = args.filter((_, i) => beforeIndex < 0 || (i !== beforeIndex && i !== beforeIndex + 1));
const outDir = path.resolve(positional[0] || "out");
const redirectsFile = path.resolve("public/_redirects");
const BASE = "https://snready.com";
const MAX_RULES = 90;

// URLs removed or demoted by the consolidation that can't be derived from the
// current code (their routes or slug lists were deleted). Per-cert URLs are
// added below from data/certifications.json.
const MANIFEST = [
  "/blog/servicenow-csa-practice-test-200-questions-2026",
  "/blog/servicenow-cad-practice-test-200-questions-2026",
  "/blog/servicenow-cis-itsm-practice-test-160-questions-2026",
  "/compare",
  ...[
    "cad-vs-cis-itsm", "cad-vs-cta", "cis-csm-vs-cis-fsm", "cis-csm-vs-cis-hr",
    "cis-discovery-vs-cis-em", "cis-discovery-vs-cis-sm", "cis-itsm-vs-cis-csm",
    "cis-itsm-vs-cis-hr", "cis-sam-vs-cis-ham", "cis-sm-vs-cis-em", "cis-vr-vs-cis-sir",
    "cpoa-vs-cad", "cpoa-vs-cis-itsm", "csa-vs-cad", "csa-vs-cis-csm", "csa-vs-cis-itsm",
    "csa-vs-cpoa", "csa-vs-cta",
  ].map((slug) => `/compare/${slug}`),
  "/vs",
  ...["examtopics", "servicenow-nowlearning", "skillcertpro", "udemy"].map((slug) => `/vs/${slug}`),
  "/salaries",
  ...["administrator", "architect", "canada", "consultant", "developer", "germany", "manager", "uk", "usa"]
    .map((slug) => `/salaries/${slug}`),
];

// Known, intentional exceptions: reported separately, they don't fail the run.
const EXCEPTIONS = {
  "/cta/prepare":
    "301s to /cta, which is noindexed on purpose: CTA has no practice questions yet (coming soon).",
};

// ---------- _redirects ----------

function parseRules(text) {
  return text.split(/\r?\n/).flatMap((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return [];
    const [source, destination, status = "302"] = trimmed.split(/\s+/);
    const names = [];
    const pattern = source.split("/").map((segment, i, all) => {
      if (segment === "*" && i === all.length - 1) { names.push("splat"); return "(.*)"; }
      if (/^:\w+$/.test(segment)) { names.push(segment.slice(1)); return "([^/]+)"; }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("/");
    return [{ line: index + 1, source, destination, status, names, regex: new RegExp(`^${pattern}$`) }];
  });
}

const rules = parseRules(fs.readFileSync(redirectsFile, "utf8"));

/** First matching rule (Cloudflare Pages semantics) with the substituted target. */
function matchRedirect(pathname) {
  for (const rule of rules) {
    const match = pathname.match(rule.regex);
    if (!match) continue;
    let target = rule.destination;
    rule.names.forEach((name, i) => { target = target.split(`:${name}`).join(match[i + 1]); });
    return { rule, target: target.replace(/\/+$/, "") || "/" };
  }
  return null;
}

// ---------- built pages ----------

function htmlFor(dir, pathname) {
  const clean = pathname.replace(/\/+$/, "");
  const candidates = clean ? [`${clean}.html`, `${clean}/index.html`] : ["/index.html"];
  for (const candidate of candidates) {
    const file = path.join(dir, candidate);
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return fs.readFileSync(file, "utf8");
  }
  return null;
}

function metaOf(html) {
  const robots = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((m) => m[0])
    .filter((tag) => /name=["'](robots|googlebot)["']/i.test(tag))
    .map((tag) => (tag.match(/content=["']([^"']*)["']/i) || [])[1] || "");
  const canonicals = [...html.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)]
    .map((m) => (m[0].match(/href=["']([^"']*)["']/i) || [])[1]);
  return {
    noindex: robots.some((content) => /noindex|none/i.test(content)),
    canonical: canonicals.length === 1 ? canonicals[0].replace(/&amp;/g, "&") : null,
    clientRedirect: /http-equiv=["']refresh["']/i.test(html) || html.includes("NEXT_REDIRECT"),
  };
}

function listPages(dir) {
  const pages = [];
  (function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "_next") walk(file);
      } else if (entry.name.endsWith(".html")) {
        const rel = "/" + path.relative(dir, file).split(path.sep).join("/");
        const pathname = rel.replace(/(\/index)?\.html$/, "") || "/";
        if (/^\/(404|500|_not-found)$/.test(pathname)) continue;
        pages.push(pathname);
      }
    }
  })(dir);
  return pages.sort();
}

/** An indexable 200 page: built, no redirect rule, not noindexed, no client redirect. */
function indexableProblem(pathname) {
  const redirect = matchRedirect(pathname);
  if (redirect) return `matches redirect rule line ${redirect.rule.line} (${redirect.rule.source} -> ${redirect.rule.destination})`;
  const html = htmlFor(outDir, pathname);
  if (html === null) return "no built HTML (would 404)";
  const meta = metaOf(html);
  if (meta.noindex) return "robots noindex";
  if (meta.clientRedirect) return "client-side redirect page";
  return null;
}

// ---------- checks ----------

if (!fs.existsSync(outDir)) {
  console.error(`No build output at ${outDir}. Run \`npm run build\` first.`);
  process.exit(1);
}

const certSlugs = JSON.parse(fs.readFileSync("data/certifications.json", "utf8")).certifications
  .map((cert) => cert.slug)
  .filter(Boolean);

const demoted = new Map(); // pathname -> why it is on the list
for (const slug of certSlugs) {
  demoted.set(`/${slug}/prepare`, "merged into hub");
  demoted.set(`/${slug}/practice-questions`, "hub duplicate");
}
for (const pathname of MANIFEST) demoted.set(pathname, "manifest");
if (beforeDir) {
  for (const pathname of listPages(beforeDir)) {
    const html = htmlFor(beforeDir, pathname);
    if (html && !metaOf(html).noindex && indexableProblem(pathname)) {
      if (!demoted.has(pathname)) demoted.set(pathname, "was indexable in --before build");
    }
  }
}

const results = { redirected: [], noindexed: [], exceptions: [], failures: [] };
for (const [pathname, why] of [...demoted].sort(([a], [b]) => a.localeCompare(b))) {
  const redirect = matchRedirect(pathname);
  let problem = null;
  if (redirect) {
    if (redirect.rule.status !== "301") problem = `redirect rule line ${redirect.rule.line} is ${redirect.rule.status}, not 301`;
    else {
      const targetProblem = indexableProblem(redirect.target);
      if (targetProblem) problem = `301 target ${redirect.target}: ${targetProblem}`;
      else results.redirected.push(`${pathname} -> ${redirect.target}`);
    }
  } else {
    const html = htmlFor(outDir, pathname);
    if (html === null) problem = "no redirect rule and no built HTML (would 404)";
    else if (!metaOf(html).noindex) problem = "built page is still indexable (no noindex, no redirect)";
    else {
      const canonical = metaOf(html).canonical;
      results.noindexed.push(`${pathname} (noindex${canonical ? `, canonical ${canonical.replace(BASE, "")}` : ""})`);
    }
  }
  if (problem) {
    if (EXCEPTIONS[pathname]) results.exceptions.push(`${pathname}: ${problem}. ${EXCEPTIONS[pathname]}`);
    else results.failures.push(`${pathname} [${why}]: ${problem}`);
  }
}

// Demoted hub duplicates must canonicalise to their hub.
const canonicalFailures = [];
for (const slug of certSlugs) {
  const html = htmlFor(outDir, `/${slug}/practice-questions`);
  if (!html) continue;
  const canonical = metaOf(html).canonical;
  if (canonical !== `${BASE}/${slug}`) canonicalFailures.push(`/${slug}/practice-questions: canonical is ${canonical}, expected ${BASE}/${slug}`);
}

// Sitemap
const sitemapXml = fs.readFileSync(path.join(outDir, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemapXml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));
const sitemapFailures = [];
for (const url of sitemapUrls) {
  const pathname = new URL(url).pathname.replace(/\/+$/, "") || "/";
  const problem = indexableProblem(pathname);
  if (problem) { sitemapFailures.push(`${url}: ${problem}`); continue; }
  const canonical = metaOf(htmlFor(outDir, pathname)).canonical;
  if (canonical !== url) sitemapFailures.push(`${url}: canonical is ${canonical}`);
}
const duplicateSitemapUrls = sitemapUrls.length - new Set(sitemapUrls).size;

// Built pages and indexability
const pages = listPages(outDir);
const indexablePages = pages.filter((pathname) => !indexableProblem(pathname));
const builtButRedirected = pages.filter((pathname) => matchRedirect(pathname));
const indexableNotInSitemap = indexablePages.filter((pathname) => !sitemapUrls.includes(pathname === "/" ? BASE : BASE + pathname));

// Internal links from indexable pages
const hubDuplicate = new RegExp(`^/(${certSlugs.map((s) => s.replace(/[-]/g, "\\-")).join("|")})/practice-questions$`);
const linkFailures = new Map();
let linkCount = 0;
for (const pathname of indexablePages) {
  const html = htmlFor(outDir, pathname);
  for (const match of html.matchAll(/\bhref\s*=\s*(["'])(\/[^"']*)\1/gi)) {
    const href = match[2].replace(/&amp;/g, "&");
    if (href.startsWith("//") || href.startsWith("/_next/") || href.startsWith("/api/")) continue;
    const target = href.split(/[?#]/, 1)[0].replace(/\/+$/, "") || "/";
    linkCount++;
    let reason = null;
    if (hubDuplicate.test(target)) reason = "noindexed hub duplicate";
    else if (matchRedirect(target)) reason = "redirected URL";
    if (reason) {
      const key = `${target} (${reason})`;
      if (!linkFailures.has(key)) linkFailures.set(key, new Set());
      if (linkFailures.get(key).size < 3) linkFailures.get(key).add(pathname);
    }
  }
}

// ---------- report ----------

const print = (title, items) => {
  console.log(`\n${title}: ${items.length}`);
  for (const item of items) console.log(`  ${item}`);
};

console.log(`Hub consolidation check (${path.relative(process.cwd(), outDir) || outDir}, ${path.relative(process.cwd(), redirectsFile)})`);
console.log(`_redirects rules: ${rules.length} (limit ${MAX_RULES}), of which 301: ${rules.filter((r) => r.status === "301").length}`);
console.log(`Built HTML pages: ${pages.length}; indexable 200 pages: ${indexablePages.length}; noindexed or redirected: ${pages.length - indexablePages.length}`);
console.log(`Built pages shadowed by a redirect rule (dead output): ${builtButRedirected.length}`);
console.log(`Removed/demoted URLs checked: ${demoted.size}${beforeDir ? ` (incl. --before ${beforeDir})` : ""}`);
print("  OK, 301 to an indexable built page", results.redirected);
print("  OK, built page with noindex", results.noindexed);
print("  Accepted exceptions", results.exceptions);
print("  FAIL", results.failures);
print("Hub duplicates with a wrong canonical (FAIL)", canonicalFailures);
console.log(`\nSitemap URLs: ${sitemapUrls.length}; duplicates: ${duplicateSitemapUrls}`);
print("  Sitemap URLs that are noindexed, redirected, missing or not self-canonical (FAIL)", sitemapFailures);
print("Indexable pages missing from the sitemap (warning)", indexableNotInSitemap);
console.log(`\nInternal links on indexable pages: ${linkCount}`);
print("  Link targets that are redirected or a noindexed hub duplicate (FAIL)",
  [...linkFailures].map(([key, from]) => `${key} <- ${[...from].join(", ")}`));

const failed =
  rules.length > MAX_RULES ||
  results.failures.length ||
  canonicalFailures.length ||
  sitemapFailures.length ||
  duplicateSitemapUrls ||
  linkFailures.size;
console.log(`\n${failed ? "FAILED" : "PASSED"}: ${results.redirected.length} redirected, ${results.noindexed.length} noindexed, ${results.exceptions.length} accepted exceptions, ${results.failures.length + canonicalFailures.length + sitemapFailures.length + linkFailures.size} failures`);
process.exitCode = failed ? 1 : 0;
