# テスト設定

## 概要

Playwrightにはテストの実行方法を設定するための多くのオプションがあります。これらのオプションは設定ファイルで指定できます。テストランナーのオプションは**トップレベル**であり、`use`セクションには入れないでください。

## 基本設定

以下は最も一般的な設定オプションです。

```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // この設定ファイルからの相対パスで「tests」ディレクトリ内のテストファイルを探します。
  testDir: 'tests',
  
  // すべてのテストを並列に実行します。
  fullyParallel: true,
  
  // CIでtest.onlyを誤って残した場合にビルドを失敗させます。
  forbidOnly: !!process.env.CI,
  
  // CIでのみ再試行します。
  retries: process.env.CI ? 2 : 0,
  
  // CIでは並列テストをオプトアウトします。
  workers: process.env.CI ? 1 : undefined,
  
  // 使用するレポーター
  reporter: 'html',
  
  use: {
    // `await page.goto('/')`のようなアクションで使用するベースURL。
    baseURL: 'http://localhost:9999',
    
    // 失敗したテストを再試行するときにトレースを収集します。
    trace: 'on-first-retry',
  },
  
  // 主要なブラウザのプロジェクトを設定します。
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  
  // テストを開始する前にローカル開発サーバーを実行します。
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:9999',
    reuseExistingServer: !process.env.CI,
  },
});
```

| オプション | 説明 |
|----------|------|
| [testConfig.forbidOnly](/docs/api/class-testconfig#test-config-forbid-only) | テストが`test.only`としてマークされている場合にエラーで終了するかどうか。CIで便利です。 |
| [testConfig.fullyParallel](/docs/api/class-testconfig#test-config-fully-parallel) | すべてのファイル内のすべてのテストを並列に実行します。詳細は[並列実行](/docs/test-parallel)と[シャーディング](/docs/test-sharding)を参照してください。 |
| [testConfig.projects](/docs/api/class-testconfig#test-config-projects) | 複数の設定または複数のブラウザでテストを実行します。 |
| [testConfig.reporter](/docs/api/class-testconfig#test-config-reporter) | 使用するレポーター。利用可能なレポーターについては[テストレポーター](/docs/test-reporters)を参照してください。 |
| [testConfig.retries](/docs/api/class-testconfig#test-config-retries) | テストごとの最大再試行回数。再試行の詳細については[テスト再試行](/docs/test-retries)を参照してください。 |
| [testConfig.testDir](/docs/api/class-testconfig#test-config-test-dir) | テストファイルのディレクトリ。 |
| [testConfig.use](/docs/api/class-testconfig#test-config-use) | `use{}`内のオプション。 |
| [testConfig.webServer](/docs/api/class-testconfig#test-config-web-server) | テスト中にサーバーを起動するには、`webServer`オプションを使用します。 |
| [testConfig.workers](/docs/api/class-testconfig#test-config-workers) | テストを並列化するために使用する同時ワーカープロセスの最大数。論理CPUコアの割合として設定することもできます（例：`'50%'`）。詳細は[並列実行](/docs/test-parallel)と[シャーディング](/docs/test-sharding)を参照してください。 |

## テストのフィルタリング

グロブパターンまたは正規表現でテストをフィルタリングします。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // テストファイルを無視するグロブパターンまたは正規表現。
  testIgnore: '*test-assets',
  
  // テストファイルに一致するグロブパターンまたは正規表現。
  testMatch: '*todo-tests/*.spec.ts',
});
```

| オプション | 説明 |
|----------|------|
| [testConfig.testIgnore](/docs/api/class-testconfig#test-config-test-ignore) | テストファイルを探すときに無視すべきグロブパターンまたは正規表現。例：`'*test-assets'` |
| [testConfig.testMatch](/docs/api/class-testconfig#test-config-test-match) | テストファイルに一致するグロブパターンまたは正規表現。例：`'*todo-tests/*.spec.ts'`。デフォルトでは、Playwrightは`.*(test|spec).(js|ts|mjs)`ファイルを実行します。 |

## 高度な設定

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // スクリーンショット、ビデオ、トレースなどのテスト成果物のフォルダ。
  outputDir: 'test-results',
  
  // グローバルセットアップファイルへのパス。
  globalSetup: require.resolve('./global-setup'),
  
  // グローバルティアダウンファイルへのパス。
  globalTeardown: require.resolve('./global-teardown'),
  
  // 各テストには30秒が与えられます。
  timeout: 30000,
});
```

| オプション | 説明 |
|----------|------|
| [testConfig.globalSetup](/docs/api/class-testconfig#test-config-global-setup) | グローバルセットアップファイルへのパス。このファイルはすべてのテストの前に必要とされ、実行されます。単一の関数をエクスポートする必要があります。 |
| [testConfig.globalTeardown](/docs/api/class-testconfig#test-config-global-teardown) | グローバルティアダウンファイルへのパス。このファイルはすべてのテストの後に必要とされ、実行されます。単一の関数をエクスポートする必要があります。 |
| [testConfig.outputDir](/docs/api/class-testconfig#test-config-output-dir) | スクリーンショット、ビデオ、トレースなどのテスト成果物のフォルダ。 |
| [testConfig.timeout](/docs/api/class-testconfig#test-config-timeout) | Playwrightは各テストに[タイムアウト](/docs/test-timeouts)を適用します（デフォルトは30秒）。テスト関数、テストフィクスチャ、beforeEachフックにかかる時間がテストタイムアウトに含まれます。 |

## Expectオプション

expect アサーションライブラリの設定。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    // expect()が条件が満たされるのを待つ最大時間。
    timeout: 5000,
    
    toHaveScreenshot: {
      // 異なる可能性のあるピクセルの許容量（デフォルトでは未設定）。
      maxDiffPixels: 10,
    },
    
    toMatchSnapshot: {
      // 異なるピクセルの総ピクセル数に対する許容比率（0〜1の間）。
      maxDiffPixelRatio: 0.1,
    },
  },
});
```

| オプション | 説明 |
|----------|------|
| [testConfig.expect](/docs/api/class-testconfig#test-config-expect) | `expect(locator).toHaveText()`のような[Webファーストアサーション](/docs/test-assertions)には、デフォルトで5秒の別個のタイムアウトがあります。これは`expect()`が条件が満たされるのを待つ最大時間です。[テストとexpectのタイムアウト](/docs/test-timeouts)と単一のテストに対してそれらを設定する方法の詳細をご覧ください。 |
| [expect(page).toHaveScreenshot()](/docs/api/class-pageassertions#page-assertions-to-have-screenshot-1) | `expect(locator).toHaveScreenshot()`メソッドの設定。 |
| [expect(value).toMatchSnapshot()](/docs/api/class-snapshotassertions#snapshot-assertions-to-match-snapshot-1) | `expect(locator).toMatchSnapshot()`メソッドの設定。 |