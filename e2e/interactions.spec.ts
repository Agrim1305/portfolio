import { expect, test } from "@playwright/test";

test.describe("mobile menu", () => {
  test.skip(({ isMobile }) => !isMobile, "the menu sheet only exists below lg");

  test("opens, closes on Escape and returns focus", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Open menu" });
    await button.click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(button).toBeFocused();
  });

  test("a section link closes the menu and scrolls to the section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "Contact" }).click();
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeHidden();
    await expect
      .poll(() => page.evaluate(() => document.getElementById("contact")!.getBoundingClientRect().top))
      .toBeLessThan(200);
  });
});

test("the sliding keywords read as one label and hold still under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const words = page.locator("[data-keywords]");
  await expect(words.getByText("Software engineer, problem solver, competitor, coach")).toHaveClass(/sr-only/);
  await expect(words.locator("[aria-hidden]")).toHaveCount(1);
  expect(await words.locator(".keywords").evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  await expect(words.getByText("software engineer.").first()).toBeInViewport();
  await expect(words.getByText("problem solver.")).not.toBeInViewport();
});

test("the name runs on one line, and the cloud perches on the Ask card", async ({ page }) => {
  await page.goto("/");
  const h1 = page.getByRole("heading", { level: 1 });
  const lineHeight = await h1.evaluate((el) => parseFloat(getComputedStyle(el).fontSize) * 0.9);
  expect((await h1.boundingBox())!.height).toBeLessThan(lineHeight * 1.5);
  const heading = page.locator("#top").getByText("Ask about Agrim");
  const [cloud, card, titleEnd] = await Promise.all([
    page.locator("#hero-cloud").boundingBox(),
    heading.locator("..").boundingBox(),
    heading.evaluate((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return range.getBoundingClientRect().right;
    }),
  ]);
  // Its lower third over the card's top edge, clear of the card's heading.
  expect((cloud!.y + cloud!.height - card!.y) / cloud!.height).toBeCloseTo(1 / 3, 1);
  expect(cloud!.x).toBeGreaterThan(titleEnd);
  // And on the narrowest phones the whole name still fits.
  await page.setViewportSize({ width: 320, height: 640 });
  const narrow = (await h1.boundingBox())!;
  expect(narrow.x + narrow.width).toBeLessThanOrEqual(320 - 16);
});

test("the cloud is decorative, and holds still under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const cloud = page.locator("#hero-cloud > span");
  await expect(cloud).toHaveAttribute("aria-hidden", "true");
  await expect(cloud.locator("img")).toHaveAttribute("src", "/images/cloud.svg");
  expect(await cloud.locator(".cloud-blink").first().evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
});

test("the cloud's eyes follow the cursor, a small share of the cloud at most", async ({ page, isMobile }) => {
  test.skip(isMobile, "fine pointers only");
  await page.goto("/");
  // Hydrated: the cloud button has taken over from the hero's copy.
  await expect(page.locator("#hero-cloud .cloud")).toHaveCSS("visibility", "hidden");
  const eyes = page.locator("button.dock .cloud-eyes");
  await page.mouse.move(1400, 880);
  await expect.poll(() => eyes.evaluate((el) => getComputedStyle(el).translate)).toBe("2.2% 2%");
  await page.mouse.move(0, 0);
  await expect.poll(() => eyes.evaluate((el) => getComputedStyle(el).translate)).toBe("-2.2% -2%");
});

