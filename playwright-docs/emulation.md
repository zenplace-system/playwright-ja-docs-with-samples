# Playwrightエミュレーション

## 概要

Playwrightを使用すると、任意のブラウザでアプリをテストしたり、モバイルフォンやタブレットなどの実際のデバイスをエミュレートしたりできます。エミュレートしたいデバイスを設定するだけで、Playwrightは`"userAgent"`、`"screenSize"`、`"viewport"`、`"hasTouch"`などのブラウザ動作をシミュレートします。また、すべてのテストまたは特定のテストに対して`"geolocation"`、`"locale"`、`"timezone"`をエミュレートしたり、通知を表示するための`"permissions"`を設定したり、`"colorScheme"`を変更したりすることもできます。

## デバイス

Playwrightには、[playwright.devices](/docs/api/class-playwright#playwright-devices)を使用した選択されたデスクトップ、タブレット、モバイルデバイス用の[デバイスパラメータレジストリ](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json)が付属しています。これを使用して、ユーザーエージェント、画面サイズ、ビューポート、タッチが有効かどうかなど、特定のデバイスのブラウザ動作をシミュレートできます。すべてのテストは指定されたデバイスパラメータで実行されます。

```javascript
// playwright.config.js
module.exports = {
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],
      },
    },
  ],
};
```

または、ライブラリAPIを使用する場合：

```javascript
const { chromium, devices } = require('playwright');
const browser = await chromium.launch();
const iphone13 = devices['iPhone 13'];
const context = await browser.newContext({
  ...iphone13,
});
```

## ビューポート

ビューポートはデバイスに含まれていますが、[page.setViewportSize()](/docs/api/class-page#page-set-viewport-size)を使用して一部のテストでオーバーライドできます。

```javascript
// playwright.config.js
module.exports = {
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // デバイスも`viewport`を定義するため、`devices`の分割代入後に
        // `viewport`プロパティを定義することが重要です。
        viewport: { width: 1280, height: 720 },
      },
    },
  ]
};
```

テストファイル内での設定：

```javascript
// tests/example.spec.js
import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 1600, height: 1200 },
});

test('my test', async ({ page }) => {
  // ...
});
```

または、テストファイル内の特定のブロックに対して：

```javascript
// tests/example.spec.js
import { test, expect } from '@playwright/test';

test.describe('specific viewport block', () => {
  test.use({ viewport: { width: 1600, height: 1200 } });
  
  test('my test', async ({ page }) => {
    // ...
  });
});
```

ライブラリAPIを使用する場合：

```javascript
// 指定されたビューポートでコンテキストを作成
const context = await browser.newContext({
  viewport: { width: 1280, height: 1024 }
});

// 個々のページのビューポートをリサイズ
await page.setViewportSize({ width: 1600, height: 1200 });

// 高DPIをエミュレート
const context = await browser.newContext({
  viewport: { width: 2560, height: 1440 },
  deviceScaleFactor: 2,
});
```

## isMobile

メタビューポートタグが考慮されるかどうか、およびタッチイベントが有効かどうかを指定します。

```javascript
// playwright.config.js
module.exports = {
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // デバイスも`isMobile`を定義するため、`devices`の分割代入後に
        // `isMobile`プロパティを定義することが重要です。
        isMobile: false,
      },
    },
  ]
};
```

## ロケールとタイムゾーン

ユーザーのロケールとタイムゾーンをエミュレートします。これは設定ですべてのテストに対してグローバルに設定でき、特定のテストに対してオーバーライドすることもできます。

```javascript
// playwright.config.js
module.exports = {
  use: {
    // ユーザーロケールをエミュレート
    locale: 'en-GB',
    // ユーザータイムゾーンをエミュレート
    timezoneId: 'Europe/Paris',
  },
};
```

テストファイル内での設定：

```javascript
// tests/example.spec.js
import { test, expect } from '@playwright/test';

test.use({
  locale: 'de-DE',
  timezoneId: 'Europe/Berlin',
});

test('ベルリンタイムゾーンでのdeロケールのテスト', async ({ page }) => {
  await page.goto('https://www.bing.com');
  // ...
});
```

ライブラリAPIを使用する場合：

```javascript
const context = await browser.newContext({
  locale: 'de-DE',
  timezoneId: 'Europe/Berlin',
});
```

## 権限

アプリがシステム通知を表示することを許可します。

```javascript
// playwright.config.js
module.exports = {
  use: {
    // ブラウザコンテキストに指定された権限を付与します
    permissions: ['notifications'],
  },
};
```

特定のドメインに対して通知を許可します：

```javascript
// tests/example.spec.js
import { test } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  // 各テストの前に実行され、各ページにサインインします
  await context.grantPermissions(['notifications'], { origin: 'https://skype.com' });
});

test('first', async ({ page }) => {
  // pageはhttps://skype.comに対する通知権限を持っています
});
```

[browserContext.clearPermissions()](/docs/api/class-browsercontext#browser-context-clear-permissions)ですべての権限を取り消します：

```javascript
await context.clearPermissions();
```

## 位置情報

`"geolocation"`権限を付与し、位置情報を特定の地域に設定します。

```javascript
// playwright.config.js
module.exports = {
  use: {
    // コンテキスト位置情報
    geolocation: { longitude: 12.492507, latitude: 41.889938 },
    permissions: ['geolocation'],
  },
};
```

テストファイル内での設定：

```javascript
// tests/example.spec.js
import { test, expect } from '@playwright/test';

test.use({
  geolocation: { longitude: 41.890221, latitude: 12.492348 },
  permissions: ['geolocation'],
});

test('位置情報を使用したテスト', async ({ page }) => {
  // ...
});
```

後で位置を変更します：

```javascript
// tests/example.spec.js
import { test, expect } from '@playwright/test';

test.use({
  geolocation: { longitude: 41.890221, latitude: 12.492348 },
  permissions: ['geolocation'],
});

test('位置情報を使用したテスト', async ({ page, context }) => {
  // このテストの位置を上書き
  await context.setGeolocation({ longitude: 48.858455, latitude: 2.294474 });
});
```

**注意** 位置情報はコンテキスト内のすべてのページに対してのみ変更できます。

## カラースキームとメディア

ユーザーの`"colorScheme"`をエミュレートします。サポートされる値は「light」と「dark」です。[page.emulateMedia()](/docs/api/class-page#page-emulate-media)を使用してメディアタイプをエミュレートすることもできます。

```javascript
// playwright.config.js
module.exports = {
  use: {
    colorScheme: 'dark',
  },
};
```

テストファイル内での設定：

```javascript
// tests/example.spec.js
import { test, expect } from '@playwright/test';

test.use({
  colorScheme: 'dark' // または 'light'
});

test('ダークモードでのテスト', async ({ page }) => {
  // ...
});
```

ライブラリAPIを使用する場合：

```javascript
// ダークモードでコンテキストを作成
const context = await browser.newContext({
  colorScheme: 'dark' // または 'light'
});

// ダークモードでページを作成
const page = await browser.newPage({
  colorScheme: 'dark' // または 'light'
});

// ページのカラースキームを変更
await page.emulateMedia({ colorScheme: 'dark' });

// ページのメディアを変更
await page.emulateMedia({ media: 'print' });
```

## ユーザーエージェント

ユーザーエージェントはデバイスに含まれているため、変更する必要はほとんどありませんが、異なるユーザーエージェントをテストする必要がある場合は、`userAgent`プロパティでオーバーライドできます。

```javascript
// tests/example.spec.js
import { test, expect } from '@playwright/test';

test.use({ userAgent: '独自のユーザーエージェント' });

test('ユーザーエージェントのテスト', async ({ page }) => {
  // ...
});
```

ライブラリAPIを使用する場合：

```javascript
const context = await browser.newContext({
  userAgent: '独自のユーザーエージェント'
});
```

## オフライン

ネットワークがオフラインであることをエミュレートします。

```javascript
// playwright.config.js
module.exports = {
  use: {
    offline: true
  },
};
```

## JavaScript無効

JavaScriptが無効になっているユーザーシナリオをエミュレートします。

```javascript
// tests/example.spec.js
import { test, expect } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('JavaScriptなしのテスト', async ({ page }) => {
  // ...
});
```

ライブラリAPIを使用する場合：

```javascript
const context = await browser.newContext({
  javaScriptEnabled: false
});