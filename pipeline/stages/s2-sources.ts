// S2 Source discovery: blueprint objectives → doc pages (+ courses, recorded but not scraped).
// Seeds come from cert-sources.csv; every objective that no seed covers gets docs search hits.
import { certFile, log, readJson, readJsonIfExists, writeJson } from "../lib/io";
import { docSubpath, searchDocs } from "../lib/docs";
import { normalize, tokens } from "../lib/text";
import type { Blueprint, DocSource, SourceManifest } from "../lib/types";
import { loadSourceRows } from "./s1-blueprint";

const HITS_PER_OBJECTIVE = 2;

/**
 * Curated corrections, data/pipeline/<cert>/seeds.json. Docs search is noisy for vague
 * objectives ("ServiceNow Platform overview"), so a human can pin or drop seeds here.
 */
interface SeedOverrides {
  add?: Array<{ url: string; title: string; objectives: string[] }>; // objective ids
  remove?: string[]; // subpaths
}

export async function runSources(cert: string): Promise<SourceManifest> {
  const blueprint = readJson<Blueprint>(certFile(cert, "blueprint.json"));
  const rows = loadSourceRows(cert);
  const docs = new Map<string, DocSource>();

  // Blueprint seeds. The CSV tags docs with a domain like "3 Collaboration".
  for (const row of rows.filter((r) => r.resource_type === "doc")) {
    const subpath = docSubpath(row.url, blueprint.release);
    if (!subpath) continue;
    const domainNumber = parseInt(row.format_or_domain, 10);
    const domain = blueprint.domains.find((d) => d.number === domainNumber);
    docs.set(subpath, {
      kind: "doc",
      url: row.url,
      subpath,
      title: row.name,
      domainIds: domain ? [domain.id] : [],
      objectiveIds: domain ? matchObjectives(row.name, domain.objectives) : [],
      origin: "blueprint",
    });
  }

  const overrides = readJsonIfExists<SeedOverrides>(certFile(cert, "seeds.json"), {});
  for (const add of overrides.add ?? []) {
    const subpath = docSubpath(add.url, blueprint.release);
    if (!subpath) throw new Error(`seeds.json: not a docs URL: ${add.url}`);
    const domainIds = [...new Set(add.objectives.map((id) => id.split(".").slice(0, 2).join(".")))];
    docs.set(subpath, { kind: "doc", url: add.url, subpath, title: add.title, domainIds, objectiveIds: add.objectives, origin: "curated" });
  }

  // Discovery for uncovered objectives.
  const covered = new Set([...docs.values()].flatMap((d) => d.objectiveIds));
  for (const domain of blueprint.domains) {
    for (const objective of domain.objectives) {
      if (covered.has(objective.id)) continue;
      const hits = rankHits(objective.name, await searchDocs(objective.name, blueprint.release));
      let added = 0;
      for (const hit of hits) {
        if (added >= HITS_PER_OBJECTIVE) break;
        const subpath = docSubpath(hit.readerUrl, blueprint.release);
        if (!subpath) continue;
        const existing = docs.get(subpath);
        if (existing) {
          addUnique(existing.domainIds, domain.id);
          addUnique(existing.objectiveIds, objective.id);
        } else {
          docs.set(subpath, {
            kind: "doc",
            url: hit.readerUrl,
            subpath,
            title: hit.title,
            domainIds: [domain.id],
            objectiveIds: [objective.id],
            origin: "discovered",
          });
        }
        added++;
      }
      if (added === 0) log("s2", `no docs found for objective '${objective.name}'`);
    }
  }

  const manifest: SourceManifest = {
    cert,
    release: blueprint.release,
    docs: [...docs.values()].filter((d) => !(overrides.remove ?? []).includes(d.subpath)),
    courses: rows
      .filter((r) => r.resource_type === "course")
      .map((r) => ({ kind: "course" as const, url: r.url, title: r.name, status: "skipped" as const })),
  };
  writeJson(certFile(cert, "sources.json"), manifest);
  const discovered = manifest.docs.filter((d) => d.origin === "discovered").length;
  log("s2", `${cert}: ${manifest.docs.length} doc seeds (${discovered} discovered), ${manifest.courses.length} courses skipped`);
  return manifest;
}

/** Keep hits whose title shares a word with the objective, best overlap first (stable on search rank). */
function rankHits<T extends { title: string }>(objectiveName: string, hits: T[]): T[] {
  const wanted = tokens(objectiveName);
  wanted.delete("servicenow");
  return hits
    .map((hit, rank) => ({ hit, rank, overlap: [...tokens(hit.title)].filter((t) => wanted.has(t)).length }))
    .filter((h) => h.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || a.rank - b.rank)
    .map((h) => h.hit);
}

/** Objectives whose name shares a significant word with the doc title. */
function matchObjectives(title: string, objectives: Blueprint["domains"][number]["objectives"]): string[] {
  const titleWords = new Set(normalize(title).split(" ").filter((w) => w.length > 3));
  return objectives
    .filter((o) => normalize(o.name).split(" ").some((w) => w.length > 3 && titleWords.has(w)))
    .map((o) => o.id);
}

function addUnique(list: string[], value: string): void {
  if (!list.includes(value)) list.push(value);
}
