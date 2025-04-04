import { test, expect } from '@playwright/test';

// テストの自動生成ページのテスト
test('テストの自動生成ページの表示テスト', async ({ page }) => {
  // テストの自動生成ページにアクセス
  await page.goto('http://localhost:4000/generating-tests');
  
  // タイトルの確認
  await expect(page).toHaveTitle('Playwright 学習ガイド');
  
  // 見出しの確認
  const heading = page.locator('h1');
  await expect(heading).toHaveText('テストの自動生成');
  
  // 各セクションの存在確認
  await expect(page.locator('h2').filter({ hasText: 'Codegen — コード自動生成ツール' })).toBeVisible();
  await expect(page.locator('h2').filter({ hasText: '実践的な例' })).toBeVisible();
  await expect(page.locator('h2').filter({ hasText: '高度な使い方' })).toBeVisible();
  
  // ステップが番号付きで表示されていることを確認
  const steps = page.locator('.bg-primary.text-primary-foreground.rounded-full');
  await expect(steps).toHaveCount(3);
  
  // コードサンプルが表示されていることを確認
  await expect(page.locator('pre')).toBeVisible();
  
  // ナビゲーションリンクの確認
  const writingTestsLink = page.getByRole('link', { name: 'テストの作成に戻る' });
  await expect(writingTestsLink).toBeVisible();
  await expect(writingTestsLink).toHaveAttribute('href', '/writing-tests');
  
  const homeLink = page.getByRole('link', { name: 'ホームに戻る' });
  await expect(homeLink).toBeVisible();
  await expect(homeLink).toHaveAttribute('href', '/');
});
