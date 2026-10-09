"use client";

import { useState } from "react";
import PurchaseGuarantee from "./PurchaseGuarantee";
import {
  captureAttribution,
  getPlanValue,
  normalizeTrackedPath,
  trackBeginCheckout,
  trackCheckoutCreated,
  trackCheckoutFailed,
} from "@/lib/analytics";
import { isFreeCertification } from "@/lib/free-certs";
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
      const returnUrl = normalizeTrackedPath(
        `${window.location.pathname}${window.location.search}`,
      );
      const attribution = captureAttribution();
      const value = getPlanValue(plan);
      const trackedReturnUrl = normalizeTrackedPath(window.location.pathname);
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

      if (response.ok && data.url) {
        trackCheckoutCreated({ certification, plan, value, returnUrl: trackedReturnUrl });
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        trackCheckoutFailed({
          certification,
          plan,
          value,
          returnUrl: trackedReturnUrl,
          reason: response.ok ? "missing_checkout_url" : `http_${response.status}`,
        });
        localStorage.removeItem("snready_checkout_return");
        localStorage.removeItem("snready_checkout_intent");
        setLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      trackCheckoutFailed({
        certification,
        plan,
        value: getPlanValue(plan),
        returnUrl: normalizeTrackedPath(window.location.pathname),
        reason: "network_error",
      });
      localStorage.removeItem("snready_checkout_return");
      localStorage.removeItem("snready_checkout_intent");
      setLoading(false);
    }
  };

  // Free certifications (lib/free-certs.ts) are never sold on their own.
  // The checkout API rejects this too; this keeps a stray button off the page.
  if (plan === "single" && isFreeCertification(certification)) {
    return null;
  }

  // If user already has access, show different UI
  if (hasAccess) {
    return (
      <span className={`${className} opacity-75 cursor-default`}>
        ✓ Access Active
      </span>
    );
  }

  const button = (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className={`${className} ${loading ? "opacity-75 cursor-wait" : ""}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
  return plan === "single" ? <div className="guaranteed-purchase">{button}<PurchaseGuarantee compact /></div> : button;
}
