"use client";

import { useEffect } from "react";
import { captureAttribution, trackPageView } from "@/lib/analytics";

export function Analytics() {
  useEffect(() => {
    const track = () => {
      captureAttribution();
      const path = `${window.location.pathname}${window.location.search}`;
      trackPageView(path);
    };

    track();

    // Next.js app-router navigations update history without a full reload. Patch
    // history once per mount so paid-search landing/click paths are visible in GA4.
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    const dispatchLocationChange = () => window.dispatchEvent(new Event("snready:locationchange"));

    window.history.pushState = function pushState(...args) {
      originalPushState.apply(this, args);
      dispatchLocationChange();
    };
    window.history.replaceState = function replaceState(...args) {
      originalReplaceState.apply(this, args);
      dispatchLocationChange();
    };

    window.addEventListener("popstate", dispatchLocationChange);
    window.addEventListener("snready:locationchange", track);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", dispatchLocationChange);
      window.removeEventListener("snready:locationchange", track);
    };
  }, []);

  return null;
}
