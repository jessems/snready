import { Metadata } from "next";
import Link from "next/link";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const metadata: Metadata = {
  title: "Exam Intelligence | SNReady Admin",
  description: "Internal symbolic exam-intelligence dashboard for SNReady question strategy",
  robots: "noindex, nofollow",
};

type DistributionItem = {
  id?: string;
  artifactId?: string;
  factType?: string;
  topic?: string;
  count: number;
  percentage: number;
};

type ClassifiedQuestion = {
  questionId: string;
  topic?: string;
  artifactId: string;
  factType: string;
  confidence: number;
};

type Profile = {
  certification: string;
  generatedAt: string;
  source: string;
  observedItemCount: number;
  classifiedItemCount: number;
  classifiedPercentage: number;
  artifactDistribution: DistributionItem[];
  factTypeDistribution: DistributionItem[];
  topicDistribution: DistributionItem[];
  generationTargets: Record<string, number>;
  lowConfidenceExamples: Array<{ questionId: string; artifactId: string; confidence: number }>;
  unmatchedExamples: Array<{ questionId: string; topic?: string }>;
  classifiedQuestions: ClassifiedQuestion[];
};

type Artifact = {
  id: string;
  name: string;
  description: string;
  factType: string;
  generationUse: string;
};

type ArtifactRegistry = {
  version: string;
  generatedAt: string;
  artifacts: Artifact[];
};

type DashboardProfile = Profile & {
  unclassifiedCount: number;
  qualityScore: number;
  topArtifact?: DistributionItem;
  weakestArtifactTarget?: { id: string; target: number; actual: number; gap: number };
};

const profileDir = join(process.cwd(), "data/exam-intel/profiles");
const registryPath = join(process.cwd(), "data/exam-intel/artifacts/servicenow-core-artifacts.json");

function loadJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function loadProfiles(): DashboardProfile[] {
  return readdirSync(profileDir)
    .filter((file) => file.endsWith("-exam-profile.json"))
    .map((file) => loadJson<Profile>(join(profileDir, file)))
    .map((profile) => {
      const unclassifiedCount = profile.observedItemCount - profile.classifiedItemCount;
      const lowConfidencePenalty = Math.min(profile.lowConfidenceExamples.length * 0.5, 10);
      const unclassifiedPenalty = profile.observedItemCount
        ? (unclassifiedCount / profile.observedItemCount) * 30
        : 0;
      const qualityScore = Math.max(0, Math.round(100 - lowConfidencePenalty - unclassifiedPenalty));
      const topArtifact = profile.artifactDistribution[0];
      const weakestArtifactTarget = Object.entries(profile.generationTargets)
        .map(([id, target]) => {
          const actual = profile.artifactDistribution.find((item) => item.artifactId === id || item.id === id)?.percentage ?? 0;
          return { id, target, actual, gap: target - actual };
        })
        .sort((a, b) => b.gap - a.gap)[0];

      return {
        ...profile,
        unclassifiedCount,
        qualityScore,
        topArtifact,
        weakestArtifactTarget,
      };
    })
    .sort((a, b) => a.certification.localeCompare(b.certification));
}

function formatPercent(value: number): string {
  return `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
}

function labelize(id: string): string {
  return id
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getCoverageColor(percentage: number): string {
  if (percentage >= 90) return "bg-emerald-500";
  if (percentage >= 75) return "bg-yellow-500";
  return "bg-red-500";
}

function getQualityText(score: number): string {
  if (score >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 75) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function CoverageBar({ percentage }: { percentage: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-28 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div className={`h-full ${getCoverageColor(percentage)}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{formatPercent(percentage)}</span>
    </div>
  );
}

function StatCard({ label, value, detail, tone = "zinc" }: { label: string; value: string; detail?: string; tone?: "zinc" | "emerald" | "blue" | "amber" }) {
  const toneClass = {
    zinc: "text-zinc-900 dark:text-zinc-100",
    emerald: "text-emerald-600 dark:text-emerald-400",
    blue: "text-blue-600 dark:text-blue-400",
    amber: "text-amber-600 dark:text-amber-400",
  }[tone];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className={`text-2xl font-bold ${toneClass}`}>{value}</div>
      <div className="text-sm text-zinc-600 dark:text-zinc-400">{label}</div>
      {detail && <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">{detail}</div>}
    </div>
  );
}

function DistributionPills({ items, limit = 4 }: { items: DistributionItem[]; limit?: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.slice(0, limit).map((item) => {
        const id = item.artifactId ?? item.factType ?? item.topic ?? item.id ?? "unknown";
        return (
          <span key={id} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {labelize(id)} · {item.count} ({formatPercent(item.percentage)})
          </span>
        );
      })}
    </div>
  );
}

