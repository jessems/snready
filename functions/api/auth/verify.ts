import { makeSessionCookie, SESSION_TTL_SECONDS, getAccessData } from "../../lib/session";

interface Env {
  MAGIC_LINK_SECRET: string;
  SNREADY_ACCESS: KVNamespace;
}

const MAGIC_LINK_SECRET_KV_KEY = "config:magic_link_secret";

// Verify HMAC signature
async function verifyToken(token: string, secret: string): Promise<{ valid: boolean; email?: string; error?: string }> {
  try {
    const parts = token.split(":");
    if (parts.length !== 3) {
      return { valid: false, error: "Invalid token format" };
    }

    const [emailBase64, expiresAtStr, signatureBase64] = parts;
    const email = atob(emailBase64);
    const expiresAt = parseInt(expiresAtStr, 10);

    // Check expiration
    if (Date.now() > expiresAt) {
      return { valid: false, error: "Link has expired" };
    }

    // Verify signature
    const encoder = new TextEncoder();
    const data = `${email}:${expiresAt}`;

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signature = Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0));
    const isValid = await crypto.subtle.verify("HMAC", key, signature, encoder.encode(data));

    if (!isValid) {
      return { valid: false, error: "Invalid signature" };
    }

    return { valid: true, email };
  } catch (error) {
    console.error("Token verification error:", error);
    return { valid: false, error: "Invalid token" };
  }
}

async function resolveMagicLinkSecret(env: Env): Promise<string | null> {
  const direct = env.MAGIC_LINK_SECRET?.trim();
  if (direct) return direct;
  const fallback = await env.SNREADY_ACCESS.get(MAGIC_LINK_SECRET_KV_KEY);
  const normalized = fallback?.trim();
  return normalized ? normalized : null;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response(
      JSON.stringify({ error: "Token required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const magicLinkSecret = await resolveMagicLinkSecret(env);

  if (!magicLinkSecret) {
    return new Response(
      JSON.stringify({ error: "Magic link auth is not configured for this deployment" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const result = await verifyToken(token, magicLinkSecret);

  if (!result.valid || !result.email) {
    return new Response(
      JSON.stringify({ error: result.error || "Invalid token" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const email = result.email;

  // Create or update user record
  const existingUser = await env.SNREADY_ACCESS.get(`user:${email}`);
  const now = Date.now();
  if (existingUser) {
    try {
      const user = JSON.parse(existingUser);
      user.lastLoginAt = now;
      await env.SNREADY_ACCESS.put(`user:${email}`, JSON.stringify(user));
    } catch {
      // Corrupted user record — recreate
      await env.SNREADY_ACCESS.put(
        `user:${email}`,
        JSON.stringify({ email, createdAt: now, lastLoginAt: now })
      );
    }
  } else {
    await env.SNREADY_ACCESS.put(
      `user:${email}`,
      JSON.stringify({ email, createdAt: now, lastLoginAt: now })
    );
  }

  // Create server-side session
  const sessionToken = crypto.randomUUID();
  const sessionExpiresAt = now + SESSION_TTL_SECONDS * 1000;
  await env.SNREADY_ACCESS.put(
    `session:${sessionToken}`,
    JSON.stringify({ email, createdAt: now, expiresAt: sessionExpiresAt }),
    { expirationTtl: SESSION_TTL_SECONDS }
  );

  // Look up access data (with migration fallback)
  const accessRecord = await getAccessData(env.SNREADY_ACCESS, email);

  const access = accessRecord
    ? {
        hasAccess: accessRecord.paid && accessRecord.expiresAt > Date.now(),
        plan: accessRecord.plan,
        expiresAt: accessRecord.expiresAt,
      }
    : { hasAccess: false };

  return new Response(
    JSON.stringify({
      success: true,
      email,
      ...access,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": makeSessionCookie(sessionToken),
      },
    }
  );
};
