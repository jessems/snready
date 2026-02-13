interface Env {
  SNREADY_ACCESS: KVNamespace;
}

interface AccessRecord {
  paid: boolean;
  expiresAt: number;
  sessionId: string;
  certification: string;
  createdAt: number;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const { email } = await request.json() as { email: string };

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const normalizedEmail = email.toLowerCase();
    // Try new prefixed key first, fall back to bare email for migration
    let record = await env.SNREADY_ACCESS.get(`access:${normalizedEmail}`);
    if (!record) {
      record = await env.SNREADY_ACCESS.get(normalizedEmail);
    }

    if (!record) {
      return new Response(
        JSON.stringify({ hasAccess: false }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const access: AccessRecord = JSON.parse(record);
    const hasAccess = access.paid && access.expiresAt > Date.now();

    return new Response(
      JSON.stringify({
        hasAccess,
        expiresAt: access.expiresAt,
        certification: access.certification,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Verify error:", error);
    return new Response(
      JSON.stringify({ error: "Verification failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
