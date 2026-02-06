# QA Findings - SNReady Exploratory Testing

**Date:** 2026-02-06  
**Tester:** SNReady Agent  
**Method:** Code review + live site testing via web_fetch  

---

## Executive Summary

Found **9 issues** across the site, including **1 critical security issue** (premium questions visible without payment), several UX issues with the purchase flow, and some content errors.

**Fixed in this PR:**
- ✅ CRITICAL: Premium questions now gated behind paywall
- ✅ Missing /free-questions index page (was 404)
- ✅ Checkout success page handles missing session_id gracefully
- ✅ Success page shows correct plan name (30-day vs Lifetime)
- ✅ Header now has Login/Account button
- ✅ Practice tests page had wrong CIS-DF certification name

---

## Issues Found

### 🔴 CRITICAL

#### 1. No Paywall on Premium Questions
**Location:** `/[certification]/questions/[topic]/page.tsx`  
**Severity:** Critical  
**Status:** ✅ FIXED

**Problem:** The topic questions page (`/csa/questions/ui-navigation`) showed ALL questions to everyone, including premium questions that should be behind a paywall. Users could see all question content without paying.

**Root Cause:** The page used `getQuestionsForTopic()` which returns all questions, and rendered them all without checking access state.

**Fix:** Created new `QuestionsWithPaywall` component that:
- Shows free questions to everyone
- Checks access state via `useAccess()` hook
- Shows premium questions only to users with valid access
- Displays a paywall with blurred preview for non-paying users
- Includes "Already purchased? Log in" link

---

### 🟠 HIGH

#### 2. Missing /free-questions Index Page
**Location:** `/free-questions`  
**Severity:** High  
**Status:** ✅ FIXED

**Problem:** The `/free-questions` URL returned a 404 error, but was linked from the checkout cancel page and other places.

**Fix:** Created new `/app/free-questions/page.tsx` that:
- Lists all certifications with available free questions
- Shows topic breakdown with question counts
- Provides clear navigation to each certification's free questions

---

#### 3. Checkout Success Page Doesn't Handle Missing session_id
**Location:** `/checkout/success`  
**Severity:** High  
**Status:** ✅ FIXED

**Problem:** Navigating directly to `/checkout/success` without a `session_id` parameter showed an almost empty page (just the footer).

**Fix:** Updated `SuccessContent.tsx` to:
- Detect missing session_id and show helpful message
- Suggest checking email for confirmation
- Provide clear navigation back to home/certifications

---

#### 4. Success Page Hardcoded "30-day access"
**Location:** `/checkout/success/SuccessContent.tsx`  
**Severity:** High  
**Status:** ✅ FIXED

**Problem:** The success page always said "Your 30-day access is now active" even for lifetime purchases.

**Fix:** Updated to:
- Fetch plan type from session verification API
- Display correct plan name (30-Day vs Lifetime)
- Show appropriate benefits list based on plan type

---

#### 5. No Login Button in Header
**Location:** `/components/Header.tsx`  
**Severity:** High  
**Status:** ✅ FIXED

**Problem:** Users who already purchased had no clear way to log in and access their content. The header only showed a "Beta" badge.

**Fix:** Updated Header to:
- Show "Log in" button for non-authenticated users
- Show account dropdown with email for authenticated users
- Include logout functionality
- Open LoginModal when login button clicked

---

### 🟡 MEDIUM

#### 6. Practice Tests Page Wrong Certification Name
**Location:** `/practice-tests/[cert]/page.tsx`  
**Severity:** Medium  
**Status:** ✅ FIXED

**Problem:** In the "Available Practice Tests" section for coming-soon certifications, CIS-DF was labeled as "CIS-Discovery - Discovery Implementation" which is incorrect. CIS-DF is "Certified Data Foundations".

**Fix:** Corrected to:
- Name: "CIS-DF - Certified Data Foundations"
- Description: "CMDB, CSDM, and data management practice questions"

---

### 🟢 LOW (Not Fixed - Future Improvements)

#### 7. Certification-Specific Access Not Enforced
**Severity:** Low  
**Status:** Not Fixed (Design Decision Needed)

**Problem:** When a user purchases access for a specific certification (e.g., CSA), the access record includes the certification name, but verification doesn't check which certification was purchased. A user who buys CSA could theoretically access CIS-DF content.

**Recommendation:** Either:
- Enforce per-certification access checking, OR
- Simplify to site-wide access (all certifications included)

Current behavior may be intentional for MVP simplicity.

---

#### 8. No Visual Distinction for Free vs Premium Questions
**Severity:** Low  
**Status:** Partially Addressed

**Problem:** On topic pages, there's no clear visual indicator showing which questions are free and which are premium.

**Current State:** The QuestionsWithPaywall component now shows "Free Questions (X of Y)" label before the free section, and locks premium questions behind a paywall. This provides implicit distinction.

**Future Enhancement:** Could add badges to individual question cards.

---

#### 9. LoginModal Component Was Not Used
**Severity:** Low  
**Status:** ✅ FIXED

**Problem:** The LoginModal component existed but was never rendered anywhere in the app.

**Fix:** Now integrated into:
- Header (via Login button)
- QuestionsWithPaywall (via "Already purchased? Log in" link)

---

## Files Changed

1. `app/[certification]/questions/[topic]/page.tsx` - Refactored to use QuestionsWithPaywall
2. `components/QuestionsWithPaywall.tsx` - **NEW** - Paywall component with access control
3. `app/free-questions/page.tsx` - **NEW** - Free questions index page
4. `app/checkout/success/SuccessContent.tsx` - Handle missing session_id, show correct plan
5. `app/checkout/success/page.tsx` - Updated metadata
6. `lib/access.ts` - Added plan type support
7. `components/Header.tsx` - Added login/account UI
8. `app/practice-tests/[cert]/page.tsx` - Fixed wrong certification name

---

## Testing Recommendations

Before merging, verify:

1. **Paywall Flow:**
   - Visit `/csa/questions/ui-navigation` without logging in
   - Confirm only first ~10 questions visible
   - Confirm paywall appears after free questions
   - Confirm "Already purchased? Log in" opens login modal

2. **Purchase Flow:**
   - Complete a test purchase (use Stripe test mode)
   - Confirm success page shows correct plan
   - Confirm access is granted and premium questions unlock

3. **Login Flow:**
   - Click "Log in" in header
   - Enter valid email with access
   - Confirm questions unlock

4. **Error States:**
   - Visit `/checkout/success` directly (no session_id)
   - Confirm helpful error message appears
   - Enter invalid email in login modal
   - Confirm error message appears

---

## Deployment Notes

No database/KV migrations needed. All changes are frontend-only.

The new `QuestionsWithPaywall` component uses client-side access checking, which is appropriate for a freemium model. Server-side enforcement could be added later if needed.
