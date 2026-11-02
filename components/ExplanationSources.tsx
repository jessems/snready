// Explanation text with real documentation links. No hooks or "use client", so it
// renders the same in server-rendered static HTML and inside client components.

import {
  docLinkLabel,
  getExplanationWithSources,
  splitTextWithUrls,
  type ExplanationSourceInput,
  type SourceLink,
} from "@/lib/doc-links";

export const docLinkClassName =
  "text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-800 dark:text-emerald-400 dark:decoration-emerald-700 dark:hover:text-emerald-300";

// Text with any bare URLs rendered as real links (labelled by page, not the raw URL).
export function LinkedText({ text }: { text: string }) {
  return (
    <>
      {splitTextWithUrls(text).map((segment, index) =>
        segment.type === "link" ? (
          <a
            key={index}
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
            className={docLinkClassName}
          >
            {docLinkLabel(segment.href)}
          </a>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </>
  );
}

function LinkIcon() {
  return (
    <svg
      aria-hidden="true"
      className="mt-[3px] h-3 w-3 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

// "Source" / "Sources" block, one link per line.
export function SourceList({ sources, className = "mt-3" }: { sources: SourceLink[]; className?: string }) {
  if (sources.length === 0) return null;
  return (
    <div className={`${className} text-xs text-zinc-500 dark:text-zinc-400`}>
      <p className="font-medium">{sources.length === 1 ? "Source" : "Sources"}</p>
      <ul className="mt-1 space-y-1">
        {sources.map(({ href, label }) => (
          <li key={href} className="flex items-start gap-1.5">
            <LinkIcon />
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${docLinkClassName} break-words`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ExplanationProps {
  // Anything with an explanation plus optional references/reference/source(s) fields.
  question: ExplanationSourceInput;
  textClassName?: string;
  sourcesClassName?: string;
}

// Explanation body (trailing "See <url>" removed, other URLs linked) followed by its sources.
export function Explanation({ question, textClassName, sourcesClassName }: ExplanationProps) {
  const { body, sources } = getExplanationWithSources(question);
  return (
    <>
      {body && (
        <p className={textClassName}>
          <LinkedText text={body} />
        </p>
      )}
      <SourceList sources={sources} className={sourcesClassName} />
    </>
  );
}
