/** Pure helpers for checking links in exported HTML. */
export function extractInternalPaths(html: string): string[] {
  const paths: string[] = [];
  for (const match of html.matchAll(/\bhref\s*=\s*(["'])(\/[^"']*)\1/gi)) {
    const href = match[2].replace(/&amp;/g, "&");
    if (href.startsWith("//") || href.startsWith("/_next/") || href.startsWith("/api/")) continue;
    paths.push(href.split(/[?#]/, 1)[0]);
  }
  return paths;
}

export function parseRedirectSources(redirects: string): RegExp[] {
  return redirects.split(/\r?\n/).flatMap((line) => {
    const [source, destination] = line.trim().split(/\s+/);
    if (!source.startsWith("/") || source.startsWith("//") || !destination) return [];
    const segments = source.split("/");
    const pattern = segments.map((segment, index) => {
      if (segment === "*" && index === segments.length - 1) return ".*";
      if (/^:[\w]+$/.test(segment)) return "[^/]+";
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("/");
    return [new RegExp(`^${pattern}$`)];
  });
}

export function matchesRedirect(pathname: string, sources: RegExp[]): boolean {
  return sources.some((source) => source.test(pathname));
}

export function hasRepeatedTitleBrand(html: string): boolean {
  return Array.from(html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/gi))
    .some((match) => (match[1].match(/\| SNReady/g) || []).length > 1);
}
