import fs from "node:fs";
import path from "node:path";
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

const FREE_STEM = "Which free Brazil delta fixture question is safe to publish on the public page";
// Flagged isFree: false in the fixture; delta questions are free regardless (FREE_DELTA).
const FLAGGED_STEM = "Which Brazil delta fixture question is flagged premium but still public";

function fixtureQuestion(id: string, stem: string, isFree: boolean): Question {
  return {
    id,
    certification: "cad",
    topic: "delta-brazil",
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
vi.mock("@/data/questions/cad/delta-brazil.json", () => ({
  questions: [fixtureQuestion("cad-delta-fixture-free", FREE_STEM, true), fixtureQuestion("cad-delta-fixture-flagged", FLAGGED_STEM, false)],
}));

// Every cert that had a Zurich delta page; each now has a Brazil page and a 301 from Zurich.
const DELTA_CERTS = [
  "csa", "cad", "cta", "cis-df", "cis-itsm", "cis-csm", "cis-fsm", "cis-hr", "cis-discovery", "cis-sm",
  "cis-em", "cis-vr", "cis-sir", "cis-rc", "cis-tprm", "cis-sam", "cis-ham", "cis-spm", "cis-sp", "cis-pa",
];
// Certs with Brazil delta questions (indexable); the rest show a noindexed placeholder.
const BRAZIL_QUESTION_CERTS = ["csa", "cad", "cis-df", "cis-itsm"];

const params = (slug: string, release: string) => ({ params: Promise.resolve({ slug, release }) });

describe("getAllDeltaSlugs (Brazil is the current delta release)", () => {
  it("emits exactly one Brazil slug per delta cert and no Zurich slugs", () => {
    const slugs = getAllDeltaSlugs();
    expect(slugs).toEqual(DELTA_CERTS.map((certification) => ({ certification, release: "brazil" })));
    for (const slug of DELTA_CERTS) {
      const deltaExam = getCertificationBySlug(slug)?.deltaExam;
      expect(deltaExam?.currentRelease).toBe("Brazil");
      expect(deltaExam?.previousRelease).toBe("Zurich");
      // The Brazil window is not announced yet
      expect(deltaExam?.deltaWindow).toBeUndefined();
    }
  });

  it("falls back to currentRelease when releases is not set", () => {
    const cert = { ...getCertificationBySlug("csa")!, deltaExam: { isMainline: true, currentRelease: "Brazil" as const } };
    expect(getDeltaReleases(cert)).toEqual(["Brazil"]);
  });

  it("has no Zurich delta question files left", () => {
    const dir = path.join(process.cwd(), "data/questions");
    for (const cert of fs.readdirSync(dir)) {
      expect(fs.existsSync(path.join(dir, cert, "delta-zurich.json"))).toBe(false);
    }
  });
});

describe("Zurich delta redirects", () => {
  const redirects = fs.readFileSync(path.join(process.cwd(), "public/_redirects"), "utf8").split("\n");

  it("301s every former Zurich delta page to its Brazil page", () => {
    for (const slug of DELTA_CERTS) {
      expect(redirects).toContain(`/${slug}/delta/zurich /${slug}/delta/brazil 301`);
    }
  });

  it("points legacy /delta/{cert}-zurich URLs straight at Brazil (no chains)", () => {
    for (const slug of DELTA_CERTS) {
      expect(redirects).toContain(`/delta/${slug}-zurich /${slug}/delta/brazil 301`);
    }
    expect(redirects.some((line) => / \/[a-z-]+\/delta\/zurich 301$/.test(line))).toBe(false);
  });

  it("returns 404 for the retired Zurich delta route", async () => {
    await expect(DeltaExamPage(params("csa", "zurich"))).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

describe("FREE_DELTA policy: delta questions are always free", () => {
  it("is enabled", () => {
    expect(FREE_DELTA).toBe(true);
  });

  it("returns every delta question on paid and free certs, ignoring isFree", async () => {
    const cad = await getPublicDeltaQuestions("cad", "brazil");
    expect(cad.map((q) => q.id)).toEqual(["cad-delta-fixture-free", "cad-delta-fixture-flagged"]);

    const csa = await getPublicDeltaQuestions("csa", "brazil");
    expect(csa.length).toBeGreaterThanOrEqual(15);
    expect(csa.every((q) => q.isFree === true)).toBe(true);
  });

  it("renders delta questions flagged premium on the page", async () => {
    const { container } = render(await DeltaExamPage(params("cad", "brazil")));
    expect(container.innerHTML).toContain(FREE_STEM);
    expect(container.innerHTML).toContain(FLAGGED_STEM);
  });

  it("leak check flags a delta question that duplicates a paid practice question", async () => {
    const { premium } = await loadPremiumAndFreeQuestions();
    const paid = premium.find((q) => q.certification === "cad")!;
    // Same stem with different casing/punctuation still counts as a duplicate
    const copied = fixtureQuestion("cad-delta-copy", `  ${paid.question.toUpperCase()}!! `, true);
    const duplicates = findDeltaDuplicatesOfPaid(
      [{ file: "cad/delta-brazil.json", questions: [fixtureQuestion("cad-delta-ok", FREE_STEM, true), copied] }],
      premium
    );
    expect(duplicates).toEqual([
      { deltaFile: "cad/delta-brazil.json", deltaQuestionId: "cad-delta-copy", premiumQuestionId: paid.id },
    ]);
  });

  it("leak check does not flag normal delta content", async () => {
    const { premium } = await loadPremiumAndFreeQuestions();
    const banks = [
      { file: "cad/delta-brazil.json", questions: [fixtureQuestion("a", FREE_STEM, true), fixtureQuestion("b", FLAGGED_STEM, false)] },
    ];
    expect(findDeltaDuplicatesOfPaid(banks, premium)).toEqual([]);
  });
});

describe("Brazil delta pages with questions", () => {
  it("are indexable and render their questions without a placeholder", async () => {
    for (const slug of BRAZIL_QUESTION_CERTS) {
      expect((await getPublicDeltaQuestions(slug, "brazil")).length).toBeGreaterThan(0);
      expect((await generateMetadata(params(slug, "brazil"))).robots).toEqual({ index: true, follow: true });
    }
    const { container, queryByTestId } = render(await DeltaExamPage(params("csa", "brazil")));
    expect(queryByTestId("delta-questions-placeholder")).toBeNull();
    expect(container.innerHTML).toContain("Free Brazil Delta Practice Questions");
  });

  it("are listed in the sitemap", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    for (const slug of BRAZIL_QUESTION_CERTS) expect(urls).toContain(`https://snready.com/${slug}/delta/brazil`);
    expect(urls.some((url) => url.includes("/delta/zurich"))).toBe(false);
  });

  it("do not show the old Zurich window or Zurich-era Reddit tips", async () => {
    const { container } = render(await DeltaExamPage(params("csa", "brazil")));
    expect(container.innerHTML).not.toContain("2026-04-16");
    expect(container.innerHTML).not.toContain("What Reddit Says");
    expect(container.innerHTML).not.toContain("/delta/zurich");
  });
});

describe("empty Brazil delta pages", () => {
  it("render a placeholder and are noindexed", async () => {
    expect(await getPublicDeltaQuestions("cta", "brazil")).toEqual([]);
    const { getByTestId } = render(await DeltaExamPage(params("cta", "brazil")));
    expect(getByTestId("delta-questions-placeholder").textContent).toBe(
      "Brazil delta practice questions are coming before the expected January 2027 window; official dates not yet announced."
    );
    expect((await generateMetadata(params("cta", "brazil"))).robots).toEqual({ index: false, follow: true });
  });

  it("are noindexed even if allowlisted, and kept out of the sitemap", async () => {
    expect(isIndexableDeltaPage("csa", "brazil", 0)).toBe(false);
    expect(robotsForDeltaPage("csa", "brazil", 0)).toEqual({ index: false, follow: true });
    const urls = (await sitemap()).map((entry) => entry.url);
    for (const slug of DELTA_CERTS.filter((s) => !BRAZIL_QUESTION_CERTS.includes(s))) {
      expect(urls).not.toContain(`https://snready.com/${slug}/delta/brazil`);
    }
  });

  it("returns 404 for releases a cert has no delta page for", async () => {
    await expect(DeltaExamPage(params("csa", "australia"))).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
