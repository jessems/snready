import Stripe from "stripe";

interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  SNREADY_ACCESS: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  try {
    const body = await request.text();
    const event = stripe.webhooks.constructEvent(
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
        console.log(`Access granted to ${email} (${plan}) until ${new Date(expiresAt).toISOString()}`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
};
