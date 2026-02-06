import Stripe from "stripe";

interface Env {
  STRIPE_SECRET_KEY: string;
  SITE_URL: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const { certification } = await request.json() as { certification?: string };

    const stripe = new Stripe(env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `SNReady ${certification || "Full"} Access`,
              description: "30-day access to all practice questions with detailed explanations",
            },
            unit_amount: 900, // $9.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${env.SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.SITE_URL}/checkout/cancel`,
      metadata: {
        certification: certification || "all",
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ 
        error: "Failed to create checkout session",
        details: errorMessage,
        hasStripeKey: !!env.STRIPE_SECRET_KEY,
        hasSiteUrl: !!env.SITE_URL,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
