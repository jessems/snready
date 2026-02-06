"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getStoredAccess, storeAccess, clearAccess, verifyAccess } from "@/lib/access";

interface AccessContextType {
  hasAccess: boolean;
  email: string | null;
  expiresAt: number | null;
  loading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AccessContext = createContext<AccessContextType | null>(null);

export function AccessProvider({ children }: { children: ReactNode }) {
  const [hasAccess, setHasAccess] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const stored = getStoredAccess();
    if (stored) {
      // Re-verify with server
      const result = await verifyAccess(stored.email);
      if (result.hasAccess) {
        setHasAccess(true);
        setEmail(stored.email);
        setExpiresAt(result.expiresAt || stored.expiresAt);
        if (result.expiresAt) {
          storeAccess(stored.email, result.expiresAt);
        }
      } else {
        clearAccess();
        setHasAccess(false);
        setEmail(null);
        setExpiresAt(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (userEmail: string): Promise<boolean> => {
    setLoading(true);
    const result = await verifyAccess(userEmail);
    if (result.hasAccess && result.expiresAt) {
      storeAccess(userEmail, result.expiresAt);
      setHasAccess(true);
      setEmail(userEmail);
      setExpiresAt(result.expiresAt);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    clearAccess();
    setHasAccess(false);
    setEmail(null);
    setExpiresAt(null);
  };

  return (
    <AccessContext.Provider value={{ hasAccess, email, expiresAt, loading, login, logout, refresh }}>
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
