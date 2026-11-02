import Stripe from "stripe";
import { enqueuePurchaseFollowup } from "../lib/followup";

interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_WEBHOOK_SIGNING_SECRET?: string;
  STRIPE_WEBHOOK_SECRET_KEY?: string;
  SNREADY_ACCESS: KVNamespace;
  RESEND_API_KEY: string;
  SITE_URL: string;
  FOLLOWUP_DELAY_DAYS?: string;
  FOLLOWUP_FROM_EMAIL?: string;
  FOLLOWUP_REPLY_TO?: string;
  GA4_API_SECRET?: string;
  GA4_MEASUREMENT_ID?: string;
}

const DEFAULT_GA4_MEASUREMENT_ID = "G-21R4T0V162";

const WEBHOOK_SECRET_CANDIDATES = [
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_WEBHOOK_SIGNING_SECRET",
  "STRIPE_WEBHOOK_SECRET_KEY",
] as const;

function resolveWebhookSecret(env: Env): string | null {
  for (const key of WEBHOOK_SECRET_CANDIDATES) {
    const value = env[key]?.trim();
    if (value) {
      return value;
    }
  }

  return null;
}

function fallbackGaClientId(sessionId: string) {
  // GA4 requires a client_id; without the buyer's _ga cookie, derive a stable
  // pseudo id so the revenue is still recorded (as an unattributed user).
  let hash = 0;
  for (const char of sessionId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `${hash}.${Math.floor(Date.now() / 1000)}`;
}

/**
 * Server-side fallback for the browser purchase event. Uses the Stripe session
 * id as transaction_id, matching trackPurchaseOnce(), so GA4 dedupes the two.
 */
async function sendGa4Purchase(env: Env, session: Stripe.Checkout.Session) {
  const apiSecret = env.GA4_API_SECRET?.trim();
  if (!apiSecret || session.payment_status !== "paid") return;

  const measurementId = env.GA4_MEASUREMENT_ID?.trim() || DEFAULT_GA4_MEASUREMENT_ID;
  const metadata = session.metadata || {};
  const plan = metadata.plan === "all" ? "all" : "single";
  const certification = metadata.certification || undefined;
  const value = typeof session.amount_total === "number" ? session.amount_total / 100 : plan === "all" ? 49 : 9;
  const currency = (session.currency || "usd").toUpperCase();

  const body = {
    client_id: metadata.gaClientId || fallbackGaClientId(session.id),
    events: [
      {
        name: "purchase",
        params: {
          transaction_id: session.id,
          currency,
          value,
          plan,
          certification: certification || "ALL",
          ...(metadata.gaSessionId ? { session_id: metadata.gaSessionId } : {}),
          engagement_time_msec: 1,
          items: [
            {
              item_id: `${plan}-${certification || "all"}`,
              item_name: plan === "all" ? "All Certifications" : `${certification?.toUpperCase()} Certification`,
              item_category: "ServiceNow certification prep",
              item_variant: plan,
              price: value,
              quantity: 1,
            },
          ],
        },
      },
    ],
  };

  const url =
    `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(measurementId)}` +
    `&api_secret=${encodeURIComponent(apiSecret)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    console.error("GA4 Measurement Protocol purchase failed", { sessionId: session.id, status: response.status });
  }
}

function trackGa4Purchase(
  context: { waitUntil?: (promise: Promise<unknown>) => void },
  env: Env,
  session: Stripe.Checkout.Session
) {
  // Never let analytics break the webhook.
  const promise = sendGa4Purchase(env, session).catch((error) => {
    console.error("GA4 Measurement Protocol purchase error", { sessionId: session.id, error });
  });

  if (typeof context.waitUntil === "function") {
    try {
      context.waitUntil(promise);
      return Promise.resolve();
    } catch {
      // Fall through and await inline.
    }
  }
  return promise;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("Webhook error: No stripe-signature header");
    return new Response("No signature", { status: 400 });
  }

  const webhookSecret = resolveWebhookSecret(env);
  if (!webhookSecret) {
    console.error("Webhook error: no Stripe webhook secret configured", {
      configuredCandidates: WEBHOOK_SECRET_CANDIDATES.filter((key) => Boolean(env[key]?.trim())),
      availableEnvKeys: Object.keys(env).filter((key) => key.startsWith("STRIPE_")).sort(),
    });
    return new Response("Webhook secret not configured", { status: 500 });
  }

  try {
    const body = await request.text();
    const cryptoProvider = Stripe.createSubtleCryptoProvider();

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email;
      const plan = session.metadata?.plan || "single";
      const certification = session.metadata?.certification || "all";

      if (email) {
        const durationMs = 100 * 365 * 24 * 60 * 60 * 1000;
        const expiresAt = Date.now() + durationMs;
        const normalizedEmail = email.toLowerCase();

        await env.SNREADY_ACCESS.put(
          `access:${normalizedEmail}`,
          JSON.stringify({
            paid: true,
            plan,
            expiresAt,
            sessionId: session.id,
            certification,
            createdAt: Date.now(),
          }),
          {}
        );

        try {
          await enqueuePurchaseFollowup(env, {
            sessionId: session.id,
            email: normalizedEmail,
            plan,
            certification,
            certifications: plan === "single" && certification ? [certification] : [],
            purchasedAt: (session.created || Math.floor(Date.now() / 1000)) * 1000,
          });
        } catch (error) {
          console.error("Webhook follow-up enqueue failed after access grant", {
            sessionId: session.id,
            email: normalizedEmail,
            error,
          });
        }

        console.log(`Access granted to ${normalizedEmail} (${plan}) until ${new Date(expiresAt).toISOString()}`);
      }

      await trackGa4Purchase(context, env, session);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Webhook error:", errorMessage, error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed", details: errorMessage }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
};
