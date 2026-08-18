"use client";

import { useState } from "react";
import { captureAttribution, getPlanValue, trackBeginCheckout } from "@/lib/analytics";
import { useAccess } from "./AccessProvider";

type PlanType = "single" | "all";

interface CheckoutButtonProps {
  certification?: string;
  plan?: PlanType;
  className?: string;
  children: React.ReactNode;
}

type CheckoutResponse = { url?: string };

export function CheckoutButton({
  certification,
  plan = "single",
  className = "",
  children,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { hasAccess } = useAccess();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Store checkout context so success/cancel pages can recover intent.
      const returnUrl = `${window.location.pathname}${window.location.search}`;
      const attribution = captureAttribution();
      const value = getPlanValue(plan);
      trackBeginCheckout({ certification, plan, value, returnUrl });

      localStorage.setItem("snready_checkout_return", returnUrl);
      localStorage.setItem(
        "snready_checkout_intent",
        JSON.stringify({
          certification,
          plan,
          returnUrl,
          attribution,
          startedAt: Date.now(),
        })
      );

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ certification, plan, returnUrl, attribution }),
      });

      const data = await response.json() as CheckoutResponse;

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        localStorage.removeItem("snready_checkout_return");
        localStorage.removeItem("snready_checkout_intent");
        setLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      localStorage.removeItem("snready_checkout_return");
      localStorage.removeItem("snready_checkout_intent");
      setLoading(false);
    }
  };

  // If user already has access, show different UI
  if (hasAccess) {
    return (
      <span className={`${className} opacity-75 cursor-default`}>
        ✓ Access Active
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className={`${className} ${loading ? "opacity-75 cursor-wait" : ""}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
