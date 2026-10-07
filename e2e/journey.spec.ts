import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { chapters } from "../src/lib/journey";

// The hello bubble has its own tests (aris.spec.ts); here it has been seen.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("hello", "1"));
});

const media = chapters.flatMap((c) => c.media);
// The region takes focus and the arrow keys; the row inside it scrolls.
const region = (page: Page) => page.getByRole("region", { name: "A glimpse of my journey" });
const track = (page: Page) => region(page).locator(".journey-track");
const toJourney = (page: Page) =>
  page.locator(".journey").evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "instant" }));
const playing = (page: Page) => track(page).locator("video").evaluateAll((vs) => (vs as HTMLVideoElement[]).filter((v) => !v.paused).length);
// Where the track rests, and where each of its stops starts.
const position = (page: Page) =>
  track(page).evaluate((el) => ({
    left: el.scrollLeft,
    stops: [...el.querySelectorAll<HTMLElement>("[data-stop]")]
      .filter((s) => getComputedStyle(s).scrollSnapAlign.includes("start"))
      .map((s) => Math.round(s.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft)),
  }));

test("a region with a heading per chapter, and a button per medium that says what it shows", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 2, name: "A glimpse of my journey." })).toBeVisible();
  await expect(region(page).getByRole("heading", { level: 3 })).toHaveText(chapters.map((c) => c.heading));
  const buttons = track(page).getByRole("button");
  await expect(buttons).toHaveCount(media.length);
  for (const [i, m] of media.entries()) {
    await expect(buttons.nth(i)).toHaveAccessibleName(m.kind === "video" ? `${m.alt}, video` : m.alt);
  }
});

test("nothing is cropped: every box and every loaded picture is within 1% of its source's ratio", async ({ page }) => {
  await page.goto("/");
  await toJourney(page);
  const boxes = await track(page).locator(".journey-media").evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width / el.getBoundingClientRect().height));
  for (const [i, m] of media.entries()) expect(Math.abs(boxes[i] / (m.width / m.height) - 1), m.src).toBeLessThan(0.01);
  // The photos themselves, once each has been brought into view and loaded.
  for (const img of await track(page).locator("img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    const ratio = await img.evaluate((el: HTMLImageElement) => {
      const r = el.getBoundingClientRect();
      return r.width / r.height / (el.naturalWidth / el.naturalHeight);
    });
    expect(Math.abs(ratio - 1)).toBeLessThan(0.01);
  }
});

test("tall media share one height and paired ones one half-height; phones show one row at one height", async ({ page, isMobile }) => {
  await page.goto("/");
  const heights = (selector: string) =>
    track(page).locator(selector).evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().height * 10) / 10));
  const tall = await heights(".journey-tall");
  const half = await heights(".journey-half");
  for (const h of tall) expect(h).toBeCloseTo(tall[0], 0);
  for (const h of half) expect(h).toBeCloseTo(half[0], 0);
  const card = (await track(page).locator(".journey-card").first().boundingBox())!;
  if (isMobile) {
    expect(tall[0]).toBeCloseTo(260, 0);
    expect(half[0]).toBeCloseTo(260, 0);
    // Pairs come apart: every medium sits on one line.
    const tops = await track(page).locator(".journey-item").evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
    expect(new Set(tops).size).toBe(1);
    expect(card.width).toBeCloseTo(220, 0);
  } else {
    // A column: a tall medium and its caption, or two halves, their captions
    // and the 16px gap.
    expect(tall[0]).toBeCloseTo(430, 0);
    expect(half[0] * 2 + 16 + 80).toBeCloseTo(tall[0] + 40, 0);
    expect(card.height).toBeCloseTo(tall[0] + 40, 0);
    expect(card.width).toBeCloseTo(260, 0);
  }
});

test("buttons and the arrow keys move one column", async ({ page, isMobile }) => {
  test.skip(isMobile, "phones swipe; the buttons are for wider screens");
  await page.goto("/");
  await toJourney(page);
  const next = page.locator(".journey").getByRole("button", { name: "Next", exact: true });
  const prev = page.locator(".journey").getByRole("button", { name: "Previous", exact: true });
  await expect(prev).toBeDisabled();
  const { stops } = await position(page);
  for (const to of [1, 2]) {
    await next.click();
    await expect.poll(async () => Math.round((await position(page)).left)).toBe(stops[to]);
  }
  await prev.click();
  await expect.poll(async () => Math.round((await position(page)).left)).toBe(stops[1]);
  await region(page).focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(async () => Math.round((await position(page)).left)).toBe(stops[2]);
  await page.keyboard.press("ArrowLeft");
  await expect.poll(async () => Math.round((await position(page)).left)).toBe(stops[1]);
});

