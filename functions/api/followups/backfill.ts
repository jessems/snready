import Stripe from "stripe";
import { enqueuePurchaseFollowup } from "../../lib/followup";

interface Env {
  STRIPE_SECRET_KEY: string;
  SNREADY_ACCESS: KVNamespace;
  RESEND_API_KEY: string;
  SITE_URL: string;
  FOLLOWUP_RUN_SECRET: string;
  FOLLOWUP_DELAY_DAYS?: string;
  FOLLOWUP_FROM_EMAIL?: string;
  FOLLOWUP_REPLY_TO?: string;
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
});

function authorized(request: Request, env: Env): boolean {
  const authorization = request.headers.get("authorization") || "";
  const bearer = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  return Boolean(env.FOLLOWUP_RUN_SECRET && (bearer === env.FOLLOWUP_RUN_SECRET || request.headers.get("x-followup-secret") === env.FOLLOWUP_RUN_SECRET));
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!authorized(request, env)) return json({ error: "Unauthorized" }, 401);
  if (!env.STRIPE_SECRET_KEY?.trim()) return json({ error: "Stripe is not configured" }, 503);

  const url = new URL(request.url);
  const dryRun = url.searchParams.get("dryRun") !== "false";
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 100, 1), 500);
  const minimumAgeDays = Math.min(Math.max(Number(url.searchParams.get("minimumAgeDays")) || 21, 7), 3650);
  const eligibleBefore = Math.floor((Date.now() - minimumAgeDays * 86_400_000) / 1000);
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  let startingAfter: string | undefined;
  let scanned = 0;
  let eligible = 0;
  let queued = 0;
  let skippedDuplicate = 0;
  let skippedSuppressed = 0;
  const seenEmails = new Set<string>();

  while (scanned < 2000 && eligible < limit) {
    const page = await stripe.checkout.sessions.list({ limit: 100, ...(startingAfter ? { starting_after: startingAfter } : {}) });
    for (const session of page.data) {
      scanned += 1;
      if (session.created > eligibleBefore || session.payment_status !== "paid") continue;
      const email = (session.customer_details?.email || session.customer_email)?.trim().toLowerCase();
      if (!email) continue;
      if (seenEmails.has(email) || await env.SNREADY_ACCESS.get(`purchase_outcome_backfill_queued:${email}`)) {
        skippedDuplicate += 1;
        continue;
      }
      seenEmails.add(email);
      if (await env.SNREADY_ACCESS.get(`purchase_followup_suppressed:${email}`)) {
        skippedSuppressed += 1;
        continue;
      }

      eligible += 1;
      if (!dryRun) {
        const certification = session.metadata?.certification || "all";
        const certifications = session.metadata?.certifications?.split(",").map((value) => value.trim()).filter(Boolean);
        await enqueuePurchaseFollowup(env, {
          sessionId: session.id,
          email,
          plan: session.metadata?.plan || "single",
          certification,
          certifications,
          purchasedAt: session.created * 1000,
          dueAt: Date.now(),
        });
        await env.SNREADY_ACCESS.put(`purchase_outcome_backfill_queued:${email}`, session.id);
        queued += 1;
      }
      if (eligible >= limit) break;
    }
    if (!page.has_more || eligible >= limit || page.data.length === 0) break;
    startingAfter = page.data[page.data.length - 1]?.id;
  }

  return json({ success: true, dryRun, scanned, eligible, queued, skippedDuplicate, skippedSuppressed });
};

export const onRequestGet: PagesFunction<Env> = async () => json({ error: "Use POST" }, 405);