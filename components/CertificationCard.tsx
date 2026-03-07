import Link from "next/link";
import type { CertificationWithReadiness } from "@/types";

interface CertificationCardProps {
  certification: CertificationWithReadiness;
}

function getLevelColor(level: string) {
  switch (level) {
    case "entry":
      return "from-sky-400 to-blue-500";
    case "professional":
      return "from-[var(--primary)] to-purple-500";
    case "expert":
      return "from-amber-400 to-orange-500";
    default:
      return "from-zinc-400 to-zinc-500";
  }
}

function getLevelBadge(level: string, isReady: boolean) {
  if (!isReady) {
    return "bg-[var(--surface)] text-[var(--text-muted)]";
  }

  switch (level) {
    case "entry":
      return "bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300";
    case "professional":
      return "bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
    case "expert":
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    default:
      return "bg-[var(--surface)] text-[var(--text-muted)]";
  }
}

export default function CertificationCard({ certification }: CertificationCardProps) {
  const { isReady } = certification;

  const cardContent = (
    <>
      {/* Top row with level and price */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${getLevelBadge(certification.level, isReady)}`}>
          {certification.level}
        </span>
        
        <span className={`text-sm font-semibold tabular-nums ${isReady ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>
          {isReady ? "$9" : `$${certification.examDetails.cost}`}
        </span>
      </div>

      {/* Certification name with gradient accent */}
      <div className="relative">
        {isReady && (
          <div className={`absolute -left-4 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b ${getLevelColor(certification.level)}`} />
        )}
        <h4 className={`text-xl font-bold tracking-tight ${isReady ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
          {certification.name}
        </h4>
      </div>

      {/* Full name */}
      <p className={`mt-1 text-sm leading-snug ${isReady ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}`}>
        {certification.fullName}
      </p>

      {/* Stats row */}
      <div className={`mt-4 flex items-center gap-3 text-xs font-medium ${isReady ? 'text-[var(--text-muted)]' : 'text-[var(--text-muted)] opacity-60'}`}>
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {certification.examDetails.questionCount} Q
        </span>
        <span className="opacity-30">•</span>
        <span>{certification.examDetails.duration}m</span>
        <span className="opacity-30">•</span>
        <span>{certification.examDetails.passingScore}%</span>
      </div>

      {/* Practice questions count */}
      {isReady && certification.totalQuestions > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--success)]">
              {certification.totalQuestions}+ practice questions
            </span>
            <svg className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}

      {/* Status indicator for coming soon */}
      {!isReady && (
        <div className="mt-4 pt-4 border-t border-[var(--border)] border-dashed">
          <span className="text-xs font-medium text-[var(--text-muted)]">
            Coming soon
          </span>
        </div>
      )}
    </>
  );

  if (isReady) {
    return (
      <Link
        href={`/${certification.slug}`}
        className="group relative flex flex-col p-5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-lg hover:shadow-[rgba(99,91,255,0.1)] transition-all duration-200"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="relative flex flex-col p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] border-dashed opacity-60">
      {cardContent}
    </div>
  );
}
