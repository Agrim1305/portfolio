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
      const shot = slide.querySelector("img");
      return {
        slide: box(slide),
        shot: shot && box(shot),
        text: [...slide.querySelectorAll("h3, p")].map((el) => ({ text: el.textContent!.slice(0, 40), ...box(el) })),
        lines: lines.map(({ top, bottom, left, right }) => ({ top, bottom, left, right })),
        pill: box(document.querySelector("body > button[aria-keyshortcuts]")!),
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

// A trackpad flick over the cards: a burst of small wheel deltas, one a frame,
// decaying like momentum. Records scrollY every frame, and when the last wheel
// event arrived, relative to the section's top.
async function flick(page: Page, first: number) {
  const top = await page.locator("#projects").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    const w = window as unknown as { frames: [number, number][]; wheels: number[] };
    w.frames = [];
    w.wheels = [];
    addEventListener("wheel", () => w.wheels.push(performance.now()), { passive: true });
    requestAnimationFrame(function tick(t) {
      w.frames.push([t, window.scrollY]);
      requestAnimationFrame(tick);
    });
  });
  await page.mouse.move(700, 500);
  for (let delta = first; delta >= 1; delta *= 0.88) {
    await page.mouse.wheel(0, delta);
    await page.waitForTimeout(16);
  }
  await page.waitForTimeout(2500);
  const { frames, wheels } = await page.evaluate(() => {
    const w = window as unknown as { frames: [number, number][]; wheels: number[] };
    return { frames: w.frames, wheels: w.wheels };
  });
  return { frames: frames.map(([t, y]) => [t, y - top] as const), lastWheel: wheels.at(-1)! };
}

// Splits a recording at the first moment the page held still for `still` ms:
// the gesture and its momentum before, the settle after.
function splitAtRest(frames: (readonly [number, number])[], still = 140) {
  for (let i = 1; i < frames.length; i++) {
    let j = i;
    while (j + 1 < frames.length && frames[j + 1][1] === frames[i][1]) j++;
    if (frames[j][0] - frames[i][0] >= still) return { gesture: frames.slice(0, i + 1), restAt: frames[i][0], after: frames.slice(j) };
  }
  throw new Error("the page never came to rest");
}

test.describe("pinned travel", () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  const CARD = 720; // 80svh of scroll per card

  for (const [name, first, expected] of [
    ["forward to the next card", 50, CARD],
    ["back to the card it left", 22, 0],
  ] as const) {
    test(`a trackpad flick glides without reversing, then settles ${name} only once still`, async ({ page, isMobile }) => {
      test.skip(isMobile, "pinned travel is for wide screens");
      await page.goto("/");
      const { frames, lastWheel } = await flick(page, first);
      const { gesture, restAt, after } = splitAtRest(frames);

      for (let i = 1; i < gesture.length; i++) {
        expect(gesture[i][1], "the page only moves the way the gesture went").toBeGreaterThanOrEqual(gesture[i - 1][1]);
      }
      const settleStart = after.find(([, y]) => y !== after[0][1]);
      if (settleStart) {
        expect(settleStart[0] - lastWheel, "settles only after 150ms without input").toBeGreaterThanOrEqual(150);
        expect(settleStart[0] - restAt, "settles only after the page held still").toBeGreaterThanOrEqual(140);
      }
      expect(Math.abs(frames.at(-1)![1] - expected)).toBeLessThanOrEqual(1);
    });
  }

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
    const { frames } = await flick(page, 50);
    const after = await metric();

    // Every frame drawn from the first movement to the last, settle included.
    const moved = frames.map((f, i) => i > 0 && f[1] !== frames[i - 1][1]);
    const travel = frames.slice(moved.indexOf(true) - 1, moved.lastIndexOf(true) + 1);
    const gaps = travel.slice(1).map((f, i) => f[0] - travel[i][0]).sort((a, b) => a - b);
    // Main-thread time over the whole run, spread across the frames it drew.
    const busy = ((after.TaskDuration - before.TaskDuration) * 1000) / frames.length;
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
      test(`every ${id} slide is wholly on screen, its text clear of the Ask pill and the screenshot`, async ({ page, isMobile }) => {
        test.skip(isMobile, "pinned travel is for wide screens");
        await page.goto("/");
        for (let i = 0; i < 8; i++) {
          const { slide, shot, text, lines, pill, viewport } = await pinnedSlide(page, id, i);
          const screen = { top: 0, left: 0, bottom: viewport.height, right: viewport.width };
          expect(inside(slide, screen), `slide ${i + 1} wholly on screen`).toBe(true);
          if (shot && id === "projects") {
            expect(lines.filter((line) => overlaps(line, shot)), `slide ${i + 1}: text over the screenshot`).toEqual([]);
            // The screenshot is the bulk of the card where there is room.
            if (height >= 900) {
              expect((shot.right - shot.left) / (slide.right - slide.left), `slide ${i + 1} screenshot share`).toBeGreaterThanOrEqual(0.6);
            }
          }
          for (const line of text) {
            expect(inside(line, slide) && inside(line, screen), `slide ${i + 1}: "${line.text}"`).toBe(true);
          }
          expect(lines.filter((line) => overlaps(line, pill)), `slide ${i + 1}: text under the pill`).toEqual([]);
        }
      });
    }
  });
}
