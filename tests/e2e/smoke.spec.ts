import { expect, test } from "@playwright/test";

const publicRoutes = [
  { path: "/", text: /ServiceNow/i }, { path: "/certifications", text: /certifications/i }, { path: "/pricing", text: /Lifetime|pricing|access/i }, { path: "/practice-questions", text: /practice questions/i }, { path: "/csa/practice-questions", text: /CSA|Certified System Administrator|practice questions/i }, { path: "/csa/practice-questions/ui-navigation", text: /User Interface|Navigation|Free Questions/i }, { path: "/cis-df/practice-questions", text: /CIS-DF|Data Foundations|practice questions/i }, { path: "/cad/practice-questions", text: /CAD|Application Developer|practice questions/i }, { path: "/csa/mock-exam", text: /Mock Exam|CSA|System Administrator/i }, { path: "/blog", text: /blog|ServiceNow/i }, { path: "/salaries", text: /salary|salaries/i },
];

const deploymentOnly = !!process.env.PLAYWRIGHT_BASE_URL;

test.describe("production smoke", () => {
  for (const route of publicRoutes) test(`${route.path} loads without obvious runtime failure`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), `${route.path} should not 404/500`).toBeLessThan(400);
    await expect(page.locator("body")).toContainText(route.text);
    await expect(page.locator("body")).not.toContainText(/Application error|Unhandled Runtime Error|404 This page could not be found/i);
    expect(errors, `${route.path} browser errors`).toEqual([]);
  });

  test("practice question paywall stays visible to visitors without access", async ({ page }) => {
    await page.goto("/csa/practice-questions/ui-navigation", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/Free Questions/i)).toBeVisible();
    await expect(page.getByText(/Unlock .* More Questions/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /CSA Lifetime/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Lifetime All Certs/i }).first()).toBeVisible();
  });

  for (const privatePath of ["/private-dumps/", "/data/exam-intel/", "/data/exam-intel/dumps/", "/exam-intel/"]) test(`${privatePath} does not expose private exam intelligence content`, async ({ page }) => {
    const response = await page.goto(privatePath, { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    expect(response?.status()).not.toBe(200);
    expect(body).not.toMatch(/raw dump|exam dump|observedQuestion|correctAnswers/i);
  });

  test("admin exam intelligence is protected for visitors", async ({ page }) => {
    test.skip(!deploymentOnly, "Admin auth protection requires a real deployment with Pages Functions middleware");

    const response = await page.goto("/admin/exam-intel", { waitUntil: "domcontentloaded" });
    const body = page.locator("body");
    expect(response?.status()).toBe(401);
    await expect(body).toContainText(/Admin Access Required/i);
    await expect(body).toContainText(/Send admin login link/i);
    await expect(page.locator('input[type="hidden"][value="/admin/exam-intel"]')).toHaveCount(1);
    await expect(body).not.toContainText(/Observed questions|Generation gaps|symbolic mappings/i);
  });

  test.describe("deployment API smoke", () => {
    test.skip(!deploymentOnly, "Deployment API smoke only runs against a real preview/prod URL");

    test("magic-link dry-run reports auth readiness", async ({ request }) => {
      const response = await request.post("/api/auth/send-magic-link", {
        data: { email: "smoke+auth@snready.com", dryRun: true },
      });
      expect(response.status()).toBe(200);
      await expect(response.json()).resolves.toEqual({
        success: true,
        configured: true,
        message: "Magic link auth configuration looks present",
      });
    });

    test("session endpoint returns a structured missing-session error", async ({ request }) => {
      const response = await request.get("/api/session");
      expect(response.status()).toBe(400);
      await expect(response.json()).resolves.toEqual({
        error: "Session ID required",
        code: "missing_session_id",
      });
    });

    test("checkout endpoint returns a structured validation error before hitting Stripe", async ({ request }) => {
      const response = await request.post("/api/checkout", {
        data: { plan: "single" },
      });
      expect(response.status()).toBe(400);
      await expect(response.json()).resolves.toEqual({
        error: "Certification is required for single-cert purchases",
        code: "missing_certification",
      });
    });
  });
});
