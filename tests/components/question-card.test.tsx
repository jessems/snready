import React from "react";
import { renderToString } from "react-dom/server";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import QuestionCard from "@/components/QuestionCard";
import { orderOptionsForQuestion, optionLetter } from "@/lib/option-order";
import { withExplanationSources } from "@/lib/doc-links";
import type { Question } from "@/types";

function makeQuestion(overrides: Partial<Question> = {}): Question {
  return {
    id: "csa-ui-navigation-test-001",
    certification: "csa",
    topic: "ui-navigation",
    cognitiveLevel: "knowledge",
    type: "multiple_choice",
    question: "What does a list show?",
    options: [
      { id: "a", text: "A single record" },
      { id: "b", text: "Records from a table" },
      { id: "c", text: "Only mandatory fields" },
      { id: "d", text: "System properties" },
    ],
    correctAnswers: ["b"],
    explanation: {
      correct: "A list shows records from a table. See: https://www.servicenow.com/docs/bundle/lists.html.",
      wrongAnswers: [
        { choiceId: "a", explanation: "A single record is shown on a form.", reference: "https://www.servicenow.com/docs/bundle/forms.html" },
        { choiceId: "c", explanation: "Lists show all configured fields.", reference: "" },
        { choiceId: "d", explanation: "Properties live elsewhere.", reference: "" },
      ],
    },
    references: ["ServiceNow List Documentation"],
    isFree: true,
    source: { type: "documentation", path: "fixture", excerpt: "fixture" },
    labels: { certification: "csa", domain: "UI", domainSlug: "ui-navigation", domainPercentage: 15, subtopics: [], tags: [] },
    meta: { generatedAt: "2026-01-01T00:00:00Z", version: "test", release: "Zurich", reviewed: false },
    ...overrides,
  };
}

const question = makeQuestion();
const ordered = orderOptionsForQuestion(question.id, question.options);
const correctIndex = ordered.findIndex((option) => option.id === "b");
const correctLetter = optionLetter(correctIndex);

describe("QuestionCard option order", () => {
  it("renders options in the deterministic order with positional letters A-D", () => {
    const { container } = render(<QuestionCard question={question} questionNumber={1} />);
    const texts = Array.from(container.querySelectorAll(".space-y-3 > div span:last-child")).map((el) => el.textContent);
    expect(texts).toEqual(ordered.map((option) => option.text));
    const letters = Array.from(container.querySelectorAll(".space-y-3 > div span:first-child")).map((el) => el.textContent);
    expect(letters).toEqual(["A", "B", "C", "D"]);
  });

  it("produces identical server HTML on every render (no hydration mismatch)", () => {
    const html1 = renderToString(<QuestionCard question={question} questionNumber={1} explanationInHtml />);
    const html2 = renderToString(<QuestionCard question={makeQuestion()} questionNumber={1} explanationInHtml />);
    expect(html2).toBe(html1);
  });

  it("scores by option id, not by displayed position", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(<QuestionCard question={question} questionNumber={1} onAnswer={onAnswer} />);
    await user.click(screen.getByText("Records from a table"));
    expect(onAnswer).toHaveBeenCalledWith(question.id, ["b"]);
    await user.click(screen.getByRole("button", { name: /Check Answer/i }));
    expect(screen.getByText("Correct!")).toBeInTheDocument();
  });

  it("selects by displayed letter with the keyboard and names wrong answers by displayed letter", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(<QuestionCard question={question} questionNumber={1} onAnswer={onAnswer} />);
    const wrongIndex = ordered.findIndex((option) => option.id === "a");
    await user.keyboard(optionLetter(wrongIndex).toLowerCase());
    expect(onAnswer).toHaveBeenLastCalledWith(question.id, ["a"]);
    await user.keyboard("{Enter}");
    expect(screen.getByText("Incorrect")).toBeInTheDocument();
    expect(screen.getByText(`Why ${optionLetter(wrongIndex)} is wrong:`, { exact: false })).toBeInTheDocument();
  });
});

