import { test, expect } from '@playwright/test';

test.describe('不動産管理ダッシュボード', () => {
  test.beforeEach(async ({ page }) => {
    // 各テスト前にダッシュボードページにアクセス
    await page.goto('/phoenix');
  });

  test('ページが正しくロードされること', async ({ page }) => {
    // タイトルの確認
    await expect(page).toHaveTitle(/Oemahin - 不動産管理ダッシュボード/);
    
    // メインコンテンツが表示されていることを確認
    await expect(page.locator('main')).toBeVisible();
  });

  test('サイドバーメニューが正しく表示されること', async ({ page }) => {
    // サイドバーが表示されていることを確認
    const sidebar = page.locator('.w-64');
    await expect(sidebar).toBeVisible();
    
    // メニュー項目が正しく表示されていることを確認
    await expect(sidebar.getByText('Dashboard')).toBeVisible();
    await expect(sidebar.getByText('House')).toBeVisible();
    await expect(sidebar.getByText('Insight')).toBeVisible();
    await expect(sidebar.getByText('Reimburse')).toBeVisible();
    await expect(sidebar.getByText('Inbox')).toBeVisible();
    await expect(sidebar.getByText('Calender')).toBeVisible();
    
    // プリファレンスセクションが表示されていることを確認
    await expect(sidebar.getByText('PREFERENCES')).toBeVisible();
    await expect(sidebar.getByText('Settings')).toBeVisible();
    await expect(sidebar.getByText('Help & Center')).toBeVisible();
    await expect(sidebar.getByText('Dark Mode')).toBeVisible();
    await expect(sidebar.getByText('Log Out')).toBeVisible();
  });

  test('ヘッダーが正しく表示されること', async ({ page }) => {
    // ヘッダーが表示されていることを確認
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // 検索バーが表示されていることを確認
    await expect(header.getByPlaceholder('Search something here')).toBeVisible();
    
    // ユーザープロフィールが表示されていることを確認
    await expect(header.getByText('Richard Kyle')).toBeVisible();
  });

  test('物件カテゴリーセクションが正しく表示されること', async ({ page }) => {
    // 物件カテゴリーセクションが表示されていることを確認
    const houseCategory = page.locator('text=House Category').first();
    await expect(houseCategory).toBeVisible();
    
    // 物件カードが表示されていることを確認（少なくとも3つ）
    const houseCards = page.locator('.rounded-xl.overflow-hidden');
    await expect(houseCards).toHaveCount(3);
    
    // 特定の物件名が表示されていることを確認
    await expect(page.getByText('Luxury White')).toBeVisible();
    await expect(page.getByText('Wooden Jungle')).toBeVisible();
    await expect(page.getByText('Next Future')).toBeVisible();
  });

  test('売上カテゴリーセクションが正しく表示されること', async ({ page }) => {
    // 売上カテゴリーセクションが表示されていることを確認
    const salesCategory = page.locator('text=House Sales Category');
    await expect(salesCategory).toBeVisible();
    
    // 総数が表示されていることを確認
    await expect(page.getByText('Total Home')).toBeVisible();
    await expect(page.getByText('75,350')).toBeVisible();
    
    // カテゴリー項目が表示されていることを確認
    await expect(page.getByText('House Sales')).toBeVisible();
    await expect(page.getByText('House Rent')).toBeVisible();
    await expect(page.getByText('House Available')).toBeVisible();
    
    // 各カテゴリーの数値が表示されていることを確認
    await expect(page.getByText('30,893')).toBeVisible();
    await expect(page.getByText('24,112')).toBeVisible();
    await expect(page.getByText('20,345')).toBeVisible();
  });

  test('取引履歴セクションが正しく表示されること', async ({ page }) => {
    // 取引履歴セクションが表示されていることを確認
    const transactionHistory = page.locator('text=Transaction History');
    await expect(transactionHistory).toBeVisible();
    
    // テーブルヘッダーが表示されていることを確認
    await expect(page.getByText('Transactions')).toBeVisible();
    await expect(page.getByText('Date')).toBeVisible();
    await expect(page.getByText('Amount')).toBeVisible();
    await expect(page.getByText('Status')).toBeVisible();
    
    // 取引データが表示されていることを確認（少なくとも1つ）
    await expect(page.getByText('$11,700.00')).toBeVisible();
    await expect(page.getByText('Jun 29, 2022')).toBeVisible();
    await expect(page.getByText('Completed').first()).toBeVisible();
  });

  test('エリアマップセクションが正しく表示されること', async ({ page }) => {
    // エリアマップセクションが表示されていることを確認
    const areaMap = page.locator('text=Area Map');
    await expect(areaMap).toBeVisible();
    
    // マップが表示されていることを確認
    await expect(page.locator('.bg-blue-50.rounded-lg')).toBeVisible();
  });

  test('サイドバーのメニュー項目がクリック可能であること', async ({ page }) => {
    // Dashboardメニューがアクティブであることを確認（青色の背景）
    const dashboardMenu = page.locator('a', { hasText: 'Dashboard' });
    await expect(dashboardMenu).toHaveClass(/bg-blue-600/);
    
    // 他のメニュー項目をクリックしてみる（実際の遷移はモックしています）
    const houseMenu = page.locator('a', { hasText: 'House' });
    await houseMenu.click();
    // 実際のアプリケーションでは、ここでページ遷移の確認をします
    // このテストでは単にクリック可能かどうかを確認します
  });

  test('検索バーに入力できること', async ({ page }) => {
    // 検索バーを取得
    const searchInput = page.locator('input[placeholder="Search something here"]');
    
    // 検索バーに文字を入力
    await searchInput.fill('テスト検索');
    
    // 入力した値が反映されていることを確認
    await expect(searchInput).toHaveValue('テスト検索');
  });

  test('レスポンシブ対応の基本チェック', async ({ page }) => {
    // 画面サイズを変更してレスポンシブ対応をチェック
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator('main')).toBeVisible();
    
    // タブレットサイズ
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('main')).toBeVisible();
    
    // モバイルサイズ（実際のアプリケーションでは、ここでモバイル表示の確認をします）
    // このテストでは単に表示されるかどうかを確認します
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('main')).toBeVisible();
  });
});
