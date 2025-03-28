# Chrome拡張機能

## 概要

> 注意: 拡張機能は永続的コンテキストで起動されたChrome/Chromiumでのみ動作します。カスタムブラウザ引数は自己責任で使用してください。一部の引数はPlaywright機能を破壊する可能性があります。

## 基本的な使い方

以下のコードは、`./my-extension`にあるソースの[Manifest v2](https://developer.chrome.com/docs/extensions/mv2/)拡張機能の[バックグラウンドページ](https://developer.chrome.com/extensions/background_pages)を取得します。

ヘッドレスモードで拡張機能を実行できる`chromium`チャンネルを使用していることに注意してください。または、ブラウザをヘッドモードで起動することもできます。

```javascript
const { chromium } = require('playwright');

(async () => {
  const pathToExtension = require('path').join(__dirname, 'my-extension');
  const userDataDir = '/tmp/test-user-data-dir';
  
  const browserContext = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chromium',
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`
    ]
  });
  
  // バックグラウンドページを取得
  let [backgroundPage] = browserContext.backgroundPages();
  if (!backgroundPage)
    backgroundPage = await browserContext.waitForEvent('backgroundpage');
  
  // バックグラウンドページを他のページと同様にテスト
  await browserContext.close();
})();
```

## テスト

テスト実行時に拡張機能を読み込むには、コンテキストを設定するテストフィクスチャを使用できます。また、拡張機能IDを動的に取得して、例えばポップアップページの読み込みとテストに使用することもできます。

ヘッドレスモードで拡張機能を実行できる`chromium`チャンネルを使用していることに注意してください。または、ブラウザをヘッドモードで起動することもできます。

### フィクスチャの作成

まず、拡張機能を読み込むフィクスチャを追加します：

```typescript
// fixtures.ts
import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({ }, use) => {
    const pathToExtension = path.join(__dirname, 'my-extension');
    const context = await chromium.launchPersistentContext('', {
      channel: 'chromium',
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  
  extensionId: async ({ context }, use) => {
    /*
    // Manifest v2の場合:
    let [background] = context.backgroundPages()
    if (!background)
      background = await context.waitForEvent('backgroundpage')
    */
    
    // Manifest v3の場合:
    let [background] = context.serviceWorkers();
    if (!background)
      background = await context.waitForEvent('serviceworker');
    
    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

export const expect = test.expect;
```

### フィクスチャの使用

次に、テストでこれらのフィクスチャを使用します：

```typescript
import { test, expect } from './fixtures';

test('拡張機能のテスト', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('body')).toHaveText('my-extensionによって変更されました');
});

test('ポップアップページ', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.locator('body')).toHaveText('my-extension ポップアップ');
});
```

## 注意点

1. Chrome拡張機能のテストには永続的コンテキストが必要です
2. Manifest v2とv3で取得方法が異なります（backgroundPageとserviceWorker）
3. 拡張機能IDは動的に取得する必要があります
4. ヘッドレスモードで実行するには`chromium`チャンネルを使用します