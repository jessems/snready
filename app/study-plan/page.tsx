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
  focus: string;
  domains: {
    name: string;
    slug: string;
    hours: number;
    percentage: number;
  }[];
  activities: string[];
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

// Get ready certifications
const readyCerts = (certificationsData.certifications as Certification[])
  .filter((c) => c.isReady && c.domains && c.domains.length > 0)
  .sort((a, b) => {
    // Sort by category: foundation first, then alphabetically
    const order: Record<string, number> = {
      foundation: 0,
      developer: 1,
      itsm: 2,
    };
    const aOrder = order[a.slug] ?? 10;
    const bOrder = order[b.slug] ?? 10;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.name.localeCompare(b.name);
  });

export default function StudyPlanPage() {
  const [step, setStep] = useState(1);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [weeks, setWeeks] = useState(6);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);

  const generatePlan = () => {
    if (!selectedCert) return;

    const totalHours = weeks * hoursPerWeek;
    const domains = selectedCert.domains;

    // Calculate hours per domain based on percentage
    const domainHours = domains.map((d) => ({
      ...d,
      totalHours: Math.round((d.percentage / 100) * totalHours * 10) / 10,
    }));

    // Distribute domains across weeks
    // Strategy: Cover high-weight domains early, spread smaller ones
    const sortedDomains = [...domainHours].sort(
      (a, b) => b.percentage - a.percentage
    );

    const weekPlans: WeekPlan[] = [];

    // Phase allocation:
    // - First 60% of time: Learn new material
    // - Next 25% of time: Deep practice
    // - Final 15% of time: Review and exam prep

    const learnWeeks = Math.max(1, Math.floor(weeks * 0.6));
    const practiceWeeks = Math.max(1, Math.floor(weeks * 0.25));
    const reviewWeeks = Math.max(1, weeks - learnWeeks - practiceWeeks);

    // Distribute domains across learning weeks
    let domainIndex = 0;
    let remainingHoursPerDomain = domainHours.map((d) => d.totalHours);

    for (let w = 1; w <= weeks; w++) {
      const weekDomains: WeekPlan["domains"] = [];
      let weekHours = 0;
      const targetHours = hoursPerWeek;

      if (w <= learnWeeks) {
        // Learning phase: cover new domains
        while (weekHours < targetHours && domainIndex < sortedDomains.length) {
          const domain = sortedDomains[domainIndex];
          const remainingIdx = domainHours.findIndex(
            (d) => d.slug === domain.slug
          );
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

        // If we still have room, add more from remaining domains
        if (weekHours < targetHours * 0.8) {
          for (let i = 0; i < domainHours.length && weekHours < targetHours; i++) {
            if (
              remainingHoursPerDomain[i] > 0 &&
              !weekDomains.find((d) => d.slug === domainHours[i].slug)
            ) {
              const allocate = Math.min(
                remainingHoursPerDomain[i],
                targetHours - weekHours
              );
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

        weekPlans.push({
          week: w,
          focus: "Learn",
          domains: weekDomains,
          activities: [
            "📚 Study official documentation and courses",
            "✍️ Take notes on key concepts",
            `🎯 Complete ${Math.min(10, Math.round(weekHours))} practice questions per domain`,
            "🔬 Try hands-on exercises in your PDI",
          ],
          totalHours: Math.round(weekHours * 10) / 10,
        });
      } else if (w <= learnWeeks + practiceWeeks) {
        // Practice phase: focus on weak areas
        const highWeightDomains = sortedDomains.slice(0, 4);
        const perDomain = targetHours / highWeightDomains.length;

        highWeightDomains.forEach((d) => {
          weekDomains.push({
            name: d.name,
            slug: d.slug,
            hours: Math.round(perDomain * 10) / 10,
            percentage: d.percentage,
          });
        });

        weekPlans.push({
          week: w,
          focus: "Practice",
          domains: weekDomains,
          activities: [
            "📝 Take full-length practice exams",
            "🔍 Review wrong answers in detail",
            "💡 Focus on high-weight domains",
            "🔄 Re-study weak areas identified",
          ],
          totalHours: targetHours,
        });
      } else {
        // Review phase: all domains, exam simulation
        const perDomain = targetHours / Math.min(domains.length, 6);
        sortedDomains.slice(0, 6).forEach((d) => {
          weekDomains.push({
            name: d.name,
            slug: d.slug,
            hours: Math.round(perDomain * 10) / 10,
            percentage: d.percentage,
          });
        });

        weekPlans.push({
          week: w,
          focus: "Review",
          domains: weekDomains,
          activities: [
            "🎯 Take timed mock exams",
            "📊 Review all domains quickly",
            "💤 Rest well before exam day",
            "✅ Review exam logistics and requirements",
          ],
          totalHours: targetHours,
        });
      }
    }

    // Calculate exam date
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
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });

    setStep(4);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] subtle-gradient py-10">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-light)] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[var(--accent)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                Study Plan Generator
              </h1>
              <p className="text-[var(--text-secondary)]">
                Create a personalized week-by-week study schedule
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    s === step
                      ? "bg-[var(--accent)] text-white"
                      : s < step
                        ? "bg-green-500 text-white"
                        : "bg-[var(--card-border)] text-[var(--text-secondary)]"
                  }`}
                >
                  {s < step ? "✓" : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 rounded ${
                      s < step ? "bg-green-500" : "bg-[var(--card-border)]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Select Certification */}
        {step === 1 && (
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Which certification are you studying for?
            </h2>
            <div className="grid gap-3">
              {readyCerts.map((cert) => (
                <button
                  key={cert.slug}
                  onClick={() => {
                    setSelectedCert(cert);
                    setStep(2);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedCert?.slug === cert.slug
                      ? "border-[var(--accent)] bg-[var(--accent-light)]"
                      : "border-[var(--card-border)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)]/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[var(--text-primary)]">
                        {cert.name}
                      </span>
                      <span className="text-[var(--text-secondary)] ml-2">
                        {cert.fullName}
                      </span>
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">
                      {cert.domains.length} domains
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Timeline */}
        {step === 2 && (
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
            <button
              onClick={() => setStep(1)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 flex items-center gap-1"
            >
              ← Back
            </button>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              How many weeks until your exam?
            </h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Recommended: 4-8 weeks for optimal preparation
            </p>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[var(--text-primary)]">Timeline</span>
                  <span className="font-semibold text-[var(--accent)]">
                    {weeks} weeks
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="16"
                  value={weeks}
                  onChange={(e) => setWeeks(parseInt(e.target.value))}
                  className="w-full h-2 bg-[var(--card-border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                />
                <div className="flex justify-between text-sm text-[var(--text-secondary)] mt-1">
                  <span>2 weeks (intensive)</span>
                  <span>16 weeks (relaxed)</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[4, 6, 8, 12].map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeeks(w)}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      weeks === w
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)]"
                    }`}
                  >
                    {w} weeks
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Hours per week */}
        {step === 3 && (
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
            <button
              onClick={() => setStep(2)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 flex items-center gap-1"
            >
              ← Back
            </button>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              How many hours can you study per week?
            </h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Be realistic — consistency beats intensity
            </p>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[var(--text-primary)]">
                    Hours per week
                  </span>
                  <span className="font-semibold text-[var(--accent)]">
                    {hoursPerWeek} hours
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="30"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                  className="w-full h-2 bg-[var(--card-border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                />
                <div className="flex justify-between text-sm text-[var(--text-secondary)] mt-1">
                  <span>3 hrs (casual)</span>
                  <span>30 hrs (full-time)</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((h) => (
                  <button
                    key={h}
                    onClick={() => setHoursPerWeek(h)}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      hoursPerWeek === h
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)]"
                    }`}
                  >
                    {h} hrs
                  </button>
                ))}
              </div>

              {/* Summary before generating */}
              <div className="bg-[var(--accent-light)] rounded-xl p-4">
                <h3 className="font-medium text-[var(--text-primary)] mb-2">
                  Your Study Plan Summary
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">
                      Certification:
                    </span>
                    <span className="text-[var(--text-primary)] font-medium">
                      {selectedCert?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">
                      Duration:
                    </span>
                    <span className="text-[var(--text-primary)] font-medium">
                      {weeks} weeks
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">
                      Weekly commitment:
                    </span>
                    <span className="text-[var(--text-primary)] font-medium">
                      {hoursPerWeek} hours
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[var(--card-border)] pt-1 mt-2">
                    <span className="text-[var(--text-secondary)]">
                      Total study time:
                    </span>
                    <span className="text-[var(--accent)] font-semibold">
                      {weeks * hoursPerWeek} hours
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={generatePlan}
                className="w-full py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Generate My Study Plan
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Show Plan */}
        {step === 4 && studyPlan && (
          <div className="space-y-6">
            {/* Plan Header */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Your {studyPlan.certification.name} Study Plan
                </h2>
                <button
                  onClick={() => {
                    setStep(1);
                    setStudyPlan(null);
                  }}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm"
                >
                  Start Over
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--accent-light)] rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-[var(--accent)]">
                    {studyPlan.totalWeeks}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    Weeks
                  </div>
                </div>
                <div className="bg-[var(--accent-light)] rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-[var(--accent)]">
                    {studyPlan.hoursPerWeek}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    Hrs/Week
                  </div>
                </div>
                <div className="bg-[var(--accent-light)] rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-[var(--accent)]">
                    {studyPlan.totalHours}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    Total Hours
                  </div>
                </div>
                <div className="bg-[var(--accent-light)] rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-[var(--accent)]">
                    {studyPlan.certification.domains.length}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    Domains
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                <p className="text-green-700 dark:text-green-400 text-sm">
                  📅 Target exam date:{" "}
                  <strong>{studyPlan.examDate}</strong>
                </p>
              </div>
            </div>

            {/* Weekly Plans */}
            {studyPlan.weeks.map((week) => (
              <div
                key={week.week}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                        week.focus === "Learn"
                          ? "bg-blue-500"
                          : week.focus === "Practice"
                            ? "bg-orange-500"
                            : "bg-green-500"
                      }`}
                    >
                      {week.week}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">
                        Week {week.week}:{" "}
                        <span
                          className={
                            week.focus === "Learn"
                              ? "text-blue-500"
                              : week.focus === "Practice"
                                ? "text-orange-500"
                                : "text-green-500"
                          }
                        >
                          {week.focus}
                        </span>
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {week.totalHours} hours total
                      </p>
                    </div>
                  </div>
                </div>

                {/* Domains for this week */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Focus Areas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {week.domains.map((d) => (
                      <Link
                        key={d.slug}
                        href={`/${studyPlan.certification.slug}/topics/${d.slug}`}
                        className="px-3 py-1.5 bg-[var(--accent-light)] text-[var(--accent)] rounded-lg text-sm hover:opacity-80 transition-all"
                      >
                        {d.name}{" "}
                        <span className="opacity-70">({d.hours}h)</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                    This Week&apos;s Activities
                  </h4>
                  <ul className="space-y-1">
                    {week.activities.map((activity, i) => (
                      <li
                        key={i}
                        className="text-sm text-[var(--text-primary)]"
                      >
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="bg-[var(--accent-light)] border border-[var(--accent)]/30 rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Ready to start practicing?
              </h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Get instant access to {studyPlan.certification.name} practice
                questions across all exam domains.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/${studyPlan.certification.slug}/practice-questions/free`}
                  className="px-6 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] rounded-xl font-medium hover:border-[var(--accent)] transition-all"
                >
                  Try Free Questions
                </Link>
                <Link
                  href={`/${studyPlan.certification.slug}`}
                  className="px-6 py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-all"
                >
                  Start {studyPlan.certification.name} Prep →
                </Link>
              </div>
            </div>

            {/* Share/Export buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  const text = `My ${studyPlan.certification.name} Study Plan:\n\n${studyPlan.weeks.map((w) => `Week ${w.week} (${w.focus}): ${w.domains.map((d) => d.name).join(", ")}`).join("\n")}\n\nGenerated at snready.com/study-plan`;
                  navigator.clipboard.writeText(text);
                  alert("Plan copied to clipboard!");
                }}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                Copy to Clipboard
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `${studyPlan.certification.name} Study Plan`,
                      text: `Check out my ${studyPlan.totalWeeks}-week study plan for ${studyPlan.certification.fullName}`,
                      url: window.location.href,
                    });
                  }
                }}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
