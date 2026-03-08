// Shared session utilities for Cloudflare Pages Functions

export const SESSION_COOKIE_NAME = "snready_session";
export const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

export function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  for (const part of cookieHeader.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key) {
      cookies[key] = rest.join("=");
    }
  }
  return cookies;
}

export function getSessionToken(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = parseCookies(cookieHeader);
  return cookies[SESSION_COOKIE_NAME] || null;
}

export function makeSessionCookie(token: string, maxAge: number = SESSION_TTL_SECONDS): string {
  return `${SESSION_COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

export function makeClearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

/**
 * Look up access data with dual-read fallback for migration.
 * Tries `access:{email}` first, then bare `{email}`.
 */
export async function getAccessData(
  kv: KVNamespace,
  email: string
): Promise<{ paid: boolean; plan: string; expiresAt: number; sessionId?: string; certification?: string; createdAt?: number } | null> {
  // Try new prefixed key first
  let raw = await kv.get(`access:${email}`);
  if (!raw) {
    // Fallback to bare email (pre-migration data)
    raw = await kv.get(email);
    if (raw) {
      // Opportunistically migrate: write to new key
      // Both plans are now lifetime, no TTL needed
      await kv.put(`access:${email}`, raw, {});
    }
  }
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
