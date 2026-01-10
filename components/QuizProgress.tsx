interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
  answeredQuestions: Set<number>;
}

export default function QuizProgress({
  currentIndex,
  totalQuestions,
  answeredQuestions,
}: QuizProgressProps) {
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <span className="text-sm text-[var(--text-muted)]">
          {answeredQuestions.size} answered
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-bar mb-4">
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question indicators */}
      <div className="flex gap-1.5 flex-wrap">
        {Array.from({ length: totalQuestions }, (_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all
              ${
                i === currentIndex
                  ? "bg-[var(--accent)] text-white"
                  : answeredQuestions.has(i)
                  ? "bg-[var(--accent-light)] text-[var(--accent)]"
                  : "bg-[var(--bg-elevated)] text-[var(--text-muted)]"
              }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
