import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { onRequestGet } from "@/functions/api/questions";
import { hasCertificationAccess } from "@/functions/lib/access";
import { getQuestions } from "@/functions/lib/question-bank";
import { renderQuestionBank } from "@/scripts/generate-question-bank";
import {
  getAllQuestionsForCertification,
  getCertificationSlugs,
  getFreeQuestionsForCertification,
  getFreeQuestionsForTopic,
  getQuestionsForTopic,
  getTopicsForCertification,
} from "@/lib/data";

const DAY = 24 * 60 * 60 * 1000;

function kvStore(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  return {
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    put: vi.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    delete: vi.fn(async (key: string) => {
      store.delete(key);
    }),
  } as unknown as KVNamespace;
}

function session(email = "buyer@example.com", expiresAt = Date.now() + DAY) {
  return JSON.stringify({ email, createdAt: Date.now(), expiresAt });
}

function access(overrides: Record<string, unknown> = {}) {
  return JSON.stringify({
    paid: true,
    plan: "single",
    expiresAt: Date.now() + 365 * DAY,
    certification: "CAD",
    certifications: ["CAD"],
    ...overrides,
  });
}

function call(query: string, { cookie, kv }: { cookie?: string; kv?: KVNamespace } = {}) {
  const headers = new Headers();
  if (cookie) headers.set("Cookie", cookie);
  return onRequestGet({
    request: new Request(`https://snready.com/api/questions${query}`, { headers }),
    env: { SNREADY_ACCESS: kv ?? kvStore() },
  } as Parameters<typeof onRequestGet>[0]);
}

const COOKIE = "snready_session=token-1";

describe("premium questions Pages Function", () => {
  it("rejects requests without a certification", async () => {
    const response = await call("");
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ code: "missing_certification" });
  });

  it("rejects unknown certifications and topics before touching KV", async () => {
    const kv = kvStore();
    expect((await call("?cert=nope", { kv })).status).toBe(404);
    const topicResponse = await call("?cert=cad&topic=nope", { kv });
    expect(topicResponse.status).toBe(404);
    expect(await topicResponse.json()).toMatchObject({ code: "unknown_topic" });
    expect(kv.get).not.toHaveBeenCalled();
  });

  it("rejects invalid scopes", async () => {
    const response = await call("?cert=cad&scope=everything");
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ code: "invalid_scope" });
  });

  it("returns 401 without a session cookie", async () => {
    const response = await call("?cert=cad");
    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ code: "not_authenticated" });
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  });

  it("returns 401 for unknown, malformed, or expired sessions", async () => {
    expect((await call("?cert=cad", { cookie: COOKIE, kv: kvStore() })).status).toBe(401);
    expect((await call("?cert=cad", { cookie: COOKIE, kv: kvStore({ "session:token-1": "{not json" }) })).status).toBe(401);
    const expired = kvStore({
      "session:token-1": session("buyer@example.com", Date.now() - 1000),
      "access:buyer@example.com": access(),
    });
    expect((await call("?cert=cad", { cookie: COOKIE, kv: expired })).status).toBe(401);
  });

  it("returns 403 when the signed-in user has no purchase", async () => {
    const kv = kvStore({ "session:token-1": session() });
    const response = await call("?cert=cad", { cookie: COOKIE, kv });
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ code: "no_access" });
  });

  it("returns 403 for a single-cert purchase of a different certification", async () => {
    const kv = kvStore({
      "session:token-1": session(),
      "access:buyer@example.com": access({ certification: "CSA", certifications: ["CSA"] }),
    });
    const response = await call("?cert=cad", { cookie: COOKIE, kv });
    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body).not.toHaveProperty("questions");
  });

  it("returns 403 for unpaid or expired access records", async () => {
    const unpaid = kvStore({ "session:token-1": session(), "access:buyer@example.com": access({ paid: false }) });
    expect((await call("?cert=cad", { cookie: COOKIE, kv: unpaid })).status).toBe(403);
    const expired = kvStore({ "session:token-1": session(), "access:buyer@example.com": access({ expiresAt: Date.now() - 1000 }) });
    expect((await call("?cert=cad", { cookie: COOKIE, kv: expired })).status).toBe(403);
  });

  it("returns only premium questions for a purchased certification", async () => {
    const kv = kvStore({ "session:token-1": session(), "access:buyer@example.com": access() });
    const response = await call("?cert=cad", { cookie: COOKIE, kv });
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");

    const body = await response.json() as { questions: Array<{ id: string; correctAnswers: string[] }>; count: number };
    const all = await getAllQuestionsForCertification("cad");
    const free = await getFreeQuestionsForCertification("cad");
    const freeIds = new Set(free.map((question) => question.id));

    expect(body.count).toBe(all.length - free.length);
    expect(body.questions.map((question) => question.id)).toEqual(all.filter((question) => !freeIds.has(question.id)).map((question) => question.id));
    expect(body.questions.some((question) => freeIds.has(question.id))).toBe(false);
    expect(body.questions[0].correctAnswers.length).toBeGreaterThan(0);
  });

  it("matches purchased certifications case-insensitively (checkout stores uppercase)", async () => {
    const kv = kvStore({
      "session:token-1": session(),
      "access:buyer@example.com": access({ certification: "CIS-DISCOVERY", certifications: ["CSA", "CIS-DISCOVERY"] }),
    });
    expect((await call("?cert=cis-discovery", { cookie: COOKIE, kv })).status).toBe(200);
    expect((await call("?cert=csa", { cookie: COOKIE, kv })).status).toBe(200);
    expect((await call("?cert=cad", { cookie: COOKIE, kv })).status).toBe(403);
  });

  it("grants every certification for the all-access plan", async () => {
    const kv = kvStore({
      "session:token-1": session(),
      "access:buyer@example.com": access({ plan: "all", certification: "ALL", certifications: [] }),
    });
    expect((await call("?cert=cad", { cookie: COOKIE, kv })).status).toBe(200);
    expect((await call("?cert=cis-df", { cookie: COOKIE, kv })).status).toBe(200);
  });

  it("supports legacy access records stored under the bare email key", async () => {
    const kv = kvStore({ "session:token-1": session(), "buyer@example.com": access({ certifications: undefined }) });
    expect((await call("?cert=cad", { cookie: COOKIE, kv })).status).toBe(200);
  });

  it("filters by topic, mirroring the static topic page split", async () => {
    const kv = kvStore({ "session:token-1": session(), "access:buyer@example.com": access() });
    const response = await call("?cert=cad&topic=business-rules", { cookie: COOKIE, kv });
    const body = await response.json() as { questions: Array<{ id: string }>; topic: string };
    const all = await getQuestionsForTopic("cad", "business-rules");
    const free = await getFreeQuestionsForTopic("cad", "business-rules");
    expect(body.topic).toBe("business-rules");
    expect(body.questions.map((question) => question.id)).toEqual(all.slice(free.length).map((question) => question.id));
  });

  it("returns free and premium questions for scope=all (mock exams)", async () => {
    const kv = kvStore({ "session:token-1": session(), "access:buyer@example.com": access() });
    const response = await call("?cert=cad&scope=all", { cookie: COOKIE, kv });
    const body = await response.json() as { questions: Array<{ id: string }> };
    const all = await getAllQuestionsForCertification("cad");
    expect(body.questions).toHaveLength(all.length);
  });

  it("returns 503 when the KV binding is missing", async () => {
    const response = await onRequestGet({
      request: new Request("https://snready.com/api/questions?cert=cad", { headers: { Cookie: COOKIE } }),
      env: {},
    } as unknown as Parameters<typeof onRequestGet>[0]);
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ code: "access_not_configured" });
  });
});

