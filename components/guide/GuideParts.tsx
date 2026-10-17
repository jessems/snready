// Building blocks for the long-form guide pages (cert hub deep dives,
// /certification-paths, the CSA and CAD blog guides). Styled after the
// architecture courses under app/courses/.

import Link from "next/link";
import type { ReactNode } from "react";
import { SOURCES, type SourceKey } from "@/lib/sources";
import type { Blueprint } from "@/lib/cert-sources";

/** Inline link to an external source from lib/sources.ts. */
export function Src({ k, children }: { k: SourceKey; children: ReactNode }) {
  return (
    <a
      href={SOURCES[k].href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-900 dark:text-emerald-300 dark:decoration-emerald-700 dark:hover:text-emerald-100"
    >
      {children}
    </a>
  );
}

/** Internal link with descriptive anchor text. */
export function In({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-medium text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100">
      {children}
    </Link>
  );
}

export function GuideSection({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-zinc-200 py-12 dark:border-zinc-800">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950 md:text-3xl dark:text-white">{title}</h2>
      <div className="mt-6 space-y-5 text-lg leading-8 text-zinc-700 dark:text-zinc-300">{children}</div>
    </section>
  );
}

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-zinc-800 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-zinc-200">
      <h3 className="text-lg font-semibold text-emerald-950 dark:text-emerald-100">{title}</h3>
      <div className="mt-3 space-y-3 text-base leading-7">{children}</div>
    </div>
  );
}

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="text-lg font-bold text-zinc-950 dark:text-white">{title}</h3>
      <div className="mt-3 space-y-3 text-base leading-7 text-zinc-700 dark:text-zinc-300">{children}</div>
    </div>
  );
}

/** Industry scenario: a situation, the platform reasoning, and what the exam is checking. */
export function Scenario({ industry, title, situation, reasoning, examAngle }: { industry: string; title: string; situation: ReactNode; reasoning: ReactNode; examAngle: ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">{industry}</p>
      <h3 className="mt-2 text-xl font-bold text-zinc-950 dark:text-white">{title}</h3>
      <p className="mt-3 text-base leading-7 text-zinc-700 dark:text-zinc-300">{situation}</p>
      <p className="mt-3 text-base leading-7 text-zinc-700 dark:text-zinc-300">{reasoning}</p>
      <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-base leading-7 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100">
        <span className="font-semibold">What the exam is checking: </span>
        {examAngle}
      </p>
    </div>
  );
}

/** Misconception vs. what the sources say. */
export function Misconception({ myth, children }: { myth: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-600 dark:text-rose-400">Misconception</p>
      <h3 className="mt-2 text-lg font-bold text-zinc-950 dark:text-white">{myth}</h3>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">What the sources say</p>
      <div className="mt-2 text-base leading-7 text-zinc-700 dark:text-zinc-300">{children}</div>
    </div>
  );
}

export function Toc({ items }: { items: Array<[string, string]> }) {
  return (
    <nav aria-label="On this page" className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">On this page</h2>
      <ol className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
        {items.map(([href, label], index) => (
          <li key={href}>
            <a href={href} className="block rounded-lg px-2 py-1 text-zinc-700 hover:bg-emerald-50 hover:text-emerald-800 dark:text-zinc-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-200">
              {index + 1}. {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Inline SVG bar chart of the official blueprint domain weights, with the
 * blueprint objectives underneath. Data comes from cert-sources.csv.
 */
export function BlueprintChart({ blueprint, sourceKey, showObjectives = true }: { blueprint: Blueprint; sourceKey: SourceKey; showObjectives?: boolean }) {
  const domains = [...blueprint.domains].sort((a, b) => b.weight - a.weight);
  const max = Math.max(...domains.map((d) => d.weight));
  const rowHeight = 34;
  const labelWidth = 290;
  const barWidth = 300;
  const height = domains.length * rowHeight + 10;
  return (
    <figure className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <svg viewBox={`0 0 ${labelWidth + barWidth + 60} ${height}`} role="img" aria-labelledby={`bp-${blueprint.kb}`} className="h-auto w-full">
        <title id={`bp-${blueprint.kb}`}>{`${blueprint.cert} blueprint domain weights`}</title>
        {domains.map((domain, i) => {
          const y = i * rowHeight + 5;
          const w = Math.max(2, (domain.weight / max) * barWidth);
          return (
            <g key={domain.name}>
              <text x={labelWidth - 10} y={y + 19} textAnchor="end" className="fill-zinc-700 text-[13px] dark:fill-zinc-300">
                {domain.name}
              </text>
              <rect x={labelWidth} y={y + 4} width={barWidth} height={22} rx={6} className="fill-zinc-100 dark:fill-zinc-800" />
              <rect x={labelWidth} y={y + 4} width={w} height={22} rx={6} className="fill-emerald-500" />
              <text x={labelWidth + w + 8} y={y + 20} className="fill-zinc-900 text-[13px] font-semibold dark:fill-zinc-100">
                {`${domain.weight}%`}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        Domain weights from the official <Src k={sourceKey}>{`${blueprint.cert} exam blueprint (${blueprint.kb}, updated ${blueprint.updated})`}</Src>.
      </figcaption>
      {showObjectives && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {blueprint.domains.map((domain, i) => (
            <div key={domain.name} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-sm font-bold text-zinc-950 dark:text-white">
                {i + 1}. {domain.name} <span className="font-semibold text-emerald-600">({domain.weight}%)</span>
              </p>
              <ul className="mt-2 space-y-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {domain.objectives.map((objective) => (
                  <li key={objective} className="flex gap-2"><span className="text-emerald-500">•</span>{objective}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </figure>
  );
}

export function SourcesList({ keys, extra = [] }: { keys: SourceKey[]; extra?: Array<{ label: string; href: string }> }) {
  const unique = [...new Set(keys)];
  return (
    <section id="sources" className="scroll-mt-24 border-t border-zinc-200 py-12 dark:border-zinc-800">
      <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">Sources</h2>
      <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">
        Every exam fact and product behaviour on this page links to one of these ServiceNow sources. Check them before you book: exam rules change between releases.
      </p>
      <ol className="mt-5 list-decimal space-y-2 pl-6 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        {unique.map((key) => (
          <li key={key}>
            <a href={SOURCES[key].href} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-900 dark:text-emerald-300">
              {SOURCES[key].label}
            </a>
          </li>
        ))}
        {extra.map((source) => (
          <li key={source.href}>
            <a href={source.href} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-900 dark:text-emerald-300">
              {source.label}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
