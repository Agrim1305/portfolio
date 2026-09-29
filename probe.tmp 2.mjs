import { chromium } from "@playwright/test";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3100/"); await p.waitForTimeout(2500);
await p.screenshot({ path: process.argv[2] + "/hero-final.png" });
await b.close();
