import { expect, test, type Page } from "@playwright/test";
import { projects } from "../src/lib/projects";

// The hello bubble has its own tests (aris.spec.ts); here it has been seen.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("hello", "1"));
});

const SECTIONS = ["projects", "leadership", "experience", "google", "court", "about", "contact"];
const LABELS = ["Work", "Leadership", "Experience", "Google", "Tennis", "About", "Contact"];
const scrollTo = (page: Page, id: string, by = 0) =>
  page.locator(`#${id}`).evaluate((el, by) => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + by, behavior: "instant" }), by);

test.describe("nav", () => {
  test("lists the sections in page order, Work and Tennis included, and follows the page", async ({ page, isMobile }) => {
    test.skip(isMobile, "the desktop nav; phones have the menu");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Sections" });
    await expect(nav.getByRole("link")).toHaveText(LABELS);
    await expect(nav.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/#projects");
    await expect(nav.getByRole("link", { name: "Tennis" })).toHaveAttribute("href", "/#court");
    const tops = await page.evaluate((ids) => ids.map((id) => document.getElementById(id)!.getBoundingClientRect().top), SECTIONS);
    expect([...tops].sort((a, b) => a - b)).toEqual(tops);

    await scrollTo(page, "court", 100);
    await expect(nav.getByRole("link", { name: "Tennis" })).toHaveAttribute("aria-current", "true");
    await nav.getByRole("link", { name: "Work" }).click();
    await expect.poll(() => page.evaluate(() => document.getElementById("projects")!.getBoundingClientRect().top)).toBeLessThan(150);
    await expect(nav.getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "true");
  });

  test("the phone menu lists the same seven and fits a 375 by 667 screen", async ({ page, isMobile }) => {
    test.skip(!isMobile, "the menu is the phone nav");
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu.getByRole("navigation").getByRole("link")).toHaveText(LABELS);
    await expect(menu.getByRole("button", { name: "Ask AI about Agrim" })).toBeInViewport({ ratio: 1 });
  });

  test("the wordmark is 25% larger, centred in a header of the same height", async ({ page, isMobile }) => {
    await page.goto("/");
    const mark = page.getByRole("link", { name: "Agrim Sharma, back to top" });
    await expect(mark).toHaveCSS("font-size", "25px");
    const header = (await page.locator("header").first().boundingBox())!;
    expect(header.height).toBeCloseTo(isMobile ? 65 : 96, 0);
    const box = (await mark.boundingBox())!;
    expect(Math.abs(box.y + box.height / 2 - (header.y + (isMobile ? 64 : 96) / 2))).toBeLessThan(1.5);
  });
});

test("Leadership shows only its award photo; the four club photos follow the beats in the President story", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#leadership img")).toHaveCount(1);
  await expect(page.locator("#leadership img")).toHaveAttribute("alt", "Adelaide University Sport Club of the Year cheque presentation");

  await page.getByRole("button", { name: "Read the whole story" }).click();
  const sheet = page.getByRole("dialog", { name: "President" });
  await expect(sheet).toBeVisible();
  const gallery = sheet.locator("figure");
  await expect(gallery).toHaveCount(4);
  await expect(gallery.locator("figcaption")).toHaveText([
    "Club of the Year, Adelaide University Sport, November 2025",
    "Special general meeting on the merger",
    "Social tennis nights",
    "Presenting club awards at the AGM",
  ]);
  const lastBeat = (await sheet.getByRole("heading", { name: "Result" }).locator("..").boundingBox())!;
  for (const box of await gallery.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().top))) {
    expect(box).toBeGreaterThan(lastBeat.y + lastBeat.height);
  }
});

