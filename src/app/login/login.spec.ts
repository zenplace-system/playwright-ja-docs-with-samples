import { test, expect } from "@playwright/test";

test.describe("ログイン機能のテスト", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("ログインページが正しく表示される", async ({ page }) => {
    await expect(page.locator("text=ZEN PLACE")).toBeVisible();

    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator('input[name="login_id"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test("入力フィールドに値を入力するとボタンが有効になる", async ({ page }) => {
    await expect(page.locator('button[type="submit"]')).toBeDisabled();

    await page.fill('input[name="login_id"]', "testuser");
    await expect(page.locator('button[type="submit"]')).toBeDisabled();

    await page.fill('input[name="login_id"]', "");
    await page.fill('input[name="password"]', "password123");
    await expect(page.locator('button[type="submit"]')).toBeDisabled();

    await page.fill('input[name="login_id"]', "testuser");
    await page.fill('input[name="password"]', "password123");
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test("APIリクエストをモックして成功時の動作をテスト", async ({ page }) => {
    const dialogPromise = page.waitForEvent("dialog");

    await page.route(
      "http://127.0.0.1:8001/employee-auth/v1/auth/login",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            token: {
              access_token: "test_token",
              refresh_token: "test_refresh",
            },
          }),
        });
      }
    );

    await page.fill('input[name="login_id"]', "testuser");
    await page.fill('input[name="password"]', "password123");

    await page.locator('button[type="submit"]').click({ force: true });

    const dialog = await dialogPromise;
    expect(dialog.message()).toContain("ログインに成功しました");
    await dialog.accept();

    await expect(page).toHaveURL("/phoenix", { timeout: 5000 });
  });

  test.skip("実際のAPIを使用したログイン成功テスト", async ({ page }) => {
    await page.fill('input[name="login_id"]', "10004");
    await page.fill('input[name="password"]', "00000");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/phoenix");
  });

  test("APIリクエストをモックして失敗時の動作をテスト", async ({ page }) => {
    await page.route(
      "http://127.0.0.1:8001/employee-auth/v1/auth/login",
      async (route) => {
        await route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({
            error: {
              code: "invalid_credentials",
              message: "ログインに失敗しました",
            },
          }),
        });
      }
    );

    await page.fill('input[name="login_id"]', "wronguser");
    await page.fill('input[name="password"]', "wrongpass");

    await page.locator('button[type="submit"]').click({ force: true });

    await expect(page.locator("text=ログインに失敗しました")).toBeVisible({
      timeout: 5000,
    });

    await expect(page).toHaveURL("/login");
  });

  test("ネットワークエラー時の動作をテスト", async ({ page }) => {
    await page.route(
      "http://127.0.0.1:8001/employee-auth/v1/auth/login",
      async (route) => {
        await route.abort("failed");
      }
    );

    await page.fill('input[name="login_id"]', "testuser");
    await page.fill('input[name="password"]', "password123");

    await page.locator('button[type="submit"]').click({ force: true });

    await expect(
      page.locator("text=サーバーとの通信に失敗しました")
    ).toBeVisible({ timeout: 5000 });

    await expect(page).toHaveURL("/login");
  });
});
