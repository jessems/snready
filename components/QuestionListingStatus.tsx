import Link from "next/link";
import { formatReviewDate } from "@/lib/author";
import { LAST_REVIEWED_ISO, LAST_REVIEWED_LABEL, getQuestionListingStatus } from "@/lib/site-facts";

interface QuestionListingStatusProps {
  questions: Parameters<typeof getQuestionListingStatus>[0];
  className?: string;
}

/** Dated status line for question listings (see getQuestionListingStatus). */
export function QuestionListingStatus({ questions, className = "" }: QuestionListingStatusProps) {
  const { reviewed, updatedIso } = getQuestionListingStatus(questions);
  return (
    <p className={`text-sm text-zinc-500 ${className}`}>
      {reviewed ? (
        <>
          Last reviewed: <time dateTime={LAST_REVIEWED_ISO}>{LAST_REVIEWED_LABEL}</time>
        </>
      ) : (
        <>
          {updatedIso && (
            <>
              Newest question added: <time dateTime={updatedIso}>{formatReviewDate(updatedIso)}</time>
              <span aria-hidden="true"> · </span>
            </>
          )}
          AI-assisted drafts, not yet individually reviewed
        </>
      )}
      <span aria-hidden="true"> · </span>
      <Link href="/how-questions-are-made" className="underline underline-offset-2 hover:text-emerald-600">
        How questions are made
      </Link>
    </p>
  );
}
