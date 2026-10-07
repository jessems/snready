// Server-only data access for the /admin/pipeline audit pages.
//
// Public pipeline data (data/pipeline/**) is read at build time like other admin pages.
// Quarantined data (observed exam items, dumps, item-level parameterizations) is read ONLY under
// `next dev`, so dump text can never end up in out/ or a deploy.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { FACT_TYPE_BY_NAME } from "@/pipeline/lib/fact-types";
import type {
  Archetype,
  Blueprint,
  Classification,
  Distribution,
  Fact,
  GeneratedQuestion,
  GenerationPlan,
  ObservedItem,
  SourceManifest,
  Template,
} from "@/pipeline/lib/types";
import type { Parameterization, ParameterizationSummary } from "@/pipeline/stages/s8e-parameterize";
import { renderStem } from "@/pipeline/stages/s10-instantiate";
import type { Rejection } from "@/pipeline/stages/s11-write";
import { jaccard, tokens } from "@/pipeline/lib/text";
import type { SampleIndexEntry, SampleItem } from "@/pipeline/stages/s6a-samples";

export const privateDataEnabled = process.env.NODE_ENV === "development";

const root = process.cwd();
const pipelineDir = path.join(root, "data", "pipeline");
const quarantineDir = process.env.SNREADY_QUARANTINE_DIR ?? path.join(os.homedir(), ".snready", "quarantine");

function readJson<T>(file: string, fallback: T): T {
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as T) : fallback;
}

function readJsonl<T>(file: string): T[] {
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l) as T);
}

const certPath = (cert: string, name: string) => path.join(pipelineDir, cert, name);
const privatePath = (cert: string, name: string) => path.join(quarantineDir, cert, name);

export function listPipelineCerts(): string[] {
  if (!fs.existsSync(pipelineDir)) return [];
  return fs
    .readdirSync(pipelineDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(pipelineDir, d.name, "blueprint.json")))
    .map((d) => d.name)
    .sort();
}

export function loadArchetypes(): Archetype[] {
  return readJson<{ artifacts: Archetype[] }>(path.join(root, "data", "exam-intel", "artifacts", "servicenow-core-artifacts.json"), { artifacts: [] })
    .artifacts;
}

export function loadTemplates(): { accepted: Template[]; proposed: Template[] } {
  return {
    accepted: readJson<{ templates: Template[] }>(path.join(pipelineDir, "templates.json"), { templates: [] }).templates,
    proposed: readJson<Template[]>(path.join(pipelineDir, "template-proposals.json"), []),
  };
}

export function loadCert(cert: string) {
  return {
    blueprint: readJson<Blueprint | null>(certPath(cert, "blueprint.json"), null),
    sources: readJson<SourceManifest | null>(certPath(cert, "sources.json"), null),
    corpus: readJson<{ pages: unknown[] }>(certPath(cert, "corpus.json"), { pages: [] }),
    facts: readJson<{ facts: Fact[]; processedChunks: string[] }>(certPath(cert, "facts.json"), { facts: [], processedChunks: [] }),
    distribution: readJson<Distribution | null>(certPath(cert, "distribution.json"), null),
    parameterization: readJson<ParameterizationSummary | null>(certPath(cert, "parameterization.json"), null),
    archetypeProposals: readJson<Array<Archetype & { itemCount: number }>>(certPath(cert, "archetype-proposals.json"), []),
    plan: readJson<GenerationPlan | null>(certPath(cert, "plan.json"), null),
    generated: readJson<{ questions: GeneratedQuestion[] }>(certPath(cert, "generated.json"), { questions: [] }).questions,
    rejections: readJson<Rejection[]>(certPath(cert, "rejections.json"), []),
  };
}

function loadPrivate(cert: string) {
  if (!privateDataEnabled) return null;
  return {
    observed: readJsonl<ObservedItem & { seenIn?: number }>(privatePath(cert, "observed.jsonl")),
    classifications: readJson<Classification[]>(privatePath(cert, "classifications.json"), []),
    parameterizations: readJson<Parameterization[]>(privatePath(cert, "parameterizations.json"), []),
  };
}

