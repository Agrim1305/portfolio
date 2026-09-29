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
      return {
        slide: box(slide),
        text: [...slide.querySelectorAll("h3, p")].map((el) => ({ text: el.textContent!.slice(0, 40), ...box(el) })),
        viewport: { width: window.innerWidth, height: window.innerHeight },
      };
    },
    { id, i },
  );
}

const inside = (inner: Box, outer: Box) =>
  inner.top >= outer.top - 0.5 &&
  inner.bottom <= outer.bottom + 0.5 &&
  inner.left >= outer.left - 0.5 &&
  inner.right <= outer.right + 0.5;

for (const [width, height] of [
  [1280, 720],
  [1440, 800],
  [1440, 900],
  [1920, 1080],
]) {
  test.describe(`pinned at ${width}x${height}`, () => {
    test.use({ viewport: { width, height } });

    for (const id of ["projects", "court"]) {
      test(`every ${id} slide and its text fit on screen`, async ({ page, isMobile }) => {
        test.skip(isMobile, "pinned travel is for wide screens");
        await page.goto("/");
        for (let i = 0; i < 8; i++) {
          const { slide, text, viewport } = await pinnedSlide(page, id, i);
          const screen = { top: 0, left: 0, bottom: viewport.height, right: viewport.width };
          expect(slide.bottom, `slide ${i + 1} bottom`).toBeLessThanOrEqual(viewport.height);
          for (const line of text) {
            expect(inside(line, slide) && inside(line, screen), `slide ${i + 1}: "${line.text}"`).toBe(true);
          }
        }
      });
    }
  });
}
