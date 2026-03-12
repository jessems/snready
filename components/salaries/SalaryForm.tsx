"use client";

import { useState } from "react";
import {
  ROLES,
  SPECIALIZATIONS,
  EMPLOYMENT_TYPES,
  COMPANY_TYPES,
  CERTIFICATIONS,
  EXPERIENCE_RANGES,
  COMPANY_SIZES,
  REMOTE_OPTIONS,
  CURRENCIES,
  SalarySubmission,
} from "@/lib/salaries/types";
import { COUNTRIES } from "@/lib/salaries/countries";

interface SalaryFormProps {
  onSubmit: (data: SalarySubmission) => Promise<void>;
  onComplete: (percentile: number) => void;
}

const STEPS = [
  { id: 1, name: "Role", icon: "👤" },
  { id: 2, name: "Compensation", icon: "💰" },
  { id: 3, name: "Background", icon: "📚" },
  { id: 4, name: "Location", icon: "📍" },
];

export default function SalaryForm({ onSubmit, onComplete }: SalaryFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<SalarySubmission>>({
    role: undefined,
    specializations: [],
    employmentType: undefined,
    companyType: undefined,
    currency: "USD",
    certifications: [],
    yoeServiceNow: undefined,
    yoeTotal: undefined,
    country: "",
    remotePct: 50,
  });

  const updateField = <K extends keyof SalarySubmission>(
    field: K,
    value: SalarySubmission[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (
    field: "specializations" | "certifications",
    item: string
  ) => {
    setFormData((prev) => {
      const current = (prev[field] as string[]) || [];
      if (current.includes(item)) {
        return { ...prev, [field]: current.filter((i) => i !== item) };
      }
      return { ...prev, [field]: [...current, item] };
    });
  };

  const isContractor = formData.employmentType?.includes("Contractor") || 
    formData.employmentType === "Freelance" ||
    formData.employmentType === "Independent (1099)";

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.role && formData.employmentType && formData.companyType;
      case 2:
        if (isContractor) {
          return formData.hourlyRate && formData.hourlyRate > 0;
        }
        return formData.baseSalary && formData.baseSalary > 0;
      case 3:
        return (
          formData.certifications &&
          formData.certifications.length > 0 &&
          formData.yoeServiceNow &&
          formData.yoeTotal
        );
      case 4:
        return formData.country;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData as SalarySubmission);
      onComplete(Math.floor(Math.random() * 40) + 50);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((s, index) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-medium transition-all ${
                    s.id === step
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : s.id < step
                      ? "bg-green-500 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {s.id < step ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.icon
                  )}
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  s.id === step ? 'text-blue-600' : s.id < step ? 'text-green-600' : 'text-slate-400'
                }`}>
                  {s.name}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`w-12 md:w-20 h-1 mx-2 rounded-full transition-colors ${
                  s.id < step ? 'bg-green-500' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Step 1: Role & Employment */}
      {step === 1 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Tell us about your role</h2>
            <p className="text-slate-500">This helps us compare you to similar professionals</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Primary Role <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => updateField("role", role)}
                  className={`p-4 text-left rounded-xl border-2 transition-all ${
                    formData.role === role
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className={`font-medium ${formData.role === role ? 'text-blue-700' : 'text-slate-700'}`}>
                    {role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Specializations <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => toggleArrayItem("specializations", spec)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.specializations?.includes(spec)
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Employment Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {EMPLOYMENT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateField("employmentType", type)}
                  className={`p-4 text-left rounded-xl border-2 transition-all ${
                    formData.employmentType === type
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className={`font-medium ${formData.employmentType === type ? 'text-blue-700' : 'text-slate-700'}`}>
                    {type}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Company Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {COMPANY_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateField("companyType", type)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    formData.companyType === type
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className={`font-medium ${formData.companyType === type ? 'text-blue-700' : 'text-slate-700'}`}>
                    {type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Compensation */}
      {step === 2 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Your compensation</h2>
            <p className="text-slate-500">All data is anonymous and aggregated</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => updateField("currency", e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.name}
                </option>
              ))}
            </select>
          </div>

          {isContractor ? (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Hourly Rate <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                  {CURRENCIES.find((c) => c.code === formData.currency)?.symbol}
                </span>
                <input
                  type="number"
                  value={formData.hourlyRate || ""}
                  onChange={(e) => updateField("hourlyRate", parseInt(e.target.value) || 0)}
                  placeholder="95"
                  className="w-full p-4 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  /hour
                </span>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Base Salary (Annual) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    {CURRENCIES.find((c) => c.code === formData.currency)?.symbol}
                  </span>
                  <input
                    type="number"
                    value={formData.baseSalary || ""}
                    onChange={(e) => updateField("baseSalary", parseInt(e.target.value) || 0)}
                    placeholder="120,000"
                    className="w-full p-4 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Annual Bonus <span className="text-slate-400 font-normal">(target)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      {CURRENCIES.find((c) => c.code === formData.currency)?.symbol}
                    </span>
                    <input
                      type="number"
                      value={formData.bonus || ""}
                      onChange={(e) => updateField("bonus", parseInt(e.target.value) || 0)}
                      placeholder="15,000"
                      className="w-full p-4 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Equity/Stock <span className="text-slate-400 font-normal">(annual)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      {CURRENCIES.find((c) => c.code === formData.currency)?.symbol}
                    </span>
                    <input
                      type="number"
                      value={formData.equity || ""}
                      onChange={(e) => updateField("equity", parseInt(e.target.value) || 0)}
                      placeholder="10,000"
                      className="w-full p-4 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 3: Background */}
      {step === 3 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Your background</h2>
            <p className="text-slate-500">Certifications and experience level</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              ServiceNow Certifications <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl">
              {CERTIFICATIONS.map((cert) => (
                <button
                  key={cert}
                  type="button"
                  onClick={() => toggleArrayItem("certifications", cert)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    formData.certifications?.includes(cert)
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
                  }`}
                >
                  {cert}
                </button>
              ))}
            </div>
            {formData.certifications && formData.certifications.length > 0 && (
              <p className="text-sm text-slate-500 mt-2">
                {formData.certifications.length} selected
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Years of ServiceNow Experience <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {EXPERIENCE_RANGES.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => updateField("yoeServiceNow", range)}
                  className={`p-3 text-center rounded-xl border-2 transition-all ${
                    formData.yoeServiceNow === range
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className={`font-medium text-sm ${formData.yoeServiceNow === range ? 'text-blue-700' : 'text-slate-700'}`}>
                    {range}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Years of Total IT Experience <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {EXPERIENCE_RANGES.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => updateField("yoeTotal", range)}
                  className={`p-3 text-center rounded-xl border-2 transition-all ${
                    formData.yoeTotal === range
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className={`font-medium text-sm ${formData.yoeTotal === range ? 'text-blue-700' : 'text-slate-700'}`}>
                    {range}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Location */}
      {step === 4 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Location & company details</h2>
            <p className="text-slate-500">Final step — almost there!</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.country}
              onChange={(e) => updateField("country", e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">Select country...</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              City/Region <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.city || ""}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="San Francisco"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Remote Work</label>
            <div className="grid grid-cols-2 gap-3">
              {REMOTE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField("remotePct", opt.value)}
                  className={`p-4 text-left rounded-xl border-2 transition-all ${
                    formData.remotePct === opt.value
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className={`font-medium ${formData.remotePct === opt.value ? 'text-blue-700' : 'text-slate-700'}`}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Company Name <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={formData.companyName || ""}
                onChange={(e) => updateField("companyName", e.target.value)}
                placeholder="Accenture"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <p className="text-xs text-slate-400 mt-2">
                Shown as company type only, never specific name
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Company Size <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <select
                value={formData.companySize || ""}
                onChange={(e) => updateField("companySize", e.target.value as typeof COMPANY_SIZES[number])}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">Select size...</option>
                {COMPANY_SIZES.map((size) => (
                  <option key={size} value={size}>{size} employees</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-10 pt-6 border-t border-slate-200">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium text-slate-700 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition ${
              canProceed()
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            Continue
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canProceed() || loading}
            className={`px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition ${
              canProceed() && !loading
                ? "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit & See Results
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
