import { ExternalLink } from "lucide-react";
import type { CertSourceItem, CertSources } from "@/lib/cert-sources";

const FORMAT_LABELS: [RegExp, string][] = [
  [/^choose course option/i, "ILT or on-demand"],
  [/^on-demand/i, "On-demand"],
  [/^instructor-led/i, "Instructor-led"],
  [/^(learning )?path$/i, "Learning path"],
];

function formatLabel(format?: string): string | undefined {
  if (!format) return undefined;
  return FORMAT_LABELS.find(([re]) => re.test(format))?.[1] ?? format;
}

function sourceTags(listedIn: string[]): string[] {
  const tags = listedIn.map((l) => {
    if (l === "blueprint: recommended" || l === "blueprint") return "Blueprint";
    if (l.startsWith("blueprint")) return "Blueprint (additional)";
    const step = l.match(/^credential path: step (\d+)/);
    return step ? `Path step ${step[1]}` : l;
  });
  return [...new Set(tags)];
}

// Only surface notes a learner needs; provenance notes stay in the CSV
function learnerNote(notes?: string): string | undefined {
  if (!notes) return undefined;
  const keep = notes
    .split("; ")
    .filter((n) => /either one|RETIRED/.test(n))
    .map((n) => n.replace(/^Blueprint: /, ""));
  return keep.length ? keep.join(" · ") : undefined;
}

function staleDocsRelease(notes?: string): string | undefined {
  return notes?.match(/points at the (\w+) release docs/)?.[1];
}

function ExtLink({
  href,
  children,
  className = "",
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (!href) return <span className={className}>{children}</span>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`hover:text-emerald-600 dark:hover:text-emerald-400 ${className}`}
    >
      {children}
      <ExternalLink
        className="ml-1 inline h-3.5 w-3.5 align-[-2px] opacity-60"
        aria-hidden
      />
    </a>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
      {children}
    </span>
  );
}

function CourseList({ items }: { items: CertSourceItem[] }) {
  return (
    <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
      {items.map((item) => {
        const format = formatLabel(item.format);
        const note = learnerNote(item.notes);
        return (
          <li
            key={item.name}
            className="flex flex-col gap-1.5 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
          >
            <div className="min-w-0">
              <ExtLink
                href={item.url}
                className="font-medium text-zinc-900 dark:text-zinc-100"
              >
                {item.name}
              </ExtLink>
              {note && (
                <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
                  {note}
                </p>
              )}
            </div>
            <div className="flex shrink-0 flex-wrap gap-1.5 sm:justify-end">
              {format && <Badge>{format}</Badge>}
              {item.duration && <Badge>{item.duration}</Badge>}
              {sourceTags(item.listedIn).map((t) => (
                <span
                  key={t}
                  className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function groupByNote(items: CertSourceItem[]): [string, CertSourceItem[]][] {
  const groups = new Map<string, CertSourceItem[]>();
  for (const item of items) {
    const key = item.notes === "Any two of this list" ? "At least two of" : "";
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return [...groups.entries()];
}

function formatCheckedOn(date?: string): string | undefined {
  if (!date) return undefined;
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function OfficialStudyResources({
  certName,
  sources,
}: {
  certName: string;
  sources: CertSources;
}) {
  const {
    blueprint,
    credentialPathUrl,
    exam,
    prerequisites,
    coreCourses,
    additionalCourses,
    recommendedCertifications,
    docs,
    otherResources,
  } = sources;
  const checkedOn = formatCheckedOn(sources.checkedOn);

  return (
    <section id="official-resources" className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Official Study Resources
        </h2>
        <p className="mt-2 max-w-3xl text-zinc-600 dark:text-zinc-400">
          The courses and documentation ServiceNow itself points you to for the{" "}
          {certName} exam, from the official exam blueprint
          {blueprint.kb ? ` (${blueprint.kb}` : ""}
          {blueprint.updated ? `, updated ${blueprint.updated}` : ""}
          {blueprint.kb ? ")" : ""}
          {credentialPathUrl ? " and the ServiceNow University credential path" : ""}
          .{checkedOn ? ` Last checked ${checkedOn}.` : ""}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <ExtLink href={blueprint.url}>Exam blueprint</ExtLink>
          {credentialPathUrl && (
            <ExtLink href={credentialPathUrl}>Credential path</ExtLink>
          )}
          {exam?.url && <ExtLink href={exam.url}>Exam registration</ExtLink>}
        </div>

        {prerequisites.length > 0 && (
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
            <h3 className="font-semibold text-amber-900 dark:text-amber-200">
              Required before you can take this exam
            </h3>
            {groupByNote(prerequisites).map(([label, items]) => (
              <div key={label} className="mt-3">
                {label && (
                  <p className="mb-1 text-sm font-medium text-amber-800 dark:text-amber-300">
                    {label}:
                  </p>
                )}
                <ul className="grid gap-1.5 text-sm text-amber-900 sm:grid-cols-2 dark:text-amber-100">
                  {items.map((p) => (
                    <li key={p.name}>
                      <ExtLink href={p.url}>{p.name}</ExtLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Recommended courses
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              ServiceNow recommends these but does not require completing them
              to sit the exam.
            </p>
            <div className="mt-2 rounded-lg border border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900">
              <CourseList items={coreCourses} />
            </div>

            {(additionalCourses.length > 0 ||
              recommendedCertifications.length > 0) && (
              <details className="group mt-4 rounded-lg border border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900">
                <summary className="cursor-pointer py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {additionalCourses.length + recommendedCertifications.length}{" "}
                  additional resources ServiceNow lists
                </summary>
                <CourseList
                  items={[...additionalCourses, ...recommendedCertifications]}
                />
              </details>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Documentation
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              {docs.map((d) => {
                const release = staleDocsRelease(d.notes);
                return (
                  <li key={`${d.name}-${d.url}`}>
                    <ExtLink href={d.url}>{d.name}</ExtLink>
                    {release && (
                      <span className="ml-2 text-xs text-zinc-500">
                        (links to {release} release)
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            {otherResources.length > 0 && (
              <>
                <h3 className="mt-6 font-semibold text-zinc-900 dark:text-zinc-100">
                  Community & other
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                  {otherResources.map((r) => (
                    <li key={r.name}>
                      <ExtLink href={r.url}>{r.name}</ExtLink>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
