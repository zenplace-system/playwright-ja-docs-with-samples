import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:9999/');
  await page.getByRole('link', { name: 'テストの書き方を詳しく学ぶ' }).click();
  await page.getByRole('link', { name: 'テスト自動生成を学ぶ' }).click();
  await page.getByRole('link', { name: 'ホームに戻る' }).click();
  await page.getByRole('link', { name: 'テストを始める' }).click();
  await page.getByRole('heading', { name: 'テストの実行' }).click();
  await page.getByRole('heading', { name: '特定のテストファイルを実行' }).click();
  await page.getByRole('link', { name: 'テスト自動生成を学ぶ' }).click();
  await page.getByText('ブラウザウィンドウ通常のウェブブラウザとして操作できます。ここでの操作がテストとして記録されます。').click();
  await page.getByText('Playwrightインスペクタブラウザでの操作に対応するコードがリアルタイムで表示されます。').click();
  await page.getByRole('heading', { name: '実践的な例' }).click();
  await page.getByRole('heading', { name: '高度な使い方' }).click();
  await page.getByRole('heading', { name: 'コードの修正と最適化' }).click();
  await page.getByText('変数の抽出や関数化によるコードの整理').click();
  await page.getByRole('link', { name: 'ホームに戻る' }).click();
  await page.getByText('ブラウザテストを簡単に、信頼性高く実行するためのフレームワーク').click();
  await expect(page.getByRole('heading', { name: 'Playwright 学習ガイド' })).toBeVisible();
  await expect(page.getByRole('main')).toContainText('Playwrightの特徴');
  await page.getByText('Playwright 学習ガイドブラウザテストを簡単に、信頼性高く実行するためのフレームワークテストを始める テスト自動生成を試す').click();
  await expect(page.getByRole('heading', { name: 'Playwright 学習ガイド' })).toBeVisible();
});