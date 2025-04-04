# テストオプション

## 概要

テストランナーの設定に加えて、[Browser](/docs/api/class-browser)や[BrowserContext](/docs/api/class-browsercontext)の[エミュレーション](#エミュレーションオプション)、[ネットワーク](#ネットワークオプション)、[記録](#記録オプション)も設定できます。これらのオプションはPlaywright設定の`use: {}`オブジェクトに渡されます。

## 基本オプション

すべてのテストのベースURLとストレージ状態を設定します：

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // `await page.goto('/')`のようなアクションで使用するベースURL
    baseURL: 'http://localhost:4000',
    // コンテキストに指定したストレージ状態を設定
    storageState: 'state.json',
  },
});
```

| オプション | 説明 |
|----------|------|
| baseURL | コンテキスト内のすべてのページで使用されるベースURL。パスだけで移動できるようになります（例：`page.goto('/settings')`）。 |
| storageState | コンテキストに指定したストレージ状態を設定します。認証を簡単にするのに便利です。[詳細はこちら](/docs/auth)。 |

## エミュレーションオプション

Playwrightでは、モバイルフォンやタブレットなどの実際のデバイスをエミュレートできます。また、すべてのテストまたは特定のテストに対して`"geolocation"`、`"locale"`、`"timezone"`をエミュレートしたり、通知を表示するための`"permissions"`を設定したり、`"colorScheme"`を変更したりすることもできます。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // `'prefers-colors-scheme'`メディア機能をエミュレート
    colorScheme: 'dark',
    // コンテキストの位置情報
    geolocation: { longitude: 12.492507, latitude: 41.889938 },
    // ユーザーロケールをエミュレート
    locale: 'en-GB',
    // ブラウザコンテキストに特定の権限を付与
    permissions: ['geolocation'],
    // ユーザータイムゾーンをエミュレート
    timezoneId: 'Europe/Paris',
    // コンテキスト内のすべてのページで使用されるビューポート
    viewport: { width: 1280, height: 720 },
  },
});
```

| オプション | 説明 |
|----------|------|
| colorScheme | `'prefers-colors-scheme'`メディア機能をエミュレート。`'light'`または`'dark'`が指定可能。 |
| geolocation | コンテキストの位置情報。 |
| locale | ユーザーロケールをエミュレート（例：`en-GB`、`de-DE`など）。 |
| permissions | コンテキスト内のすべてのページに付与する権限のリスト。 |
| timezoneId | コンテキストのタイムゾーンを変更。 |
| viewport | コンテキスト内のすべてのページで使用されるビューポート。 |

## ネットワークオプション

ネットワークを設定するための利用可能なオプション：

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // 添付ファイルを自動的にダウンロードするかどうか
    acceptDownloads: false,
    // すべてのリクエストに送信される追加のHTTPヘッダー
    extraHTTPHeaders: {
      'X-My-Header': 'value',
    },
    // HTTP認証の資格情報
    httpCredentials: {
      username: 'user',
      password: 'pass',
    },
    // ナビゲーション中にHTTPSエラーを無視するかどうか
    ignoreHTTPSErrors: true,
    // ネットワークがオフラインであるかをエミュレート
    offline: true,
    // テスト内のすべてのページで使用されるプロキシ設定
    proxy: {
      server: 'http://myproxy.com:3128',
      bypass: 'localhost',
    },
  },
});
```

| オプション | 説明 |
|----------|------|
| acceptDownloads | 添付ファイルを自動的にダウンロードするかどうか。デフォルトは`true`。 |
| extraHTTPHeaders | すべてのリクエストに送信される追加のHTTPヘッダー。すべてのヘッダー値は文字列である必要があります。 |
| httpCredentials | HTTP認証の資格情報。 |
| ignoreHTTPSErrors | ナビゲーション中にHTTPSエラーを無視するかどうか。 |
| offline | ネットワークがオフラインであるかをエミュレート。 |
| proxy | テスト内のすべてのページで使用されるプロキシ設定。 |

> 注意：ネットワークリクエストをモックするために何も設定する必要はありません。ブラウザコンテキスト用のカスタム[Route](/docs/api/class-route)を定義するだけです。

## 記録オプション

Playwrightでは、スクリーンショットの撮影、ビデオの録画、テストのトレースを記録できます。デフォルトではこれらはオフになっていますが、`playwright.config.js`ファイルで`screenshot`、`video`、`trace`オプションを設定することで有効にできます。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // テスト失敗後にスクリーンショットを撮影
    screenshot: 'only-on-failure',
    // 初めてテストを再試行するときにのみトレースを記録
    trace: 'on-first-retry',
    // 初めてテストを再試行するときにのみビデオを記録
    video: 'on-first-retry'
  },
});
```

