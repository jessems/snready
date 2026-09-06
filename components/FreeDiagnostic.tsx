"use client";

import { useMemo, useState } from "react";
import { CheckoutButton } from "@/components/CheckoutButton";
import { trackEvent } from "@/lib/analytics";
import type { Question } from "@/types";

type Answers = Record<string, string>;

export function selectDiagnosticQuestions(questions: Question[], limit = 5) {
  const eligible = questions.filter((question) => question.correctAnswers.length === 1);
  const preferred = eligible.filter(
    (question) =>
      question.meta?.reviewed !== false &&
      ["application", "understanding"].includes(question.cognitiveLevel),
  );
  const source = preferred.length >= limit ? preferred : eligible;
  const selected: Question[] = [];
  const usedDomains = new Set<string>();

  for (const question of source) {
    const domain = question.labels?.domain || question.topic;
    if (usedDomains.has(domain)) continue;
    selected.push(question);
    usedDomains.add(domain);
    if (selected.length === limit) return selected;
  }

  for (const question of source) {
    if (selected.some((selectedQuestion) => selectedQuestion.id === question.id)) continue;
    selected.push(question);
    if (selected.length === limit) break;
  }

  return selected;
}

export function summarizeWeakDomains(questions: Question[], answers: Answers) {
  const domains = new Map<string, { correct: number; total: number }>();
  let score = 0;

  questions.forEach((question) => {
    const domain = question.labels?.domain || question.topic;
    const domainScore = domains.get(domain) || { correct: 0, total: 0 };
    const isCorrect = question.correctAnswers.includes(answers[question.id]);
    if (isCorrect) {
      score += 1;
      domainScore.correct += 1;
    }
    domainScore.total += 1;
    domains.set(domain, domainScore);
  });

  const weakDomains = [...domains.entries()]
    .map(([domain, result]) => ({ domain, ...result }))
    .filter((domain) => domain.correct < domain.total)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)
    .slice(0, 3);

  return { score, total: questions.length, weakDomains };
}

interface FreeDiagnosticProps {
  certification: string;
  slug: string;
  questions: Question[];
  totalQuestionCount: number;
}

