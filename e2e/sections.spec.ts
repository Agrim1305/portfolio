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
    const row = page.locator("#google").getByText("Certificate of Completion").locator("..");
    expect((await row.boundingBox())!.height).toBeCloseTo(56, 0);
    await expect(row.getByRole("link", { name: "Credential" })).toHaveAttribute("target", "_blank");
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

test.describe("Built on court's photo grid", () => {
  const CAPTIONS = [
    "Serving at school, India",
    "With Toni Nadal at the Rafa Nadal Academy",
    "State team, Punjab: 3rd at the nationals",
    "SA Challenge Intervarsity 2024, 1st place, men's tennis",
    "Intervarsity Certificate of Merit, tennis, 2024",
    "Certificate of merit from the Vice-Chancellor, first year",
    "UTL team, Adelaide University",
    "Match play, UTL",
  ];
  const grid = (page: Page) => page.locator(".photo-grid");
  // Brings every photo in, one at a time, so the lazy ones load.
  const loadAll = async (page: Page) => {
    for (const img of await grid(page).locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
  };

  test("the photos, in order, each at its source's aspect ratio within 1%", async ({ page }) => {
    await page.goto("/");
    await expect(grid(page).locator("figcaption")).toHaveText(CAPTIONS);
    await loadAll(page);
    for (const { src, shown, natural } of await grid(page).locator("img").evaluateAll((imgs) =>
      (imgs as HTMLImageElement[]).map((img) => {
        const r = img.getBoundingClientRect();
        return { src: img.currentSrc, shown: r.width / r.height, natural: img.naturalWidth / img.naturalHeight };
      }),
    )) {
      expect(Math.abs(shown / natural - 1), src).toBeLessThan(0.01);
    }
  });

  test("before loading, every photo already has its box, so nothing shifts", async ({ page }) => {
    await page.goto("/");
    const boxes = await grid(page).locator("button").evaluateAll((buttons) =>
      buttons.map((b) => {
        const img = b.querySelector("img")!;
        return { lazy: img.loading, ratio: b.clientWidth / b.clientHeight, attr: Number(img.getAttribute("width")) / Number(img.getAttribute("height")) };
      }),
    );
    for (const { lazy, ratio, attr } of boxes) {
      expect(lazy).toBe("lazy");
      expect(Math.abs(ratio / attr - 1)).toBeLessThan(0.01);
    }
  });

  test("desktop rows are justified: one height per row, full rows fill the width, the last stays left at the row height", async ({ page, isMobile }) => {
    test.skip(isMobile, "phones show two masonry columns");
    await page.goto("/");
    const { width, left, rows } = await grid(page).evaluate((g) => ({
      width: g.getBoundingClientRect().width,
      left: g.getBoundingClientRect().left,
      rows: [...g.querySelectorAll(".photo-row")].map((row) => ({
        last: row.hasAttribute("data-last"),
        boxes: [...row.querySelectorAll("button")].map((b) => b.getBoundingClientRect().toJSON()),
      })),
    }));
    for (const { last, boxes } of rows) {
      for (const b of boxes) expect(b.height).toBeCloseTo(boxes[0].height, 0);
      for (let i = 1; i < boxes.length; i++) expect(boxes[i].left - boxes[i - 1].right).toBeCloseTo(12, 0);
      expect(boxes[0].left).toBeCloseTo(left, 0);
      if (last) {
        expect(boxes[0].height).toBeCloseTo(260, 0);
        expect(boxes.at(-1)!.right).toBeLessThan(left + width - 12);
      } else {
        expect(boxes.at(-1)!.right).toBeCloseTo(left + width, 0);
        expect(Math.abs(boxes[0].height - 260)).toBeLessThan(60);
      }
    }
    const style = await grid(page).locator("button").first().evaluate((b) => {
      const s = getComputedStyle(b);
      return { radius: s.borderTopLeftRadius, transform: s.transform, border: s.borderTopWidth, fit: getComputedStyle(b.querySelector("img")!).objectFit };
    });
    expect(style).toEqual({ radius: "14px", transform: "none", border: "0px", fit: "fill" });
  });

  test("phones show two columns of photos at their own shapes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "the phone layout");
    await page.goto("/");
    // Column positions, counting lefts within 2px of each other as one.
    const columns = () =>
      grid(page)
        .locator("figure")
        .evaluateAll((els) =>
          els
            .map((el) => el.getBoundingClientRect().left)
            .sort((a, b) => a - b)
            .filter((left, i, all) => i === 0 || left - all[i - 1] > 2).length,
        );
    await expect.poll(columns).toBe(2);
  });

  test("a photo opens in a lightbox: arrows and keys step, Escape closes, focus returns to the photo showing", async ({ page }) => {
    await page.goto("/");
    const photos = grid(page).getByRole("button");
    await photos.nth(1).scrollIntoViewIfNeeded();
    await photos.nth(1).click();
    const box = page.getByRole("dialog", { name: CAPTIONS[1] });
    await expect(box).toBeVisible();
    await expect(box.locator("figcaption")).toHaveText(CAPTIONS[1]);
    await expect(box.getByRole("img")).toHaveAttribute("alt", "Agrim as a junior with Toni Nadal");
    // The whole photo: its own shape, not cropped.
    await expect.poll(() => box.getByRole("img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    const shape = await box.getByRole("img").evaluate((img: HTMLImageElement) => {
      const r = img.getBoundingClientRect();
      return r.width / r.height / (img.naturalWidth / img.naturalHeight);
    });
    expect(Math.abs(shape - 1)).toBeLessThan(0.01);

    await box.getByRole("button", { name: "Next photo" }).click();
    await expect(page.getByRole("dialog", { name: CAPTIONS[2] })).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("dialog", { name: CAPTIONS[3] })).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByRole("dialog", { name: CAPTIONS[0] })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(photos.nth(0)).toBeFocused();

    // Enter opens it from the keyboard too.
    await photos.nth(4).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog", { name: CAPTIONS[4] })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(photos.nth(4)).toBeFocused();
  });
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
