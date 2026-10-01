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

test("Built on court: each mapped stop shows its photo with the number in the corner; ITF and the coaching stop keep the number", async ({ page }) => {
  await page.goto("/");
  const slides = page.locator("#court [aria-roledescription='slide']");
  const expected: (string | null)[] = [
    "Agrim holding a trophy and medal",
    "Agrim as a junior with Toni Nadal",
    null,
    null, // the coaching photo, until consent is confirmed
    "Agrim shaking hands with the other club's leaders",
    "Club committee holding the Club of the Year shield and cheque",
    "Agrim hitting a forehand",
    "Adelaide University tennis team at the net",
  ];
  for (const [i, alt] of expected.entries()) {
    const slide = slides.nth(i);
    if (alt) {
      await expect(slide.locator("img")).toHaveAttribute("alt", alt);
      await expect(slide.locator("span.font-mono")).toHaveText(String(i + 1).padStart(2, "0"));
    } else {
      await expect(slide.locator("img")).toHaveCount(0);
    }
  }
  await expect(page.getByRole("region", { name: "Photos" }).locator("figcaption")).toHaveText([
    "SA Challenge Intervarsity 2024, 1st place, men's tennis",
    "Intervarsity Certificate of Merit, tennis, 2024",
    "Certificate of merit from the Vice-Chancellor, first year",
  ]);
});

test.describe("Selected work link pills", () => {
  test("every card shows its links as pills, or its private note", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("#projects [aria-roledescription='slide']");
    for (const [i, project] of projects.entries()) {
      const card = cards.nth(i);
      for (const link of project.links) {
        const pill = card.getByRole("link", { name: link.label });
        await expect(pill).toHaveAttribute("href", link.url);
        await expect(pill).toHaveAttribute("target", "_blank");
        await expect(pill).toHaveAttribute("rel", "noopener noreferrer");
      }
      if (project.privateNote) await expect(card.getByText(project.privateNote)).toBeAttached();
    }
    // ARS is live, with no source link.
    const ars = cards.nth(projects.findIndex((p) => p.slug === "adelaide-rising-stars"));
    await expect(ars).toContainText("Live · Freelance, 2026");
    await expect(ars.getByRole("link", { name: "Live site" })).toHaveAttribute("href", "https://arstennisacademy.com.au");
    await expect(ars.getByRole("link", { name: "Source" })).toHaveCount(0);
  });

  test("a pill opens its link in a new tab and never the case study", async ({ page, context }) => {
    await context.route(/github\.com|sydney\.edu\.au|onrender\.com|arstennisacademy/, (route) => route.fulfill({ body: "ok" }));
    await page.goto("/");
    const card = page.locator("#projects [aria-roledescription='slide']").first();
    const [tab] = await Promise.all([context.waitForEvent("page"), card.getByRole("link", { name: "Source" }).click()]);
    expect(tab.url()).toContain("github.com");
    await tab.close();
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(page).toHaveURL(/\/$/);
  });

  test("the keyboard reaches the pills, with a clear focus ring", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("region", { name: "Selected work" }).focus();
    await page.keyboard.press("Tab");
    const pill = page.locator("#projects [aria-roledescription='slide']").first().getByRole("link", { name: "Source" });
    await expect(pill).toBeFocused();
    await expect(pill).toHaveCSS("outline-style", "solid");
    await expect(pill).toHaveCSS("outline-color", "rgb(255, 91, 46)");
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
