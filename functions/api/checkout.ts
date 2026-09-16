import Stripe from "stripe";

interface Env {
  STRIPE_SECRET_KEY: string;
  SITE_URL: string;
  SNREADY_ACCESS?: KVNamespace;
}

function errorResponse(status: number, error: string, code: string, extra?: Record<string, unknown>) {
  return new Response(
    JSON.stringify({ error, code, ...(extra || {}) }),
    { status, headers: { "Content-Type": "application/json" } }
  );
}

function missingCheckoutConfig(env: Env) {
  const missing: string[] = [];
  if (!env.STRIPE_SECRET_KEY?.trim()) missing.push("STRIPE_SECRET_KEY");
  if (!env.SITE_URL?.trim()) missing.push("SITE_URL");
  return missing;
}

function stripeErrorDetails(error: unknown) {
  if (!error || typeof error !== "object") {
    return { code: "stripe_checkout_failed" };
  }

  const stripeError = error as {
    type?: string;
    code?: string;
    statusCode?: number;
    raw?: { type?: string; code?: string; message?: string };
    message?: string;
  };

  const providerType = stripeError.type || stripeError.raw?.type;
  const providerCode = stripeError.code || stripeError.raw?.code;
  const providerMessage = stripeError.message || stripeError.raw?.message;
  const providerStatus = stripeError.statusCode;

  let code = "stripe_checkout_failed";
  if (providerStatus === 401 || providerType === "StripeAuthenticationError" || providerType === "authentication_error") {
    code = "stripe_auth_failed";
  } else if (providerStatus === 403 || providerCode === "permission_error") {
    code = "stripe_permission_denied";
  } else if (providerType === "StripeInvalidRequestError" || providerType === "invalid_request_error" || providerStatus === 400) {
    code = "stripe_checkout_invalid_request";
  }

  return {
    code,
    ...(providerType ? { providerType } : {}),
    ...(providerCode ? { providerCode } : {}),
    ...(providerStatus ? { providerStatus } : {}),
    ...(providerMessage ? { providerMessage } : {}),
  };
}

type PlanType = "single" | "all";

type AttributionData = Record<string, string | undefined>;

const ATTRIBUTION_METADATA_KEYS = [
  "gaClientId",
  "gaSessionId",
  "gaSessionCookie",
  "firstLandingPage",
  "firstReferrer",
  "firstInferredSource",
  "firstInferredMedium",
  "firstUtmSource",
  "firstUtmMedium",
  "firstUtmCampaign",
  "firstUtmTerm",
  "firstUtmContent",
  "firstGclid",
  "firstGbraid",
  "firstWbraid",
  "firstMsclkid",
  "lastLandingPage",
  "lastReferrer",
  "lastInferredSource",
  "lastInferredMedium",
  "lastUtmSource",
  "lastUtmMedium",
  "lastUtmCampaign",
  "lastUtmTerm",
  "lastUtmContent",
  "lastGclid",
  "lastGbraid",
  "lastWbraid",
  "lastMsclkid",
  "firstSeenAt",
  "lastSeenAt",
] as const;

function attributionMetadata(attribution: AttributionData | undefined) {
  const metadata: Record<string, string> = {};
  if (!attribution || typeof attribution !== "object") return metadata;

  for (const key of ATTRIBUTION_METADATA_KEYS) {
    const rawValue = attribution[key];
    if (typeof rawValue !== "string" || !rawValue) continue;
    metadata[key] = rawValue.slice(0, 240);
  }

  return metadata;
}

const ATTRIBUTION_DIAGNOSTICS_PREFIX = "attribution_diagnostics:";

function utcDayKey(date = new Date()) {
  return `${ATTRIBUTION_DIAGNOSTICS_PREFIX}${date.toISOString().slice(0, 10)}`;
}

function hasAnyUtm(attribution: AttributionData | undefined) {
  if (!attribution) return false;
  return Boolean(
    attribution.firstUtmSource ||
      attribution.firstUtmMedium ||
      attribution.firstUtmCampaign ||
      attribution.firstUtmTerm ||
      attribution.firstUtmContent ||
      attribution.lastUtmSource ||
      attribution.lastUtmMedium ||
      attribution.lastUtmCampaign ||
      attribution.lastUtmTerm ||
      attribution.lastUtmContent
  );
}

