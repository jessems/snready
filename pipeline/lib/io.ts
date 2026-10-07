import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const quarantine = process.env.SNREADY_QUARANTINE_DIR ?? path.join(os.homedir(), ".snready", "quarantine");
const PRIVATE_STAGES = new Set(["classify", "templates", "parameterize", "ground"]);

/**
 * Where each kind of pipeline output lives:
 * - data/pipeline/   committed, reviewable, never imported by the app
 * - pipeline/.work/  gitignored cache: fetched docs, chunks, agent packets
 * - quarantine       outside the repo: dumps, samples, and anything holding their raw text
 */
export const paths = {
  root,
  certSourcesCsv: path.join(root, "data", "cert-sources", "cert-sources.csv"),
  certificationsJson: path.join(root, "data", "certifications.json"),
  questionsDir: path.join(root, "data", "questions"),
  archetypes: path.join(root, "data", "exam-intel", "artifacts", "servicenow-core-artifacts.json"),
  templates: path.join(root, "data", "pipeline", "templates.json"),
  prompts: path.join(root, "pipeline", "prompts"),
  cert: (cert: string) => path.join(root, "data", "pipeline", cert),
  work: path.join(root, "pipeline", ".work"),
  docsCache: (release: string) => path.join(root, "pipeline", ".work", "docs", release),
  quarantine,
  /** Stages whose packets may contain dump text keep them in quarantine. */
  packets: (stage: string, cert: string) =>
    PRIVATE_STAGES.has(stage)
      ? path.join(quarantine, "packets", stage, cert)
      : path.join(root, "pipeline", ".work", "packets", stage, cert),
  observed: (cert: string) => path.join(quarantine, cert, "observed.jsonl"),
  classifications: (cert: string) => path.join(quarantine, cert, "classifications.json"),
};

export function certFile(cert: string, name: string): string {
  return path.join(paths.cert(cert), name);
}

export function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

export function readJsonIfExists<T>(file: string, fallback: T): T {
  return fs.existsSync(file) ? readJson<T>(file) : fallback;
}

export function writeJson(file: string, data: unknown): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

export function readJsonl<T>(file: string): T[] {
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as T);
}

export function writeJsonl(file: string, rows: unknown[]): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join("\n") + "\n");
}

export function hash(input: string, length = 10): string {
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, length);
}

export function log(stage: string, message: string): void {
  console.log(`[${stage}] ${message}`);
}
