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

  const phaseColors = {
    learn: { bg: "bg-blue-500", light: "bg-blue-50 dark:bg-blue-950", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
    practice: { bg: "bg-amber-500", light: "bg-amber-50 dark:bg-amber-950", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
    review: { bg: "bg-emerald-500", light: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Study Plan Generator
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Get a personalized week-by-week schedule for your certification
          </p>
        </div>

        {/* Progress Steps */}
        {step < 4 && (
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-1">
              {["Certification", "Timeline", "Hours"].map((label, i) => (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                        i + 1 < step
                          ? "bg-emerald-500 text-white"
                          : i + 1 === step
                          ? "bg-violet-600 text-white"
                          : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {i + 1 < step ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs mt-1.5 ${i + 1 === step ? "text-violet-600 dark:text-violet-400 font-medium" : "text-zinc-500"}`}>
                      {label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div className={`w-16 h-0.5 mx-2 mb-5 ${i + 1 < step ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-800"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Select Certification */}
        {step === 1 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Select your certification
            </h2>
            <div className="grid gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {readyCerts.map((cert) => (
                <button
                  key={cert.slug}
                  onClick={() => {
                    setSelectedCert(cert);
                    setStep(2);
                  }}
                  className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {cert.name}
                      </span>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {cert.fullName}
                      </p>
                    </div>
                    <div className="text-sm text-zinc-400 dark:text-zinc-500">
                      {cert.domains.length} domains →
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
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1"
            >
              ← Change certification
            </button>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                  <span className="text-lg">📅</span>
                </div>
                <div>
                  <h2 className="font-semibold text-zinc-900 dark:text-white">
                    How long until your exam?
                  </h2>
                  <p className="text-sm text-zinc-500">
                    4-8 weeks is recommended for most people
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
                {weekOptions.map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeeks(w)}
                    className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                      weeks === w
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {w}w
                  </button>
                ))}
              </div>

              <div className="flex justify-between text-sm text-zinc-500 mb-6">
                <span>⚡ Intensive</span>
                <span className="font-medium text-violet-600 dark:text-violet-400">{weeks} weeks</span>
                <span>🐢 Relaxed</span>
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-all"
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
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1"
            >
              ← Back
            </button>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                  <span className="text-lg">⏱️</span>
                </div>
                <div>
                  <h2 className="font-semibold text-zinc-900 dark:text-white">
                    Weekly study hours?
                  </h2>
                  <p className="text-sm text-zinc-500">
                    Be realistic — consistency beats intensity
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 mb-6">
                {hourOptions.map((h) => (
                  <button
                    key={h}
                    onClick={() => setHoursPerWeek(h)}
                    className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                      hoursPerWeek === h
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-white">{selectedCert?.name}</div>
                    <div className="text-xs text-zinc-500">Certification</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-white">{weeks}w</div>
                    <div className="text-xs text-zinc-500">Duration</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-violet-600">{weeks * hoursPerWeek}h</div>
                    <div className="text-xs text-zinc-500">Total</div>
                  </div>
                </div>
              </div>

              <button
                onClick={generatePlan}
                className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                Generate Study Plan ✨
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Show Plan */}
        {step === 4 && studyPlan && (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{studyPlan.certification.name}</h2>
                  <p className="text-violet-200 text-sm">Study Plan</p>
                </div>
                <button
                  onClick={() => { setStep(1); setStudyPlan(null); }}
                  className="text-violet-200 hover:text-white text-sm underline"
                >
                  Start over
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold">{studyPlan.totalWeeks}</div>
                  <div className="text-xs text-violet-200">weeks</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold">{studyPlan.hoursPerWeek}</div>
                  <div className="text-xs text-violet-200">hrs/week</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold">{studyPlan.totalHours}</div>
                  <div className="text-xs text-violet-200">total hrs</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                <span className="text-sm text-violet-200">🎯 Target exam</span>
                <span className="font-semibold">{studyPlan.examDate}</span>
              </div>
            </div>

            {/* Phase Legend */}
            <div className="flex justify-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-zinc-600 dark:text-zinc-400">Learn</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-zinc-600 dark:text-zinc-400">Practice</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-zinc-600 dark:text-zinc-400">Review</span>
              </span>
            </div>

            {/* Weekly Plans */}
            <div className="space-y-3">
              {studyPlan.weeks.map((week) => {
                const colors = phaseColors[week.phase];
                return (
                  <div
                    key={week.week}
                    className={`rounded-xl border ${colors.border} ${colors.light} p-4`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 rounded-lg ${colors.bg} text-white flex items-center justify-center font-bold text-sm`}>
                        {week.week}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-900 dark:text-white">
                            Week {week.week}
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} text-white uppercase`}>
                            {week.phase}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-500">{week.totalHours} hours</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {week.domains.map((d) => (
                        <Link
                          key={d.slug}
                          href={`/${studyPlan.certification.slug}/practice-questions/${d.slug}`}
                          className="px-2.5 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:border-violet-400 hover:text-violet-600 transition-all"
                        >
                          {d.name} <span className="text-zinc-400">({d.hours}h)</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={copyPlan}
                className="flex-1 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                {copied ? "✓ Copied!" : "📋 Copy Plan"}
              </button>
              <Link
                href={`/${studyPlan.certification.slug}/practice-questions`}
                className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-all text-center"
              >
                Start Practicing →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
