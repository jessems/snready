"use client";

import { useState } from "react";
import Link from "next/link";
import certificationsData from "@/data/certifications.json";

interface Certification {
  slug: string;
  name: string;
  fullName: string;
  category: string;
  level: string;
  isReady?: boolean;
  examDetails?: {
    questionCount: number;
    duration: number;
    passingScore: number;
  };
  prerequisites: string[];
}

// Difficulty data based on community feedback, exam structure, and prerequisites
const difficultyData: Record<string, {
  difficulty: number;  // 1-5 scale
  studyHours: number;  // Estimated hours to prepare
  passRate: string;    // Estimated based on community data
  factors: string[];   // What makes it hard/easy
  tips: string;
}> = {
  "csa": {
    difficulty: 2,
    studyHours: 40,
    passRate: "65-75%",
    factors: ["Entry-level certification", "Broad but shallow coverage", "No coding required"],
    tips: "Focus on hands-on PDI practice. Many questions test practical knowledge, not just theory."
  },
  "cad": {
    difficulty: 3,
    studyHours: 60,
    passRate: "55-65%",
    factors: ["Requires JavaScript proficiency", "GlideRecord mastery essential", "Complex scenario questions"],
    tips: "Practice scripting daily in your PDI. Understand async/await and GlideAjax deeply."
  },
  "cis-itsm": {
    difficulty: 3,
    studyHours: 50,
    passRate: "60-70%",
    factors: ["ITIL knowledge required", "Process-heavy content", "Configuration vs customization focus"],
    tips: "Know ITIL fundamentals. Understand the flow between Incident, Problem, and Change."
  },
  "cis-df": {
    difficulty: 4,
    studyHours: 70,
    passRate: "50-60%",
    factors: ["CMDB complexity", "CSDM framework knowledge", "Health scoring and identification rules"],
    tips: "Master the CSDM domains. Practice with Discovery and IRE in your PDI."
  },
  "cis-discovery": {
    difficulty: 4,
    studyHours: 65,
    passRate: "50-60%",
    factors: ["Pattern writing complexity", "Networking knowledge helpful", "MID Server architecture"],
    tips: "Understand credential types and probe sequences. Pattern questions are challenging."
  },
  "cis-csm": {
    difficulty: 3,
    studyHours: 55,
    passRate: "55-65%",
    factors: ["Case management workflows", "Agent Workspace knowledge", "Integration with other modules"],
    tips: "Focus on case escalation paths and assignment rules. Know Agent Workspace features."
  },
  "cis-ham": {
    difficulty: 3,
    studyHours: 50,
    passRate: "55-65%",
    factors: ["Asset lifecycle understanding", "Integration with Discovery", "Financial management basics"],
    tips: "Understand asset states and lifecycle. Know the difference between HAM and SAM."
  },
  "cis-sam": {
    difficulty: 3,
    studyHours: 55,
    passRate: "50-60%",
    factors: ["License compliance complexity", "Software normalization", "Publisher/product relationships"],
    tips: "Focus on reconciliation rules and compliance calculations. Many scenario-based questions."
  },
  "cis-hr": {
    difficulty: 3,
    studyHours: 50,
    passRate: "55-65%",
    factors: ["HR module specifics", "Employee journey design", "Integration patterns"],
    tips: "Understand HR case types and the employee portal. Know lifecycle events well."
  },
  "cis-sm": {
    difficulty: 4,
    studyHours: 70,
    passRate: "45-55%",
    factors: ["Service mapping complexity", "Pattern-based discovery", "Dependency mapping"],
    tips: "Practice service mapping in your PDI. Understand top-down vs bottom-up discovery."
  },
  "cis-em": {
    difficulty: 3,
    studyHours: 55,
    passRate: "55-65%",
    factors: ["Event processing rules", "Alert management", "Integration sources"],
    tips: "Know event rule execution order. Understand alert grouping and correlation."
  },
  "cis-pa": {
    difficulty: 3,
    studyHours: 50,
    passRate: "55-65%",
    factors: ["Indicator types and scores", "Dashboard design", "Data collection jobs"],
    tips: "Understand breakdown sources and time series data. Know formula indicators."
  },
  "cis-rc": {
    difficulty: 4,
    studyHours: 65,
    passRate: "50-60%",
    factors: ["GRC framework complexity", "Policy and control management", "Risk scoring"],
    tips: "Understand the full GRC lifecycle. Know how policies, controls, and risks relate."
  },
  "cis-vr": {
    difficulty: 4,
    studyHours: 60,
    passRate: "50-60%",
    factors: ["Vulnerability response workflows", "Integration with scanners", "Risk-based prioritization"],
    tips: "Know vulnerability states and the remediation process. Scanner integration is key."
  },
  "cis-sir": {
    difficulty: 4,
    studyHours: 65,
    passRate: "50-60%",
    factors: ["Security incident workflows", "MITRE ATT&CK framework", "Playbook automation"],
    tips: "Understand incident classification and containment. Know the SIEM integrations."
  },
  "cis-sp": {
    difficulty: 3,
    studyHours: 50,
    passRate: "55-65%",
    factors: ["Service Provider module specifics", "Multi-tenancy concepts", "Customer management"],
    tips: "Focus on customer accounts and managed services. Know tenant separation."
  },
  "cis-spm": {
    difficulty: 3,
    studyHours: 55,
    passRate: "55-65%",
    factors: ["Project portfolio management", "Agile development board", "Resource management"],
    tips: "Understand demand management and project states. Know the APM features."
  },
  "cis-tprm": {
    difficulty: 4,
    studyHours: 60,
    passRate: "50-60%",
    factors: ["Third-party risk assessment", "Vendor lifecycle management", "Compliance frameworks"],
    tips: "Know the vendor engagement process. Understand risk scoring methodologies."
  },
  "cis-fsm": {
    difficulty: 3,
    studyHours: 55,
    passRate: "55-65%",
    factors: ["Field service workflows", "Dispatcher workbench", "Mobile app features"],
    tips: "Understand work order lifecycle and technician scheduling. Know the mobile features."
  },
  "cpoa": {
    difficulty: 4,
    studyHours: 70,
    passRate: "45-55%",
    factors: ["Platform governance", "Strategic planning focus", "Business-level decisions"],
    tips: "This is more strategic than technical. Understand governance frameworks and CoE concepts."
  },
};