test.describe("the docked cloud", () => {
  const dock = (page: import("@playwright/test").Page) => page.getByRole("button", { name: "Ask AI about Agrim" });
  const box = async (page: import("@playwright/test").Page, selector: string) =>
    page.locator(selector).evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, right: innerWidth - r.right, bottom: innerHeight - r.bottom };
    });
  const scroll = async (page: import("@playwright/test").Page, y: number) => {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  };

  test("starts as the hero's cloud, glides into the corner, and back up again", async ({ page, isMobile }) => {
    test.skip(isMobile, "the cloud travels on wide screens");
    await page.goto("/");
    // Once the button takes over, the hero's own copy steps aside so there is
    // only ever one cloud, and the button sits exactly where it was.
    await expect(page.locator("#hero-cloud .cloud")).toHaveCSS("visibility", "hidden");
    const slot = await box(page, "#hero-cloud");
    const atTop = await box(page, "button.dock");
    for (const k of ["x", "y", "width", "height"] as const) expect(Math.abs(atTop[k] - slot[k])).toBeLessThan(1);

    const card = page.locator("#ask-card");
    const cardAtTop = await box(page, "#ask-card");

    await scroll(page, 150);
    const midway = await box(page, "button.dock");
    expect(midway.width).toBeLessThan(slot.width);
    expect(midway.width).toBeGreaterThan(92);
    // The Ask card folds into the cloud on the way: smaller, fainter, rounder.
    const folding = await box(page, "#ask-card");
    expect(folding.width).toBeLessThan(cardAtTop.width);
    const opacity = Number(await card.evaluate((el) => getComputedStyle(el).opacity));
    expect(opacity).toBeGreaterThan(0);
    expect(opacity).toBeLessThan(1);
    expect(parseFloat(await card.locator("> div").evaluate((el) => getComputedStyle(el).borderTopLeftRadius))).toBeGreaterThan(26);

    await scroll(page, 2000);
    const docked = await box(page, "button.dock");
    expect(docked.width).toBeCloseTo(92, 0);
    expect(docked.right).toBeCloseTo(24, 0);
    expect(docked.bottom).toBeCloseTo(24, 0);
    // By the dock only the cloud is left.
    await expect(card).toHaveCSS("visibility", "hidden");

    await scroll(page, 0);
    // The cloud moves from Lenis's scroll event, which can land a frame or
    // two later on a busy machine.
    await expect.poll(async () => Math.abs((await box(page, "button.dock")).x - slot.x)).toBeLessThan(1);
    const back = await box(page, "button.dock");
    for (const k of ["x", "y", "width"] as const) expect(Math.abs(back[k] - slot[k])).toBeLessThan(1);
    await expect(card).toHaveCSS("opacity", "1");
    await expect(card).toHaveCSS("transform", "none");
    expect(await box(page, "#ask-card")).toEqual(cardAtTop);
  });

  test("on phones and under reduced motion nothing travels: the cloud fades in once the hero is gone", async ({ page, isMobile }) => {
    if (!isMobile) await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("#hero-cloud .cloud")).toBeVisible();
    await expect(dock(page)).toBeHidden();
    await scroll(page, 2000);
    await expect(dock(page)).toBeVisible();
    expect(await dock(page).evaluate((el) => getComputedStyle(el).transform)).toBe("none");
    const margin = isMobile ? 16 : 24;
    await expect.poll(() => box(page, "button.dock")).toMatchObject({ right: margin, bottom: margin });
  });

  test("under reduced motion, a little way down the card fades out and the cloud fades in, with no travel", async ({ page, isMobile }) => {
    test.skip(isMobile, "phones hand over once the hero is gone");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const card = page.locator("#ask-card");
    await scroll(page, 300);
    await expect(dock(page)).toBeVisible();
    await expect(card).toHaveCSS("opacity", "0");
    await expect(card).toHaveCSS("visibility", "hidden");
    expect(await card.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
    expect(await dock(page).evaluate((el) => getComputedStyle(el.parentElement!).translate)).toBe("none");
    await scroll(page, 0);
    await expect(card).toHaveCSS("opacity", "1");
    await expect(dock(page)).toBeHidden();
  });

  test("is a button the keyboard can reach, and the chat opens above it", async ({ page, isMobile }) => {
    await page.goto("/");
    await scroll(page, 2000);
    await dock(page).focus();
    await expect(dock(page)).toBeFocused();
    await page.keyboard.press("Enter");
    const chat = page.getByRole("dialog", { name: "Ask about Agrim" });
    await expect(chat).toBeVisible();
    await expect(dock(page)).toHaveAttribute("aria-expanded", "true");
    if (!isMobile) {
      const cloud = (await dock(page).boundingBox())!;
      // Once the window has risen into place, it ends above the cloud.
      await expect.poll(async () => (await chat.boundingBox())!.y + (await chat.boundingBox())!.height).toBeLessThanOrEqual(cloud.y);
      await expect(dock(page)).toBeVisible();
    }
    await page.keyboard.press("Escape");
    await expect(chat).toBeHidden();
    await expect(dock(page)).toBeFocused();
  });
});

test.describe("the cloud's moods follow the chat stream", () => {
  // The chat endpoint as a stream the test feeds by hand.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { chunk: (text: string) => void; end: () => void };
      const realFetch = window.fetch;
      window.fetch = async (input, init) => {
        if (!String(input).includes("/api/chat")) return realFetch(input, init);
        let controller!: ReadableStreamDefaultController<Uint8Array>;
        const body = new ReadableStream<Uint8Array>({ start: (c) => void (controller = c) });
        w.chunk = (text) => controller.enqueue(new TextEncoder().encode(text));
        w.end = () => controller.close();
        return new Response(body, { status: 200, headers: { "Content-Type": "text/plain" } });
      };
    });
  });

  for (const reduced of [false, true]) {
    test(reduced ? "under reduced motion, as still eye positions" : "idle, thinking, answering, idle", async ({ page }) => {
      if (reduced) await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/");
      await page.evaluate(() => window.scrollTo({ top: 2000, behavior: "instant" }));
      const cloud = page.getByRole("button", { name: "Ask AI about Agrim" }).locator(".cloud");
      const eyes = cloud.locator(".cloud-eyes");
      const bounce = () => cloud.evaluate((el) => getComputedStyle(el).animationName);
      await expect(cloud).toHaveAttribute("data-mood", "idle");

      await page.keyboard.press("ControlOrMeta+k");
      const chat = page.getByRole("dialog", { name: "Ask about Agrim" });
      await chat.getByRole("textbox", { name: "Ask a question" }).fill("Hi");
      await chat.getByRole("button", { name: "Send message" }).click();
      // Sent, nothing back yet: the eyes glance up and aside.
      await expect(cloud).toHaveAttribute("data-mood", "thinking");
      await expect.poll(() => eyes.evaluate((el) => getComputedStyle(el).translate)).toBe("3% -6%");
      expect(await bounce()).toBe("none");

      // The first words arrive: a small bounce, eyes toward the chat.
      await page.evaluate(() => (window as unknown as { chunk: (t: string) => void }).chunk("Agrim is "));
      await expect(cloud).toHaveAttribute("data-mood", "answering");
      await expect.poll(() => eyes.evaluate((el) => getComputedStyle(el).translate)).toBe("-2% -3%");
      expect(await bounce()).toBe(reduced ? "none" : "cloud-bounce");

      // The stream ends: back to idle.
      await page.evaluate(() => (window as unknown as { chunk: (t: string) => void; end: () => void }).chunk("in Adelaide."));
      await page.evaluate(() => (window as unknown as { end: () => void }).end());
      await expect(chat.getByRole("log")).toContainText("Agrim is in Adelaide.");
      await expect(cloud).toHaveAttribute("data-mood", "idle");
      expect(await bounce()).toBe("none");
    });
  }
});

