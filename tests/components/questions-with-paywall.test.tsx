import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuestionsWithPaywall } from "@/components/QuestionsWithPaywall";
import type { Question } from "@/types";
const accessState = vi.hoisted(() => ({ value: { authenticated: false, hasAccess: false, loading: false, hasAccessTo: vi.fn(() => false) } }));
vi.mock("@/components/AccessProvider", () => ({ useAccess: () => accessState.value }));
vi.mock("@/components/QuestionCard", () => ({ default: ({ question, questionNumber }: { question: Question; questionNumber: number }) => <article data-testid="question-card"><span>Question {questionNumber}</span><h2>{question.question}</h2></article> }));
vi.mock("@/components/CheckoutButton", () => ({ CheckoutButton: ({ children, certification, plan }: { children: React.ReactNode; certification: string; plan: string }) => <button type="button" data-certification={certification} data-plan={plan}>{children}</button> }));
vi.mock("@/components/LoginModal", () => ({ LoginModal: ({ isOpen }: { isOpen: boolean }) => (isOpen ? <div role="dialog">Log in</div> : null) }));
function question(id: string, stem: string): Question { return { id, certification: "csa", topic: "ui-navigation", cognitiveLevel: "knowledge", type: "multiple_choice", question: stem, options: [{ id: "a", text: "Option A" }, { id: "b", text: "Option B" }], correctAnswers: ["a"], explanation: { correct: "Correct.", wrongAnswers: [] }, references: [], isFree: id.includes("free"), source: { type: "course", path: "fixture", excerpt: "fixture" }, labels: { certification: "csa", domain: "UI", domainSlug: "ui-navigation", domainPercentage: 15, subtopics: [], tags: [] }, meta: { generatedAt: "2026-01-01T00:00:00Z", version: "test", release: "Zurich", reviewed: true } }; }
const freeQuestions = [question("free-1", "Free question 1"), question("free-2", "Free question 2")];
const premiumQuestions = [question("premium-1", "Premium question 1"), question("premium-2", "Premium question 2")];
describe("QuestionsWithPaywall revenue gate", () => {
  beforeEach(() => { accessState.value = { authenticated: false, hasAccess: false, loading: false, hasAccessTo: vi.fn(() => false) }; });
  it("shows free questions and the paywall when the visitor has no access", () => {
    render(<QuestionsWithPaywall freeQuestions={freeQuestions} premiumQuestions={premiumQuestions} certification="csa" />);
    expect(screen.getByText("Free question 1")).toBeInTheDocument();
    expect(screen.getByText(/Unlock 2 More Questions/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /CSA Lifetime/i })).toHaveAttribute("data-plan", "single");
    expect(screen.getByRole("button", { name: /Lifetime All Certs/i })).toHaveAttribute("data-plan", "all");
  });
  it("keeps premium questions locked while access is loading", () => {
    accessState.value = { authenticated: false, hasAccess: false, loading: true, hasAccessTo: vi.fn(() => false) };
    render(<QuestionsWithPaywall freeQuestions={freeQuestions} premiumQuestions={premiumQuestions} certification="csa" />);
    expect(screen.getByText("Free question 1")).toBeInTheDocument();
    expect(screen.queryByText("Premium question 1")).not.toBeInTheDocument();
    expect(screen.queryByText(/Unlock 2 More Questions/i)).not.toBeInTheDocument();
  });
  it("shows all questions and removes the paywall when the user has certification access", () => {
    accessState.value = { authenticated: true, hasAccess: true, loading: false, hasAccessTo: vi.fn(() => true) };
    render(<QuestionsWithPaywall freeQuestions={freeQuestions} premiumQuestions={premiumQuestions} certification="csa" />);
    expect(screen.getByText("Premium question 1")).toBeInTheDocument();
    expect(screen.queryByText(/Unlock 2 More Questions/i)).not.toBeInTheDocument();
  });
});
