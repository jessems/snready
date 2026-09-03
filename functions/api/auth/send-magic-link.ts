/// <reference types="@cloudflare/workers-types" />

interface Env {
  RESEND_API_KEY: string;
  MAGIC_LINK_SECRET: string;
  SITE_URL?: string;
  SNREADY_ACCESS: KVNamespace;
}

const MAGIC_LINK_SECRET_KV_KEY = "config:magic_link_secret";
const RESEND_API_KEY_KV_KEY = "config:resend_api_key";
const MAGIC_LINK_FROM_EMAIL = "SNReady <jesse@snready.com>";
const MAGIC_LINK_REPLY_TO = "jesse@snready.com";

// Simple HMAC-like signature using Web Crypto
async function createToken(email: string, expiresAt: number, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = `${email}:${expiresAt}`;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

  // Token format: base64(email):expiresAt:signature
  const emailBase64 = btoa(email);
  return `${emailBase64}:${expiresAt}:${signatureBase64}`;
}

function getRequestOrigin(request: Request): string {
  const url = new URL(request.url);
  return url.origin;
}

function sanitizeRedirect(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

async function readConfigSecret(kv: KVNamespace, key: string): Promise<string | null> {
  const value = await kv.get(key);
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

async function resolveMagicLinkSecret(env: Env): Promise<string | null> {
  const direct = env.MAGIC_LINK_SECRET?.trim();
  if (direct) return direct;
  return readConfigSecret(env.SNREADY_ACCESS, MAGIC_LINK_SECRET_KV_KEY);
}

async function resolveResendApiKey(env: Env): Promise<string | null> {
  const direct = env.RESEND_API_KEY?.trim();
  if (direct) return direct;
  return readConfigSecret(env.SNREADY_ACCESS, RESEND_API_KEY_KV_KEY);
}

function getEmailHtml(magicLink: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #059669; margin-bottom: 24px;">SNReady</h1>
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Click the button below to log in to your SNReady account:
      </p>
      <div style="margin: 32px 0;">
        <a href="${magicLink}"
           style="background-color: #059669; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
          Log in to SNReady
        </a>
      </div>
      <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
        This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.
      </p>
      <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
        Or copy this link: <br/>
        <a href="${magicLink}" style="color: #059669; word-break: break-all;">${magicLink}</a>
      </p>
    </div>
  `;
}

function getEmailText(magicLink: string): string {
  return `Log in to SNReady\n\nClick this link to log in: ${magicLink}\n\nThis link expires in 15 minutes.`;
}

async function sendViaResend(apiKey: string, normalizedEmail: string, magicLink: string): Promise<Response> {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: MAGIC_LINK_FROM_EMAIL,
      to: normalizedEmail,
      reply_to: MAGIC_LINK_REPLY_TO,
      subject: "Your SNReady Login Link",
      html: getEmailHtml(magicLink),
      text: getEmailText(magicLink),
    }),
  });
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const { email, redirect, dryRun } = await request.json() as { email: string; redirect?: string; dryRun?: boolean };

    if (!email || !email.includes("@")) {
      return jsonResponse({ error: "Valid email required", code: "invalid_email" }, 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const magicLinkSecret = await resolveMagicLinkSecret(env);
    const resendApiKey = await resolveResendApiKey(env);

    if (!magicLinkSecret) {
      console.error("Magic link auth is not configured for this deployment", {
        hasMagicLinkSecret: Boolean(env.MAGIC_LINK_SECRET),
        hasMagicLinkSecretKvFallback: Boolean(await env.SNREADY_ACCESS.get(MAGIC_LINK_SECRET_KV_KEY)),
        hasResendApiKey: Boolean(env.RESEND_API_KEY),
        hasResendApiKeyKvFallback: Boolean(await env.SNREADY_ACCESS.get(RESEND_API_KEY_KV_KEY)),
      });
      return jsonResponse({
        error: "Magic link auth is not configured for this deployment",
        code: "magic_link_not_configured",
      }, 503);
    }

    if (!resendApiKey) {
      console.error("Magic link email provider is not configured for this deployment", {
        hasResendApiKey: Boolean(env.RESEND_API_KEY),
        hasResendApiKeyKvFallback: Boolean(await env.SNREADY_ACCESS.get(RESEND_API_KEY_KV_KEY)),
      });
      return jsonResponse({
        error: "Magic link email provider is not configured for this deployment",
        code: "resend_not_configured",
      }, 503);
    }

    if (dryRun) {
      return jsonResponse({
        success: true,
        configured: true,
        message: "Magic link auth configuration looks present",
      });
    }

    // Create magic link token (valid for 15 minutes)
    const expiresAt = Date.now() + 15 * 60 * 1000;
    const token = await createToken(normalizedEmail, expiresAt, magicLinkSecret);

    const redirectPath = sanitizeRedirect(redirect);
    const magicUrl = new URL("/auth/verify", getRequestOrigin(request));
    magicUrl.searchParams.set("token", token);
    if (redirectPath) magicUrl.searchParams.set("redirect", redirectPath);
    const magicLink = magicUrl.toString();

    const emailResponse = await sendViaResend(resendApiKey, normalizedEmail, magicLink);

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Resend send failed", {
        status: emailResponse.status,
        body: errorData,
        to: normalizedEmail,
      });
      return jsonResponse({
        error: "Failed to send email",
        code: "resend_send_failed",
        providerStatus: emailResponse.status,
      }, 502);
    }

    return jsonResponse({ success: true, message: "Magic link sent" });
  } catch (error) {
    console.error("Magic link error:", error);
    return jsonResponse({ error: "Failed to send magic link", code: "magic_link_request_failed" }, 500);
  }
};
