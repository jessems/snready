"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Metadata } from "next";

// Salary data based on industry reports, Glassdoor, LinkedIn, Indeed (2024-2025)
// All figures in USD, annual salary
const SALARY_DATA = {
  roles: {
    admin: {
      name: "ServiceNow Administrator",
      slug: "admin",
      baseSalary: { min: 65000, mid: 85000, max: 115000 },
      certBonus: { CSA: 8000, "CIS-ITSM": 10000, "CIS-DF": 8000 },
    },
    developer: {
      name: "ServiceNow Developer",
      slug: "developer",
      baseSalary: { min: 80000, mid: 105000, max: 140000 },
      certBonus: { CAD: 12000, CSA: 5000, "CIS-DF": 8000 },
    },
    architect: {
      name: "ServiceNow Architect",
      slug: "architect",
      baseSalary: { min: 120000, mid: 155000, max: 200000 },
      certBonus: { CMA: 20000, CTA: 25000, CAD: 8000, CSA: 3000 },
    },
    consultant: {
      name: "ServiceNow Consultant",
      slug: "consultant",
      baseSalary: { min: 85000, mid: 115000, max: 155000 },
      certBonus: { CSA: 8000, CAD: 10000, "CIS-ITSM": 12000, "CIS-CSM": 12000 },
    },
    manager: {
      name: "ServiceNow Manager/Lead",
      slug: "manager",
      baseSalary: { min: 110000, mid: 140000, max: 180000 },
      certBonus: { CSA: 5000, CIS: 8000 },
    },
    analyst: {
      name: "ServiceNow Business Analyst",
      slug: "analyst",
      baseSalary: { min: 70000, mid: 90000, max: 120000 },
      certBonus: { CSA: 10000, "CIS-ITSM": 8000 },
    },
  },
  experienceMultiplier: {
    "0-1": 0.85,
    "1-3": 0.95,
    "3-5": 1.0,
    "5-8": 1.15,
    "8+": 1.30,
  },
  locationMultiplier: {
    us_sf: { name: "San Francisco Bay Area", multiplier: 1.35 },
    us_nyc: { name: "New York City", multiplier: 1.25 },
    us_seattle: { name: "Seattle", multiplier: 1.20 },
    us_la: { name: "Los Angeles", multiplier: 1.15 },
    us_austin: { name: "Austin", multiplier: 1.10 },
    us_chicago: { name: "Chicago", multiplier: 1.05 },
    us_denver: { name: "Denver", multiplier: 1.05 },
    us_atlanta: { name: "Atlanta", multiplier: 1.0 },
    us_other: { name: "US - Other Cities", multiplier: 0.95 },
    uk_london: { name: "London, UK", multiplier: 0.90 },
    uk_other: { name: "UK - Other Cities", multiplier: 0.75 },
    eu_west: { name: "Western Europe", multiplier: 0.85 },
    eu_east: { name: "Eastern Europe", multiplier: 0.55 },
    canada: { name: "Canada", multiplier: 0.85 },
    australia: { name: "Australia", multiplier: 0.90 },
    india: { name: "India", multiplier: 0.25 },
    remote: { name: "Remote (US-based)", multiplier: 1.0 },
  },
  certifications: [
    { id: "CSA", name: "Certified System Administrator", weight: 1.0 },
    { id: "CAD", name: "Certified Application Developer", weight: 1.2 },
    { id: "CIS-ITSM", name: "CIS - IT Service Management", weight: 1.1 },
    { id: "CIS-DF", name: "CIS - Data Foundations (CMDB)", weight: 1.1 },
    { id: "CIS-CSM", name: "CIS - Customer Service Management", weight: 1.1 },
    { id: "CIS-HR", name: "CIS - HR Service Delivery", weight: 1.1 },
    { id: "CIS-Discovery", name: "CIS - Discovery", weight: 1.15 },
    { id: "CIS-SAM", name: "CIS - Software Asset Management", weight: 1.1 },
    { id: "CIS-HAM", name: "CIS - Hardware Asset Management", weight: 1.05 },
    { id: "CIS-PA", name: "CIS - Performance Analytics", weight: 1.15 },
    { id: "CIS-SM", name: "CIS - Service Mapping", weight: 1.2 },
    { id: "CMA", name: "Certified Master Architect", weight: 1.5 },
    { id: "CTA", name: "Certified Technical Architect", weight: 1.4 },
  ],
};

