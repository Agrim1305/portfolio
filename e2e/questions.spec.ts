import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const SECTIONS = ["projects", "leadership", "experience", "google", "court", "about", "contact"];

// Scrolls a section into view the way a reader stops on it, then waits for
// the page to rest and the question to be offered.
async function restOn(page: Page, id: string) {
  await page.evaluate((id) => {
    const el = document.getElementById(id)!;
    const pinned = el.classList.contains("pin-section");
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - (pinned ? 0 : 80), behavior: "instant" });
  }, id);
  await page.waitForTimeout(1100);
}

const bubble = (page: Page) => page.locator("#dock-question");
const dot = (page: Page) => page.locator("button.dock span.bg-accent");
const cloud = (page: Page) => page.getByRole("button", { name: "Ask AI about Agrim" });

// Every line of text, image and control on screen outside the assistant's
// corner, measured independently of the page's own check.
async function contentBoxes(page: Page) {
  return page.evaluate(() => {
    const corner = document.querySelector("button.dock")!.parentElement!;
    const boxes: { top: number; bottom: number; left: number; right: number }[] = [];
    const add = (r: DOMRect) => {
      if (r.width && r.height && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth) boxes.push(r.toJSON());
    };
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n.parentElement!;
      if (!n.textContent!.trim() || corner.contains(el) || !el.checkVisibility({ visibilityProperty: true })) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      [...range.getClientRects()].forEach(add);
    }
    document.querySelectorAll("img, video, button, a, input").forEach((el) => {
      if (!corner.contains(el) && el.checkVisibility({ visibilityProperty: true })) add(el.getBoundingClientRect());
    });
    return boxes;
  });
}
const overlaps = (a: DOMRect, b: { top: number; bottom: number; left: number; right: number }) =>
  a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

for (const [width, height] of [
  [1280, 720],
  [1440, 900],
]) {
  test.describe(`section questions at ${width}x${height}`, () => {
    test.use({ viewport: { width, height } });

    test("each section offers its question once: a bubble only where nothing is under it, otherwise a dot", async ({ page, isMobile }) => {
      test.skip(isMobile, "the wide-screen layout");
      await page.goto("/");
      let bubbles = 0;
      for (const id of SECTIONS) {
        await restOn(page, id);
        await expect(bubble(page)).toBeAttached();
        const shown = await bubble(page).evaluate((el) => getComputedStyle(el).visibility === "visible");
        if (shown) {
          bubbles++;
          const box = await bubble(page).locator("> div").evaluate((el) => el.getBoundingClientRect().toJSON());
          const covered = (await contentBoxes(page)).filter((b) => overlaps(box, b));
          expect(covered, `${id}: the bubble covers content`).toEqual([]);
          await expect(dot(page)).toHaveCount(0);
        } else {
          await expect(dot(page), `${id}: no room, so a dot`).toBeVisible();
        }
      }
      // Contact's corner is clear at both sizes, so the unprompted bubble is
      // exercised every run.
      expect(bubbles).toBeGreaterThan(0);

      // Back through every section: each was seen, as a bubble or not at all
      // yet. Bubbles never come back; dots remain until their question is seen.
      for (const id of SECTIONS) {
        await restOn(page, id);
        if (await dot(page).isVisible()) {
          await cloud(page).hover();
          await expect(bubble(page)).toBeVisible();
          await expect(dot(page)).toHaveCount(0);
          await page.mouse.move(10, 10);
        }
      }
      for (const id of SECTIONS) {
        await restOn(page, id);
        await expect(bubble(page), `${id} asked twice`).toHaveCount(0);
        await expect(dot(page)).toHaveCount(0);
      }
    });
  });
}

test.describe("section questions", () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  test.skip(({ isMobile }) => isMobile, "the wide-screen layout");

  test.beforeEach(async ({ page }) => {
    await page.route("/api/chat", (route) =>
      route.fulfill({ status: 200, contentType: "text/plain; charset=utf-8", body: "Yes, from December 2026." }),
    );
  });

  test("tapping a bubble opens the chat and sends its question", async ({ page }) => {
    await page.goto("/");
    await restOn(page, "contact");
    await bubble(page).getByRole("button", { name: "Is he eligible to work in Australia?" }).click();
    const chat = page.getByRole("dialog", { name: "Ask about Agrim" });
    await expect(chat.getByRole("log")).toContainText("Is he eligible to work in Australia?");
    await expect(chat.getByRole("log")).toContainText("Yes, from December 2026.");
    await expect(bubble(page)).toHaveCount(0);
    await page.keyboard.press("Escape");
    await expect(cloud(page)).toBeFocused();
  });

  test("a dot's question shows on hover and on focus, sends on click, and Escape puts it away", async ({ page }) => {
    await page.goto("/");
    await restOn(page, "experience");
    await expect(dot(page)).toBeVisible();
    await expect(bubble(page)).toBeHidden();

    await cloud(page).focus();
    await expect(bubble(page)).toBeVisible();
    await expect(cloud(page)).toHaveAccessibleDescription("What does Agrim do at Aurivox?");
    // Tab goes from the cloud into its question, and the tooltip stays.
    await page.keyboard.press("Tab");
    await expect(bubble(page).getByRole("button", { name: "What does Agrim do at Aurivox?" })).toBeFocused();
    await expect(bubble(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(bubble(page)).toBeHidden();
    await expect(cloud(page)).toBeFocused();

    await cloud(page).hover();
    await bubble(page).getByRole("button", { name: "What does Agrim do at Aurivox?" }).click();
    await expect(page.getByRole("dialog", { name: "Ask about Agrim" }).getByRole("log")).toContainText(
      "What does Agrim do at Aurivox?",
    );
  });

  test("the Projects question names the card in view", async ({ page }) => {
    await page.goto("/");
    await restOn(page, "projects");
    await page.getByRole("button", { name: "Next project" }).click();
    await expect(page.getByText("2 / 8")).toBeVisible();
    await page.getByRole("button", { name: "Next project" }).click();
    await expect(page.getByText("3 / 8")).toBeVisible();
    await page.mouse.move(10, 10);
    await page.waitForTimeout(1500);
    await expect(bubble(page)).toContainText("How was Adelaide Rising Stars built?");
  });

  test("dismissed stays dismissed, and nothing shows while the chat is open or the page moves", async ({ page }) => {
    await page.goto("/");
    await restOn(page, "contact");
    await expect(bubble(page)).toBeVisible();
    await page.mouse.wheel(0, -60);
    await expect(bubble(page)).toHaveCount(0);
    await page.waitForTimeout(1100);
    await expect(bubble(page)).toBeVisible();

    await page.keyboard.press("ControlOrMeta+k");
    await expect(bubble(page)).toHaveCount(0);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(600);
    await expect(bubble(page)).toBeVisible();

    await bubble(page).getByRole("button", { name: "Dismiss this question" }).click();
    await expect(bubble(page)).toHaveCount(0);
    await expect(cloud(page)).toBeFocused();
    await page.mouse.wheel(0, 40);
    await page.waitForTimeout(1100);
    await expect(bubble(page)).toHaveCount(0);
  });

  test("passes axe with a bubble showing", async ({ page }) => {
    await page.goto("/");
    await restOn(page, "contact");
    await expect(bubble(page)).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).include("button.dock").include("#dock-question").analyze();
    expect(violations).toEqual([]);
  });
});
