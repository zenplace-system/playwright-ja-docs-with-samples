import { test, expect } from "@playwright/test";

test.describe("サーバーアクションを使用したログイン機能のテスト", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login-server-action");
    await page.waitForLoadState("networkidle");
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

  test("サーバーアクションのAPIリクエストをモックして成功時の動作をテスト", async ({ page }) => {
    // ダイアログを待機
    const dialogPromise = page.waitForEvent("dialog");

    // サーバーアクションからのAPIリクエストをインターセプト
    await page.route(
      "http://127.0.0.1:8001/employee-auth/v1/auth/login",
      async (route) => {
        const request = route.request();
        
        // リクエストヘッダーを確認（サーバーアクションからのリクエストか確認）
        const headers = request.headers();
        console.log("Request headers:", headers);
        
        // リクエストボディを確認
        const postData = request.postDataBuffer();
        if (postData) {
          console.log("Request data:", postData.toString());
        }

        // 成功レスポンスを返す
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

    // フォームに入力
    await page.fill('input[name="login_id"]', "testuser");
    await page.fill('input[name="password"]', "password123");

    // 送信ボタンをクリック
    await page.locator('button[type="submit"]').click();

    // ダイアログを処理
    const dialog = await dialogPromise;
    expect(dialog.message()).toContain("ログインに成功しました");
    await dialog.accept();

    // リダイレクト先を確認
    await expect(page).toHaveURL("/phoenix", { timeout: 5000 });
  });

  test("サーバーアクションのAPIリクエストをモックして失敗時の動作をテスト", async ({ page }) => {
    // サーバーアクションからのAPIリクエストをインターセプト
    await page.route(
      "http://127.0.0.1:8001/employee-auth/v1/auth/login",
      async (route) => {
        // 失敗レスポンスを返す
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

    // フォームに入力
    await page.fill('input[name="login_id"]', "wronguser");
    await page.fill('input[name="password"]', "wrongpass");

    // 送信ボタンをクリック
    await page.locator('button[type="submit"]').click();

    // エラーメッセージを確認
    await expect(page.locator(".error")).toBeVisible();
    await expect(page.locator(".error")).toContainText("ログインに失敗しました");

    // ページ遷移しないことを確認
    await expect(page).toHaveURL("/login-server-action");
  });

  test("サーバーアクションのAPIリクエストをモックしてネットワークエラー時の動作をテスト", async ({ page }) => {
    // サーバーアクションからのAPIリクエストをインターセプト
    await page.route(
      "http://127.0.0.1:8001/employee-auth/v1/auth/login",
      async (route) => {
        // ネットワークエラーをシミュレート
        await route.abort('failed');
      }
    );

    // フォームに入力
    await page.fill('input[name="login_id"]', "testuser");
    await page.fill('input[name="password"]', "password123");

    // 送信ボタンをクリック
    await page.locator('button[type="submit"]').click();

    // エラーメッセージを確認
    await expect(page.locator(".error")).toBeVisible();
    await expect(page.locator(".error")).toContainText("サーバーとの通信に失敗しました");

    // ページ遷移しないことを確認
    await expect(page).toHaveURL("/login-server-action");
  });
});
