"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Exam shape", suffix: "" },
  { label: "Facts", suffix: "/facts" },
  { label: "Generated questions", suffix: "/questions" },
];

export function CertTabs({ cert }: { cert: string }) {
  const pathname = usePathname().replace(/\/$/, "");
  return (
    <nav className="my-6 flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
      {TABS.map((tab) => {
        const href = `/admin/pipeline/${cert}${tab.suffix}`;
        const active = pathname === href;
        return (
          <Link
            key={tab.label}
            href={href}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
              active
                ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
      <Link href="/admin/pipeline/sources" className="-mb-px ml-auto border-b-2 border-transparent px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
        Exam sources ↗
      </Link>
    </nav>
  );
}
