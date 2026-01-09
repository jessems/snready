import type { Certification } from "@/types";

interface ComparisonTableProps {
  cert1: Certification;
  cert2: Certification;
}

export default function ComparisonTable({ cert1, cert2 }: ComparisonTableProps) {
  const rows = [
    {
      label: "Exam Questions",
      value1: cert1.examDetails.questionCount.toString(),
      value2: cert2.examDetails.questionCount.toString(),
    },
    {
      label: "Duration",
      value1: `${cert1.examDetails.duration} minutes`,
      value2: `${cert2.examDetails.duration} minutes`,
    },
    {
      label: "Passing Score",
      value1: `${cert1.examDetails.passingScore}%`,
      value2: `${cert2.examDetails.passingScore}%`,
    },
    {
      label: "Exam Cost",
      value1: `$${cert1.examDetails.cost}`,
      value2: `$${cert2.examDetails.cost}`,
    },
    {
      label: "Level",
      value1: cert1.level.charAt(0).toUpperCase() + cert1.level.slice(1),
      value2: cert2.level.charAt(0).toUpperCase() + cert2.level.slice(1),
    },
    {
      label: "Format",
      value1: cert1.examDetails.format,
      value2: cert2.examDetails.format,
    },
    {
      label: "Release",
      value1: cert1.release,
      value2: cert2.release,
    },
    {
      label: "Prerequisites",
      value1:
        cert1.prerequisites.length > 0
          ? cert1.prerequisites.join(", ")
          : "None required",
      value2:
        cert2.prerequisites.length > 0
          ? cert2.prerequisites.join(", ")
          : "None required",
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800">
            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Comparison
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-600">
              {cert1.name}
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">
              {cert2.name}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
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
                {row.value1}
              </td>
              <td className="px-6 py-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                {row.value2}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