test.describe("the cloud's faces", () => {
  const face = (page: import("@playwright/test").Page) => page.locator("button.dock .cloud");
  const docked = async (page: import("@playwright/test").Page) => {
    await page.evaluate(() => window.scrollTo({ top: document.getElementById("google")!.offsetTop + 200, behavior: "instant" }));
    await expect(page.getByRole("button", { name: "Ask AI about Agrim" })).toBeVisible();
  };

  test("happy as the chat opens, then back to idle", async ({ page }) => {
    await page.goto("/");
    await docked(page);
    await page.waitForTimeout(1800);
    await page.keyboard.press("ControlOrMeta+k");
    await expect(face(page)).toHaveAttribute("data-mood", "happy");
    await expect.poll(() => face(page).locator(".eye-arc").first().evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    await expect(face(page)).toHaveAttribute("data-mood", "idle", { timeout: 3000 });
  });

  test("surprised, for a beat, as a new section's question appears", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo({ top: document.getElementById("leadership")!.offsetTop, behavior: "instant" }));
    await expect(face(page)).toHaveAttribute("data-mood", "surprised");
    await expect.poll(() => face(page).locator(".eye-round").first().evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    await expect(face(page)).toHaveAttribute("data-mood", "idle", { timeout: 3000 });
  });

  test("a wink at the first hover of a visit, and only the first", async ({ page, isMobile }) => {
    test.skip(isMobile, "hover needs a pointer");
    await page.goto("/");
    await docked(page);
    await page.waitForTimeout(1800);
    const cloud = page.getByRole("button", { name: "Ask AI about Agrim" });
    await cloud.hover();
    await expect(face(page)).toHaveAttribute("data-mood", "wink");
    await page.mouse.move(10, 10);
    await expect(face(page)).toHaveAttribute("data-mood", "idle", { timeout: 3000 });
    await cloud.hover();
    await page.waitForTimeout(300);
    await expect(face(page)).toHaveAttribute("data-mood", "idle");
  });

  test("sleepy after a minute without input, awake as the pointer moves", async ({ page }) => {
    await page.clock.install();
    await page.goto("/");
    // The minute starts once the page has hydrated, which can come after
    // load on a busy machine; keep the clock moving until it has run out.
    await expect
      .poll(async () => {
        await page.clock.fastForward(61_000);
        return face(page).getAttribute("data-mood");
      })
      .toBe("sleepy");
    await page.mouse.move(200, 200);
    await expect(face(page)).toHaveAttribute("data-mood", "idle");
  });

  test("under reduced motion the faces change without blending or squash", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await docked(page);
    await page.keyboard.press("ControlOrMeta+k");
    await expect(face(page)).toHaveAttribute("data-mood", "happy");
    expect(await face(page).locator(".eye-arc").first().evaluate((el) => getComputedStyle(el).transitionDuration)).toBe("0s");
    expect(await face(page).evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0);
  });
});

test("the stack strip can be paused", async ({ page }) => {
  await page.goto("/");
  const pause = page.getByRole("button", { name: "Pause the stack strip" });
  await pause.click();
  await expect(page.getByRole("button", { name: "Play the stack strip" })).toBeVisible();
  const state = await page.locator(".marquee").evaluate((el) => getComputedStyle(el).animationPlayState);
  expect(state).toBe("paused");
});

