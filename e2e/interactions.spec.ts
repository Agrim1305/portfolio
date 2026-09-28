import { expect, test } from "@playwright/test";

test.describe("mobile menu", () => {
  test.skip(({ isMobile }) => !isMobile, "the menu sheet only exists below lg");

  test("opens, closes on Escape and returns focus", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Open menu" });
    await button.click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(button).toBeFocused();
  });

  test("a section link closes the menu and scrolls to the section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "Contact" }).click();
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeHidden();
    await expect
      .poll(() => page.evaluate(() => document.getElementById("contact")!.getBoundingClientRect().top))
      .toBeLessThan(200);
  });
});

test.describe("avatar voice", () => {
  // A stand-in voice: reports a word boundary every 150ms and finishes after
  // 1.2s, and records what it was asked to say.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { __spoken: string[] };
      w.__spoken = [];
      window.speechSynthesis.cancel = () => {};
      window.speechSynthesis.speak = (u) => {
        w.__spoken.push(u.text);
        if (!u.text) return;
        let elapsed = 0;
        const timer = setInterval(() => {
          elapsed += 150;
          u.onboundary?.(new Event("boundary") as SpeechSynthesisEvent);
          if (elapsed >= 1200) {
            clearInterval(timer);
            u.onend?.(new Event("end") as SpeechSynthesisEvent);
          }
        }, 150);
      };
    });
  });

  test("starts muted and says nothing until asked", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken)).toEqual([]);
  });

  test("Hear me reads the intro, moves the mouth, and remembers the choice", async ({ page }) => {
    await page.goto("/");
    const hear = page.getByRole("button", { name: "Hear me" });
    await expect(hear).toHaveAttribute("aria-pressed", "false");
    await hear.click();
    await expect(hear).toHaveAttribute("aria-pressed", "true");

    const spoken = await page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken);
    expect(spoken.join(" ")).toContain("Final-year Computer Science student at Adelaide University");

    // Some mouth frame other than the closed one shows while talking.
    await expect
      .poll(() =>
        page.evaluate(() =>
          [...document.querySelectorAll<HTMLImageElement>("img[src*='head-']")].findIndex(
            (img) => getComputedStyle(img).opacity === "1",
          ),
        ),
      )
      .toBeGreaterThan(0);

    await expect(hear).toHaveAttribute("aria-pressed", "false", { timeout: 5000 });
    expect(await page.evaluate(() => localStorage.getItem("voice"))).toBe("on");
  });
});

test("the stack strip can be paused", async ({ page }) => {
  await page.goto("/");
  const pause = page.getByRole("button", { name: "Pause the stack strip" });
  await pause.click();
  await expect(page.getByRole("button", { name: "Play the stack strip" })).toBeVisible();
  const state = await page.locator(".marquee").evaluate((el) => getComputedStyle(el).animationPlayState);
  expect(state).toBe("paused");
});
