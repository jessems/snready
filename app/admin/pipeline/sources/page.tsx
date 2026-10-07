import type { Metadata } from "next";
import Link from "next/link";
import { buildSourcesInventory, type CertSources } from "@/lib/pipeline-audit";
import { Badge, Card, PrivateNotice, Stat } from "../ui";

export const metadata: Metadata = { title: "Exam sources - Pipeline Admin", robots: "noindex, nofollow" };

const LETTERS = "ABCDEF";

function OfficialItems({ cert }: { cert: CertSources }) {
  if (!cert.officialItems?.length) return null;
  return (
    <ol className="mt-3 space-y-3">
      {cert.officialItems.map((item) => (
        <li key={item.number} className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono text-zinc-400">#{item.number}</span>
            <Badge tone={item.format === "matching" ? "amber" : item.format === "multiple_select" ? "blue" : "zinc"}>{item.format.replace(/_/g, " ")}</Badge>
          </div>
          {item.format === "matching" ? (
            <pre className="whitespace-pre-wrap font-sans text-zinc-700 dark:text-zinc-300">{item.raw}</pre>
          ) : (
            <>
              <div className="font-medium text-zinc-900 dark:text-zinc-100">{item.stem}</div>
              <ul className="mt-1 space-y-0.5">
                {item.options.map((o, i) => {
                  const correct = item.correct?.includes(i);
                  return (
                    <li key={i} className={correct ? "font-semibold text-emerald-700 dark:text-emerald-400" : "text-zinc-600 dark:text-zinc-400"}>
                      {LETTERS[i]}. {o} {correct && "✓"}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </li>
      ))}
    </ol>
  );
}

export default function ExamSourcesPage() {
  const { certs, privateAvailable } = buildSourcesInventory();
  const withOfficial = certs.filter((c) => c.official?.itemCount);
  const officialItems = certs.reduce((n, c) => n + (c.official?.itemCount ?? 0), 0);
  const practice = certs.filter((c) => c.official?.practiceExam);
  const dumpFiles = certs.flatMap((c) => (c.dumps ?? []).map((d) => ({ ...d, cert: c.cert })));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/admin/pipeline" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
          ← Pipeline audit
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50">Exam sources</h1>
        <p className="mt-2 max-w-3xl text-zinc-600 dark:text-zinc-400">
          The only allowed evidence for exam shape: ServiceNow&apos;s official sample items (from each blueprint KB article), MeasureUp official practice exams, and exam dumps we bought. They feed stage S7 (observed corpus). Our own question bank is never used as a source.
        </p>
        <div className="mt-4 max-w-3xl">
          <PrivateNotice available={privateAvailable} />
        </div>

        <div className="my-8 grid gap-4 sm:grid-cols-4">
          <Stat label="Official sample items" value={officialItems} detail={`${withOfficial.length} of ${certs.length} certifications`} tone="emerald" />
          <Stat label="Official practice exams" value={practice.length} detail="MeasureUp, via KB0013408" tone="blue" />
          <Stat
            label="Dump + MeasureUp files"
            value={privateAvailable ? dumpFiles.length : "—"}
            detail={privateAvailable ? `${dumpFiles.filter((d) => d.source === "dump").length} dumps · ${dumpFiles.filter((d) => d.source === "measureup").length} MeasureUp · ${dumpFiles.reduce((n, d) => n + d.items, 0)} items` : "visible under npm run dev"}
            tone="amber"
          />
          <Stat label="Certs with no purchased set" value={privateAvailable ? certs.filter((c) => !c.dumps?.length).length : "—"} detail="buy list" tone="red" />
        </div>

        {/* ---------------- Official samples ---------------- */}
        <Card className="mb-8">
          <div className="border-b border-zinc-200 p-5 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Official sample questions</h2>
            <p className="text-sm text-zinc-500">
              Parsed by <code>npm run pipeline -- samples --cert=all</code> from the &quot;Sample Questions&quot; section of each exam blueprint. Links open the KB article on ServiceNow University.
            </p>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {certs.map((c) => (
              <details key={c.cert} className="group p-4">
                <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="w-24 font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">{c.cert.toUpperCase()}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-zinc-600 dark:text-zinc-400">{c.name}</span>
                  {c.official?.url ? (
                    <a href={c.official.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                      {c.official.kb} ↗
                    </a>
                  ) : (
                    <Badge tone="red">no blueprint cached</Badge>
                  )}
                  {c.official?.updated && <span className="text-xs text-zinc-500">{c.official.updated}</span>}
                  {c.official ? (
                    <Badge tone={c.official.itemCount ? "emerald" : "amber"}>
                      {c.official.itemCount} sample{c.official.itemCount === 1 ? "" : "s"}
                      {c.official.multiSelectCount ? ` · ${c.official.multiSelectCount} multi-select` : ""}
                      {c.official.matchingCount ? ` · ${c.official.matchingCount} matching` : ""}
                    </Badge>
                  ) : null}
                  {c.official?.practiceExam && (
                    <a href={c.official.practiceExam.url} target="_blank" rel="noreferrer" title="Official practice exam (paid)">
                      <Badge tone="blue">practice exam: {c.official.practiceExam.provider} ↗</Badge>
                    </a>
                  )}
                  {c.observedByOrigin?.sample ? <Badge tone="zinc">{c.observedByOrigin.sample} in observed corpus</Badge> : null}
                </summary>
                <div className="pl-28">
                  {c.official?.warnings.length ? (
                    <ul className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                      {c.official.warnings.map((w) => (
                        <li key={w}>⚠ {w}</li>
                      ))}
                    </ul>
                  ) : null}
                  {privateAvailable ? <OfficialItems cert={c} /> : <p className="mt-2 text-xs text-zinc-500">Item text is shown under npm run dev. Open the KB link for the official source.</p>}
                </div>
              </details>
            ))}
          </div>
        </Card>

        {/* ---------------- Dumps ---------------- */}
        <Card>
          <div className="border-b border-zinc-200 p-5 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Exam dumps &amp; MeasureUp practice exams</h2>
            <p className="text-sm text-zinc-500">
              Files in <code>~/.snready/quarantine/&lt;cert&gt;/dumps/</code> and <code>…/measureup/</code>, outside the repo. Overlap is near-duplicate matching (≥85% token overlap): items repeated across vendors are more likely real exam items. Items matching an official sample show the vendor copied it.
            </p>
          </div>
          {!privateAvailable ? (
            <p className="p-5 text-sm text-zinc-500">The dump inventory reads the quarantine directory, so it is only available under npm run dev.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
                  <tr>
                    <th className="p-3">Cert</th>
                    <th className="p-3">File / vendor</th>
                    <th className="p-3 text-right">Items</th>
                    <th className="p-3 text-right">Keyed</th>
                    <th className="p-3 text-right">Multi-select</th>
                    <th className="p-3 text-right">Internal dupes</th>
                    <th className="p-3 text-right">In other dumps</th>
                    <th className="p-3 text-right">= official sample</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {certs.map((c) =>
                    c.dumps?.length ? (
                      c.dumps.map((d, i) => (
                        <tr key={`${c.cert}/${d.file}`}>
                          <td className="p-3 align-top font-mono text-xs font-bold">{i === 0 ? c.cert.toUpperCase() : ""}</td>
                          <td className="p-3 align-top">
                            <div className="flex items-center gap-2 font-mono text-xs text-zinc-900 dark:text-zinc-100">
                              <Badge tone={d.source === "measureup" ? "blue" : "red"}>{d.source === "measureup" ? "MeasureUp" : "dump"}</Badge>
                              {d.file}
                            </div>
                            <div className="text-xs text-zinc-500">
                              {[d.meta.vendor, d.meta.examVersion, d.meta.purchasedAt && `bought ${d.meta.purchasedAt}`, d.meta.price].filter(Boolean).join(" · ") || "no .meta.json"}
                              {d.meta.url && (
                                <>
                                  {" · "}
                                  <a href={d.meta.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                                    source ↗
                                  </a>
                                </>
                              )}
                            </div>
                            {d.meta.notes && <div className="text-xs italic text-zinc-500">{d.meta.notes}</div>}
                          </td>
                          {[d.items, d.keyed, d.multiSelect, d.internalDuplicates, d.overlapOtherDumps, d.overlapOfficial].map((n, j) => (
                            <td key={j} className="p-3 text-right align-top font-mono">
                              {n}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr key={c.cert} className="text-zinc-400">
                        <td className="p-3 font-mono text-xs font-bold">{c.cert.toUpperCase()}</td>
                        <td className="p-3 text-xs" colSpan={7}>
                          <Badge tone="red">no dump or MeasureUp set yet</Badge>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
          <details className="border-t border-zinc-200 p-5 text-sm dark:border-zinc-800">
            <summary className="cursor-pointer font-medium text-zinc-700 dark:text-zinc-300">How to add a dump or MeasureUp exam</summary>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-zinc-600 dark:text-zinc-400">
              <li>
                Convert it to <code>~/.snready/quarantine/&lt;cert&gt;/dumps/&lt;vendor&gt;-&lt;date&gt;.json</code> (or <code>…/measureup/&lt;test-name&gt;.json</code>):{" "}
                <code>[{`{ "stem": "…", "options": ["…"], "correct": [0] | null, "domain"?: "…" }`}]</code>
              </li>
              <li>
                Optionally add <code>&lt;same name&gt;.meta.json</code>: <code>{`{ "vendor", "url", "purchasedAt", "price", "examVersion", "notes" }`}</code>
              </li>
              <li>
                Run <code>npm run pipeline -- observed --cert=&lt;cert&gt;</code>, then the <code>classify</code>, <code>distribution</code> and <code>parameterize</code> stages. The exam shape page then reflects the dump.
              </li>
            </ol>
          </details>
        </Card>
      </div>
    </div>
  );
}
