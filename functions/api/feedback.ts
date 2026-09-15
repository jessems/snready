import type { PurchaseFollowupRecord } from "../lib/followup";

interface Env { SNREADY_ACCESS: KVNamespace }
type ExamTaken = "yes" | "no" | "scheduled";
type Passed = "yes" | "no" | "waiting";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
});

async function purchaseForToken(env: Env, token: string): Promise<PurchaseFollowupRecord | null> {
  if (!/^[0-9a-f-]{36}$/i.test(token)) return null;
  const sessionId = await env.SNREADY_ACCESS.get(`purchase_feedback:${token}`);
  if (!sessionId) return null;
  const raw = await env.SNREADY_ACCESS.get(`purchase_followup:${sessionId}`);
  return raw ? JSON.parse(raw) as PurchaseFollowupRecord : null;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const token = new URL(request.url).searchParams.get("token")?.trim() || "";
  const purchase = await purchaseForToken(env, token);
  if (!purchase) return json({ valid: false, error: "Invalid or expired feedback link" }, 400);
  const existing = await env.SNREADY_ACCESS.get(`purchase_feedback_response:${token}`);
  return json({ valid: true, certification: purchase.certification, alreadySubmitted: Boolean(existing) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { token?: string; examTaken?: ExamTaken; passed?: Passed; rating?: number; testimonial?: string; canFeature?: boolean };
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const token = body.token?.trim() || "";
  const purchase = await purchaseForToken(env, token);
  if (!purchase) return json({ error: "Invalid or expired feedback link" }, 400);
  if (!body.examTaken || !["yes", "no", "scheduled"].includes(body.examTaken)) return json({ error: "Select your exam status" }, 400);
  if (!Number.isInteger(body.rating) || body.rating! < 1 || body.rating! > 5) return json({ error: "Rating must be 1–5" }, 400);
  if (body.examTaken === "yes" && !body.passed) return json({ error: "Select your exam result" }, 400);
  const testimonial = body.testimonial?.trim().slice(0, 2000) || undefined;
  const responseKey = `purchase_feedback_response:${token}`;
  if (await env.SNREADY_ACCESS.get(responseKey)) return json({ success: true, alreadySubmitted: true });
  await env.SNREADY_ACCESS.put(responseKey, JSON.stringify({
    sessionId: purchase.sessionId,
    certification: purchase.certification,
    examTaken: body.examTaken,
    passed: body.examTaken === "yes" ? body.passed : undefined,
    rating: body.rating,
    testimonial,
    canFeature: Boolean(testimonial && body.canFeature),
    submittedAt: Date.now(),
  }));
  return json({ success: true });
};