describe("QuestionCard static explanation", () => {
  it("renders the answer, explanation and real doc links in a collapsed <details> when enabled", () => {
    const { container } = render(<QuestionCard question={question} questionNumber={1} explanationInHtml />);
    const details = container.querySelector("details");
    expect(details).not.toBeNull();
    expect(details).not.toHaveAttribute("open");
    expect(details!.textContent).toContain(`Correct answer: ${correctLetter}. Records from a table`);
    expect(details!.textContent).toContain("A list shows records from a table.");
    const hrefs = Array.from(details!.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("https://www.servicenow.com/docs/bundle/lists.html");
    expect(hrefs).toContain("https://www.servicenow.com/docs/bundle/forms.html");
    // Trailing "See: <url>" moves out of the text into the Sources block; non-URL references are dropped.
    expect(details!.textContent).not.toContain("See: https://");
    expect(details!.textContent).not.toContain("ServiceNow List Documentation");
    expect(details!.textContent).toContain("Sources");
    expect(details!.textContent).toContain("ServiceNow Docs: Lists");
    for (const link of details!.querySelectorAll("a")) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("does not render the answer in the HTML unless enabled", () => {
    const html = renderToString(<QuestionCard question={question} questionNumber={1} />);
    expect(html).not.toContain("<details");
    expect(html).not.toContain("A list shows records from a table");
  });

  it("hides the static <details> once the answer is checked", async () => {
    const user = userEvent.setup();
    const { container } = render(<QuestionCard question={question} questionNumber={1} explanationInHtml />);
    await user.click(screen.getByText("Records from a table"));
    await user.click(screen.getByRole("button", { name: /Check Answer/i }));
    expect(container.querySelector("details")).toBeNull();
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("https://www.servicenow.com/docs/bundle/lists.html");
  });
});

describe("QuestionCard wrong-answer references", () => {
  async function answerWrong(q: Question, choiceId: string) {
    const user = userEvent.setup();
    const view = render(<QuestionCard question={q} questionNumber={1} />);
    await user.click(screen.getByText(q.options.find((option) => option.id === choiceId)!.text));
    await user.click(screen.getByRole("button", { name: /Check Answer/i }));
    return view;
  }

  it("drops the per-option Reference link when the Sources block already lists that URL", async () => {
    // Same page as the Sources entry, differing only in host case and a trailing slash.
    const q = makeQuestion({
      explanation: {
        correct: "A list shows records from a table. See https://www.servicenow.com/docs/bundle/lists.html",
        wrongAnswers: [
          { choiceId: "a", explanation: "A single record is shown on a form.", reference: "https://WWW.ServiceNow.com/docs/bundle/forms.html/" },
          { choiceId: "c", explanation: "Lists show all configured fields.", reference: "" },
          { choiceId: "d", explanation: "Properties live elsewhere.", reference: "" },
        ],
      },
    });
    const { container } = await answerWrong(q, "a");
    expect(container.textContent).toContain("A single record is shown on a form.");
    expect(container.textContent).not.toContain("Reference:");
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"));
    expect(hrefs.filter((href) => href?.toLowerCase().includes("forms.html"))).toHaveLength(1);
  });

  it("keeps the Reference when its URL is not in the Sources list", async () => {
    const q = makeQuestion({
      explanation: {
        correct: "A list shows records from a table, unlike https://example.org/forms which shows one.",
        wrongAnswers: [
          { choiceId: "a", explanation: "A single record is shown on a form.", reference: "https://example.org/forms" },
          { choiceId: "c", explanation: "Lists show all configured fields.", reference: "ServiceNow Docs - Lists" },
          { choiceId: "d", explanation: "Properties live elsewhere.", reference: "" },
        ],
      },
    });
    // The URL is linked inline in the explanation, so it is not in Sources.
    const first = await answerWrong(q, "a");
    expect(first.container.textContent).toContain("Reference: example.org/forms");
    first.unmount();
    // Plain-text references are never in Sources.
    const second = await answerWrong(q, "c");
    expect(second.container.textContent).toContain("Reference: ServiceNow Docs - Lists");
  });

  it("works the same on server-prepared questions (sources passed separately)", async () => {
    const prepared = withExplanationSources(question);
    expect(prepared.explanation.correct).toBe("A list shows records from a table.");
    const { container } = await answerWrong(prepared, "a");
    expect(container.textContent).not.toContain("See: https://");
    expect(container.textContent).not.toContain("Reference:");
    expect(container.textContent).toContain("ServiceNow Docs: Lists");
    expect(container.textContent).toContain("ServiceNow Docs: Forms");
  });
});
