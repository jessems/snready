import { describe, expect, it } from "vitest";
import { parseCsv } from "@/pipeline/lib/csv";
import { factId, identityFor, instanceIdFor } from "@/pipeline/lib/ids";
import { containsQuote, tokens } from "@/pipeline/lib/text";
import type { Fact, Template } from "@/pipeline/lib/types";
import { splitMarkdown } from "@/pipeline/stages/s4-chunk";
import { rejectFact } from "@/pipeline/stages/s5-facts";
import { parseBlueprintSamples } from "@/pipeline/stages/s6a-samples";
import { ORIGIN_DIRS, dedupe, observedItemId } from "@/pipeline/stages/s7-observed";
import { normalizeTemplate, rejectTemplate } from "@/pipeline/stages/s8b-templates";
import { checkParameterization, impliedAnswer } from "@/pipeline/stages/s8e-parameterize";
import { apportion, buildObservedPlan, buildPlan } from "@/pipeline/stages/s9-plan";
import { buildOptions, isGiveaway, renderStem, valueShape } from "@/pipeline/stages/s10-instantiate";
import { validateWritten } from "@/pipeline/stages/s11-write";

const fact = (over: Partial<Fact>): Fact => {
  const base = { factType: "role_permission", subject: "Do a thing", relation: "requires_role", value: "admin", ...over };
  return {
    factId: factId(base),
    quote: "",
    chunkId: "c",
    sourceUrl: "https://www.servicenow.com/docs/r/australia/x.html",
    release: "australia",
    domainIds: ["csa.d1"],
    objectiveIds: [],
    ...base,
  } as Fact;
};

const template = (over: Partial<Template>): Template => ({
  templateId: "role_permission_lookup.t01",
  archetypeId: "role_permission_lookup",
  factType: "role_permission",
  relations: ["requires_role"],
  format: "multiple_choice",
  cognitiveLevel: "knowledge",
  answer: { mode: "single" },
  stems: ["Which role is needed to {subject}?"],
  optionCount: 4,
  ...over,
});

describe("identity", () => {
  it("gives the same factId regardless of whitespace, case, or set order", () => {
    const a = factId({ factType: "component_membership", subject: "ACL types", relation: "has_members", value: ["Allow If", "Deny Unless", "X"] });
    const b = factId({ factType: "component_membership", subject: "acl  types", relation: "has_members", value: ["deny unless", "X", "allow if"] });
    expect(a).toBe(b);
  });

  it("keeps order significant for ordered processes", () => {
    const a = factId({ factType: "ordered_process", subject: "P", relation: "has_steps_in_order", value: ["a", "b", "c"] });
    const b = factId({ factType: "ordered_process", subject: "P", relation: "has_steps_in_order", value: ["c", "b", "a"] });
    expect(a).not.toBe(b);
  });

  it("derives a deterministic instance per (template, fact) with family and knowledge keys", () => {
    const f = fact({});
    const id1 = identityFor(template({}), f);
    const id2 = identityFor(template({}), f);
    expect(id1).toEqual(id2);
    expect(id1.familyKey).toBe("role_permission_lookup.t01");
    expect(id1.knowledgeKeys).toEqual([f.factId]);
    expect(identityFor(template({ templateId: "role_permission_lookup.t02" }), f).instanceId).not.toBe(id1.instanceId);
  });
});