function hasAnyClickId(attribution: AttributionData | undefined) {
  if (!attribution) return false;
  return Boolean(
    attribution.firstGclid ||
      attribution.lastGclid ||
      attribution.firstGbraid ||
      attribution.lastGbraid ||
      attribution.firstWbraid ||
      attribution.lastWbraid ||
      attribution.firstMsclkid ||
      attribution.lastMsclkid
  );
}

function isStrictGoogleCpc(attribution: AttributionData | undefined) {
  if (!attribution) return false;
  const values = [
    attribution.firstUtmSource,
    attribution.lastUtmSource,
    attribution.firstUtmMedium,
    attribution.lastUtmMedium,
    attribution.firstUtmCampaign,
    attribution.lastUtmCampaign,
    attribution.firstGclid,
    attribution.lastGclid,
    attribution.firstGbraid,
    attribution.lastGbraid,
    attribution.firstWbraid,
    attribution.lastWbraid,
  ]
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .map((value) => value.toLowerCase());

  return values.some((value) =>
    value === "google" ||
    value === "cpc" ||
    value === "ppc" ||
    value.includes("google") ||
    /^[a-z0-9_-]{20,}$/i.test(value)
  );
}

function isInferredSearchReferrer(attribution: AttributionData | undefined) {
  if (!attribution) return false;
  return attribution.firstInferredMedium === "search-referrer" || attribution.lastInferredMedium === "search-referrer";
}

function bucketValue(value: string | undefined, fallback = "unknown") {
  if (!value) return fallback;
  return value.toLowerCase().slice(0, 80);
}

function incrementBucket(target: Record<string, number>, key: string) {
  target[key] = (target[key] || 0) + 1;
}

async function recordAttributionDiagnostics(env: Env, input: {
  plan: PlanType;
  certification: string;
  attribution?: AttributionData;
}) {
  if (!env.SNREADY_ACCESS) return;

  const key = utcDayKey();

  try {
    const existingRaw = await env.SNREADY_ACCESS.get(key);
    const existing = existingRaw ? JSON.parse(existingRaw) as Record<string, unknown> : {};
    const buckets = (existing.buckets && typeof existing.buckets === "object") ? existing.buckets as Record<string, Record<string, number>> : {};
    const sourceBucket = { ...(buckets.source || {}) };
    const mediumBucket = { ...(buckets.medium || {}) };
    const certBucket = { ...(buckets.certification || {}) };
    const planBucket = { ...(buckets.plan || {}) };

    incrementBucket(sourceBucket, bucketValue(input.attribution?.lastUtmSource || input.attribution?.firstUtmSource || input.attribution?.lastInferredSource || input.attribution?.firstInferredSource));
    incrementBucket(mediumBucket, bucketValue(input.attribution?.lastUtmMedium || input.attribution?.firstUtmMedium || input.attribution?.lastInferredMedium || input.attribution?.firstInferredMedium));
    incrementBucket(certBucket, bucketValue(input.certification));
    incrementBucket(planBucket, bucketValue(input.plan));

    const next = {
      date: key.slice(ATTRIBUTION_DIAGNOSTICS_PREFIX.length),
      updatedAt: new Date().toISOString(),
      totals: {
        totalCheckouts: Number(existing?.totals && typeof existing.totals === "object" ? (existing.totals as Record<string, unknown>).totalCheckouts || 0 : 0) + 1,
        withGaClientId: Number(existing?.totals && typeof existing.totals === "object" ? (existing.totals as Record<string, unknown>).withGaClientId || 0 : 0) + (input.attribution?.gaClientId ? 1 : 0),
        withGaSessionId: Number(existing?.totals && typeof existing.totals === "object" ? (existing.totals as Record<string, unknown>).withGaSessionId || 0 : 0) + (input.attribution?.gaSessionId || input.attribution?.gaSessionCookie ? 1 : 0),
        withAnyUtm: Number(existing?.totals && typeof existing.totals === "object" ? (existing.totals as Record<string, unknown>).withAnyUtm || 0 : 0) + (hasAnyUtm(input.attribution) ? 1 : 0),
        withAnyClickId: Number(existing?.totals && typeof existing.totals === "object" ? (existing.totals as Record<string, unknown>).withAnyClickId || 0 : 0) + (hasAnyClickId(input.attribution) ? 1 : 0),
        strictGoogleCpc: Number(existing?.totals && typeof existing.totals === "object" ? (existing.totals as Record<string, unknown>).strictGoogleCpc || 0 : 0) + (isStrictGoogleCpc(input.attribution) ? 1 : 0),
        inferredSearchReferrer: Number(existing?.totals && typeof existing.totals === "object" ? (existing.totals as Record<string, unknown>).inferredSearchReferrer || 0 : 0) + (isInferredSearchReferrer(input.attribution) ? 1 : 0),
      },
      buckets: {
        source: sourceBucket,
        medium: mediumBucket,
        certification: certBucket,
        plan: planBucket,
      },
    };

    await env.SNREADY_ACCESS.put(key, JSON.stringify(next));
  } catch (error) {
    console.error("Failed to record attribution diagnostics", error);
  }
}

