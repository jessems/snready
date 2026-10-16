// Read-only access to data/cert-sources/cert-sources.csv: the official exam
// blueprint (KB article, update date) and its domain weights per
// certification, transcribed from the Now Learning blueprints. Server-only
// (uses fs at build time).

import fs from "node:fs";
import path from "node:path";

export interface BlueprintDomain {
  name: string;
  /** Weight in percent, as published in the blueprint (e.g. 21.4). */
  weight: number;
  /** Blueprint objectives for the domain, as listed in the CSV notes column. */
  objectives: string[];
}

export interface Blueprint {
  cert: string;
  kb: string;
  url: string;
  updated: string;
  domains: BlueprintDomain[];
}

interface Row {
  cert: string;
  resource_type: string;
  name: string;
  status_or_weight: string;
  url: string;
  format_or_domain: string;
  spec_updated: string;
  notes: string;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((value) => value.trim() !== ""));
}

let cache: Row[] | null = null;

function rows(): Row[] {
  if (cache) return cache;
  const file = path.join(process.cwd(), "data/cert-sources/cert-sources.csv");
  const [header, ...body] = parseCsv(fs.readFileSync(file, "utf8"));
  cache = body.map((values) => Object.fromEntries(header.map((key, i) => [key, values[i] ?? ""])) as unknown as Row);
  return cache;
}

/** CSV cert code for a site slug, e.g. "cis-df" → "CIS-DF", "cis-discovery" → "CIS-Discovery". */
function certCode(slug: string): string {
  if (slug === "cis-discovery") return "CIS-Discovery";
  return slug.toUpperCase();
}

/** Official blueprint and domain weights for a certification, or null if the CSV has none. */
export function getBlueprint(slug: string): Blueprint | null {
  const code = certCode(slug);
  const certRows = rows().filter((r) => r.cert === code);
  const spec = certRows.find((r) => r.resource_type === "spec");
  if (!spec) return null;
  const domains = certRows
    .filter((r) => r.resource_type === "domain")
    .map((r) => {
      const objectives = r.notes
        .split(";")
        .map((s) => s.trim().replace(/\.$/, ""))
        .filter((s) => s && !/^Given a scenario:?$/i.test(s))
        // "Given a scenario:; about X, identify Y" is one objective split in two.
        .map((s) => (/^[a-z]/.test(s) ? `Given a scenario ${s}` : s));
      // The CSV notes column is capped at 300 characters, so the last
      // objective of a long list is cut off mid-word: drop it.
      if (r.notes.length >= 300) objectives.pop();
      return { name: r.name, weight: Number.parseFloat(r.status_or_weight), objectives };
    });
  return { cert: code, kb: spec.status_or_weight, url: spec.url, updated: spec.spec_updated, domains };
}

/** Certifications whose blueprint lists CIS-Data Foundations as a mandatory prerequisite. */
export function getCisDfPrerequisiteCerts(): string[] {
  return rows()
    .filter((r) => r.resource_type === "prerequisite-certification" && r.status_or_weight === "mandatory" && /Data Foundations/.test(r.name))
    .map((r) => r.cert);
}