type RoleKey = keyof typeof SALARY_DATA.roles;
type ExperienceKey = keyof typeof SALARY_DATA.experienceMultiplier;
type LocationKey = keyof typeof SALARY_DATA.locationMultiplier;

interface SalaryResult {
  baseSalary: { min: number; mid: number; max: number };
  certBonus: number;
  experienceAdjusted: { min: number; mid: number; max: number };
  locationAdjusted: { min: number; mid: number; max: number };
  totalWithCerts: { min: number; mid: number; max: number };
  withoutCerts: { min: number; mid: number; max: number };
  certPremium: number;
  certPremiumPercent: number;
}

function formatSalary(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function calculateSalary(
  role: RoleKey,
  experience: ExperienceKey,
  location: LocationKey,
  certifications: string[]
): SalaryResult {
  const roleData = SALARY_DATA.roles[role];
  const expMultiplier = SALARY_DATA.experienceMultiplier[experience];
  const locMultiplier = SALARY_DATA.locationMultiplier[location].multiplier;

  // Calculate certification bonus (diminishing returns after first cert)
  let certBonus = 0;
  const certBonuses = roleData.certBonus as Record<string, number>;
  certifications.forEach((cert, index) => {
    const bonus = certBonuses[cert] || 5000; // Default bonus for unlisted certs
    // Diminishing returns: 100% for first, 60% for second, 40% for third, etc.
    const multiplier = index === 0 ? 1 : index === 1 ? 0.6 : index === 2 ? 0.4 : 0.2;
    certBonus += bonus * multiplier;
  });

  // Apply multipliers
  const baseSalary = roleData.baseSalary;
  const experienceAdjusted = {
    min: Math.round(baseSalary.min * expMultiplier),
    mid: Math.round(baseSalary.mid * expMultiplier),
    max: Math.round(baseSalary.max * expMultiplier),
  };

  const locationAdjusted = {
    min: Math.round(experienceAdjusted.min * locMultiplier),
    mid: Math.round(experienceAdjusted.mid * locMultiplier),
    max: Math.round(experienceAdjusted.max * locMultiplier),
  };

  // Apply cert bonus to location-adjusted salary
  const certBonusAdjusted = Math.round(certBonus * locMultiplier);
  const totalWithCerts = {
    min: locationAdjusted.min + certBonusAdjusted,
    mid: locationAdjusted.mid + certBonusAdjusted,
    max: locationAdjusted.max + certBonusAdjusted,
  };

  const certPremium = certBonusAdjusted;
  const certPremiumPercent = locationAdjusted.mid > 0 
    ? Math.round((certBonusAdjusted / locationAdjusted.mid) * 100) 
    : 0;

  return {
    baseSalary,
    certBonus: certBonusAdjusted,
    experienceAdjusted,
    locationAdjusted,
    totalWithCerts,
    withoutCerts: locationAdjusted,
    certPremium,
    certPremiumPercent,
  };
}

export default function SalaryCalculatorPage() {
  const [role, setRole] = useState<RoleKey>("developer");
  const [experience, setExperience] = useState<ExperienceKey>("3-5");
  const [location, setLocation] = useState<LocationKey>("us_other");
  const [selectedCerts, setSelectedCerts] = useState<string[]>(["CSA"]);
  const [showResults, setShowResults] = useState(false);

  const toggleCert = (certId: string) => {
    setSelectedCerts((prev) =>
      prev.includes(certId)
        ? prev.filter((c) => c !== certId)
        : [...prev, certId]
    );
  };

  const result = useMemo(() => {
    return calculateSalary(role, experience, location, selectedCerts);
  }, [role, experience, location, selectedCerts]);

  const handleCalculate = () => {
    setShowResults(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            💰 ServiceNow Salary Calculator
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Discover your earning potential. See how certifications, experience, and location affect your ServiceNow salary.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Calculator Inputs */}
          <div className="space-y-6">
            {/* Role Selection */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">👔</span> Your Role
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(SALARY_DATA.roles).map(([key, roleData]) => (
                  <button
                    key={key}
                    onClick={() => setRole(key as RoleKey)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      role === key
                        ? "bg-emerald-600 border-emerald-500"
                        : "bg-gray-700/50 border-gray-600 hover:border-gray-500"
                    } border`}
                  >
                    <span className="text-sm font-medium">{roleData.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">📈</span> Experience Level
              </h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(SALARY_DATA.experienceMultiplier).map(([key, _]) => {
                  const labels: Record<string, string> = {
                    "0-1": "0-1 years",
                    "1-3": "1-3 years",
                    "3-5": "3-5 years",
                    "5-8": "5-8 years",
                    "8+": "8+ years",
                  };
                  return (
                    <button
                      key={key}
                      onClick={() => setExperience(key as ExperienceKey)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        experience === key
                          ? "bg-emerald-600 border-emerald-500"
                          : "bg-gray-700/50 border-gray-600 hover:border-gray-500"
                      } border`}
                    >
                      {labels[key]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">📍</span> Location
              </h2>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value as LocationKey)}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                <optgroup label="United States">
                  <option value="us_sf">San Francisco Bay Area</option>
                  <option value="us_nyc">New York City</option>
                  <option value="us_seattle">Seattle</option>
                  <option value="us_la">Los Angeles</option>
                  <option value="us_austin">Austin</option>
                  <option value="us_chicago">Chicago</option>
                  <option value="us_denver">Denver</option>
                  <option value="us_atlanta">Atlanta</option>
                  <option value="us_other">US - Other Cities</option>
                  <option value="remote">Remote (US-based)</option>
                </optgroup>
                <optgroup label="United Kingdom">
                  <option value="uk_london">London</option>
                  <option value="uk_other">UK - Other Cities</option>
                </optgroup>
                <optgroup label="Other Regions">
                  <option value="eu_west">Western Europe</option>
                  <option value="eu_east">Eastern Europe</option>
                  <option value="canada">Canada</option>
                  <option value="australia">Australia</option>
                  <option value="india">India</option>
                </optgroup>
              </select>
            </div>

            {/* Certifications */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🏅</span> Certifications Held
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Select all certifications you have (or plan to get)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SALARY_DATA.certifications.map((cert) => (
                  <button
                    key={cert.id}
                    onClick={() => toggleCert(cert.id)}
                    className={`p-2 rounded-lg text-left text-sm transition-all ${
                      selectedCerts.includes(cert.id)
                        ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                        : "bg-gray-700/30 border-gray-600 hover:border-gray-500 text-gray-300"
                    } border`}
                  >
                    <span className="mr-2">
                      {selectedCerts.includes(cert.id) ? "✓" : "○"}
                    </span>
                    {cert.id}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-emerald-500/20"
            >
              Calculate My Salary →
            </button>
          </div>

          {/* Right: Results */}
          <div className="space-y-6">
            {showResults ? (
              <>
                {/* Main Salary Display */}
                <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-xl p-6 border border-emerald-500/30">
                  <h2 className="text-lg text-emerald-300 mb-2">Your Estimated Salary</h2>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {formatSalary(result.totalWithCerts.mid)}
                  </div>
                  <div className="text-gray-400">
                    Range: {formatSalary(result.totalWithCerts.min)} – {formatSalary(result.totalWithCerts.max)}
                  </div>
                </div>

                {/* Certification Premium */}
                {result.certPremium > 0 && (
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span className="text-2xl">🎓</span> Certification Premium
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-emerald-400">
                        +{formatSalary(result.certPremium)}
                      </div>
                      <div className="text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full text-sm">
                        +{result.certPremiumPercent}% more
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-3">
                      Your {selectedCerts.length} certification{selectedCerts.length > 1 ? "s" : ""} add{selectedCerts.length === 1 ? "s" : ""} significant value to your compensation.
                    </p>
                  </div>
                )}

                {/* Comparison */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Salary Comparison</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Without Certifications</span>
                        <span>{formatSalary(result.withoutCerts.mid)}</span>
                      </div>
                      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-500 rounded-full"
                          style={{
                            width: `${(result.withoutCerts.mid / result.totalWithCerts.max) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-emerald-300 mb-1">
                        <span>With Your Certifications</span>
                        <span>{formatSalary(result.totalWithCerts.mid)}</span>
                      </div>
                      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          style={{
                            width: `${(result.totalWithCerts.mid / result.totalWithCerts.max) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Insights */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">💡 Key Insights</h3>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>
                        <strong>{SALARY_DATA.roles[role].name}</strong> roles in{" "}
                        <strong>{SALARY_DATA.locationMultiplier[location].name}</strong> typically earn{" "}
                        {SALARY_DATA.locationMultiplier[location].multiplier >= 1.1
                          ? "above average"
                          : SALARY_DATA.locationMultiplier[location].multiplier >= 0.9
                          ? "average"
                          : "below average"}{" "}
                        compared to US national rates.
                      </span>
                    </li>
                    {selectedCerts.length > 0 && (
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span>
                          Certified professionals earn <strong>{result.certPremiumPercent}% more</strong> on average than non-certified peers.
                        </span>
                      </li>
                    )}
                    {!selectedCerts.includes("CSA") && (
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-0.5">•</span>
                        <span>
                          <strong>Tip:</strong> The CSA certification is the foundation for most ServiceNow careers. Consider starting there.
                        </span>
                      </li>
                    )}
                    {experience === "0-1" && (
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>
                          Entry-level salaries grow quickly with experience. Expect 15-20% increases in your first few years.
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    🚀 Ready to Boost Your Salary?
                  </h3>
                  <p className="text-emerald-100 mb-4">
                    Start preparing for your next certification today. Our practice tests help you pass on the first try.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/certifications"
                      className="inline-flex items-center px-5 py-2.5 bg-white text-emerald-700 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                    >
                      Browse Practice Tests
                    </Link>
                    <Link
                      href="/quiz"
                      className="inline-flex items-center px-5 py-2.5 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition-all border border-emerald-500"
                    >
                      Find My Cert
                    </Link>
                  </div>
                </div>

                {/* Share */}
                <div className="text-center text-sm text-gray-500">
                  <button
                    onClick={() => {
                      const text = `My estimated ServiceNow ${SALARY_DATA.roles[role].name} salary: ${formatSalary(result.totalWithCerts.mid)} 💰\n\nCheck yours: https://snready.com/salary-calculator`;
                      if (navigator.share) {
                        navigator.share({ text });
                      } else {
                        navigator.clipboard.writeText(text);
                        alert("Copied to clipboard!");
                      }
                    }}
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    📤 Share your results
                  </button>
                </div>
              </>
            ) : (
              /* Placeholder before calculation */
              <div className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/50 text-center">
                <div className="text-6xl mb-4">💵</div>
                <h3 className="text-xl font-semibold mb-2">
                  Configure Your Profile
                </h3>
                <p className="text-gray-400">
                  Select your role, experience, location, and certifications to see your estimated salary.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section for SEO */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
              <summary className="font-semibold cursor-pointer">
                How much does a ServiceNow developer make?
              </summary>
              <p className="mt-3 text-gray-400">
                ServiceNow developers earn an average of $105,000/year in the US, with a range from $80,000 to $140,000+ depending on experience and location. Certified developers (CAD) typically earn 10-15% more than non-certified peers.
              </p>
            </details>
            <details className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
              <summary className="font-semibold cursor-pointer">
                Do ServiceNow certifications increase salary?
              </summary>
              <p className="mt-3 text-gray-400">
                Yes, significantly. On average, certified ServiceNow professionals earn 10-20% more than their non-certified counterparts. The CSA certification alone can add $8,000-$12,000 to your annual salary, while specialized certifications (CIS, CAD) can add even more.
              </p>
            </details>
            <details className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
              <summary className="font-semibold cursor-pointer">
                Which ServiceNow certification pays the most?
              </summary>
              <p className="mt-3 text-gray-400">
                The Certified Master Architect (CMA) and Certified Technical Architect (CTA) certifications command the highest premiums, often adding $20,000-$25,000+ to base salary. For implementation specialists, CIS-Service Mapping and CIS-Discovery are among the highest-paying due to their complexity.
              </p>
            </details>
            <details className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
              <summary className="font-semibold cursor-pointer">
                How accurate is this salary calculator?
              </summary>
              <p className="mt-3 text-gray-400">
                This calculator uses aggregated data from job postings, salary surveys, and industry reports (Glassdoor, LinkedIn, Indeed, 2024-2025). Actual salaries vary based on company size, industry, specific skills, negotiation, and market conditions. Use these figures as a general guide, not a guarantee.
              </p>
            </details>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">
            Ready to increase your earning potential?
          </p>
          <Link
            href="/study-plan"
            className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold transition-all"
          >
            📅 Create Your Study Plan
          </Link>
        </div>
      </div>
    </main>
  );
}
