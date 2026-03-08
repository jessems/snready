import { Metadata } from "next";
import Link from "next/link";
import demandData from "@/data/demand-data.json";

export const metadata: Metadata = {
  title: "ServiceNow Certification Demand Index 2026 | Job Market & Salary Data",
  description:
    "Live ServiceNow certification demand rankings. See which certifications have the most jobs, highest salaries, and fastest growth. Updated weekly with real job market data.",
  keywords: [
    "ServiceNow certification demand",
    "ServiceNow jobs",
    "ServiceNow salary",
    "which ServiceNow certification",
    "ServiceNow career",
    "CIS certification jobs",
  ],
  openGraph: {
    title: "ServiceNow Certification Demand Index 2026",
    description:
      "Which ServiceNow certifications are most in demand? Live job market data, salary ranges, and growth trends.",
    type: "website",
  },
};

interface CertDemand {
  slug: string;
  name: string;
  fullName: string;
  jobCount: number;
  avgSalary: number;
  salaryRange: { min: number; max: number };
  yoyChange: number;
  demandTier: string;
  supplyLevel: string;
  competitionIndex: number;
  topLocations: string[];
  topIndustries: string[];
  entryLevel: boolean;
  remotePercentage: number;
  hiddenGem?: boolean;
}

function formatSalary(amount: number): string {
  return `$${(amount / 1000).toFixed(0)}k`;
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function getTrendIcon(change: number): string {
  if (change >= 25) return "🚀";
  if (change >= 15) return "📈";
  if (change >= 5) return "↗️";
  if (change >= 0) return "→";
  return "↘️";
}

function getTrendColor(change: number): string {
  if (change >= 25) return "text-emerald-600 dark:text-emerald-400";
  if (change >= 15) return "text-emerald-500 dark:text-emerald-400";
  if (change >= 5) return "text-blue-500 dark:text-blue-400";
  if (change >= 0) return "text-zinc-500 dark:text-zinc-400";
  return "text-red-500 dark:text-red-400";
}

function getCompetitionLabel(index: number): { label: string; color: string } {
  if (index <= 20) return { label: "Low", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" };
  if (index <= 40) return { label: "Medium", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300" };
  return { label: "High", color: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" };
}

function getRankEmoji(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export default function DemandPage() {
  const certs = demandData.certifications as CertDemand[];
  const insights = demandData.marketInsights;

  // Sort by job count for main ranking
  const sortedByJobs = [...certs].sort((a, b) => b.jobCount - a.jobCount);
  
  // Sort by salary for salary ranking
  const sortedBySalary = [...certs].sort((a, b) => b.avgSalary - a.avgSalary);
  
  // Sort by growth for growth ranking
  const sortedByGrowth = [...certs].sort((a, b) => b.yoyChange - a.yoyChange);
  
  // Hidden gems (low competition, decent demand)
  const hiddenGems = certs.filter((c) => c.hiddenGem).sort((a, b) => a.competitionIndex - b.competitionIndex);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-zinc-900 dark:to-zinc-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-blue-100 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Updated {demandData.lastUpdated}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              ServiceNow Certification<br />Demand Index
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
              Real job market data showing which certifications are most in demand, highest paying, and fastest growing.
            </p>
            
            {/* Key Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl sm:text-3xl font-bold">{formatNumber(insights.totalJobs)}</div>
                <div className="text-sm text-blue-200">Total Jobs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl sm:text-3xl font-bold">+{insights.avgGrowthRate}%</div>
                <div className="text-sm text-blue-200">Avg Growth</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl sm:text-3xl font-bold">{certs.length}</div>
                <div className="text-sm text-blue-200">Certifications</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl sm:text-3xl font-bold">🔥</div>
                <div className="text-sm text-blue-200">{insights.hottestCategory}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hidden Gems Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">💎</span>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Hidden Gems</h2>
              <p className="text-zinc-600 dark:text-zinc-400">High demand, low competition — the sweet spot</p>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hiddenGems.slice(0, 6).map((cert) => (
              <Link
                key={cert.slug}
                href={`/${cert.slug}`}
                className="group bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5 hover:shadow-lg hover:border-amber-400 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2.5 py-1 text-sm font-bold text-amber-700 bg-amber-100 rounded-lg dark:text-amber-300 dark:bg-amber-900/50">
                    {cert.name}
                  </span>
                  <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full dark:bg-emerald-900/50 dark:text-emerald-300">
                    Low Competition
                  </span>
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {cert.fullName}
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-zinc-900 dark:text-white">{formatNumber(cert.jobCount)}</div>
                    <div className="text-xs text-zinc-500">Jobs</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatSalary(cert.avgSalary)}</div>
                    <div className="text-xs text-zinc-500">Avg Salary</div>
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${getTrendColor(cert.yoyChange)}`}>+{cert.yoyChange}%</div>
                    <div className="text-xs text-zinc-500">Growth</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Main Rankings Table */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">📊</span>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Full Demand Rankings</h2>
              <p className="text-zinc-600 dark:text-zinc-400">All certifications ranked by job postings</p>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-left text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Certification</th>
                  <th className="px-6 py-4 text-right">Jobs</th>
                  <th className="px-6 py-4 text-right">Avg Salary</th>
                  <th className="px-6 py-4 text-right">YoY Growth</th>
                  <th className="px-6 py-4 text-center">Competition</th>
                  <th className="px-6 py-4 text-right">Remote %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {sortedByJobs.map((cert, index) => {
                  const competition = getCompetitionLabel(cert.competitionIndex);
                  return (
                    <tr key={cert.slug} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-lg">{getRankEmoji(index + 1)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/${cert.slug}`} className="group flex items-center gap-3">
                          <span className="px-2.5 py-1 text-sm font-bold text-emerald-700 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/40">
                            {cert.name}
                          </span>
                          <span className="text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {cert.fullName}
                          </span>
                          {cert.hiddenGem && <span title="Hidden Gem">💎</span>}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-zinc-900 dark:text-white">
                        {formatNumber(cert.jobCount)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatSalary(cert.avgSalary)}</span>
                        <span className="block text-xs text-zinc-400">
                          {formatSalary(cert.salaryRange.min)} - {formatSalary(cert.salaryRange.max)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-semibold ${getTrendColor(cert.yoyChange)}`}>
                        {getTrendIcon(cert.yoyChange)} +{cert.yoyChange}%
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${competition.color}`}>
                          {competition.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-zinc-600 dark:text-zinc-400">
                        {cert.remotePercentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {sortedByJobs.map((cert, index) => {
              const competition = getCompetitionLabel(cert.competitionIndex);
              return (
                <Link
                  key={cert.slug}
                  href={`/${cert.slug}`}
                  className="block bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 hover:border-emerald-400 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getRankEmoji(index + 1)}</span>
                      <span className="px-2.5 py-1 text-sm font-bold text-emerald-700 bg-emerald-50 rounded-lg dark:text-emerald-300 dark:bg-emerald-900/40">
                        {cert.name}
                      </span>
                      {cert.hiddenGem && <span>💎</span>}
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${competition.color}`}>
                      {competition.label}
                    </span>
                  </div>
                  <h3 className="font-medium text-zinc-900 dark:text-white mb-3">{cert.fullName}</h3>
                  <div className="grid grid-cols-4 gap-2 text-center text-sm">
                    <div>
                      <div className="font-bold text-zinc-900 dark:text-white">{formatNumber(cert.jobCount)}</div>
                      <div className="text-xs text-zinc-500">Jobs</div>
                    </div>
                    <div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">{formatSalary(cert.avgSalary)}</div>
                      <div className="text-xs text-zinc-500">Salary</div>
                    </div>
                    <div>
                      <div className={`font-bold ${getTrendColor(cert.yoyChange)}`}>+{cert.yoyChange}%</div>
                      <div className="text-xs text-zinc-500">Growth</div>
                    </div>
                    <div>
                      <div className="font-bold text-zinc-600 dark:text-zinc-400">{cert.remotePercentage}%</div>
                      <div className="text-xs text-zinc-500">Remote</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Top 5 Lists */}
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Highest Paying */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">💰</span>
              <h3 className="font-bold text-zinc-900 dark:text-white">Highest Paying</h3>
            </div>
            <div className="space-y-3">
              {sortedBySalary.slice(0, 5).map((cert, i) => (
                <Link key={cert.slug} href={`/${cert.slug}`} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-sm w-5">{i + 1}.</span>
                    <span className="text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {cert.name}
                    </span>
                  </div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatSalary(cert.avgSalary)}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Fastest Growing */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🚀</span>
              <h3 className="font-bold text-zinc-900 dark:text-white">Fastest Growing</h3>
            </div>
            <div className="space-y-3">
              {sortedByGrowth.slice(0, 5).map((cert, i) => (
                <Link key={cert.slug} href={`/${cert.slug}`} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-sm w-5">{i + 1}.</span>
                    <span className="text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {cert.name}
                    </span>
                  </div>
                  <span className={`font-semibold ${getTrendColor(cert.yoyChange)}`}>+{cert.yoyChange}%</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Most Remote-Friendly */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🏠</span>
              <h3 className="font-bold text-zinc-900 dark:text-white">Most Remote-Friendly</h3>
            </div>
            <div className="space-y-3">
              {[...certs].sort((a, b) => b.remotePercentage - a.remotePercentage).slice(0, 5).map((cert, i) => (
                <Link key={cert.slug} href={`/${cert.slug}`} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-sm w-5">{i + 1}.</span>
                    <span className="text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {cert.name}
                    </span>
                  </div>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{cert.remotePercentage}%</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 mb-12">
          <h3 className="font-bold text-zinc-900 dark:text-white mb-3">📋 Methodology</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
            {demandData.dataSource}. {demandData.methodology}.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-zinc-900 dark:text-white mb-2">Competition Index</h4>
              <ul className="space-y-1 text-zinc-600 dark:text-zinc-400">
                <li>• <span className="text-emerald-600 dark:text-emerald-400">Low (0-20)</span>: Few certified professionals, high opportunity</li>
                <li>• <span className="text-amber-600 dark:text-amber-400">Medium (21-40)</span>: Balanced supply and demand</li>
                <li>• <span className="text-red-600 dark:text-red-400">High (41+)</span>: Many certified professionals competing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-zinc-900 dark:text-white mb-2">Hidden Gem Criteria</h4>
              <ul className="space-y-1 text-zinc-600 dark:text-zinc-400">
                <li>• Competition Index under 35</li>
                <li>• YoY growth above 15%</li>
                <li>• Salary above market average</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to boost your career?</h2>
          <p className="text-emerald-100 mb-6 max-w-lg mx-auto">
            Start practicing with real exam-style questions and pass your certification on the first try.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quiz"
              className="px-6 py-3 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
            >
              Find Your Ideal Cert →
            </Link>
            <Link
              href="/certifications"
              className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-400 transition-colors"
            >
              Browse All Certifications
            </Link>
          </div>
        </section>
      </div>

      {/* Schema.org FAQPage for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Which ServiceNow certification is most in demand?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `Based on current job market data, ${sortedByJobs[0].name} (${sortedByJobs[0].fullName}) is the most in-demand certification with ${formatNumber(sortedByJobs[0].jobCount)} job postings.`,
                },
              },
              {
                "@type": "Question",
                name: "Which ServiceNow certification pays the most?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `${sortedBySalary[0].name} (${sortedBySalary[0].fullName}) has the highest average salary at ${formatSalary(sortedBySalary[0].avgSalary)}, with a range of ${formatSalary(sortedBySalary[0].salaryRange.min)} to ${formatSalary(sortedBySalary[0].salaryRange.max)}.`,
                },
              },
              {
                "@type": "Question",
                name: "What is the fastest growing ServiceNow certification?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `${sortedByGrowth[0].name} (${sortedByGrowth[0].fullName}) is the fastest growing certification with ${sortedByGrowth[0].yoyChange}% year-over-year growth in job postings.`,
                },
              },
              {
                "@type": "Question",
                name: "Which ServiceNow certification should I get first?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "CSA (Certified System Administrator) is recommended as the first certification. It's the foundation for all other ServiceNow certifications and has the highest number of job postings.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
