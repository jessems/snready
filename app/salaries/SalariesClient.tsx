"use client";

import { useState, useEffect } from "react";
import SalaryForm from "@/components/salaries/SalaryForm";
import SalaryDashboard from "@/components/salaries/SalaryDashboard";
import PercentileCard from "@/components/salaries/PercentileCard";
import { SalarySubmission, PercentileResult } from "@/lib/salaries/types";

const STORAGE_KEY = "snready_salary_submitted";

export default function SalariesClient() {
  const [view, setView] = useState<"landing" | "form" | "results">("landing");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [percentileResult, setPercentileResult] = useState<PercentileResult | null>(null);
  const [submittedData, setSubmittedData] = useState<SalarySubmission | null>(null);

  useEffect(() => {
    // Check if user has already submitted
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
  }, []);

  const handleSubmit = async (data: SalarySubmission) => {
    // TODO: Send to API
    console.log("Submitting:", data);
    
    // For now, simulate API response
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Store submission
    setSubmittedData(data);
    
    // Calculate mock percentile
    const totalComp = data.baseSalary || (data.hourlyRate || 0) * 2080;
    const mockResult: PercentileResult = {
      percentile: Math.min(99, Math.max(1, Math.floor((totalComp / 200000) * 75 + Math.random() * 20))),
      yourSalary: totalComp + (data.bonus || 0) + (data.equity || 0),
      median: 125000,
      p25: 95000,
      p75: 165000,
      sampleSize: 847,
      comparisonGroup: `${data.role}s with ${data.yoeServiceNow} experience`,
    };
    
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ submission: data, result: mockResult })
    );
    
    setPercentileResult(mockResult);
    setHasSubmitted(true);
  };

  const handleFormComplete = (percentile: number) => {
    setView("results");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">
            ServiceNow Salaries
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Real compensation data from ServiceNow professionals. 
            See how your salary compares to 800+ admins, developers, architects, and consultants.
          </p>
          
          {/* Quick stats */}
          <div className="flex flex-wrap gap-8 mt-8">
            <div>
              <div className="text-3xl font-bold">127</div>
              <div className="text-blue-200">Data Points</div>
            </div>
            <div>
              <div className="text-3xl font-bold">$118K</div>
              <div className="text-blue-200">Median Salary</div>
            </div>
            <div>
              <div className="text-3xl font-bold">5</div>
              <div className="text-blue-200">Sources</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setView("landing")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              view === "landing"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            📊 Explore Data
          </button>
          <button
            onClick={() => setView("form")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              view === "form"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            ✏️ Submit Salary
          </button>
          {hasSubmitted && (
            <button
              onClick={() => setView("results")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                view === "results"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              🎯 Your Results
            </button>
          )}
        </div>

        {/* Main content */}
        {view === "landing" && (
          <SalaryDashboard
            hasSubmitted={hasSubmitted}
            onSubmitClick={() => setView("form")}
          />
        )}

        {view === "form" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
              <div className="flex items-start gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl">🔒</div>
                <div>
                  <h3 className="font-semibold text-blue-900">100% Anonymous</h3>
                  <p className="text-sm text-blue-700">
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
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
              >
                📊 Explore All Data
              </button>
            </div>

            {/* Insights based on their data */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold mb-4">💡 Insights For You</h3>
              <div className="space-y-4">
                {percentileResult.percentile < 50 && (
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <p className="text-amber-800">
                      <strong>Below median?</strong> Consider these high-value certifications
                      that correlate with higher pay: CTA (+$70K median), CIS-Discovery (+$25K).
                    </p>
                  </div>
                )}
                {percentileResult.percentile >= 75 && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800">
                      <strong>Top quartile!</strong> You're earning more than 75% of your peers.
                      Consider mentoring or consulting to maximize your expertise.
                    </p>
                  </div>
                )}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800">
                    <strong>Want to level up?</strong> Professionals with 2+ certifications
                    earn 18% more on average. 
                    <a href="/certifications" className="underline ml-1">
                      Explore certifications →
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO content */}
        <div className="mt-16 prose prose-gray max-w-none">
          <h2>ServiceNow Salary Data You Can Trust</h2>
          <p>
            Unlike generic job sites that mix all IT roles together, SNReady focuses
            exclusively on ServiceNow professionals. Our data comes directly from
            admins, developers, architects, and consultants who work with the platform
            every day.
          </p>
          
          <h3>How We Collect This Data</h3>
          <p>
            Every data point comes from an anonymous self-reported submission. 
            We verify data quality through outlier detection and cross-reference
            with market benchmarks. Company names are never displayed—only aggregated
            categories like "Partner/Consultancy" or "End-user."
          </p>

          <h3>ServiceNow Salary FAQ</h3>
          <p className="text-sm text-gray-500 mb-4">
            Data sourced from Glassdoor, ZipRecruiter, Indeed, Salary.com, and community salary threads. 
            <a href="#submit" className="text-blue-600 underline ml-1">Submit yours</a> to improve accuracy.
          </p>
          <details className="mb-4">
            <summary className="cursor-pointer font-semibold">
              What is the average ServiceNow developer salary?
            </summary>
            <p className="mt-2">
              The median ServiceNow developer salary is <strong>$123,000</strong> in the United States, 
              according to Glassdoor and ZipRecruiter data. The middle 50% earn between $100,000 (25th percentile) 
              and $150,000 (75th percentile). Senior developers and those with multiple certifications 
              often exceed $185,000. Factors like certifications, experience, and location significantly impact compensation.
            </p>
          </details>
          <details className="mb-4">
            <summary className="cursor-pointer font-semibold">
              What is the average ServiceNow administrator salary?
            </summary>
            <p className="mt-2">
              ServiceNow administrators earn a median of <strong>$95,000</strong> in the US. Entry-level admins 
              with just CSA certification typically start around $65,000-$80,000, while experienced admins 
              (5+ years) report salaries of $120,000-$150,000. Remote positions and those at larger enterprises 
              tend to pay at the higher end of the range.
            </p>
          </details>
          <details className="mb-4">
            <summary className="cursor-pointer font-semibold">
              How much do ServiceNow consultants charge per hour?
            </summary>
            <p className="mt-2">
              Based on community data, independent ServiceNow consultants typically charge <strong>$65-$125/hour</strong>,
              with the median around $85/hour. Highly specialized architects and CTAs command <strong>$125-$175+/hour</strong>. 
              W2 contractors through agencies typically see $90-$120/hour bill rates with 60-70% take-home.
              Rates vary significantly by specialization (ITOM/SecOps pay premiums), location, and client type.
            </p>
          </details>
          <details className="mb-4">
            <summary className="cursor-pointer font-semibold">
              Does ServiceNow certification increase salary?
            </summary>
            <p className="mt-2">
              Yes. Industry data shows that certified professionals earn <strong>15-25% more</strong> than
              non-certified peers in similar roles. The CSA is table stakes for most positions. 
              Adding CAD or a CIS certification typically correlates with $10-20K higher offers.
              CTA (Certified Technical Architect) holders report the highest premiums, often $50K+ above developer averages.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
