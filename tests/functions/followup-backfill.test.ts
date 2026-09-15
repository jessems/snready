import { beforeEach, describe, expect, it, vi } from "vitest";
import { onRequestGet, onRequestPost } from "@/functions/api/followups/backfill";

const listSessions = vi.hoisted(() => vi.fn());
const enqueuePurchaseFollowup = vi.hoisted(() => vi.fn());
vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(function StripeMock() {
    return { checkout: { sessions: { list: listSessions } } };
  }),
}));
vi.mock("@/functions/lib/followup", () => ({ enqueuePurchaseFollowup }));

type MockKv = KVNamespace<string> & { store: Map<string, string> };
function kvStore(initial: Record<string, string> = {}): MockKv {
  const store = new Map(Object.entries(initial));
  return {
    store,
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    put: vi.fn(async (key: string, value: string) => { store.set(key, value); }),
    delete: vi.fn(), list: vi.fn(), getWithMetadata: vi.fn(),
  } as unknown as MockKv;
}

function context(url: string, kv = kvStore(), secret = "run-secret") {
  return {
    request: new Request(url, { method: "POST", headers: { Authorization: `Bearer ${secret}` } }),
    env: { STRIPE_SECRET_KEY: "sk_test", SNREADY_ACCESS: kv, RESEND_API_KEY: "re_test", SITE_URL: "https://snready.com", FOLLOWUP_RUN_SECRET: "run-secret" },
  } as unknown as Parameters<typeof onRequestPost>[0];
}

const old = Math.floor(Date.now() / 1000) - 40 * 86_400;
const paid = (id: string, email: string) => ({ id, created: old, payment_status: "paid", customer_details: { email }, customer_email: null, metadata: { plan: "single", certification: "CSA" } });

describe("historical purchaser outcome backfill", () => {
  beforeEach(() => {
    listSessions.mockReset();
    enqueuePurchaseFollowup.mockReset();
    listSessions.mockResolvedValue({ data: [paid("cs_1", "Buyer@Example.com"), paid("cs_2", "buyer@example.com")], has_more: false });
    enqueuePurchaseFollowup.mockResolvedValue({});
  });

  it("requires the protected POST endpoint", async () => {
    const unauthorized = await onRequestPost(context("https://snready.com/api/followups/backfill", kvStore(), "wrong"));
    expect(unauthorized.status).toBe(401);
    const get = await onRequestGet({} as Parameters<typeof onRequestGet>[0]);
    expect(get.status).toBe(405);
  });

  it("defaults to dry run and deduplicates purchasers by email", async () => {
    const response = await onRequestPost(context("https://snready.com/api/followups/backfill?limit=100"));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ dryRun: true, eligible: 1, queued: 0, skippedDuplicate: 1 });
    expect(enqueuePurchaseFollowup).not.toHaveBeenCalled();
  });

  it("queues eligible non-suppressed purchasers once with the original purchase date", async () => {
    const kv = kvStore();
    const response = await onRequestPost(context("https://snready.com/api/followups/backfill?dryRun=false&limit=100", kv));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ dryRun: false, eligible: 1, queued: 1 });
    expect(enqueuePurchaseFollowup).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({
      sessionId: "cs_1", email: "buyer@example.com", purchasedAt: old * 1000, certification: "CSA",
    }));
    expect(kv.store.get("purchase_outcome_backfill_queued:buyer@example.com")).toBe("cs_1");
  });

  it("does not queue suppressed purchasers", async () => {
    const kv = kvStore({ "purchase_followup_suppressed:buyer@example.com": "1" });
    const response = await onRequestPost(context("https://snready.com/api/followups/backfill?dryRun=false", kv));
    expect(await response.json()).toMatchObject({ eligible: 0, queued: 0, skippedSuppressed: 1 });
    expect(enqueuePurchaseFollowup).not.toHaveBeenCalled();
  });
});
