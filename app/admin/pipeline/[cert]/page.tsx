import type { Metadata } from "next";
import Link from "next/link";
import { buildExamShape, type Bucket, type ObservedRow, type TemplateRow } from "@/lib/pipeline-audit";
import { MIN_EVIDENCE } from "@/pipeline/stages/s8-analysis";
import { Answer, Badge, Bindings, Card, ShareBar, Stat, StemFrame, pct } from "../ui";

export const metadata: Metadata = { title: "Exam shape - Pipeline Admin", robots: "noindex, nofollow" };

function ObservedItem({ row }: { row: ObservedRow }) {
  const docFact = row.groundedFact ?? row.linkedFact;
  return (
    <li className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge tone={row.origin === "dump" ? "red" : row.origin === "measureup" ? "amber" : "blue"}>{row.origin === "sample" ? "official sample" : row.origin}</Badge>
        {row.seenIn > 1 && <Badge tone="amber">seen in {row.seenIn} sources</Badge>}
        {row.answerConsistent === true && <Badge tone="emerald">answer ✓</Badge>}
        {row.answerConsistent === false && <Badge tone="red">answer ✗</Badge>}
        {row.rendered && <Badge tone={row.reconstruction >= 0.5 ? "emerald" : "amber"} title="token overlap of re-rendered template vs original stem">reconstruction {Math.round(row.reconstruction * 100)}%</Badge>}
        {row.groundedFact && <Badge tone="blue" title={row.groundedFact.factId}>grounded in docs</Badge>}
        {row.linkedFact && <Badge tone="zinc" title="docs fact tests the same thing, answer worded differently">linked fact (paraphrase)</Badge>}
        <span className="font-mono text-zinc-400">{row.itemId}</span>
      </div>
      <div className="mt-2 grid gap-2 lg:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-wide text-zinc-400">Observed</div>
          <div className="text-zinc-900 dark:text-zinc-100">{row.stem}</div>
          <ul className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            {row.options.map((o) => (
              <li key={o} className={row.correct.includes(o) ? "font-semibold text-emerald-700 dark:text-emerald-400" : ""}>
                {row.correct.includes(o) ? "✓ " : "· "}
                {o}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-zinc-400">Parameterized</div>
          {row.rendered ? <div className="text-zinc-900 dark:text-zinc-100">{row.rendered}</div> : <div className="text-zinc-400">no template</div>}
          <div className="mt-1">
            <Bindings bindings={row.bindings} />
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            answer → <Answer values={row.answer} />
          </div>
          {docFact && (
            <div className="mt-1 text-xs text-zinc-500">
              docs fact:{" "}
              <a className="text-blue-600 hover:underline dark:text-blue-400" href={docFact.sourceUrl} target="_blank" rel="noreferrer">
                {docFact.subject}
              </a>{" "}
              = {String(docFact.value)}
            </div>
          )}
          {row.note && <div className="mt-1 text-xs italic text-zinc-500">{row.note}</div>}
        </div>
      </div>
      {row.derived.length > 0 && (
        <div className="mt-3 border-t border-zinc-200 pt-2 dark:border-zinc-800">
          <div className="text-xs uppercase tracking-wide text-zinc-400">Derived questions ({row.derived.length}). The official item itself is never republished.</div>
          <ul className="mt-1 space-y-1">
            {row.derived.map((d) => (
              <li key={d.instanceId} className="flex flex-wrap items-baseline gap-2 text-sm">
                <Badge tone={d.relation === "variant" ? "blue" : "emerald"} title={d.relation === "variant" ? "same template, different fact" : "same fact, different template"}>
                  {d.relation === "variant" ? "variant: same structure" : "restructure: same fact"}
                </Badge>
                <span className="text-zinc-900 dark:text-zinc-100">{d.stem}</span>
                <span className="text-xs text-zinc-500">
                  → <Answer values={d.answer} />
                </span>
                <span className="font-mono text-xs text-zinc-400">{d.templateId}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

function TemplateBlock({ row }: { row: TemplateRow }) {
  const t = row.template;
  const answerRule = {
    single: "answer = {value}",
    reverse: "answer = {subject}",
    members: `answers = ${t.answer.mode === "members" ? t.answer.correctCount : ""} members of {value}`,
    non_member: "answer = the option not in {value}",
    ordinal: `answer = ${t.answer.mode === "ordinal" ? t.answer.position : ""} item of {value}`,
  }[t.answer.mode];
  const observedCount = row.observed?.items ?? 0;
  return (
    <details className="group rounded-lg border border-zinc-200 dark:border-zinc-800" open={false}>
      <summary className="flex cursor-pointer list-none flex-col gap-2 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">{row.label}</span>
          <StemFrame stem={t.stems[0]} />
        </div>
        <div className="flex flex-wrap items-center gap-2 pl-8 text-xs text-zinc-500">
          <span className="font-mono">{row.label}.answer</span>
          <span className="font-mono text-violet-700 dark:text-violet-300">{answerRule}</span>
          <Badge>{t.format.replace(/_/g, " ")}</Badge>
          <Badge>{t.cognitiveLevel}</Badge>
          <Badge>fact: {t.factType}</Badge>
          {row.proposed && <Badge tone="amber">proposed</Badge>}
          {!row.generatable && <Badge tone="amber" title="fact type not extractable yet">not generatable yet</Badge>}
          {observedCount > 0 ? <Badge tone="blue">{observedCount} official</Badge> : <Badge tone="red">no official evidence</Badge>}
          {row.observed && observedCount > 0 && (
            <span>
              {row.observed.consistent}/{observedCount} answer-consistent · {row.observed.faithful}/{observedCount} faithful · {row.observed.grounded}/{observedCount} grounded
            </span>
          )}
          <Badge tone="emerald">{row.generated.length} generated</Badge>
          <span className="font-mono text-zinc-400">{t.templateId}</span>
        </div>
      </summary>
      <div className="space-y-4 border-t border-zinc-200 p-3 dark:border-zinc-800">
        {t.stems.length > 1 && (
          <div>
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-400">Phrasing variants (cosmetic, same instance)</div>
            <ul className="space-y-1">
              {t.stems.map((s, i) => (
                <li key={i} className="text-zinc-700 dark:text-zinc-300">
                  <StemFrame stem={s} />
                </li>
              ))}
            </ul>
          </div>
        )}
        {row.observedItems && row.observedItems.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">Observed instances ({row.observedItems.length})</div>
            <ul className="space-y-2">
              {row.observedItems.map((o) => (
                <ObservedItem key={o.itemId} row={o} />
              ))}
            </ul>
          </div>
        )}
        {row.generated.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">Generated instances ({row.generated.length})</div>
            <ul className="space-y-2">
              {row.generated.map((g) => (
                <li key={g.instanceId} className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3 text-sm dark:border-emerald-900/50 dark:bg-emerald-950/20">
                  <div className="text-zinc-900 dark:text-zinc-100">{g.stem}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Bindings bindings={g.bindings} />
                    <span className="text-xs text-zinc-500">
                      answer → <Answer values={g.answer} />
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 font-mono text-xs text-zinc-400">
                    <span>{g.instanceId}</span>
                    <a href={g.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                      source
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!row.observedItems?.length && !row.generated.length && <div className="text-sm text-zinc-400">No instances yet.</div>}
      </div>
    </details>
  );
}

function BucketBlock({ bucket }: { bucket: Bucket }) {
  return (
    <Card className="p-5" >
      <div id={`bucket-${bucket.letter}`} className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 font-mono text-lg font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
              {bucket.letter}
            </span>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{bucket.archetype.name}</h2>
            {bucket.proposedArchetype && <Badge tone="amber">proposed type</Badge>}
          </div>
          <p className="mt-1 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">{bucket.archetype.description}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{pct(bucket.share)}</div>
          <div className="text-xs text-zinc-500">
            {bucket.count} item{bucket.count === 1 ? "" : "s"} · {bucket.parameterized} parameterized
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {bucket.templates.length ? bucket.templates.map((t) => <TemplateBlock key={t.template.templateId} row={t} />) : <div className="text-sm text-zinc-400">No templates for this type yet.</div>}
        {bucket.unparameterized && bucket.unparameterized.length > 0 && (
          <details className="rounded-lg border border-dashed border-amber-300 p-3 dark:border-amber-900">
            <summary className="cursor-pointer text-sm font-medium text-amber-800 dark:text-amber-300">
              {bucket.unparameterized.length} observed items not yet parameterized
            </summary>
            <ul className="mt-2 space-y-2">
              {bucket.unparameterized.map((o) => (
                <ObservedItem key={o.itemId} row={o} />
              ))}
            </ul>
          </details>
        )}
      </div>
    </Card>
  );
}

export default async function ExamShapePage({ params }: { params: Promise<{ cert: string }> }) {
  const { cert } = await params;
  const { data, buckets } = buildExamShape(cert);
  const summary = data.parameterization;
  const origins = data.distribution?.basis.origins ?? {};

  const evidence = data.distribution?.basis.observedItems ?? 0;

  return (
    <div className="space-y-6">
      {evidence < MIN_EVIDENCE && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
          <strong>Too little official evidence: {evidence} item{evidence === 1 ? "" : "s"}.</strong> The shares below rest on {evidence} official question{evidence === 1 ? "" : "s"} and aren&apos;t reliable
          until at least {MIN_EVIDENCE}. Add an exam dump or a MeasureUp practice exam (see{" "}
          <Link href="/admin/pipeline/sources" className="underline">
            Exam sources
          </Link>
          ). Templates marked &quot;no official evidence&quot; are hypotheses that no official question has confirmed yet.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Official items" value={data.distribution?.basis.observedItems ?? 0} detail={Object.entries(origins).map(([o, n]) => `${o}: ${n}`).join(" · ") || "none"} />
        <Stat label="Question types" value={buckets.length} />
        <Stat
          label="Parameterized"
          value={summary ? pct(summary.parameterized / Math.max(summary.items, 1)) : "—"}
          detail={summary ? `${summary.parameterized} of ${summary.items} items fit a template` : "run parameterize:packets"}
          tone="emerald"
        />
        <Stat
          label="Answer-consistent"
          value={summary ? pct(summary.consistent / Math.max(summary.parameterized, 1)) : "—"}
          detail="bindings + answer mode reproduce the keyed answer"
          tone="blue"
        />
        <Stat label="Grounded in docs" value={summary ? pct(summary.grounded / Math.max(summary.parameterized, 1)) : "—"} detail="regenerable from the fact store" tone="amber" />
      </div>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Exam composition</h2>
        <p className="mb-4 text-sm text-zinc-500">Share of official items (blueprint samples, MeasureUp, dumps) per question type.</p>
        <div className="space-y-2">
          {buckets.map((b) => (
            <a key={b.letter} href={`#bucket-${b.letter}`} className="grid grid-cols-[2rem_1fr_4rem] items-center gap-3 rounded px-1 hover:bg-zinc-50 sm:grid-cols-[2rem_16rem_1fr_4rem] dark:hover:bg-zinc-800/40">
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{b.letter}</span>
              <span className="truncate text-sm text-zinc-700 dark:text-zinc-300">{b.archetype.name}</span>
              <span className="hidden sm:block">
                <ShareBar share={b.share} tone={b.templates.some((t) => t.generatable) ? "bg-emerald-500" : "bg-amber-400"} />
              </span>
              <span className="text-right font-mono text-sm text-zinc-900 dark:text-zinc-100">{pct(b.share)}</span>
            </a>
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-500">Amber bars: no template that can generate questions yet.</p>
      </Card>

      {buckets.map((b) => (
        <BucketBlock key={b.letter} bucket={b} />
      ))}
    </div>
  );
}
