import Stripe from "stripe";
import { enqueuePurchaseFollowup } from "../lib/followup";
import { grantPurchaseAccess } from "../lib/purchase-access";

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
}

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

      if (session.payment_status !== "paid") {
        console.warn("Ignoring checkout.session.completed without paid status", {
          sessionId: session.id,
          paymentStatus: session.payment_status,
        });
        return new Response(JSON.stringify({ received: true, ignored: "payment_not_completed" }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (email) {
        const normalizedEmail = email.toLowerCase();
        const grant = await grantPurchaseAccess(env.SNREADY_ACCESS, {
          email,
          plan,
          certification,
          sessionId: session.id,
        });

        if (!grant.accessAlreadyGranted) {
          try {
            await enqueuePurchaseFollowup(env, {
              sessionId: session.id,
              email: normalizedEmail,
              plan: grant.effectivePlan,
              certification,
              certifications: grant.certifications,
              purchasedAt: (session.created || Math.floor(Date.now() / 1000)) * 1000,
            });
          } catch (error) {
            console.error("Webhook follow-up enqueue failed after access grant", {
              sessionId: session.id,
              email: normalizedEmail,
              error,
            });
          }
        }

        console.log(`Access granted to ${normalizedEmail} (${grant.effectivePlan}) until ${new Date(grant.expiresAt).toISOString()}`);
      }
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
