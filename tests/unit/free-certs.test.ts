import { describe, expect, it } from "vitest";
import { FREE_CERTIFICATIONS, isFreeCertification } from "@/lib/free-certs";
import {
  FREE_QUESTIONS_PER_CERT,
  getAllQuestionsForCertification,
  getFreeQuestionCountForTopic,
  getFreeQuestionsForCertification,
  getFreeQuestionsForTopic,
  getPricingSummary,
  getQuestionsForTopic,
  getTopicsForCertification,
  getTotalFreeQuestionCount,
  getTotalQuestionCount,
  isCertificationFree,
  isCertificationReady,
  getAllCertifications,
} from "@/lib/data";
import { getQuestions, isCertificationFree as isCertificationFreeServer } from "@/functions/lib/question-bank";

describe("free certification flag (lib/free-certs.ts)", () => {
  it("makes CSA free and nothing else", () => {
    expect(FREE_CERTIFICATIONS).toEqual(["csa"]);
    expect(isFreeCertification("csa")).toBe(true);
    expect(isFreeCertification("CSA")).toBe(true);
    expect(isFreeCertification(" Csa ")).toBe(true);
    expect(isFreeCertification("cad")).toBe(false);
    expect(isFreeCertification("cis-itsm")).toBe(false);
    expect(isFreeCertification("")).toBe(false);
    expect(isFreeCertification(undefined)).toBe(false);
    expect(isFreeCertification(null)).toBe(false);
  });

  it("agrees between the static site and the Pages Functions for every certification", () => {
    for (const cert of getAllCertifications()) {
      expect(isCertificationFreeServer(cert.slug), cert.slug).toBe(isCertificationFree(cert.slug));
    }
  });
});

describe("free certification data access", () => {
  it("treats every CSA question as free on topic pages, without touching question isFree flags", async () => {
    for (const topic of getTopicsForCertification("csa")) {
      const all = await getQuestionsForTopic("csa", topic.slug);
      const free = await getFreeQuestionsForTopic("csa", topic.slug);
      expect(free.map((q) => q.id), topic.slug).toEqual(all.map((q) => q.id));
      expect(getFreeQuestionCountForTopic("csa", topic.slug), topic.slug).toBe(topic.questionCount);
    }
    const allCsa = await getAllQuestionsForCertification("csa");
    expect((await getFreeQuestionsForCertification("csa")).length).toBe(allCsa.length);
    expect(getTotalFreeQuestionCount("csa")).toBe(getTotalQuestionCount("csa"));
  });

  it("keeps the 15-question limit for paid certifications", async () => {
    expect(getTotalFreeQuestionCount("cad")).toBe(FREE_QUESTIONS_PER_CERT);
    const free = await getFreeQuestionsForCertification("cad");
    const all = await getAllQuestionsForCertification("cad");
    expect(free).toHaveLength(FREE_QUESTIONS_PER_CERT);
    expect(free.length).toBeLessThan(all.length);
  });

  it("serves no premium-scope CSA questions from the API bank, but the full pool for mock exams", async () => {
    expect(getQuestions("csa")).toEqual([]);
    expect(getQuestions("csa", { topic: "ui-navigation" })).toEqual([]);
    expect(getQuestions("csa", { scope: "all" })).toHaveLength((await getAllQuestionsForCertification("csa")).length);
    expect(getQuestions("cad").length).toBeGreaterThan(0);
  });

  it("computes the pricing summary honestly from the data", () => {
    const summary = getPricingSummary();
    const ready = getAllCertifications().filter((cert) => isCertificationReady(cert.slug));
    expect(summary.readyCount).toBe(ready.length);
    expect(summary.freeCertifications).toEqual([{ slug: "csa", name: "CSA" }]);
    expect(summary.paidCount).toBe(ready.length - 1);
    const expectedFree = ready.reduce(
      (sum, cert) => sum + (cert.slug === "csa" ? getTotalQuestionCount("csa") : Math.min(FREE_QUESTIONS_PER_CERT, getTotalQuestionCount(cert.slug))),
      0
    );
    expect(summary.totalFreeQuestions).toBe(expectedFree);
    expect(summary.totalFreeQuestions).toBeGreaterThan(300);
  });
});