test.describe("the merger beats", () => {
  const beats = (page: Page) => page.locator("#leadership ol > li");

  test("three equal boxes, the initial in the corner clear of the text, each held to its lines with a fade", async ({ page, isMobile }) => {
    await page.goto("/");
    await scrollTo(page, "leadership", 900);
    const boxes = await beats(page).evaluateAll((els) =>
      els.map((li) => {
        const p = li.querySelector("p")!;
        const letter = li.querySelector("span[aria-hidden]")!;
        const label = li.querySelector("h4")!.getBoundingClientRect();
        const box = li.getBoundingClientRect();
        const style = getComputedStyle(li);
        const l = letter.getBoundingClientRect();
        const t = p.getBoundingClientRect();
        return {
          box: { x: box.x, top: box.top, width: box.width, height: box.height, right: box.right },
          padding: style.padding,
          border: style.borderWidth,
          lines: Math.round(p.clientHeight / parseFloat(getComputedStyle(p).lineHeight)),
          cut: p.scrollHeight > p.clientHeight + 1,
          fades: getComputedStyle(p).maskImage !== "none",
          letterSize: parseFloat(getComputedStyle(letter).fontSize),
          letterClear: l.bottom <= t.top && l.left >= label.right,
          letterInside: l.right <= box.right - parseFloat(style.paddingRight) + 1 && l.top >= box.top + parseFloat(style.paddingTop) - 1,
        };
      }),
    );
    expect(boxes.map((b) => b.padding)).toEqual(Array(3).fill(boxes[0].padding));
    expect(boxes.map((b) => b.border)).toEqual(Array(3).fill(boxes[0].border));
    for (const b of boxes) {
      expect(b.letterSize).toBe(120);
      expect(b.letterClear).toBe(true);
      expect(b.letterInside).toBe(true);
      // Held to six lines on phones and seven from md up; only a beat that
      // is cut short fades, so no line is cut without one.
      expect(b.lines).toBeLessThanOrEqual(isMobile ? 6 : 7);
      expect(b.fades).toBe(b.cut);
    }
    expect(boxes.some((b) => b.cut)).toBe(true);
    if (isMobile) {
      // Stacked.
      for (let i = 1; i < 3; i++) expect(boxes[i].box.top).toBeGreaterThan(boxes[i - 1].box.top + boxes[i - 1].box.height);
    } else {
      // One row of equal columns, one top edge, one height.
      for (const b of boxes) {
        expect(b.box.width).toBeCloseTo(boxes[0].box.width, 0);
        expect(b.box.height).toBeCloseTo(boxes[0].box.height, 0);
        expect(b.box.top).toBeCloseTo(boxes[0].box.top, 0);
      }
    }
    // One way into the whole story, under the grid.
    const read = page.locator("#leadership").getByRole("button", { name: "Read the whole story" });
    await expect(read).toHaveCount(1);
    const last = boxes.at(-1)!.box;
    expect((await read.boundingBox())!.y).toBeGreaterThan(last.top + last.height);
    expect((await read.boundingBox())!.x).toBeCloseTo(boxes[0].box.x, 0);
  });

  test("the whole story holds every beat in full, in the same equal boxes", async ({ page, isMobile }) => {
    await page.goto("/");
    await page.locator("#leadership").getByRole("button", { name: "Read the whole story" }).click();
    const sheet = page.getByRole("dialog", { name: "President" });
    await expect(sheet).toBeVisible();
    const boxes = await sheet.locator("ol > li").evaluateAll((els) =>
      els.map((li) => {
        const p = li.querySelector("p")!;
        const r = li.getBoundingClientRect();
        return { width: r.width, height: r.height, full: p.scrollHeight <= p.clientHeight + 1, fades: getComputedStyle(p).maskImage !== "none" };
      }),
    );
    for (const b of boxes) {
      expect(b.full).toBe(true);
      expect(b.fades).toBe(false);
      expect(b.width).toBeCloseTo(boxes[0].width, 0);
      if (!isMobile) expect(b.height).toBeCloseTo(boxes[0].height, 0);
    }
  });
});

