// Client-side access management

const ACCESS_KEY = "snready_access";

type PlanType = "30day" | "lifetime";

interface AccessData {
  email: string;
  expiresAt: number;
  plan?: PlanType;
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

export function storeAccess(email: string, expiresAt: number, plan?: PlanType): void {
  const data: AccessData = {
    email,
    expiresAt,
    plan,
    verifiedAt: Date.now(),
  };
  localStorage.setItem(ACCESS_KEY, JSON.stringify(data));
}

export function clearAccess(): void {
  localStorage.removeItem(ACCESS_KEY);
}

export async function verifyAccess(email: string): Promise<{ hasAccess: boolean; expiresAt?: number; plan?: PlanType }> {
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

export async function verifySession(sessionId: string): Promise<{ 
  success: boolean; 
  email?: string; 
  plan?: PlanType;
  expiresAt?: number; 
  certification?: string;
  error?: string;
}> {
  try {
    const response = await fetch(`/api/session?session_id=${sessionId}`);
    return await response.json();
  } catch {
    return { success: false, error: "Verification failed" };
  }
}
