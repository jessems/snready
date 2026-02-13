import { getSessionToken, makeClearSessionCookie } from "../../lib/session";

interface Env {
  SNREADY_ACCESS: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const sessionToken = getSessionToken(request);

  if (sessionToken) {
    // Delete session from KV
    await env.SNREADY_ACCESS.delete(`session:${sessionToken}`);
  }

  return new Response(
    JSON.stringify({ success: true }),
    {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": makeClearSessionCookie(),
      },
    }
  );
};
