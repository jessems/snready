"use client";

import { useState, useEffect } from "react";
import { SalaryFilter, SalaryStats } from "@/lib/salaries/types";
import { ROLES, CERTIFICATIONS, EXPERIENCE_RANGES } from "@/lib/salaries/types";
import { COUNTRIES, getCountryName } from "@/lib/salaries/countries";

// Mock data - will be replaced with real API calls
const MOCK_DATA: Record<string, SalaryStats> = {
  all: { count: 847, median: 125000, p25: 95000, p75: 165000, min: 55000, max: 285000 },
  Developer: { count: 312, median: 130000, p25: 100000, p75: 170000, min: 60000, max: 250000 },
  Administrator: { count: 198, median: 105000, p25: 85000, p75: 135000, min: 55000, max: 185000 },
  Architect: { count: 87, median: 175000, p25: 145000, p75: 210000, min: 120000, max: 285000 },
  Consultant: { count: 156, median: 135000, p25: 110000, p75: 175000, min: 75000, max: 245000 },
  Manager: { count: 94, median: 155000, p25: 125000, p75: 195000, min: 95000, max: 265000 },
};

interface SalaryDashboardProps {
  hasSubmitted: boolean;
  onSubmitClick: () => void;
}

export default function SalaryDashboard({
  hasSubmitted,
  onSubmitClick,
}: SalaryDashboardProps) {
  const [filter, setFilter] = useState<SalaryFilter>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = MOCK_DATA[filter.role || "all"];

  return (
    <div className="space-y-8">
      {/* Hero stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-3xl font-bold text-gray-900">
            {stats.count.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Salary submissions</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-3xl font-bold text-blue-600">
            {formatCurrency(stats.median)}
          </div>
          <div className="text-sm text-gray-600">Median salary</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(stats.p25)} - {formatCurrency(stats.p75)}
          </div>
          <div className="text-sm text-gray-600">Middle 50% range</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-3xl font-bold text-green-600">20</div>
          <div className="text-sm text-gray-600">Countries represented</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="font-semibold mb-4">Filter Data</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Role</label>
            <select
              value={filter.role || ""}
              onChange={(e) => setFilter({ ...filter, role: e.target.value || undefined })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">All Roles</option>
              {ROLES.filter((r) => r !== "Other").map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Country</label>
            <select
              value={filter.country || ""}
              onChange={(e) => setFilter({ ...filter, country: e.target.value || undefined })}
              className="w-full p-2 border rounded-lg"
              disabled={!hasSubmitted}
            >
              <option value="">All Countries</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Certification</label>
            <select
              value={filter.certification || ""}
              onChange={(e) =>
                setFilter({ ...filter, certification: e.target.value || undefined })
              }
              className="w-full p-2 border rounded-lg"
              disabled={!hasSubmitted}
            >
              <option value="">All Certifications</option>
              {CERTIFICATIONS.filter((c) => c !== "None").map((cert) => (
                <option key={cert} value={cert}>
                  {cert}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Experience</label>
            <select
              value={filter.yoeServiceNow || ""}
              onChange={(e) =>
                setFilter({ ...filter, yoeServiceNow: e.target.value || undefined })
              }
              className="w-full p-2 border rounded-lg"
              disabled={!hasSubmitted}
            >
              <option value="">All Experience</option>
              {EXPERIENCE_RANGES.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>
        </div>
        {!hasSubmitted && (
          <p className="text-sm text-amber-600 mt-3">
            ⚡ Submit your salary to unlock all filters
          </p>
        )}
      </div>

      {/* Salary by role table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="font-semibold">Salary by Role</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Role</th>
                <th className="text-right p-4 font-medium text-gray-600">Median</th>
                <th className="text-right p-4 font-medium text-gray-600">Range (P25-P75)</th>
                <th className="text-right p-4 font-medium text-gray-600">Sample</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {Object.entries(MOCK_DATA)
                .filter(([key]) => key !== "all")
                .sort((a, b) => b[1].median - a[1].median)
                .map(([role, data]) => (
                  <tr key={role} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{role}</td>
                    <td className="p-4 text-right text-blue-600 font-semibold">
                      {formatCurrency(data.median)}
                    </td>
                    <td className="p-4 text-right text-gray-600">
                      {formatCurrency(data.p25)} - {formatCurrency(data.p75)}
                    </td>
                    <td className="p-4 text-right text-gray-500">{data.count}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gated content preview */}
      {!hasSubmitted && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white z-10 flex items-center justify-center">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg border max-w-md">
              <div className="text-4xl mb-4">🔓</div>
              <h3 className="text-xl font-bold mb-2">Unlock Full Data</h3>
              <p className="text-gray-600 mb-4">
                Submit your salary to see detailed breakdowns by certification,
                location, company type, and more.
              </p>
              <button
                onClick={onSubmitClick}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Submit Your Salary
              </button>
            </div>
          </div>

          {/* Blurred preview content */}
          <div className="space-y-4 filter blur-sm pointer-events-none">
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-4">Salary by Certification</h3>
              <div className="space-y-2">
                {["CTA", "CAD", "CSA", "CIS-ITSM"].map((cert) => (
                  <div key={cert} className="flex items-center gap-4">
                    <span className="w-24 font-medium">{cert}</span>
                    <div className="flex-1 h-8 bg-gray-100 rounded" />
                    <span className="w-24 text-right">$XXX,XXX</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-4">Salary by Location</h3>
              <div className="space-y-2">
                {["San Francisco", "New York", "Austin", "Remote"].map((loc) => (
                  <div key={loc} className="flex items-center gap-4">
                    <span className="w-32 font-medium">{loc}</span>
                    <div className="flex-1 h-8 bg-gray-100 rounded" />
                    <span className="w-24 text-right">$XXX,XXX</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full data for submitted users */}
      {hasSubmitted && (
        <>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-semibold mb-4">Salary by Certification</h3>
            <div className="space-y-3">
              {[
                { cert: "CTA", median: 195000, count: 23 },
                { cert: "Architect", median: 175000, count: 87 },
                { cert: "CAD", median: 145000, count: 156 },
                { cert: "CIS-Discovery", median: 140000, count: 89 },
                { cert: "CIS-ITSM", median: 135000, count: 134 },
                { cert: "CSA", median: 115000, count: 298 },
              ].map((item) => (
                <div key={item.cert} className="flex items-center gap-4">
                  <span className="w-32 font-medium">{item.cert}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(item.median / 200000) * 100}%` }}
                    />
                  </div>
                  <span className="w-24 text-right font-semibold">
                    {formatCurrency(item.median)}
                  </span>
                  <span className="w-16 text-right text-gray-500 text-sm">
                    n={item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-semibold mb-4">Top Paying Cities (Remote Excluded)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { city: "San Francisco", median: 175000 },
                { city: "New York", median: 165000 },
                { city: "Seattle", median: 160000 },
                { city: "Boston", median: 155000 },
                { city: "Austin", median: 145000 },
                { city: "Chicago", median: 140000 },
                { city: "Denver", median: 138000 },
                { city: "Atlanta", median: 130000 },
              ].map((item) => (
                <div
                  key={item.city}
                  className="flex justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">{item.city}</span>
                  <span className="text-blue-600 font-semibold">
                    {formatCurrency(item.median)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
