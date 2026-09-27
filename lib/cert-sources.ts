import { readFileSync } from "node:fs";
import { join } from "node:path";

// Official study sources per certification, as published by ServiceNow on the
// exam blueprint (KB article) and the ServiceNow University credential path.
// Source of truth: data/cert-sources/cert-sources.csv. Read at build time only.

export interface CertSourceItem {
  name: string;
  url?: string;
  format?: string;
  duration?: string;
  notes?: string;
  listedIn: string[];
}

export interface CertSourceDomain {
  name: string;
  weight: number;
  subtopics: string[];
}

export interface CertSources {
  blueprint: { url: string; kb?: string; updated?: string };
  credentialPathUrl?: string;
  checkedOn?: string;
  exam?: CertSourceItem;
  prerequisites: CertSourceItem[];
  domains: CertSourceDomain[];
  coreCourses: CertSourceItem[];
  additionalCourses: CertSourceItem[];
  recommendedCertifications: CertSourceItem[];
  docs: CertSourceItem[];
  otherResources: CertSourceItem[];
}

type Row = Record<string, string>;

export function parseCsv(text: string): Row[] {
  const records: string[][] = [];
  let field = "";
  let record: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      record.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      record.push(field);
      records.push(record);
      record = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field !== "" || record.length > 0) {
    record.push(field);
    records.push(record);
  }
  const [header, ...body] = records.filter((r) => r.some((f) => f !== ""));
  return body.map((r) =>
    Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])),
  );
}

// Credential path steps like "Complete optional recommended courses" are not core
const OPTIONAL_STEP = /optional|continue your/i;

function isCore(listedIn: string[]): boolean {
  return listedIn.some(
    (l) =>
      l === "blueprint: recommended" ||
      (l.startsWith("credential path") && !OPTIONAL_STEP.test(l)),
  );
}

function toItem(r: Row): CertSourceItem {
  return {
    name: r.name.trim(),
    url: r.url || undefined,
    format: r.format.trim() || undefined,
    duration: r.duration.trim() || undefined,
    notes: r.notes || undefined,
    listedIn: r.listed_in ? r.listed_in.split("; ") : [],
  };
}

export function groupCertSources(rows: Row[]): Record<string, CertSources> {
  const out: Record<string, CertSources> = {};
  for (const r of rows) {
    const slug = r.cert.toLowerCase();
    const s = (out[slug] ??= {
      blueprint: { url: "" },
      prerequisites: [],
      domains: [],
      coreCourses: [],
      additionalCourses: [],
      recommendedCertifications: [],
      docs: [],
      otherResources: [],
    });
    const item = toItem(r);
    switch (r.resource_type) {
      case "spec":
        s.blueprint = {
          url: r.url,
          kb: r.url.match(/sysparm_article=(KB\d+)/)?.[1],
          updated: r.notes.match(/Updated ([^']+)'/)?.[1],
        };
        s.checkedOn = r.checked_on || undefined;
        break;
      case "credential-path":
        s.credentialPathUrl = r.url;
        break;
      case "exam":
        s.exam = item;
        break;
      case "prerequisite-certification":
        s.prerequisites.push(item);
        break;
      case "domain":
        s.domains.push({
          name: item.name,
          weight: parseFloat(r.weight),
          subtopics: r.notes ? r.notes.split("; ") : [],
        });
        break;
      case "course":
        (isCore(item.listedIn) ? s.coreCourses : s.additionalCourses).push(
          item,
        );
        break;
      case "recommended-certification":
        s.recommendedCertifications.push(item);
        break;
      case "doc":
        s.docs.push(item);
        break;
      case "other-resource":
        s.otherResources.push(item);
        break;
    }
  }
  return out;
}

let cache: Record<string, CertSources> | null = null;

export function getCertSources(slug: string): CertSources | null {
  cache ??= groupCertSources(
    parseCsv(
      readFileSync(
        join(process.cwd(), "data/cert-sources/cert-sources.csv"),
        "utf8",
      ),
    ),
  );
  return cache[slug] ?? null;
}

const STOP = new Set(["and", "the", "of", "for", "in", "to", "use", "describe"]);
function tokens(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t && !STOP.has(t)),
  );
}

// Pair an official blueprint domain with one of our practice domains when the
// names clearly refer to the same thing and the weight is unchanged.
export function matchPracticeDomain<T extends { name: string; percentage: number }>(
  official: CertSourceDomain,
  practiceDomains: T[],
): T | undefined {
  const a = tokens(official.name);
  let best: T | undefined;
  let bestScore = 0;
  for (const d of practiceDomains) {
    if (Math.abs(d.percentage - official.weight) > 0.5) continue;
    const b = tokens(d.name);
    const shared = [...a].filter((t) => b.has(t)).length;
    const score = shared / Math.min(a.size, b.size);
    if (score > bestScore) {
      bestScore = score;
      best = d;
    }
  }
  return bestScore >= 0.6 ? best : undefined;
}
