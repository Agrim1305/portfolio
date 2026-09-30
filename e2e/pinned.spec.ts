import { expect, test, type Page } from "@playwright/test";

type Box = { top: number; bottom: number; left: number; right: number };

// Scrolls to where slide `i` sits in its pinned section, then reports the
// slide's box and the box of every line of text in it.
async function pinnedSlide(page: Page, id: string, i: number) {
  return page.evaluate(
    async ({ id, i }) => {
      const section = document.getElementById(id)!;
      const slides = section.querySelectorAll<HTMLElement>("[aria-roledescription='slide']");
      const top = section.getBoundingClientRect().top + window.scrollY;
      const travel = section.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + (i / (slides.length - 1)) * travel, behavior: "instant" });
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const box = (el: Element) => {
        const { top, bottom, left, right } = el.getBoundingClientRect();
        return { top, bottom, left, right };
      };
      const slide = slides[i];
      // Every line of text on screen in the section, for the pill check.
      const lines: DOMRect[] = [];
      const walker = document.createTreeWalker(section.querySelector(".pin-stage")!, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!node.textContent!.trim() || !node.parentElement!.checkVisibility()) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        lines.push(...[...range.getClientRects()].filter((r) => r.right > 0 && r.left < window.innerWidth && r.width > 0));
      }
      return {
        slide: box(slide),
        text: [...slide.querySelectorAll("h3, p")].map((el) => ({ text: el.textContent!.slice(0, 40), ...box(el) })),
        lines: lines.map(({ top, bottom, left, right }) => ({ top, bottom, left, right })),
        pill: box(document.querySelector("button.dock")!),
        viewport: { width: window.innerWidth, height: window.innerHeight },
      };
    },
    { id, i },
  );
}

const overlaps = (a: Box, b: Box) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

const inside = (inner: Box, outer: Box) =>
  inner.top >= outer.top - 0.5 &&
  inner.bottom <= outer.bottom + 0.5 &&
  inner.left >= outer.left - 0.5 &&
  inner.right <= outer.right + 0.5;

const CARD = 720; // 80svh of scroll per card at 1440 x 900

// Puts the page on card `card` of Selected work and starts recording scrollY
// every frame, relative to the section's top.
async function restOnCard(page: Page, card: number) {
  const top = await page.locator("#projects").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top + card * CARD);
  await page.waitForTimeout(400);
  await page.evaluate((top) => {
    const w = window as unknown as { frames: [number, number][] };
    w.frames = [];
    requestAnimationFrame(function tick(t) {
      w.frames.push([t, window.scrollY - top]);
      requestAnimationFrame(tick);
    });
  }, top);
  await page.mouse.move(700, 500);
}

// A trackpad flick: a burst of wheel deltas, one a frame, decaying like
// momentum. Negative `first` flicks up.
async function flick(page: Page, first: number) {
  for (let delta = first; Math.abs(delta) >= 1; delta *= 0.88) {
    await page.mouse.wheel(0, delta);
    await page.waitForTimeout(16);
  }
}

const frames = (page: Page) =>
  page.evaluate(() => (window as unknown as { frames: [number, number][] }).frames);
const scrolled = async (page: Page) => (await frames(page)).at(-1)![1];

