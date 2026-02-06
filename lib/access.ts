// Client-side access management

const ACCESS_KEY = "snready_access";

interface AccessData {
  email: string;
  expiresAt: number;
  verifiedAt: number;
}

export function getStoredAccess(): AccessData | null {
  if (typeof window === "undefined") return null;
  
  const stored = localStorage.getItem(ACCESS_KEY);
  if (!stored) return null;
  
  try {
    const data: AccessData = JSON.parse(stored);
    // Check if expired
    if (data.expiresAt < Date.now()) {
      localStorage.removeItem(ACCESS_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function storeAccess(email: string, expiresAt: number): void {
  const data: AccessData = {
    email,
    expiresAt,
    verifiedAt: Date.now(),
  };
  localStorage.setItem(ACCESS_KEY, JSON.stringify(data));
}

export function clearAccess(): void {
  localStorage.removeItem(ACCESS_KEY);
}

export async function verifyAccess(email: string): Promise<{ hasAccess: boolean; expiresAt?: number }> {
  try {
    const response = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch {
    return { hasAccess: false };
  }
}

export async function verifySession(sessionId: string): Promise<{ success: boolean; email?: string; expiresAt?: number; error?: string }> {
  try {
    const response = await fetch(`/api/session?session_id=${sessionId}`);
    return await response.json();
  } catch {
    return { success: false, error: "Verification failed" };
  }
}