test.describe("ask Agrim", () => {
  const ANSWER = "I built MetaPlay. It runs live on Render today.";

  // The real route calls the model; tests stream a fixed answer instead.
  test.beforeEach(async ({ page }) => {
    await page.route("/api/chat", (route) =>
      route.fulfill({ status: 200, contentType: "text/plain; charset=utf-8", body: ANSWER }),
    );
  });

  test("a question on the hero card opens the chat with its answer", async ({ page }) => {
    await page.goto("/");
    await page.locator("#top").getByRole("button", { name: "What's Agrim's strongest project?" }).click();
    const chat = page.getByRole("dialog", { name: "Ask about Agrim" });
    await expect(chat).toBeVisible();
    await expect(chat.getByRole("log")).toContainText("What's Agrim's strongest project?");
    await expect(chat.getByRole("log")).toContainText(ANSWER);
    await expect(chat.getByRole("textbox", { name: "Ask a question" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(chat).toBeHidden();
  });

  test("typing on the hero card sends that message in the chat", async ({ page }) => {
    await page.goto("/");
    const input = page.locator("#top").getByRole("textbox", { name: "Ask a question" });
    await input.fill("Where is he based?");
    await input.press("Enter");
    const chat = page.getByRole("dialog", { name: "Ask about Agrim" });
    await expect(chat.getByRole("log")).toContainText("Where is he based?");
    await expect(chat.getByRole("log")).toContainText(ANSWER);
    await expect(input).toHaveValue("");
  });

  test("a wheel over a long conversation scrolls the conversation, not the page", async ({ page, isMobile }) => {
    test.skip(isMobile, "no wheel on touch");
    await page.route("/api/chat", (route) =>
      route.fulfill({ status: 200, contentType: "text/plain; charset=utf-8", body: Array(30).fill(ANSWER).join("\n\n") }),
    );
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");
    const chat = page.getByRole("dialog", { name: "Ask about Agrim" });
    await chat.getByRole("textbox", { name: "Ask a question" }).fill("Hi");
    await chat.getByRole("button", { name: "Send message" }).click();
    const log = chat.getByRole("log");
    await expect.poll(() => log.evaluate((el) => el.scrollHeight - el.clientHeight)).toBeGreaterThan(300);
    await page.waitForTimeout(800);
    const pageY = await page.evaluate(() => window.scrollY);
    const before = await log.evaluate((el) => el.scrollTop);
    await log.hover();
    await page.mouse.wheel(0, -300);
    await expect.poll(() => log.evaluate((el) => el.scrollTop)).toBeLessThan(before - 100);
    expect(await page.evaluate(() => window.scrollY)).toBe(pageY);
  });

  test("a failed request shows the error and rolls back the question", async ({ page }) => {
    await page.route("/api/chat", (route) =>
      route.fulfill({ status: 429, contentType: "application/json", body: JSON.stringify({ error: "Too many messages. Please wait a moment and try again." }) }),
    );
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");
    const chat = page.getByRole("dialog", { name: "Ask about Agrim" });
    await chat.getByRole("textbox", { name: "Ask a question" }).fill("Hello?");
    await chat.getByRole("button", { name: "Send message" }).click();
    await expect(chat.getByRole("alert")).toHaveText("Too many messages. Please wait a moment and try again.");
    await expect(chat.getByRole("log")).not.toContainText("Hello?");
  });

  test("the chat is a small window: the page behind stays scrollable and clickable", async ({ page, isMobile }) => {
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");
    const chat = page.getByRole("dialog", { name: "Ask about Agrim" });
    await expect(chat).toBeVisible();
    await expect(chat).toHaveAttribute("aria-modal", "false");

    const box = (await chat.boundingBox())!;
    if (!isMobile) {
      expect(box.width).toBeCloseTo(380, 0);
      expect(box.height).toBeCloseTo(540, 0);
    }

    // On phones the sheet covers most of the screen; scroll the strip above it.
    await page.mouse.move(40, isMobile ? 90 : 300);
    await page.mouse.wheel(0, 800);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200);
    if (!isMobile) {
      await page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "About" }).click();
      await expect
        .poll(() => page.evaluate(() => document.getElementById("about")!.getBoundingClientRect().top))
        .toBeLessThan(200);
      await expect(chat).toBeVisible();
    }
  });

  test("Escape and the close button return focus to whatever opened it", async ({ page }) => {
    await page.goto("/");
    const question = page.locator("#top").getByRole("button", { name: "Is he eligible to work in Australia?" });
    await question.click();
    const chat = page.getByRole("dialog", { name: "Ask about Agrim" });
    await expect(chat.getByRole("log")).toContainText(ANSWER);
    await page.keyboard.press("Escape");
    await expect(chat).toBeHidden();
    await expect(question).toBeFocused();

    await page.evaluate(() => window.scrollTo(0, 2000));
    const launcher = page.locator("button.dock");
    await launcher.click();
    await chat.getByRole("button", { name: "Close chat" }).click();
    await expect(chat).toBeHidden();
    await expect(launcher).toBeFocused();
  });

  test("Cmd+K toggles the window, even from its own input", async ({ page }) => {
    await page.goto("/");
    const chat = page.getByRole("dialog", { name: "Ask about Agrim" });
    await page.keyboard.press("ControlOrMeta+k");
    await expect(chat).toBeVisible();
    await expect(chat.getByRole("textbox", { name: "Ask a question" })).toBeFocused();
    await page.keyboard.press("Meta+k");
    await expect(chat).toBeHidden();
  });

});

