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

test.describe("voice", () => {
  // A stand-in voice: reports a word boundary every 150ms and finishes after
  // 1.2s, and records what it was asked to say.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { __spoken: string[] };
      w.__spoken = [];
      window.speechSynthesis.cancel = () => {};
      window.speechSynthesis.speak = (u) => {
        w.__spoken.push(u.text);
        if (!u.text) return;
        let elapsed = 0;
        const timer = setInterval(() => {
          elapsed += 150;
          u.onboundary?.(new Event("boundary") as SpeechSynthesisEvent);
          if (elapsed >= 1200) {
            clearInterval(timer);
            u.onend?.(new Event("end") as SpeechSynthesisEvent);
          }
        }, 150);
      };
    });
  });

  test("starts muted and says nothing until asked", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken)).toEqual([]);
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

test("the cloud is decorative, and holds still under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const cloud = page.locator("#hero-cloud > span");
  await expect(cloud).toHaveAttribute("aria-hidden", "true");
  await expect(cloud.locator("img")).toHaveAttribute("src", "/images/cloud.svg");
  expect(await cloud.locator(".cloud-blink").first().evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  await expect(page.getByRole("button", { name: "Hear me" })).toHaveCount(0);
});

test("the cloud's eyes follow the cursor, a small share of the cloud at most", async ({ page, isMobile }) => {
  test.skip(isMobile, "fine pointers only");
  await page.goto("/");
  const eyes = page.locator("body > button[aria-keyshortcuts] .cloud-eyes");
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
    const atTop = await box(page, "body > button[aria-keyshortcuts]");
    for (const k of ["x", "y", "width", "height"] as const) expect(Math.abs(atTop[k] - slot[k])).toBeLessThan(1);

    await scroll(page, 150);
    const midway = await box(page, "body > button[aria-keyshortcuts]");
    expect(midway.width).toBeLessThan(slot.width);
    expect(midway.width).toBeGreaterThan(92);

    await scroll(page, 2000);
    const docked = await box(page, "body > button[aria-keyshortcuts]");
    expect(docked.width).toBeCloseTo(92, 0);
    expect(docked.right).toBeCloseTo(24, 0);
    expect(docked.bottom).toBeCloseTo(24, 0);

    await scroll(page, 0);
    const back = await box(page, "body > button[aria-keyshortcuts]");
    for (const k of ["x", "y", "width"] as const) expect(Math.abs(back[k] - slot[k])).toBeLessThan(1);
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
    await expect.poll(() => box(page, "body > button[aria-keyshortcuts]")).toMatchObject({ right: margin, bottom: margin });
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
    await page.addInitScript(() => {
      const w = window as unknown as { __spoken: string[] };
      w.__spoken = [];
      window.speechSynthesis.cancel = () => {};
      window.speechSynthesis.speak = (u) => {
        w.__spoken.push(u.text);
        setTimeout(() => u.onend?.(new Event("end") as SpeechSynthesisEvent), 50);
      };
    });
  });

  test("a question on the hero card opens the chat with its answer", async ({ page }) => {
    await page.goto("/");
    await page.locator("#top").getByRole("button", { name: "What's Agrim's strongest project?" }).click();
    const chat = page.getByRole("dialog", { name: "Ask about Agrim" });
    await expect(chat).toBeVisible();
    await expect(chat.getByRole("log")).toContainText("What's Agrim's strongest project?");
    await expect(chat.getByRole("log")).toContainText(ANSWER);
    await expect(chat.getByRole("textbox", { name: "Ask a question" })).toBeFocused();
    // Muted by default: nothing is read aloud.
    expect(await page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken)).toEqual([]);

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

  test("with voice on, the answer is read aloud a sentence at a time", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");
    const chat = page.getByRole("dialog", { name: "Ask about Agrim" });
    const voice = chat.getByRole("button", { name: "Read answers aloud" });
    await voice.click();
    await expect(voice).toHaveAttribute("aria-pressed", "true");

    await chat.getByRole("textbox", { name: "Ask a question" }).fill("What did you build?");
    await chat.getByRole("button", { name: "Send message" }).click();
    await expect(chat.getByRole("log")).toContainText(ANSWER);
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken.filter(Boolean)))
      .toEqual(["I built MetaPlay.", "It runs live on Render today."]);
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
    const launcher = page.locator("body > button[aria-keyshortcuts]");
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

  test("phones swipe between stops", async ({ page, isMobile }) => {
    test.skip(!isMobile, "native swipe is the phone layout");
    await page.goto("/");
    const track = page.locator("#court .pin-track");
    await track.scrollIntoViewIfNeeded();
    await track.evaluate((el) => el.scrollTo({ left: el.clientWidth, behavior: "instant" }));
    await expect(current(page)).toHaveAttribute("aria-label", "2 of 8");
  });
});

test("closing the chat mid-answer stops the voice", async ({ page }) => {
  // A slow stream: the second sentence arrives after the chat has closed.
  await page.route("/api/chat", async (route) => {
    await new Promise((r) => setTimeout(r, 600));
    await route.fulfill({ status: 200, contentType: "text/plain", body: "First sentence. Second sentence." });
  });
  await page.addInitScript(() => {
    const w = window as unknown as { __spoken: string[] };
    w.__spoken = [];
    window.speechSynthesis.cancel = () => {};
    window.speechSynthesis.speak = (u) => {
      w.__spoken.push(u.text);
    };
    localStorage.setItem("voice", "on");
  });
  await page.goto("/");
  await page.keyboard.press("ControlOrMeta+k");
  const chat = page.getByRole("dialog", { name: "Ask about Agrim" });
  await chat.getByRole("textbox", { name: "Ask a question" }).fill("Hi");
  await chat.getByRole("button", { name: "Send message" }).click();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1200);
  expect(await page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken.filter(Boolean))).toEqual([]);
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
