import type { ReactNode } from "react";

export function pct(share: number): string {
  const v = share * 100;
  return `${Number.isInteger(v) ? v : v.toFixed(1)}%`;
}

export function labelize(id: string): string {
  return id.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 ${className}`}>{children}</section>;
}

export function Stat({ label, value, detail, tone = "zinc" }: { label: string; value: ReactNode; detail?: ReactNode; tone?: "zinc" | "emerald" | "blue" | "amber" | "red" }) {
  const toneClass = {
    zinc: "text-zinc-900 dark:text-zinc-100",
    emerald: "text-emerald-600 dark:text-emerald-400",
    blue: "text-blue-600 dark:text-blue-400",
    amber: "text-amber-600 dark:text-amber-400",
    red: "text-red-600 dark:text-red-400",
  }[tone];
  return (
    <Card className="p-4">
      <div className={`text-2xl font-bold ${toneClass}`}>{value}</div>
      <div className="text-sm text-zinc-600 dark:text-zinc-400">{label}</div>
      {detail && <div className="mt-1 text-xs text-zinc-500">{detail}</div>}
    </Card>
  );
}

const badgeTones = {
  zinc: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  amber: "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  red: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
};

export function Badge({ children, tone = "zinc", title }: { children: ReactNode; tone?: keyof typeof badgeTones; title?: string }) {
  return (
    <span title={title} className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeTones[tone]}`}>
      {children}
    </span>
  );
}

/** Horizontal share bar. */
export function ShareBar({ share, tone = "bg-emerald-500" }: { share: number; tone?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
      <div className={`h-full ${tone}`} style={{ width: `${Math.min(share * 100, 100)}%` }} />
    </div>
  );
}

/** A template stem with {slots} highlighted. */
export function StemFrame({ stem }: { stem: string }) {
  const parts = stem.split(/(\{[a-z]+\})/g);
  return (
    <span className="font-mono text-sm">
      {parts.map((part, i) =>
        /^\{[a-z]+\}$/.test(part) ? (
          <span key={i} className="rounded bg-violet-100 px-1 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

/** Slot bindings as key = value chips. */
export function Bindings({ bindings }: { bindings: { subject?: string; value?: string | string[]; context?: string } }) {
  const entries = Object.entries(bindings).filter(([, v]) => v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0));
  if (!entries.length) return <span className="text-xs text-zinc-400">no bindings</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {entries.map(([k, v]) => (
        <span key={k} className="rounded-md bg-violet-50 px-1.5 py-0.5 font-mono text-xs text-violet-900 dark:bg-violet-950/40 dark:text-violet-200">
          {k} = {Array.isArray(v) ? `[${v.join(", ")}]` : v}
        </span>
      ))}
    </div>
  );
}

export function Answer({ values }: { values: string[] }) {
  if (!values.length) return <span className="text-xs text-zinc-400">—</span>;
  return (
    <span className="font-mono text-sm font-semibold text-emerald-700 dark:text-emerald-400">
      {values.join(" + ")}
    </span>
  );
}

export function PrivateNotice({ available }: { available: boolean }) {
  return available ? (
    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
      <strong>Quarantined data visible.</strong> Observed exam items are rendered because this is <code>next dev</code>. They are never included in a build.
    </div>
  ) : (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
      Observed exam items are hidden. They are shown only under <code>npm run dev</code> with a local quarantine directory. Aggregates below are still accurate.
    </div>
  );
}