// ---------- Exam shape: buckets (archetypes) → templates (c.1) → instances ----------

export interface ObservedRow {
  itemId: string;
  origin: string;
  seenIn: number;
  stem: string;
  options: string[];
  correct: string[];
  bindings: Parameterization["bindings"];
  rendered: string | null;
  answer: string[];
  answerConsistent: boolean | null;
  reconstruction: number;
  groundedFact: Pick<Fact, "factId" | "subject" | "value" | "sourceUrl"> | null;
  /** Agent-linked docs fact whose answer is a paraphrase rather than an exact match. */
  linkedFact: Pick<Fact, "factId" | "subject" | "value" | "sourceUrl"> | null;
  note?: string;
  /** Generated questions derived from this official item. */
  derived: Array<{ instanceId: string; relation: "variant" | "restructure"; templateId: string; stem: string; answer: string[] }>;
}

export interface GeneratedRow {
  instanceId: string;
  stem: string;
  rendered: string;
  bindings: { subject: string; value: string | string[]; context?: string };
  answer: string[];
  sourceUrl: string;
  factId: string;
}

export interface TemplateRow {
  label: string; // "c.1"
  template: Template;
  proposed: boolean;
  generatable: boolean;
  observed: ParameterizationSummary["byTemplate"][string] | null;
  observedItems: ObservedRow[] | null; // null when private data is unavailable
  generated: GeneratedRow[];
}

export interface Bucket {
  letter: string;
  archetype: Archetype;
  proposedArchetype: boolean;
  share: number;
  count: number;
  byOrigin: Record<string, number>;
  parameterized: number;
  templates: TemplateRow[];
  unparameterized: ObservedRow[] | null;
}

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

function displayStem(template: Template, bindings: { subject?: string; value?: string | string[]; context?: string }): string {
  return renderStem(template.stems[0], { subject: bindings.subject ?? "", value: bindings.value ?? "", context: bindings.context } as Fact);
}