test.describe("Google bento", () => {
  const tiles = (page: Page) => page.locator("#google figure");

  test("the mentor visit is the large tile, two rows tall, with the sign above the selfie beside it; captions sit on the photos", async ({ page, isMobile }) => {
    test.skip(isMobile, "the desktop bento");
    await page.goto("/");
    await scrollTo(page, "google");
    await expect(tiles(page).locator("figcaption")).toHaveText([
      "Visiting my mentor at Google Sydney",
      "Google Sydney office",
      "With Bart at Google Sydney",
    ]);
    const [big, sign, selfie] = await tiles(page).evaluateAll((els) => els.map((el) => el.getBoundingClientRect().toJSON()));
    expect(big.right).toBeLessThan(sign.left);
    expect(sign.left).toBeCloseTo(selfie.left, 0);
    expect(sign.bottom).toBeLessThan(selfie.top);
    expect(big.top).toBeCloseTo(sign.top, 0);
    expect(big.bottom).toBeCloseTo(selfie.bottom, 0);
    // Each caption overlays the foot of its own photo.
    for (const [tile, caption] of await tiles(page).evaluateAll((els) =>
      els.map((el) => [el.getBoundingClientRect().toJSON(), el.querySelector("figcaption")!.getBoundingClientRect().toJSON()]),
    )) {
      expect(caption.bottom).toBeCloseTo(tile.bottom, 0);
      expect(caption.left).toBeCloseTo(tile.left, 0);
    }
  });

  test("the credential is one small pill under the description's first column", async ({ page, isMobile }) => {
    await page.goto("/");
    await scrollTo(page, "google");
    const pill = page.locator("#google").getByRole("link", { name: /Certificate of Completion Credential$/ });
    await expect(pill).toHaveAttribute("href", "https://www.linkedin.com/feed/update/urn:li:activity:7376092779933835264/");
    await expect(pill).toHaveAttribute("target", "_blank");
    const [link, text, thumb] = await Promise.all([
      pill.boundingBox(),
      page.locator("#google p").last().boundingBox(),
      pill.locator("img").boundingBox(),
    ]);
    expect(link!.height).toBeCloseTo(36, 0);
    expect(thumb!.height).toBeCloseTo(24, 0);
    expect(link!.x).toBeCloseTo(text!.x, 0);
    expect(link!.y).toBeGreaterThan(text!.y + text!.height);
    // No full-width row any more: from lg up it fits under the first column.
    if (!isMobile) expect(link!.width).toBeLessThan(text!.width / 2);
    await expect(page.locator("#google").getByText("Certificate of Completion", { exact: true })).toHaveCount(1);
  });

  test("phones stack the tiles, large tile first", async ({ page, isMobile }) => {
    test.skip(!isMobile, "the phone layout");
    await page.goto("/");
    const boxes = await tiles(page).evaluateAll((els) => els.map((el) => el.getBoundingClientRect().toJSON()));
    expect(await tiles(page).nth(0).locator("figcaption").textContent()).toBe("Visiting my mentor at Google Sydney");
    for (let i = 1; i < boxes.length; i++) {
      expect(boxes[i].top).toBeGreaterThan(boxes[i - 1].bottom);
      expect(boxes[i].left).toBeCloseTo(boxes[0].left, 0);
      expect(boxes[i].width).toBeCloseTo(boxes[0].width, 0);
    }
  });
});

test("Built on court's stops show only their outline number, no photos", async ({ page }) => {
  await page.goto("/");
  const slides = page.locator("#court [aria-roledescription='slide']");
  await expect(slides).toHaveCount(8);
  await expect(slides.locator("img")).toHaveCount(0);
  for (let i = 0; i < 8; i++) {
    await expect(slides.nth(i).locator("span[aria-hidden]").first()).toHaveText(String(i + 1).padStart(2, "0"));
  }
});

