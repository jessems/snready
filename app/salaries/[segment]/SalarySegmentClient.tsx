"use client";

import { useState, useEffect } from "react";
import type { SalarySegment } from "@/lib/salaries/segments";

interface Stats {
  count: number;
  median: number;
  p25: number;
  p75: number;
  min: number;
  max: number;
  avg: number;
}

interface BreakdownItem {
  label: string;
  stats: Stats;
}

interface FilterResponse {
  filter: {
    role: string | null;
    country: string | null;
  };
  stats: Stats;
  breakdown: BreakdownItem[];
  experienceBreakdown: BreakdownItem[];
  updatedAt: string;
}

function formatSalary(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCompact(amount: number): string {
  if (amount >= 1000) {
    return `$${Math.round(amount / 1000)}K`;
  }
  return `$${amount}`;
}

function StatCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      {subtext && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>
      )}
    </div>
  );
}

function SalaryBar({
  label,
  median,
  p25,
  p75,
  count,
  maxMedian,
}: {
  label: string;
  median: number;
  p25: number;
  p75: number;
  count: number;
  maxMedian: number;
}) {
  const barWidth = (median / maxMedian) * 100;
  const rangeStart = (p25 / maxMedian) * 100;
  const rangeWidth = ((p75 - p25) / maxMedian) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatCompact(median)} ({count} entries)
        </span>
      </div>
      <div className="relative h-8 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
        {/* P25-P75 range background */}
        <div
          className="absolute h-full bg-blue-200 dark:bg-blue-900"
          style={{ left: `${rangeStart}%`, width: `${rangeWidth}%` }}
        />
        {/* Median marker */}
        <div
          className="absolute h-full w-1 bg-blue-600 dark:bg-blue-400"
          style={{ left: `${barWidth}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>25th: {formatCompact(p25)}</span>
        <span>75th: {formatCompact(p75)}</span>
      </div>
    </div>
  );
}

export default function SalarySegmentClient({
  segment,
}: {
  segment: SalarySegment;
}) {
  const [data, setData] = useState<FilterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filterParam =
          segment.type === "role"
            ? `role=${segment.slug}`
            : `country=${segment.slug}`;

        const response = await fetch(`/api/salaries/filter?${filterParam}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("No salary data available for this segment yet.");
          } else {
            throw new Error("Failed to fetch data");
          }
          return;
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching salary data:", err);
        setError("Failed to load salary data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [segment.slug, segment.type]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
            >
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 text-center">
        <p className="text-yellow-800 dark:text-yellow-200">{error}</p>
        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
          Help us grow this dataset by{" "}
          <a href="/salaries" className="underline">
            submitting your salary
          </a>
          .
        </p>
      </div>
    );
  }

  if (!data) return null;

  const { stats, breakdown, experienceBreakdown } = data;
  const maxMedian = Math.max(
    stats.median,
    ...breakdown.map((b) => b.stats.median),
    ...experienceBreakdown.map((e) => e.stats.median)
  );

  return (
    <div className="space-y-8">
      {/* Key Stats */}
      <section>
        <h2 className="sr-only">Key Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Median Salary"
            value={formatSalary(stats.median)}
            subtext="50th percentile"
          />
          <StatCard
            label="Average Salary"
            value={formatSalary(stats.avg)}
            subtext="Mean compensation"
          />
          <StatCard
            label="Salary Range"
            value={`${formatCompact(stats.p25)} - ${formatCompact(stats.p75)}`}
            subtext="25th to 75th percentile"
          />
          <StatCard
            label="Sample Size"
            value={stats.count.toString()}
            subtext="verified entries"
          />
        </div>
      </section>

      {/* Salary Distribution Chart */}
      <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Salary Distribution
        </h2>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="w-3 h-3 bg-blue-200 dark:bg-blue-900 rounded mr-2" />
              25th-75th percentile
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded mr-2" />
              Median
            </span>
          </div>
        </div>

        {/* Overall bar */}
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <SalaryBar
            label={`All ${segment.displayName}s`}
            median={stats.median}
            p25={stats.p25}
            p75={stats.p75}
            count={stats.count}
            maxMedian={maxMedian}
          />
        </div>
      </section>

      {/* Breakdown by other dimension */}
      {breakdown.length > 0 && (
        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            {segment.type === "role" ? "By Country" : "By Role"}
          </h2>
          <div className="space-y-2">
            {breakdown.map((item) => (
              <SalaryBar
                key={item.label}
                label={item.label}
                median={item.stats.median}
                p25={item.stats.p25}
                p75={item.stats.p75}
                count={item.stats.count}
                maxMedian={maxMedian}
              />
            ))}
          </div>
        </section>
      )}

      {/* Experience Breakdown */}
      {experienceBreakdown.length > 0 && (
        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            By Experience Level
          </h2>
          <div className="space-y-2">
            {experienceBreakdown
              .filter((e) => e.label !== "Unknown" && e.stats.count >= 2)
              .map((item) => (
                <SalaryBar
                  key={item.label}
                  label={item.label}
                  median={item.stats.median}
                  p25={item.stats.p25}
                  p75={item.stats.p75}
                  count={item.stats.count}
                  maxMedian={maxMedian}
                />
              ))}
          </div>
        </section>
      )}

      {/* Methodology Note */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 text-sm text-gray-600 dark:text-gray-400">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          About this data
        </h3>
        <p>
          Salary data is collected from anonymous submissions and public sources
          (Reddit salary threads, job postings). All figures are in USD unless
          otherwise noted. Outliers below $10,000/year are excluded from
          statistics. Data is refreshed regularly.
        </p>
        <p className="mt-2">
          Last updated: {new Date(data.updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </section>
    </div>
  );
}