const PLANS = {
  "single": {
    price: 900, // $9.00 in cents
    name: "Lifetime Access — Single Certification",
    // Description is generated dynamically to include cert name
  },
  "all": {
    price: 4900, // $49.00 in cents
    name: "Lifetime Access — All Certifications",
    description: "Lifetime access to ALL certifications and practice questions — never expires",
  },
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const missing = missingCheckoutConfig(env);

  if (missing.length > 0) {
    console.error("Checkout is not configured for this deployment", { missing });
    return errorResponse(503, "Checkout is not configured for this deployment", "checkout_not_configured", { missing });
  }

  try {
    const { certification, plan: rawPlan, returnUrl, attribution } = await request.json() as {
      certification?: string;
      plan?: unknown;
      returnUrl?: string;
      attribution?: AttributionData;
    };
    const plan = rawPlan === undefined ? "single" : rawPlan;

    if (plan !== "single" && plan !== "all") {
      return errorResponse(400, "Invalid checkout plan", "invalid_plan");
    }

    // Prevent single-cert checkout without specifying which certification
    if (plan === "single" && !certification) {
      return errorResponse(400, "Certification is required for single-cert purchases", "missing_certification");
    }

    const selectedPlan = PLANS[plan];
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    const normalizedCertification = certification ? certification.toUpperCase() : "ALL";
    const safeReturnUrl = returnUrl?.startsWith("/") && !returnUrl.startsWith("//") ? returnUrl : undefined;
    const cancelParams = new URLSearchParams({
      plan,
      certification: normalizedCertification,
      session_id: "{CHECKOUT_SESSION_ID}",
    });
    if (safeReturnUrl) {
      cancelParams.set("return_to", safeReturnUrl);
    }
    const cancelQuery = cancelParams
      .toString()
      .replace("%7BCHECKOUT_SESSION_ID%7D", "{CHECKOUT_SESSION_ID}");

    // Generate description based on plan and certification
    const productDescription = plan === "all"
      ? PLANS.all.description
      : `Lifetime access to ${certification?.toUpperCase() || "all"} practice questions with detailed explanations — never expires`;

    const productName = plan === "all"
      ? `SNReady ${PLANS.all.name}`
      : `SNReady ${certification?.toUpperCase() || "Full Access"} — Lifetime`;

    await recordAttributionDiagnostics(env, {
      plan,
      certification: normalizedCertification,
      attribution,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description: productDescription,
            },
            unit_amount: selectedPlan.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${env.SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.SITE_URL}/checkout/cancel?${cancelQuery}`,
      metadata: {
        // Normalize certification to uppercase to ensure consistent tracking in Stripe.
        certification: normalizedCertification,
        plan: plan,
        returnUrl: safeReturnUrl || "",
        ...attributionMetadata(attribution),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const details = stripeErrorDetails(error);
    console.error("Stripe checkout error:", details, error);
    return errorResponse(502, "Stripe checkout failed", details.code, details);
  }
};
