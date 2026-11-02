import Link from "next/link";
import { LEGAL_PAGES } from "@/lib/legal";

/** Small "Terms · Privacy · Refunds" line for pricing and checkout pages. */
export default function LegalLinks({ className = "" }: { className?: string }) {
  return (
    <p className={`text-sm text-zinc-500 dark:text-zinc-400 ${className}`}>
      {LEGAL_PAGES.map((page, index) => (
        <span key={page.href}>
          {index > 0 && <span aria-hidden="true"> · </span>}
          <Link href={page.href} className="underline underline-offset-2 hover:text-emerald-600">
            {page.title}
          </Link>
        </span>
      ))}
    </p>
  );
}
