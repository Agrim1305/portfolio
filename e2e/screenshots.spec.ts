import { test } from "@playwright/test";

/* Full-page captures for comparing against the design reference by eye.
   Not an assertion; run with SCREENSHOTS=1. Output is git-ignored. */
test.skip(!process.env.SCREENSHOTS, "set SCREENSHOTS=1 to capture");

test("capture", async ({ page }, info) => {
  const path = process.env.SCREENSHOT_PATH ?? "/";
  await page.goto(path);
  // Let entrance animations settle and lazy images load.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
  const name = path === "/" ? "home" : path.replaceAll("/", "_");
  await page.screenshot({ path: `e2e/screenshots/${name}-${info.project.name}.png`, fullPage: true });
});
