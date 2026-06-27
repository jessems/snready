/// <reference types="@cloudflare/workers-types" />

import { getSessionToken } from "../lib/session";

interface Env {
  SNREADY_ACCESS: KVNamespace;
  ADMIN_EMAILS?: string;
}

// Only these emails can access /admin/* routes. ADMIN_EMAILS can be a comma-separated Pages env var.
const DEFAULT_ADMIN_EMAILS = ["jessems@gmail.com"];

function getAdminEmails(env: Env): string[] {
  const configured = env.ADMIN_EMAILS
    ?.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return configured?.length ? configured : DEFAULT_ADMIN_EMAILS;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, next } = context;
  const sessionToken = getSessionToken(request);

  if (!sessionToken) {
    return new Response(unauthorizedPage("Not logged in", new URL(request.url).pathname), {
      status: 401,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Look up session
  const sessionRaw = await env.SNREADY_ACCESS.get(`session:${sessionToken}`);
  if (!sessionRaw) {
    return new Response(unauthorizedPage("Session expired", new URL(request.url).pathname), {
      status: 401,
      headers: { "Content-Type": "text/html" },
    });
  }

  let session: { email: string; createdAt: number; expiresAt: number };
  try {
    session = JSON.parse(sessionRaw);
  } catch {
    return new Response(unauthorizedPage("Invalid session", new URL(request.url).pathname), {
      status: 401,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Check session expiry
  if (session.expiresAt < Date.now()) {
    await env.SNREADY_ACCESS.delete(`session:${sessionToken}`);
    return new Response(unauthorizedPage("Session expired", new URL(request.url).pathname), {
      status: 401,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Check if email is in admin list
  if (!getAdminEmails(env).includes(session.email.toLowerCase())) {
    return new Response(unauthorizedPage("Access denied", new URL(request.url).pathname), {
      status: 403,
      headers: { "Content-Type": "text/html" },
    });
  }

  // User is authenticated and authorized — continue to the page
  return next();
};

function unauthorizedPage(reason: string, redirectPath: string): string {
  const escapedRedirectPath = redirectPath.replace(/"/g, "&quot;");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Access Required | SNReady</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: system-ui, -apple-system, sans-serif;
      background: #fafafa;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      padding: 2rem;
      max-width: 400px;
      text-align: center;
    }
    h1 { font-size: 1.5rem; color: #18181b; margin-bottom: 0.5rem; }
    p { color: #71717a; margin-bottom: 1.5rem; }
    .reason { 
      background: #fef2f2; 
      color: #dc2626; 
      padding: 0.5rem 1rem; 
      border-radius: 6px; 
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }
    input {
      width: 100%;
      border: 1px solid #d4d4d8;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      margin-bottom: 0.75rem;
      font: inherit;
    }
    button,
    a {
      display: inline-block;
      width: 100%;
      border: 0;
      background: #059669;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
    }
    button:hover, a:hover { background: #047857; }
    button:disabled { opacity: 0.6; cursor: wait; }
    .secondary { display: block; margin-top: 1rem; background: transparent; color: #52525b; }
    .secondary:hover { background: transparent; color: #18181b; }
    .message { font-size: 0.875rem; margin-top: 0.75rem; }
    .error { color: #dc2626; }
    .success { color: #047857; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🔒 Admin Access Required</h1>
    <p>This page is restricted to site administrators.</p>
    <div class="reason">${reason}</div>
    <form id="login-form">
      <input id="email" type="email" autocomplete="email" placeholder="admin email" required />
      <input id="redirect" type="hidden" value="${escapedRedirectPath}" />
      <button id="submit" type="submit">Send admin login link</button>
      <div id="message" class="message" aria-live="polite"></div>
    </form>
    <a class="secondary" href="/">← Back to Home</a>
  </div>
  <script>
    const form = document.getElementById('login-form');
    const button = document.getElementById('submit');
    const message = document.getElementById('message');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      button.disabled = true;
      message.className = 'message';
      message.textContent = 'Sending login link...';
      try {
        const response = await fetch('/api/auth/send-magic-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: document.getElementById('email').value,
            redirect: document.getElementById('redirect').value,
          }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || 'Failed to send login link');
        message.className = 'message success';
        message.textContent = 'Login link sent. Open it from this browser to return here.';
      } catch (error) {
        message.className = 'message error';
        message.textContent = error instanceof Error ? error.message : 'Failed to send login link';
      } finally {
        button.disabled = false;
      }
    });
  </script>
</body>
</html>`;
}