function ProfileRow({ profile, artifacts }: { profile: DashboardProfile; artifacts: Map<string, Artifact> }) {
  const topArtifactId = profile.topArtifact?.artifactId ?? profile.topArtifact?.id;
  const topArtifact = topArtifactId ? artifacts.get(topArtifactId) : undefined;
  const weakTarget = profile.weakestArtifactTarget;

  return (
    <section className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 border-b border-zinc-200 p-4 lg:flex-row lg:items-start lg:justify-between dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{profile.certification.toUpperCase()}</h2>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <span>{profile.observedItemCount} observed questions</span>
            <span>{profile.classifiedItemCount} classified</span>
            <span>{profile.unclassifiedCount} unclassified</span>
            <span>{profile.classifiedQuestions.length} symbolic mappings</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <CoverageBar percentage={profile.classifiedPercentage} />
          <div className={`text-sm font-semibold ${getQualityText(profile.qualityScore)}`}>
            Quality score {profile.qualityScore}
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <h3 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Top artifacts</h3>
          <DistributionPills items={profile.artifactDistribution} />
          {topArtifact && (
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
              Lead pattern: <strong>{topArtifact.name}</strong> — {topArtifact.generationUse}
            </p>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Fact types</h3>
          <DistributionPills items={profile.factTypeDistribution} limit={3} />
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Next generation target</h3>
          {weakTarget && weakTarget.gap > 0 ? (
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
              <div className="font-medium">{labelize(weakTarget.id)}</div>
              <div className="mt-1 text-xs opacity-80">
                Target {formatPercent(weakTarget.target)} vs current {formatPercent(weakTarget.actual)} · gap {formatPercent(weakTarget.gap)}
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
              Current artifact mix matches generation targets.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function ExamIntelDashboard() {
  const registry = loadJson<ArtifactRegistry>(registryPath);
  const profiles = loadProfiles();
  const artifacts = new Map(registry.artifacts.map((artifact) => [artifact.id, artifact]));
  const totalObserved = profiles.reduce((sum, profile) => sum + profile.observedItemCount, 0);
  const totalClassified = profiles.reduce((sum, profile) => sum + profile.classifiedItemCount, 0);
  const totalUnclassified = totalObserved - totalClassified;
  const averageClassified = totalObserved ? Math.round((totalClassified / totalObserved) * 1000) / 10 : 0;
  const weakestProfiles = [...profiles].sort((a, b) => a.classifiedPercentage - b.classifiedPercentage).slice(0, 3);
  const highestGapProfiles = [...profiles]
    .filter((profile) => (profile.weakestArtifactTarget?.gap ?? 0) > 0)
    .sort((a, b) => (b.weakestArtifactTarget?.gap ?? 0) - (a.weakestArtifactTarget?.gap ?? 0))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2 text-sm">
              <Link href="/admin/coverage" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                ← Coverage dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">🧠 Exam Intelligence</h1>
            <p className="mt-2 max-w-3xl text-zinc-600 dark:text-zinc-400">
              Internal symbolic profile dashboard for prioritizing ServiceNow question generation by reusable exam artifacts, fact types, and uncovered patterns.
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Profiles generated: {new Date(profiles[0]?.generatedAt ?? registry.generatedAt).toLocaleString()} · Registry v{registry.version}
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
            <div className="font-semibold">Admin-only intelligence</div>
            <div className="mt-1 max-w-sm">No raw dump stems, answer text, or private observed-question content is rendered here.</div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Certifications profiled" value={profiles.length.toLocaleString()} detail={`${registry.artifacts.length} artifact types`} />
          <StatCard label="Observed questions" value={totalObserved.toLocaleString()} detail="Existing SNReady bank" tone="blue" />
          <StatCard label="Classified coverage" value={formatPercent(averageClassified)} detail={`${totalClassified.toLocaleString()} classified`} tone="emerald" />
          <StatCard label="Unclassified queue" value={totalUnclassified.toLocaleString()} detail="Use to discover new artifacts" tone="amber" />
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Lowest classification coverage</h2>
            <div className="mt-4 space-y-3">
              {weakestProfiles.map((profile) => (
                <div key={profile.certification} className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{profile.certification.toUpperCase()}</div>
                    <div className="text-xs text-zinc-500">{profile.unclassifiedCount} unclassified of {profile.observedItemCount}</div>
                  </div>
                  <CoverageBar percentage={profile.classifiedPercentage} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Biggest generation gaps</h2>
            <div className="mt-4 space-y-3">
              {highestGapProfiles.map((profile) => {
                const target = profile.weakestArtifactTarget;
                if (!target) return null;
                return (
                  <div key={`${profile.certification}-${target.id}`} className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/70">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">{profile.certification.toUpperCase()}</span>
                      <span className="text-xs text-blue-600 dark:text-blue-300">gap {formatPercent(target.gap)}</span>
                    </div>
                    <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{labelize(target.id)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {profiles.map((profile) => (
            <ProfileRow key={profile.certification} profile={profile} artifacts={artifacts} />
          ))}
        </div>
      </div>
    </div>
  );
}
