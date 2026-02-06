import Stripe from "stripe";

interface Env {
  STRIPE_SECRET_KEY: string;
  SNREADY_ACCESS: KVNamespace;
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
    const plan = session.metadata?.plan || "30day";
    const certification = session.metadata?.certification || "all";

    if (!email) {
      return new Response(
        JSON.stringify({ error: "No email found" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Grant access (in case webhook was slow)
    const durationMs = plan === "lifetime" 
      ? 100 * 365 * 24 * 60 * 60 * 1000 
      : 30 * 24 * 60 * 60 * 1000;
    
    const expiresAt = Date.now() + durationMs;
    
    const kvOptions = plan === "lifetime" 
      ? {} 
      : { expirationTtl: 30 * 24 * 60 * 60 };

    await env.SNREADY_ACCESS.put(
      email.toLowerCase(),
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

    return new Response(
      JSON.stringify({
        success: true,
        email,
        plan,
        expiresAt,
        certification,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Session verification error:", error);
    return new Response(
      JSON.stringify({ error: "Session verification failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
