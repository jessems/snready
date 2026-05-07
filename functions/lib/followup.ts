export interface FollowupEnv {
  SNREADY_ACCESS: KVNamespace;
  RESEND_API_KEY: string;
  SITE_URL: string;
  FOLLOWUP_DELAY_DAYS?: string;
  FOLLOWUP_FROM_EMAIL?: string;
  FOLLOWUP_REPLY_TO?: string;
}

export interface PurchaseFollowupRecord {
  sessionId: string;
  email: string;
  plan: string;
  certification: string;
  certifications?: string[];
  purchasedAt: number;
  dueAt: number;
  status: "pending" | "sent" | "failed";
  createdAt: number;
  sentAt?: number;
  resendId?: string;
  error?: string;
}

export interface ProcessFollowupsResult {
  checkedDateKeys: string[];
  due: number;
  sent: number;
  failed: number;
  skipped: number;
  errors: Array<{ key: string; error: string }>;
}

const DEFAULT_FOLLOWUP_DELAY_DAYS = 21;
const DAY_MS = 24 * 60 * 60 * 1000;

function getFollowupDelayDays(env: Pick<FollowupEnv, "FOLLOWUP_DELAY_DAYS">): number {
  const configured = Number(env.FOLLOWUP_DELAY_DAYS);
  if (Number.isFinite(configured) && configured >= 1 && configured <= 180) {
    return Math.floor(configured);
  }
  return DEFAULT_FOLLOWUP_DELAY_DAYS;
}

function dateKey(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function describePurchase(plan: string, certification: string, certifications?: string[]): string {
  if (plan === "all") {
    return "all ServiceNow certifications";
  }

  const certs = certifications?.length ? certifications : certification ? [certification] : [];
  if (certs.length === 0 || certs.includes("all")) {
    return "your ServiceNow certification";
  }

  return certs.map((cert) => cert.toUpperCase()).join(", ");
}

function buildFollowupEmail(record: PurchaseFollowupRecord, siteUrl: string): { subject: string; html: string; text: string } {
  const certDescription = describePurchase(record.plan, record.certification, record.certifications);
  const escapedCertDescription = escapeHtml(certDescription);
  const subject = "Quick check-in: how did SNReady work for you?";
  const loginUrl = `${siteUrl.replace(/\/$/, "")}/login`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; color: #1f2937;">
      <h1 style="color: #059669; margin: 0 0 20px;">SNReady</h1>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Hey — just checking in after your SNReady purchase for <strong>${escapedCertDescription}</strong>.</p>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Did you have a good experience? And more importantly, did you pass your certification exam?</p>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px;">Hit reply and let me know:</p>
      <ul style="font-size: 16px; line-height: 1.7; padding-left: 24px; margin: 0 0 24px;">
        <li>Whether you passed</li>
        <li>Which exam you took</li>
        <li>What SNReady helped with</li>
        <li>What would have made it better</li>
      </ul>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">If you are still studying, you can keep practicing here:</p>
      <div style="margin: 28px 0;">
        <a href="${loginUrl}" style="background-color: #059669; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">Keep practicing</a>
      </div>
      <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-top: 28px;">Thanks for using SNReady — your feedback directly improves the question bank for future ServiceNow candidates.</p>
    </div>
  `;

  const text = `SNReady\n\nHey — just checking in after your SNReady purchase for ${certDescription}.\n\nDid you have a good experience? And more importantly, did you pass your certification exam?\n\nHit reply and let me know:\n- Whether you passed\n- Which exam you took\n- What SNReady helped with\n- What would have made it better\n\nIf you are still studying, you can keep practicing here: ${loginUrl}\n\nThanks for using SNReady — your feedback directly improves the question bank for future ServiceNow candidates.`;

  return { subject, html, text };
}

async function sendFollowupEmail(env: FollowupEnv, record: PurchaseFollowupRecord): Promise<string | undefined> {
  const { subject, html, text } = buildFollowupEmail(record, env.SITE_URL);
  const from = env.FOLLOWUP_FROM_EMAIL || "SNReady <jesse@snready.com>";
  const replyTo = env.FOLLOWUP_REPLY_TO || "jesse@snready.com";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: record.email,
      reply_to: replyTo,
      subject,
      html,
      text,
    }),
  });

  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${responseText}`);
  }

  try {
    const data = JSON.parse(responseText) as { id?: string };
    return data.id;
  } catch {
    return undefined;
  }
}

