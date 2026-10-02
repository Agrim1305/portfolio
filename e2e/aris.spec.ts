import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const cloud = (page: Page) => page.getByRole("button", { name: "Ask Aris, Agrim's AI assistant" });
const pill = (page: Page) => page.locator("#dock-pill");
const hello = (page: Page) => page.locator("#dock-hello");
const chat = (page: Page) => page.getByRole("dialog", { name: "Aris" });
const HELLO = "Hi, I'm Aris. Ask me anything about Agrim's work.";

const scrollTo = (page: Page, y: number) =>
  page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
// Far enough down that the cloud has docked, on every layout.
const dock = (page: Page) => scrollTo(page, 2000);

test("the chat, the hero card and the cloud are named Aris", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#top").getByText("Ask Aris", { exact: true })).toBeVisible();
  await dock(page);
  await expect(cloud(page)).toBeVisible();
  await cloud(page).click();
  await expect(chat(page)).toBeVisible();
  await expect(chat(page)).toContainText("Agrim's AI assistant · grounded in his portfolio");
  await expect(chat(page).getByRole("log")).toContainText("Hi, I'm Aris, an AI assistant trained only on Agrim's portfolio content.");
});

test.describe("the pill", () => {
  test("from md up, Ask Aris and the orange sparkle sit left of the docked cloud, in the same button", async ({ page, isMobile }) => {
    test.skip(isMobile, "phones show the cloud only");
    await page.goto("/");
    // Up in the hero there is only the cloud.
    await expect(page.locator("#hero-cloud .cloud")).toHaveCSS("visibility", "hidden");
    await expect(pill(page)).toBeHidden();

    await dock(page);
    await expect(pill(page)).toBeVisible();
    await expect(pill(page)).toHaveText("Ask Aris");
    await expect(pill(page)).toHaveCSS("opacity", "1");
    await expect(pill(page).locator("svg")).toHaveCSS("color", "rgb(255, 91, 46)");
    const [tag, body] = [(await pill(page).boundingBox())!, (await cloud(page).boundingBox())!];
    expect(tag.x + tag.width).toBeGreaterThan(body.x);
    expect(tag.x + tag.width).toBeLessThanOrEqual(body.x + 13);
    expect(tag.y).toBeGreaterThan(body.y);
    expect(tag.y + tag.height).toBeLessThan(body.y + body.height);

    // Part of the cloud's button: clicking it opens the chat.
    await pill(page).click();
    await expect(chat(page)).toBeVisible();
  });

  test("fades in over the last stretch of the cloud's flight", async ({ page, isMobile }) => {
    test.skip(isMobile, "the cloud travels on wide screens");
    await page.goto("/");
    await expect(page.locator("#hero-cloud .cloud")).toHaveCSS("visibility", "hidden");
    const hero = await page.locator("#top").evaluate((el: HTMLElement) => el.offsetHeight);
    // Docked at 80% of the hero; the pill fades in from 85% of that.
    await scrollTo(page, hero * 0.8 * 0.925);
    await expect.poll(async () => Number(await pill(page).evaluate((el) => getComputedStyle(el).opacity))).toBeGreaterThan(0.2);
    expect(Number(await pill(page).evaluate((el) => getComputedStyle(el).opacity))).toBeLessThan(0.8);
  });

  test("under reduced motion it shows with the cloud once docked", async ({ page, isMobile }) => {
    test.skip(isMobile, "phones show the cloud only");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await dock(page);
    await expect(pill(page)).toBeVisible();
  });

  test("phones show the cloud only, with a dot until the chat has been opened this visit", async ({ page, isMobile }) => {
    test.skip(!isMobile, "the phone layout");
    const dot = page.locator("button.dock span.bg-accent").filter({ visible: true });
    await page.goto("/");
    await dock(page);
    await expect(cloud(page)).toBeVisible();
    await expect(pill(page)).toBeHidden();
    await expect(dot).toBeVisible();
    const box = (await dot.boundingBox())!;
    expect(box.width).toBeCloseTo(8, 0);

    await cloud(page).click();
    await expect(chat(page)).toBeVisible();
    await chat(page).getByRole("button", { name: "Close chat" }).click();
    await expect(dot).toHaveCount(0);
    await page.reload();
    await dock(page);
    await expect(cloud(page)).toBeVisible();
    await expect(dot).toHaveCount(0);
  });
});

