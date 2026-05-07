import { processDueFollowups } from "../../lib/followup";

interface Env {
  SNREADY_ACCESS: KVNamespace;
  RESEND_API_KEY: string;
  SITE_URL: string;
  FOLLOWUP_DELAY_DAYS?: string;
  FOLLOWUP_FROM_EMAIL?: string;
  FOLLOWUP_REPLY_TO?: string;
  FOLLOWUP_RUN_SECRET: string;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isAuthorized(request: Request, env: Env): boolean {
  if (!env.FOLLOWUP_RUN_SECRET) {
    console.error("FOLLOWUP_RUN_SECRET is not configured");
    return false;
  }

  const authorization = request.headers.get("authorization") || "";
  const bearerToken = authorization.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : "";
  const headerToken = request.headers.get("x-followup-secret") || "";

  return bearerToken === env.FOLLOWUP_RUN_SECRET || headerToken === env.FOLLOWUP_RUN_SECRET;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!isAuthorized(request, env)) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") || "50");
  const lookbackDays = Number(url.searchParams.get("lookbackDays") || "7");
  const dryRun = url.searchParams.get("dryRun") === "true";

  try {
    const result = await processDueFollowups(env, {
      limit: Number.isFinite(limit) ? Math.min(Math.max(Math.floor(limit), 1), 200) : 50,
      lookbackDays: Number.isFinite(lookbackDays) ? Math.min(Math.max(Math.floor(lookbackDays), 0), 60) : 7,
      dryRun,
    });

    return jsonResponse({ success: true, dryRun, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown follow-up processing error";
    console.error("Follow-up run failed:", message, error);
    return jsonResponse({ error: "Follow-up run failed", details: message }, 500);
  }
};

export const onRequestGet: PagesFunction<Env> = async () => {
  return jsonResponse({ error: "Use POST" }, 405);
};

export const onScheduled: PagesFunction<Env> = async ({ env }) => {
  try {
    const result = await processDueFollowups(env, {
      limit: 100,
      lookbackDays: 14,
    });
    console.log("Purchase follow-up scheduled run complete", JSON.stringify(result));
    return jsonResponse({ success: true, ...result });
  } catch (error) {
    console.error("Purchase follow-up scheduled run failed", error);
    throw error;
  }
};
