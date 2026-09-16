export type PurchaseAccessInput = {
  email: string;
  plan: string;
  certification: string;
  sessionId: string;
  now?: number;
};

export type PurchaseAccessGrant = {
  normalizedEmail: string;
  effectivePlan: string;
  certification: string;
  certifications: string[];
  expiresAt: number;
  createdUser: boolean;
  accessAlreadyGranted: boolean;
};

const LIFETIME_ACCESS_MS = 100 * 365 * 24 * 60 * 60 * 1000;

function uniqueStrings(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter((value): value is string => typeof value === "string" && value.length > 0))];
}

export async function grantPurchaseAccess(
  kv: KVNamespace,
  input: PurchaseAccessInput
): Promise<PurchaseAccessGrant> {
  const now = input.now ?? Date.now();
  const normalizedEmail = input.email.toLowerCase();
  const plan = input.plan || "single";
  const certification = input.certification || "all";
  const expiresAt = now + LIFETIME_ACCESS_MS;

  const existingUser = await kv.get(`user:${normalizedEmail}`);
  const createdUser = !existingUser;
  if (!existingUser) {
    await kv.put(
      `user:${normalizedEmail}`,
      JSON.stringify({ email: normalizedEmail, createdAt: now, lastLoginAt: now })
    );
  }

  const existingAccessRaw = await kv.get(`access:${normalizedEmail}`);
  let certifications: string[] = [];
  let effectivePlan = plan;
  let accessAlreadyGranted = false;
  let priorCreatedAt: number | undefined;

  if (existingAccessRaw) {
    try {
      const existing = JSON.parse(existingAccessRaw) as Record<string, unknown>;
      certifications = uniqueStrings(existing.certifications);
      if (!certifications.length && typeof existing.certification === "string") {
        certifications = [existing.certification];
      }
      if (existing.plan === "all") effectivePlan = "all";
      if (existing.sessionId === input.sessionId) accessAlreadyGranted = true;
      if (typeof existing.createdAt === "number") priorCreatedAt = existing.createdAt;
    } catch (error) {
      console.warn("Failed to parse existing access record; continuing with fresh grant", {
        email: normalizedEmail,
        error,
      });
    }
  }

  if (plan === "single" && certification && certification !== "all" && !certifications.includes(certification)) {
    certifications.push(certification);
  }

  if (plan === "all") {
    effectivePlan = "all";
  }

  await kv.put(
    `access:${normalizedEmail}`,
    JSON.stringify({
      paid: true,
      plan: effectivePlan,
      expiresAt,
      sessionId: input.sessionId,
      certification,
      certifications,
      createdAt: priorCreatedAt ?? now,
      updatedAt: now,
    }),
    {}
  );

  return {
    normalizedEmail,
    effectivePlan,
    certification,
    certifications,
    expiresAt,
    createdUser,
    accessAlreadyGranted,
  };
}
