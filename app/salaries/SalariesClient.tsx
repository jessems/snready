"use client";

import { useState, useEffect } from "react";
import SalaryForm from "@/components/salaries/SalaryForm";
import SalaryDashboard from "@/components/salaries/SalaryDashboard";
import PercentileCard from "@/components/salaries/PercentileCard";
import { SalarySubmission, PercentileResult } from "@/lib/salaries/types";

const STORAGE_KEY = "snready_salary_submitted";

interface HeroStats {
  count: number;
  median: number;
  countries: number;
}

export default function SalariesClient() {
  const [view, setView] = useState<"landing" | "form" | "results">("landing");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [percentileResult, setPercentileResult] = useState<PercentileResult | null>(null);
  const [submittedData, setSubmittedData] = useState<SalarySubmission | null>(null);
  const [heroStats, setHeroStats] = useState<HeroStats>({ count: 200, median: 100000, countries: 17 });

  useEffect(() => {
    const submitted = localStorage.getItem(STORAGE_KEY);
    if (submitted) {
      setHasSubmitted(true);
      try {
        const data = JSON.parse(submitted);
        setSubmittedData(data.submission);
        setPercentileResult(data.result);
      } catch {
        // Invalid stored data, ignore
      }
    }
    
    // Fetch live stats for hero
    fetch('/api/salaries/stats')
      .then(res => res.json())
      .then(data => {
        if (data.overall) {
          setHeroStats({
            count: data.overall.count,
            median: data.overall.median,
            countries: data.overall.countries || 17
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (data: SalarySubmission) => {
    const response = await fetch('/api/salaries/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: data.role,
        baseSalary: data.baseSalary,
        bonus: data.bonus,
        equity: data.equity,
        hourlyRate: data.hourlyRate,
        employmentType: data.employmentType,
        yoeServiceNow: data.yoeServiceNow,
        yoeTotal: typeof data.yoeTotal === 'string' ? parseInt(data.yoeTotal) || null : data.yoeTotal,
        certifications: data.certifications,
        education: null,
        country: data.country,
        city: data.city,
        remotePct: data.remotePct,
        companyType: data.companyType,
        companySize: data.companySize,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit salary');
    }

    setSubmittedData(data);

    const statsResponse = await fetch('/api/salaries/stats');
    const stats = await statsResponse.json();

    const totalComp = data.baseSalary || (data.hourlyRate || 0) * 2080;
    const roleStats = stats.byRole?.find((r: any) => r.role === data.role) || stats.overall;
    
    let percentile = 50;
    if (roleStats) {
      if (totalComp <= roleStats.p25) percentile = 25;
      else if (totalComp <= roleStats.median) percentile = 25 + ((totalComp - roleStats.p25) / (roleStats.median - roleStats.p25)) * 25;
      else if (totalComp <= roleStats.p75) percentile = 50 + ((totalComp - roleStats.median) / (roleStats.p75 - roleStats.median)) * 25;
      else percentile = 75 + Math.min(24, ((totalComp - roleStats.p75) / roleStats.p75) * 50);
    }

    const result: PercentileResult = {
      percentile: Math.round(Math.min(99, Math.max(1, percentile))),
      yourSalary: totalComp + (data.bonus || 0) + (data.equity || 0),
      median: roleStats?.median || stats.overall.median,
      p25: roleStats?.p25 || stats.overall.p25,
      p75: roleStats?.p75 || stats.overall.p75,
      sampleSize: roleStats?.count || stats.overall.count,
      comparisonGroup: `${data.role}s with ${data.yoeServiceNow} experience`,
    };
    
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ submission: data, result })
    );
    
    setPercentileResult(result);
    setHasSubmitted(true);
  };

  const handleFormComplete = () => {
    setView("results");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500" />
        </div>
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-blue-200 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Updated daily from real submissions</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              ServiceNow Salaries
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Real Data. Real People.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-8">
              Stop guessing what you're worth. See exactly what admins, developers, 
              architects, and consultants earn — straight from the source.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mb-12">
              <button
                onClick={() => setView("form")}
                className="px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg shadow-black/20 flex items-center gap-2"
              >
                <span>Add Your Salary</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={() => setView("landing")}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition border border-white/20"
              >
                Explore Data
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-lg">
              <div className="text-center md:text-left">
                <div className="text-3xl md:text-4xl font-bold text-white">{heroStats.count}</div>
                <div className="text-sm text-slate-400">Salaries</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-3xl md:text-4xl font-bold text-white">${Math.round(heroStats.median / 1000)}K</div>
                <div className="text-sm text-slate-400">Median</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-3xl md:text-4xl font-bold text-white">{heroStats.countries}</div>
                <div className="text-sm text-slate-400">Countries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(248 250 252)"/>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-slate-100 rounded-xl w-fit">
          <button
            onClick={() => setView("landing")}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
              view === "landing"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📊 Explore
          </button>
          <button
            onClick={() => setView("form")}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
              view === "form"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ✏️ Submit
          </button>
          {hasSubmitted && (
            <button
              onClick={() => setView("results")}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                view === "results"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🎯 Results
            </button>
          )}
        </div>

        {/* Main Content */}
        {view === "landing" && (
          <SalaryDashboard
            hasSubmitted={hasSubmitted}
            onSubmitClick={() => setView("form")}
          />
        )}

        {view === "form" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 mb-8">
              <div className="flex items-start gap-4 mb-8 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">100% Anonymous</h3>
                  <p className="text-sm text-slate-600">
                    Your individual data is never shown. We only display aggregates.
                    Company names are generalized (e.g., "Big 4 Partner").
                  </p>
                </div>
              </div>
              
              <SalaryForm
                onSubmit={handleSubmit}
                onComplete={handleFormComplete}
              />
            </div>
          </div>
        )}

        {view === "results" && percentileResult && (
          <div className="max-w-xl mx-auto space-y-8">
            <PercentileCard
              result={percentileResult}
              currency={submittedData?.currency || "USD"}
            />
            
            <div className="text-center">
              <button
                onClick={() => setView("landing")}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition"
              >
                📊 Explore All Data
              </button>
            </div>

            {/* Personalized Insights */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">💡</span>
                Insights For You
              </h3>
              <div className="space-y-4">
                {percentileResult.percentile < 50 && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-amber-800">
                      <strong>Below median?</strong> Consider these high-value certifications
                      that correlate with higher pay: CTA (+$70K median), CIS-Discovery (+$25K).
                    </p>
                  </div>
                )}
                {percentileResult.percentile >= 75 && (
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-green-800">
                      <strong>Top quartile!</strong> You're earning more than 75% of your peers.
                      Consider mentoring or consulting to maximize your expertise.
                    </p>
                  </div>
                )}
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-blue-800">
                    <strong>Want to level up?</strong> Professionals with 2+ certifications
                    earn 18% more on average. 
                    <a href="/certifications" className="underline ml-1 hover:text-blue-600">
                      Explore certifications →
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              ServiceNow Salary Data You Can Trust
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Unlike generic job sites that mix all IT roles together, SNReady focuses
              exclusively on ServiceNow professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Community Verified</h3>
              <p className="text-slate-600">
                Every data point comes from an anonymous self-reported submission. 
                We verify quality through outlier detection and cross-reference with benchmarks.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Privacy First</h3>
              <p className="text-slate-600">
                Company names are never displayed—only aggregated categories like 
                "Partner/Consultancy" or "End-user."
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-slate-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              ServiceNow Salary FAQ
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Data sourced from Glassdoor, ZipRecruiter, Indeed, Salary.com, and community salary threads. 
              <button onClick={() => setView("form")} className="text-blue-600 underline ml-1 hover:text-blue-700">
                Submit yours
              </button> to improve accuracy.
            </p>
            
            <div className="space-y-4">
              <details className="group bg-white rounded-xl p-4 shadow-sm">
                <summary className="cursor-pointer font-semibold text-slate-900 flex items-center justify-between">
                  What is the average ServiceNow developer salary?
                  <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  The median ServiceNow developer salary is <strong>$123,000</strong> in the United States, 
                  according to Glassdoor and ZipRecruiter data. The middle 50% earn between $100,000 (25th percentile) 
                  and $150,000 (75th percentile). Senior developers and those with multiple certifications 
                  often exceed $185,000.
                </p>
              </details>
              
              <details className="group bg-white rounded-xl p-4 shadow-sm">
                <summary className="cursor-pointer font-semibold text-slate-900 flex items-center justify-between">
                  What is the average ServiceNow administrator salary?
                  <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  ServiceNow administrators earn a median of <strong>$95,000</strong> in the US. Entry-level admins 
                  with just CSA certification typically start around $65,000-$80,000, while experienced admins 
                  (5+ years) report salaries of $120,000-$150,000.
                </p>
              </details>
              
              <details className="group bg-white rounded-xl p-4 shadow-sm">
                <summary className="cursor-pointer font-semibold text-slate-900 flex items-center justify-between">
                  How much do ServiceNow consultants charge per hour?
                  <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  Based on community data, independent ServiceNow consultants typically charge <strong>$65-$125/hour</strong>,
                  with the median around $85/hour. Highly specialized architects and CTAs command <strong>$125-$175+/hour</strong>. 
                  W2 contractors through agencies typically see $90-$120/hour bill rates with 60-70% take-home.
                </p>
              </details>
              
              <details className="group bg-white rounded-xl p-4 shadow-sm">
                <summary className="cursor-pointer font-semibold text-slate-900 flex items-center justify-between">
                  Does ServiceNow certification increase salary?
                  <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  Yes. Industry data shows that certified professionals earn <strong>15-25% more</strong> than
                  non-certified peers in similar roles. The CSA is table stakes for most positions. 
                  Adding CAD or a CIS certification typically correlates with $10-20K higher offers.
                  CTA holders report the highest premiums, often $50K+ above developer averages.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
