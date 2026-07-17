import { test, expect } from "@playwright/test";

test.describe("Starring", () => {
  test("star repo -> verify starred page", async ({ page }) => {
    const username = `staruser_${Date.now()}`;
    const password = "password123";

    await page.goto("/signup");
    await page.getByLabel(/username/i).fill(username);
    await page.getByLabel(/email/i).fill(`${username}@example.com`);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page.getByText(/account created/i)).toBeVisible({ timeout: 10000 });

    const repoName = `starrepo_${Date.now()}`;
    await page.goto("/repos/new");
    await page.getByLabel(/repository name/i).fill(repoName);
    await page.getByRole("button", { name: /create repository/i }).click();
    await expect(page).toHaveURL(/\/repos\//);

    const starButton = page.getByRole("button", { name: /star/i });
    if (await starButton.isVisible()) {
      await starButton.click();
      await expect(page.getByRole("button", { name: /starred/i })).toBeVisible();
    }

    await page.getByRole("link", { name: /starred/i }).first().click();
    await expect(page).toHaveURL(/\/starred/);
    await expect(page.getByText(repoName)).toBeVisible();
  });
});
