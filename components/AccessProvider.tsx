"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { getAuthSession, logoutSession } from "@/lib/access";

interface AccessContextType {
  authenticated: boolean;
  hasAccess: boolean;
  email: string | null;
  plan: string | null;
  expiresAt: number | null;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AccessContext = createContext<AccessContextType | null>(null);

export function AccessProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const session = await getAuthSession();
      setAuthenticated(session.authenticated);
      setEmail(session.email || null);
      setHasAccess(session.access.hasAccess);
      setPlan(session.access.plan || null);
      setExpiresAt(session.access.expiresAt || null);
    } catch {
      setAuthenticated(false);
      setEmail(null);
      setHasAccess(false);
      setPlan(null);
      setExpiresAt(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getAuthSession().then(session => {
      setAuthenticated(session.authenticated);
      setEmail(session.email || null);
      setHasAccess(session.access.hasAccess);
      setPlan(session.access.plan || null);
      setExpiresAt(session.access.expiresAt || null);
    }).catch(() => {
      setAuthenticated(false);
      setEmail(null);
      setHasAccess(false);
      setPlan(null);
      setExpiresAt(null);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const logout = async () => {
    await logoutSession();
    setAuthenticated(false);
    setHasAccess(false);
    setEmail(null);
    setPlan(null);
    setExpiresAt(null);
  };

  return (
    <AccessContext.Provider value={{ authenticated, hasAccess, email, plan, expiresAt, loading, logout, refresh }}>
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