describe("text helpers", () => {
  it("matches quotes ignoring punctuation and accepts ... fragments", () => {
    const source = "Access is **denied** when no ACL matches. | Allow If | Deny Unless |";
    expect(containsQuote(source, "access is denied when no ACL matches")).toBe(true);
    expect(containsQuote(source, "Access is denied ... Deny Unless")).toBe(true);
    expect(containsQuote(source, "Access is granted")).toBe(false);
  });

  it("parses quoted CSV fields with commas", () => {
    expect(parseCsv('a,b\n1,"x, y"\n')).toEqual([{ a: "1", b: "x, y" }]);
  });

  it("splits markdown on headings and drops frontmatter", () => {
    const md = "---\ntitle: T\n---\n# T\n" + "intro ".repeat(50) + "\n## Part\n" + "body ".repeat(50);
    const sections = splitMarkdown(md);
    expect(sections.map((s) => s.heading)).toEqual(["T", "Part"]);
    expect(sections[0].text).not.toContain("title:");
  });

  it("classifies value shapes", () => {
    expect(valueShape("10")).toBe("numeric");
    expect(valueShape("glide.ui.foo")).toBe("identifier");
    expect(valueShape("security_admin")).toBe("identifier");
    expect(valueShape("Import set")).toBe("name");
  });
});

describe("fact validation", () => {
  const chunk = { chunkId: "c", text: "The knowledge_admin role can create knowledge bases. Types: Alpha, Beta, Gamma." } as never;

  it("accepts grounded facts and rejects ungrounded ones", () => {
    const raw = { chunkId: "c", factType: "role_permission", subject: "Create knowledge bases", value: "knowledge_admin", quote: "The knowledge_admin role can create knowledge bases" };
    expect(rejectFact(raw, chunk)).toBeNull();
    expect(rejectFact({ ...raw, quote: "made up" }, chunk)).toMatch(/quote/);
    expect(rejectFact({ ...raw, factType: "nope" }, chunk)).toMatch(/unknown factType/);
  });

  it("requires every list item to appear in the chunk", () => {
    const raw = { chunkId: "c", factType: "component_membership", subject: "Types", value: ["Alpha", "Beta", "Gamma"], quote: "Types" };
    expect(rejectFact(raw, chunk)).toBeNull();
    expect(rejectFact({ ...raw, value: ["Alpha", "Beta", "Delta"] }, chunk)).toMatch(/list item/);
  });
});

describe("observed corpus", () => {
  it("only reads official sources, never our own question bank", () => {
    expect(Object.keys(ORIGIN_DIRS).sort()).toEqual(["dump", "measureup", "sample"]);
  });

  it("dedupes near-identical items and prefers official samples", () => {
    const item = (origin: "sample" | "measureup" | "dump", stem: string) => ({
      itemId: observedItemId(stem, ["a", "b"]),
      cert: "csa",
      origin,
      originRef: origin,
      type: "multiple_choice",
      stem,
      options: ["a", "b"],
      correct: [0],
      domainHint: null,
    });
    const out = dedupe([item("dump", "Which role manages knowledge bases?"), item("sample", "Which role manages knowledge bases")]);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ origin: "sample", seenIn: 2 });
  });
});

describe("templates", () => {
  const ids = new Set(["role_permission_lookup", "choose_valid_components"]);

  it("accepts a well-formed template", () => {
    expect(rejectTemplate(template({}), ids)).toBeNull();
  });

  it("rejects mode/valueKind/format mismatches and missing slots", () => {
    expect(rejectTemplate(template({ answer: { mode: "members", correctCount: 2 } }), ids)).toMatch(/does not fit/);
    expect(rejectTemplate(template({ stems: ["Which role?"] }), ids)).toMatch(/\{subject\}/);
    expect(rejectTemplate(template({ answer: { mode: "reverse" }, stems: ["Who can {value}?"] }), ids)).toBeNull();
    expect(rejectTemplate(template({ format: "multiple_select" }), ids)).toMatch(/format/);
  });
});

