import type { FeedbackData, PurchaseData } from "../../lib/feedback";

interface Env {
  SNREADY_ACCESS: KVNamespace;
  ADMIN_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Verify admin secret
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${env.ADMIN_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Get all feedback
    const feedbackList = await env.SNREADY_ACCESS.list({ prefix: "feedback:" });
    const feedbacks: (FeedbackData & { key: string })[] = [];

    for (const key of feedbackList.keys) {
      const raw = await env.SNREADY_ACCESS.get(key.name);
      if (raw) {
        feedbacks.push({ ...JSON.parse(raw), key: key.name });
      }
    }

    // Get all purchases for stats
    const purchaseList = await env.SNREADY_ACCESS.list({ prefix: "purchase:" });
    const purchases: PurchaseData[] = [];

    for (const key of purchaseList.keys) {
      const raw = await env.SNREADY_ACCESS.get(key.name);
      if (raw) {
        purchases.push(JSON.parse(raw));
      }
    }

    // Calculate stats
    const totalPurchases = purchases.length;
    const checkInsSent = purchases.filter(p => p.checkInSent).length;
    const feedbackCount = feedbacks.length;
    
    const passed = feedbacks.filter(f => f.passed === "yes").length;
    const failed = feedbacks.filter(f => f.passed === "no").length;
    const passRate = passed + failed > 0 
      ? Math.round((passed / (passed + failed)) * 100) 
      : null;

    const avgRating = feedbacks.length > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : null;

    // Group by certification
    const byCert: Record<string, { 
      feedback: number; 
      passed: number; 
      failed: number;
      avgRating: number;
    }> = {};

    for (const f of feedbacks) {
      const cert = f.certification || "unknown";
      if (!byCert[cert]) {
        byCert[cert] = { feedback: 0, passed: 0, failed: 0, avgRating: 0 };
      }
      byCert[cert].feedback++;
      if (f.passed === "yes") byCert[cert].passed++;
      if (f.passed === "no") byCert[cert].failed++;
    }

    for (const cert of Object.keys(byCert)) {
      const certFeedbacks = feedbacks.filter(f => f.certification === cert);
      byCert[cert].avgRating = Number(
        (certFeedbacks.reduce((sum, f) => sum + f.rating, 0) / certFeedbacks.length).toFixed(1)
      );
    }

    // Get testimonials (only those with permission)
    const testimonials = feedbacks
      .filter(f => f.canFeature && f.testimonial)
      .map(f => ({
        certification: f.certification,
        testimonial: f.testimonial,
        rating: f.rating,
        passed: f.passed,
      }));

    return new Response(
      JSON.stringify({
        stats: {
          totalPurchases,
          checkInsSent,
          feedbackCount,
          responseRate: checkInsSent > 0 
            ? Math.round((feedbackCount / checkInsSent) * 100) + "%" 
            : "N/A",
          passRate: passRate !== null ? `${passRate}%` : "N/A",
          avgRating,
        },
        byCertification: byCert,
        testimonials,
        recentFeedback: feedbacks
          .sort((a, b) => b.submittedAt - a.submittedAt)
          .slice(0, 20)
          .map(f => ({
            certification: f.certification,
            examTaken: f.examTaken,
            passed: f.passed,
            rating: f.rating,
            testimonial: f.testimonial,
            canFeature: f.canFeature,
            submittedAt: new Date(f.submittedAt).toISOString(),
          })),
      }, null, 2),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Admin feedback error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch feedback" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
