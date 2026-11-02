"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type ExamStatus = "yes" | "no" | "scheduled" | null;
type PassStatus = "yes" | "no" | "waiting" | null;

function FeedbackForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);

  const [certification, setCertification] = useState<string | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [examTaken, setExamTaken] = useState<ExamStatus>(null);
  const [passed, setPassed] = useState<PassStatus>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [testimonial, setTestimonial] = useState("");
  const [canFeature, setCanFeature] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("No feedback token provided");
      return;
    }

    fetch(`/api/feedback?token=${encodeURIComponent(token)}`)
      .then((res) => res.json() as Promise<{ valid?: boolean; certification?: string; alreadySubmitted?: boolean; error?: string }>)
      .then((data) => {
        if (data.valid) {
          setCertification(data.certification ?? null);
          setAlreadySubmitted(data.alreadySubmitted ?? false);
        } else {
          setError(data.error || "Invalid token");
        }
      })
      .catch(() => setError("Failed to validate token"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async () => {
    if (!examTaken || !rating) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          examTaken,
          passed: examTaken === "yes" ? passed : undefined,
          rating,
          testimonial: testimonial.trim() || undefined,
          canFeature,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json() as { error?: string };
        setError(data.error || "Failed to submit feedback");
      }
    } catch {
      setError("Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  // Without a purchase follow-up token this page explains how to report an
  // error in a question (linked from /how-questions-are-made).
  if (!token) {
    return <ReportQuestionError />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="text-blue-600 hover:underline"
          >
            Go to SNReady
          </Link>
        </div>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Already Submitted! 🙏
          </h1>
          <p className="text-gray-600 mb-6">
            You&apos;ve already shared your feedback for {certification?.toUpperCase()}. Thank you!
          </p>
          <Link
            href="/"
            className="text-blue-600 hover:underline"
          >
            Back to SNReady
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>
          <p className="text-gray-600 mb-6">
            Your feedback means a lot. It helps make SNReady better for everyone preparing for their ServiceNow certifications.
          </p>
          {passed === "yes" && (
            <p className="text-lg font-semibold text-green-600 mb-6">
              Congratulations on passing! 🏆
            </p>
          )}
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Back to SNReady
          </Link>
        </div>
      </div>
    );
  }

  const certName = certification?.toUpperCase() || "ServiceNow";
  const canSubmit = examTaken && rating > 0 && (examTaken !== "yes" || passed);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            How&apos;s Your {certName} Journey?
          </h1>
          <p className="text-gray-600 mb-8">
            Your feedback helps improve SNReady for future test-takers.
          </p>

          {/* Question 1: Exam taken? */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Have you taken the {certName} exam?
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                { value: "yes", label: "Yes, I took it" },
                { value: "scheduled", label: "Scheduled" },
                { value: "no", label: "Not yet" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setExamTaken(option.value as ExamStatus);
                    if (option.value !== "yes") setPassed(null);
                  }}
                  className={`px-4 py-2 rounded-lg border-2 transition ${
                    examTaken === option.value
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Pass/Fail (if taken) */}
          {examTaken === "yes" && (
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Did you pass?
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: "yes", label: "Yes! 🎉" },
                  { value: "no", label: "Not this time" },
                  { value: "waiting", label: "Waiting for results" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPassed(option.value as PassStatus)}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      passed === option.value
                        ? option.value === "yes"
                          ? "border-green-600 bg-green-50 text-green-700"
                          : "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 3: Rating */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              How helpful were the practice questions?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl transition-transform hover:scale-110"
                >
                  {star <= (hoverRating || rating) ? "⭐" : "☆"}
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {rating === 5 && "Amazing! Glad they helped! 🙌"}
                {rating === 4 && "Great to hear!"}
                {rating === 3 && "Thanks for the honest feedback"}
                {rating === 2 && "Sorry to hear that. Any suggestions?"}
                {rating === 1 && "We'll work on improving. Thanks for telling us."}
              </p>
            )}
          </div>

          {/* Question 4: Testimonial */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Any feedback or tips for others? (optional)
            </label>
            <textarea
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              placeholder="e.g., 'The practice questions really helped me understand CMDB relationships...'"
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Permission checkbox */}
          {testimonial.trim() && (
            <div className="mb-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={canFeature}
                  onChange={(e) => setCanFeature(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-600">
                  You can feature my feedback on SNReady (first name only)
                </span>
              </label>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
              canSubmit && !submitting
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportQuestionError() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Report an error in a question</h1>
      <p className="mt-4 text-zinc-700 dark:text-zinc-300">
        If a question, answer or explanation looks wrong or out of date, please tell us. Use the{" "}
        <strong>Contact</strong> link at the bottom of any page to email the SNReady team, and include:
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
        <li>the certification and topic (or the page URL)</li>
        <li>the first few words of the question</li>
        <li>what you think is wrong and the answer you believe is correct</li>
        <li>a link to the ServiceNow documentation or release notes that support it, if you have one</li>
      </ul>
      <p className="mt-4 text-zinc-700 dark:text-zinc-300">
        We check each report against the documentation and fix or remove the question if it is wrong.
      </p>
      <p className="mt-6">
        <Link href="/how-questions-are-made" className="text-emerald-700 underline dark:text-emerald-300">
          How SNReady questions are made
        </Link>
      </p>
    </div>
  );
}

function FeedbackLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={<FeedbackLoading />}>
      <FeedbackForm />
    </Suspense>
  );
}
