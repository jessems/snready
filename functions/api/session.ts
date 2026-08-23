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

const JSON_HEADERS = { "Content-Type": "application/json" };

type SessionErrorCode =
  | "missing_session_id"
  | "session_not_found"
  | "stripe_lookup_failed"
  | "payment_not_completed"
  | "missing_customer_email"
  | "access_grant_failed";

function jsonResponse(body: Record<string, unknown>, status: number, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...(headers || {}),
    },
  });
}

function errorResponse(status: number, code: SessionErrorCode, error: string): Response {
  return jsonResponse({ error, code }, status);
}

function isStripeSessionNotFound(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const stripeError = error as {
    type?: string;
    code?: string;
    statusCode?: number;
    raw?: { code?: string };
  };

  return (
    stripeError.type === "StripeInvalidRequestError" ||
    stripeError.code === "resource_missing" ||
    stripeError.statusCode === 404 ||
    stripeError.raw?.code === "resource_missing"
  );
}

async function retrieveStripeSession(stripeSecretKey: string, sessionId: string) {
  const stripe = new Stripe(stripeSecretKey);

  try {
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    if (isStripeSessionNotFound(error)) {
      console.warn("Checkout session not found", { sessionId, error });
      return null;
    }

    console.error("Stripe session lookup failed", { sessionId, error });
    throw error;
  }
}

// Verify a checkout session and grant access
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id")?.trim();

  if (!sessionId) {
    return errorResponse(400, "missing_session_id", "Session ID required");
  }

  let session: Awaited<ReturnType<Stripe["checkout"]["sessions"]["retrieve"]>> | null;

  try {
    session = await retrieveStripeSession(env.STRIPE_SECRET_KEY, sessionId);
  } catch {
    return errorResponse(502, "stripe_lookup_failed", "Unable to verify checkout session");
  }

  if (!session) {
    return errorResponse(404, "session_not_found", "Checkout session not found");
  }

  if (session.payment_status !== "paid") {
    return errorResponse(400, "payment_not_completed", "Payment not completed");
  }

  const email = session.customer_details?.email;
  const plan = session.metadata?.plan || "single";
  const certification = session.metadata?.certification || "all";

  if (!email) {
    return errorResponse(422, "missing_customer_email", "No email found for this checkout session");
  }

  const durationMs = 100 * 365 * 24 * 60 * 60 * 1000;
  const expiresAt = Date.now() + durationMs;
  const normalizedEmail = email.toLowerCase();
  const now = Date.now();
  const sessionToken = crypto.randomUUID();
  const sessionExpiresAt = now + 30 * 24 * 60 * 60 * 1000;

  let certifications: string[] = [];
  let effectivePlan = plan;

  try {
    const existingUser = await env.SNREADY_ACCESS.get(`user:${normalizedEmail}`);
    if (!existingUser) {
      await env.SNREADY_ACCESS.put(
        `user:${normalizedEmail}`,
        JSON.stringify({ email: normalizedEmail, createdAt: now, lastLoginAt: now })
      );
    }

    await env.SNREADY_ACCESS.put(
      `session:${sessionToken}`,
      JSON.stringify({ email: normalizedEmail, createdAt: now, expiresAt: sessionExpiresAt }),
      { expirationTtl: 30 * 24 * 60 * 60 }
    );

    const existingAccess = await env.SNREADY_ACCESS.get(`access:${normalizedEmail}`);

    if (existingAccess) {
      try {
        const existing = JSON.parse(existingAccess);
        certifications = existing.certifications || (existing.certification ? [existing.certification] : []);
        if (existing.plan === "all") effectivePlan = "all";
      } catch (error) {
        console.warn("Failed to parse existing access record; continuing with fresh grant", {
          email: normalizedEmail,
          error,
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
      {}
    );
  } catch (error) {
    console.error("Session access grant failed", { sessionId, email: normalizedEmail, error });
    return errorResponse(500, "access_grant_failed", "Unable to grant access for this checkout session");
  }

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
    console.error("Purchase follow-up enqueue failed after access grant", {
      sessionId: session.id,
      email: normalizedEmail,
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
    },
    200,
    {
      "Set-Cookie": makeSessionCookie(sessionToken),
    }
  );
};