test.describe("Selected work buttons", () => {
  const cards = (page: Page) => page.locator("#projects [aria-roledescription='slide']");

  test("one row per card: Open case study first, then Source, then the live link, all one height", async ({ page }) => {
    await page.goto("/");
    for (const [i, project] of projects.entries()) {
      const card = cards(page).nth(i);
      const names = ["Open case study", ...project.links.map((l) => l.label)];
      const buttons = card.getByRole("link").filter({ hasText: new RegExp(`^(${names.join("|")})`) });
      await expect(buttons).toHaveCount(names.length);
      const boxes = await buttons.evaluateAll((els) => els.map((el) => ({ text: el.textContent!.replace(/ for .*/, "").trim(), box: el.getBoundingClientRect().toJSON() })));
      expect(boxes.map((b) => b.text)).toEqual(names);
      for (const { box } of boxes) expect(box.height).toBeCloseTo(boxes[0].box.height, 0);
      // Side by side wherever they share a line, and a line only breaks when
      // the next one would not fit.
      for (let j = 1; j < boxes.length; j++) {
        const [a, b] = [boxes[j - 1].box, boxes[j].box];
        if (Math.abs(a.top - b.top) < 1) expect(b.left).toBeGreaterThan(a.right);
        else expect(b.top).toBeGreaterThan(a.bottom);
      }
      if (project.privateNote) await expect(card.getByText(project.privateNote)).toBeAttached();
    }
    const metaplay = cards(page).nth(projects.findIndex((p) => p.slug === "metaplay"));
    await expect(metaplay.getByRole("link", { name: "Live demo" })).toHaveAttribute("target", "_blank");
  });

  test("a link opens in a new tab and never the case study; Open case study still opens it", async ({ page, context }) => {
    await context.route(/github\.com|sydney\.edu\.au|onrender\.com|arstennisacademy/, (route) => route.fulfill({ body: "ok" }));
    await page.goto("/");
    const card = cards(page).first();
    const [tab] = await Promise.all([context.waitForEvent("page"), card.getByRole("link", { name: "Source" }).click()]);
    expect(tab.url()).toContain("github.com");
    await tab.close();
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await card.getByRole("link", { name: /Open case study/ }).click();
    await expect(page.locator("dialog[open]")).toHaveCount(1);
    await expect(page).toHaveURL(/\/projects\/pacific-village-explorer$/);
  });

  test("the keyboard reaches them in order, with a clear focus ring", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("region", { name: "Selected work" }).focus();
    await page.keyboard.press("Tab");
    const card = cards(page).first();
    await expect(card.getByRole("link", { name: /Open case study/ })).toBeFocused();
    await page.keyboard.press("Tab");
    const source = card.getByRole("link", { name: "Source" });
    await expect(source).toBeFocused();
    await expect(source).toHaveCSS("outline-style", "solid");
    await expect(source).toHaveCSS("outline-color", "rgb(255, 91, 46)");
  });

  test("the case study header keeps the same order and height", async ({ page }) => {
    await page.goto("/projects/metaplay");
    const links = page.getByRole("main").getByRole("link").filter({ hasText: /^(Source|Live demo)/ });
    const boxes = await links.evaluateAll((els) => els.map((el) => ({ text: el.textContent!.trim(), box: el.getBoundingClientRect().toJSON() })));
    expect(boxes.map((b) => b.text)).toEqual(["Source", "Live demo"]);
    expect(boxes[1].box.height).toBeCloseTo(boxes[0].box.height, 0);
    expect(boxes[1].box.top).toBeCloseTo(boxes[0].box.top, 0);
  });
});

test("case studies show the extra captures framed and whole", async ({ page }) => {
  await page.goto("/projects/pathfinder");
  const screen = page.getByRole("img", { name: /pathfinder\.py in debug mode/ });
  await expect(screen).toBeVisible();
  const { natural, shown } = await screen.evaluate((img: HTMLImageElement) => ({
    natural: img.naturalWidth / img.naturalHeight,
    shown: img.getBoundingClientRect().width / img.getBoundingClientRect().height,
  }));
  expect(shown).toBeCloseTo(natural, 2);
});

test("the favicon is the AS mark: SVG, a 32px PNG and a 180px apple-touch icon", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("link[rel='icon'][type='image/svg+xml']")).toHaveAttribute("href", /^\/icon1\.svg/);
  await expect(page.locator("link[rel='icon'][sizes='32x32']")).toHaveAttribute("href", /^\/icon2\.png/);
  await expect(page.locator("link[rel='apple-touch-icon'][sizes='180x180']")).toHaveAttribute("href", /^\/apple-icon\.png/);
});
