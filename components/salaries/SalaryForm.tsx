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
      // Mock percentile for now
      onComplete(Math.floor(Math.random() * 40) + 50);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                s === step
                  ? "bg-blue-600 text-white"
                  : s < step
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {s < step ? "✓" : s}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Step 1: Role & Employment */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your Role</h2>

          <div>
            <label className="block text-sm font-medium mb-2">
              Primary Role *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => updateField("role", role)}
                  className={`p-3 text-left rounded-lg border-2 transition ${
                    formData.role === role
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Specializations (select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => toggleArrayItem("specializations", spec)}
                  className={`px-3 py-1.5 rounded-full text-sm transition ${
                    formData.specializations?.includes(spec)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Employment Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EMPLOYMENT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateField("employmentType", type)}
                  className={`p-3 text-left rounded-lg border-2 transition ${
                    formData.employmentType === type
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Company Type *
            </label>
            <div className="space-y-2">
              {COMPANY_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateField("companyType", type)}
                  className={`w-full p-3 text-left rounded-lg border-2 transition ${
                    formData.companyType === type
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Compensation */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Compensation</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => updateField("currency", e.target.value)}
              className="w-full p-3 border rounded-lg"
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
              <label className="block text-sm font-medium mb-2">
                Hourly Rate *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">
                  {CURRENCIES.find((c) => c.code === formData.currency)?.symbol}
                </span>
                <input
                  type="number"
                  value={formData.hourlyRate || ""}
                  onChange={(e) =>
                    updateField("hourlyRate", parseInt(e.target.value) || 0)
                  }
                  placeholder="95"
                  className="w-full p-3 pl-8 border rounded-lg"
                />
                <span className="absolute right-3 top-3 text-gray-500">
                  /hour
                </span>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Base Salary (Annual) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">
                    {CURRENCIES.find((c) => c.code === formData.currency)?.symbol}
                  </span>
                  <input
                    type="number"
                    value={formData.baseSalary || ""}
                    onChange={(e) =>
                      updateField("baseSalary", parseInt(e.target.value) || 0)
                    }
                    placeholder="120000"
                    className="w-full p-3 pl-8 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Annual Bonus (Target)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">
                    {CURRENCIES.find((c) => c.code === formData.currency)?.symbol}
                  </span>
                  <input
                    type="number"
                    value={formData.bonus || ""}
                    onChange={(e) =>
                      updateField("bonus", parseInt(e.target.value) || 0)
                    }
                    placeholder="15000"
                    className="w-full p-3 pl-8 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Equity/Stock (Annual Value)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">
                    {CURRENCIES.find((c) => c.code === formData.currency)?.symbol}
                  </span>
                  <input
                    type="number"
                    value={formData.equity || ""}
                    onChange={(e) =>
                      updateField("equity", parseInt(e.target.value) || 0)
                    }
                    placeholder="10000"
                    className="w-full p-3 pl-8 border rounded-lg"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 3: Background */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your Background</h2>

          <div>
            <label className="block text-sm font-medium mb-2">
              ServiceNow Certifications *
            </label>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
              {CERTIFICATIONS.map((cert) => (
                <button
                  key={cert}
                  type="button"
                  onClick={() => toggleArrayItem("certifications", cert)}
                  className={`px-3 py-1.5 rounded-full text-sm transition ${
                    formData.certifications?.includes(cert)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {cert}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Years of ServiceNow Experience *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {EXPERIENCE_RANGES.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => updateField("yoeServiceNow", range)}
                  className={`p-3 text-center rounded-lg border-2 transition ${
                    formData.yoeServiceNow === range
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Years of Total IT Experience *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {EXPERIENCE_RANGES.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => updateField("yoeTotal", range)}
                  className={`p-3 text-center rounded-lg border-2 transition ${
                    formData.yoeTotal === range
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Location */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Location & Company</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Country *</label>
            <select
              value={formData.country}
              onChange={(e) => updateField("country", e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select country...</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              City/Region
            </label>
            <input
              type="text"
              value={formData.city || ""}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="San Francisco"
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Remote Work
            </label>
            <div className="space-y-2">
              {REMOTE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField("remotePct", opt.value)}
                  className={`w-full p-3 text-left rounded-lg border-2 transition ${
                    formData.remotePct === opt.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Company Name (Optional)
            </label>
            <input
              type="text"
              value={formData.companyName || ""}
              onChange={(e) => updateField("companyName", e.target.value)}
              placeholder="Accenture"
              className="w-full p-3 border rounded-lg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Shown as company type only, never your specific company
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Company Size
            </label>
            <select
              value={formData.companySize || ""}
              onChange={(e) =>
                updateField(
                  "companySize",
                  e.target.value as (typeof COMPANY_SIZES)[number]
                )
              }
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select size...</option>
              {COMPANY_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size} employees
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-6 py-3 border rounded-lg hover:bg-gray-50"
          >
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
            className={`px-6 py-3 rounded-lg font-medium ${
              canProceed()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canProceed() || loading}
            className={`px-6 py-3 rounded-lg font-medium ${
              canProceed() && !loading
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Submitting..." : "Submit & See Results"}
          </button>
        )}
      </div>
    </div>
  );
}