describe("hasCertificationAccess", () => {
  const base = { paid: true, plan: "single", expiresAt: Date.now() + DAY };

  it("requires an active paid record", () => {
    expect(hasCertificationAccess(null, "cad")).toBe(false);
    expect(hasCertificationAccess({ ...base, paid: false, certifications: ["CAD"] }, "cad")).toBe(false);
    expect(hasCertificationAccess({ ...base, expiresAt: Date.now() - 1, certifications: ["CAD"] }, "cad")).toBe(false);
  });

  it("falls back to the legacy single certification field", () => {
    expect(hasCertificationAccess({ ...base, certification: "CAD" }, "cad")).toBe(true);
    expect(hasCertificationAccess({ ...base, certification: "CAD" }, "csa")).toBe(false);
  });

  it("does not treat a single-plan 'all' certification label as all-access", () => {
    expect(hasCertificationAccess({ ...base, certification: "all", certifications: ["all"] }, "cad")).toBe(false);
  });
});

describe("server question bank parity with static pages", () => {
  it("serves exactly the questions the static pages omit, for every certification and topic", async () => {
    for (const cert of getCertificationSlugs()) {
      const all = await getAllQuestionsForCertification(cert);
      const free = await getFreeQuestionsForCertification(cert);
      const freeIds = new Set(free.map((question) => question.id));
      expect(getQuestions(cert).map((question) => question.id), cert).toEqual(all.filter((question) => !freeIds.has(question.id)).map((question) => question.id));
      expect(getQuestions(cert, { scope: "all" }), cert).toHaveLength(all.length);

      for (const topic of getTopicsForCertification(cert)) {
        const topicAll = await getQuestionsForTopic(cert, topic.slug);
        const topicFree = await getFreeQuestionsForTopic(cert, topic.slug);
        expect(getQuestions(cert, { topic: topic.slug }).map((question) => question.id), `${cert}/${topic.slug}`).toEqual(topicAll.slice(topicFree.length).map((question) => question.id));
      }
    }
  });
});

describe("generated question bank import map", () => {
  it("is up to date with data/topics (run npm run generate:question-bank)", () => {
    const committed = fs.readFileSync(path.join(process.cwd(), "functions/lib/question-bank.generated.ts"), "utf8");
    expect(committed).toBe(renderQuestionBank());
  });
});
