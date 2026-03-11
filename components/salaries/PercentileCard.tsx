"use client";

import { PercentileResult } from "@/lib/salaries/types";

interface PercentileCardProps {
  result: PercentileResult;
  currency?: string;
}

export default function PercentileCard({
  result,
  currency = "USD",
}: PercentileCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPercentileColor = (p: number) => {
    if (p >= 75) return "text-green-600";
    if (p >= 50) return "text-blue-600";
    if (p >= 25) return "text-yellow-600";
    return "text-red-600";
  };

  const getPercentileEmoji = (p: number) => {
    if (p >= 90) return "🚀";
    if (p >= 75) return "💪";
    if (p >= 50) return "👍";
    if (p >= 25) return "📈";
    return "💡";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <h3 className="text-lg font-medium opacity-90 mb-2">Your Position</h3>
        <div className="flex items-baseline gap-3">
          <span className={`text-5xl font-bold`}>
            {result.percentile}
            <span className="text-3xl">th</span>
          </span>
          <span className="text-2xl">percentile</span>
          <span className="text-3xl">{getPercentileEmoji(result.percentile)}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Visual percentile bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Lower</span>
            <span>Higher</span>
          </div>
          <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-blue-200" />
            
            {/* P25 marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-gray-400"
              style={{ left: "25%" }}
            />
            {/* Median marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-gray-600"
              style={{ left: "50%" }}
            />
            {/* P75 marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-gray-400"
              style={{ left: "75%" }}
            />

            {/* Your position */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-lg"
              style={{ left: `${result.percentile}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>25th</span>
            <span>50th (median)</span>
            <span>75th</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">25th %ile</div>
            <div className="font-semibold">{formatCurrency(result.p25)}</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="text-sm text-blue-600 mb-1">Median</div>
            <div className="font-bold text-blue-700">
              {formatCurrency(result.median)}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">75th %ile</div>
            <div className="font-semibold">{formatCurrency(result.p75)}</div>
          </div>
        </div>

        {/* Your salary highlight */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
          <div>
            <div className="text-sm text-gray-600">Your Total Comp</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(result.yourSalary)}
            </div>
          </div>
          <div className={`text-right ${getPercentileColor(result.percentile)}`}>
            {result.percentile >= 50 ? (
              <span className="text-sm font-medium">
                {formatCurrency(result.yourSalary - result.median)} above median
              </span>
            ) : (
              <span className="text-sm font-medium">
                {formatCurrency(result.median - result.yourSalary)} below median
              </span>
            )}
          </div>
        </div>

        {/* Comparison group */}
        <div className="text-center text-sm text-gray-500">
          Compared against{" "}
          <span className="font-medium text-gray-700">
            {result.sampleSize} {result.comparisonGroup}
          </span>
        </div>
      </div>

      {/* Share button */}
      <div className="px-6 pb-6">
        <button
          onClick={() => {
            const text = `I'm in the ${result.percentile}th percentile for ServiceNow salaries! 💰 Check where you stand: snready.com/salaries`;
            if (navigator.share) {
              navigator.share({ text });
            } else {
              navigator.clipboard.writeText(text);
              alert("Copied to clipboard!");
            }
          }}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
        >
          📊 Share Your Result
        </button>
      </div>
    </div>
  );
}
