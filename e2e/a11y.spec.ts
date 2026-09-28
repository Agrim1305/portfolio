import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const WCAG_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

// Scan the settled page: mid-animation text would be measured at part opacity.
test.use({ reducedMotion: "reduce" });

async function violations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
  return violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

test("home page passes axe", async ({ page }) => {
  await page.goto("/");
  expect(await violations(page)).toEqual([]);
});

test("case study page passes axe", async ({ page }) => {
  await page.goto("/projects/metaplay");
  expect(await violations(page)).toEqual([]);
});

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
