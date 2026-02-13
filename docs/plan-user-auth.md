# Plan: Proper User Accounts & Auth with Email Link Login

## Current State Analysis

The app already has a magic link auth system, but it has significant limitations:

| Aspect | Current | Problem |
|--------|---------|---------|
| **Who can log in** | Only users with an active paid subscription | Can't create an account before purchasing; can't log in if subscription expired |
| **Session storage** | `localStorage` only | Not secure (XSS-readable), doesn't persist across browsers/devices, easily spoofed |
| **User identity** | No user records — just payment/access records in KV keyed by email | No concept of a "user account" separate from a "subscription" |
| **Session validation** | Client reads localStorage, then calls `/api/verify` with email | Anyone can call `/api/verify` with any email — no proof of identity required |
| **Account management** | None | No way to view plan status, see expiration, or manage account |

### Current Auth Flow (Simplified)

```
User enters email → API checks if email has paid subscription
  → NO subscription: "No active subscription found" (login rejected)
  → YES: Send magic link email → User clicks link → Token verified
    → Access data stored in localStorage → AccessProvider reads localStorage
```

### Security Issue

The current `/api/verify` endpoint (`functions/api/verify.ts`) accepts any email in a POST body and returns whether that email has access. There's no proof that the caller owns that email. The magic link flow does verify email ownership, but the ongoing session just trusts whatever email is in localStorage.

---

## Proposed Architecture

### Core Principle: Separate Identity from Access

- **User account** = "this person exists and has verified their email"
- **Access/subscription** = "this person has paid and can see premium content"

These are orthogonal. A user should be able to:
1. Create an account without paying
2. Log in even if their subscription expired
3. See their account status (active plan, expiration, etc.)

### Data Model (Cloudflare KV)

Replace the single `email → access_record` pattern with distinct key prefixes:

```
# User record (created on first successful magic link verification)
user:{email}  →  { email, createdAt, lastLoginAt }

# Access/subscription record (created by Stripe webhook, unchanged)
access:{email}  →  { paid, plan, expiresAt, sessionId, certification, createdAt }

# Server-side session (created on login, validated by cookie)
session:{sessionToken}  →  { email, createdAt, expiresAt }
```

The existing `SNREADY_ACCESS` KV namespace can hold all three — the key prefixes prevent collisions.

### Session Management: httpOnly Cookies

Replace localStorage-based auth with server-side sessions:

1. On successful magic link verification, the API creates a session token (random, cryptographically secure), stores it in KV, and sets it as an **httpOnly, Secure, SameSite=Lax** cookie.
2. The client calls a new `/api/auth/session` endpoint on load — the API reads the cookie, looks up the session in KV, and returns user + access data.
3. Logout deletes the KV session record and clears the cookie.

This eliminates the localStorage security issue entirely.

---

## Implementation Steps

### Phase 1: Server-Side Sessions & Open Registration

#### 1.1 New API endpoint: `GET /api/auth/session`

**File:** `functions/api/auth/session.ts` (new)

Returns the current user's identity and access status by reading the session cookie.

```
Request: GET /api/auth/session (cookie: snready_session=<token>)
Response: {
  authenticated: true,
  email: "user@example.com",
  access: { hasAccess: true, plan: "lifetime", expiresAt: 1234567890 }
}
— or —
Response: { authenticated: false }
```

Logic:
- Read `snready_session` cookie from request
- Look up `session:{token}` in KV
- If valid and not expired, look up `access:{email}` for subscription status
- Return combined user + access data

#### 1.2 Update magic link send: Remove subscription gate

**File:** `functions/api/auth/send-magic-link.ts` (modify)

Current behavior: Returns 404 if email doesn't have an access record.
New behavior: Send magic link to any valid email address. Remove the KV lookup that gates on subscription status.

This is the key change that allows account creation before payment.

#### 1.3 Update magic link verify: Create session + set cookie

**File:** `functions/api/auth/verify.ts` (modify)

After verifying the HMAC token:
1. Create/update `user:{email}` record in KV (upsert — create on first login)
2. Generate a cryptographically random session token (`crypto.randomUUID()`)
3. Store `session:{token}` in KV with a 30-day TTL
4. Set `Set-Cookie: snready_session={token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000`
5. Return user + access data in the response body (for the initial client-side render)

#### 1.4 New API endpoint: `POST /api/auth/logout`

**File:** `functions/api/auth/logout.ts` (new)

- Read session cookie
- Delete `session:{token}` from KV
- Clear the cookie (`Set-Cookie` with `Max-Age=0`)
- Return `{ success: true }`

#### 1.5 Update client-side AccessProvider → AuthProvider

**File:** `components/AccessProvider.tsx` (modify) or rename to `AuthProvider.tsx`

Replace localStorage reads with a single API call:

```typescript
// On mount:
const response = await fetch("/api/auth/session", { credentials: "include" });
const data = await response.json();
// Sets: { authenticated, email, hasAccess, plan, expiresAt }
```

The context now exposes:
- `authenticated: boolean` — user is logged in (has valid session)
- `email: string | null` — logged-in user's email
- `hasAccess: boolean` — user has active subscription
- `plan: PlanType | null`
- `expiresAt: number | null`
- `loading: boolean`
- `login(email)` — sends magic link
- `logout()` — calls logout API

#### 1.6 Remove `lib/access.ts` localStorage functions

**File:** `lib/access.ts` (modify)

Remove `getStoredAccess`, `storeAccess`, `clearAccess`. Keep or update `verifyAccess` and `verifySession` if still needed for the checkout flow. Over time these should also go through the session cookie.

#### 1.7 Update VerifyContent to handle cookie-based auth

**File:** `app/auth/verify/VerifyContent.tsx` (modify)

