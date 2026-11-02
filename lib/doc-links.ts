// Turns the documentation URLs embedded in question explanations and references
// into link data, so they render as real <a href> links instead of plain text.
//
// Explanations usually end with "See https://…" or "Reference: https://…". That
// trailing reference is stripped out of the body and shown, together with the
// question's references/source URLs, in a "Sources" list under the explanation.

const URL_PATTERN = /https?:\/\/[^\s<>"'`]+/g;
// Sentence punctuation that ends up glued to a URL in prose ("See https://….")
const TRAILING_PUNCTUATION = /[.,;:!?)\]]+$/;

// Lead-ins that introduce a trailing URL reference: "See https://…", "Source: https://…",
// "References: https://… and https://…", "(See: https://…)".
const LEAD_IN = String.raw`(?:see(?:\s+also)?|sources?|references?|ref|docs?|documentation|more\s+info(?:rmation)?|learn\s+more|read\s+more)`;
const TRAILING_REFERENCE = new RegExp(
  String.raw`[\s(\[]*\b${LEAD_IN}\s*:?\s*` +
    String.raw`((?:https?:\/\/[^\s<>"'\`]+)(?:\s*(?:,|;|and|&)?\s*https?:\/\/[^\s<>"'\`]+)*)` +
    String.raw`[\s.)\]]*$`,
  "i"
);

export type TextSegment = { type: "text"; text: string } | { type: "link"; href: string };

function trimUrl(raw: string): string {
  let url = raw.trim().replace(TRAILING_PUNCTUATION, "");
  // Keep a closing paren that belongs to the URL, e.g. ".../Foo_(bar)".
  if (raw.trim().endsWith(")") && (url.match(/\(/g)?.length ?? 0) > (url.match(/\)/g)?.length ?? 0)) {
    url += ")";
  }
  return url;
}

// A usable http(s) URL with a real host ("https://<MID Server IP>/…" in prose is not).
export function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!/^https?:\/\/\S+$/i.test(trimmed)) return false;
  try {
    const url = new URL(trimmed);
    return (url.protocol === "http:" || url.protocol === "https:") && /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(url.hostname);
  } catch {
    return false;
  }
}

/** @deprecated use isHttpUrl */
export const isUrl = isHttpUrl;

export function splitTextWithUrls(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(URL_PATTERN)) {
    const href = trimUrl(match[0]);
    if (!isHttpUrl(href)) continue; // left as plain text
    const start = match.index ?? 0;
    if (start > lastIndex) segments.push({ type: "text", text: text.slice(lastIndex, start) });
    segments.push({ type: "link", href });
    lastIndex = start + href.length;
  }
  if (lastIndex < text.length) segments.push({ type: "text", text: text.slice(lastIndex) });
  return segments;
}

export interface StrippedExplanation {
  body: string; // explanation text without the trailing URL reference
  urls: string[]; // URLs taken from that trailing reference, in order
}

// Removes trailing "See <url>" / "Source: <url>" style references from explanation text.
// URLs elsewhere in the text are left in place (they are linkified when rendered).
export function stripTrailingReferences(text: string): StrippedExplanation {
  let body = text ?? "";
  const urls: string[] = [];
  for (;;) {
    const match = body.match(TRAILING_REFERENCE);
    if (!match || match.index === undefined) break;
    const found = (match[1].match(URL_PATTERN) ?? []).map(trimUrl);
    if (found.length === 0 || !found.every(isHttpUrl)) break;
    urls.unshift(...found);
    body = body.slice(0, match.index).trimEnd();
  }
  return { body: urls.length > 0 ? body : (text ?? "").trim(), urls };
}

const SMALL_WORDS = new Set(["a", "an", "and", "as", "at", "by", "for", "from", "in", "of", "on", "or", "the", "to", "vs", "with"]);
const ACRONYMS = new Set([
  "acl", "acls", "ai", "api", "apis", "atf", "cad", "ci", "cis", "cmdb", "csa", "csdm", "csm", "csv", "dv", "glide", "grc",
  "hr", "hrsd", "http", "id", "ip", "it", "itam", "itom", "itsm", "json", "kb", "kpi", "kpis", "ldap", "mid", "ml",
  "nlu", "oob", "pa", "qa", "rest", "sam", "sla", "slas", "soap", "spm", "sql", "sso", "ui", "url", "xml",
]);
const ACRONYM_CASE: Record<string, string> = { acls: "ACLs", apis: "APIs", kpis: "KPIs", slas: "SLAs", glide: "Glide" };

