import Link from "next/link";
import { getCertCluster } from "@/lib/cert-clusters";

/** "Keep studying" links between the pages of one certification's cluster. */
export function StudyCluster({ certSlug, currentPath, title }: { certSlug: string; currentPath: string; title?: string }) {
  const links = getCertCluster(certSlug).filter((link) => link.href !== currentPath);
  if (links.length === 0) return null;
  return (
    <nav aria-label="Related study pages" className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/60">
      <h2 className="text-lg font-bold text-zinc-950 dark:text-white">{title ?? "Keep studying"}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="group block rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-emerald-300 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-emerald-700">
              <span className="font-semibold text-zinc-900 group-hover:text-emerald-700 dark:text-zinc-100 dark:group-hover:text-emerald-300">{link.label}</span>
              <span className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400">{link.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
