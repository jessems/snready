import type { Metadata } from "next";
import { buildFactRows, loadCert } from "@/lib/pipeline-audit";
import { Badge, Card, Stat } from "../../ui";
import { FactsTable } from "./FactsTable";

export const metadata: Metadata = { title: "Facts - Pipeline Admin", robots: "noindex, nofollow" };

export default async function FactsPage({ params }: { params: Promise<{ cert: string }> }) {
  const { cert } = await params;
  const { blueprint, sources, corpus, facts } = loadCert(cert);
  const rows = buildFactRows(cert);
  const domains = blueprint?.domains ?? [];
  const objectiveCovered = new Set(sources?.docs.flatMap((d) => d.objectiveIds) ?? []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Doc seeds" value={sources?.docs.length ?? 0} detail={`${sources?.docs.filter((d) => d.origin === "curated").length ?? 0} curated · ${sources?.courses.length ?? 0} courses skipped`} />
        <Stat label="Pages crawled" value={corpus.pages.length} />
        <Stat label="Facts" value={rows.length} detail={`from ${facts.processedChunks.length} chunks`} tone="emerald" />
        <Stat label="Used in questions" value={rows.filter((f) => f.usedBy > 0).length} detail={`${rows.filter((f) => f.blocked).length} blocked as trivia`} tone="blue" />
      </div>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Blueprint coverage</h2>
        <p className="mb-4 text-sm text-zinc-500">Objectives → doc seeds → extracted facts.</p>
        <div className="grid gap-4 lg:grid-cols-2">
          {domains.map((d) => {
            const domainFacts = rows.filter((f) => f.domainIds.includes(d.id)).length;
            return (
              <div key={d.id} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    {d.number}. {d.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {d.weight}% · {domainFacts} facts
                  </div>
                </div>
                <ul className="mt-2 space-y-1 text-sm">
                  {d.objectives.map((o) => {
                    const seeds = sources?.docs.filter((s) => s.objectiveIds.includes(o.id)) ?? [];
                    return (
                      <li key={o.id} className="flex flex-wrap items-baseline gap-2">
                        <span className={objectiveCovered.has(o.id) ? "text-zinc-700 dark:text-zinc-300" : "text-red-600 dark:text-red-400"}>{o.name}</span>
                        {seeds.length === 0 && <Badge tone="red">no docs</Badge>}
                        {seeds.map((s) => (
                          <a key={s.subpath} href={s.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline dark:text-blue-400" title={s.origin}>
                            {s.title}
                          </a>
                        ))}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </Card>

      <FactsTable facts={rows} domains={domains.map((d) => ({ id: d.id, name: d.name }))} />
    </div>
  );
}