test.describe("pinned travel", () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  test.skip(({ isMobile }) => isMobile, "pinned travel is for wide screens");

  test("one flick moves exactly one card, however big, and never backs up", async ({ page }) => {
    await page.goto("/");
    await restOnCard(page, 0);
    await flick(page, 160);
    await page.waitForTimeout(1200);
    const recorded = await frames(page);
    for (let i = 1; i < recorded.length; i++) expect(recorded[i][1]).toBeGreaterThanOrEqual(recorded[i - 1][1] - 0.5);
    expect(Math.abs(recorded.at(-1)![1] - CARD)).toBeLessThanOrEqual(1);
  });

  test("a flick that carries the page into the section stops on the first card", async ({ page }) => {
    await page.goto("/");
    await restOnCard(page, 0);
    await page.evaluate(() => window.scrollBy({ top: -300, behavior: "instant" }));
    await page.waitForTimeout(400);
    await flick(page, 160);
    await page.waitForTimeout(1500);
    expect(Math.abs(await scrolled(page))).toBeLessThanOrEqual(1);
  });

  test("a nudge under the threshold moves nothing", async ({ page }) => {
    await page.goto("/");
    await restOnCard(page, 2);
    await page.mouse.wheel(0, 20);
    await page.waitForTimeout(1000);
    expect(Math.abs((await scrolled(page)) - 2 * CARD)).toBeLessThanOrEqual(1);
  });

  test("a flick's momentum is spent: input counts again only once it goes quiet", async ({ page }) => {
    await page.goto("/");
    await restOnCard(page, 0);
    await flick(page, 60);
    // Straight on, with no pause: still the same gesture.
    await flick(page, 60);
    await page.waitForTimeout(1200);
    expect(Math.abs((await scrolled(page)) - CARD)).toBeLessThanOrEqual(1);
    // After a pause, the next flick moves on, and back works the same way.
    await flick(page, 60);
    await page.waitForTimeout(1200);
    expect(Math.abs((await scrolled(page)) - 2 * CARD)).toBeLessThanOrEqual(1);
    await flick(page, -60);
    await page.waitForTimeout(1200);
    expect(Math.abs((await scrolled(page)) - CARD)).toBeLessThanOrEqual(1);
  });

  test("at the first and last card a flick outward lets the page scroll on", async ({ page }) => {
    await page.goto("/");
    await restOnCard(page, 0);
    await flick(page, -60);
    await page.waitForTimeout(1200);
    expect(await scrolled(page)).toBeLessThan(-50);

    await restOnCard(page, 7);
    await flick(page, 60);
    await page.waitForTimeout(1200);
    expect(await scrolled(page)).toBeGreaterThan(7 * CARD + 50);
  });

  test("the page keys step too, one card a press, queued", async ({ page }) => {
    await page.goto("/");
    await restOnCard(page, 0);
    await page.locator("body").press("PageDown");
    await page.locator("body").press("PageDown");
    await page.waitForTimeout(1400);
    expect(Math.abs((await scrolled(page)) - 2 * CARD)).toBeLessThanOrEqual(1);
    await page.locator("body").press("Shift+Space");
    await page.waitForTimeout(1200);
    expect(Math.abs((await scrolled(page)) - CARD)).toBeLessThanOrEqual(1);
  });

  test("travel keeps to the frame budget", async ({ page, isMobile }, info) => {
    test.skip(isMobile, "pinned travel is for wide screens");
    await page.goto("/");
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Performance.enable");
    const metric = async () =>
      Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
    await page.evaluate(() => {
      const w = window as unknown as { longFrames: number[] };
      w.longFrames = [];
      new PerformanceObserver((list) => list.getEntries().forEach((e) => w.longFrames.push(Math.round(e.duration)))).observe({
        type: "long-animation-frame",
      });
    });
    const before = await metric();
    await restOnCard(page, 0);
    await flick(page, 50);
    await page.waitForTimeout(1500);
    const recorded = await frames(page);
    const after = await metric();

    // Every frame drawn from the first movement to the last, settle included.
    const moved = recorded.map((f, i) => i > 0 && f[1] !== recorded[i - 1][1]);
    const travel = recorded.slice(moved.indexOf(true) - 1, moved.lastIndexOf(true) + 1);
    const gaps = travel.slice(1).map((f, i) => f[0] - travel[i][0]).sort((a, b) => a - b);
    // Main-thread time over the whole run, spread across the frames it drew.
    const busy = ((after.TaskDuration - before.TaskDuration) * 1000) / recorded.length;
    const longFrames = await page.evaluate(() => (window as unknown as { longFrames: number[] }).longFrames);
    const report = {
      travelFrames: travel.length,
      frameGapMedianMs: gaps[Math.floor(gaps.length / 2)],
      frameGapP95Ms: gaps[Math.floor(gaps.length * 0.95)],
      frameGapMaxMs: gaps.at(-1),
      mainThreadMsPerFrame: Number(busy.toFixed(2)),
      longAnimationFrames: longFrames.length,
    };
    info.annotations.push({ type: "frame times", description: JSON.stringify(report) });
    console.log("frame times", report);
    // Timing needs the machine to itself: other workers loading pages in
    // parallel starve this one. Run with --workers=1 to hold it to the budget.
    if (info.config.workers === 1) expect(longFrames).toEqual([]);
  });
});

for (const [width, height] of [
  [1280, 720],
  [1440, 800],
  [1440, 900],
  [1920, 1080],
]) {
  test.describe(`pinned at ${width}x${height}`, () => {
    test.use({ viewport: { width, height } });

    for (const id of ["projects", "court"]) {
      test(`every ${id} slide and its text fit on screen, clear of the docked cloud`, async ({ page, isMobile }) => {
        test.skip(isMobile, "pinned travel is for wide screens");
        await page.goto("/");
        for (let i = 0; i < 8; i++) {
          const { slide, text, lines, pill, viewport } = await pinnedSlide(page, id, i);
          const screen = { top: 0, left: 0, bottom: viewport.height, right: viewport.width };
          expect(slide.bottom, `slide ${i + 1} bottom`).toBeLessThanOrEqual(viewport.height);
          for (const line of text) {
            expect(inside(line, slide) && inside(line, screen), `slide ${i + 1}: "${line.text}"`).toBe(true);
          }
          expect(lines.filter((line) => overlaps(line, pill)), `slide ${i + 1}: text under the docked cloud`).toEqual([]);
        }
      });
    }
  });
}
