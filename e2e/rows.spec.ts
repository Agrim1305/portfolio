import { expect, test, type Locator, type Page } from "@playwright/test";

/* The page scrolls natively. Selected work, Built on court and the journey
   are native sideways rows: the vertical wheel is always the page's, a
   sideways swipe is the row's, and buttons and arrow keys move one stop. */

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("hello", "1"));
});

type Row = {
  name: string;
  /** What scrolls sideways. */
  scroller: (page: Page) => Locator;
  /** What takes focus for the arrow keys. */
  region: (page: Page) => Locator;
  next: (page: Page) => Locator;
  prev: (page: Page) => Locator;
};

const rows: Row[] = [
  {
    name: "Selected work",
    scroller: (page) => page.getByRole("region", { name: "Selected work" }).locator("> div"),
    region: (page) => page.getByRole("region", { name: "Selected work" }),
    next: (page) => page.getByRole("button", { name: "Next project" }),
    prev: (page) => page.getByRole("button", { name: "Previous project" }),
  },
  {
    name: "Built on court",
    scroller: (page) => page.getByRole("region", { name: "Built on court" }),
    region: (page) => page.getByRole("region", { name: "Built on court" }),
    next: (page) => page.locator("#court").getByRole("button", { name: "Next stop" }).filter({ visible: true }),
    prev: (page) => page.locator("#court").getByRole("button", { name: "Previous stop" }).filter({ visible: true }),
  },
  {
    name: "A glimpse of my journey",
    scroller: (page) => page.locator(".journey-track"),
    region: (page) => page.getByRole("region", { name: "A glimpse of my journey" }),
    next: (page) => page.locator(".journey").getByRole("button", { name: "Next", exact: true }),
    prev: (page) => page.locator(".journey").getByRole("button", { name: "Previous", exact: true }),
  },
];

// Where each stop rests: its snap start, never past the end.
const stopsOf = (scroller: Locator) =>
  scroller.evaluate((el) => {
    const max = el.scrollWidth - el.clientWidth;
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    const origin = el.getBoundingClientRect().left - el.scrollLeft + pad;
    return [...el.querySelectorAll<HTMLElement>("[data-stop]")]
      .filter((s) => getComputedStyle(s).scrollSnapAlign.includes("start"))
      .map((s) => Math.round(Math.min(max, Math.max(0, s.getBoundingClientRect().left - origin))));
  });
const left = (scroller: Locator) => scroller.evaluate((el) => Math.round(el.scrollLeft));
const pageY = (page: Page) => page.evaluate(() => Math.round(window.scrollY));

// Brings the row near the top of the screen, at rest.
async function toRow(page: Page, row: Row) {
  await row.scroller(page).evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 150, behavior: "instant" }));
  await page.waitForTimeout(200);
}

for (const row of rows) {
  test.describe(row.name, () => {
    test("a vertical wheel over the row scrolls the page, not the row", async ({ page, isMobile }) => {
      test.skip(isMobile, "no wheel on touch");
      await page.goto("/");
      await toRow(page, row);
      const before = await pageY(page);
      await row.scroller(page).hover({ position: { x: 200, y: 100 } });
      await page.mouse.wheel(0, 400);
      await expect.poll(() => pageY(page)).toBeGreaterThan(before + 200);
      expect(await left(row.scroller(page))).toBe(0);
    });

    test("a sideways swipe scrolls the row, not the page", async ({ page, isMobile }) => {
      test.skip(isMobile, "no wheel on touch");
      await page.goto("/");
      await toRow(page, row);
      const before = await pageY(page);
      await row.scroller(page).hover({ position: { x: 200, y: 100 } });
      // Past half a card, so a mandatory snap carries on rather than
      // settling back.
      await page.mouse.wheel(800, 0);
      await expect.poll(() => left(row.scroller(page))).toBeGreaterThan(100);
      expect(await pageY(page)).toBe(before);
    });

    test("buttons and arrow keys move exactly one stop", async ({ page, isMobile }) => {
      test.skip(isMobile, "the buttons are wider-screen controls; phones swipe");
      await page.goto("/");
      await toRow(page, row);
      const scroller = row.scroller(page);
      const stops = await stopsOf(scroller);
      const restsAt = async (i: number) => {
        await expect.poll(() => left(scroller)).toBe(stops[i]);
        // Still there once the glide and any snap are over.
        await page.waitForTimeout(400);
        expect(await left(scroller)).toBe(stops[i]);
      };
      await expect(row.prev(page)).toBeDisabled();
      await row.next(page).click();
      await restsAt(1);
      await row.next(page).click();
      await restsAt(2);
      await row.prev(page).click();
      await restsAt(1);
      await row.region(page).focus();
      await page.keyboard.press("ArrowRight");
      await restsAt(2);
      await page.keyboard.press("ArrowLeft");
      await restsAt(1);
    });

    test("a mouse drag scrolls the row and comes to rest on a stop, opening nothing", async ({ page, isMobile }) => {
      test.skip(isMobile, "the mouse is a desktop input");
      await page.goto("/");
      await toRow(page, row);
      const scroller = row.scroller(page);
      const box = (await scroller.boundingBox())!;
      const y = box.y + 120;
      await page.mouse.move(box.x + 700, y);
      await page.mouse.down();
      for (let x = 700; x >= 300; x -= 40) await page.mouse.move(box.x + x, y);
      await page.mouse.up();
      const stops = await stopsOf(scroller);
      await expect.poll(async () => stops.includes(await left(scroller))).toBe(true);
      expect(await left(scroller)).toBeGreaterThan(0);
      await expect(page.locator("dialog[open]")).toHaveCount(0);
      expect(new URL(page.url()).pathname).toBe("/");
    });
  });
}

