import Link from "next/link";

interface DumpsAlternativeSectionProps {
  certName: string;
  certSlug: string;
  examCost: number;
  questionCount: number;
  release: string;
}

export function DumpsAlternativeSection({
  certName,
  certSlug,
  examCost,
  questionCount,
  release,
}: DumpsAlternativeSectionProps) {
  const introText =
    examCost > 0
      ? `Looking for a shortcut? We get it. The ${certName} exam costs $${examCost} — and failing means paying again. Dumps seem tempting, but they come with problems.`
      : `Looking for a shortcut? We get it. The ${certName} exam is free, but failing still costs you time and credibility. Dumps seem tempting, but they come with problems.`;

  const comparisonRows = [
    {
      label: "Source",
      dumps: "Leaked exam questions",
      snready: "Official Now Learning content",
    },
    {
      label: "Currency",
      dumps: "Often 2+ releases behind",
      snready: `Updated for ${release}`,
    },
    {
      label: "Explanations",
      dumps: "None — just memorize",
      snready: "Every answer explains why",
    },
    {
      label: "Risk",
      dumps: "TOS violation, revocation possible",
      snready: "Zero risk",
    },
    {
      label: "Learning",
      dumps: "Rote memorization",
      snready: "Actual understanding",
    },
    {
      label: "Price",
      dumps: "Free",
      snready: "$9/30 days",
    },
  ];

  return (
    <section className="py-16 bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Better Than a {certName} Dump
        </h2>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-3xl">
          {introText}
        </p>

        {/* Comparison Table - Desktop */}
        <div className="mt-8 hidden sm:block overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800">
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  &nbsp;
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-red-600 dark:text-red-400">
                  Free Dumps
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-600">
                  SNReady
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, index) => (
                <tr
                  key={row.label}
                  className={
                    index % 2 === 0
                      ? "bg-white dark:bg-zinc-900"
                      : "bg-zinc-50 dark:bg-zinc-800/50"
                  }
                >
                  <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {row.label}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    {row.dumps}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    {row.snready}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comparison Table - Mobile (Stacked) */}
        <div className="mt-8 sm:hidden space-y-4">
          {comparisonRows.map((row) => (
            <div
              key={row.label}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                {row.label}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">
                    Free Dumps
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {row.dumps}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-emerald-600 mb-1">
                    SNReady
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {row.snready}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closing text and CTA */}
        <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-950/50">
          <p className="text-zinc-700 dark:text-zinc-300">
            Pass the exam <em>and</em> actually understand the material.{" "}
            <span className="font-semibold">{questionCount}+ practice questions</span> with
            detailed explanations.
          </p>
          <div className="mt-4">
            <Link
              href={`/${certSlug}/practice-questions`}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Try Free Questions
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
