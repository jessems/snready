// Only these emails can access /admin/* routes. ADMIN_EMAILS can be a comma-separated Pages env var.
const DEFAULT_ADMIN_EMAILS = ["jessems@gmail.com"];

export function getAdminEmails(env: { ADMIN_EMAILS?: string }): string[] {
  const configured = env.ADMIN_EMAILS
    ?.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return configured?.length ? configured : DEFAULT_ADMIN_EMAILS;
}

export function isAdminEmail(env: { ADMIN_EMAILS?: string }, email: string | null | undefined): boolean {
  return Boolean(email) && getAdminEmails(env).includes(email!.toLowerCase());
}
