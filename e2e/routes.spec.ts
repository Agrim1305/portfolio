import { expect, test } from "@playwright/test";
import { projects } from "../src/lib/projects";

test.describe("routes", () => {
  test.skip(({ isMobile }) => isMobile, "server responses are the same at every width");

  for (const path of ["/", ...projects.map((p) => `/projects/${p.slug}`)]) {
    test(`${path} renders`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }

  for (const path of ["/sitemap.xml", "/robots.txt", "/opengraph-image", "/resume.pdf", "/icon1.svg", "/icon2.png", "/apple-icon.png"]) {
    test(`${path} is served`, async ({ request }) => {
      expect((await request.get(path)).status()).toBe(200);
    });
  }

  test("the chat endpoint answers (400 for an empty message, 500 without a key)", async ({ request }) => {
    const res = await request.post("/api/chat", { data: { message: "" } });
    expect([400, 500]).toContain(res.status());
    expect(await res.json()).toHaveProperty("error");
  });

  test("the chat endpoint takes 20 messages per IP in ten minutes, then asks the sender to wait", async ({ request }) => {
    // Empty messages never reach the model. An address of its own, so no other
    // test shares the bucket.
    const headers = { "x-forwarded-for": `203.0.113.${Date.now() % 250}` };
    for (let i = 0; i < 20; i++) {
      expect((await request.post("/api/chat", { headers, data: { message: "" } })).status()).not.toBe(429);
    }
    const res = await request.post("/api/chat", { headers, data: { message: "" } });
    expect(res.status()).toBe(429);
    expect(Number(res.headers()["retry-after"])).toBeGreaterThan(590);
    expect((await res.json()).error).toContain("Try again in 10 minutes");
  });

  test("an unknown project is a 404", async ({ request }) => {
    expect((await request.get("/projects/not-a-project")).status()).toBe(404);
  });
});
