interface Env {
  MAGIC_LINK_SECRET: string;
  SNREADY_ACCESS: KVNamespace;
}

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

  const result = await verifyToken(token, env.MAGIC_LINK_SECRET);

  if (!result.valid || !result.email) {
    return new Response(
      JSON.stringify({ error: result.error || "Invalid token" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Get access data from KV
  const accessData = await env.SNREADY_ACCESS.get(result.email);
  if (!accessData) {
    return new Response(
      JSON.stringify({ error: "No active subscription found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const access = JSON.parse(accessData);
    return new Response(
      JSON.stringify({
        success: true,
        email: result.email,
        expiresAt: access.expiresAt,
        plan: access.plan,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid access data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
