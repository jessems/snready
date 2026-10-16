import Link from "next/link";
import { AUTHOR, formatReviewDate } from "@/lib/author";

interface AuthorBylineProps {
  /** ISO date (YYYY-MM-DD) the page was last reviewed. */
  reviewed: string;
  className?: string;
  /** "onDark" for dark hero backgrounds (course pages). */
  variant?: "default" | "onDark";
}

/** Visible author byline with the last-reviewed date, linking to /about. */
export function AuthorByline({ reviewed, className = "", variant = "default" }: AuthorBylineProps) {
  const onDark = variant === "onDark";
  return (
    <p className={`text-sm ${onDark ? "text-slate-300" : "text-zinc-500 dark:text-zinc-400"} ${className}`}>
      By{" "}
      <Link
        href={AUTHOR.path}
        rel="author"
        className={`font-medium underline underline-offset-2 ${onDark ? "text-white decoration-white/40 hover:text-emerald-200" : "text-zinc-700 decoration-zinc-300 hover:text-emerald-600 dark:text-zinc-200"}`}
      >
        {AUTHOR.name}
      </Link>
      , {AUTHOR.jobTitle}
      <span aria-hidden="true"> · </span>
      Last reviewed <time dateTime={reviewed}>{formatReviewDate(reviewed)}</time>
    </p>
  );
}
