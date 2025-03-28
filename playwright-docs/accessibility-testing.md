# アクセシビリティテスト

## 概要

Playwrightを使用して、アプリケーションのアクセシビリティ問題をテストできます。

主な検出可能な問題：
- 色のコントラスト不足
- スクリーンリーダーが識別できないラベルのない要素
- 重複IDを持つ要素

## 基本的な使い方

アクセシビリティテストには`@axe-core/playwright`パッケージを使用します。

```bash
npm install --save-dev @axe-core/playwright
```

## テスト例

### ページ全体のスキャン

```javascript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('アクセシビリティ違反がないこと', async ({ page }) => {
  await page.goto('https://example.com/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

### ページの特定部分のスキャン

```javascript
test('ナビゲーションメニューにアクセシビリティ違反がないこと', async ({ page }) => {
  await page.goto('https://example.com/');
  await page.getByRole('button', { name: 'ナビゲーションメニュー' }).click();
  await page.locator('#navigation-menu').waitFor();
  
  const results = await new AxeBuilder({ page })
    .include('#navigation-menu')
    .analyze();
  
  expect(results.violations).toEqual([]);
});
```

### WCAG基準に対するスキャン

```javascript
test('WCAG A/AA基準に違反がないこと', async ({ page }) => {
  await page.goto('https://example.com/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  
  expect(results.violations).toEqual([]);
});
```

## 既知の問題の処理

### 特定要素の除外

```javascript
test('既知の問題のある要素を除外してテスト', async ({ page }) => {
  await page.goto('https://example.com/');
  const results = await new AxeBuilder({ page })
    .exclude('#known-issue-element')
    .analyze();
  
  expect(results.violations).toEqual([]);
});
```

### 特定ルールの無効化

```javascript
test('特定のルールを無効化してテスト', async ({ page }) => {
  await page.goto('https://example.com/');
  const results = await new AxeBuilder({ page })
    .disableRules(['duplicate-id'])
    .analyze();
  
  expect(results.violations).toEqual([]);
});
```

## テストフィクスチャの活用

複数のテストで共通の設定を使用する場合は、テストフィクスチャを作成すると便利です。

```javascript
// axe-test.js
const { test: base } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

exports.test = base.extend({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .exclude('#known-issue-element');
    
    await use(makeAxeBuilder);
  }
});

exports.expect = base.expect;
```

使用例：

```javascript
const { test, expect } = require('./axe-test');

test('アクセシビリティテスト', async ({ page, makeAxeBuilder }) => {
  await page.goto('https://example.com/');
  const results = await makeAxeBuilder().analyze();
  expect(results.violations).toEqual([]);
});
```

注意: 自動テストだけでは検出できない問題もあります。手動テストと組み合わせることをお勧めします。