describe("planning", () => {
  it("apportions integers that sum to the total", () => {
    expect(apportion(10, [7, 10, 20, 20, 30, 13])).toEqual([1, 1, 2, 2, 3, 1]);
    expect(apportion(5, [1, 1]).reduce((a, b) => a + b)).toBe(5);
    expect(apportion(5, [0, 0])).toEqual([0, 0]);
  });

  it("treats the target as bank size and subtracts what already exists", () => {
    const roles = ["admin", "itil", "knowledge_admin", "catalog_admin", "security_admin", "report_admin"].map((value, i) => fact({ subject: `Task ${i}`, value }));
    const blueprint = { cert: "csa", domains: [{ id: "csa.d1", number: 1, name: "D1", weight: 100, objectives: [] }] } as never;
    const distribution = { archetypes: [{ key: "role_permission_lookup", count: 1, share: 1 }], byDomain: {} } as never;
    const fresh = buildPlan(blueprint, distribution, [template({})], roles, new Set(), 4);
    expect(fresh.quotas[0].target).toBe(4);
    const topUp = buildPlan(blueprint, distribution, [template({})], roles, new Set(), 4, [
      { domainId: "csa.d1", archetypeId: "role_permission_lookup" },
      { domainId: "csa.d1", archetypeId: "role_permission_lookup" },
      { domainId: "csa.d1", archetypeId: "role_permission_lookup" },
    ]);
    expect(topUp.quotas[0].target).toBe(1);
  });
});

describe("instantiation", () => {
  const roles = ["admin", "itil", "knowledge_admin", "catalog_admin", "security_admin"].map((value, i) => fact({ subject: `Task ${i}`, value }));

  it("builds single-answer options from sibling values", () => {
    const options = buildOptions(template({}), roles[0], roles, "csa.d1", "seed")!;
    expect(options).toHaveLength(4);
    expect(options.filter((o) => o.correct).map((o) => o.text)).toEqual(["admin"]);
    expect(new Set(options.map((o) => o.text)).size).toBe(4);
  });

  it("returns null when there aren't enough distinct distractors", () => {
    expect(buildOptions(template({}), roles[0], roles.slice(0, 2), "csa.d1", "seed")).toBeNull();
  });

  it("builds non-member questions whose single correct answer is outside the set", () => {
    const sets = [
      fact({ factType: "component_membership", relation: "has_members", subject: "A", value: ["a1", "a2", "a3", "a4"] }),
      fact({ factType: "component_membership", relation: "has_members", subject: "B", value: ["b1", "b2", "b3"] }),
    ];
    const t = template({ templateId: "x.t01", factType: "component_membership", relations: ["has_members"], format: "multiple_choice_negative", answer: { mode: "non_member" } });
    const options = buildOptions(t, sets[0], sets, "csa.d1", "seed")!;
    const correct = options.filter((o) => o.correct);
    expect(correct).toHaveLength(1);
    expect(["b1", "b2", "b3"]).toContain(correct[0].text);
  });

  it("flags drafts where only the correct option echoes the stem", () => {
    const opts = (texts: string[]) => texts.map((text, i) => ({ text, correct: i === 0, factId: null }));
    expect(isGiveaway("Which feature converts homepages to dashboards?", opts(["Homepage deprecation tool", "Service Portal", "Flow Designer", "Studio"]))).toBe(true);
    expect(isGiveaway("Which feature converts homepages to dashboards?", opts(["Homepage deprecation tool", "Homepage splash", "Flow Designer", "Studio"]))).toBe(false);
  });

  it("drops the {context} phrase cleanly when a fact has none", () => {
    expect(renderStem("Which role ({context}) is needed to {subject}?", fact({ subject: "do X" }))).toBe("Which role is needed to do X?");
  });
});

