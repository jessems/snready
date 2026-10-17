// Sourced exam logistics shared by the cert hubs and blog guides. Every
// figure here links to the source it came from; leave a fact out rather than
// add it without a source (see lib/sources.ts).

import { Src } from "@/components/guide/GuideParts";
import type { SourceKey } from "@/lib/sources";

interface CertLogistics {
  name: string;
  /** Exam fee in USD from SOURCES.examChanges2026, or null if that source does not list it. */
  fee: number | null;
  retakeFee: number;
  /** Question count and duration, only where a fetched ServiceNow source states them. */
  format: { questions: number; minutes: number; source: SourceKey; note: string } | null;
  blueprint: SourceKey;
}

const LOGISTICS: Record<string, CertLogistics> = {
  csa: {
    name: "CSA",
    fee: 300,
    retakeFee: 150,
    format: { questions: 60, minutes: 90, source: "csaLengthThread", note: "per a ServiceNow Community answer from 2020; confirm in the current blueprint" },
    blueprint: "csaBlueprint",
  },
  cad: { name: "CAD", fee: 300, retakeFee: 150, format: null, blueprint: "cadBlueprint" },
  "cis-df": {
    name: "CIS-DF",
    fee: 450,
    retakeFee: 225,
    format: { questions: 75, minutes: 90, source: "cisDfExperience", note: "as reported by a candidate on the ServiceNow Community in February 2026" },
    blueprint: "cisDfBlueprint",
  },
  cpoa: { name: "CPOA", fee: null, retakeFee: 150, format: null, blueprint: "cpoaBlueprint" },
};

function RetakeTimeline() {
  const steps = [
    { label: "Attempt 1", gap: "" },
    { label: "Attempt 2", gap: "3 days" },
    { label: "Attempt 3", gap: "30 days" },
    { label: "Attempt 4+", gap: "6 months each" },
  ];
  return (
    <figure className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <svg viewBox="0 0 640 110" role="img" aria-labelledby="retake-title" className="h-auto w-full">
        <title id="retake-title">Minimum waiting periods between exam attempts</title>
        <line x1="60" y1="50" x2="580" y2="50" className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="3" />
        {steps.map((step, i) => {
          const x = 60 + i * 173;
          return (
            <g key={step.label}>
              <circle cx={x} cy={50} r={14} className={i === 0 ? "fill-emerald-500" : "fill-zinc-800 dark:fill-zinc-200"} />
              <text x={x} y={90} textAnchor="middle" className="fill-zinc-800 text-[13px] font-semibold dark:fill-zinc-200">{step.label}</text>
              {step.gap && (
                <text x={x - 86} y={36} textAnchor="middle" className="fill-emerald-700 text-[12px] font-semibold dark:fill-emerald-300">{`wait ${step.gap}`}</text>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Waiting periods between attempts, per the <Src k="examChanges2026">2026 rules summarised on the ServiceNow Community</Src>.
      </figcaption>
    </figure>
  );
}

export function ExamLogistics({ certSlug }: { certSlug: keyof typeof LOGISTICS | string }) {
  const cert = LOGISTICS[certSlug];
  if (!cert) return null;
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="text-lg font-bold text-zinc-950 dark:text-white">Booking and delivery</h3>
          <ul className="mt-3 space-y-2 text-base leading-7">
            <li>
              Exams are registered and paid for in ServiceNow University and scheduled through Pearson VUE, signing in with SSO. Exam vouchers no longer exist (<Src k="examChanges2026">ServiceNow Community, Jan 2026</Src>; see also <Src k="voucherEligibilityThread">this July 2026 thread</Src>).
            </li>
            <li>
              Training: on-demand courses are free but don&apos;t include an exam attempt; instructor-led training is paid ($1,900 for 2 days, $2,700 for 3 days) and includes the first attempt (<Src k="examChanges2026">source</Src>). Sources differ on whether a course is mandatory: the January 2026 summary says completing the course unlocks eligibility, while a May 2026 reply describes the recommended courses as &ldquo;not required but highly recommended&rdquo; (<Src k="cadVoucherThread">CAD thread</Src>). Check the registration page for your exam.
            </li>
            <li>
              Once registered, you must sit the exam within 90 days or the attempt is forfeited. Exam payments are non-refundable, but you can reschedule without a fee inside the rescheduling window (<Src k="examChanges2026">source</Src>).
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="text-lg font-bold text-zinc-950 dark:text-white">{cert.name} format, fees and scoring</h3>
          <ul className="mt-3 space-y-2 text-base leading-7">
            {cert.format ? (
              <li>
                {cert.format.questions} questions in {cert.format.minutes} minutes, {cert.format.note} (<Src k={cert.format.source}>source</Src>).
              </li>
            ) : (
              <li>
                We couldn&apos;t find a public ServiceNow source for the current question count and time limit, so we don&apos;t quote one. Check the <Src k={cert.blueprint}>official {cert.name} blueprint</Src> after signing in to Now Learning.
              </li>
            )}
            <li>
              {cert.fee !== null ? (
                <>Exam fee: ${cert.fee} USD excluding tax. </>
              ) : (
                <>Our source doesn&apos;t list the {cert.name} exam fee; ServiceNow University shows it when you register. </>
              )}
              Retake fee: ${cert.retakeFee} USD (<Src k="examChanges2026">source</Src>).
            </li>
            <li>
              ServiceNow doesn&apos;t publish the cut score: each exam is scored against a predetermined cut score that is not shared with candidates, and it is the same for everyone (<Src k="cutScoreThread">ServiceNow Community, Jul 2026</Src>). Treat any &ldquo;70% to pass&rdquo; claim as a guess.
            </li>
          </ul>
        </div>
      </div>
      <RetakeTimeline />
    </div>
  );
}

export const LOGISTICS_SOURCE_KEYS: SourceKey[] = ["examChanges2026", "voucherEligibilityThread", "cadVoucherThread", "cutScoreThread"];

export function logisticsSourceKeys(certSlug: string): SourceKey[] {
  const cert = LOGISTICS[certSlug];
  if (!cert) return LOGISTICS_SOURCE_KEYS;
  return [...LOGISTICS_SOURCE_KEYS, cert.blueprint, ...(cert.format ? [cert.format.source] : [])];
}
