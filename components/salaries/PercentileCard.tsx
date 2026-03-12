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
    if (p >= 25) return "text-amber-600";
    return "text-red-600";
  };

  const getPercentileGradient = (p: number) => {
    if (p >= 75) return "from-green-500 to-emerald-600";
    if (p >= 50) return "from-blue-500 to-cyan-600";
    if (p >= 25) return "from-amber-500 to-orange-600";
    return "from-red-500 to-rose-600";
  };

  const getPercentileEmoji = (p: number) => {
    if (p >= 90) return "🚀";
    if (p >= 75) return "💪";
    if (p >= 50) return "👍";
    if (p >= 25) return "📈";
    return "💡";
  };

  const getMessage = (p: number) => {
    if (p >= 90) return "You're in the top 10%!";
    if (p >= 75) return "You're in the top quartile!";
    if (p >= 50) return "You're above average!";
    if (p >= 25) return "Room to grow";
    return "Below average — time to level up";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getPercentileGradient(result.percentile)} p-8 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium opacity-90">Your Position</h3>
          <span className="text-4xl">{getPercentileEmoji(result.percentile)}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-bold tracking-tight">
            {result.percentile}
          </span>
          <span className="text-3xl font-medium opacity-90">th</span>
          <span className="text-xl ml-2 opacity-80">percentile</span>
        </div>
        <p className="mt-2 text-white/80">{getMessage(result.percentile)}</p>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Visual percentile bar */}
        <div>
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>Lower earners</span>
            <span>Higher earners</span>
          </div>
          <div className="relative h-10 bg-slate-100 rounded-xl overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-200 via-amber-200 via-50% via-green-200 to-blue-200" />
            
            {/* P25, Median, P75 markers */}
            <div className="absolute top-0 bottom-0 w-px bg-slate-400/50" style={{ left: "25%" }}>
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-slate-400">25th</span>
            </div>
            <div className="absolute top-0 bottom-0 w-0.5 bg-slate-600" style={{ left: "50%" }}>
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-medium text-slate-600">Median</span>
            </div>
            <div className="absolute top-0 bottom-0 w-px bg-slate-400/50" style={{ left: "75%" }}>
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-slate-400">75th</span>
            </div>

            {/* Your position indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all"
              style={{ left: `${Math.min(95, Math.max(5, result.percentile))}%` }}
            >
              <div className="relative">
                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getPercentileGradient(result.percentile)} border-2 border-white shadow-lg`} />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">You</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 pt-4">
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">25th %ile</div>
            <div className="font-semibold text-slate-900">{formatCurrency(result.p25)}</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <div className="text-xs text-blue-600 mb-1 uppercase tracking-wide font-medium">Median</div>
            <div className="font-bold text-blue-700">{formatCurrency(result.median)}</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">75th %ile</div>
            <div className="font-semibold text-slate-900">{formatCurrency(result.p75)}</div>
          </div>
        </div>

        {/* Your salary highlight */}
        <div className={`flex items-center justify-between p-5 rounded-xl border-2 ${
          result.percentile >= 50 
            ? 'bg-green-50 border-green-200' 
            : 'bg-amber-50 border-amber-200'
        }`}>
          <div>
            <div className="text-sm text-slate-600 mb-1">Your Total Comp</div>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(result.yourSalary)}
            </div>
          </div>
          <div className={`text-right ${getPercentileColor(result.percentile)}`}>
            {result.percentile >= 50 ? (
              <div className="flex items-center gap-1 font-semibold">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>{formatCurrency(result.yourSalary - result.median)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 font-semibold">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span>{formatCurrency(result.median - result.yourSalary)}</span>
              </div>
            )}
            <span className="text-sm opacity-75">
              {result.percentile >= 50 ? "above" : "below"} median
            </span>
          </div>
        </div>

        {/* Comparison group */}
        <div className="text-center p-4 bg-slate-50 rounded-xl">
          <span className="text-sm text-slate-600">
            Compared against{" "}
            <span className="font-semibold text-slate-900">
              {result.sampleSize} {result.comparisonGroup}
            </span>
          </span>
        </div>
      </div>

      {/* Share button */}
      <div className="px-6 pb-6">
        <button
          onClick={() => {
            const text = `I'm in the ${result.percentile}th percentile for ServiceNow salaries! 💰 Check where you stand: snready.com/salaries`;
            if (navigator.share) {
              navigator.share({ text, url: 'https://snready.com/salaries' });
            } else {
              navigator.clipboard.writeText(text);
              alert("Copied to clipboard!");
            }
          }}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Your Result
        </button>
      </div>
    </div>
  );
}
