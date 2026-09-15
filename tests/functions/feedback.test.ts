import { describe, expect, it, vi } from "vitest";
import { onRequestGet, onRequestPost } from "@/functions/api/feedback";
import { onRequestGet as unsubscribe } from "@/functions/api/feedback/unsubscribe";

type MockKv = KVNamespace<string> & { store: Map<string, string> };
function kvStore(initial: Record<string, string>): MockKv {
  const store = new Map(Object.entries(initial));
  return {
    store,
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    put: vi.fn(async (key: string, value: string) => { store.set(key, value); }),
    delete: vi.fn(), list: vi.fn(), getWithMetadata: vi.fn(),
  } as unknown as MockKv;
}

const token = "123e4567-e89b-12d3-a456-426614174000";
const record = JSON.stringify({ sessionId: "cs_paid", email: "buyer@example.com", plan: "single", certification: "CSA", purchasedAt: 1, dueAt: 2, status: "sent", createdAt: 1, feedbackToken: token });
function env() { return kvStore({ [`purchase_feedback:${token}`]: "cs_paid", "purchase_followup:cs_paid": record }); }

describe("purchase feedback API", () => {
  it("validates a purchase-linked token without exposing customer data", async () => {
    const response = await onRequestGet({ request: new Request(`https://snready.com/api/feedback?token=${token}`), env: { SNREADY_ACCESS: env() } } as unknown as Parameters<typeof onRequestGet>[0]);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ valid: true, certification: "CSA", alreadySubmitted: false });
  });

  it("rejects feedback not linked to a purchase", async () => {
    const response = await onRequestGet({ request: new Request("https://snready.com/api/feedback?token=invalid"), env: { SNREADY_ACCESS: env() } } as unknown as Parameters<typeof onRequestGet>[0]);
    expect(response.status).toBe(400);
  });

  it("stores bounded feedback and explicit feature consent", async () => {
    const kv = env();
    const response = await onRequestPost({
      request: new Request("https://snready.com/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, examTaken: "yes", passed: "yes", rating: 5, testimonial: "It helped.", canFeature: true }) }),
      env: { SNREADY_ACCESS: kv },
    } as unknown as Parameters<typeof onRequestPost>[0]);
    expect(response.status).toBe(200);
    const saved = JSON.parse(kv.store.get(`purchase_feedback_response:${token}`)!);
    expect(saved).toMatchObject({ sessionId: "cs_paid", passed: "yes", rating: 5, testimonial: "It helped.", canFeature: true });
    expect(saved.email).toBeUndefined();
  });

  it("suppresses future follow-ups from both GET and one-click POST links", async () => {
    const kv = env();
    const response = await unsubscribe({ request: new Request(`https://snready.com/api/feedback/unsubscribe?token=${token}`), env: { SNREADY_ACCESS: kv } } as unknown as Parameters<typeof unsubscribe>[0]);
    expect(response.status).toBe(200);
    expect(kv.store.has("purchase_followup_suppressed:buyer@example.com")).toBe(true);
  });
});
