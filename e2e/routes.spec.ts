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

  for (const path of ["/sitemap.xml", "/robots.txt", "/opengraph-image", "/resume.pdf", "/icon.svg"]) {
    test(`${path} is served`, async ({ request }) => {
      expect((await request.get(path)).status()).toBe(200);
    });
  }

  test("the chat endpoint answers (400 for an empty message, 500 without a key)", async ({ request }) => {
    const res = await request.post("/api/chat", { data: { message: "" } });
    expect([400, 500]).toContain(res.status());
    expect(await res.json()).toHaveProperty("error");
  });

  test("an unknown project is a 404", async ({ request }) => {
    expect((await request.get("/projects/not-a-project")).status()).toBe(404);
  });
});
