import { describe, expect, it } from "vitest";
import { getCertificationSlugs, getFreeQuestionsForCertification, getAllQuestionsForCertification, isCertificationReady } from "@/lib/data";
import { createMockExamSession } from "@/lib/mockExam";
import { isPositionalOption, letterForOptionId, optionLetter, orderOptionsForQuestion, shuffleOptions } from "@/lib/option-order";
import type { Question } from "@/types";

const options = [
  { id: "a", text: "First" },
  { id: "b", text: "Second" },
  { id: "c", text: "Third" },
  { id: "d", text: "Fourth" },
];

function correctLetter(question: Question): string {
  const ordered = orderOptionsForQuestion(question.id, question.options);
  return letterForOptionId(ordered, question.correctAnswers[0]);
}

describe("deterministic option order", () => {
  it("returns the same order for the same question id (stable SSR/hydration)", () => {
    const first = orderOptionsForQuestion("csa-ui-navigation-001", options);
    const second = orderOptionsForQuestion("csa-ui-navigation-001", [...options]);
    expect(second).toEqual(first);
  });

  it("is a permutation: keeps every option id and text, does not mutate the input", () => {
    const input = options.map((option) => ({ ...option }));
    const ordered = orderOptionsForQuestion("cad-business-rules-007", input);
    expect(input).toEqual(options);
    expect([...ordered].sort((x, y) => x.id.localeCompare(y.id))).toEqual(options);
  });

  it("varies the order across question ids", () => {
    const orders = new Set(
      Array.from({ length: 40 }, (_, i) => orderOptionsForQuestion(`q-${i}`, options).map((o) => o.id).join(""))
    );
    expect(orders.size).toBeGreaterThan(5);
  });

  it("keeps 'All of the above'-style options last", () => {
    const withAll = [...options.slice(0, 3), { id: "d", text: "All of the above" }];
    for (let i = 0; i < 25; i++) {
      expect(orderOptionsForQuestion(`all-${i}`, withAll)[3].id).toBe("d");
      expect(shuffleOptions(withAll)[3].id).toBe("d");
    }
    expect(isPositionalOption("None of the above")).toBe(true);
    expect(isPositionalOption("Above the fold")).toBe(false);
  });

  it("maps option ids to positional letters", () => {
    const ordered = [options[2], options[0], options[3], options[1]];
    expect(optionLetter(0)).toBe("A");
    expect(letterForOptionId(ordered, "b")).toBe("D");
    expect(letterForOptionId(ordered, "c")).toBe("A");
  });
});

describe("correct-answer letter balance in the real question bank", () => {
  it("spreads single-answer, 4-option correct answers across A-D (each 15-35%)", async () => {
    const counts: Record<string, number> = {};
    let total = 0;
    for (const slug of getCertificationSlugs()) {
      if (!isCertificationReady(slug)) continue;
      for (const question of await getAllQuestionsForCertification(slug)) {
        if (question.type !== "multiple_choice" || question.correctAnswers.length !== 1 || question.options.length !== 4) continue;
        const letter = correctLetter(question);
        counts[letter] = (counts[letter] ?? 0) + 1;
        total++;
      }
    }
    expect(total).toBeGreaterThan(500);
    for (const letter of ["A", "B", "C", "D"]) {
      const share = (counts[letter] ?? 0) / total;
      expect(share, `share of ${letter}`).toBeGreaterThanOrEqual(0.15);
      expect(share, `share of ${letter}`).toBeLessThanOrEqual(0.35);
    }
  });

  it("does not show B as the dominant letter on the free (static HTML) questions", async () => {
    const counts: Record<string, number> = {};
    let total = 0;
    for (const slug of getCertificationSlugs()) {
      if (!isCertificationReady(slug)) continue;
      for (const question of await getFreeQuestionsForCertification(slug)) {
        if (question.type !== "multiple_choice" || question.correctAnswers.length !== 1 || question.options.length !== 4) continue;
        const letter = correctLetter(question);
        counts[letter] = (counts[letter] ?? 0) + 1;
        total++;
      }
    }
    expect(total).toBeGreaterThan(100);
    expect((counts.B ?? 0) / total).toBeLessThanOrEqual(0.4);
  });
});

describe("mock exam sessions", () => {
  it("keeps answers keyed by option id after shuffling options", async () => {
    const questions = await getAllQuestionsForCertification("csa");
    const session = createMockExamSession(
      { certSlug: "csa", certName: "CSA", questionCount: 30, durationMinutes: 60, passingScore: 70 },
      questions
    );
    const byId = new Map(questions.map((q) => [q.id, q]));
    for (const q of session.questions) {
      const original = byId.get(q.id)!;
      expect(q.correctAnswers).toEqual(original.correctAnswers);
      expect([...q.options].sort((x, y) => x.id.localeCompare(y.id))).toEqual(
        original.options.map((o) => ({ id: o.id, text: o.text })).sort((x, y) => x.id.localeCompare(y.id))
      );
      for (const answer of q.correctAnswers) {
        expect(q.options.some((o) => o.id === answer)).toBe(true);
      }
    }
  });
});
