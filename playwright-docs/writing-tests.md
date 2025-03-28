# Playwrightテストの書き方

## 概要

Playwrightのテストは非常にシンプルで、以下の2つの要素で構成されています：

* **アクション**の実行
* 期待値に対する**状態の検証**

Playwrightの特徴：
- アクション実行前に自動的に[アクション可能性](/docs/actionability)チェックを待機
- 競合状態を気にせず、期待値が最終的に満たされるまで待機するアサーション設計
- これらによりタイムアウトや競合状態に関する問題を気にせずテストが可能

## 最初のテスト

基本的なテストの例を見てみましょう：

```javascript
// @ts-check
import { test, expect } from '@playwright/test';

test('タイトルの確認', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // タイトルに "Playwright" が含まれていることを確認
  await expect(page).toHaveTitle(/Playwright/);
});

test('Get Startedリンクのクリック', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // Get Startedリンクをクリック
  await page.getByRole('link', { name: 'Get started' }).click();
  // 「Installation」という見出しが表示されていることを確認
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

## アクション

### ナビゲーション

ほとんどのテストはページへのナビゲーションから始まります：

```javascript
await page.goto('https://playwright.dev/');
```

Playwrightはページがロード状態に達するまで自動的に待機します。

### インタラクション

要素を操作するには、まず[ロケーターAPI](/docs/locators)を使って要素を特定します：

```javascript
// ロケーターの作成
const getStarted = page.getByRole('link', { name: 'Get started' });
// クリック
await getStarted.click();
```

通常は1行で書くことが多いです：

```javascript
await page.getByRole('link', { name: 'Get started' }).click();
```

### 基本的なアクション

よく使用されるアクション：

| アクション | 説明 |
|------------|------|
| `locator.check()` | チェックボックスをチェック |
| `locator.click()` | 要素をクリック |
| `locator.uncheck()` | チェックボックスのチェックを外す |
| `locator.hover()` | 要素にマウスオーバー |
| `locator.fill()` | フォームフィールドにテキスト入力 |
| `locator.press()` | キーを押す |
| `locator.setInputFiles()` | ファイルをアップロード |
| `locator.selectOption()` | ドロップダウンからオプションを選択 |

## アサーション

Playwrightには`expect`関数の形で[テストアサーション](/docs/test-assertions)が含まれています：

```javascript
// 一般的なアサーション
expect(success).toBeTruthy();

// 非同期アサーション（条件が満たされるまで待機）
await expect(page).toHaveTitle(/Playwright/);
```

よく使用されるアサーション：

| アサーション | 説明 |
|--------------|------|
| `expect(locator).toBeChecked()` | チェックボックスがチェックされている |
| `expect(locator).toBeEnabled()` | コントロールが有効 |
| `expect(locator).toBeVisible()` | 要素が表示されている |
| `expect(locator).toContainText()` | 要素にテキストが含まれている |
| `expect(locator).toHaveAttribute()` | 要素に属性がある |
| `expect(locator).toHaveCount()` | 要素リストが指定の長さ |
| `expect(locator).toHaveText()` | 要素のテキストが一致する |
| `expect(locator).toHaveValue()` | 入力要素に値がある |
| `expect(page).toHaveTitle()` | ページにタイトルがある |
| `expect(page).toHaveURL()` | ページのURLが一致する |

## テスト分離

Playwrightのテストは[テストフィクスチャ](/docs/test-fixtures)の概念に基づいています。各テストは独立したブラウザコンテキストで実行され、完全に分離された環境が提供されます：

```javascript
import { test } from '@playwright/test';

test('例のテスト', async ({ page }) => {
  // "page"は、このテスト専用に作成された分離されたBrowserContextに属しています
});

test('別のテスト', async ({ page }) => {
  // この2番目のテストの"page"は、最初のテストから完全に分離されています
});
```

## テストフックの使用

テストをグループ化したり、前処理/後処理を行うための[テストフック](/docs/api/class-test)を使用できます：

```javascript
import { test, expect } from '@playwright/test';

test.describe('ナビゲーション', () => {
  test.beforeEach(async ({ page }) => {
    // 各テストの前に開始URLに移動
    await page.goto('https://playwright.dev/');
  });

  test('メインナビゲーション', async ({ page }) => {
    // アサーションはexpect APIを使用
    await expect(page).toHaveURL('https://playwright.dev/');
  });
});
```

## 次のステップ

- [テストの実行（単一テスト、複数テスト、ヘッドモード）](/docs/running-tests)
- [Codegenを使ったテスト生成](/docs/codegen-intro)
- [テストのトレース表示](/docs/trace-viewer-intro)
- [UIモードの探索](/docs/test-ui-mode)
- [GitHub Actionsを使ったCIでのテスト実行](/docs/ci-intro)