// S1 Blueprint ingest: data/cert-sources/cert-sources.csv → data/pipeline/<cert>/blueprint.json
import fs from "node:fs";
import { parseCsv } from "../lib/csv";
import { certFile, log, paths, readJson, writeJson } from "../lib/io";
import type { Blueprint, BlueprintDomain } from "../lib/types";

export function loadSourceRows(cert: string): Array<Record<string, string>> {
  const rows = parseCsv(fs.readFileSync(paths.certSourcesCsv, "utf8"));
  return rows.filter((row) => row.cert.toLowerCase() === cert.toLowerCase());
}

export function buildBlueprint(cert: string): Blueprint {
  const rows = loadSourceRows(cert);
  if (rows.length === 0) throw new Error(`No rows for '${cert}' in cert-sources.csv`);

  const specRow = rows.find((row) => row.resource_type === "spec");
  const domains: BlueprintDomain[] = rows
    .filter((row) => row.resource_type === "domain")
    .map((row) => {
      const number = Number(row.format_or_domain.replace("#", ""));
      const id = `${cert}.d${number}`;
      const objectives = row.notes
        .split(";")
        .map((name) => name.trim())
        .filter(Boolean)
        .map((name, i) => ({ id: `${id}.o${i + 1}`, name }));
      return { id, number, name: row.name, weight: parseFloat(row.status_or_weight), objectives };
    })
    .sort((a, b) => a.number - b.number);

  const releaseCounts = new Map<string, number>();
  for (const row of rows.filter((r) => r.resource_type === "doc")) {
    const release = row.status_or_weight.toLowerCase();
    releaseCounts.set(release, (releaseCounts.get(release) ?? 0) + 1);
  }
  const certifications = readJson<{ certifications: Array<{ slug: string; release: string; examDetails: { questionCount: number } }> }>(
    paths.certificationsJson
  ).certifications;
  const certMeta = certifications.find((c) => c.slug === cert);
  const release =
    [...releaseCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? certMeta?.release.toLowerCase() ?? "australia";

  const totalWeight = domains.reduce((sum, d) => sum + d.weight, 0);
  if (domains.length && Math.abs(totalWeight - 100) > 1) {
    log("s1", `warning: ${cert} domain weights sum to ${totalWeight}%`);
  }

  return {
    cert,
    certCode: rows[0].cert,
    release,
    spec: specRow ? { kb: specRow.status_or_weight, url: specRow.url, updated: specRow.spec_updated } : null,
    examItemCount: certMeta?.examDetails.questionCount ?? null,
    domains,
  };
}

export function runBlueprint(cert: string): Blueprint {
  const blueprint = buildBlueprint(cert);
  writeJson(certFile(cert, "blueprint.json"), blueprint);
  const objectiveCount = blueprint.domains.reduce((n, d) => n + d.objectives.length, 0);
  log("s1", `${cert}: ${blueprint.domains.length} domains, ${objectiveCount} objectives, release ${blueprint.release}`);
  return blueprint;
}
