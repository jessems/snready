/// <reference types="@cloudflare/workers-types" />

interface Env {
  RESEND_API_KEY: string;
  MAGIC_LINK_SECRET: string;
  SITE_URL?: string;
  SNREADY_ACCESS: KVNamespace;
}

const MAGIC_LINK_SECRET_KV_KEY = "config:magic_link_secret";
const RESEND_API_KEY_KV_KEY = "config:resend_api_key";

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

const MAGIC_LINK_FROM_EMAIL = "SNReady <jesse@snready.com>";
const MAGIC_LINK_REPLY_TO = "jesse@snready.com";

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

async function sendViaMailChannels(normalizedEmail: string, magicLink: string): Promise<Response> {
  return fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: normalizedEmail }],
        },
      ],
      from: {
        email: "jesse@snready.com",
        name: "SNReady",
      },
      reply_to: {
        email: "jesse@snready.com",
        name: "SNReady Support",
      },
      subject: "Your SNReady Login Link",
      content: [
        {
          type: "text/plain",
          value: getEmailText(magicLink),
        },
        {
          type: "text/html",
          value: getEmailHtml(magicLink),
        },
      ],
    }),
  });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const { email, redirect } = await request.json() as { email: string; redirect?: string };

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Valid email required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
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
      return new Response(
        JSON.stringify({ error: "Magic link auth is not configured for this deployment" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create magic link token (valid for 15 minutes)
    const expiresAt = Date.now() + 15 * 60 * 1000;
    const token = await createToken(normalizedEmail, expiresAt, magicLinkSecret);

    const redirectPath = sanitizeRedirect(redirect);
    const magicUrl = new URL("/auth/verify", getRequestOrigin(request));
    magicUrl.searchParams.set("token", token);
    if (redirectPath) magicUrl.searchParams.set("redirect", redirectPath);
    const magicLink = magicUrl.toString();

    let emailResponse: Response;

    if (resendApiKey) {
      emailResponse = await sendViaResend(resendApiKey, normalizedEmail, magicLink);

      if (!emailResponse.ok) {
        const resendError = await emailResponse.text();
        console.error("Resend error; falling back to MailChannels:", resendError);
        emailResponse = await sendViaMailChannels(normalizedEmail, magicLink);
      }
    } else {
      emailResponse = await sendViaMailChannels(normalizedEmail, magicLink);
    }

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("MailChannels error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Magic link sent" }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Magic link error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send magic link" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
