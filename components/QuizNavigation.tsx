interface QuizNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  canGoBack: boolean;
  canGoForward: boolean;
  isLastQuestion: boolean;
  isSubmitted: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export default function QuizNavigation({
  canGoBack,
  canGoForward,
  isLastQuestion,
  isSubmitted,
  onPrevious,
  onNext,
  onSubmit,
}: QuizNavigationProps) {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-[var(--border)]">
      <button
        onClick={onPrevious}
        disabled={!canGoBack}
        className={`btn-secondary px-5 py-2.5 flex items-center gap-2
          ${!canGoBack ? "opacity-50 cursor-not-allowed" : ""}`}
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Previous
      </button>

      {isLastQuestion && !isSubmitted ? (
        <button onClick={onSubmit} className="btn-primary px-6 py-2.5">
          Submit Quiz
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!canGoForward}
          className={`btn-secondary px-5 py-2.5 flex items-center gap-2
            ${!canGoForward ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Next
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