test("a vertical wheel over the track scrolls the page, not the track", async ({ page, isMobile }) => {
  test.skip(isMobile, "no wheel on touch");
  await page.goto("/");
  await toJourney(page);
  const y = await page.evaluate(() => window.scrollY);
  const box = (await track(page).boundingBox())!;
  await page.mouse.move(box.x + 300, box.y + 200);
  await page.mouse.wheel(0, 400);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(y + 100);
  expect((await position(page)).left).toBe(0);
});

test("every clip loops, muted, while a quarter of the strip is on screen, and all stop when it leaves", async ({ page }) => {
  const clips = media.filter((m) => m.kind === "video").length;
  await page.goto("/");
  await page.waitForTimeout(600);
  expect(await playing(page)).toBe(0);
  // A sliver of the strip on screen is not enough.
  await page.locator(".journey").evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - innerHeight + 60, behavior: "instant" }));
  await page.waitForTimeout(600);
  expect(await playing(page)).toBe(0);
  await toJourney(page);
  await expect.poll(() => playing(page)).toBe(clips);
  expect(await track(page).locator("video").evaluateAll((vs) => (vs as HTMLVideoElement[]).every((v) => v.muted && v.loop))).toBe(true);
  // Every pill says so.
  await expect(track(page).getByText("Playing")).toHaveCount(clips);
  // Moving along the strip doesn't stop any of them.
  await track(page).evaluate((el) => el.scrollBy({ left: 600, behavior: "instant" }));
  await page.waitForTimeout(500);
  expect(await playing(page)).toBe(clips);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(() => playing(page)).toBe(0);
});

test("with Save-Data on, nothing plays", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "connection", { value: { saveData: true } }));
  await page.goto("/");
  await toJourney(page);
  await page.waitForTimeout(800);
  expect(await playing(page)).toBe(0);
  await expect(track(page).getByText("Playing")).toHaveCount(0);
});

test("under reduced motion nothing plays, fades or lifts", async ({ page, isMobile }) => {
  test.skip(isMobile, "stepping by button");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await toJourney(page);
  for (let i = 0; i < 4; i++) {
    await page.locator(".journey").getByRole("button", { name: "Next", exact: true }).click();
    await page.waitForTimeout(300);
    expect(await playing(page)).toBe(0);
  }
  const opacities = await track(page).locator("[data-stop]").evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
  expect(new Set(opacities)).toEqual(new Set(["1"]));
  const media = track(page).locator(".journey-media").first();
  await media.hover();
  await expect(media).toHaveCSS("transform", "none");
});

test("columns well ahead sit back at 55%", async ({ page, isMobile }) => {
  test.skip(isMobile, "the desktop track");
  await page.goto("/");
  await toJourney(page);
  const opacities = await track(page)
    .locator("[data-stop]")
    .evaluateAll((els) => els.filter((el) => getComputedStyle(el).scrollSnapAlign.includes("start")).map((el) => Number(getComputedStyle(el).opacity)));
  expect(opacities.slice(0, 4)).toEqual([1, 1, 1, 1]);
  expect(opacities[5]).toBeCloseTo(0.55, 2);
});

test("full clips load only when the lightbox opens, and play there muted, with controls to unmute", async ({ page }) => {
  const full: string[] = [];
  page.on("request", (r) => r.url().includes("-full.mp4") && full.push(r.url()));
  await page.goto("/");
  await toJourney(page);
  const clip = track(page).getByRole("button", { name: /clay court, video/ });
  await clip.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  expect(full).toEqual([]);
  await clip.click();
  const box = page.getByRole("dialog", { name: "On clay" });
  await expect(box).toBeVisible();
  const video = box.locator("video");
  await expect(video).toHaveAttribute("src", "/videos/court/v1-clay-rally-india-full.mp4");
  expect(await video.evaluate((v: HTMLVideoElement) => ({ controls: v.controls, muted: v.muted }))).toEqual({ controls: true, muted: true });
  await expect.poll(() => full.length).toBeGreaterThan(0);
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
  // The strip behind waits.
  await expect.poll(() => playing(page)).toBe(0);
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  await expect(clip).toBeFocused();
});

