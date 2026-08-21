export interface ProductionCheckoutSmokeOptions {
  baseUrl: string;
  fetchImpl?: typeof fetch;
}

export interface ProductionCheckoutSmokeResult {
  baseUrl: string;
  checkoutUrl: string;
}

const INVALID_CHECKOUT_ERROR = /Certification is required for single-cert purchases/i;
const MISSING_SESSION_ERROR = /Session ID required/i;
const STRIPE_CHECKOUT_URL = /^https:\/\/checkout\.stripe\.com\//i;

export async function runProductionCheckoutSmoke({
  baseUrl,
  fetchImpl = fetch,
}: ProductionCheckoutSmokeOptions): Promise<ProductionCheckoutSmokeResult> {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  const invalidCheckout = await fetchJson(fetchImpl, `${normalizedBaseUrl}/api/checkout`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({}),
  });
  assertStatus(
    invalidCheckout.status,
    400,
    `Invalid checkout probe failed: expected 400, received ${invalidCheckout.status}`
  );
  assertRegex(
    invalidCheckout.body.error,
    INVALID_CHECKOUT_ERROR,
    "Invalid checkout probe returned an unexpected error payload"
  );

  const validCheckout = await fetchJson(fetchImpl, `${normalizedBaseUrl}/api/checkout`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({
      certification: "csa",
      plan: "single",
      returnUrl: "/csa/practice-questions",
      attribution: {
        firstUtmSource: "deployment-smoke",
        lastUtmSource: "deployment-smoke",
      },
    }),
  });
  assertStatus(
    validCheckout.status,
    200,
    `Valid checkout probe failed: expected 200, received ${validCheckout.status}`
  );
  const checkoutUrl = validCheckout.body.url;
  if (typeof checkoutUrl !== "string" || !STRIPE_CHECKOUT_URL.test(checkoutUrl)) {
    throw new Error(
      `Valid checkout probe failed: expected Stripe checkout URL, received ${JSON.stringify(validCheckout.body)}`
    );
  }

  const sessionProbe = await fetchJson(fetchImpl, `${normalizedBaseUrl}/api/session`, {
    method: "GET",
    headers: jsonHeaders(),
  });
  assertStatus(
    sessionProbe.status,
    400,
    `Session validation probe failed: expected 400, received ${sessionProbe.status}`
  );
  assertRegex(
    sessionProbe.body.error,
    MISSING_SESSION_ERROR,
    "Session validation probe returned an unexpected error payload"
  );

  return {
    baseUrl: normalizedBaseUrl,
    checkoutUrl,
  };
}

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "");
}

function jsonHeaders() {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "SNReadyProductionCheckoutSmoke/1.0",
  };
}

async function fetchJson(fetchImpl: typeof fetch, input: string, init: RequestInit) {
  const response = await fetchImpl(input, init);
  const text = await response.text();
  let body: Record<string, unknown> = {};
  if (text) {
    try {
      body = JSON.parse(text) as Record<string, unknown>;
    } catch {
      throw new Error(`Expected JSON response from ${input}, received: ${text.slice(0, 300)}`);
    }
  }
  return {
    status: response.status,
    body,
  };
}

function assertStatus(actual: number, expected: number, message: string) {
  if (actual !== expected) {
    throw new Error(message);
  }
}

function assertRegex(value: unknown, pattern: RegExp, message: string) {
  if (typeof value !== "string" || !pattern.test(value)) {
    throw new Error(`${message}: ${JSON.stringify(value)}`);
  }
}
