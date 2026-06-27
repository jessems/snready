// Client-side auth helpers — cookie-based sessions

type PlanType = "single" | "all";

export interface AuthSession {
  authenticated: boolean;
  email?: string;
  access: {
    hasAccess: boolean;
    plan?: PlanType;
    expiresAt?: number;
    certification?: string;
    certifications?: string[];
  };
}

type SessionResponse = Partial<AuthSession>;

/**
 * Fetches the current session from the server.
 * The server validates the httpOnly session cookie.
 */
export async function getAuthSession(): Promise<AuthSession> {
  try {
    const response = await fetch("/api/auth/session", {
      credentials: "include",
    });
    const data = await response.json() as SessionResponse;
    if (data.authenticated) {
      return {
        authenticated: true,
        email: data.email,
        access: data.access || { hasAccess: false },
      };
    }
    return { authenticated: false, access: { hasAccess: false } };
  } catch {
    return { authenticated: false, access: { hasAccess: false } };
  }
}

/**
 * Logs out by calling the server to destroy the session and clear the cookie.
 */
export async function logoutSession(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Best-effort logout
  }
  // Clean up any legacy localStorage data
  if (typeof window !== "undefined") {
    localStorage.removeItem("snready_access");
  }
}

/**
 * Verifies a Stripe checkout session. Used by the checkout success page.
 * The server may set a session cookie on this response.
 */
export async function verifySession(sessionId: string): Promise<{
  success: boolean;
  email?: string;
  plan?: PlanType;
  expiresAt?: number;
  certification?: string;
  error?: string;
}> {
  try {
    const response = await fetch(`/api/session?session_id=${sessionId}`, {
      credentials: "include",
    });
    return await response.json();
  } catch {
    return { success: false, error: "Verification failed" };
  }
}
