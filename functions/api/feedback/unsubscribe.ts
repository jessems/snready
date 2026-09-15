import type { PurchaseFollowupRecord } from "../../lib/followup";

interface Env { SNREADY_ACCESS: KVNamespace }

const page = (message: string, status = 200) => new Response(
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>SNReady email preferences</title><body style="font-family:system-ui;max-width:36rem;margin:4rem auto;padding:1rem"><h1>SNReady</h1><p>${message}</p></body></html>`,
  { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
);

async function suppress(env: Env, request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get("token")?.trim() || "";
  if (!/^[0-9a-f-]{36}$/i.test(token)) return page("This preference link is invalid or expired.", 400);

  const sessionId = await env.SNREADY_ACCESS.get(`purchase_feedback:${token}`);
  if (!sessionId) return page("This preference link is invalid or expired.", 400);

  const raw = await env.SNREADY_ACCESS.get(`purchase_followup:${sessionId}`);
  if (!raw) return page("This preference link is invalid or expired.", 400);

  const record = JSON.parse(raw) as PurchaseFollowupRecord;
  await env.SNREADY_ACCESS.put(`purchase_followup_suppressed:${record.email}`, String(Date.now()));
  return page("You will not receive any more customer follow-up emails from SNReady.");
}

export const onRequestGet: PagesFunction<Env> = ({ request, env }) => suppress(env, request);
export const onRequestPost: PagesFunction<Env> = ({ request, env }) => suppress(env, request);
