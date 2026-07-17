import { test, expect } from "@playwright/test";

test.describe("Profile", () => {
  const testUser = {
    username: `profileuser_${Date.now()}`,
    email: `profileuser_${Date.now()}@example.com`,
    password: "password123",
  };

  test("profile edit -> change password", async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel(/username/i).fill(testUser.username);
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill(testUser.password);
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page.getByText(/account created/i)).toBeVisible({ timeout: 10000 });

    await page.goto("/profile");
    await expect(page.getByRole("heading", { name: /profile/i })).toBeVisible();

    await page.getByRole("link", { name: /edit profile/i }).click();
    await expect(page).toHaveURL(/\/edit/);

    const bioInput = page.getByLabel(/bio/i);
    await bioInput.fill("Updated bio text");
    await page.getByRole("button", { name: /save changes/i }).click();
    await expect(page.getByText(/profile updated/i)).toBeVisible();

    await page.getByRole("link", { name: /password/i }).click();
    await expect(page).toHaveURL(/\/password/);

    await page.getByLabel(/current password/i).fill(testUser.password);
    await page.getByLabel(/^new password/i).fill("newpassword456");
    await page.getByLabel(/confirm new password/i).fill("newpassword456");
    await page.getByRole("button", { name: /change password/i }).click();
    await expect(page.getByText(/password changed/i)).toBeVisible();
  });
});
