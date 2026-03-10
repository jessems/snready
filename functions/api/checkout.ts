import Stripe from "stripe";

interface Env {
  STRIPE_SECRET_KEY: string;
  SITE_URL: string;
}

type PlanType = "single" | "all";

const PLANS = {
  "single": {
    price: 900, // $9.00 in cents
    name: "Lifetime Access — Single Certification",
    // Description is generated dynamically to include cert name
  },
  "all": {
    price: 4900, // $49.00 in cents
    name: "Lifetime Access — All Certifications",
    description: "Lifetime access to ALL certifications and practice questions — never expires",
  },
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const { certification, plan = "single" } = await request.json() as { 
      certification?: string;
      plan?: PlanType;
    };

    const selectedPlan = PLANS[plan] || PLANS["single"];
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);

    // Generate description based on plan and certification
    const productDescription = plan === "all"
      ? PLANS.all.description
      : `Lifetime access to ${certification?.toUpperCase() || "all"} practice questions with detailed explanations — never expires`;

    const productName = plan === "all"
      ? `SNReady ${PLANS.all.name}`
      : `SNReady ${certification?.toUpperCase() || "Full Access"} — Lifetime`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description: productDescription,
            },
            unit_amount: selectedPlan.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${env.SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.SITE_URL}/checkout/cancel`,
      metadata: {
        certification: certification || "all",
        plan: plan,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create checkout session" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
