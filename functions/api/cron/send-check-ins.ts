import { Resend } from "resend";
import type { PurchaseData } from "../../lib/feedback";

interface Env {
  SNREADY_ACCESS: KVNamespace;
  RESEND_API_KEY: string;
  CRON_SECRET: string;
  SITE_URL: string;
}

const CHECK_IN_DELAY_MS = 21 * 24 * 60 * 60 * 1000; // 21 days

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Verify cron secret
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const now = Date.now();
  const cutoffTime = now - CHECK_IN_DELAY_MS;

  // List all purchases (prefix scan)
  const purchases = await env.SNREADY_ACCESS.list({ prefix: "purchase:" });
  
  let sent = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const key of purchases.keys) {
    try {
      const raw = await env.SNREADY_ACCESS.get(key.name);
      if (!raw) continue;

      const purchase: PurchaseData = JSON.parse(raw);

      // Skip if already sent check-in
      if (purchase.checkInSent) {
        skipped++;
        continue;
      }

      // Skip if purchased less than 21 days ago
      if (purchase.purchasedAt > cutoffTime) {
        skipped++;
        continue;
      }

      // Send check-in email
      const certName = purchase.certification?.toUpperCase() || "ServiceNow";
      const feedbackUrl = `${env.SITE_URL}/feedback?token=${purchase.feedbackToken}`;

      const { error } = await resend.emails.send({
        from: "SNReady <hello@snready.com>",
        to: purchase.email,
        subject: `How did your ${certName} exam go? 🎯`,
        html: generateEmailHtml(certName, feedbackUrl),
      });

      if (error) {
        errors.push(`${purchase.email}: ${error.message}`);
        continue;
      }

      // Mark as sent
      purchase.checkInSent = true;
      purchase.checkInSentAt = now;
      await env.SNREADY_ACCESS.put(key.name, JSON.stringify(purchase));
      
      sent++;
    } catch (err) {
      errors.push(`${key.name}: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      sent, 
      skipped, 
      errors: errors.length > 0 ? errors : undefined 
    }),
    { headers: { "Content-Type": "application/json" } }
  );
};

function generateEmailHtml(certName: string, feedbackUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px;">Hey! 👋</h1>
  
  <p>It's been a few weeks since you started practicing for your <strong>${certName}</strong> certification with SNReady.</p>
  
  <p>I'm curious — <strong>how did it go?</strong></p>
  
  <p>Whether you've taken the exam or are still preparing, I'd love to hear from you. Your feedback helps me make SNReady better for everyone.</p>
  
  <div style="margin: 30px 0;">
    <a href="${feedbackUrl}" 
       style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
      Share Your Experience (1 min)
    </a>
  </div>
  
  <p style="color: #666; font-size: 14px;">
    If you passed, I'd love to celebrate with you! 🎉<br>
    If you're still studying, let me know if the practice questions are helping.
  </p>
  
  <p style="margin-top: 30px;">
    Cheers,<br>
    <strong>Jesse</strong><br>
    <span style="color: #666; font-size: 14px;">SNReady</span>
  </p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  
  <p style="color: #999; font-size: 12px;">
    You're receiving this because you purchased ${certName} practice questions on SNReady.<br>
    <a href="${feedbackUrl}" style="color: #999;">Unsubscribe from check-in emails</a>
  </p>
</body>
</html>
  `.trim();
}
