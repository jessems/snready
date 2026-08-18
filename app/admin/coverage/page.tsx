import { Metadata } from "next";
import Link from "next/link";
import coverageManifest from "@/data/coverage/coverage-manifest.json";

export const metadata: Metadata = {
  title: "Coverage Dashboard | SNReady Admin",
  description: "View scraping coverage and content status across certifications",
  robots: "noindex, nofollow",
};

type CourseStatus = "complete" | "partial" | "missing" | "blocked" | "unavailable";

interface Course {
  name: string;
  status: CourseStatus;
  chars?: number;
  files?: number;
  lastScraped?: string;
  reason?: string;
  matchedDir?: string;
}

interface DocBundle {
  id: string;
  name: string;
  filter: string;
  status: CourseStatus;
  chars?: number;
  files?: number;
  lastScraped?: string;
}

interface CertificationCoverage {
  fullName: string;
  courses: {
    required: Course[];
    officiallyRecommended: Course[];
    snReadyRecommended: Course[];
  };
  docBundles: DocBundle[];
  summary: {
    requiredTotal: number;
    requiredScrapable: number;
    requiredScraped: number;
    requiredCoverage: number;
    docBundlesTotal: number;
    docBundlesScraped: number;
    totalChars: number;
    questionCount: number;
  };
}

function StatusBadge({ status, reason }: { status: CourseStatus; reason?: string }) {
  const styles: Record<CourseStatus, string> = {
    complete: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    partial: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    missing: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    blocked: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    unavailable: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500",
  };

  const labels: Record<CourseStatus, string> = {
    complete: "✅ Scraped",
    partial: "🟡 Partial",
    missing: "❌ Missing",
    blocked: "⚫ Interactive",
    unavailable: "⚪ N/A",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
      {reason && <span className="opacity-70">({reason})</span>}
    </span>
  );
}

function TierBadge({ tier }: { tier: "required" | "officiallyRecommended" | "snReadyRecommended" }) {
  const styles = {
    required: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    officiallyRecommended: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    snReadyRecommended: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  };

  const labels = {
    required: "Required",
    officiallyRecommended: "SN Recommended",
    snReadyRecommended: "SNReady Pick",
  };

  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-xs font-medium ${styles[tier]}`}>
      {labels[tier]}
    </span>
  );
}

function formatChars(chars: number): string {
  if (chars >= 1_000_000) {
    return `${(chars / 1_000_000).toFixed(1)}M`;
  }
  return `${Math.round(chars / 1000)}K`;
}

function CoverageBar({ percentage }: { percentage: number }) {
  const color = percentage >= 80 ? "bg-emerald-500" : percentage >= 50 ? "bg-yellow-500" : "bg-red-500";
  
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
      <span className="text-sm font-medium">{percentage}%</span>
    </div>
  );
}

function CertificationSection({ code, data }: { code: string; data: CertificationCoverage }) {
  const allCourses = [
    ...data.courses.required.map(c => ({ ...c, tier: "required" as const })),
    ...data.courses.officiallyRecommended.map(c => ({ ...c, tier: "officiallyRecommended" as const })),
    ...data.courses.snReadyRecommended.map(c => ({ ...c, tier: "snReadyRecommended" as const })),
  ];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {code} <span className="font-normal text-zinc-500">— {data.fullName}</span>
          </h3>
          <div className="mt-1 flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <span>📚 {data.summary.questionCount} questions</span>
            <span>📄 {formatChars(data.summary.totalChars)} content</span>
            <span>📦 {data.summary.docBundlesScraped}/{data.summary.docBundlesTotal} doc bundles</span>
            {data.summary.questionCount > 0 && (
              <a
                href={`/exports/${code.toLowerCase()}-questions-udemy.csv`}
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                download
              >
                📥 Export CSV (Udemy)
              </a>
            )}
          </div>
        </div>
        <CoverageBar percentage={data.summary.requiredCoverage} />
      </div>

      {/* Courses Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
              <th className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300">Course</th>
              <th className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300">Tier</th>
              <th className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300">Status</th>
              <th className="px-4 py-2 text-right font-medium text-zinc-700 dark:text-zinc-300">Content</th>
              <th className="px-4 py-2 text-right font-medium text-zinc-700 dark:text-zinc-300">Last Scraped</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {allCourses.map((course, i) => (
              <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <td className="px-4 py-2 text-zinc-900 dark:text-zinc-100">{course.name}</td>
                <td className="px-4 py-2"><TierBadge tier={course.tier} /></td>
                <td className="px-4 py-2"><StatusBadge status={course.status} reason={course.reason} /></td>
                <td className="px-4 py-2 text-right text-zinc-600 dark:text-zinc-400">
                  {course.chars ? `${formatChars(course.chars)} / ${course.files} files` : "—"}
                </td>
                <td className="px-4 py-2 text-right text-zinc-600 dark:text-zinc-400">
                  {course.lastScraped || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Doc Bundles */}
      {data.docBundles.length > 0 && (
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Doc Bundles (API Scraped)</h4>
          <div className="flex flex-wrap gap-2">
            {data.docBundles.map((bundle, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800">
                <StatusBadge status={bundle.status} />
                <span className="text-zinc-700 dark:text-zinc-300">{bundle.name}</span>
                {bundle.chars && (
                  <span className="text-zinc-500">({formatChars(bundle.chars)})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoverageDashboard() {
  const manifest = coverageManifest as { generated: string; certifications: Record<string, CertificationCoverage> };
  const certifications = Object.entries(manifest.certifications);
  
  // Calculate overall stats
  const totalQuestions = certifications.reduce((sum, [, data]) => sum + data.summary.questionCount, 0);
  const totalChars = certifications.reduce((sum, [, data]) => sum + data.summary.totalChars, 0);
  const fullCoverageCount = certifications.filter(([, data]) => data.summary.requiredCoverage >= 80).length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">📊 Coverage Dashboard</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Content scraping status and coverage across all certifications
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Last generated: {new Date(manifest.generated).toLocaleString()}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link
              href="/admin/exam-intel"
              className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700"
            >
              🧠 Exam Intelligence
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{certifications.length}</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Certifications</div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-2xl font-bold text-emerald-600">{totalQuestions.toLocaleString()}</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Total Questions</div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{formatChars(totalChars)}</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Content Scraped</div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{fullCoverageCount}/{certifications.length}</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">≥80% Coverage</div>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-6 flex flex-wrap gap-4 rounded-lg border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Legend:</span>
          <StatusBadge status="complete" />
          <StatusBadge status="partial" />
          <StatusBadge status="missing" />
          <StatusBadge status="blocked" reason="interactive" />
          <StatusBadge status="unavailable" />
        </div>

        {/* Certification Sections */}
        <div className="space-y-6">
          {certifications
            .sort((a, b) => b[1].summary.questionCount - a[1].summary.questionCount)
            .map(([code, data]) => (
              <CertificationSection key={code} code={code} data={data} />
            ))}
        </div>
      </div>
    </div>
  );
}