export async function enqueuePurchaseFollowup(
  env: FollowupEnv,
  purchase: {
    sessionId: string;
    email: string;
    plan: string;
    certification: string;
    certifications?: string[];
    purchasedAt?: number;
  }
): Promise<PurchaseFollowupRecord> {
  const normalizedEmail = normalizeEmail(purchase.email);
  const purchasedAt = purchase.purchasedAt || Date.now();
  const dueAt = purchasedAt + getFollowupDelayDays(env) * DAY_MS;
  const record: PurchaseFollowupRecord = {
    sessionId: purchase.sessionId,
    email: normalizedEmail,
    plan: purchase.plan,
    certification: purchase.certification,
    certifications: purchase.certifications,
    purchasedAt,
    dueAt,
    status: "pending",
    createdAt: Date.now(),
  };

  const recordKey = `purchase_followup:${purchase.sessionId}`;
  const dueKey = `purchase_followup_due:${dateKey(dueAt)}:${purchase.sessionId}`;

  await Promise.all([
    env.SNREADY_ACCESS.put(recordKey, JSON.stringify(record)),
    env.SNREADY_ACCESS.put(dueKey, purchase.sessionId),
  ]);

  return record;
}

async function listAllDueKeys(env: FollowupEnv, date: string): Promise<string[]> {
  const keys: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await env.SNREADY_ACCESS.list({ prefix: `purchase_followup_due:${date}:`, cursor });
    keys.push(...page.keys.map((key) => key.name));
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return keys;
}

function datesBetween(startTimestamp: number, endTimestamp: number): string[] {
  const start = new Date(dateKey(startTimestamp)).getTime();
  const end = new Date(dateKey(endTimestamp)).getTime();
  const dates: string[] = [];

  for (let day = start; day <= end; day += DAY_MS) {
    dates.push(dateKey(day));
  }

  return dates;
}

export async function processDueFollowups(
  env: FollowupEnv,
  options: { now?: number; lookbackDays?: number; limit?: number; dryRun?: boolean } = {}
): Promise<ProcessFollowupsResult> {
  const now = options.now || Date.now();
  const lookbackDays = options.lookbackDays ?? 7;
  const limit = options.limit ?? 50;
  const checkedDateKeys = datesBetween(now - lookbackDays * DAY_MS, now);
  const result: ProcessFollowupsResult = {
    checkedDateKeys,
    due: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  const dueKeys = (await Promise.all(checkedDateKeys.map((date) => listAllDueKeys(env, date)))).flat();

  for (const dueKey of dueKeys.slice(0, limit)) {
    const dueKeyParts = dueKey.split(":");
    const sessionId = dueKeyParts[dueKeyParts.length - 1];
    if (!sessionId) {
      result.skipped += 1;
      continue;
    }

    const recordKey = `purchase_followup:${sessionId}`;
    try {
      const rawRecord = await env.SNREADY_ACCESS.get(recordKey);
      if (!rawRecord) {
        await env.SNREADY_ACCESS.delete(dueKey);
        result.skipped += 1;
        continue;
      }

      const record = JSON.parse(rawRecord) as PurchaseFollowupRecord;
      if (record.status === "sent") {
        await env.SNREADY_ACCESS.delete(dueKey);
        result.skipped += 1;
        continue;
      }

      if (record.dueAt > now) {
        result.skipped += 1;
        continue;
      }

      result.due += 1;
      if (options.dryRun) {
        continue;
      }

      try {
        const resendId = await sendFollowupEmail(env, record);
        const sentRecord: PurchaseFollowupRecord = {
          ...record,
          status: "sent",
          sentAt: Date.now(),
          resendId,
          error: undefined,
        };
        await Promise.all([
          env.SNREADY_ACCESS.put(recordKey, JSON.stringify(sentRecord)),
          env.SNREADY_ACCESS.delete(dueKey),
        ]);
        result.sent += 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown send error";
        const failedRecord: PurchaseFollowupRecord = {
          ...record,
          status: "failed",
          error: message,
        };
        await env.SNREADY_ACCESS.put(recordKey, JSON.stringify(failedRecord));
        result.failed += 1;
        result.errors.push({ key: recordKey, error: message });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown processing error";
      result.failed += 1;
      result.errors.push({ key: dueKey, error: message });
    }
  }

  return result;
}
