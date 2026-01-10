import Quiz from "@/components/Quiz";
import { csaQuestions } from "@/data/csa-questions";

export const metadata = {
  title: "CSA Practice Quiz - SNReady",
  description: "ServiceNow Certified System Administrator practice quiz",
};

export default function QuizPage() {
  return (
    <div className="min-h-[calc(100vh-65px)] subtle-gradient py-10">
      <div className="max-w-2xl mx-auto px-6">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[var(--accent)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                CSA Practice Quiz
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Certified System Administrator
              </p>
            </div>
          </div>
        </div>

        <Quiz questions={csaQuestions} />
      </div>
    </div>
  );
}