The verify API now sets a cookie automatically. The client just needs to call `refresh()` on the auth provider after verification succeeds (the cookie is already set by the API response). Remove the `storeAccess()` localStorage call.

#### 1.8 Update Stripe webhook to use new key prefix

**File:** `functions/api/webhook.ts` (modify)

Change KV key from `email` to `access:{email}` so it aligns with the new data model. This is the only change needed — the webhook still writes subscription data the same way.

#### 1.9 Update `/api/verify` endpoint for new key prefix

**File:** `functions/api/verify.ts` (modify)

Update to read from `access:{email}` instead of just `email`. This endpoint may eventually be deprecated in favor of `/api/auth/session`, but keep it for now for backward compatibility during the transition.

#### 1.10 Update `/api/session` (Stripe session) for new key prefix

**File:** `functions/api/session.ts` (modify)

Update to write to `access:{email}` instead of just `email`.

### Phase 2: Account Page & UI Updates

#### 2.1 Account page

**File:** `app/account/page.tsx` (new)

A simple page showing:
- Email address
- Current plan (or "No active plan")
- Expiration date (if applicable)
- Link to purchase/upgrade if no active plan
- Logout button

Gated by auth — if not authenticated, redirect to home or show login prompt.

#### 2.2 Update Header with account link

**File:** `components/Header.tsx` (modify)

When authenticated:
- Show user email or "Account" link → `/account`
- Show "Log out" button

When not authenticated:
- Show "Log in" button (opens LoginModal)

#### 2.3 Update LoginModal messaging

**File:** `components/LoginModal.tsx` (modify)

Since login now works for all users (not just subscribers), update copy:
- Remove "No active subscription found" error case
- The "Don't have access yet? Get Access" section can remain — it's still relevant for users who want premium content

#### 2.4 Update QuestionsWithPaywall

**File:** `components/QuestionsWithPaywall.tsx` (modify)

Update to use the new auth context shape (`authenticated` + `hasAccess` as separate booleans):
- Authenticated but no access → show paywall with "Upgrade" messaging (no need to log in again)
- Not authenticated → show paywall with "Log in or Get Access" messaging

### Phase 3: Migration & Cleanup

#### 3.1 KV data migration

Existing KV records are keyed by bare email (e.g., `user@example.com → { paid, plan, ... }`). These need to be migrated to `access:user@example.com`.

Options:
- **One-time migration script** using Wrangler KV bulk operations
- **Dual-read fallback** in the API: check `access:{email}` first, fall back to `{email}`, and opportunistically migrate on read

Recommended: Dual-read fallback (zero-downtime, self-healing). After a few weeks, run a cleanup script to remove old keys.

#### 3.2 Remove localStorage remnants

After the cookie-based system is confirmed working:
- Remove all `localStorage` references from `lib/access.ts`
- Add a one-time cleanup in the client to remove the old `snready_access` localStorage key for existing users

#### 3.3 Secure the `/api/verify` endpoint

The existing `/api/verify` endpoint that accepts any email should be updated to require a valid session cookie, or deprecated entirely in favor of `/api/auth/session`.

---

## File Change Summary

| File | Action | Description |
|------|--------|-------------|
| `functions/api/auth/session.ts` | **New** | GET endpoint — validates session cookie, returns user + access data |
| `functions/api/auth/logout.ts` | **New** | POST endpoint — destroys session, clears cookie |
| `functions/api/auth/send-magic-link.ts` | **Modify** | Remove subscription check gate |
| `functions/api/auth/verify.ts` | **Modify** | Create user record, create session, set httpOnly cookie |
| `functions/api/webhook.ts` | **Modify** | Use `access:{email}` key prefix |
| `functions/api/verify.ts` | **Modify** | Use `access:{email}` key prefix + dual-read fallback |
| `functions/api/session.ts` | **Modify** | Use `access:{email}` key prefix |
| `components/AccessProvider.tsx` | **Modify** | Replace localStorage with `/api/auth/session` call; expose `authenticated` separate from `hasAccess` |
| `lib/access.ts` | **Modify** | Remove localStorage functions |
| `app/auth/verify/VerifyContent.tsx` | **Modify** | Remove `storeAccess()` call; rely on cookie set by API |
| `app/account/page.tsx` | **New** | Account management page |
| `components/Header.tsx` | **Modify** | Add account link / auth-aware navigation |
| `components/LoginModal.tsx` | **Modify** | Update error handling and copy |
| `components/QuestionsWithPaywall.tsx` | **Modify** | Use `authenticated` + `hasAccess` separately |

---

## Security Considerations

- **Session tokens**: Use `crypto.randomUUID()` — 122 bits of entropy, sufficient for session IDs
- **Cookie flags**: `HttpOnly` (no JS access), `Secure` (HTTPS only), `SameSite=Lax` (CSRF protection)
- **Session expiry**: 30-day TTL in KV. Users can always re-authenticate via magic link
- **Magic link tokens**: Keep the existing 15-minute HMAC-SHA256 signed tokens (already secure)
- **Rate limiting**: Consider adding rate limiting to magic link sends to prevent abuse (Cloudflare has built-in rate limiting rules that can be configured in the dashboard — no code changes needed)

## Cloudflare Configuration Needed

- No new KV namespaces required — the existing `SNREADY_ACCESS` namespace is reused with key prefixes
- No new secrets required — existing `MAGIC_LINK_SECRET`, `RESEND_API_KEY`, etc. are sufficient
- No changes to `wrangler.toml` needed

## Implementation Order

Phases 1, 2, and 3 should be done sequentially. Within Phase 1, steps 1.1–1.3 are the critical path. Steps 1.4–1.10 can proceed in parallel after 1.1–1.3 are done. Phase 2 depends on Phase 1 being complete. Phase 3 can be done any time after Phase 1 is deployed and confirmed working.