export function buildExamShape(cert: string) {
  const data = loadCert(cert);
  const priv = loadPrivate(cert);
  const { accepted, proposed } = loadTemplates();
  const registry = new Map(loadArchetypes().map((a) => [a.id, a]));
  const proposedArchetypes = new Map(data.archetypeProposals.map((a) => [a.id, a]));
  const factsById = new Map(data.facts.facts.map((f) => [f.factId, f]));
  const summary = data.parameterization;

  const items = new Map((priv?.observed ?? []).map((i) => [i.itemId, i]));
  const params = new Map((priv?.parameterizations ?? []).map((p) => [p.itemId, p]));
  const classifiedBy = new Map<string, string[]>();
  for (const c of priv?.classifications ?? []) classifiedBy.set(c.archetypeId, [...(classifiedBy.get(c.archetypeId) ?? []), c.itemId]);

  const allTemplates = [...accepted.map((t) => ({ t, proposed: false })), ...proposed.map((t) => ({ t, proposed: true }))];

  const toObservedRow = (itemId: string): ObservedRow | null => {
    const item = items.get(itemId);
    if (!item) return null;
    const p = params.get(itemId);
    const template = p?.templateId ? allTemplates.find((x) => x.t.templateId === p.templateId)?.t : undefined;
    const fact = p?.groundedFactId ? factsById.get(p.groundedFactId) : undefined;
    const linked = !fact && p?.linkedFactId ? factsById.get(p.linkedFactId) : undefined;
    return {
      itemId,
      origin: item.origin,
      seenIn: item.seenIn ?? 1,
      stem: item.stem,
      options: item.options,
      correct: (item.correct ?? []).map((i) => item.options[i]).filter(Boolean),
      bindings: p?.bindings ?? {},
      rendered: template && p ? displayStem(template, p.bindings) : null,
      answer: p?.answer ?? [],
      answerConsistent: p?.answerConsistent ?? null,
      reconstruction: p?.reconstruction ?? 0,
      groundedFact: fact ? { factId: fact.factId, subject: fact.subject, value: fact.value, sourceUrl: fact.sourceUrl } : null,
      linkedFact: linked ? { factId: linked.factId, subject: linked.subject, value: linked.value, sourceUrl: linked.sourceUrl } : null,
      derived: data.generated
        .filter((q) => q.derivedFrom?.observedItemId === itemId)
        .map((q) => ({
          instanceId: q.identity.instanceId,
          relation: q.derivedFrom!.relation,
          templateId: q.identity.templateId,
          stem: q.stem,
          answer: q.options.filter((o) => q.correctAnswers.includes(o.id)).map((o) => o.text),
        })),
      note: p?.note,
    };
  };

  const rows = data.distribution?.archetypes ?? [];
  const buckets: Bucket[] = rows.map((row, i) => {
    const archetype = registry.get(row.key) ??
      proposedArchetypes.get(row.key) ?? { id: row.key, name: row.key, description: "", factType: "", generationUse: "" };
    const templateRows = allTemplates
      .filter((x) => x.t.archetypeId === row.key)
      .map(({ t, proposed }) => {
        const observedIds = priv ? [...params.values()].filter((p) => p.templateId === t.templateId).map((p) => p.itemId) : [];
        return {
          template: t,
          proposed,
          generatable: !proposed && FACT_TYPE_BY_NAME.has(t.factType),
          observed: summary?.byTemplate[t.templateId] ?? null,
          observedItems: priv ? (observedIds.map(toObservedRow).filter(Boolean) as ObservedRow[]) : null,
          generated: data.generated
            .filter((q) => q.identity.templateId === t.templateId)
            .map((q) => {
              const fact = factsById.get(q.identity.knowledgeKeys[0]);
              const bindings = fact ? { subject: fact.subject, value: fact.value, context: fact.context } : { subject: "", value: "" };
              return {
                instanceId: q.identity.instanceId,
                stem: q.stem,
                rendered: displayStem(t, bindings),
                bindings,
                answer: q.options.filter((o) => q.correctAnswers.includes(o.id)).map((o) => o.text),
                sourceUrl: q.sourceUrl,
                factId: q.identity.knowledgeKeys[0],
              };
            }),
        };
      })
      .sort(
        (a, b) =>
          (b.observed?.items ?? 0) - (a.observed?.items ?? 0) ||
          b.generated.length - a.generated.length ||
          a.template.templateId.localeCompare(b.template.templateId),
      )
      .map((r, j) => ({ ...r, label: `${LETTERS[i] ?? `z${i}`}.${j + 1}` }));

    const unparameterized = priv
      ? ((classifiedBy.get(row.key) ?? [])
          .filter((id) => !params.get(id)?.templateId)
          .map(toObservedRow)
          .filter(Boolean) as ObservedRow[])
      : null;

    return {
      letter: LETTERS[i] ?? `z${i}`,
      archetype,
      proposedArchetype: !registry.has(row.key),
      share: row.share,
      count: Math.round(row.count),
      byOrigin: summary?.byArchetype[row.key]?.byOrigin ?? {},
      parameterized: summary?.byArchetype[row.key]?.parameterized ?? 0,
      templates: templateRows,
      unparameterized,
    };
  });

  return { data, buckets, privateAvailable: !!priv && priv.observed.length > 0 };
}

// ---------- Facts ----------

export interface FactRow extends Fact {
  usedBy: number;
  blocked: boolean;
}

export function buildFactRows(cert: string): FactRow[] {
  const data = loadCert(cert);
  const blocked = new Set(data.rejections.filter((r) => r.kind === "trivia").map((r) => r.factId));
  const used = new Map<string, number>();
  for (const q of data.generated) for (const k of q.identity.knowledgeKeys) used.set(k, (used.get(k) ?? 0) + 1);
  return data.facts.facts.map((f) => ({ ...f, usedBy: used.get(f.factId) ?? 0, blocked: blocked.has(f.factId) }));
}

// ---------- Exam sources: official samples + purchased dumps ----------

