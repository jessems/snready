import { defineConfig, devices } from "@playwright/test";

const defaultBaseURL = "http://127.0.0.1:3100";
const baseURL = process.env.PLAYWRIGHT_BASE_URL || defaultBaseURL;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { baseURL, trace: "on-first-retry" },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run build && npx serve out -l 3100",
        url: defaultBaseURL,
        reuseExistingServer: false,
        timeout: 180_000,
      },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
