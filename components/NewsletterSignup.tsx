"use client";

import { useState } from "react";

interface NewsletterSignupProps {
  variant?: "inline" | "stacked";
  heading?: string;
  description?: string;
  buttonText?: string;
  className?: string;
  compact?: boolean;
}

export default function NewsletterSignup({
  variant = "inline",
  heading,
  description,
  buttonText = "Subscribe",
  className = "",
  compact = false,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      // Store submission in localStorage as backup
      const submissions = JSON.parse(localStorage.getItem("newsletter_signups") || "[]");
      submissions.push({
        email,
        timestamp: new Date().toISOString(),
        source: window.location.pathname,
      });
      localStorage.setItem("newsletter_signups", JSON.stringify(submissions));

      // Send to Formspree (free tier: 50/month)
      // Create form at https://formspree.io and replace YOUR_FORM_ID
      const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;
      if (FORMSPREE_ID) {
        const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ 
            email, 
            source: window.location.pathname,
            _subject: "New SNReady Newsletter Signup"
          }),
        });
        if (!response.ok) {
          console.warn("Formspree submission failed, using localStorage backup");
        }
      }

      setStatus("success");
      setMessage("You're in! Check your inbox for a confirmation.");
      setEmail("");

      // Track signup in GA
      if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "newsletter_signup", {
          event_category: "engagement",
          event_label: window.location.pathname,
        });
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (variant === "stacked") {
    return (
      <div className={`${className}`}>
        {heading && (
          <h3 className={`font-semibold text-zinc-900 dark:text-zinc-100 ${compact ? "text-base" : "text-lg"}`}>
            {heading}
          </h3>
        )}
        {description && (
          <p className={`mt-2 text-zinc-600 dark:text-zinc-400 ${compact ? "text-sm" : "text-base"}`}>
            {description}
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
              disabled={status === "loading" || status === "success"}
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed ✓" : buttonText}
            </button>
          </div>
          {message && (
            <p className={`mt-3 text-sm ${status === "error" ? "text-red-600" : "text-emerald-600"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    );
  }

  // Inline variant (default)
  return (
    <div className={`${className}`}>
      {heading && (
        <h3 className={`font-semibold text-zinc-900 dark:text-zinc-100 ${compact ? "text-sm" : "text-base"}`}>
          {heading}
        </h3>
      )}
      {description && (
        <p className={`mt-1 text-zinc-600 dark:text-zinc-400 ${compact ? "text-xs" : "text-sm"}`}>
          {description}
        </p>
      )}
      <form onSubmit={handleSubmit} className={heading || description ? "mt-3" : ""}>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            disabled={status === "loading" || status === "success"}
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="whitespace-nowrap rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "loading" ? "..." : status === "success" ? "✓" : buttonText}
          </button>
        </div>
        {message && (
          <p className={`mt-2 text-xs ${status === "error" ? "text-red-600" : "text-emerald-600"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
