// Shared paid-access checks for Cloudflare Pages Functions.
// Uses the same session cookie + KV records as /api/auth/session.

import { getAccessData, getSessionToken } from "./session";

export type AccessRecord = NonNullable<Awaited<ReturnType<typeof getAccessData>>>;

export type SessionAccess =
  | { authenticated: false }
  | { authenticated: true; email: string; access: AccessRecord | null };

/**
 * Resolves the signed-in user and their access record from the session cookie.
 * Never throws for malformed/expired sessions; returns { authenticated: false }.
 */
export async function getSessionAccess(request: Request, kv: KVNamespace): Promise<SessionAccess> {
  const sessionToken = getSessionToken(request);
  if (!sessionToken) return { authenticated: false };

  const sessionRaw = await kv.get(`session:${sessionToken}`);
  if (!sessionRaw) return { authenticated: false };

  let session: { email?: string; expiresAt?: number };
  try {
    session = JSON.parse(sessionRaw);
  } catch {
    return { authenticated: false };
  }

  if (!session.email || typeof session.expiresAt !== "number" || session.expiresAt < Date.now()) {
    return { authenticated: false };
  }

  const access = await getAccessData(kv, session.email);
  return { authenticated: true, email: session.email, access };
}

/**
 * True when the access record grants the given certification slug.
 * Matches the client-side AccessProvider.hasAccessTo rules: an active paid record
 * with plan "all", or a single-cert purchase listing this certification
 * (stored uppercase by checkout, e.g. "CIS-DISCOVERY" for slug "cis-discovery").
 */
export function hasCertificationAccess(access: AccessRecord | null, certSlug: string, now: number = Date.now()): boolean {
  if (!access || !access.paid) return false;
  if (typeof access.expiresAt !== "number" || access.expiresAt <= now) return false;
  if (access.plan === "all") return true;

  const certifications = access.certifications || (access.certification ? [access.certification] : []);
  const target = certSlug.toLowerCase();
  return certifications.some((cert) => typeof cert === "string" && cert.toLowerCase() === target);
}