test.describe("selected work", () => {
  test("next and previous move the carousel", async ({ page, isMobile }) => {
    test.skip(isMobile, "the arrows are desktop controls; mobile swipes");
    await page.goto("/");
    const prev = page.getByRole("button", { name: "Previous project" });
    const next = page.getByRole("button", { name: "Next project" });
    await expect(prev).toBeDisabled();
    await next.click();
    await expect(page.getByText("2 / 8")).toBeVisible();
    await expect(prev).toBeEnabled();
  });

  test("quick presses queue: each click or key moves one card, and the ends cap them", async ({ page, isMobile }) => {
    test.skip(isMobile, "the arrows are desktop controls; mobile swipes");
    await page.goto("/");
    const next = page.getByRole("button", { name: "Next project" });
    await next.click();
    await next.click();
    await next.click();
    await expect(page.getByText("4 / 8")).toBeVisible();
    await page.getByRole("region", { name: "Selected work" }).focus();
    for (let i = 0; i < 6; i++) await page.keyboard.press("ArrowRight");
    await expect(page.getByText("8 / 8")).toBeVisible();
    await expect(next).toBeDisabled();
  });

  test("scrolling down moves the cards sideways, then the page carries on", async ({ page, isMobile }) => {
    test.skip(isMobile, "pinned travel is for wide screens; phones swipe");
    await page.goto("/");
    const section = page.locator("#projects");
    const { top, height } = await section.evaluate((el) => ({
      top: el.getBoundingClientRect().top + window.scrollY,
      height: (el as HTMLElement).offsetHeight,
    }));
    // 80svh of scroll per card after the first, plus the pinned screen itself.
    expect(height).toBe(7 * 720 + 900);
    await page.evaluate((y) => window.scrollTo(0, y), top + 7 * 720);
    await expect(page.locator("#projects").getByRole("group", { name: "8 of 8" })).toBeInViewport({ ratio: 0.6 });
    await expect(page.getByText("8 / 8")).toBeVisible();
    await page.evaluate((y) => window.scrollTo(0, y), top + height + 200);
    await expect(section).not.toBeInViewport();
  });

  test("phones swipe the cards sideways and the current card follows", async ({ page, isMobile }) => {
    test.skip(!isMobile, "native swipe is the phone layout");
    await page.goto("/");
    const track = page.locator("#projects .pin-track");
    await track.scrollIntoViewIfNeeded();
    await track.evaluate((el) => el.scrollTo({ left: el.scrollWidth, behavior: "instant" }));
    await expect(page.locator("#projects").getByRole("group", { name: "8 of 8" })).toBeInViewport({ ratio: 0.6 });
  });

  test("Tab onto an off-screen card brings it into view", async ({ page, isMobile }) => {
    test.skip(isMobile, "pinned travel is for wide screens");
    await page.goto("/");
    await page.getByRole("link", { name: "Open case study for Pathfinder" }).focus();
    await expect(page.locator("#projects").getByRole("group", { name: "7 of 8" })).toBeInViewport({ ratio: 0.6 });
  });

  test("the skip link jumps past the cards", async ({ page }) => {
    await page.goto("/");
    const skip = page.locator("#projects").getByRole("link", { name: "Skip to next section" });
    await skip.focus();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("#leadership")).toBeFocused();
    await expect
      .poll(() => page.evaluate(() => document.getElementById("leadership")!.getBoundingClientRect().top))
      .toBeLessThan(200);
  });

  test("the mouse wheel over the cards still scrolls the page", async ({ page, isMobile }) => {
    test.skip(isMobile, "no wheel on touch");
    await page.goto("/");
    const track = page.getByRole("region", { name: "Selected work" });
    await track.scrollIntoViewIfNeeded();
    // At rest first: a wheel that arrives while the page is still gliding
    // comes to rest on the slide it reached, by design.
    await page.waitForTimeout(800);
    const before = await page.evaluate(() => window.scrollY);
    await track.hover();
    await page.mouse.wheel(0, 500);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before + 200);
  });

  test("a card opens its case study in place, with the page's own URL", async ({ page }) => {
    await page.goto("/");
    // The second card sits off to the side until focus brings it into view.
    const open = page.getByRole("link", { name: "Open case study for MetaPlay" });
    await open.focus();
    await expect(open).toBeInViewport();
    await open.click();
    const sheet = page.getByRole("dialog", { name: "MetaPlay" });
    await expect(sheet).toBeVisible();
    await expect(page).toHaveURL(/\/projects\/metaplay$/);
    await expect(sheet).toContainText("Gamers track what they play across scattered notes");

    await sheet.getByRole("button", { name: "Close case study" }).click();
    await expect(sheet).toBeHidden();
    await expect(page).toHaveURL(/\/$/);
  });

  test("keyboard: Enter opens, Escape closes and focus returns to the card", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: "Open case study for Pacific Village Explorer" });
    await link.focus();
    await page.keyboard.press("Enter");
    const sheet = page.getByRole("dialog", { name: "Pacific Village Explorer" });
    await expect(sheet).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(link).toBeFocused();
    await expect(page).toHaveURL(/\/$/);
  });

  test("the case study is a large centred panel, and focus stays inside it", async ({ page, isMobile }) => {
    test.skip(isMobile, "phones get a bottom sheet");
    await page.goto("/");
    const open = page.getByRole("link", { name: "Open case study for Pacific Village Explorer" });
    await open.focus();
    await page.keyboard.press("Enter");
    const panel = page.getByRole("dialog", { name: "Pacific Village Explorer" });
    await expect(panel).toBeVisible();
    await expect
      .poll(() => panel.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return [Math.round(r.width), Math.round(r.height), Math.round(r.left - (innerWidth - r.right))];
      }))
      .toEqual([1100, 828, 0]);
    for (let i = 0; i < 25; i++) await page.keyboard.press("Tab");
    expect(await panel.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  });

  test("arrow keys slide between projects, the address follows, and closing lands on that card", async ({ page, isMobile }) => {
    test.skip(isMobile, "arrow keys are a desktop control");
    await page.goto("/");
    const open = page.getByRole("link", { name: "Open case study for Pacific Village Explorer" });
    await open.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog", { name: "Pacific Village Explorer" })).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("dialog", { name: "MetaPlay" })).toBeVisible();
    await expect(page).toHaveURL(/\/projects\/metaplay$/);
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByRole("dialog", { name: "Pacific Village Explorer" })).toBeVisible();
    await page.getByRole("dialog").getByRole("button", { name: "Next: MetaPlay" }).first().click();
    await expect(page.getByRole("dialog", { name: "MetaPlay" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText("2 / 8")).toBeVisible();
    await expect(page.getByRole("link", { name: "Open case study for MetaPlay" })).toBeFocused();
  });

  test("a wheel over an open case study scrolls the panel, not the page behind", async ({ page, isMobile }) => {
    test.skip(isMobile, "no wheel on touch");
    await page.goto("/");
    const open = page.getByRole("link", { name: "Open case study for Pacific Village Explorer" });
    await open.focus();
    await page.keyboard.press("Enter");
    const body = page.locator(".panel-body");
    await expect(body).toBeVisible();
    await page.waitForTimeout(800);
    const pageY = await page.evaluate(() => window.scrollY);
    await page.mouse.move(720, 600);
    await page.mouse.wheel(0, 400);
    await expect.poll(() => body.evaluate((el) => el.scrollTop)).toBeGreaterThan(100);
    expect(await page.evaluate(() => window.scrollY)).toBe(pageY);
  });

  test("Back closes an open case study", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: "Open case study for Pathfinder" });
    await link.focus();
    await link.click();
    await expect(page.getByRole("dialog", { name: "Pathfinder" })).toBeVisible();
    await page.goBack();
    await expect(page.getByRole("dialog", { name: "Pathfinder" })).toBeHidden();
    await expect(page.locator("#top")).toBeAttached();
  });
});

