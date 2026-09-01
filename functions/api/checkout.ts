import Stripe from "stripe";
import { recordCheckoutAttributionDiagnostic } from "../lib/attribution-diagnostics";

interface Env {
  STRIPE_SECRET_KEY: string;
  SITE_URL: string;
  SNREADY_ACCESS?: KVNamespace<string>;
}

function errorResponse(status: number, error: string, code: string, extra?: Record<string, unknown>) {
  return new Response(
    JSON.stringify({ error, code, ...(extra || {}) }),
    { status, headers: { "Content-Type": "application/json" } }
  );
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

  try {
    const { certification, plan = "single", returnUrl, attribution } = await request.json() as {
      certification?: string;
      plan?: PlanType;
      returnUrl?: string;
      attribution?: AttributionData;
    };

    await recordCheckoutAttributionDiagnostic(env.SNREADY_ACCESS, {
      attribution,
      certification,
      plan,
      returnUrl,
    });

    // Prevent single-cert checkout without specifying which certification
    if (plan === "single" && !certification) {
      return errorResponse(400, "Certification is required for single-cert purchases", "missing_certification");
    }

    const selectedPlan = PLANS[plan] || PLANS["single"];
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
