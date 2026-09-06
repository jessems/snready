import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { FreeDiagnostic, selectDiagnosticQuestions, summarizeWeakDomains } from "@/components/FreeDiagnostic";
import type { Question } from "@/types";

vi.mock("@/components/CheckoutButton", () => ({
  CheckoutButton: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>{children}</button>
  ),
}));

function question(id: string, topic: string, domain: string, correct = "a"): Question {
  return {
    id,
    certification: "cis-itsm",
    topic,
    cognitiveLevel: "application",
    type: "multiple_choice",
    question: `Scenario ${id}: What should the implementer do next?`,
    options: [
      { id: "a", text: "Recommended action" },
      { id: "b", text: "Distractor action" },
    ],
    correctAnswers: [correct],
    explanation: { correct: "Correct because of the official implementation behavior.", wrongAnswers: [] },
    isFree: true,
    source: { type: "documentation", documentation: { docSlug: "doc", section: "section", url: "https://docs.servicenow.com/" }, path: "/tmp", excerpt: "excerpt" },
    labels: { certification: "cis-itsm", domain, domainSlug: domain.toLowerCase().replaceAll(" ", "-"), domainPercentage: 20, subtopics: [], tags: [] },
    meta: { generatedAt: "2026-01-01T00:00:00.000Z", version: "1.0", release: "Zurich", reviewed: true },
  };
}

const questions = [
  question("q1", "incident-management", "Incident Management"),
  question("q2", "change-management", "Change Management"),
  question("q3", "sla-management", "Service Level Management"),
  question("q4", "problem-management", "Problem Management"),
];

describe("free diagnostic helpers", () => {
  it("selects reviewed application/understanding questions across different domains", () => {
    expect(selectDiagnosticQuestions(questions, 3).map((q) => q.labels.domain)).toEqual([
      "Incident Management",
      "Change Management",
      "Service Level Management",
    ]);
  });

  it("summarizes weak domains without storing PII", () => {
    const summary = summarizeWeakDomains(questions.slice(0, 3), { q1: "a", q2: "b", q3: "b" });
    expect(summary.score).toBe(1);
    expect(summary.total).toBe(3);
    expect(summary.weakDomains.map((d) => d.domain)).toEqual(["Change Management", "Service Level Management"]);
  });
});

describe("FreeDiagnostic", () => {
  beforeEach(() => {
    window.gtag = vi.fn();
    window.localStorage.clear();
  });

  it("tracks diagnostic start once, answers, completion, and upgrade clicks with aggregate fields only", async () => {
    const user = userEvent.setup();
    render(<FreeDiagnostic certification="CIS-ITSM" slug="cis-itsm" questions={questions} totalQuestionCount={140} />);

    await user.click(screen.getByRole("button", { name: /start free diagnostic/i }));
    const recommendedButtons = screen.getAllByRole("button", { name: /Recommended action/i });
    const distractorButtons = screen.getAllByRole("button", { name: /Distractor action/i });
    await user.click(recommendedButtons[0]!);
    await user.click(distractorButtons[1]!);
    await user.click(recommendedButtons[2]!);
    await user.click(distractorButtons[3]!);

    expect(screen.getByText(/Your diagnostic snapshot/i)).toBeVisible();
    await user.click(screen.getByRole("button", { name: /upgrade for all 140/i }));

    const calls = vi.mocked(window.gtag!).mock.calls;
    expect(calls.filter((c) => c[1] === "diagnostic_start")).toHaveLength(1);
    expect(calls.filter((c) => c[1] === "diagnostic_answer")).toHaveLength(4);
    expect(calls.filter((c) => c[1] === "diagnostic_complete")).toHaveLength(1);
    expect(calls.filter((c) => c[1] === "diagnostic_upgrade_click")).toHaveLength(1);
    expect(calls.map((c) => JSON.stringify(c[2])).join(" ")).not.toMatch(/@|email|q1|q2|q3/i);
  });
});
