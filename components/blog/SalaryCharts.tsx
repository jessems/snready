"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const COLORS = {
  blue: "#3b82f6",
  cyan: "#06b6d4",
  green: "#10b981",
  purple: "#8b5cf6",
  orange: "#f97316",
  pink: "#ec4899",
};

// US Salary by Role
const roleData = [
  { role: "Architect", salary: 174533, color: COLORS.purple },
  { role: "Consultant", salary: 159545, color: COLORS.blue },
  { role: "Developer", salary: 125212, color: COLORS.cyan },
  { role: "Manager", salary: 118667, color: COLORS.green },
  { role: "Administrator", salary: 92929, color: COLORS.orange },
];

// US vs UK comparison
const comparisonData = [
  { role: "Architect", US: 174533, UK: 106000 },
  { role: "Developer", US: 125212, UK: 82000 },
  { role: "Consultant", US: 159545, UK: 95000 },
  { role: "Administrator", US: 92929, UK: 67000 },
];

// Experience vs Salary
const experienceData = [
  { exp: "<1 yr", salary: 72000 },
  { exp: "1-2 yr", salary: 95000 },
  { exp: "3-5 yr", salary: 115000 },
  { exp: "5-7 yr", salary: 145000 },
  { exp: "8+ yr", salary: 175000 },
];

const formatSalary = (value: number) => `$${(value / 1000).toFixed(0)}K`;

// Custom tooltip component to avoid TypeScript issues
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
        <p className="font-medium text-slate-900">{label || payload[0].payload.role || payload[0].payload.exp || payload[0].payload.label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color || '#64748b' }}>
            {entry.name}: ${Number(entry.value).toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DistributionTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
        <p className="font-medium text-slate-900">{data.label}</p>
        <p className="text-sm text-slate-600">{data.count} people ({data.pct}%)</p>
      </div>
    );
  }
  return null;
};

export function RoleSalaryChart() {
  return (
    <div className="my-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Average US Salary by Role
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={roleData} layout="vertical" margin={{ left: 20, right: 40 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            type="number" 
            tickFormatter={formatSalary}
            domain={[0, 200000]}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis 
            type="category" 
            dataKey="role" 
            width={100}
            tick={{ fill: '#334155', fontSize: 13, fontWeight: 500 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="salary" radius={[0, 6, 6, 0]} name="Salary">
            {roleData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-slate-500 mt-3 text-center">
        Based on 104 US salary submissions from Reddit
      </p>
    </div>
  );
}

export function USvsUKChart() {
  return (
    <div className="my-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        US vs UK Salary Comparison
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={comparisonData} margin={{ left: 20, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="role" 
            tick={{ fill: '#334155', fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={formatSalary}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="US" fill={COLORS.blue} radius={[4, 4, 0, 0]} name="🇺🇸 US" />
          <Bar dataKey="UK" fill={COLORS.cyan} radius={[4, 4, 0, 0]} name="🇬🇧 UK" />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-slate-500 mt-3 text-center">
        US salaries average 57% higher than UK equivalents
      </p>
    </div>
  );
}

export function ExperienceSalaryChart() {
  return (
    <div className="my-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Salary Progression by Experience
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={experienceData} margin={{ left: 20, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="exp" 
            tick={{ fill: '#334155', fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={formatSalary}
            tick={{ fill: '#64748b', fontSize: 12 }}
            domain={[0, 200000]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="salary" fill={COLORS.green} radius={[4, 4, 0, 0]} name="Salary" />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-slate-500 mt-3 text-center">
        Experience drives 143% salary growth from entry to senior levels
      </p>
    </div>
  );
}

export function TopEarnersChart() {
  const topData = [
    { label: "$200K+", count: 15, pct: 7.3 },
    { label: "$150-200K", count: 28, pct: 13.7 },
    { label: "$100-150K", count: 52, pct: 25.4 },
    { label: "$75-100K", count: 43, pct: 21.0 },
    { label: "<$75K", count: 67, pct: 32.6 },
  ];

  return (
    <div className="my-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Salary Distribution
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={topData} layout="vertical" margin={{ left: 20, right: 40 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            type="number"
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 40]}
          />
          <YAxis 
            type="category" 
            dataKey="label" 
            width={80}
            tick={{ fill: '#334155', fontSize: 13 }}
          />
          <Tooltip content={<DistributionTooltip />} />
          <Bar dataKey="pct" fill={COLORS.purple} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-slate-500 mt-3 text-center">
        7.3% of submissions report earning $200K+ annually
      </p>
    </div>
  );
}
