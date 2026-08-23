import Stripe from "stripe";
import { enqueuePurchaseFollowup } from "../lib/followup";
import { makeSessionCookie } from "../lib/session";

interface Env {
  STRIPE_SECRET_KEY: string;
  SNREADY_ACCESS: KVNamespace;
  RESEND_API_KEY: string;
  SITE_URL: string;
  FOLLOWUP_DELAY_DAYS?: string;
  FOLLOWUP_FROM_EMAIL?: string;
  FOLLOWUP_REPLY_TO?: string;
}

type SessionErrorCode =
  | "session_id_required"
  | "session_not_found"
  | "payment_not_completed"
  | "session_email_missing"
  | "stripe_lookup_failed"
  | "access_grant_failed";

function jsonResponse(body: Record<string, unknown>, status = 200, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return "Unknown error";
}

function isStripeSessionNotFound(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const candidate = error as {
    type?: string;
    code?: string;
    statusCode?: number;
    raw?: { code?: string };
    message?: string;
  };

  return (
    candidate.type === "StripeInvalidRequestError" ||
    candidate.code === "resource_missing" ||
    candidate.raw?.code === "resource_missing" ||
    candidate.statusCode === 404 ||
    !!candidate.message?.includes("No such checkout.session") ||
    !!candidate.message?.includes("No such checkout session")
  );
}

function sessionError(
  status: number,
  error: string,
  code: SessionErrorCode,
  details?: string,
  headers?: HeadersInit,
): Response {
  return jsonResponse(details ? { error, code, details } : { error, code }, status, headers);
}

// Verify a checkout session and grant access
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id")?.trim();

  if (!sessionId) {
    return sessionError(400, "Session ID required", "session_id_required");
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    const details = errorMessage(error);
    if (isStripeSessionNotFound(error)) {
      console.warn("Session verification: checkout session not found", { sessionId, details });
      return sessionError(404, "Checkout session not found", "session_not_found", details);
    }

    console.error("Session verification: Stripe lookup failed", { sessionId, details, error });
    return sessionError(502, "Stripe session lookup failed", "stripe_lookup_failed", details);
  }

  if (session.payment_status !== "paid") {
    return sessionError(400, "Payment not completed", "payment_not_completed");
  }

  const email = session.customer_details?.email;
  const plan = session.metadata?.plan || "single";
  const certification = session.metadata?.certification || "all";

  if (!email) {
    return sessionError(400, "No email found", "session_email_missing");
  }

  const normalizedEmail = email.toLowerCase();
  const now = Date.now();
  const durationMs = 100 * 365 * 24 * 60 * 60 * 1000;
  const expiresAt = now + durationMs;
  const sessionToken = crypto.randomUUID();
  const sessionExpiresAt = now + 30 * 24 * 60 * 60 * 1000;

  let certifications: string[] = [];
  let effectivePlan = plan;

  try {
    const existingUser = await env.SNREADY_ACCESS.get(`user:${normalizedEmail}`);
    if (!existingUser) {
      await env.SNREADY_ACCESS.put(
        `user:${normalizedEmail}`,
        JSON.stringify({ email: normalizedEmail, createdAt: now, lastLoginAt: now }),
      );
    }

    await env.SNREADY_ACCESS.put(
      `session:${sessionToken}`,
      JSON.stringify({ email: normalizedEmail, createdAt: now, expiresAt: sessionExpiresAt }),
      { expirationTtl: 30 * 24 * 60 * 60 },
    );

    const existingAccess = await env.SNREADY_ACCESS.get(`access:${normalizedEmail}`);
    if (existingAccess) {
      try {
        const existing = JSON.parse(existingAccess) as { certifications?: string[]; certification?: string; plan?: string };
        certifications = existing.certifications || (existing.certification ? [existing.certification] : []);
        if (existing.plan === "all") effectivePlan = "all";
      } catch (parseError) {
        console.warn("Session verification: failed to parse existing access record", {
          email: normalizedEmail,
          details: errorMessage(parseError),
        });
      }
    }

    if (plan === "single" && certification && !certifications.includes(certification)) {
      certifications.push(certification);
    }

    if (plan === "all") {
      effectivePlan = "all";
    }

    await env.SNREADY_ACCESS.put(
      `access:${normalizedEmail}`,
      JSON.stringify({
        paid: true,
        plan: effectivePlan,
        expiresAt,
        sessionId: session.id,
        certification,
        certifications,
        createdAt: Date.now(),
      }),
      {},
    );
  } catch (error) {
    const details = errorMessage(error);
    console.error("Session verification: access grant failed", { sessionId, email: normalizedEmail, details, error });
    return sessionError(500, "Failed to grant access", "access_grant_failed", details);
  }

  let followupQueued = true;
  try {
    await enqueuePurchaseFollowup(env, {
      sessionId: session.id,
      email: normalizedEmail,
      plan: effectivePlan,
      certification,
      certifications,
      purchasedAt: (session.created || Math.floor(Date.now() / 1000)) * 1000,
    });
  } catch (error) {
    followupQueued = false;
    console.error("Session verification: follow-up enqueue failed", {
      sessionId,
      email: normalizedEmail,
      details: errorMessage(error),
      error,
    });
  }

  return jsonResponse(
    {
      success: true,
      email,
      plan: effectivePlan,
      expiresAt,
      certification,
      certifications,
      amountTotal: session.amount_total || undefined,
      followupQueued,
      warnings: followupQueued ? [] : ["followup_enqueue_failed"],
    },
    200,
    {
      "Set-Cookie": makeSessionCookie(sessionToken),
    },
  );
};
