"use client";

import { useState } from "react";
import { useAccess } from "./AccessProvider";

type PlanType = "30day" | "lifetime";

interface CheckoutButtonProps {
  certification?: string;
  plan?: PlanType;
  className?: string;
  children: React.ReactNode;
}

export function CheckoutButton({
  certification,
  plan = "30day",
  className = "",
  children,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { hasAccess } = useAccess();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Store current page so we can return after checkout
      localStorage.setItem("snready_checkout_return", window.location.pathname);
      
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ certification, plan }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        localStorage.removeItem("snready_checkout_return");
        setLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      localStorage.removeItem("snready_checkout_return");
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