describe("written question validation", () => {
  const draft = {
    options: [
      { id: "a", text: "knowledge_admin", correct: true, factId: null },
      { id: "b", text: "itil", correct: false, factId: null },
    ],
  } as never;
  const good = { instanceId: "i", verdict: "ok" as const, stem: "Which role creates knowledge bases?", explanation: { correct: "Because.", wrongAnswers: [{ choiceId: "b", explanation: "No." }] } };

  it("accepts a complete question", () => {
    expect(validateWritten(draft, good, [])).toBeNull();
  });

  it("rejects anything that resembles an official item, even reworded", () => {
    const official = [{ itemId: "o_off", origin: "measureup" as const, stem: tokens("Which role creates knowledge bases in ServiceNow?"), options: new Set(["knowledge admin", "itil"]) }];
    expect(validateWritten(draft, { ...good, stem: "In ServiceNow, which role creates knowledge bases?" }, official)).toMatch(/official item o_off/);
    expect(validateWritten(draft, { ...good, stem: "A team lead must set up a new knowledge base. Who can do it?" }, official)).toBeNull();
  });

  it("rejects stems that reveal the answer and incomplete wrong-answer explanations", () => {
    expect(validateWritten(draft, { ...good, stem: "Does knowledge_admin create knowledge bases?" }, [])).toMatch(/reveals/);
    expect(validateWritten(draft, { ...good, explanation: { correct: "x", wrongAnswers: [] } }, [])).toMatch(/wrongAnswers/);
  });
});

describe("parameterization of observed items", () => {
  const item = (stem: string, options: string[], correct: number[]) =>
    ({ itemId: "o_x", cert: "csa", origin: "dump", originRef: "d", type: "multiple_choice", stem, options, correct, domainHint: null }) as never;
  const tableTemplate = template({
    templateId: "entity_table_name_lookup.t01",
    archetypeId: "entity_table_name_lookup",
    factType: "entity_table_name",
    relations: ["stored_in_table"],
    stems: ["What is the table name for {subject}?"],
  });

  it("derives the answer per mode", () => {
    expect(impliedAnswer(tableTemplate, { subject: "roles", value: "sys_user_role" }, [])).toEqual(["sys_user_role"]);
    expect(impliedAnswer(template({ answer: { mode: "reverse" } }), { subject: "admin", value: "x" }, [])).toEqual(["admin"]);
    const nonMember = template({ answer: { mode: "non_member" }, format: "multiple_choice_negative" });
    expect(impliedAnswer(nonMember, { value: ["a", "b", "c"] }, ["a", "b", "z", "c"])).toEqual(["z"]);
  });

  it("checks the answer against the key, scores reconstruction, and grounds only exact facts", () => {
    const observed = item("What is the table name for roles?", ["sys_user", "sys_user_role", "sys_group", "task"], [1]);
    const docsFact = fact({ factType: "entity_table_name", relation: "stored_in_table", subject: "User role", value: "sys_user_role" });
    const ok = checkParameterization(observed, "entity_table_name_lookup", tableTemplate, { subject: "roles", value: "sys_user_role" }, [docsFact], docsFact.factId);
    expect(ok).toMatchObject({ answerConsistent: true, groundedFactId: docsFact.factId, linkedFactId: docsFact.factId });
    expect(ok.reconstruction).toBe(1);

    const wrong = checkParameterization(observed, "entity_table_name_lookup", tableTemplate, { subject: "roles", value: "sys_user" }, [docsFact], docsFact.factId);
    expect(wrong.answerConsistent).toBe(false);
    expect(wrong.groundedFactId).toBeNull(); // linked fact gives a different answer
  });

  it("normalizes common agent slips in proposed templates", () => {
    const t = normalizeTemplate(template({ cognitiveLevel: "comprehension" as never, answer: { mode: "members", correctCount: 2 }, stems: ["Pick {correctCount} for {subject}"] }));
    expect(t.cognitiveLevel).toBe("understanding");
    expect(t.stems[0]).toBe("Pick 2 for {subject}");
    expect(rejectTemplate(template({ stems: ["{subject} {count}"] }), new Set(["role_permission_lookup"]))).toMatch(/unknown slot/);
  });
});

