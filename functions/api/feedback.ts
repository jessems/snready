import type { FeedbackData, PurchaseData } from "../lib/feedback";

interface Env {
  SNREADY_ACCESS: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body = await request.json() as {
      token: string;
      examTaken: 'yes' | 'no' | 'scheduled';
      passed?: 'yes' | 'no' | 'waiting';
      rating: number;
      testimonial?: string;
      canFeature?: boolean;
    };

    const { token, examTaken, passed, rating, testimonial, canFeature } = body;

    if (!token || !examTaken || !rating) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ error: "Rating must be 1-5" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the purchase by token
    const purchases = await env.SNREADY_ACCESS.list({ prefix: "purchase:" });
    let matchedPurchase: PurchaseData | null = null;
    let purchaseKey: string | null = null;

    for (const key of purchases.keys) {
      const raw = await env.SNREADY_ACCESS.get(key.name);
      if (!raw) continue;
      
      const purchase: PurchaseData = JSON.parse(raw);
      if (purchase.feedbackToken === token) {
        matchedPurchase = purchase;
        purchaseKey = key.name;
        break;
      }
    }

    if (!matchedPurchase || !purchaseKey) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired feedback token" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Store feedback
    const feedback: FeedbackData = {
      email: matchedPurchase.email,
      certification: matchedPurchase.certification,
      examTaken,
      passed: examTaken === 'yes' ? passed : undefined,
      rating,
      testimonial: testimonial?.trim() || undefined,
      canFeature: canFeature || false,
      submittedAt: Date.now(),
    };

    await env.SNREADY_ACCESS.put(
      `feedback:${matchedPurchase.email}:${matchedPurchase.certification}`,
      JSON.stringify(feedback)
    );

    console.log(`Feedback received from ${matchedPurchase.email} for ${matchedPurchase.certification}: ${rating}/5`);

    return new Response(
      JSON.stringify({ success: true, message: "Thank you for your feedback!" }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Feedback submission error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to submit feedback" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

// GET endpoint to validate token and return purchase info
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response(
      JSON.stringify({ error: "Missing token" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Find the purchase by token
  const purchases = await env.SNREADY_ACCESS.list({ prefix: "purchase:" });
  
  for (const key of purchases.keys) {
    const raw = await env.SNREADY_ACCESS.get(key.name);
    if (!raw) continue;
    
    const purchase: PurchaseData = JSON.parse(raw);
    if (purchase.feedbackToken === token) {
      // Check if already submitted feedback
      const existingFeedback = await env.SNREADY_ACCESS.get(
        `feedback:${purchase.email}:${purchase.certification}`
      );

      return new Response(
        JSON.stringify({
          valid: true,
          certification: purchase.certification,
          alreadySubmitted: !!existingFeedback,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
  }

  return new Response(
    JSON.stringify({ valid: false, error: "Invalid or expired token" }),
    { status: 400, headers: { "Content-Type": "application/json" } }
  );
};