test("the page never scrolls sideways", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
  });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("Leadership opens the whole merger story as the President story", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Read the whole story" }).click();
  const sheet = page.getByRole("dialog", { name: "President" });
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole("heading", { name: "What I did" })).toBeVisible();
  await expect(page).toHaveURL(/#story-president$/);
  await page.keyboard.press("Escape");
  await expect(sheet).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
});

test.describe("experience", () => {
  test("arrow keys move between roles and show each one", async ({ page }) => {
    await page.goto("/");
    const tabs = page.getByRole("tablist", { name: "Roles" }).getByRole("tab");
    await tabs.first().focus();
    await page.keyboard.press("ArrowDown");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("Led the club revival covered above");
    await page.keyboard.press("End");
    await expect(page.getByRole("tabpanel")).toContainText("Part-time customer service across two stores");
  });

  test("every role opens its full story, and Back closes it", async ({ page }) => {
    await page.goto("/");
    const tabs = page.getByRole("tablist", { name: "Roles" }).getByRole("tab");
    const names = ["Software Engineering Intern, Voice AI", "President", "Assistant Head Coach", "Retail Assistant"];
    const ids = ["aurivox", "president", "coaching", "retail"];
    for (let i = 0; i < 4; i++) {
      await tabs.nth(i).click();
      await page.getByRole("tabpanel").getByRole("button", { name: "Read the full story" }).click();
      const sheet = page.getByRole("dialog", { name: names[i] });
      await expect(sheet).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`#story-${ids[i]}$`));
      await page.goBack();
      await expect(sheet).toBeHidden();
    }
  });

  test("the close button closes a story and returns focus to its button", async ({ page }) => {
    await page.goto("/");
    const read = page.getByRole("tabpanel").getByRole("button", { name: "Read the full story" });
    await read.click();
    const sheet = page.getByRole("dialog", { name: "Software Engineering Intern, Voice AI" });
    await expect(sheet).toContainText("Chosen as one of four interns from eleven shortlisted students");
    await sheet.getByRole("button", { name: "Close" }).click();
    await expect(sheet).toBeHidden();
    await expect(page).toHaveURL(/\/$/);
    await expect(read).toBeFocused();
  });

  test("next and previous role move through the stories", async ({ page, isMobile }) => {
    test.skip(isMobile, "the role buttons are in the wide header");
    await page.goto("/");
    await page.getByRole("tabpanel").getByRole("button", { name: "Read the full story" }).click();
    await page.getByRole("button", { name: "Next role" }).click();
    await expect(page.getByRole("dialog", { name: "President" })).toBeVisible();
    await expect(page).toHaveURL(/#story-president$/);
    await page.getByRole("button", { name: "Previous role" }).click();
    await expect(page.getByRole("dialog", { name: "Software Engineering Intern, Voice AI" })).toBeVisible();
  });

  test("next role and the arrow keys move between stories, and closing lands on that role", async ({ page }) => {
    await page.goto("/");
    const read = page.getByRole("button", { name: "Read the full story" }).filter({ visible: true }).first();
    await read.scrollIntoViewIfNeeded();
    await read.click();
    const story = page.getByRole("dialog", { name: "Software Engineering Intern, Voice AI" });
    await expect(story).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("dialog", { name: "President" })).toBeVisible();
    await expect(page).toHaveURL(/#story-president$/);
    await expect(page.getByRole("dialog")).toContainText("Club of the Year · Adelaide University Sport, 2025");
    await page.getByRole("dialog").getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    const focused = page.locator("[data-expand]").filter({ visible: true }).filter({ hasText: "Read the full story" });
    await expect(focused).toBeFocused();
    await expect(focused).toHaveAccessibleDescription(/President|Adelaide University Tennis Club/);
  });

  test("a story link opens the page with that story showing", async ({ page }) => {
    await page.goto("/#story-coaching");
    const sheet = page.getByRole("dialog", { name: "Assistant Head Coach" });
    await expect(sheet).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("#top")).toBeAttached();
  });
});