test("when quiet, the lightbox clip waits for play, and plays with sound", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await toJourney(page);
  await track(page).getByRole("button", { name: /clay court, video/ }).click();
  const video = page.getByRole("dialog", { name: "On clay" }).locator("video");
  await expect(video).toHaveAttribute("src", /-full\.mp4$/);
  await page.waitForTimeout(800);
  expect(await video.evaluate((v: HTMLVideoElement) => ({ paused: v.paused, muted: v.muted, controls: v.controls }))).toEqual({
    paused: true,
    muted: false,
    controls: true,
  });
});

test("chapter 03 opens with the first season in Australia, a full column to itself, and no column is half empty", async ({ page, isMobile }) => {
  test.skip(isMobile, "phones show one row, no columns");
  await page.goto("/");
  const columns = await region(page).evaluate((el) => {
    const card = [...el.querySelectorAll(".journey-card")].find((c) => c.textContent?.includes("03 / Adelaide"))!;
    const out: { srcs: string[]; tall: boolean }[] = [];
    for (let n = card.nextElementSibling; n; n = n.nextElementSibling) {
      out.push({
        srcs: [...n.querySelectorAll<HTMLElement>("[data-src]")].map((m) => m.dataset.src!.split("/").pop()!),
        tall: n.querySelector(".journey-tall") !== null,
      });
    }
    return out;
  });
  expect(columns).toEqual([
    { srcs: ["10-local-tournament-four.webp"], tall: true },
    { srcs: ["09-unisport-nationals-team.webp"], tall: true },
    { srcs: ["11-nationals-serve.webp"], tall: true },
    { srcs: ["01-utl-team.webp", "02-utl-playing.webp"], tall: false },
    { srcs: ["v4-adelaide-hitting-loop.mp4", "13-coaching-kids.webp"], tall: false },
  ]);
});

test("the coaching photo is captioned by its title alone, and lines up with the rest", async ({ page }) => {
  await page.goto("/");
  const captions = track(page).locator("figcaption");
  const coaching = track(page).locator("figure", { has: page.locator('[data-src="/images/experience/13-coaching-kids.webp"]') }).locator("figcaption");
  await expect(coaching.locator("p")).toHaveText(["Coaching juniors"]);
  // Every caption keeps the same height, with or without its second line,
  // and each sits straight under its medium.
  const boxes = await captions.evaluateAll((els) =>
    els.map((el) => ({ h: el.getBoundingClientRect().height, gap: el.getBoundingClientRect().top - el.previousElementSibling!.getBoundingClientRect().bottom })),
  );
  expect(new Set(boxes.map((b) => b.h)).size).toBe(1);
  expect(new Set(boxes.map((b) => Math.round(b.gap))).size).toBe(1);
});

test("photos open in the lightbox too, and the arrows step through every medium", async ({ page }) => {
  await page.goto("/");
  await toJourney(page);
  await track(page).getByRole("button", { name: media[0].alt, exact: true }).click();
  await expect(page.getByRole("dialog", { name: media[0].title })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("dialog", { name: media[1].title })).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("dialog", { name: media.at(-1)!.title })).toBeVisible();
});

test("nothing in the journey shifts as it loads", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const w = window as unknown as { shifts: number };
    w.shifts = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as { value: number; sources: { node?: Node }[] }[]) {
        if (entry.sources.some((s) => s.node && document.querySelector(".journey")!.contains(s.node))) w.shifts += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  await toJourney(page);
  await page.waitForTimeout(2500);
  expect(await page.evaluate(() => (window as unknown as { shifts: number }).shifts)).toBe(0);
});

test("passes axe, with the lightbox and a clip open too", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await toJourney(page);
  const scan = async () => {
    // The lightbox still fades in under reduced motion; let it finish.
    await page.evaluate(() =>
      Promise.all(document.getAnimations().filter((a) => a.effect?.getComputedTiming().endTime !== Infinity).map((a) => a.finished.catch(() => {}))),
    );
    return (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).include(".journey").analyze()).violations;
  };
  expect(await scan()).toEqual([]);
  await track(page).getByRole("button", { name: /clay court, video/ }).click();
  await expect(page.locator("dialog[open]")).toBeVisible();
  expect(await scan()).toEqual([]);
});