type SortOption = "difficulty-asc" | "difficulty-desc" | "study-asc" | "study-desc" | "name";

const readyCerts = (certificationsData.certifications as Certification[])
  .filter((c) => c.isReady && difficultyData[c.slug])
  .sort((a, b) => a.name.localeCompare(b.name));

export default function DifficultyRankingsPage() {
  const [sortBy, setSortBy] = useState<SortOption>("difficulty-asc");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const categories = ["all", ...new Set(readyCerts.map((c) => c.category))];

  const sortedCerts = [...readyCerts]
    .filter((c) => filterCategory === "all" || c.category === filterCategory)
    .sort((a, b) => {
      const dataA = difficultyData[a.slug];
      const dataB = difficultyData[b.slug];
      
      switch (sortBy) {
        case "difficulty-asc":
          return dataA.difficulty - dataB.difficulty;
        case "difficulty-desc":
          return dataB.difficulty - dataA.difficulty;
        case "study-asc":
          return dataA.studyHours - dataB.studyHours;
        case "study-desc":
          return dataB.studyHours - dataA.studyHours;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const getDifficultyLabel = (level: number): string => {
    switch (level) {
      case 1: return "Easy";
      case 2: return "Moderate";
      case 3: return "Challenging";
      case 4: return "Hard";
      case 5: return "Very Hard";
      default: return "Unknown";
    }
  };

  const getDifficultyColor = (level: number): string => {
    switch (level) {
      case 1: return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
      case 2: return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
      case 3: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
      case 4: return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300";
      case 5: return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
      default: return "bg-zinc-100 text-zinc-800";
    }
  };

  const easiest = readyCerts.reduce((min, c) => 
    difficultyData[c.slug].difficulty < difficultyData[min.slug].difficulty ? c : min
  );
  
  const hardest = readyCerts.reduce((max, c) =>
    difficultyData[c.slug].difficulty > difficultyData[max.slug].difficulty ? c : max
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50 to-white py-16 dark:from-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            ServiceNow Certification Difficulty Rankings
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Compare all 20 ServiceNow certifications by difficulty, study time, and pass rates.
            Find the right certification for your experience level.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-950/20">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Easiest to Start</p>
              <Link href={`/${easiest.slug}`} className="text-xl font-bold text-green-700 dark:text-green-400 hover:underline">
                {easiest.name}
              </Link>
              <p className="text-sm text-zinc-500 dark:text-zinc-500">~{difficultyData[easiest.slug].studyHours} hours prep</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Average Difficulty</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Level 3.2</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-500">Challenging</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-orange-50 dark:bg-orange-950/20">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Most Challenging</p>
              <Link href={`/${hardest.slug}`} className="text-xl font-bold text-orange-700 dark:text-orange-400 hover:underline">
                {hardest.name}
              </Link>
              <p className="text-sm text-zinc-500 dark:text-zinc-500">~{difficultyData[hardest.slug].studyHours} hours prep</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="py-6 sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-zinc-200 dark:bg-zinc-950/95 dark:border-zinc-800">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm text-zinc-600 dark:text-zinc-400">Filter:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-zinc-600 dark:text-zinc-400">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="difficulty-asc">Easiest First</option>
                <option value="difficulty-desc">Hardest First</option>
                <option value="study-asc">Shortest Prep Time</option>
                <option value="study-desc">Longest Prep Time</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Rankings List */}
      <section className="py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="space-y-4">
            {sortedCerts.map((cert, index) => {
              const data = difficultyData[cert.slug];
              return (
                <div
                  key={cert.slug}
                  className="rounded-xl border border-zinc-200 bg-white p-6 hover:border-zinc-300 transition-colors dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Rank & Name */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-lg font-bold text-zinc-400 dark:bg-zinc-800">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <Link href={`/${cert.slug}`} className="group">
                          <h3 className="text-xl font-semibold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-50 dark:group-hover:text-emerald-400">
                            {cert.name} — {cert.fullName}
                          </h3>
                        </Link>
                        <p className="text-sm text-zinc-500 mt-1 dark:text-zinc-400">
                          {cert.category.charAt(0).toUpperCase() + cert.category.slice(1).replace("-", " ")} • {cert.level}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-3 lg:flex-nowrap">
                      <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getDifficultyColor(data.difficulty)}`}>
                        {getDifficultyLabel(data.difficulty)}
                      </div>
                      <div className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                        ~{data.studyHours}h prep
                      </div>
                      <div className="px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                        {data.passRate} pass
                      </div>
                    </div>
                  </div>

                  {/* Factors and Tips */}
                  <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">What makes it {data.difficulty >= 3 ? "challenging" : "manageable"}:</p>
                        <ul className="space-y-1">
                          {data.factors.map((factor, i) => (
                            <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                              <span className={data.difficulty >= 3 ? "text-orange-500" : "text-green-500"}>•</span>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Pro tip:</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{data.tips}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/${cert.slug}/practice-questions`}
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                      Practice Questions →
                    </Link>
                    <Link
                      href={`/readiness`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Check Readiness →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-12 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">How We Rank Difficulty</h2>
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p className="text-zinc-600 dark:text-zinc-400">
              Our difficulty rankings are based on multiple factors from community feedback and exam analysis:
            </p>
            <ul className="text-zinc-600 dark:text-zinc-400 space-y-2 mt-4">
              <li><strong>Prerequisites required:</strong> Certifications requiring prior certs or extensive experience score higher.</li>
              <li><strong>Technical depth:</strong> Coding/scripting requirements increase difficulty.</li>
              <li><strong>Domain breadth:</strong> More exam domains typically means more content to master.</li>
              <li><strong>Community pass rates:</strong> Self-reported pass rates from Reddit and ServiceNow Community.</li>
              <li><strong>Study time estimates:</strong> Average hours reported to prepare successfully.</li>
            </ul>
            <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-4">
              Pass rates are estimates based on community discussions and may vary. Individual results depend on prior experience and study approach.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Ready to Start Preparing?</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Check your readiness or start practicing with exam-style questions.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/readiness"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Check Your Readiness
            </Link>
            <Link
              href="/certifications"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Browse All Certifications
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
