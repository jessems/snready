interface Env {
  RESEND_API_KEY: string;
  MAGIC_LINK_SECRET: string;
  SITE_URL: string;
  SNREADY_ACCESS: KVNamespace;
}

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

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const { email } = await request.json() as { email: string };

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Valid email required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Create magic link token (valid for 15 minutes)
    const expiresAt = Date.now() + 15 * 60 * 1000;
    const token = await createToken(normalizedEmail, expiresAt, env.MAGIC_LINK_SECRET);
    
    const magicLink = `${env.SITE_URL}/auth/verify?token=${encodeURIComponent(token)}`;

    // Send email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SNReady <login@snready.com>",
        to: normalizedEmail,
        subject: "Your SNReady Login Link",
        html: `
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
        `,
        text: `Log in to SNReady\n\nClick this link to log in: ${magicLink}\n\nThis link expires in 15 minutes.`,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error("Resend error:", errorData);
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