/* Every wheel and touch listener on the page is passive, so none can hold
   the scroll back, and nothing cancels a wheel, touch or scrolling key. */
test("no non-passive wheel or touch listeners, and no cancelled scroll input", async ({ page, isMobile }) => {
  test.skip(isMobile, "the wheel and keys are desktop inputs; the listener audit is the same page");
  await page.addInitScript(() => {
    const audit = { listeners: [] as { type: string; passive: unknown; on: string }[], cancelled: [] as string[] };
    (window as unknown as { audit: typeof audit }).audit = audit;
    // The events a listener can hold scrolling back with. (touchend and
    // touchcancel can't, so whether they are passive doesn't matter.)
    const blocking = /^(wheel|mousewheel|touchstart|touchmove)$/;
    const add = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      // Playwright's own injected script listens too; it isn't the site.
      if (blocking.test(type) && !new Error().stack?.includes("InjectedScript")) {
        const passive = typeof options === "object" && options !== null ? options.passive : undefined;
        audit.listeners.push({ type, passive, on: this instanceof Element ? this.tagName : String(this) });
      }
      return add.call(this, type, listener, options);
    };
    const watched = /^(wheel|mousewheel|touchstart|touchmove|touchend|touchcancel)$/;
    const scrollKeys = /^(ArrowUp|ArrowDown|ArrowLeft|ArrowRight|PageUp|PageDown|Home|End| )$/;
    const prevent = Event.prototype.preventDefault;
    Event.prototype.preventDefault = function () {
      if (watched.test(this.type) || (this.type === "keydown" && scrollKeys.test((this as KeyboardEvent).key))) {
        audit.cancelled.push(`${this.type} ${(this as KeyboardEvent).key ?? ""}`.trim());
      }
      return prevent.call(this);
    };
  });
  await page.goto("/");
  // Wheel, swipe and arrow keys over every row, and the page keys.
  for (const row of rows) {
    await toRow(page, row);
    await row.scroller(page).hover({ position: { x: 200, y: 100 } });
    await page.mouse.wheel(0, 200);
    await page.mouse.wheel(300, 0);
    await row.region(page).focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowLeft");
  }
  await page.locator("body").focus();
  for (const key of ["PageDown", "ArrowDown", "Space", "End", "Home"]) await page.keyboard.press(key);
  const audit = await page.evaluate(() => (window as unknown as { audit: { listeners: { passive: unknown }[]; cancelled: string[] } }).audit);
  // The audit saw the page's own listeners (React's, the cloud's).
  expect(audit.listeners.length).toBeGreaterThan(0);
  expect(audit.listeners.filter((l) => l.passive !== true)).toEqual([]);
  expect(audit.cancelled).toEqual([]);
});

test("nav anchors land with the section's heading in full view below the nav", async ({ page, isMobile }) => {
  await page.goto("/");
  const ids = ["projects", "leadership", "experience", "google", "court", "about", "contact"];
  for (const id of ids) {
    if (isMobile) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.getByRole("dialog", { name: "Menu" }).locator(`a[href="/#${id}"]`).click();
    } else {
      await page.getByRole("navigation", { name: "Sections" }).locator(`a[href="/#${id}"]`).click();
    }
    // At rest: the glide is over.
    let last = -1;
    await expect
      .poll(async () => {
        const y = await pageY(page);
        const still = y === last;
        last = y;
        return still;
      }, { intervals: [250] })
      .toBe(true);
    const { heading, nav, bottom, top } = await page.evaluate((id) => {
      const section = document.getElementById(id)!;
      const h = section.querySelector("h2")!.getBoundingClientRect();
      return {
        top: section.getBoundingClientRect().top,
        heading: h.top,
        bottom: h.bottom,
        nav: document.querySelector("header")!.getBoundingClientRect().bottom,
      };
    }, id);
    // The last section may sit higher: the page can't scroll past its end.
    if (id !== "contact") expect(Math.abs(top - nav), id).toBeLessThan(2);
    expect(heading, id).toBeGreaterThanOrEqual(nav);
    expect(bottom, id).toBeLessThanOrEqual(isMobile ? 844 : 900);
  }
});
