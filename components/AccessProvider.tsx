"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { getAuthSession, logoutSession } from "@/lib/access";

interface AccessContextType {
  authenticated: boolean;
  hasAccess: boolean;
  email: string | null;
  plan: string | null;
  expiresAt: number | null;
  certifications: string[];
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  hasAccessTo: (certification: string) => boolean;
}

const AccessContext = createContext<AccessContextType | null>(null);

export function AccessProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((session: Awaited<ReturnType<typeof getAuthSession>>) => {
    setAuthenticated(session.authenticated);
    setEmail(session.email || null);
    setHasAccess(session.access.hasAccess);
    setPlan(session.access.plan || null);
    setExpiresAt(session.access.expiresAt || null);
    setCertifications(session.access.certifications || []);
  }, []);

  const refresh = useCallback(async () => {
    try {
      applySession(await getAuthSession());
    } catch {
      setAuthenticated(false);
      setEmail(null);
      setHasAccess(false);
      setPlan(null);
      setExpiresAt(null);
      setCertifications([]);
    }
    setLoading(false);
  }, [applySession]);

  useEffect(() => {
    getAuthSession().then(applySession).catch(() => {
      setAuthenticated(false);
      setEmail(null);
      setHasAccess(false);
      setPlan(null);
      setExpiresAt(null);
      setCertifications([]);
    }).finally(() => {
      setLoading(false);
    });
  }, [applySession]);

  const logout = async () => {
    await logoutSession();
    setAuthenticated(false);
    setHasAccess(false);
    setEmail(null);
    setPlan(null);
    setExpiresAt(null);
    setCertifications([]);
  };

  const hasAccessTo = useCallback((cert: string) => {
    if (!hasAccess) return false;
    if (plan === "all") return true;
    return certifications.some(c => c.toLowerCase() === cert.toLowerCase());
  }, [hasAccess, plan, certifications]);

  return (
    <AccessContext.Provider value={{ authenticated, hasAccess, email, plan, expiresAt, certifications, loading, logout, refresh, hasAccessTo }}>
      {children}
    </AccessContext.Provider>
  );
}

export function useAccess() {
  const context = useContext(AccessContext);
  if (!context) {
    throw new Error("useAccess must be used within AccessProvider");
  }
  return context;
}