function titleCase(words: string[]): string {
  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (ACRONYM_CASE[lower]) return ACRONYM_CASE[lower];
      if (ACRONYMS.has(lower)) return lower.toUpperCase();
      if (/[A-Z].*[A-Z]/.test(word) && word === word.toUpperCase()) return word; // already an acronym
      if (index > 0 && SMALL_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

// "t_GenerateASchemaMap.html" → ["Generate", "A", "Schema", "Map"]; "change-types" → ["change", "types"].
function slugWords(segment: string): string[] {
  let slug = segment;
  try {
    slug = decodeURIComponent(slug);
  } catch {
    // keep raw segment
  }
  slug = slug.replace(/\.(s?html?|do|php|aspx?|md|pdf)$/i, "");
  slug = slug.replace(/^[ctr]_(?=[A-Za-z])/, ""); // ServiceNow doc topic prefixes: concept/task/reference
  slug = slug.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
  return slug.split(/[\s_\-+.]+/).filter(Boolean);
}

// Path segments that carry no meaning as a title.
const NOISE_SEGMENT = /^(index|default|home|page|pages|bundle|r|docs?|en|en-us|kb|lxp|dev|dev\.do|[a-z]{1,2}-p|\d+|[0-9a-f]{16,})$/i;

function meaningfulSlug(url: URL): string | undefined {
  // developer.servicenow.com keeps the real route in the hash: "dev.do#!/learn/…/share".
  const hashPath = url.hash.replace(/^#!?/, "").split("?")[0];
  const segments = [...url.pathname.split("/"), ...hashPath.split("/")].filter(Boolean);
  for (let i = segments.length - 1; i >= 0; i--) {
    const segment = segments[i].replace(/\.(s?html?|do)$/i, "");
    if (!segment || NOISE_SEGMENT.test(segment) || NOISE_SEGMENT.test(segments[i])) continue;
    return segments[i];
  }
  return undefined;
}

function siteName(url: URL): string | undefined {
  const host = url.hostname.replace(/^www\./, "");
  if (host === "docs.servicenow.com" || (host === "servicenow.com" && url.pathname.startsWith("/docs/"))) {
    return "ServiceNow Docs";
  }
  if (host === "servicenow.com" && url.pathname.startsWith("/community/")) return "ServiceNow Community";
  if (host === "developer.servicenow.com") return "ServiceNow Developer";
  if (host === "learning.servicenow.com" || host === "nowlearning.servicenow.com") return "ServiceNow University";
  if (host === "support.servicenow.com") return "ServiceNow Support";
  if (host === "store.servicenow.com") return "ServiceNow Store";
  if (host === "servicenow.com") return "ServiceNow";
  return undefined;
}

// Readable anchor text for a documentation URL, e.g.
// "https://www.servicenow.com/docs/r/it-service-management/change-types.html" → "ServiceNow Docs: Change Types".
export function docLinkLabel(href: string): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  const site = siteName(url);
  const article = url.searchParams.get("sysparm_article");
  if (site && article) return `${site}: ${article}`;
  if (site === "ServiceNow University" && url.searchParams.has("course_id")) return "ServiceNow University course";

  if (site) {
    const slug = meaningfulSlug(url);
    const words = slug ? slugWords(slug) : [];
    return words.length > 0 ? `${site}: ${titleCase(words)}` : site;
  }

  // Other sites: domain + cleaned path.
  const host = url.hostname.replace(/^www\./, "");
  const path = url.pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })
    .join("/")
    .replace(/\.(s?html?|php|aspx?)$/i, "");
  return path ? `${host}/${path}` : host;
}

export interface SourceLink {
  href: string;
  label: string;
}

// Loose shape shared by full questions, mock-exam questions and legacy quiz questions.
export interface ExplanationSourceInput {
  explanation?: string | { correct?: string; wrongAnswers?: readonly object[] } | null;
  references?: unknown;
  reference?: unknown;
  source?: unknown;
  sources?: unknown;
}

// Main explanation text. Legacy questions store the explanation as a plain string.
export function correctExplanationText(question: Pick<ExplanationSourceInput, "explanation">): string {
  const explanation = question.explanation;
  if (!explanation) return "";
  if (typeof explanation === "string") return explanation;
  return typeof explanation.correct === "string" ? explanation.correct : "";
}

