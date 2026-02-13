import { getSessionToken, getAccessData } from "../../lib/session";

interface Env {
  SNREADY_ACCESS: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const sessionToken = getSessionToken(request);

  if (!sessionToken) {
    return new Response(
      JSON.stringify({ authenticated: false }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // Look up session
  const sessionRaw = await env.SNREADY_ACCESS.get(`session:${sessionToken}`);
  if (!sessionRaw) {
    return new Response(
      JSON.stringify({ authenticated: false }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  let session: { email: string; createdAt: number; expiresAt: number };
  try {
    session = JSON.parse(sessionRaw);
  } catch {
    return new Response(
      JSON.stringify({ authenticated: false }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // Check session expiry
  if (session.expiresAt < Date.now()) {
    await env.SNREADY_ACCESS.delete(`session:${sessionToken}`);
    return new Response(
      JSON.stringify({ authenticated: false }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // Look up access data (with migration fallback)
  const accessRecord = await getAccessData(env.SNREADY_ACCESS, session.email);

  const access = accessRecord
    ? {
        hasAccess: accessRecord.paid && accessRecord.expiresAt > Date.now(),
        plan: accessRecord.plan,
        expiresAt: accessRecord.expiresAt,
        certification: accessRecord.certification,
      }
    : { hasAccess: false };

  return new Response(
    JSON.stringify({
      authenticated: true,
      email: session.email,
      access,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
};
