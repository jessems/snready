import Stripe from "stripe";

interface Env {
  STRIPE_SECRET_KEY: string;
  SITE_URL: string;
}

type PlanType = "30day" | "lifetime";

const PLANS = {
  "30day": {
    price: 900, // $9.00 in cents
    name: "30-Day Access",
    description: "30-day access to all practice questions with detailed explanations",
  },
  "lifetime": {
    price: 4900, // $49.00 in cents
    name: "Lifetime Access — All Certifications",
    description: "Lifetime access to ALL certifications and practice questions — never expires",
  },
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const { certification, plan = "30day" } = await request.json() as { 
      certification?: string;
      plan?: PlanType;
    };

    const selectedPlan = PLANS[plan] || PLANS["30day"];
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `SNReady ${certification || "Full"} ${selectedPlan.name}`,
              description: selectedPlan.description,
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