| オプション | 説明 |
|----------|------|
| screenshot | テストのスクリーンショットを撮影。オプションには`'off'`、`'on'`、`'only-on-failure'`があります。 |
| trace | テスト実行中にトレースを生成。オプションには`'off'`、`'on'`、`'retain-on-failure'`、`'on-first-retry'`があります。 |
| video | テストのビデオを記録。オプションには`'off'`、`'on'`、`'retain-on-failure'`、`'on-first-retry'`があります。 |

## その他のオプション

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // `click()`などの各アクションが実行できる最大時間。デフォルトは0（制限なし）。
    actionTimeout: 0,
    // テストを実行するブラウザの名前。例：`chromium`、`firefox`、`webkit`。
    browserName: 'chromium',
    // Content-Security-Policyのバイパスを切り替え。
    bypassCSP: true,
    // 使用するチャンネル。例：「chrome」、「chrome-beta」、「msedge」、「msedge-beta」。
    channel: 'chrome',
    // ブラウザをヘッドレスモードで実行。
    headless: false,
    // デフォルトのdata-testid属性を変更。
    testIdAttribute: 'pw-test-id',
  },
});
```

| オプション | 説明 |
|----------|------|
| actionTimeout | 各Playwrightアクションのタイムアウト（ミリ秒）。デフォルトは`0`（タイムアウトなし）。 |
| browserName | テストを実行するブラウザの名前。デフォルトは'chromium'。オプションには`chromium`、`firefox`、`webkit`があります。 |
| bypassCSP | Content-Security-Policyのバイパスを切り替え。CSPに本番オリジンが含まれている場合に便利。デフォルトは`false`。 |
| channel | 使用するブラウザチャンネル。 |
| headless | テスト実行時にブラウザを表示しないヘッドレスモードでブラウザを実行するかどうか。デフォルトは`true`。 |
| testIdAttribute | Playwrightロケーターが使用するデフォルトの[`data-testid`属性](/docs/locators#locate-by-test-id)を変更。 |

## 設定スコープ

Playwrightはグローバル、プロジェクトごと、またはテストごとに設定できます。例えば、Playwright設定の`use`オプションに`locale`を追加してグローバルに使用するロケールを設定し、設定の`project`オプションを使用して特定のプロジェクトでオーバーライドできます。また、テストファイルに`test.use({})`を追加してオプションを渡すことで、特定のテストでもオーバーライドできます。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    locale: 'en-GB'
  },
});
```

特定のプロジェクトのオプションをオーバーライドするには、Playwright設定の`project`オプションを使用します。

```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'de-DE',
      },
    },
  ],
});
```

特定のテストファイルのオプションをオーバーライドするには、`test.use()`メソッドを使用してオプションを渡します。例えば、特定のテストでフランス語ロケールでテストを実行するには：

```javascript
// test.spec.js
import { test, expect } from '@playwright/test';

test.use({ locale: 'fr-FR' });

test('例', async ({ page }) => {
  // ...
});
```

describeブロック内でも同様に動作します。例えば、describeブロック内のテストをフランス語ロケールで実行するには：

```javascript
// test.spec.js
import { test, expect } from '@playwright/test';

test.describe('フランス語ブロック', () => {
  test.use({ locale: 'fr-FR' });
  
  test('例', async ({ page }) => {
    // ...
  });
});