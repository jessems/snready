import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { onRequestPost as sendMagicLink } from "@/functions/api/auth/send-magic-link";
import { onRequest as adminMiddleware } from "@/functions/admin/_middleware";

function kvStore(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  return {
    get: vi.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
    put: vi.fn((key: string, value: string) => {
      store.set(key, value);
      return Promise.resolve();
    }),
    delete: vi.fn((key: string) => {
      store.delete(key);
      return Promise.resolve();
    }),
  };
}

describe("magic link auth", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn(async () => new Response("{}", { status: 200 })) as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("builds magic links from the request origin so preview/admin cookies stay on the same host", async () => {
    const response = await sendMagicLink({
      request: new Request("https://preview.snready.pages.dev/api/auth/send-magic-link", {
        method: "POST",
        body: JSON.stringify({ email: "Jesse@example.com", redirect: "/admin/coverage" }),
        headers: { "Content-Type": "application/json" },
      }),
      env: {
        RESEND_API_KEY: "re_test",
        MAGIC_LINK_SECRET: "secret",
        SITE_URL: "https://snready.com",
        SNREADY_ACCESS: kvStore(),
      },
    } as unknown as Parameters<typeof sendMagicLink>[0]);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, message: "Magic link sent" });

    const resendPayload = JSON.parse((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1]?.body as string);
    const link = resendPayload.text.match(/https:\/\/\S+/)?.[0];
    expect(link).toBeTruthy();
    const url = new URL(link);
    expect(url.origin).toBe("https://preview.snready.pages.dev");
    expect(url.pathname).toBe("/auth/verify");
    expect(url.searchParams.get("redirect")).toBe("/admin/coverage");
  });

  it("returns a clear configuration error when preview auth secrets are missing", async () => {
    const response = await sendMagicLink({
      request: new Request("https://preview.snready.pages.dev/api/auth/send-magic-link", {
        method: "POST",
        body: JSON.stringify({ email: "jesse@example.com", redirect: "/admin/coverage" }),
        headers: { "Content-Type": "application/json" },
      }),
      env: {
        SNREADY_ACCESS: kvStore(),
      },
    } as unknown as Parameters<typeof sendMagicLink>[0]);

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: "Magic link auth is not configured for this deployment",
    });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("drops unsafe magic-link redirect targets", async () => {
    await sendMagicLink({
      request: new Request("https://snready.com/api/auth/send-magic-link", {
        method: "POST",
        body: JSON.stringify({ email: "jesse@example.com", redirect: "https://evil.example/phish" }),
        headers: { "Content-Type": "application/json" },
      }),
      env: {
        RESEND_API_KEY: "re_test",
        MAGIC_LINK_SECRET: "secret",
        SNREADY_ACCESS: kvStore(),
      },
    } as unknown as Parameters<typeof sendMagicLink>[0]);

    const resendPayload = JSON.parse((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1]?.body as string);
    const link = resendPayload.text.match(/https:\/\/\S+/)?.[0];
    const url = new URL(link);
    expect(url.searchParams.get("redirect")).toBeNull();
    expect(link).not.toContain("evil.example");
  });
});

describe("admin middleware", () => {
  it("renders an inline login form that preserves the requested admin path", async () => {
    const response = await adminMiddleware({
      request: new Request("https://preview.snready.pages.dev/admin/coverage"),
      env: { SNREADY_ACCESS: kvStore() },
      next: vi.fn(),
    } as unknown as Parameters<typeof adminMiddleware>[0]);

    expect(response.status).toBe(401);
    const html = await response.text();
    expect(html).toContain("Send admin login link");
    expect(html).toContain("/api/auth/send-magic-link");
    expect(html).toContain('value="/admin/coverage"');
  });

  it("allows configured admin emails", async () => {
    const next = vi.fn(async () => new Response("ok"));
    const response = await adminMiddleware({
      request: new Request("https://snready.com/admin/coverage", {
        headers: { Cookie: "snready_session=session-token" },
      }),
      env: {
        SNREADY_ACCESS: kvStore({
          "session:session-token": JSON.stringify({
            email: "owner@example.com",
            createdAt: Date.now(),
            expiresAt: Date.now() + 60_000,
          }),
        }),
        ADMIN_EMAILS: "owner@example.com, jessems@gmail.com",
      },
      next,
    } as unknown as Parameters<typeof adminMiddleware>[0]);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("ok");
    expect(next).toHaveBeenCalled();
  });
});
