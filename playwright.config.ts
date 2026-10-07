import { defineConfig, devices } from "@playwright/test";

// Runs against the production build: `npm run build` first, then `npx playwright test`.
// BASE_URL points it at an already-running server instead (e.g. `next dev`).
const baseURL = process.env.BASE_URL ?? "http://localhost:3100";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL },
  webServer: process.env.BASE_URL
    ? undefined
    : { command: "npx next start -p 3100", url: baseURL, reuseExistingServer: true },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } },
    },
  ],
});
