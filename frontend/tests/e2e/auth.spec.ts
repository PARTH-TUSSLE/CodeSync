import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `testuser_${Date.now()}@example.com`,
    password: "password123",
  };

  test("signup -> login -> create repo -> create issue", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: /create account/i })).toBeVisible();

    await page.getByLabel(/username/i).fill(testUser.username);
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill(testUser.password);
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page.getByText(/account created/i)).toBeVisible({ timeout: 10000 });

    await page.goto("/repos/new");

    const repoName = `testrepo_${Date.now()}`;
    await page.getByLabel(/repository name/i).fill(repoName);
    await page.getByRole("button", { name: /create repository/i }).click();

    await expect(page).toHaveURL(/\/repos\//);
    await expect(page.getByRole("heading", { name: repoName })).toBeVisible();

    await page.getByRole("link", { name: /view all/i }).first().click();
    await expect(page).toHaveURL(/\/issues$/);
    await page.getByRole("link", { name: /new issue/i }).click();
    await expect(page).toHaveURL(/\/issues\/new/);

    await page.getByLabel(/title/i).fill("Test issue");
    await page.getByLabel(/description/i).fill("This is a test issue");
    await page.getByRole("button", { name: /create issue/i }).click();

    await expect(page.getByText("Test issue")).toBeVisible({ timeout: 10000 });
  });
});
