import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DeltaExamPage, { generateMetadata } from "@/app/[slug]/delta/[release]/page";
import sitemap from "@/app/sitemap";
import { FREE_DELTA, getAllDeltaSlugs, getCertificationBySlug, getDeltaReleases, getPublicDeltaQuestions } from "@/lib/data";
import { isIndexableDeltaPage, robotsForDeltaPage } from "@/lib/seo-indexing";
import { findDeltaDuplicatesOfPaid, loadPremiumAndFreeQuestions } from "@/scripts/premium-leaks";
import type { Question } from "@/types";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn(), back: vi.fn(), forward: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

const FREE_STEM = "Which free Zurich delta fixture question is safe to publish on the public page";
// Flagged isFree: false in the fixture; delta questions are free regardless (FREE_DELTA).
const FLAGGED_STEM = "Which Zurich delta fixture question is flagged premium but still public";

function fixtureQuestion(id: string, stem: string, isFree: boolean): Question {
  return {
    id,
    certification: "cad",
    topic: "delta-zurich",
    type: "multiple_choice",
    question: stem,
    options: [
      { id: "a", text: "Option A" },
      { id: "b", text: "Option B" },
    ],
    correctAnswers: ["a"],
    explanation: { correct: `${stem} explanation text for the fixture`, wrongAnswers: [] },
    difficulty: "medium",
    isFree,
  } as unknown as Question;
}

// A paid certification's delta bank with one isFree and one isFree: false question.
vi.mock("@/data/questions/cad/delta-zurich.json", () => ({
  questions: [fixtureQuestion("cad-delta-fixture-free", FREE_STEM, true), fixtureQuestion("cad-delta-fixture-flagged", FLAGGED_STEM, false)],
}));

// Delta URLs as they were before multi-release support; these must not change.
const ZURICH_DELTA_CERTS = [
  "csa", "cad", "cta", "cis-df", "cis-itsm", "cis-csm", "cis-fsm", "cis-hr", "cis-discovery", "cis-sm",
  "cis-em", "cis-vr", "cis-sir", "cis-rc", "cis-tprm", "cis-sam", "cis-ham", "cis-spm", "cis-sp", "cis-pa",
];

const params = (slug: string, release: string) => ({ params: Promise.resolve({ slug, release }) });

describe("getAllDeltaSlugs (multiple releases per cert)", () => {
  it("emits one slug per cert per listed release", () => {
    const slugs = getAllDeltaSlugs();
    for (const certification of ZURICH_DELTA_CERTS) {
      expect(slugs.filter((s) => s.certification === certification).map((s) => s.release)).toEqual(["zurich", "brazil"]);
    }
    expect(new Set(slugs.map((s) => `${s.certification}/${s.release}`)).size).toBe(slugs.length);
  });

  it("keeps every Zurich slug exactly as before", () => {
    const zurich = getAllDeltaSlugs().filter((s) => s.release === "zurich");
    expect(zurich).toEqual(ZURICH_DELTA_CERTS.map((certification) => ({ certification, release: "zurich" })));
    // currentRelease still points at Zurich
    for (const slug of ZURICH_DELTA_CERTS) expect(getCertificationBySlug(slug)?.deltaExam?.currentRelease).toBe("Zurich");
  });

  it("falls back to currentRelease when releases is not set", () => {
    const cert = { ...getCertificationBySlug("csa")!, deltaExam: { isMainline: true, currentRelease: "Zurich" as const } };
    expect(getDeltaReleases(cert)).toEqual(["Zurich"]);
  });
});

