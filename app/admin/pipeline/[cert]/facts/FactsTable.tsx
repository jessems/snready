"use client";

import { useMemo, useState } from "react";
import type { FactRow } from "@/lib/pipeline-audit";

/** Docs markdown leaks escapes and bold markers into quotes; show them as plain text. */
const plain = (text: string) => text.replace(/\\([_*()[\]#])/g, "$1").replace(/\*\*/g, "");

export function FactsTable({ facts, domains }: { facts: FactRow[]; domains: Array<{ id: string; name: string }> }) {
  const [query, setQuery] = useState("");
  const [factType, setFactType] = useState("");
  const [domain, setDomain] = useState("");
  const [usage, setUsage] = useState<"" | "used" | "unused" | "blocked">("");

  const types = useMemo(() => [...new Set(facts.map((f) => f.factType))].sort(), [facts]);
  const shown = useMemo(() => {
    const q = query.toLowerCase();
    return facts.filter(
      (f) =>
        (!factType || f.factType === factType) &&
        (!domain || f.domainIds.includes(domain)) &&
        (!usage || (usage === "used" ? f.usedBy > 0 : usage === "unused" ? f.usedBy === 0 && !f.blocked : f.blocked)) &&
        (!q || `${f.subject} ${String(f.value)} ${f.context ?? ""} ${f.quote}`.toLowerCase().includes(q))
    );
  }, [facts, query, factType, domain, usage]);

  const select = "rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900";
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search subject, value, quote…" className={`${select} min-w-64 flex-1`} />
        <select value={factType} onChange={(e) => setFactType(e.target.value)} className={select}>
          <option value="">All fact types</option>
          {types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select value={domain} onChange={(e) => setDomain(e.target.value)} className={select}>
          <option value="">All domains</option>
          {domains.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <select value={usage} onChange={(e) => setUsage(e.target.value as typeof usage)} className={select}>
          <option value="">Any usage</option>
          <option value="used">Used in a question</option>
          <option value="unused">Unused</option>
          <option value="blocked">Blocked as trivia</option>
        </select>
      </div>
      <div className="mb-2 text-sm text-zinc-500">{shown.length} facts</div>
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="p-3">Type</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Value</th>
              <th className="p-3">Evidence</th>
              <th className="p-3">Use</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {shown.map((f) => (
              <tr key={f.factId} className={f.blocked ? "opacity-50" : ""}>
                <td className="whitespace-nowrap p-3 align-top font-mono text-xs text-zinc-500">{f.factType}</td>
                <td className="p-3 align-top text-zinc-900 dark:text-zinc-100">
                  {f.subject}
                  {f.context && <div className="text-xs text-zinc-500">{f.context}</div>}
                  <div className="font-mono text-[10px] text-zinc-400">{f.factId}</div>
                </td>
                <td className="p-3 align-top font-medium text-zinc-900 dark:text-zinc-100">
                  {Array.isArray(f.value) ? (
                    <ol className={`list-inside ${f.factType === "ordered_process" ? "list-decimal" : "list-disc"}`}>
                      {f.value.map((v) => (
                        <li key={v}>{v}</li>
                      ))}
                    </ol>
                  ) : (
                    f.value
                  )}
                </td>
                <td className="max-w-md p-3 align-top text-xs text-zinc-600 dark:text-zinc-400">
                  <blockquote className="border-l-2 border-zinc-300 pl-2 italic dark:border-zinc-700">{plain(f.quote)}</blockquote>
                  <a href={f.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-blue-600 hover:underline dark:text-blue-400">
                    {f.sourceUrl.replace(/^.*\/docs\/r\/[^/]+\//, "")}
                  </a>
                </td>
                <td className="whitespace-nowrap p-3 align-top text-xs">
                  {f.blocked ? (
                    <span className="text-red-600 dark:text-red-400">blocked (trivia)</span>
                  ) : f.usedBy ? (
                    <span className="text-emerald-700 dark:text-emerald-400">{f.usedBy} question{f.usedBy > 1 ? "s" : ""}</span>
                  ) : (
                    <span className="text-zinc-400">unused</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
