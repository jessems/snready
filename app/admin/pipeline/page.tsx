import type { Metadata } from "next";
import Link from "next/link";
import { listPipelineCerts, loadCert, loadTemplates, privateDataEnabled } from "@/lib/pipeline-audit";
import { Badge, Card, PrivateNotice, Stat } from "./ui";

export const metadata: Metadata = {
  title: "Question Pipeline - Admin",
  robots: "noindex, nofollow",
};

export default function PipelineIndex() {
  const certs = listPipelineCerts().map((cert) => ({ cert, ...loadCert(cert) }));
  const { accepted, proposed } = loadTemplates();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-3 flex flex-wrap gap-4 text-sm">
          <Link href="/admin/exam-intel" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
            ← Exam intelligence
          </Link>
          <Link href="/admin/coverage" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
            Coverage
          </Link>
          <Link href="/admin/pipeline/sources" className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400">
            Exam sources: official samples &amp; dumps →
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Question pipeline audit</h1>
        <p className="mt-2 max-w-3xl text-zinc-600 dark:text-zinc-400">
          Every element the pipeline generated, per certification: exam shape (question types → templates → parameterized instances), the docs fact store, and generated questions with their identities and rejections. See{" "}
          <code className="text-sm">docs/question-pipeline.md</code>.
        </p>
        <div className="mt-4 max-w-3xl">
          <PrivateNotice available={privateDataEnabled} />
        </div>

        <div className="my-8 grid gap-4 sm:grid-cols-3">
          <Stat label="Certifications in pipeline" value={certs.length} />
          <Stat label="Accepted templates" value={accepted.length} tone="emerald" detail="shared across certifications" />
          <Stat label="Template proposals" value={proposed.length} tone="amber" detail="from parameterizing observed items" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {certs.map(({ cert, blueprint, sources, corpus, facts, distribution, parameterization, generated, rejections, plan }) => (
            <Card key={cert} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{cert.toUpperCase()}</h2>
                  <p className="text-sm text-zinc-500">
                    {blueprint?.domains.length ?? 0} domains · release {blueprint?.release} · blueprint {blueprint?.spec?.kb} ({blueprint?.spec?.updated})
                  </p>
                </div>
                <Badge tone="emerald">{generated.length} questions</Badge>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                {[
                  ["Doc seeds → pages", `${sources?.docs.length ?? 0} → ${corpus.pages.length}`],
                  ["Courses (skipped)", sources?.courses.length ?? 0],
                  ["Facts", `${facts.facts.length} from ${facts.processedChunks.length} chunks`],
                  ["Observed items classified", distribution?.basis.observedItems ?? 0],
                  ["Question types", distribution?.archetypes.length ?? 0],
                  ["Items parameterized", parameterization ? `${parameterization.parameterized}/${parameterization.items}` : "—"],
                  ["Plan target", plan?.totalTarget ?? "—"],
                  ["Writer/validation rejections", rejections.length],
                ].map(([k, v]) => (
                  <div key={String(k)} className="contents">
                    <dt className="text-zinc-500">{k}</dt>
                    <dd className="text-right font-medium text-zinc-900 dark:text-zinc-100">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                {[
                  ["Exam shape", ""],
                  ["Facts", "/facts"],
                  ["Questions", "/questions"],
                ].map(([label, suffix]) => (
                  <Link
                    key={label}
                    href={`/admin/pipeline/${cert}${suffix}`}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 font-medium text-white hover:bg-emerald-700"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
