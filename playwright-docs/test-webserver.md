# Webサーバー

## 概要

Playwrightには設定ファイルに`webserver`オプションがあり、テスト実行前にローカル開発サーバーを起動する機能があります。これは開発中にテストを書く場合や、テスト対象のステージングまたは本番URLがない場合に最適です。

## Webサーバーの設定

Playwright設定で`webserver`プロパティを使用して、テスト中に開発Webサーバーを起動します。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // テスト開始前にローカル開発サーバーを実行
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
```

| プロパティ | 説明 |
|----------|------|
| `command` | アプリのローカル開発サーバーを起動するシェルコマンド。 |
| `url` | サーバーが接続を受け付ける準備ができたときに2xx、3xx、400、401、402、または403ステータスコードを返すことが期待されるHTTPサーバーのURL。 |
| `reuseExistingServer` | `true`の場合、利用可能な場合はURLで既存のサーバーを再利用します。URLでサーバーが実行されていない場合、新しいサーバーを起動するコマンドを実行します。`false`の場合、URLでリスニングしている既存のプロセスがあると例外をスローします。標準出力を確認するには、`DEBUG=pw:webserver`環境変数を設定できます。 |
| `ignoreHTTPSErrors` | `url`のフェッチ時にHTTPSエラーを無視するかどうか。デフォルトは`false`。 |
| `cwd` | 生成されるプロセスの現在の作業ディレクトリ。デフォルトは設定ファイルのディレクトリ。 |
| `stdout` | `"pipe"`の場合、コマンドの標準出力をプロセスの標準出力にパイプします。`"ignore"`の場合、コマンドの標準出力を無視します。デフォルトは`"ignore"`。 |
| `stderr` | コマンドの標準エラーをプロセスの標準エラーにパイプするか無視するか。デフォルトは`"pipe"`。 |
| `timeout` | プロセスが起動して利用可能になるまでの待機時間（ミリ秒）。デフォルトは60000。 |
| `gracefulShutdown` | プロセスをシャットダウンする方法。指定されていない場合、プロセスグループは強制的に`SIGKILL`されます。`{ signal: 'SIGTERM', timeout: 500 }`に設定すると、プロセスグループに`SIGTERM`シグナルが送信され、500ms以内に終了しない場合は`SIGKILL`が続きます。シグナルとして`SIGINT`も使用できます。タイムアウトが`0`の場合、`SIGKILL`は送信されません。Windowsは`SIGTERM`と`SIGINT`シグナルをサポートしていないため、このオプションはWindowsでは無視されます。Dockerコンテナをシャットダウンするには`SIGTERM`が必要です。 |

## サーバータイムアウトの追加

Webサーバーは起動に時間がかかることがあります。この場合、サーバーの起動を待つタイムアウトを増やすことができます。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 設定の残りの部分...
  // テスト開始前にローカル開発サーバーを実行
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 120秒
  },
});
```

## baseURLの追加

設定の`use: {}`セクションで`baseURL`を指定することもお勧めします。これにより、テストで相対URLを使用でき、完全なURLを何度も指定する必要がなくなります。

[page.goto()](/docs/api/class-page#page-goto)、[page.route()](/docs/api/class-page#page-route)、[page.waitForURL()](/docs/api/class-page#page-wait-for-url)、[page.waitForRequest()](/docs/api/class-page#page-wait-for-request)、または[page.waitForResponse()](/docs/api/class-page#page-wait-for-response)を使用する場合、[`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL)コンストラクタを使用して対応するURLを構築することでベースURLを考慮します。例えば、baseURLを`http://localhost:3000`に設定し、テストで`/login`に移動すると、Playwrightは`http://localhost:3000/login`を使用してテストを実行します。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 設定の残りの部分...
  // テスト開始前にローカル開発サーバーを実行
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
});
```

これで、ページをナビゲートするときに相対パスを使用できます：

```javascript
// test.spec.js
import { test } from '@playwright/test';

test('テスト', async ({ page }) => {
  // これはhttp://localhost:3000/loginに移動します
  await page.goto('./login');
});
```

## 複数のWebサーバー

`webServer`設定の配列を提供することで、複数のWebサーバー（またはバックグラウンドプロセス）を同時に起動できます。詳細については[testConfig.webServer](/docs/api/class-testconfig#test-config-web-server)を参照してください。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: [
    {
      command: 'npm run start',
      url: 'http://localhost:3000',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run backend',
      url: 'http://localhost:3333',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    }
  ],
  use: {
    baseURL: 'http://localhost:3000',
  },
});