test.describe("hello", () => {
  test("the first time the cloud docks it says hello, and only once a visit", async ({ page }) => {
    await page.goto("/");
    await expect(hello(page)).toHaveCount(0);
    await dock(page);
    await expect(hello(page)).toHaveText(HELLO);

    await hello(page).getByRole("button", { name: "Dismiss" }).click();
    await expect(hello(page)).toHaveCount(0);
    await expect(cloud(page)).toBeFocused();

    // Back up to the hero and down again, then a fresh load: no second hello.
    await scrollTo(page, 0);
    await page.waitForTimeout(400);
    await dock(page);
    await page.waitForTimeout(600);
    await expect(hello(page)).toHaveCount(0);
    await page.reload();
    await dock(page);
    await expect(cloud(page)).toBeVisible();
    await page.waitForTimeout(600);
    await expect(hello(page)).toHaveCount(0);
  });

  test("puts itself away after 8 seconds, but not while the pointer is on it", async ({ page, isMobile }) => {
    await page.clock.install();
    await page.goto("/");
    await dock(page);
    await expect(hello(page)).toBeVisible();
    await page.clock.runFor(7000);
    await expect(hello(page)).toBeVisible();
    if (!isMobile) {
      await hello(page).hover();
      await page.clock.runFor(5000);
      await expect(hello(page)).toBeVisible();
      await page.mouse.move(10, 10);
    }
    await page.clock.runFor(8100);
    await expect(hello(page)).toHaveCount(0);
  });

  test("clicking it opens the chat, and closing the chat returns to the cloud", async ({ page }) => {
    await page.goto("/");
    await dock(page);
    await hello(page).getByRole("button", { name: HELLO }).click();
    await expect(chat(page)).toBeVisible();
    await expect(hello(page)).toHaveCount(0);
    await page.keyboard.press("Escape");
    await expect(chat(page)).toBeHidden();
    await expect(cloud(page)).toBeFocused();
  });

  test("keyboard: Tab goes from the cloud to the hello, Enter opens the chat, Escape puts it away", async ({ page }) => {
    await page.goto("/");
    await dock(page);
    await expect(hello(page)).toBeVisible();
    await cloud(page).focus();
    await page.keyboard.press("Tab");
    await expect(hello(page).getByRole("button", { name: HELLO })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(hello(page).getByRole("button", { name: "Dismiss" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(hello(page)).toHaveCount(0);
    await expect(cloud(page)).toBeFocused();

    await page.evaluate(() => sessionStorage.removeItem("hello"));
    await page.reload();
    await dock(page);
    await expect(hello(page)).toBeVisible();
    await cloud(page).focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(chat(page)).toBeVisible();
    await expect(chat(page).getByRole("textbox", { name: "Ask a question" })).toBeFocused();
  });

  test("no hello once the chat has been opened", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");
    // Escape is the chat's once focus is in it.
    await expect(chat(page).getByRole("textbox", { name: "Ask a question" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(chat(page)).toBeHidden();
    await dock(page);
    await expect(cloud(page)).toBeVisible();
    await page.waitForTimeout(600);
    await expect(hello(page)).toHaveCount(0);
  });

  test.describe("section questions", () => {
    // At this size Contact's corner is clear, so its question is a bubble.
    test.use({ viewport: { width: 1280, height: 720 } });

    test("wait while the hello shows, and come once it has gone", async ({ page, isMobile }) => {
      test.skip(isMobile, "the wide-screen layout");
      await page.goto("/");
      await page.locator("#contact").evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "instant" }));
      await expect(hello(page)).toBeVisible();
      await page.waitForTimeout(1100);
      await expect(page.locator("#dock-question")).toHaveCount(0);
      await hello(page).getByRole("button", { name: "Dismiss" }).click();
      await expect(page.locator("#dock-question")).toBeVisible();
    });
  });

  test("passes axe with the hello and the pill showing", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await dock(page);
    await expect(hello(page)).toBeVisible();
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .include("button.dock")
      .include("#dock-hello")
      .analyze();
    expect(violations).toEqual([]);
  });
});

test.describe("idle glance", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("hello", "1"));
  });
  const eyeX = (page: Page) => page.locator("button.dock .cloud-eyes").evaluate((el) => el.style.getPropertyValue("--eye-x"));
  const eyeY = (page: Page) => page.locator("button.dock .cloud-eyes").evaluate((el) => el.style.getPropertyValue("--eye-y"));

  test("every 20 to 30 seconds while docked, the eyes glance toward the middle of the page for about a second", async ({ page }) => {
    await page.clock.install();
    await page.goto("/");
    await dock(page);
    await expect(cloud(page)).toBeVisible();
    let waited = 0;
    while (!(await eyeX(page)) && waited < 31_000) {
      await page.clock.runFor(250);
      waited += 250;
    }
    expect(waited).toBeGreaterThanOrEqual(19_750);
    // From the bottom-right corner, the middle of the page is up and left.
    expect(parseFloat(await eyeX(page))).toBeLessThan(0);
    expect(parseFloat(await eyeY(page))).toBeLessThan(0);
    await page.clock.runFor(1100);
    expect(await eyeX(page)).toBe("");
  });

  test("never under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.clock.install();
    await page.goto("/");
    await dock(page);
    await expect(cloud(page)).toBeVisible();
    for (let t = 0; t < 32_000; t += 1000) {
      await page.clock.runFor(1000);
      expect(await eyeX(page)).toBe("");
    }
  });
});
