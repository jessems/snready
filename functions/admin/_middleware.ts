import { getSessionToken } from "../lib/session";

interface Env {
  SNREADY_ACCESS: KVNamespace;
}

// Only these emails can access /admin/* routes
const ADMIN_EMAILS = ["jessems@gmail.com"];

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, next } = context;
  const sessionToken = getSessionToken(request);

  if (!sessionToken) {
    return new Response(unauthorizedPage("Not logged in"), {
      status: 401,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Look up session
  const sessionRaw = await env.SNREADY_ACCESS.get(`session:${sessionToken}`);
  if (!sessionRaw) {
    return new Response(unauthorizedPage("Session expired"), {
      status: 401,
      headers: { "Content-Type": "text/html" },
    });
  }

  let session: { email: string; createdAt: number; expiresAt: number };
  try {
    session = JSON.parse(sessionRaw);
  } catch {
    return new Response(unauthorizedPage("Invalid session"), {
      status: 401,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Check session expiry
  if (session.expiresAt < Date.now()) {
    await env.SNREADY_ACCESS.delete(`session:${sessionToken}`);
    return new Response(unauthorizedPage("Session expired"), {
      status: 401,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Check if email is in admin list
  if (!ADMIN_EMAILS.includes(session.email.toLowerCase())) {
    return new Response(unauthorizedPage("Access denied"), {
      status: 403,
      headers: { "Content-Type": "text/html" },
    });
  }

  // User is authenticated and authorized — continue to the page
  return next();
};

function unauthorizedPage(reason: string): string {
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
    a {
      display: inline-block;
      background: #059669;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
    }
    a:hover { background: #047857; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🔒 Admin Access Required</h1>
    <p>This page is restricted to site administrators.</p>
    <div class="reason">${reason}</div>
    <a href="/">← Back to Home</a>
  </div>
</body>
</html>`;
}