test("certifications are four matching cards: the badge or logo in a fixed slot, the name, then Verify", async ({ page, isMobile }) => {
  await page.goto("/");
  const cards = page.locator("#experience ul").last().locator("> li");
  await expect(cards).toHaveCount(4);
  await expect(cards.first().getByRole("img", { name: "Microsoft Certified: Fundamentals badge" })).toBeVisible();
  const boxes = await cards.evaluateAll((els) =>
    els.map((el) => ({ width: el.getBoundingClientRect().width, nameTop: el.querySelector("p")!.getBoundingClientRect().top })),
  );
  // The names line up across a row, whatever mark sits above them.
  const rows = isMobile ? [[0, 1], [2, 3]] : [[0, 1, 2, 3]];
  for (const row of rows) {
    for (const i of row) expect(boxes[i].nameTop).toBeCloseTo(boxes[row[0]].nameTop, 0);
    for (const i of row) expect(boxes[i].width).toBeCloseTo(boxes[row[0]].width, 0);
  }
  for (const card of await cards.all()) {
    await expect(card.getByRole("img")).toBeVisible();
    await expect(card.getByRole("link", { name: /^Verify / })).toHaveAttribute("href", /linkedin\.com/);
  }
});

test.describe("section tops settle into place", () => {
  const topOf = (page: import("@playwright/test").Page, id: string) =>
    page.locator(`#${id}`).evaluate((el) => Math.round(el.getBoundingClientRect().top) || 0);
  const stopAt = (page: import("@playwright/test").Page, id: string, offset: number) =>
    page.locator(`#${id}`).evaluate((el, offset) => {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: "instant" });
    }, offset);

  test("scrolling down, a top just below comes up; scrolling up, a top just above comes down", async ({ page, isMobile }) => {
    test.skip(isMobile, "phones keep native scroll");
    await page.goto("/");
    // Down from further up, stopping with the top 150px below.
    await stopAt(page, "leadership", -600);
    await page.waitForTimeout(300);
    await stopAt(page, "leadership", -150);
    await expect.poll(() => topOf(page, "leadership")).toBe(0);
    // Up from further down, stopping with the top 150px above.
    await stopAt(page, "leadership", 600);
    await page.waitForTimeout(300);
    await stopAt(page, "leadership", 150);
    await expect.poll(() => topOf(page, "leadership")).toBe(0);
  });

  test("it never pulls back against the way the page was going", async ({ page, isMobile }) => {
    test.skip(isMobile, "phones keep native scroll");
    await page.goto("/");
    // Scrolled 150px into Experience on the way down: stay there.
    await stopAt(page, "experience", -300);
    await page.waitForTimeout(300);
    await stopAt(page, "experience", 150);
    await page.waitForTimeout(1000);
    expect(await topOf(page, "experience")).toBe(-150);
  });

  test("deep inside a section taller than the screen nothing moves", async ({ page, isMobile }) => {
    test.skip(isMobile, "phones keep native scroll");
    await page.goto("/");
    expect(await page.locator("#experience").evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThan(900);
    await stopAt(page, "experience", 400);
    await page.waitForTimeout(1000);
    expect(await topOf(page, "experience")).toBe(-400);
  });

  test("phones keep their native scroll", async ({ page, isMobile }) => {
    test.skip(!isMobile, "the phone layout");
    await page.goto("/");
    await stopAt(page, "leadership", 100);
    await page.waitForTimeout(800);
    expect(await topOf(page, "leadership")).toBe(-100);
  });

  test("under reduced motion it jumps instead of gliding", async ({ page, isMobile }) => {
    test.skip(isMobile, "phones keep native scroll");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await stopAt(page, "leadership", -600);
    await page.waitForTimeout(300);
    await stopAt(page, "leadership", -150);
    await page.waitForTimeout(400);
    expect(await topOf(page, "leadership")).toBe(0);
  });
});

