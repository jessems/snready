import { describe, expect, it } from "vitest";
import { selectDiverse, sequenceQuestions } from "@/lib/question-sequencing";

const q = (id: string, familyKey?: string, knowledgeKeys: string[] = [], instanceId = id) => ({
  id,
  ...(familyKey ? { identity: { instanceId, familyKey, knowledgeKeys } } : {}),
});

describe("selectDiverse", () => {
  it("never picks two renderings of one instance", () => {
    const picked = selectDiverse([q("a", "t1", ["f1"], "i1"), q("b", "t1", ["f1"], "i1"), q("c", "t2", ["f2"])], 3);
    expect(picked.map((x) => x.id)).toEqual(["a", "c"]);
  });

  it("prefers uncovered facts and only falls back to shared ones when short", () => {
    const pool = [q("a", "t1", ["f1"]), q("b", "t2", ["f1"]), q("c", "t3", ["f2"])];
    expect(selectDiverse(pool, 2).map((x) => x.id)).toEqual(["a", "c"]);
    expect(selectDiverse(pool, 3).map((x) => x.id)).toEqual(["a", "c", "b"]);
  });

  it("treats questions without identity as unique", () => {
    expect(selectDiverse([q("a"), q("b"), q("c")], 2).map((x) => x.id)).toEqual(["a", "b"]);
  });
});

describe("sequenceQuestions", () => {
  const rules = { familyGap: 2, knowledgeGap: 3 };

  it("spaces out questions from the same template", () => {
    const out = sequenceQuestions([q("a1", "A", ["fa1"]), q("a2", "A", ["fa2"]), q("b1", "B", ["fb1"]), q("c1", "C", ["fc1"])], rules);
    const positions = out.map((x) => x.id);
    expect(Math.abs(positions.indexOf("a1") - positions.indexOf("a2"))).toBeGreaterThan(rules.familyGap);
  });

  it("spaces out questions testing the same fact across templates", () => {
    const out = sequenceQuestions([q("x", "A", ["f"]), q("y", "B", ["f"]), q("p", "C", ["g"]), q("r", "D", ["h"]), q("s", "E", ["i"])], rules);
    const ids = out.map((x) => x.id);
    expect(ids.indexOf("y") - ids.indexOf("x")).toBeGreaterThan(rules.knowledgeGap);
  });

  it("keeps every question even when the rules cannot all be met", () => {
    const input = [q("a1", "A", ["f"]), q("a2", "A", ["f"]), q("a3", "A", ["f"])];
    expect(sequenceQuestions(input, rules).map((x) => x.id).sort()).toEqual(["a1", "a2", "a3"]);
  });

  it("preserves order when nothing conflicts", () => {
    const input = [q("a"), q("b", "B", ["f1"]), q("c", "C", ["f2"])];
    expect(sequenceQuestions(input, rules).map((x) => x.id)).toEqual(["a", "b", "c"]);
  });
});
