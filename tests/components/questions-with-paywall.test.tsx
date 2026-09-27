import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QuestionsWithPaywall } from "@/components/QuestionsWithPaywall";
import type { Question } from "@/types";
const accessState = vi.hoisted(() => ({ value: { authenticated: false, hasAccess: false, loading: false, hasAccessTo: vi.fn(() => false) } }));
const analyticsMocks = vi.hoisted(() => ({ trackPracticeStartOnce: vi.fn(), trackFreeCertCrossSellClick: vi.fn() }));
vi.mock("@/components/AccessProvider", () => ({ useAccess: () => accessState.value }));
vi.mock("@/lib/analytics", () => ({ trackPracticeStartOnce: analyticsMocks.trackPracticeStartOnce, trackFreeCertCrossSellClick: analyticsMocks.trackFreeCertCrossSellClick }));
vi.mock("@/components/QuestionCard", () => ({ default: ({ question, questionNumber, onAnswer }: { question: Question; questionNumber: number; onAnswer?: (questionId: string, selectedAnswers: string[]) => void }) => <article data-testid="question-card"><span>Question {questionNumber}</span><h2>{question.question}</h2><button type="button" onClick={() => onAnswer?.(question.id, ["a"])}>Answer {question.id}</button></article> }));
vi.mock("@/components/CheckoutButton", () => ({ CheckoutButton: ({ children, certification, plan }: { children: React.ReactNode; certification: string; plan: string }) => <button type="button" data-certification={certification} data-plan={plan}>{children}</button> }));
vi.mock("@/components/LoginModal", () => ({ LoginModal: ({ isOpen }: { isOpen: boolean }) => (isOpen ? <div role="dialog">Log in</div> : null) }));
function question(id: string, stem: string): Question { return { id, certification: "csa", topic: "ui-navigation", cognitiveLevel: "knowledge", type: "multiple_choice", question: stem, options: [{ id: "a", text: "Option A" }, { id: "b", text: "Option B" }], correctAnswers: ["a"], explanation: { correct: "Correct.", wrongAnswers: [] }, references: [], isFree: id.includes("free"), source: { type: "course", path: "fixture", excerpt: "fixture" }, labels: { certification: "csa", domain: "UI", domainSlug: "ui-navigation", domainPercentage: 15, subtopics: [], tags: [] }, meta: { generatedAt: "2026-01-01T00:00:00Z", version: "test", release: "Zurich", reviewed: true } }; }
const freeQuestions = [question("free-1", "Free question 1"), question("free-2", "Free question 2")];
const premiumQuestions = [question("premium-1", "Premium question 1"), question("premium-2", "Premium question 2")];
const fetchMock = vi.fn();
function jsonResponse(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }); }
describe("QuestionsWithPaywall revenue gate", () => {
  beforeEach(() => { accessState.value = { authenticated: false, hasAccess: false, loading: false, hasAccessTo: vi.fn(() => false) }; analyticsMocks.trackPracticeStartOnce.mockClear(); fetchMock.mockReset(); vi.stubGlobal("fetch", fetchMock); });
  afterEach(() => { vi.unstubAllGlobals(); });
  it("shows free questions and the paywall when the visitor has no access", () => {
    render(<QuestionsWithPaywall freeQuestions={freeQuestions} premiumQuestionCount={2} certification="CAD" certificationSlug="cad" />);
    expect(screen.getByText("Free question 1")).toBeInTheDocument();
    expect(screen.getByText(/Unlock 2 More Questions/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /CAD Lifetime/i })).toHaveAttribute("data-plan", "single");
    expect(screen.getByRole("button", { name: /Lifetime All Certs/i })).toHaveAttribute("data-plan", "all");
    expect(screen.getByText("(2 of 4)")).toBeInTheDocument();
    expect(screen.queryByText(/Premium question/)).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("keeps premium questions locked while access is loading", () => {
    accessState.value = { authenticated: false, hasAccess: false, loading: true, hasAccessTo: vi.fn(() => false) };
    render(<QuestionsWithPaywall freeQuestions={freeQuestions} premiumQuestionCount={2} certification="CAD" certificationSlug="cad" />);
    expect(screen.getByText("Free question 1")).toBeInTheDocument();
    expect(screen.queryByText("Premium question 1")).not.toBeInTheDocument();
    expect(screen.queryByText(/Unlock 2 More Questions/i)).not.toBeInTheDocument();
  });
  it("fetches premium questions from the access-checked API when the user has certification access", async () => {
    accessState.value = { authenticated: true, hasAccess: true, loading: false, hasAccessTo: vi.fn(() => true) };
    fetchMock.mockResolvedValue(jsonResponse({ questions: premiumQuestions }));
    render(<QuestionsWithPaywall freeQuestions={freeQuestions} premiumQuestionCount={2} certification="CAD" certificationSlug="cad" topic="business-rules" />);
    expect(screen.getByText("Free question 1")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/Loading 2 premium questions/i);
    expect(await screen.findByText("Premium question 1")).toBeInTheDocument();
    expect(screen.getByText("Question 4")).toBeInTheDocument();
    expect(screen.queryByText(/Unlock 2 More Questions/i)).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/questions?cert=cad&topic=business-rules", expect.objectContaining({ credentials: "include", cache: "no-store" }));
  });
  it("shows a retryable error when premium questions fail to load", async () => {
    const user = userEvent.setup();
    accessState.value = { authenticated: true, hasAccess: true, loading: false, hasAccessTo: vi.fn(() => true) };
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch")).mockResolvedValueOnce(jsonResponse({ questions: premiumQuestions }));
    render(<QuestionsWithPaywall freeQuestions={freeQuestions} premiumQuestionCount={2} certification="CAD" certificationSlug="cad" />);
    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn.t load your premium questions/i);
    expect(screen.getByText("Free question 1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Premium question 2")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it("offers log in when the API says the session is no longer valid", async () => {
    accessState.value = { authenticated: true, hasAccess: true, loading: false, hasAccessTo: vi.fn(() => true) };
    fetchMock.mockResolvedValue(jsonResponse({ error: "Log in to access premium questions", code: "not_authenticated" }, 401));
    render(<QuestionsWithPaywall freeQuestions={freeQuestions} premiumQuestionCount={2} certification="CAD" certificationSlug="cad" />);
    expect(await screen.findByRole("alert")).toHaveTextContent(/session has expired/i);
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
    expect(screen.queryByText(/Premium question/)).not.toBeInTheDocument();
  });
  it("fires privacy-safe practice_start from the first free answer interaction", async () => {
    const user = userEvent.setup();
    render(<QuestionsWithPaywall freeQuestions={freeQuestions} premiumQuestionCount={2} certification="CIS-Discovery" certificationSlug="cis-discovery" freeQuestionCount={15} />);

    await user.click(screen.getByRole("button", { name: "Answer free-1" }));

    expect(analyticsMocks.trackPracticeStartOnce).toHaveBeenCalledWith({
      certification: "CIS-Discovery",
      freeQuestionCount: 15,
      totalQuestionCount: 4,
    });
  });
});

describe("QuestionsWithPaywall for a free certification (CSA)", () => {
  const csaQuestions = [question("csa-1", "CSA question 1"), question("csa-2", "CSA question 2"), question("csa-3", "CSA question 3")];
  beforeEach(() => { accessState.value = { authenticated: false, hasAccess: false, loading: false, hasAccessTo: vi.fn(() => false) }; analyticsMocks.trackPracticeStartOnce.mockClear(); fetchMock.mockReset(); vi.stubGlobal("fetch", fetchMock); });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("shows every question with no paywall, no single-cert offer, and a soft cross-sell", () => {
    render(<QuestionsWithPaywall freeQuestions={csaQuestions} premiumQuestionCount={0} certification="CSA" certificationSlug="csa" paidCertCount={19} />);
    expect(screen.getAllByTestId("question-card")).toHaveLength(3);
    expect(screen.getByText(/All CSA questions are free/i)).toBeInTheDocument();
    expect(screen.queryByText(/Unlock/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /CSA Lifetime/i })).not.toBeInTheDocument();
    expect(screen.getByText(/CSA is free\. Next step: CAD or a CIS exam/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /All 19 paid certs — \$49/i })).toHaveAttribute("data-plan", "all");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("stays paywall-free while access is still loading", () => {
    accessState.value = { authenticated: false, hasAccess: false, loading: true, hasAccessTo: vi.fn(() => false) };
    render(<QuestionsWithPaywall freeQuestions={csaQuestions} premiumQuestionCount={0} certification="CSA" certificationSlug="csa" paidCertCount={19} />);
    expect(screen.getAllByTestId("question-card")).toHaveLength(3);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("tags practice_start as a free-certification start", async () => {
    const user = userEvent.setup();
    render(<QuestionsWithPaywall freeQuestions={csaQuestions} premiumQuestionCount={0} certification="CSA" certificationSlug="csa" paidCertCount={19} />);
    await user.click(screen.getByRole("button", { name: "Answer csa-1" }));
    expect(analyticsMocks.trackPracticeStartOnce).toHaveBeenCalledWith({ certification: "CSA", freeQuestionCount: 3, totalQuestionCount: 3, freeCertification: true });
  });
});