/** Optional sidecar next to a dump file: <name>.meta.json */
export interface DumpMeta {
  vendor?: string;
  url?: string;
  purchasedAt?: string;
  price?: string;
  examVersion?: string;
  notes?: string;
}

export interface DumpFileRow {
  file: string;
  source: "dump" | "measureup";
  meta: DumpMeta;
  items: number;
  keyed: number;
  multiSelect: number;
  internalDuplicates: number;
  overlapOtherDumps: number;
  overlapOfficial: number;
}

export interface CertSources {
  cert: string;
  name: string;
  official: SampleIndexEntry | null;
  officialItems: SampleItem[] | null; // dev only
  dumps: DumpFileRow[] | null; // dev only
  observedByOrigin: Record<string, number> | null; // dev only
}

const NEAR_DUPLICATE = 0.85;
type ImportItem = { stem: string; options: string[]; correct: number[] | null };

function itemTokens(i: ImportItem) {
  return tokens(`${i.stem} ${i.options.join(" ")}`);
}

function countNear(a: Set<string>[], b: Set<string>[]): number {
  return a.filter((x) => b.some((y) => jaccard(x, y) >= NEAR_DUPLICATE)).length;
}

/** Purchased question sets: exam dumps and MeasureUp practice exams. */
function loadDumpFiles(cert: string): Array<{ file: string; source: "dump" | "measureup"; meta: DumpMeta; items: ImportItem[] }> {
  return (["dump", "measureup"] as const).flatMap((source) => {
    const dir = privatePath(cert, source === "dump" ? "dumps" : "measureup");
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json") && !f.endsWith(".meta.json"))
      .sort()
      .map((file) => ({
        file,
        source,
        meta: readJson<DumpMeta>(path.join(dir, file.replace(/\.json$/, ".meta.json")), {}),
        items: readJson<ImportItem[]>(path.join(dir, file), []),
      }));
  });
}

export function buildSourcesInventory(): { certs: CertSources[]; privateAvailable: boolean } {
  const official = new Map(readJson<SampleIndexEntry[]>(path.join(pipelineDir, "official-samples.json"), []).map((e) => [e.cert, e]));
  const catalog = readJson<{ certifications: Array<{ slug: string; fullName: string }> }>(path.join(root, "data", "certifications.json"), {
    certifications: [],
  }).certifications;

  const certs = catalog.map(({ slug, fullName: name }): CertSources => {
    if (!privateDataEnabled) return { cert: slug, name, official: official.get(slug) ?? null, officialItems: null, dumps: null, observedByOrigin: null };

    const officialItems = readJson<{ items: SampleItem[] }>(privatePath(slug, "official-samples-parsed.json"), { items: [] }).items;
    const officialTokens = officialItems.filter((i) => i.format !== "matching").map(itemTokens);
    const files = loadDumpFiles(slug).map((f) => ({ ...f, tokens: f.items.map(itemTokens) }));
    const dumps = files.map((f): DumpFileRow => {
      const others = files.filter((o) => o.file !== f.file).flatMap((o) => o.tokens);
      let internalDuplicates = 0;
      f.tokens.forEach((t, i) => {
        if (f.tokens.slice(0, i).some((prev) => jaccard(prev, t) >= NEAR_DUPLICATE)) internalDuplicates++;
      });
      return {
        file: f.file,
        source: f.source,
        meta: f.meta,
        items: f.items.length,
        keyed: f.items.filter((i) => i.correct?.length).length,
        multiSelect: f.items.filter((i) => (i.correct?.length ?? 0) > 1).length,
        internalDuplicates,
        overlapOtherDumps: countNear(f.tokens, others),
        overlapOfficial: countNear(f.tokens, officialTokens),
      };
    });
    const observedByOrigin: Record<string, number> = {};
    for (const i of readJsonl<ObservedItem>(privatePath(slug, "observed.jsonl"))) observedByOrigin[i.origin] = (observedByOrigin[i.origin] ?? 0) + 1;
    return { cert: slug, name, official: official.get(slug) ?? null, officialItems, dumps, observedByOrigin };
  });

  return { certs, privateAvailable: privateDataEnabled };
}
