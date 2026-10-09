import { beforeEach, describe, expect, it, vi } from "vitest";
import { enqueuePurchaseFollowup, processDueFollowups } from "@/functions/lib/followup";

type MockKv = KVNamespace<string> & { store: Map<string, string> };

function kvStore(initial: Record<string, string> = {}): MockKv {
  const store = new Map(Object.entries(initial));
  return {
    store,
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    put: vi.fn(async (key: string, value: string) => { store.set(key, value); }),
    delete: vi.fn(async (key: string) => { store.delete(key); }),
    list: vi.fn(async ({ prefix = "" }: { prefix?: string } = {}) => ({
      keys: [...store.keys()].filter((key) => key.startsWith(prefix)).map((name) => ({ name })),
      list_complete: true,
      cursor: "",
      cacheStatus: null,
    })),
    getWithMetadata: vi.fn(),
  } as unknown as MockKv;
}

const env = (kv: MockKv) => ({
  SNREADY_ACCESS: kv,
  RESEND_API_KEY: "re_test",
  SITE_URL: "https://snready.com",
  FOLLOWUP_DELAY_DAYS: "21",
});

describe("purchase outcome follow-ups", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("enqueues once per checkout session and creates a feedback token", async () => {
    const kv = kvStore();
    const purchase = { sessionId: "cs_paid", email: "Buyer@Example.com", plan: "single", certification: "CSA", purchasedAt: Date.UTC(2026, 7, 1) };

    const first = await enqueuePurchaseFollowup(env(kv), purchase);
    const second = await enqueuePurchaseFollowup(env(kv), purchase);

    expect(first.dueAt).toBe(purchase.purchasedAt + 15 * 86_400_000);
    expect(second.feedbackToken).toBe(first.feedbackToken);
    expect(kv.store.get(`purchase_feedback:${first.feedbackToken}`)).toBe("cs_paid");
    expect([...kv.store.keys()].filter((key) => key.startsWith("purchase_followup_due:"))).toHaveLength(1);
  });

  it("skips suppressed customers without sending", async () => {
    const kv = kvStore();
    const purchasedAt = Date.UTC(2026, 7, 1);
    await enqueuePurchaseFollowup(env(kv), { sessionId: "cs_suppressed", email: "buyer@example.com", plan: "single", certification: "CSA", purchasedAt });
    kv.store.set("purchase_followup_suppressed:buyer@example.com", "1");
    const fetchMock = vi.spyOn(globalThis, "fetch");

    const result = await processDueFollowups(env(kv), { now: purchasedAt + 16 * 86_400_000, lookbackDays: 2 });

    expect(result.skipped).toBe(1);
    expect(result.sent).toBe(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the individual guarantee with one-click unsubscribe headers", async () => {
    const kv = kvStore();
    const purchasedAt = Date.UTC(2026, 7, 1);
    const record = await enqueuePurchaseFollowup(env(kv), { sessionId: "cs_send", email: "buyer@example.com", plan: "single", certification: "CSA", purchasedAt });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ id: "email_123" }), { status: 200 }));

    const result = await processDueFollowups(env(kv), { now: purchasedAt + 16 * 86_400_000, lookbackDays: 2 });

    expect(result.sent).toBe(1);
    const request = JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body));
    expect(request.subject).toBe("Did you pass your exam?");
    expect(request.text).toContain("simply reply “no”");
    expect(request.text).toContain("No questions asked.");
    expect(request.html).toContain(`/feedback?token=${record.feedbackToken}`);
    expect(request.headers["List-Unsubscribe"]).toContain("/api/feedback/unsubscribe?token=");
    expect(request.headers["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
  });
  it("keeps All Access on its existing schedule without a refund promise", async () => {
    const kv = kvStore();
    const purchasedAt = Date.UTC(2026, 7, 1);
    const record = await enqueuePurchaseFollowup(env(kv), { sessionId: "cs_all", email: "buyer@example.com", plan: "all", certification: "all", purchasedAt });
    expect(record.dueAt).toBe(purchasedAt + 21 * 86_400_000);
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ id: "email_all" }), { status: 200 }));
    expect((await processDueFollowups(env(kv), { now: purchasedAt + 15 * 86_400_000 })).sent).toBe(0);
    expect(fetchMock).not.toHaveBeenCalled();
    expect((await processDueFollowups(env(kv), { now: record.dueAt })).sent).toBe(1);
    const request = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(request.text).not.toContain("refund");
    expect(request.html).not.toContain("refund");
  });

  it("does not send the individual check-in before day 15", async () => {
    const kv = kvStore();
    const purchasedAt = Date.UTC(2026, 7, 1);
    const record = await enqueuePurchaseFollowup(env(kv), { sessionId: "cs_wait", email: "buyer@example.com", plan: "single", certification: "CIS-DF", purchasedAt });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ id: "email_wait" }), { status: 200 }));
    expect((await processDueFollowups(env(kv), { now: record.dueAt - 1 })).sent).toBe(0);
    expect(fetchMock).not.toHaveBeenCalled();
    expect((await processDueFollowups(env(kv), { now: record.dueAt })).sent).toBe(1);
  });
});
