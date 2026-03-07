"use client";

import { useState } from "react";
import Link from "next/link";
import certificationsData from "@/data/certifications.json";

interface Domain {
  name: string;
  slug: string;
  percentage: number;
  description: string;
}

interface Certification {
  slug: string;
  name: string;
  fullName: string;
  domains: Domain[];
  isReady?: boolean;
  examDetails?: {
    questionCount: number;
    duration: number;
    passingScore: number;
  };
}

interface WeekPlan {
  week: number;
  phase: "learn" | "practice" | "review";
  domains: {
    name: string;
    slug: string;
    hours: number;
    percentage: number;
  }[];
  totalHours: number;
}

interface StudyPlan {
  certification: Certification;
  totalWeeks: number;
  hoursPerWeek: number;
  weeks: WeekPlan[];
  totalHours: number;
  examDate: string;
}

const readyCerts = (certificationsData.certifications as Certification[])
  .filter((c) => c.isReady && c.domains && c.domains.length > 0)
  .sort((a, b) => a.name.localeCompare(b.name));

const weekOptions = [2, 4, 6, 8, 10, 12];
const hourOptions = [5, 10, 15, 20, 25];

export default function StudyPlanPage() {
  const [step, setStep] = useState(1);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [weeks, setWeeks] = useState(6);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [copied, setCopied] = useState(false);

  const generatePlan = () => {
    if (!selectedCert) return;

    const totalHours = weeks * hoursPerWeek;
    const domains = selectedCert.domains;

    const domainHours = domains.map((d) => ({
      ...d,
      totalHours: Math.round((d.percentage / 100) * totalHours * 10) / 10,
    }));

    const sortedDomains = [...domainHours].sort(
      (a, b) => b.percentage - a.percentage
    );

    const weekPlans: WeekPlan[] = [];
    const learnWeeks = Math.max(1, Math.floor(weeks * 0.6));
    const practiceWeeks = Math.max(1, Math.floor(weeks * 0.25));

    let domainIndex = 0;
    const remainingHoursPerDomain = domainHours.map((d) => d.totalHours);

    for (let w = 1; w <= weeks; w++) {
      const weekDomains: WeekPlan["domains"] = [];
      let weekHours = 0;
      const targetHours = hoursPerWeek;

      const phase: WeekPlan["phase"] =
        w <= learnWeeks ? "learn" : w <= learnWeeks + practiceWeeks ? "practice" : "review";

      if (phase === "learn") {
        while (weekHours < targetHours && domainIndex < sortedDomains.length) {
          const domain = sortedDomains[domainIndex];
          const remainingIdx = domainHours.findIndex((d) => d.slug === domain.slug);
          const available = remainingHoursPerDomain[remainingIdx];

          if (available > 0) {
            const allocate = Math.min(
              available,
              targetHours - weekHours,
              Math.ceil(domain.totalHours / Math.ceil(learnWeeks / 2))
            );
            weekDomains.push({
              name: domain.name,
              slug: domain.slug,
              hours: Math.round(allocate * 10) / 10,
              percentage: domain.percentage,
            });
            remainingHoursPerDomain[remainingIdx] -= allocate;
            weekHours += allocate;
          }

          if (remainingHoursPerDomain[remainingIdx] <= 0.5) {
            domainIndex++;
          } else if (weekHours >= targetHours * 0.9) {
            break;
          }
        }

        if (weekHours < targetHours * 0.8) {
          for (let i = 0; i < domainHours.length && weekHours < targetHours; i++) {
            if (
              remainingHoursPerDomain[i] > 0 &&
              !weekDomains.find((d) => d.slug === domainHours[i].slug)
            ) {
              const allocate = Math.min(remainingHoursPerDomain[i], targetHours - weekHours);
              weekDomains.push({
                name: domainHours[i].name,
                slug: domainHours[i].slug,
                hours: Math.round(allocate * 10) / 10,
                percentage: domainHours[i].percentage,
              });
              remainingHoursPerDomain[i] -= allocate;
              weekHours += allocate;
            }
          }
        }
      } else {
        const domainsToUse = phase === "practice" ? sortedDomains.slice(0, 4) : sortedDomains.slice(0, 6);
        const perDomain = targetHours / domainsToUse.length;
        domainsToUse.forEach((d) => {
          weekDomains.push({
            name: d.name,
            slug: d.slug,
            hours: Math.round(perDomain * 10) / 10,
            percentage: d.percentage,
          });
        });
        weekHours = targetHours;
      }

      weekPlans.push({
        week: w,
        phase,
        domains: weekDomains,
        totalHours: Math.round(weekHours * 10) / 10,
      });
    }

    const examDate = new Date();
    examDate.setDate(examDate.getDate() + weeks * 7);

    setStudyPlan({
      certification: selectedCert,
      totalWeeks: weeks,
      hoursPerWeek,
      weeks: weekPlans,
      totalHours,
      examDate: examDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    });

    setStep(4);
  };

  const copyPlan = () => {
    if (!studyPlan) return;
    const text = `📚 ${studyPlan.certification.name} Study Plan (${studyPlan.totalWeeks} weeks)\n\n${studyPlan.weeks
      .map((w) => `Week ${w.week} [${w.phase.toUpperCase()}]: ${w.domains.map((d) => d.name).join(", ")}`)
      .join("\n")}\n\n🎯 Total: ${studyPlan.totalHours} hours\n📅 Exam: ${studyPlan.examDate}\n\nGenerated at snready.com/study-plan`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const phaseConfig = {
    learn: { 
      bg: "bg-gradient-to-r from-blue-500 to-indigo-500", 
      light: "bg-blue-50/50 dark:bg-blue-950/30", 
      text: "text-blue-600 dark:text-blue-400", 
      border: "border-blue-200/50 dark:border-blue-800/50",
      icon: "📖"
    },
    practice: { 
      bg: "bg-gradient-to-r from-amber-500 to-orange-500", 
      light: "bg-amber-50/50 dark:bg-amber-950/30", 
      text: "text-amber-600 dark:text-amber-400", 
      border: "border-amber-200/50 dark:border-amber-800/50",
      icon: "💪"
    },
    review: { 
      bg: "bg-gradient-to-r from-emerald-500 to-teal-500", 
      light: "bg-emerald-50/50 dark:bg-emerald-950/30", 
      text: "text-emerald-600 dark:text-emerald-400", 
      border: "border-emerald-200/50 dark:border-emerald-800/50",
      icon: "🎯"
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a2540]">
      {/* Hero gradient */}
      <div 
        className="absolute inset-x-0 top-0 h-[500px] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 91, 255, 0.15), transparent),
            radial-gradient(ellipse 60% 50% at 100% 0%, rgba(128, 233, 255, 0.1), transparent),
            radial-gradient(ellipse 60% 40% at 0% 50%, rgba(228, 120, 255, 0.08), transparent)
          `
        }}
      />
      
      <div className="relative max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Personalized scheduling
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Study Plan Generator
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Get a week-by-week schedule optimized for your certification exam
          </p>
        </div>

        {/* Progress indicator */}
        {step < 4 && (
          <div className="flex justify-center mb-12">
            <div className="flex items-center">
              {[
                { num: 1, label: "Cert" },
                { num: 2, label: "Timeline" },
                { num: 3, label: "Hours" },
              ].map((s, i) => (
                <div key={s.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        s.num < step
                          ? "bg-gradient-to-r from-emerald-400 to-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                          : s.num === step
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                      }`}
                    >
                      {s.num < step ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        s.num
                      )}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${s.num === step ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div className={`w-12 sm:w-20 h-0.5 mx-2 mb-6 rounded-full transition-all duration-300 ${
                      s.num < step ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Select Certification */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Which certification are you preparing for?
            </h2>
            <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
              {readyCerts.map((cert) => (
                <button
                  key={cert.slug}
                  onClick={() => {
                    setSelectedCert(cert);
                    setStep(2);
                  }}
                  className="w-full p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
                        {cert.name.slice(0, 3)}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {cert.name}
                        </span>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {cert.fullName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-sm">{cert.domains.length} domains</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Timeline */}
        {step === 2 && (
          <div className="space-y-6">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Change certification
            </button>

            <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white text-lg">
                    How long until your exam?
                  </h2>
                  <p className="text-slate-500 text-sm">
                    4-8 weeks is ideal for most certifications
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-2 mb-6">
                {weekOptions.map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeeks(w)}
                    className={`py-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      weeks === w
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 scale-105"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {w}w
                  </button>
                ))}
              </div>

              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${((weeks - 2) / 10) * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-sm text-slate-500 mb-8">
                <span>⚡ Intensive</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{weeks} weeks selected</span>
                <span>🐢 Relaxed</span>
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Hours per week */}
        {step === 3 && (
          <div className="space-y-6">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white text-lg">
                    Hours per week?
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Be realistic — consistency beats intensity
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 mb-8">
                {hourOptions.map((h) => (
                  <button
                    key={h}
                    onClick={() => setHoursPerWeek(h)}
                    className={`py-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      hoursPerWeek === h
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 scale-105"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>

              {/* Summary card */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl p-5 mb-8 border border-slate-200/50 dark:border-slate-700/50">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                      {selectedCert?.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Certification</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{weeks}</div>
                    <div className="text-xs text-slate-500 mt-1">Weeks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                      {weeks * hoursPerWeek}h
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Total hours</div>
                  </div>
                </div>
              </div>

              <button
                onClick={generatePlan}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Generate My Plan</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Show Plan */}
        {step === 4 && studyPlan && (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/25">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-sm font-medium mb-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Plan Generated
                  </div>
                  <h2 className="text-3xl font-bold">{studyPlan.certification.name}</h2>
                  <p className="text-white/70">{studyPlan.certification.fullName}</p>
                </div>
                <button
                  onClick={() => { setStep(1); setStudyPlan(null); }}
                  className="text-white/70 hover:text-white text-sm flex items-center gap-1 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Start over
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold">{studyPlan.totalWeeks}</div>
                  <div className="text-sm text-white/70">weeks</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold">{studyPlan.hoursPerWeek}</div>
                  <div className="text-sm text-white/70">hrs/week</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold">{studyPlan.totalHours}</div>
                  <div className="text-sm text-white/70">total</div>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/70">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Target exam date
                </div>
                <span className="font-semibold">{studyPlan.examDate}</span>
              </div>
            </div>

            {/* Phase Legend */}
            <div className="flex justify-center gap-6 py-2">
              {[
                { phase: "learn", label: "Learn", color: "bg-blue-500" },
                { phase: "practice", label: "Practice", color: "bg-amber-500" },
                { phase: "review", label: "Review", color: "bg-emerald-500" },
              ].map((p) => (
                <div key={p.phase} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${p.color}`} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{p.label}</span>
                </div>
              ))}
            </div>

            {/* Weekly Plans */}
            <div className="space-y-3">
              {studyPlan.weeks.map((week) => {
                const config = phaseConfig[week.phase];
                return (
                  <div
                    key={week.week}
                    className={`rounded-xl border ${config.border} ${config.light} backdrop-blur p-4 transition-all hover:shadow-lg`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl ${config.bg} text-white flex items-center justify-center font-bold shadow-lg`}>
                        {week.week}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            Week {week.week}
                          </span>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.bg} text-white uppercase tracking-wide`}>
                            {config.icon} {week.phase}
                          </span>
                        </div>
                        <span className="text-sm text-slate-500">{week.totalHours} hours this week</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {week.domains.map((d) => (
                        <Link
                          key={d.slug}
                          href={`/${studyPlan.certification.slug}/practice-questions/${d.slug}`}
                          className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:shadow-md group"
                        >
                          <span className="font-medium">{d.name}</span>
                          <span className="text-slate-400 ml-1.5 group-hover:text-indigo-400">({d.hours}h)</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={copyPlan}
                className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Plan
                  </>
                )}
              </button>
              <Link
                href={`/${studyPlan.certification.slug}/practice-questions`}
                className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 text-center flex items-center justify-center gap-2"
              >
                Start Practicing
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
