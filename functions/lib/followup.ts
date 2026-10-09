import { INDIVIDUAL_GUARANTEE_DAYS } from "../../lib/purchase-guarantee";

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
  feedbackToken?: string;
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
  const individual = record.plan === "single";
  const subject = individual ? "Did you pass your exam?" : "One question: did SNReady help you pass?";
  const loginUrl = `${siteUrl.replace(/\/$/, "")}/login`;
  const feedbackUrl = record.feedbackToken
    ? `${siteUrl.replace(/\/$/, "")}/feedback?token=${encodeURIComponent(record.feedbackToken)}`
    : loginUrl;
  const unsubscribeUrl = record.feedbackToken
    ? `${siteUrl.replace(/\/$/, "")}/api/feedback/unsubscribe?token=${encodeURIComponent(record.feedbackToken)}`
    : loginUrl;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; color: #1f2937;">
      <h1 style="color: #059669; margin: 0 0 20px;">SNReady</h1>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Hey — just checking in after your SNReady purchase for <strong>${escapedCertDescription}</strong>.</p>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The only result that really matters is whether the questions helped on exam day.</p>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px;"><strong>Did you pass—and what should we improve for the next candidate?</strong></p>
      <div style="margin: 28px 0;">
        <a href="${feedbackUrl}" style="background-color: #059669; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">Share my exam result</a>
      </div>
      <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-top: 28px;">It takes about 30 seconds. You can also reply with just “passed”, “not yet”, or “not this time”. We will only feature comments if you explicitly allow it.</p>
      <p style="font-size: 12px; color: #9ca3af; line-height: 1.5; margin-top: 28px;">You received this one-time check-in because you purchased SNReady. <a href="${unsubscribeUrl}" style="color: #6b7280;">Do not send me customer follow-ups</a>.</p>
    </div>
  `;

  const text = `SNReady\n\nHey — checking in after your SNReady purchase for ${certDescription}.\n\nThe only result that really matters is whether the questions helped on exam day. Did you pass—and what should we improve for the next candidate?\n\nShare your result (about 30 seconds): ${feedbackUrl}\n\nOr reply with just “passed”, “not yet”, or “not this time”. We will only feature comments if you explicitly allow it.\n\nDo not send me customer follow-ups: ${unsubscribeUrl}`;

  if (individual) {
    const guarantee = 'Did you pass? If you didn’t pass, simply reply “no” to this email and we’ll refund your individual certification purchase in full. Or reach out anytime to ask for a refund. No questions asked.';
    return {
      subject,
      html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:24px;color:#172d46"><h1>SNReady</h1><p>It’s been 15 days since your purchase for <strong>${escapedCertDescription}</strong>.</p><p>${guarantee}</p><p>No form or proof required. Just reply to this email.</p><p style="font-size:14px">If you’d like to share more, <a href="${feedbackUrl}">leave optional feedback</a>.</p><p style="font-size:12px"><a href="${unsubscribeUrl}">Do not send me customer follow-ups</a>.</p></div>`,
      text: `SNReady\n\nIt’s been 15 days since your purchase for ${certDescription}.\n\n${guarantee}\n\nNo form or proof required. Just reply to this email.\n\nOptional feedback: ${feedbackUrl}\n\nDo not send me customer follow-ups: ${unsubscribeUrl}`,
    };
  }

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
      headers: record.feedbackToken ? {
        "List-Unsubscribe": `<${env.SITE_URL.replace(/\/$/, "")}/api/feedback/unsubscribe?token=${encodeURIComponent(record.feedbackToken)}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      } : undefined,
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
    dueAt?: number;
  }
): Promise<PurchaseFollowupRecord> {
  const recordKey = `purchase_followup:${purchase.sessionId}`;
  const existing = await env.SNREADY_ACCESS.get(recordKey);
  if (existing) {
    return JSON.parse(existing) as PurchaseFollowupRecord;
  }

  const normalizedEmail = normalizeEmail(purchase.email);
  const purchasedAt = purchase.purchasedAt || Date.now();
  const dueAt = purchase.dueAt ?? purchasedAt + (purchase.plan === "single" ? INDIVIDUAL_GUARANTEE_DAYS : getFollowupDelayDays(env)) * DAY_MS;
  const feedbackToken = crypto.randomUUID();
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
    feedbackToken,
  };

  const dueKey = `purchase_followup_due:${dateKey(dueAt)}:${purchase.sessionId}`;

  await Promise.all([
    env.SNREADY_ACCESS.put(recordKey, JSON.stringify(record)),
    env.SNREADY_ACCESS.put(dueKey, purchase.sessionId),
    env.SNREADY_ACCESS.put(`purchase_feedback:${feedbackToken}`, purchase.sessionId),
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

      let record = JSON.parse(rawRecord) as PurchaseFollowupRecord;
      if (record.status === "sent") {
        await env.SNREADY_ACCESS.delete(dueKey);
        result.skipped += 1;
        continue;
      }

      if (record.dueAt > now) {
        result.skipped += 1;
        continue;
      }

      if (!record.feedbackToken) {
        const feedbackToken = crypto.randomUUID();
        record = { ...record, feedbackToken };
        await Promise.all([
          env.SNREADY_ACCESS.put(recordKey, JSON.stringify(record)),
          env.SNREADY_ACCESS.put(`purchase_feedback:${feedbackToken}`, sessionId),
        ]);
      }

      if (await env.SNREADY_ACCESS.get(`purchase_followup_suppressed:${record.email}`)) {
        await env.SNREADY_ACCESS.delete(dueKey);
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
