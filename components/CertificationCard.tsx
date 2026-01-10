import Link from "next/link";
import type { CertificationWithReadiness } from "@/types";

interface CertificationCardProps {
  certification: CertificationWithReadiness;
}

function getLevelStyles(level: string, isReady: boolean) {
  if (!isReady) {
    return "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500";
  }

  switch (level) {
    case "entry":
      return "bg-sky-50 text-sky-700 ring-1 ring-sky-200/50 dark:bg-sky-950 dark:text-sky-300 dark:ring-sky-800/50";
    case "professional":
      return "bg-violet-50 text-violet-700 ring-1 ring-violet-200/50 dark:bg-violet-950 dark:text-violet-300 dark:ring-violet-800/50";
    case "expert":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200/50 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800/50";
    default:
      return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
  }
}

export default function CertificationCard({ certification }: CertificationCardProps) {
  const { isReady } = certification;

  const cardContent = (
    <>
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Level badge */}
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${getLevelStyles(
              certification.level,
              isReady
            )}`}
          >
            {certification.level}
          </span>

          {/* Status badge */}
          {isReady ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200/60 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800/60">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Available
            </span>
          ) : (
            <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              Coming Soon
            </span>
          )}
        </div>

        {/* Cost */}
        <span
          className={`text-sm font-medium tabular-nums ${
            isReady
              ? "text-zinc-600 dark:text-zinc-400"
              : "text-zinc-400 dark:text-zinc-600"
          }`}
        >
          ${certification.examDetails.cost}
        </span>
      </div>

      {/* Title */}
      <h4
        className={`mt-3 text-lg font-bold tracking-tight transition-colors ${
          isReady
            ? "text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-50 dark:group-hover:text-emerald-400"
            : "text-zinc-400 dark:text-zinc-500"
        }`}
      >
        {certification.name}
      </h4>

      {/* Subtitle */}
      <p
        className={`mt-0.5 text-sm leading-snug ${
          isReady
            ? "text-zinc-500 dark:text-zinc-400"
            : "text-zinc-400 dark:text-zinc-600"
        }`}
      >
        {certification.fullName}
      </p>

      {/* Stats row */}
      <div
        className={`mt-3 flex items-center gap-3 text-xs font-medium ${
          isReady
            ? "text-zinc-500 dark:text-zinc-400"
            : "text-zinc-400 dark:text-zinc-600"
        }`}
      >
        <span className="flex items-center gap-1">
          <svg
            className="h-3.5 w-3.5 opacity-60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {certification.examDetails.questionCount}
        </span>
        <span className="text-zinc-300 dark:text-zinc-600">•</span>
        <span>{certification.examDetails.duration} min</span>
        <span className="text-zinc-300 dark:text-zinc-600">•</span>
        <span>{certification.examDetails.passingScore}%</span>

        {/* Practice question count for ready cards */}
        {isReady && certification.totalQuestions > 0 && (
          <>
            <span className="ml-auto text-emerald-600 dark:text-emerald-400">
              {certification.totalQuestions}+ practice
            </span>
          </>
        )}
      </div>

      {/* Accent bar for ready cards */}
      {isReady && (
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-950/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 group-hover:w-full dark:from-emerald-400 dark:to-emerald-500"
            style={{ width: "60%" }}
          />
        </div>
      )}
    </>
  );

  // Ready cards are clickable links
  if (isReady) {
    return (
      <Link
        href={`/certifications/${certification.slug}`}
        className="group relative flex flex-col rounded-xl border-2 border-emerald-200/80 bg-gradient-to-br from-white via-white to-emerald-50/40 p-5 shadow-sm shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60 dark:border-emerald-800/60 dark:from-zinc-900 dark:via-zinc-900 dark:to-emerald-950/30 dark:shadow-none dark:hover:border-emerald-700 dark:hover:shadow-emerald-900/20"
      >
        {cardContent}
      </Link>
    );
  }

  // Not-ready cards are non-interactive divs
  return (
    <div className="relative flex flex-col rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-5 opacity-60 dark:border-zinc-800/60 dark:bg-zinc-900/50">
      {cardContent}
    </div>
  );
}
