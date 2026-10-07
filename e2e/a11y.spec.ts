import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const WCAG_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

// Aris says hello the first time the cloud docks, and the bubble can sit over
// what a test clicks. It has its own tests (aris.spec.ts); here it has
// already been seen this visit.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("hello", "1"));
});

// Scan the settled page: mid-animation text would be measured at part opacity.
test.use({ reducedMotion: "reduce" });

async function violations(page: Page) {
  // Sheets still fade under reduced motion; let every finite animation end.
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getComputedTiming().endTime !== Infinity)
        .map((a) => a.finished.catch(() => {})),
    ),
  );
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
  return violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

test("home page passes axe", async ({ page }) => {
  await page.goto("/");
  expect(await violations(page)).toEqual([]);
});

// Each section on its own, scrolled into view: at 1440 wide on desktop and
// 390 on mobile.
for (const id of ["top", "projects", "leadership", "experience", "google", "court", "about", "contact"]) {
  test(`#${id} passes axe`, async ({ page }) => {
    await page.goto("/");
    await page.locator(`#${id}`).evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "instant" }));
    const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).include(`#${id}`).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
}

for (const slug of ["metaplay", "pacific-village-explorer"]) {
  test(`${slug} case study passes axe`, async ({ page }) => {
    await page.goto(`/projects/${slug}`);
    expect(await violations(page)).toEqual([]);
  });
}

test("mobile menu passes axe", async ({ page, isMobile }) => {
  test.skip(!isMobile, "the menu sheet only exists below lg");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
  expect(await violations(page)).toEqual([]);
});

test("every sheet passes axe while open", async ({ page }) => {
  await page.goto("/");
  const triggers = page.locator("[data-expand]");
  for (let i = 0; i < (await triggers.count()); i++) {
    if (!(await triggers.nth(i).isVisible())) continue;
    await triggers.nth(i).click();
    await page.locator("dialog[open]").waitFor();
    expect(await violations(page)).toEqual([]);
    await page.keyboard.press("Escape");
  }
});

test("chat passes axe while open", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("ControlOrMeta+k");
  await expect(page.getByRole("dialog", { name: "Aris" })).toBeVisible();
  expect(await violations(page)).toEqual([]);
});
