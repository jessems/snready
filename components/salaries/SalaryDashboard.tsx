"use client";

import { useState, useEffect } from "react";
import { SalaryFilter, SalaryStats } from "@/lib/salaries/types";
import { ROLES, CERTIFICATIONS, EXPERIENCE_RANGES } from "@/lib/salaries/types";
import { COUNTRIES } from "@/lib/salaries/countries";

interface RoleStats extends SalaryStats {
  role: string;
}

interface APIStats {
  overall: SalaryStats & { countries: number };
  byRole: RoleStats[];
  updatedAt: string;
}

interface SalaryDashboardProps {
  hasSubmitted: boolean;
  onSubmitClick: () => void;
}

export default function SalaryDashboard({
  hasSubmitted,
  onSubmitClick,
}: SalaryDashboardProps) {
  const [filter, setFilter] = useState<SalaryFilter>({});
  const [apiStats, setApiStats] = useState<APIStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/salaries/stats")
      .then((res) => res.json())
      .then((data) => {
        setApiStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStats = (): SalaryStats => {
    if (!apiStats) {
      return { count: 0, median: 0, p25: 0, p75: 0, min: 0, max: 0 };
    }
    if (filter.role) {
      const roleStats = apiStats.byRole.find((r) => r.role === filter.role);
      if (roleStats) return roleStats;
    }
    return apiStats.overall;
  };

  const stats = getStats();
  const maxSalary = apiStats?.byRole?.reduce((max, r) => Math.max(max, r.median), 0) || 200000;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500">Loading salary data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats.count.toLocaleString()}</div>
            <div className="text-sm text-slate-500 mt-1">Submissions</div>
          </div>
        </div>

        <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-green-600">{formatCurrency(stats.median)}</div>
            <div className="text-sm text-slate-500 mt-1">Median Salary</div>
          </div>
        </div>

        <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(stats.p25)}
              <span className="text-slate-400 mx-1">–</span>
              {formatCurrency(stats.p75)}
            </div>
            <div className="text-sm text-slate-500 mt-1">Middle 50%</div>
          </div>
        </div>

        <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-cyan-600">{apiStats?.overall.countries || 0}</div>
            <div className="text-sm text-slate-500 mt-1">Countries</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Data
          </h3>
          {(filter.role || filter.country || filter.certification || filter.yoeServiceNow) && (
            <button
              onClick={() => setFilter({})}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Role</label>
            <select
              value={filter.role || ""}
              onChange={(e) => setFilter({ ...filter, role: e.target.value || undefined })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">All Roles</option>
              {ROLES.filter((r) => r !== "Other").map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Country</label>
            <select
              value={filter.country || ""}
              onChange={(e) => setFilter({ ...filter, country: e.target.value || undefined })}
              className={`w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${!hasSubmitted ? 'opacity-60' : ''}`}
              disabled={!hasSubmitted}
            >
              <option value="">All Countries</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Certification</label>
            <select
              value={filter.certification || ""}
              onChange={(e) => setFilter({ ...filter, certification: e.target.value || undefined })}
              className={`w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${!hasSubmitted ? 'opacity-60' : ''}`}
              disabled={!hasSubmitted}
            >
              <option value="">All Certifications</option>
              {CERTIFICATIONS.filter((c) => c !== "None").map((cert) => (
                <option key={cert} value={cert}>{cert}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Experience</label>
            <select
              value={filter.yoeServiceNow || ""}
              onChange={(e) => setFilter({ ...filter, yoeServiceNow: e.target.value || undefined })}
              className={`w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${!hasSubmitted ? 'opacity-60' : ''}`}
              disabled={!hasSubmitted}
            >
              <option value="">All Experience</option>
              {EXPERIENCE_RANGES.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>
        {!hasSubmitted && (
          <div className="flex items-center gap-2 mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm text-amber-800">
              <button onClick={onSubmitClick} className="font-semibold underline hover:text-amber-900">
                Submit your salary
              </button>{" "}
              to unlock all filters
            </span>
          </div>
        )}
      </div>

      {/* Salary by Role - Visual Bar Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-semibold text-lg text-slate-900">Salary by Role</h3>
          <p className="text-sm text-slate-500 mt-1">Median total compensation in USD</p>
        </div>
        <div className="p-6 space-y-4">
          {(apiStats?.byRole || [])
            .sort((a, b) => b.median - a.median)
            .map((data, index) => {
              const barWidth = (data.median / maxSalary) * 100;
              const colors = [
                'from-blue-500 to-blue-600',
                'from-cyan-500 to-cyan-600', 
                'from-teal-500 to-teal-600',
                'from-green-500 to-green-600',
                'from-emerald-500 to-emerald-600',
                'from-indigo-500 to-indigo-600',
              ];
              const colorClass = colors[index % colors.length];
              
              return (
                <div key={data.role} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-900">{data.role}</span>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        n={data.count}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-900">{formatCurrency(data.median)}</span>
                  </div>
                  <div className="relative h-10 bg-slate-100 rounded-lg overflow-hidden">
                    {/* P25-P75 range background */}
                    <div 
                      className="absolute inset-y-0 bg-slate-300/60 border-l-2 border-r-2 border-slate-400"
                      style={{ 
                        left: `${(data.p25 / maxSalary) * 100}%`, 
                        width: `${((data.p75 - data.p25) / maxSalary) * 100}%` 
                      }}
                    />
                    {/* Median bar */}
                    <div
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colorClass} rounded-lg transition-all duration-500 group-hover:brightness-110`}
                      style={{ width: `${barWidth}%` }}
                    />
                    {/* P25 marker */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-600"
                      style={{ left: `${(data.p25 / maxSalary) * 100}%` }}
                    />
                    {/* P75 marker */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-600"
                      style={{ left: `${(data.p75 / maxSalary) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1.5">
                    <span className="text-slate-600 font-medium">P25: {formatCurrency(data.p25)}</span>
                    <span className="text-slate-600 font-medium">P75: {formatCurrency(data.p75)}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Gated Content Preview */}
      {!hasSubmitted && (
        <div className="relative">
          {/* Overlay CTA */}
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-b from-transparent via-white/90 to-white">
            <div className="text-center p-8 max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Unlock Full Insights</h3>
              <p className="text-slate-600 mb-6">
                Submit your anonymous salary data to see detailed breakdowns by certification, 
                location, company type, and more.
              </p>
              <button
                onClick={onSubmitClick}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition shadow-lg shadow-blue-500/25"
              >
                Submit Your Salary
              </button>
              <p className="text-xs text-slate-400 mt-3">Takes 2 minutes • 100% anonymous</p>
            </div>
          </div>

          {/* Blurred Preview */}
          <div className="space-y-6 filter blur-sm pointer-events-none select-none">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">💰 Salary by Certification</h3>
              <div className="space-y-3">
                {["CTA", "CAD", "CSA", "CIS-ITSM"].map((cert) => (
                  <div key={cert} className="flex items-center gap-4">
                    <span className="w-24 font-medium text-slate-700">{cert}</span>
                    <div className="flex-1 h-6 bg-slate-100 rounded-lg" />
                    <span className="w-24 text-right font-semibold">$XXX,XXX</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">🌎 Top Paying Locations</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {["San Francisco", "New York", "Seattle", "Austin"].map((loc) => (
                  <div key={loc} className="flex justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="font-medium">{loc}</span>
                    <span className="text-blue-600 font-semibold">$XXX,XXX</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Data for Submitted Users */}
      {hasSubmitted && (
        <>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl">💰</span>
              <h3 className="font-semibold text-lg text-slate-900">Salary by Certification</h3>
            </div>
            <div className="space-y-4">
              {[
                { cert: "CTA", median: 195000, count: 23 },
                { cert: "Architect", median: 175000, count: 87 },
                { cert: "CAD", median: 145000, count: 156 },
                { cert: "CIS-Discovery", median: 140000, count: 89 },
                { cert: "CIS-ITSM", median: 135000, count: 134 },
                { cert: "CSA", median: 115000, count: 298 },
              ].map((item, index) => {
                const barWidth = (item.median / 200000) * 100;
                return (
                  <div key={item.cert} className="group">
                    <div className="flex items-center gap-4">
                      <span className="w-28 font-medium text-slate-700">{item.cert}</span>
                      <div className="flex-1 relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg group-hover:brightness-110 transition"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <span className="w-24 text-right font-semibold text-slate-900">
                        {formatCurrency(item.median)}
                      </span>
                      <span className="w-12 text-right text-sm text-slate-400">
                        n={item.count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl">🌎</span>
              <h3 className="font-semibold text-lg text-slate-900">Top Paying Cities</h3>
              <span className="text-sm text-slate-400">(Remote excluded)</span>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { city: "San Francisco", median: 175000 },
                { city: "New York", median: 165000 },
                { city: "Seattle", median: 160000 },
                { city: "Boston", median: 155000 },
                { city: "Austin", median: 145000 },
                { city: "Chicago", median: 140000 },
                { city: "Denver", median: 138000 },
                { city: "Atlanta", median: 130000 },
              ].map((item, index) => (
                <div
                  key={item.city}
                  className="flex justify-between items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-medium text-slate-700">{item.city}</span>
                  </div>
                  <span className="font-semibold text-blue-600">{formatCurrency(item.median)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* CTA Footer */}
      {!hasSubmitted && (
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Help Build Better Data</h3>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">
            The more submissions we get, the more accurate and useful this becomes for everyone.
          </p>
          <button
            onClick={onSubmitClick}
            className="px-8 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg"
          >
            Add Your Salary — It's Anonymous
          </button>
        </div>
      )}
    </div>
  );
}