// Pulls http(s) URLs (with optional titles) out of a reference/source field of any shape:
// a URL string, { url, title }, { documentation: { url } }, { course: { url } }, or arrays of these.
function collectUrlFields(value: unknown, add: (href: unknown, title?: unknown) => void, depth = 0): void {
  if (value == null || depth > 3) return;
  if (typeof value === "string") {
    add(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectUrlFields(item, add, depth + 1);
    return;
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.url === "string") add(record.url, record.title ?? record.label);
    if (typeof record.href === "string") add(record.href, record.title ?? record.label);
    for (const key of ["documentation", "course", "article"]) {
      if (record[key] && typeof record[key] === "object") collectUrlFields(record[key], add, depth + 1);
    }
  }
}

function dedupeKey(href: string): string {
  try {
    const url = new URL(href);
    url.hash = url.hash === "#" ? "" : url.hash;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    return `${host}${url.pathname.replace(/\/+$/, "")}${url.search}${url.hash}`;
  } catch {
    return href;
  }
}

export interface ExplanationWithSources {
  body: string; // explanation text to display (trailing URL reference removed)
  sources: SourceLink[]; // unique http(s) sources, labelled
}

// Splits an explanation into display text and a deduplicated, labelled list of sources:
// the trailing "See <url>" reference, then sources/references/reference/source fields, then
// wrong-answer reference URLs.
export function getExplanationWithSources(question: ExplanationSourceInput): ExplanationWithSources {
  const { body, urls } = stripTrailingReferences(correctExplanationText(question));
  // URLs still inside the body are linked inline, so they don't need repeating.
  const inline = new Set(
    splitTextWithUrls(body)
      .filter((segment): segment is { type: "link"; href: string } => segment.type === "link")
      .map((segment) => dedupeKey(segment.href))
  );

  const seen = new Map<string, number>();
  const found: { href: string; title?: string }[] = [];
  const add = (href: unknown, title?: unknown) => {
    if (typeof href !== "string") return;
    const clean = trimUrl(href);
    if (!isHttpUrl(clean)) return;
    const key = dedupeKey(clean);
    if (inline.has(key)) return;
    const cleanTitle = typeof title === "string" && title.trim() ? title.trim() : undefined;
    const existing = seen.get(key);
    if (existing !== undefined) {
      if (cleanTitle && !found[existing].title) found[existing].title = cleanTitle;
      return;
    }
    seen.set(key, found.length);
    found.push(cleanTitle ? { href: clean, title: cleanTitle } : { href: clean });
  };

  for (const url of urls) add(url);
  // Precomputed sources (withExplanationSources, mock-exam questions) keep their order.
  collectUrlFields(question.sources, add);
  collectUrlFields(question.references, add);
  collectUrlFields(question.reference, add);
  collectUrlFields(question.source, add);
  if (question.explanation && typeof question.explanation === "object") {
    for (const wrong of question.explanation.wrongAnswers ?? []) {
      collectUrlFields((wrong as { reference?: unknown })?.reference, add);
    }
  }

  // Several links can share a label (e.g. two course lessons); number the repeats.
  const labelCounts = new Map<string, number>();
  const sources = found.map(({ href, title }) => {
    const label = title ?? docLinkLabel(href);
    const count = (labelCounts.get(label) ?? 0) + 1;
    labelCounts.set(label, count);
    return { href, label: count > 1 ? `${label} (${count})` : label };
  });
  return { body, sources };
}

// Question data for client components: the trailing "See <url>" is cut from the explanation
// text and the sources travel as a separate field, so the raw reference text never ends up
// in the serialized page payload. getExplanationWithSources on the result gives the same
// body and sources as on the original.
export function withExplanationSources<T extends ExplanationSourceInput>(
  question: T
): T & { sources: SourceLink[] } {
  const { body, sources } = getExplanationWithSources(question);
  const { explanation } = question;
  let stripped = explanation;
  if (typeof explanation === "string") stripped = body;
  else if (explanation && typeof explanation.correct === "string") stripped = { ...explanation, correct: body };
  return { ...question, explanation: stripped, sources };
}

// Whether a URL is already listed in a Sources block (host case, "www." and trailing
// slashes ignored).
export function isListedSource(href: string, sources: readonly SourceLink[]): boolean {
  const clean = trimUrl(href);
  if (!isHttpUrl(clean)) return false;
  const key = dedupeKey(clean);
  return sources.some((source) => dedupeKey(source.href) === key);
}
