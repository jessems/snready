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

// Verify a checkout session and grant access
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return new Response(
      JSON.stringify({ error: "Session ID required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ error: "Payment not completed" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const email = session.customer_details?.email;
    const plan = session.metadata?.plan || "single";
    const certification = session.metadata?.certification || "all";

    if (!email) {
      return new Response(
        JSON.stringify({ error: "No email found" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Grant access (in case webhook was slow)
    // Both plans are lifetime access (100 years)
    const durationMs = 100 * 365 * 24 * 60 * 60 * 1000;
    const expiresAt = Date.now() + durationMs;
    
    // No TTL expiration - lifetime for both plans
    const kvOptions = {};

    const normalizedEmail = email.toLowerCase();

    // Also create/update user record on payment
    const existingUser = await env.SNREADY_ACCESS.get(`user:${normalizedEmail}`);
    const now = Date.now();
    if (!existingUser) {
      await env.SNREADY_ACCESS.put(
        `user:${normalizedEmail}`,
        JSON.stringify({ email: normalizedEmail, createdAt: now, lastLoginAt: now })
      );
    }

    // Create a session so the user is logged in after payment
    const sessionToken = crypto.randomUUID();
    const sessionExpiresAt = now + 30 * 24 * 60 * 60 * 1000;
    await env.SNREADY_ACCESS.put(
      `session:${sessionToken}`,
      JSON.stringify({ email: normalizedEmail, createdAt: now, expiresAt: sessionExpiresAt }),
      { expirationTtl: 30 * 24 * 60 * 60 }
    );

    // Merge with existing access (support multiple single-cert purchases)
    const existingAccess = await env.SNREADY_ACCESS.get(`access:${normalizedEmail}`);
    let certifications: string[] = [];
    let effectivePlan = plan;

    if (existingAccess) {
      try {
        const existing = JSON.parse(existingAccess);
        certifications = existing.certifications || (existing.certification ? [existing.certification] : []);
        // If they already have "all" plan, keep it
        if (existing.plan === "all") effectivePlan = "all";
      } catch {}
    }

    // Add new certification if single plan
    if (plan === "single" && certification && !certifications.includes(certification)) {
      certifications.push(certification);
    }

    // "all" plan means all certs
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
      kvOptions
    );

    await enqueuePurchaseFollowup(env, {
      sessionId: session.id,
      email: normalizedEmail,
      plan: effectivePlan,
      certification,
      certifications,
      purchasedAt: (session.created || Math.floor(Date.now() / 1000)) * 1000,
    });

    return new Response(
      JSON.stringify({
        success: true,
        email,
        plan: effectivePlan,
        expiresAt,
        certification,
        certifications,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": makeSessionCookie(sessionToken),
        },
      }
    );
  } catch (error) {
    console.error("Session verification error:", error);
    return new Response(
      JSON.stringify({ error: "Session verification failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
