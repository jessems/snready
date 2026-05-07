import Stripe from "stripe";
import { enqueuePurchaseFollowup } from "../lib/followup";

interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  SNREADY_ACCESS: KVNamespace;
  RESEND_API_KEY: string;
  SITE_URL: string;
  FOLLOWUP_DELAY_DAYS?: string;
  FOLLOWUP_FROM_EMAIL?: string;
  FOLLOWUP_REPLY_TO?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("Webhook error: No stripe-signature header");
    return new Response("No signature", { status: 400 });
  }

  if (!env.STRIPE_WEBHOOK_SECRET) {
    console.error("Webhook error: STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  try {
    const body = await request.text();
    
    // Use constructEventAsync for Cloudflare Workers (required for Stripe SDK v20+)
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email;
      const plan = session.metadata?.plan || "single";
      const certification = session.metadata?.certification || "all";

      if (email) {
        // Both plans are now lifetime (100 years)
        const durationMs = 100 * 365 * 24 * 60 * 60 * 1000;
        
        const expiresAt = Date.now() + durationMs;
        
        // No TTL - keep forever for both plans
        const kvOptions = {};

        await env.SNREADY_ACCESS.put(
          `access:${email.toLowerCase()}`,
          JSON.stringify({
            paid: true,
            plan,
            expiresAt,
            sessionId: session.id,
            certification,
            createdAt: Date.now(),
          }),
          kvOptions
        );

        await enqueuePurchaseFollowup(env, {
          sessionId: session.id,
          email,
          plan,
          certification,
          certifications: plan === "single" && certification ? [certification] : [],
          purchasedAt: (session.created || Math.floor(Date.now() / 1000)) * 1000,
        });

        console.log(`Access granted to ${email} (${plan}) until ${new Date(expiresAt).toISOString()}`);
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