describe("official sample parsing", () => {
  it("parses lettered items, multi-select keys written with 'and', and unlettered options", () => {
    const md = [
      "Sample Questions",
      "Sample Item #1",
      "Which fruits are red? (Choose four)",
      "A. Apple",
      "B. Banana",
      "C. Cherry",
      "D. Strawberry",
      "E. Lime",
      "F. Raspberry",
      "Answer: A, C, D, and F",
      "Sample Item #2",
      "Which helper is valid for Widget()?",
      "getAlpha()",
      "getBeta()",
      "Answer B",
    ].join("\n");
    const { items, warnings } = parseBlueprintSamples(md);
    expect(warnings).toEqual([]);
    expect(items[0]).toMatchObject({ format: "multiple_select", correct: [0, 2, 3, 5], chooseCount: 4 });
    expect(items[1]).toMatchObject({ format: "multiple_choice", options: ["getAlpha()", "getBeta()"], correct: [1] });
  });

  it("recognizes matching/ordering items instead of forcing them into options", () => {
    const { items } = parseBlueprintSamples(["Sample Questions", "Sample Question – #3", "Put the steps in sequential order.", "Option Text", "Correct Match", "A.", "First"].join("\n"));
    expect(items[0].format).toBe("matching");
  });
});

describe("plan:observed (derive from official items)", () => {
  const roles = ["admin", "itil", "knowledge_admin", "catalog_admin", "security_admin", "report_admin"].map((value, i) =>
    fact({ subject: `Task ${i}`, value, domainIds: ["csa.d1"] })
  );
  const single = template({ templateId: "role_permission_lookup.t01" });
  const scenario = template({ templateId: "role_permission_lookup.t02", stems: ["A colleague must {subject}. Which role do they need?"] });
  const officialFact = roles[2];
  const param = {
    itemId: "o_official",
    archetypeId: "role_permission_lookup",
    templateId: single.templateId,
    bindings: { subject: officialFact.subject, value: "knowledge_admin" },
    answer: ["knowledge_admin"],
    answerConsistent: true,
    reconstruction: 1,
    groundedFactId: officialFact.factId,
    linkedFactId: officialFact.factId,
  };

  it("makes same-template variants on other facts and same-fact restructures on other templates", () => {
    const taken = new Set([instanceIdFor(single.templateId, officialFact.factId)]); // the official item itself
    const plan = buildObservedPlan("csa", [param], [single, scenario], roles, taken, { variants: 2, restructures: 1 });
    const variants = plan.derived!.filter((d) => d.relation === "variant");
    const restructures = plan.derived!.filter((d) => d.relation === "restructure");
    expect(variants).toHaveLength(2);
    expect(variants.every((v) => v.templateId === single.templateId && v.factId !== officialFact.factId)).toBe(true);
    expect(restructures).toEqual([expect.objectContaining({ templateId: scenario.templateId, factId: officialFact.factId })]);
    expect(plan.derived!.some((d) => d.instanceId === instanceIdFor(single.templateId, officialFact.factId))).toBe(false);
  });

  it("prefers variant facts from the official fact's own product area", () => {
    const near = fact({ subject: "Manage article feedback", value: "kb_writer", sourceUrl: "https://www.servicenow.com/docs/r/australia/knowledge/a.html", domainIds: ["csa.d1"] });
    const own = { ...officialFact, sourceUrl: "https://www.servicenow.com/docs/r/australia/knowledge/b.html" };
    const pool = [...roles.filter((r) => r !== officialFact), own, near];
    const plan = buildObservedPlan("csa", [{ ...param, groundedFactId: own.factId, linkedFactId: own.factId }], [single], pool, new Set(), { variants: 1, restructures: 0 });
    expect(plan.derived![0].factId).toBe(near.factId);
  });

  it("reports a gap instead of restructuring when the item has no docs fact", () => {
    const plan = buildObservedPlan("csa", [{ ...param, groundedFactId: null, linkedFactId: null }], [single, scenario], roles, new Set(), { variants: 1, restructures: 1 });
    expect(plan.derived!.filter((d) => d.relation === "restructure")).toHaveLength(0);
    expect(plan.gaps.some((g) => /no docs fact/.test(g.reason))).toBe(true);
  });
});
