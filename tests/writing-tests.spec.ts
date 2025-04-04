import { test, expect } from '@playwright/test';

// テストの作成ページのテスト
test('テストの作成ページの表示テスト', async ({ page }) => {
  // テストの作成ページにアクセス
  await page.goto('http://localhost:4000/writing-tests');
  
  // タイトルの確認
  await expect(page).toHaveTitle('Playwright 学習ガイド');
  
  // 見出しの確認
  const heading = page.locator('h1');
  await expect(heading).toHaveText('テストの作成');
  
  // 各セクションの存在確認
  await expect(page.locator('h2').filter({ hasText: '基本的なテスト構造' })).toBeVisible();
  await expect(page.locator('h2').filter({ hasText: 'アサーション（検証）' })).toBeVisible();
  await expect(page.locator('h2').filter({ hasText: 'テストの実行' })).toBeVisible();
  
  // コードサンプルが表示されていることを確認
  await expect(page.locator('pre')).toHaveCount(3);
  
  // ナビゲーションリンクの確認
  const homeLink = page.getByRole('link', { name: 'ホームに戻る' });
  await expect(homeLink).toBeVisible();
  await expect(homeLink).toHaveAttribute('href', '/');
  
  const generatingTestsLink = page.getByRole('link', { name: 'テスト自動生成を学ぶ' });
  await expect(generatingTestsLink).toBeVisible();
  await expect(generatingTestsLink).toHaveAttribute('href', '/generating-tests');
});
