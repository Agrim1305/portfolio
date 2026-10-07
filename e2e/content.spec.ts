import fs from "fs";
import path from "path";
import { expect, test, type Page } from "@playwright/test";
import { projects } from "../src/lib/projects";

// Aris says hello the first time the cloud docks, and the bubble can sit over
// what a test clicks. It has its own tests (aris.spec.ts); here it has
// already been seen this visit.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("hello", "1"));
});

/* Content lock. The redesign may move copy around but must not change it.
   `CAPTURE_BASELINE=1` records every string, image alt and link on the site
   (run once, against the pre-redesign build). The normal run checks that each
   recorded item is still reachable: on the page, or inside a sheet opened by
   an element marked `data-expand`. Deliberate removals go in the allowlist,
   each with a reason. */

const BASELINE = path.join(__dirname, "content-baseline.json");
const ALLOWLIST = path.join(__dirname, "content-allowlist.json");
const routes = ["/", ...projects.map((p) => `/projects/${p.slug}`)];

type Snapshot = { text: string[]; alts: string[]; hrefs: string[] };

// Runs in the browser. Text nodes are joined with spaces and the space before
// punctuation dropped, so "use it" + "." and a sentence split across list items
// normalise to the same string.
function snapshot(): Snapshot & { haystack: string } {
  const norm = (s: string) =>
    s.replace(/\s+/g, " ").replace(/ ([,.;:!?)])/g, "$1").trim();
  const skip = (n: Node) =>
    !!n.parentElement?.closest("script, style, noscript, template, [aria-hidden='true']");
  const textOf = (root: Node) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const parts: string[] = [];
    while (walker.nextNode()) if (!skip(walker.currentNode)) parts.push(walker.currentNode.nodeValue ?? "");
    return norm(parts.join(" "));
  };

  const text = new Set<string>();
  document
    .querySelectorAll("p, h1, h2, h3, h4, li, dt, dd, figcaption, a, button, span, summary, label")
    .forEach((el) => {
      if (el.closest("[aria-hidden='true']")) return;
      const block = /^(P|H\d|LI|DT|DD|FIGCAPTION)$/.test(el.tagName);
      const leaf = [...el.childNodes].every((c) => c.nodeType === Node.TEXT_NODE);
      if (!block && !leaf) return;
      const t = textOf(el);
      if (/[\p{L}\p{N}]/u.test(t)) text.add(t);
    });

  const alts = [...document.querySelectorAll("img[alt]")]
    .map((i) => i.getAttribute("alt")!.trim())
    .filter(Boolean);
  const hrefs = [...document.querySelectorAll("a[href]")].map((a) =>
    a.getAttribute("href")!,
  );
  return { text: [...text], alts, hrefs, haystack: textOf(document.body) };
}

// Everything reachable on a route: the page, plus each sheet it can open.
async function reachable(page: Page, route: string) {
  await page.goto(route);
  const base = await page.evaluate(snapshot);
  const all = { ...base, haystack: [base.haystack] };
  const triggers = page.locator("[data-expand]");
  for (let i = 0; i < (await triggers.count()); i++) {
    const trigger = triggers.nth(i);
    if (!(await trigger.isVisible())) continue;
    // Pinned cards sit off to the side until focus brings them into view.
    await trigger.focus();
    await expect(trigger).toBeInViewport();
    await trigger.click();
    await page.locator("dialog[open]").first().waitFor();
    const s = await page.evaluate(snapshot);
    all.haystack.push(s.haystack);
    all.alts.push(...s.alts);
    all.hrefs.push(...s.hrefs);
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    // The sheet shrinks back into its card; clicks land on the page only after.
    await page.waitForFunction(() => !(document as { activeViewTransition?: unknown }).activeViewTransition);
  }
  return all;
}

test.describe("content lock", () => {
  test.skip(({ isMobile }) => isMobile, "copy is the same at every width");

  if (process.env.CAPTURE_BASELINE) {
    test("capture baseline", async ({ page }) => {
      const out: Record<string, Snapshot> = {};
      for (const route of routes) {
        await page.goto(route);
        const { text, alts, hrefs } = await page.evaluate(snapshot);
        out[route] = {
          text: text.sort(),
          alts: [...new Set(alts)].sort(),
          hrefs: [...new Set(hrefs)].sort(),
        };
      }
      fs.writeFileSync(BASELINE, JSON.stringify(out, null, 2) + "\n");
    });
    return;
  }

  const baseline: Record<string, Snapshot> = JSON.parse(fs.readFileSync(BASELINE, "utf8"));
  const allow: Record<string, string> = JSON.parse(fs.readFileSync(ALLOWLIST, "utf8"));

  for (const route of routes) {
    test(`nothing removed from ${route}`, async ({ page }) => {
      const now = await reachable(page, route);
      const hay = now.haystack.join(" \n ");
      const missing = [
        ...baseline[route].text.filter((t) => !hay.includes(t)),
        ...baseline[route].alts.filter((a) => !now.alts.includes(a)).map((a) => `alt: ${a}`),
        ...baseline[route].hrefs.filter((h) => !now.hrefs.includes(h)).map((h) => `href: ${h}`),
      ].filter((m) => !(m in allow));
      expect(missing, "copy, alt text or links missing from the page").toEqual([]);
    });
  }

  // Approved in the final round; locked word for word.
  test("the tennis intro is the approved copy", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#court p").first()).toHaveText(
      "I've competed since I was a kid in India, from a top-90 national junior ranking to the Rafa Nadal Academy and university tennis in Australia. It taught me the habits I bring to work: training when no one's watching, competing under pressure, and coaching others to get better.",
    );
  });

  test("the hero name is unchanged", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Agrim Sharma");
  });
});
