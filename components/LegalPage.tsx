import type { ReactNode } from "react";
import { LEGAL_UPDATED_ISO, LEGAL_UPDATED_LABEL } from "@/lib/legal";
import LegalLinks from "@/components/LegalLinks";

/** Shared layout for /privacy, /terms and /refunds. */
export default function LegalPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <article className="legal-page mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">{title}</h1>
      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
        Last updated <time dateTime={LEGAL_UPDATED_ISO}>{LEGAL_UPDATED_LABEL}</time>
      </p>
      <div className="mt-8 text-lg leading-8 text-zinc-700 dark:text-zinc-300">{intro}</div>
      <div className="mt-6 space-y-5 text-base leading-7 text-zinc-700 dark:text-zinc-300">{children}</div>
      <LegalLinks className="mt-14 border-t border-zinc-200 pt-6 dark:border-zinc-800" />
    </article>
  );
}