test.describe("built on court", () => {
  const current = (page: import("@playwright/test").Page) =>
    page.locator("#court [aria-roledescription='slide']:not([inert])");

  test("arrows, timeline dots and arrow keys move between stops", async ({ page }) => {
    await page.goto("/");
    // The pinned section is taller than the screen; start at its top.
    await page.locator("#court").evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY));
    await expect(current(page)).toHaveAttribute("aria-label", "1 of 8");

    await page.locator("#court").getByRole("button", { name: "Next stop" }).filter({ visible: true }).click();
    await expect(current(page)).toHaveAttribute("aria-label", "2 of 8");

    await page.getByRole("button", { name: "Go to Premier League" }).click();
    await expect(current(page)).toContainText("Premier League");

    await page.getByRole("region", { name: "Built on court" }).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(current(page)).toHaveAttribute("aria-label", "7 of 8");
  });

  test("scrolling down slides the stops sideways, 80svh each", async ({ page, isMobile }) => {
    test.skip(isMobile, "pinned travel is for wide screens; phones swipe");
    await page.goto("/");
    const top = await page.locator("#court").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    await page.evaluate((y) => window.scrollTo(0, y + 3 * 720), top);
    await expect(current(page)).toHaveAttribute("aria-label", "4 of 8");
    await expect(page.locator("#court").getByRole("group", { name: "4 of 8" })).toBeInViewport({ ratio: 0.6 });
    // The reveal must fire for a section many screens tall, or it stays blank.
    await expect(page.locator("#court h2")).toHaveCSS("opacity", "1");
  });

  test("quick taps on Next queue on phones too", async ({ page, isMobile }) => {
    test.skip(!isMobile, "the phone arrows");
    await page.goto("/");
    await page.locator("#court .pin-track").scrollIntoViewIfNeeded();
    const next = page.locator("#court").getByRole("button", { name: "Next stop" }).filter({ visible: true });
    await next.click();
    await next.click();
    await next.click();
    await expect(current(page)).toHaveAttribute("aria-label", "4 of 8");
  });

  test("phones swipe between stops", async ({ page, isMobile }) => {
    test.skip(!isMobile, "native swipe is the phone layout");
    await page.goto("/");
    const track = page.locator("#court .pin-track");
    await track.scrollIntoViewIfNeeded();
    await track.evaluate((el) => el.scrollTo({ left: el.clientWidth, behavior: "instant" }));
    await expect(current(page)).toHaveAttribute("aria-label", "2 of 8");
  });
});

test("Ctrl+K inside a text field is left alone", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("ControlOrMeta+k");
  const input = page.getByRole("dialog", { name: "Ask about Agrim" }).getByRole("textbox", { name: "Ask a question" });
  await input.fill("hello world");
  await input.press("Home");
  const prevented = await input.evaluate((el) => {
    const e = new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true, cancelable: true });
    el.dispatchEvent(e);
    return e.defaultPrevented;
  });
  expect(prevented).toBe(false);
});

for (const [width, height] of [
  [1280, 720],
  [1440, 800],
  [1440, 900],
  [1920, 1080],
]) {
  test.describe(`hero at ${width}x${height}`, () => {
    test.use({ viewport: { width, height } });

    test("the email, GitHub and LinkedIn buttons and the whole Ask card, input included, are on screen before any scroll", async ({ page, isMobile }) => {
      test.skip(isMobile, "sized for desktop screens");
      await page.goto("/");
      const hero = page.locator("#top");
      const card = page.locator("#ask-card > div");
      const targets = [
        hero.getByRole("link", { name: "agrimsh22@gmail.com" }),
        hero.getByRole("link", { name: "GitHub" }),
        hero.getByRole("link", { name: "LinkedIn" }),
        card,
      ];
      // They rise in with the hero; measure where they land.
      await page.evaluate(() => Promise.all(document.getAnimations().filter((a) => a.effect?.getTiming().iterations !== Infinity).map((a) => a.finished)));
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      for (const [i, target] of targets.entries()) {
        const box = (await target.boundingBox())!;
        expect(box.y, `target ${i}`).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height, `target ${i}`).toBeLessThanOrEqual(height);
      }
      await expect(card.getByRole("textbox", { name: "Ask a question" })).toBeInViewport({ ratio: 1 });
    });
  });
}
