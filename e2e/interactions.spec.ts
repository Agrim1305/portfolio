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

test.describe("avatar voice", () => {
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

  test("Hear me reads the intro and remembers the choice", async ({ page }) => {
    await page.goto("/");
    const hear = page.getByRole("button", { name: "Hear me" });
    await expect(hear).toHaveAttribute("aria-pressed", "false");
    await hear.click();
    await expect(hear).toHaveAttribute("aria-pressed", "true");

    const spoken = await page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken);
    expect(spoken.join(" ")).toContain("Final-year Computer Science student at Adelaide University");

    await expect(hear).toHaveAttribute("aria-pressed", "false", { timeout: 5000 });
    expect(await page.evaluate(() => localStorage.getItem("voice"))).toBe("on");
  });
});

test("the sliding keywords read as one label and hold still under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const words = page.getByLabel("Software engineer, problem solver, competitor, coach");
  await expect(words.locator("[aria-hidden]")).toHaveCount(1);
  expect(await words.locator(".keywords").evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  await expect(words.getByText("software engineer.").first()).toBeInViewport();
  await expect(words.getByText("problem solver.")).not.toBeInViewport();
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

  test("the hero bar opens the chat and a suggested question gets an answer", async ({ page }) => {
    await page.goto("/");
    await page.locator("#top").getByRole("button", { name: "Ask AI about Agrim" }).filter({ visible: true }).click();
    const chat = page.getByRole("dialog", { name: "Ask about Agrim" });
    await expect(chat).toBeVisible();
    await expect(chat.getByRole("textbox", { name: "Ask a question" })).toBeFocused();

    await chat.getByRole("button", { name: "What's Agrim's strongest project?" }).click();
    await expect(chat.getByRole("log")).toContainText(ANSWER);
    // Muted by default: nothing is read aloud.
    expect(await page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken)).toEqual([]);

    await page.keyboard.press("Escape");
    await expect(chat).toBeHidden();
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

  test("the launcher appears once the hero scrolls away", async ({ page }) => {
    await page.goto("/");
    const launcher = page.locator("body > button[aria-keyshortcuts]");
    await expect(launcher).toBeHidden();
    await page.evaluate(() => window.scrollTo(0, 2000));
    await expect(launcher).toBeVisible();
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

  test("the track scrolls sideways and the current card follows", async ({ page }) => {
    await page.goto("/");
    const track = page.getByRole("region", { name: "Selected work" });
    await track.scrollIntoViewIfNeeded();
    await track.evaluate((el) => el.scrollTo({ left: el.scrollWidth, behavior: "instant" }));
    await expect(track.getByRole("group", { name: "8 of 8" })).toBeInViewport({ ratio: 0.6 });
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
    await page.getByRole("link", { name: "Read the case study for MetaPlay" }).click();
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
    const link = page.getByRole("link", { name: "Read the case study for Pacific Village Explorer" });
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
    await page.getByRole("link", { name: "Read the case study for Pathfinder" }).click();
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

test("the merger story opens as a sheet", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Read it" }).click();
  const sheet = page.getByRole("dialog", { name: "Running our side of a two-university club merger" });
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole("heading", { name: "What I did" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(sheet).toBeHidden();
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

  test("only the role with a longer story offers it", async ({ page }) => {
    await page.goto("/");
    const tabs = page.getByRole("tablist", { name: "Roles" }).getByRole("tab");
    await tabs.first().click();
    await expect(page.getByRole("tabpanel").getByRole("button", { name: "Read the full story" })).toHaveCount(0);
    await tabs.nth(1).click();
    await page.getByRole("tabpanel").getByRole("button", { name: "Read the full story" }).click();
    await expect(page.getByRole("dialog", { name: "Running our side of a two-university club merger" })).toBeVisible();
  });
});

test.describe("built on court", () => {
  const current = (page: import("@playwright/test").Page) =>
    page.locator("#court [aria-roledescription='slide']:not([inert])");

  test("arrows, timeline dots and arrow keys move between stops", async ({ page }) => {
    await page.goto("/");
    await page.locator("#court").scrollIntoViewIfNeeded();
    await expect(current(page)).toHaveAttribute("aria-label", "1 of 8");

    await page.locator("#court").getByRole("button", { name: "Next stop" }).filter({ visible: true }).click();
    await expect(current(page)).toHaveAttribute("aria-label", "2 of 8");

    await page.getByRole("button", { name: "Go to Premier League" }).click();
    await expect(current(page)).toContainText("Premier League");

    await page.getByRole("region", { name: "Built on court" }).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(current(page)).toHaveAttribute("aria-label", "7 of 8");
  });

  test("a swipe moves to the next stop", async ({ page, isMobile }) => {
    test.skip(!isMobile, "touch only");
    await page.goto("/");
    const region = page.getByRole("region", { name: "Built on court" });
    await region.scrollIntoViewIfNeeded();
    await region.dispatchEvent("pointerdown", { pointerType: "touch", clientX: 300, clientY: 400 });
    await region.dispatchEvent("pointerup", { pointerType: "touch", clientX: 120, clientY: 400 });
    await expect(current(page)).toHaveAttribute("aria-label", "2 of 8");
  });

  test("the mouse wheel over the stops scrolls the page, not the stops", async ({ page, isMobile }) => {
    test.skip(isMobile, "no wheel on touch");
    await page.goto("/");
    const region = page.getByRole("region", { name: "Built on court" });
    await region.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => window.scrollY);
    await region.hover();
    await page.mouse.wheel(0, 500);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before + 200);
    await expect(current(page)).toHaveAttribute("aria-label", "1 of 8");
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
