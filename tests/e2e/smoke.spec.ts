import { test, expect } from "@playwright/test";

test("top page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
});

test("attack button advances turn and logs result", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#hp-display")).toContainText("Player HP: 20");
  await expect(page.locator("#hp-display")).toContainText("Enemy HP: 15");

  const initialLogText = (await page.locator("#log").textContent()) ?? "";
  await page.click("#attack-button");

  await expect
    .poll(async () => (await page.locator("#log").textContent()) ?? "")
    .not.toBe(initialLogText);
  await expect(page.locator("#log")).toContainText("Turn 1");
});

test("reset button restores initial state", async ({ page }) => {
  await page.goto("/");
  await page.click("#attack-button");
  await page.click("#reset-button");
  await expect(page.locator("#hp-display")).toContainText("Player HP: 20");
  await expect(page.locator("#hp-display")).toContainText("Turn: 0");
});