export function FreeDiagnostic({
  certification,
  slug,
  questions,
  totalQuestionCount,
}: FreeDiagnosticProps) {
  const diagnosticQuestions = useMemo(() => selectDiagnosticQuestions(questions, 5), [questions]);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [startTracked, setStartTracked] = useState(false);

  if (diagnosticQuestions.length < 3) return null;

  const answeredCount = Object.keys(answers).length;
  const complete = answeredCount === diagnosticQuestions.length;
  const summary = complete ? summarizeWeakDomains(diagnosticQuestions, answers) : null;

  function startDiagnostic() {
    setStarted(true);
    if (!startTracked) {
      trackEvent("diagnostic_start", {
        certification,
        question_count: diagnosticQuestions.length,
        source: "practice_page",
      });
      setStartTracked(true);
    }
  }

  function answerQuestion(question: Question, optionId: string) {
    if (answers[question.id]) return;
    const nextAnswers = { ...answers, [question.id]: optionId };
    setAnswers(nextAnswers);
    const nextAnsweredCount = Object.keys(nextAnswers).length;
    const isCorrect = question.correctAnswers.includes(optionId);

    trackEvent("diagnostic_answer", {
      certification,
      question_index: diagnosticQuestions.findIndex((candidate) => candidate.id === question.id) + 1,
      domain: question.labels?.domain || question.topic,
      is_correct: isCorrect,
      answered_count: nextAnsweredCount,
      question_count: diagnosticQuestions.length,
    });

    if (nextAnsweredCount === diagnosticQuestions.length) {
      const nextSummary = summarizeWeakDomains(diagnosticQuestions, nextAnswers);
      trackEvent("diagnostic_complete", {
        certification,
        score: nextSummary.score,
        question_count: nextSummary.total,
        weak_domain_count: nextSummary.weakDomains.length,
      });
    }
  }

  function trackUpgradeClick(plan: "single" | "all") {
    trackEvent("diagnostic_upgrade_click", {
      certification,
      plan,
      source: "practice_page_diagnostic",
      score: summary?.score,
      question_count: summary?.total || diagnosticQuestions.length,
      weak_domain_count: summary?.weakDomains.length || 0,
    });
  }

  return (
    <section id="free-diagnostic" className="mt-10 rounded-2xl border border-cyan-200 bg-cyan-50/70 p-5 shadow-sm dark:border-cyan-900 dark:bg-cyan-950/20 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
            Free diagnostic
          </p>
          <h2 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Find weak domains before you buy
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            Answer {diagnosticQuestions.length} practice questions selected from the free preview. This small sample suggests topics to review; it is not a readiness score or pass prediction. The full bank remains optional.
          </p>
        </div>
        {!started && (
          <button
            type="button"
            onClick={startDiagnostic}
            className="rounded-xl bg-cyan-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800"
          >
            Start free diagnostic
          </button>
        )}
      </div>

      {started && !summary && (
        <div className="mt-6 space-y-4">
          <div className="text-sm font-medium text-cyan-800 dark:text-cyan-200">
            Progress: {answeredCount}/{diagnosticQuestions.length}
          </div>
          {diagnosticQuestions.map((question, index) => (
            <div key={question.id} className="rounded-xl border border-white bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-semibold text-zinc-500">
                {index + 1}. {question.labels?.domain || question.topic}
              </p>
              <p className="mt-2 font-medium text-zinc-900 dark:text-zinc-100">{question.question}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    disabled={Boolean(answers[question.id])}
                    onClick={() => answerQuestion(question, option.id)}
                    className="rounded-lg border border-zinc-200 p-3 text-left text-sm text-zinc-700 transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-700 dark:text-zinc-300"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {summary && (
        <div className="mt-6 rounded-xl border border-white bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Your diagnostic snapshot</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            You scored {summary.score}/{summary.total}. {summary.weakDomains.length ? "Review these domains next:" : "No weak domains in this sample — keep practicing for retention."}
          </p>
          {summary.weakDomains.length > 0 && (
            <ul className="mt-4 grid gap-2 sm:grid-cols-3">
              {summary.weakDomains.map((domain) => (
                <li key={domain.domain} className="rounded-lg bg-cyan-50 p-3 text-sm text-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-100">
                  <span className="font-semibold">{domain.domain}</span>
                  <br />
                  {domain.correct}/{domain.total} correct in this sample
                </li>
              ))}
            </ul>
          )}
          <details className="mt-4">
            <summary className="cursor-pointer font-semibold">Review answers and explanations</summary>
            {diagnosticQuestions.map((question) => (
              <div key={question.id} className="mt-4 border-t border-zinc-200 pt-3">
                <p className="font-medium">{question.question}</p>
                <p className="mt-1">Correct answer: {question.options.find(option => question.correctAnswers.includes(option.id))?.text}</p>
                <p className="mt-2 text-sm">{question.explanation.correct}</p>
              </div>
            ))}
          </details>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <CheckoutButton certification={certification} plan="single" onClick={() => trackUpgradeClick("single")} className="rounded-lg border-2 border-cyan-700 bg-white py-3 font-semibold text-cyan-700 transition hover:bg-cyan-50 dark:bg-zinc-900">
              Upgrade for all {totalQuestionCount} {certification} questions — $9
            </CheckoutButton>
            <CheckoutButton certification={certification} plan="all" onClick={() => trackUpgradeClick("all")} className="rounded-lg bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700">
              Optional all-cert bundle — $49
            </CheckoutButton>
          </div>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            No account required. Answers reset when you leave this page. We measure diagnostic interactions without asking for personal information. Preparing for one exam? Choose $9 single-cert access. The $49 bundle is optional for multi-cert study.
          </p>
        </div>
      )}
    </section>
  );
}
