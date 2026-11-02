// Turns the documentation URLs embedded in question explanations and references
// into link data, so they render as real <a href> links instead of plain text.

import type { Question } from "@/types";

const URL_PATTERN = /https?:\/\/[^\s<>"']+/g;
// Sentence punctuation that ends up glued to a URL in prose ("See https://….")
const TRAILING_PUNCTUATION = /[.,;:!?)\]]+$/;

export type TextSegment = { type: "text"; text: string } | { type: "link"; href: string };

export function splitTextWithUrls(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(URL_PATTERN)) {
    const raw = match[0];
    const href = raw.replace(TRAILING_PUNCTUATION, "");
    const start = match.index ?? 0;
    if (start > lastIndex) segments.push({ type: "text", text: text.slice(lastIndex, start) });
    segments.push({ type: "link", href });
    lastIndex = start + href.length;
  }
  if (lastIndex < text.length) segments.push({ type: "text", text: text.slice(lastIndex) });
  return segments;
}

export function isUrl(value: string): boolean {
  return /^https?:\/\/\S+$/.test(value.trim());
}

// Readable anchor text for a documentation URL.
export function docLinkLabel(href: string): string {
  let host: string;
  try {
    host = new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
  if (host === "docs.servicenow.com" || (host === "servicenow.com" && href.includes("/docs/"))) {
    return "ServiceNow product documentation";
  }
  if (host === "developer.servicenow.com") return "ServiceNow Developer documentation";
  if (host === "learning.servicenow.com" || host === "nowlearning.servicenow.com") {
    return "ServiceNow University course";
  }
  if (host === "support.servicenow.com") return "ServiceNow Support article";
  return host;
}

// Main explanation text. Legacy questions store the explanation as a plain string.
export function correctExplanationText(question: Pick<Question, "explanation">): string {
  const explanation = question.explanation as Question["explanation"] | string | undefined;
  if (!explanation) return "";
  if (typeof explanation === "string") return explanation;
  return typeof explanation.correct === "string" ? explanation.correct : "";
}

export interface ReferenceLink {
  href: string;
  title?: string; // set when the data gives the reference a title
}

export interface QuestionReferences {
  links: ReferenceLink[]; // unique URLs, not already linked inline in explanation.correct
  notes: string[]; // non-URL references, shown as text
}

// A few questions store references as { title, url } objects instead of strings.
type RawReference = string | { title?: string; url?: string } | null | undefined;

// Documentation links for a question: references, the documentation source, and
// wrong-answer references, minus URLs already linked inline in the explanation.
export function getQuestionReferences(question: Question): QuestionReferences {
  const inline = new Set(
    splitTextWithUrls(correctExplanationText(question))
      .filter((segment): segment is { type: "link"; href: string } => segment.type === "link")
      .map((segment) => segment.href)
  );
  const links: ReferenceLink[] = [];
  const notes: string[] = [];
  const addNote = (note: string | undefined) => {
    const clean = note?.trim();
    if (clean && !notes.includes(clean)) notes.push(clean);
  };
  const addLink = (href: unknown, title?: string) => {
    if (typeof href !== "string") return;
    const clean = href.trim().replace(TRAILING_PUNCTUATION, "");
    if (!isUrl(clean) || inline.has(clean) || links.some((link) => link.href === clean)) return;
    links.push(title?.trim() ? { href: clean, title: title.trim() } : { href: clean });
  };

  for (const reference of (question.references ?? []) as RawReference[]) {
    if (typeof reference === "string") {
      if (isUrl(reference)) addLink(reference);
      else addNote(reference);
    } else if (reference && typeof reference === "object") {
      if (reference.url && isUrl(reference.url)) addLink(reference.url, reference.title);
      else addNote(reference.title);
    }
  }
  addLink(question.source?.documentation?.url);
  const wrongAnswers = typeof question.explanation === "object" ? question.explanation.wrongAnswers : undefined;
  for (const wrong of wrongAnswers ?? []) addLink(wrong.reference);

  return { links, notes };
}
