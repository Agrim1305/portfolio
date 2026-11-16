import { expect, test, type Page } from "@playwright/test";
import { projects } from "../src/lib/projects";

// The hello bubble has its own tests (aris.spec.ts); here it has been seen.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("hello", "1"));
});

const SECTIONS = ["projects", "experience", "leadership", "mentorship", "court", "about", "contact"];
const LABELS = ["Work", "Experience", "Leadership", "Mentorship", "Tennis", "About", "Contact"];
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

test("every section opens with a label, a headline and numbers that keep to their columns", async ({ page }) => {
  await page.goto("/");
  for (const id of SECTIONS) await expect(page.locator(`#${id} header h2`)).toHaveCount(1);
  // A long value ("Premier League") wraps before it runs into the next one.
  const values = page.locator("section header dd");
  expect(await values.count()).toBeGreaterThan(15);
  for (const fits of await values.evaluateAll((els) => els.map((el) => el.scrollWidth <= el.parentElement!.clientWidth + 1))) {
    expect(fits).toBe(true);
  }
});

test("a cover's stack word fits inside its cover at every width", async ({ page }) => {
  await page.goto("/");
  const words = page.locator("#projects article > div:first-child > span");
  expect(await words.count()).toBeGreaterThan(0);
  for (const fits of await words.evaluateAll((els) =>
    els.map((el) => el.getBoundingClientRect().right <= el.parentElement!.getBoundingClientRect().right),
  )) {
    expect(fits).toBe(true);
  }
});

test("Leadership shows only its award photo; the four club photos follow the beats in the President story", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#leadership img")).toHaveCount(1);
  await expect(page.locator("#leadership img")).toHaveAttribute("alt", "Adelaide University Sport Club of the Year cheque presentation");

  await page.getByRole("button", { name: "Read the whole story" }).click();
  const sheet = page.getByRole("dialog", { name: "President" });
  await expect(sheet).toBeVisible();
  // The award photo opens the story, whole, with its caption under it; the
  // other four follow the beats.
  const figures = sheet.locator("figure");
  await expect(figures.first().locator("figcaption")).toHaveText("Club of the Year · Adelaide University Sport, 2025");
  // Never under the title: above it on a phone, beside it from lg up.
  const opener = (await figures.first().boundingBox())!;
  const title = (await sheet.getByRole("heading", { name: "President" }).boundingBox())!;
  expect(title.y >= opener.y + opener.height - 1 || title.x + title.width <= opener.x + 1).toBe(true);
  const gallery = sheet.locator("figure:not(.panel-hero)");
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

  test("the section holds no beats, only the one way into the whole story", async ({ page }) => {
    await page.goto("/");
    await expect(beats(page)).toHaveCount(0);
    await expect(page.locator("#leadership").getByRole("button", { name: "Read the whole story" })).toHaveCount(1);
  });

  test("the whole story stacks every beat in full, at the panel's width, 32px apart", async ({ page }) => {
    await page.goto("/");
    await page.locator("#leadership").getByRole("button", { name: "Read the whole story" }).click();
    const sheet = page.getByRole("dialog", { name: "President" });
    await expect(sheet).toBeVisible();
    const { list, boxes } = await sheet.locator("ol").evaluate((ol) => ({
      list: ol.getBoundingClientRect().toJSON(),
      boxes: [...ol.children].map((li) => {
        const p = li.querySelector("p")!;
        const r = li.getBoundingClientRect();
        return {
          label: li.querySelector("h4")!.textContent,
          left: r.left,
          width: r.width,
          top: r.top,
          bottom: r.bottom,
          gap: p.getBoundingClientRect().top - li.querySelector("h4")!.getBoundingClientRect().bottom,
          // The text's width in ch, the width of a "0" in its own font.
          measure: (() => {
            const zero = document.createElement("span");
            zero.textContent = "0";
            p.append(zero);
            const ch = zero.getBoundingClientRect().width;
            zero.remove();
            return p.getBoundingClientRect().width / ch;
          })(),
          full: p.scrollHeight <= p.clientHeight + 1,
          fades: getComputedStyle(p).maskImage !== "none",
        };
      }),
    }));
    expect(boxes.map((b) => b.label)).toEqual(["Situation and task", "What I did", "Result"]);
    for (const [i, b] of boxes.entries()) {
      // One column, the panel's width, in order, 32px apart.
      expect(b.left).toBeCloseTo(list.left, 0);
      expect(b.width).toBeCloseTo(list.width, 0);
      if (i) expect(b.top - boxes[i - 1].bottom).toBeCloseTo(32, 0);
      expect(b.gap).toBeLessThanOrEqual(16);
      // The text at a reading measure.
      expect(b.measure).toBeLessThanOrEqual(70.5);
      expect(b.full).toBe(true);
      expect(b.fades).toBe(false);
    }
  });
});

test.describe("Google bento", () => {
  const tiles = (page: Page) => page.locator("#mentorship figure");

  test("the mentor visit is the large tile, two rows tall, with the sign above the selfie beside it; captions sit on the photos", async ({ page, isMobile }) => {
    test.skip(isMobile, "the desktop bento");
    await page.goto("/");
    await scrollTo(page, "mentorship");
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
    await scrollTo(page, "mentorship");
    const pill = page.locator("#mentorship").getByRole("link", { name: /Certificate of Completion Credential$/ });
    await expect(pill).toHaveAttribute("href", "https://www.linkedin.com/feed/update/urn:li:activity:7376092779933835264/");
    await expect(pill).toHaveAttribute("target", "_blank");
    const [link, text, thumb] = await Promise.all([
      pill.boundingBox(),
      // The text block, four paragraphs in two columns.
      page.locator("#mentorship div:has(> p)").last().boundingBox(),
      pill.locator("img").boundingBox(),
    ]);
    expect(link!.height).toBeCloseTo(36, 0);
    expect(thumb!.height).toBeCloseTo(24, 0);
    expect(link!.x).toBeCloseTo(text!.x, 0);
    expect(link!.y).toBeGreaterThan(text!.y + text!.height);
    // No full-width row any more: from lg up it fits under the first column.
    if (!isMobile) expect(link!.width).toBeLessThan(text!.width / 2);
    await expect(page.locator("#mentorship").getByText("Certificate of Completion", { exact: true })).toHaveCount(1);
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
    // Off to the side until focus brings it into view.
    const card = cards(page).nth(projects.findIndex((p) => p.slug === "pacific-village-explorer"));
    await card.getByRole("link", { name: /Open case study/ }).focus();
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
  await page.goto("/projects/pacific-village-explorer");
  const screen = page.getByRole("img", { name: /Adaptation Methods layer open/ });
  await expect(screen).toBeVisible();
  // Lazy-loaded below the fold on phones: measure it once it has loaded.
  await screen.scrollIntoViewIfNeeded();
  await expect.poll(() => screen.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
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
