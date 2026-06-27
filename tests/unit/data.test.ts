import { describe, expect, it } from "vitest";
import { FREE_QUESTIONS_PER_CERT, getAllCertifications, getAllQuestionsForCertification, getAllTopicSlugs, getCertificationBySlug, getCertificationSlugs, getFreeQuestionCountForTopic, getFreeQuestionsForTopic, getQuestionsForTopic, getTopicBySlug, getTopicsForCertification } from "@/lib/data";

describe("production data access", () => {
  it("resolves known certifications and safely handles unknown slugs", () => {
    const certifications = getAllCertifications();
    const slugs = getCertificationSlugs();
    expect(certifications.length).toBeGreaterThan(0);
    expect(slugs).toContain("csa");
    expect(slugs).toContain("cis-df");
    expect(slugs).toContain("cad");
    expect(getCertificationBySlug("csa")?.fullName).toMatch(/System Administrator/i);
    expect(getCertificationBySlug("does-not-exist")).toBeUndefined();
  });
  it("loads topics for question-ready certifications", () => {
    const csaTopics = getTopicsForCertification("csa");
    expect(csaTopics.length).toBeGreaterThan(0);
    expect(csaTopics[0]).toMatchObject({ certification: "csa" });
    expect(getTopicBySlug("csa", "ui-navigation")?.name).toMatch(/User Interface/i);
    expect(getTopicsForCertification("does-not-exist")).toEqual([]);
    expect(getAllTopicSlugs()).toContainEqual({ certification: "csa", topic: "ui-navigation" });
  });
  it("loads questions and preserves the free-question boundary", async () => {
    const questions = await getQuestionsForTopic("csa", "ui-navigation");
    const freeQuestions = await getFreeQuestionsForTopic("csa", "ui-navigation");
    const freeCount = getFreeQuestionCountForTopic("csa", "ui-navigation");
    expect(questions.length).toBeGreaterThan(0);
    expect(freeQuestions).toHaveLength(freeCount);
    expect(freeQuestions.length).toBeLessThan(questions.length);
    expect(freeQuestions.length).toBeLessThanOrEqual(FREE_QUESTIONS_PER_CERT);
    expect(freeQuestions.map((q) => q.id)).toEqual(questions.slice(0, freeCount).map((q) => q.id));
  });
  it("aggregates all certification questions without returning questions for unknown certs", async () => {
    const csaQuestions = await getAllQuestionsForCertification("csa");
    expect(csaQuestions.length).toBeGreaterThan(100);
    expect(csaQuestions.every((q) => q.certification === "csa")).toBe(true);
    expect(await getAllQuestionsForCertification("does-not-exist")).toEqual([]);
  });
});
