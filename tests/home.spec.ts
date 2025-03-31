import { test, expect } from '@playwright/test';

// トップページのテスト
test('トップページの表示テスト', async ({ page }) => {
  // トップページにアクセス
  await page.goto('http://localhost:9999/');
  
  // タイトルの確認
  await expect(page).toHaveTitle('Playwright 学習ガイド');
  
  // 見出しの確認
  const heading = page.locator('h1');
  await expect(heading).toHaveText('Playwright 学習ガイド');
  
  // 特徴セクションの存在確認
  await expect(page.locator('h2').filter({ hasText: 'Playwrightの特徴' })).toBeVisible();
  
  // カードが3つあることを確認
  await expect(page.locator('.grid-cols-1 > div')).toHaveCount(3);
  
  // テストを始めるボタンの確認
  const startButton = page.getByRole('link', { name: 'テストを始める' });
  await expect(startButton).toBeVisible();
  await expect(startButton).toHaveAttribute('href', '/writing-tests');
  
  // テスト自動生成を試すボタンの確認
  const codegenButton = page.getByRole('link', { name: 'テスト自動生成を試す' });
  await expect(codegenButton).toBeVisible();
  await expect(codegenButton).toHaveAttribute('href', '/generating-tests');
  
  // コードサンプルがあることを確認
  await expect(page.locator('pre')).toBeVisible();
});
