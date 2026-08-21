import { runProductionCheckoutSmoke } from "../../lib/testing/productionCheckoutSmoke";

void main();

async function main() {
  const baseUrl = process.env.PRODUCTION_SMOKE_BASE_URL || "https://snready.com";
  const attempts = parsePositiveInt(process.env.PRODUCTION_SMOKE_ATTEMPTS, 6);
  const delayMs = parsePositiveInt(process.env.PRODUCTION_SMOKE_DELAY_MS, 15000);

  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      console.log(`[production-checkout-smoke] attempt ${attempt}/${attempts} against ${baseUrl}`);
      const result = await runProductionCheckoutSmoke({ baseUrl });
      console.log(
        JSON.stringify(
          {
            ok: true,
            attempt,
            baseUrl: result.baseUrl,
            checkoutUrl: result.checkoutUrl,
          },
          null,
          2
        )
      );
      return;
    } catch (error) {
      lastError = error;
      console.error(
        `[production-checkout-smoke] attempt ${attempt}/${attempts} failed: ${formatError(error)}`
      );
      if (attempt < attempts) {
        await sleep(delayMs);
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

function parsePositiveInt(rawValue: string | undefined, fallback: number) {
  const parsed = Number.parseInt(rawValue || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatError(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}