describe("FREE_DELTA policy: delta questions are always free", () => {
  it("is enabled", () => {
    expect(FREE_DELTA).toBe(true);
  });

  it("returns every delta question on paid and free certs, ignoring isFree", async () => {
    const cad = await getPublicDeltaQuestions("cad", "zurich");
    expect(cad.map((q) => q.id)).toEqual(["cad-delta-fixture-free", "cad-delta-fixture-flagged"]);

    const csa = await getPublicDeltaQuestions("csa", "zurich");
    expect(csa.length).toBe(12);
  });

  it("renders delta questions flagged premium on the page", async () => {
    const { container } = render(await DeltaExamPage(params("cad", "zurich")));
    expect(container.innerHTML).toContain(FREE_STEM);
    expect(container.innerHTML).toContain(FLAGGED_STEM);
  });

  it("leak check flags a delta question that duplicates a paid practice question", async () => {
    const { premium } = await loadPremiumAndFreeQuestions();
    const paid = premium.find((q) => q.certification === "cad")!;
    // Same stem with different casing/punctuation still counts as a duplicate
    const copied = fixtureQuestion("cad-delta-copy", `  ${paid.question.toUpperCase()}!! `, true);
    const duplicates = findDeltaDuplicatesOfPaid(
      [{ file: "cad/delta-zurich.json", questions: [fixtureQuestion("cad-delta-ok", FREE_STEM, true), copied] }],
      premium
    );
    expect(duplicates).toEqual([
      { deltaFile: "cad/delta-zurich.json", deltaQuestionId: "cad-delta-copy", premiumQuestionId: paid.id },
    ]);
  });

  it("leak check does not flag normal delta content", async () => {
    const { premium } = await loadPremiumAndFreeQuestions();
    const banks = [
      { file: "cad/delta-zurich.json", questions: [fixtureQuestion("a", FREE_STEM, true), fixtureQuestion("b", FLAGGED_STEM, false)] },
    ];
    expect(findDeltaDuplicatesOfPaid(banks, premium)).toEqual([]);
  });
});

describe("empty Brazil delta pages", () => {
  it("renders a placeholder and is noindexed", async () => {
    const { getByTestId } = render(await DeltaExamPage(params("csa", "brazil")));
    expect(getByTestId("delta-questions-placeholder").textContent).toBe(
      "Brazil delta practice questions are coming before the expected January 2027 window; official dates not yet announced."
    );

    for (const slug of ["csa", "cad"]) {
      const metadata = await generateMetadata(params(slug, "brazil"));
      expect(metadata.robots).toEqual({ index: false, follow: true });
    }
  });

  it("does not show the Zurich delta window or Zurich-only tips on the Brazil page", async () => {
    const { container } = render(await DeltaExamPage(params("csa", "brazil")));
    expect(container.innerHTML).not.toContain("2026-04-16");
    expect(container.innerHTML).not.toContain("What Reddit Says");
  });

  it("keeps /csa/delta/zurich indexable and only indexes delta pages with questions", async () => {
    expect((await generateMetadata(params("csa", "zurich"))).robots).toEqual({ index: true, follow: true });
    expect(isIndexableDeltaPage("csa", "zurich", 12)).toBe(true);
    expect(isIndexableDeltaPage("csa", "zurich", 0)).toBe(false);
    expect(isIndexableDeltaPage("csa", "brazil", 0)).toBe(false);
    expect(isIndexableDeltaPage("cad", "zurich", 6)).toBe(false); // not allowlisted
    expect(robotsForDeltaPage("csa", "brazil", 0)).toEqual({ index: false, follow: true });
  });

  it("excludes empty delta pages from the sitemap", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain("https://snready.com/csa/delta/zurich");
    expect(urls.some((url) => url.includes("/delta/brazil"))).toBe(false);
  });

  it("does not add the placeholder to Zurich pages without delta questions", async () => {
    expect(await getPublicDeltaQuestions("cta", "zurich")).toEqual([]);
    const { queryByTestId } = render(await DeltaExamPage(params("cta", "zurich")));
    expect(queryByTestId("delta-questions-placeholder")).toBeNull();
  });

  it("returns 404 for releases a cert has no delta page for", async () => {
    await expect(DeltaExamPage(params("csa", "australia"))).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
