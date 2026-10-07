import type { Metadata } from "next";
import { loadCert } from "@/lib/pipeline-audit";
import { sequenceQuestions } from "@/lib/question-sequencing";
import { Badge, Card, Stat, labelize } from "../../ui";

export const metadata: Metadata = { title: "Generated questions - Pipeline Admin", robots: "noindex, nofollow" };

export default async function QuestionsPage({ params }: { params: Promise<{ cert: string }> }) {
  const { cert } = await params;
  const { blueprint, generated, rejections, plan, facts } = loadCert(cert);
  const factsById = new Map(facts.facts.map((f) => [f.factId, f]));
  const domainName = new Map(blueprint?.domains.map((d) => [d.id, d.name]) ?? []);

  // Families and shared facts: the identity data sequencing relies on.
  const familySizes = new Map<string, number>();
  const factUse = new Map<string, number>();
  for (const q of generated) {
    familySizes.set(q.identity.familyKey, (familySizes.get(q.identity.familyKey) ?? 0) + 1);
    for (const k of q.identity.knowledgeKeys) factUse.set(k, (factUse.get(k) ?? 0) + 1);
  }
  const sharedFacts = [...factUse.entries()].filter(([, n]) => n > 1);
  const order = sequenceQuestions(generated.map((q) => ({ ...q, id: q.identity.instanceId })));

  const rejectionKinds = new Map<string, number>();
  for (const r of rejections) rejectionKinds.set(r.kind ?? r.stage, (rejectionKinds.get(r.kind ?? r.stage) ?? 0) + 1);

  const planned = blueprint?.domains.map((d) => ({
    ...d,
    target: Math.round(((plan?.totalTarget ?? 0) * d.weight) / 100),
    have: generated.filter((q) => q.domainId === d.id).length,
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        <strong>Type mix not validated for older questions.</strong> Questions without a &quot;variant&quot; or &quot;restructure&quot; badge were planned before 2026-10-07 from a type mix
        measured on SNReady&apos;s own bank, which is no longer an allowed source. Every question is grounded in a docs fact, but those should be re-planned from official evidence.
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Generated questions" value={generated.length} tone="emerald" detail={`plan target ${plan?.totalTarget ?? "—"}`} />
        <Stat label="Families (templates used)" value={familySizes.size} />
        <Stat label="Facts tested by >1 question" value={sharedFacts.length} detail="kept apart by sequencing" tone="blue" />
        <Stat label="Rejected" value={rejections.length} detail={[...rejectionKinds].map(([k, n]) => `${k} ${n}`).join(" · ")} tone="amber" />
      </div>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Blueprint balance</h2>
        <div className="mt-3 space-y-2">
          {planned?.map((d) => (
            <div key={d.id} className="grid grid-cols-[1fr_6rem] items-center gap-3 text-sm sm:grid-cols-[18rem_1fr_6rem]">
              <span className="truncate text-zinc-700 dark:text-zinc-300">
                {d.number}. {d.name} <span className="text-zinc-400">({d.weight}%)</span>
              </span>
              <div className="hidden h-2 overflow-hidden rounded-full bg-zinc-200 sm:block dark:bg-zinc-800">
                <div className={`h-full ${d.have >= d.target ? "bg-emerald-500" : "bg-amber-400"}`} style={{ width: `${Math.min(100, (d.have / Math.max(d.target, 1)) * 100)}%` }} />
              </div>
              <span className="text-right font-mono text-zinc-900 dark:text-zinc-100">
                {d.have}/{d.target}
              </span>
            </div>
          ))}
        </div>
        {plan && plan.gaps.length > 0 && (
          <details className="mt-4 text-sm">
            <summary className="cursor-pointer text-zinc-600 dark:text-zinc-400">{plan.gaps.length} plan gaps</summary>
            <ul className="mt-2 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              {plan.gaps.map((g, i) => (
                <li key={i}>
                  <span className="font-mono">{domainName.get(g.domainId) ?? g.domainId}</span> · {g.archetypeId === "*" ? "all types" : labelize(g.archetypeId)}: {g.reason}
                </li>
              ))}
            </ul>
          </details>
        )}
      </Card>

      <Card>
        <div className="border-b border-zinc-200 p-5 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Questions in sequenced order</h2>
          <p className="text-sm text-zinc-500">Order after family-aware spacing: same template ≥4 apart, same fact ≥8 apart.</p>
        </div>
        <ol className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {order.map((q, i) => {
            const fact = factsById.get(q.identity.knowledgeKeys[0]);
            return (
              <li key={q.identity.instanceId} className="p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono text-zinc-400">#{i + 1}</span>
                  <Badge>{domainName.get(q.domainId) ?? q.domainId}</Badge>
                  <Badge tone="blue">{labelize(q.identity.archetypeId)}</Badge>
                  <Badge>{q.format.replace(/_/g, " ")}</Badge>
                  <Badge>{q.cognitiveLevel}</Badge>
                  {(familySizes.get(q.identity.familyKey) ?? 0) > 1 && <Badge tone="amber">family of {familySizes.get(q.identity.familyKey)}</Badge>}
                  {(factUse.get(q.identity.knowledgeKeys[0]) ?? 0) > 1 && <Badge tone="red">fact shared</Badge>}
                  {q.derivedFrom && (
                    <Badge tone={q.derivedFrom.relation === "variant" ? "blue" : "emerald"} title={`derived from official item ${q.derivedFrom.observedItemId}`}>
                      {q.derivedFrom.relation} of official {q.derivedFrom.observedItemId}
                    </Badge>
                  )}
                </div>
                <div className="mt-2 font-medium text-zinc-900 dark:text-zinc-100">{q.stem}</div>
                <ul className="mt-2 space-y-0.5 text-sm">
                  {q.options.map((o) => (
                    <li key={o.id} className={q.correctAnswers.includes(o.id) ? "font-semibold text-emerald-700 dark:text-emerald-400" : "text-zinc-600 dark:text-zinc-400"}>
                      {o.id}) {o.text}
                    </li>
                  ))}
                </ul>
                <details className="mt-2 text-sm">
                  <summary className="cursor-pointer text-xs text-zinc-500">Explanation, source and identity</summary>
                  <div className="mt-2 space-y-2 text-zinc-700 dark:text-zinc-300">
                    <p>{q.explanation.correct}</p>
                    <ul className="space-y-1 text-xs">
                      {q.explanation.wrongAnswers.map((w) => (
                        <li key={w.choiceId}>
                          <span className="font-mono">{w.choiceId}</span>: {w.explanation}
                        </li>
                      ))}
                    </ul>
                    <blockquote className="border-l-2 border-zinc-300 pl-2 text-xs italic dark:border-zinc-700">{q.quote}</blockquote>
                    <dl className="grid grid-cols-[8rem_1fr] gap-x-3 gap-y-0.5 font-mono text-xs text-zinc-500">
                      <dt>instanceId</dt>
                      <dd>{q.identity.instanceId}</dd>
                      <dt>familyKey</dt>
                      <dd>{q.identity.familyKey}</dd>
                      <dt>knowledgeKeys</dt>
                      <dd>{q.identity.knowledgeKeys.join(", ")}</dd>
                      <dt>fact</dt>
                      <dd>
                        {fact?.subject} = {String(fact?.value)}
                      </dd>
                      <dt>source</dt>
                      <dd>
                        <a href={q.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                          {q.sourceUrl}
                        </a>
                      </dd>
                    </dl>
                  </div>
                </details>
              </li>
            );
          })}
        </ol>
      </Card>

      <Card>
        <div className="border-b border-zinc-200 p-5 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Rejections ({rejections.length})</h2>
          <p className="text-sm text-zinc-500">Drafts the writer or validator refused. Trivia blocks the fact for every template.</p>
        </div>
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rejections.map((r) => {
              const fact = factsById.get(r.factId);
              return (
                <tr key={r.instanceId}>
                  <td className="whitespace-nowrap p-3 align-top">
                    <Badge tone={r.kind === "trivia" ? "red" : r.stage === "validate" ? "blue" : "amber"}>{r.kind ?? r.stage}</Badge>
                  </td>
                  <td className="p-3 align-top">
                    <div className="font-mono text-xs text-zinc-500">{r.instanceId}</div>
                    {fact && (
                      <div className="text-xs text-zinc-500">
                        {fact.subject} = {String(fact.value)}
                      </div>
                    )}
                  </td>
                  <td className="p-3 align-top text-zinc-700 dark:text-zinc-300">{r.reason.replace(/^writer: /, "")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
