# プロジェクト

## 概要

プロジェクトは、同じ設定で実行されるテストの論理的なグループです。異なるブラウザやデバイスでテストを実行するためにプロジェクトを使用します。プロジェクトは`playwright.config.js`ファイルで設定され、設定後はすべてのプロジェクトまたは特定のプロジェクトでのみテストを実行できます。また、異なる設定で同じテストを実行するためにプロジェクトを使用することもできます。例えば、ログイン状態とログアウト状態で同じテストを実行できます。

プロジェクトを設定することで、異なるタイムアウトやリトライでテストグループを実行したり、ステージングと本番などの異なる環境に対してテストグループを実行したり、パッケージ/機能ごとにテストを分割したりすることもできます。

## 複数ブラウザ用のプロジェクト設定

**プロジェクト**を使用することで、ChromiumやWebKit、Firefoxなどの複数のブラウザや、Google ChromeやMicrosoft Edgeなどのブランドブラウザでテストを実行できます。Playwrightはエミュレートされたタブレットやモバイルデバイスでも実行できます。

```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* モバイルビューポートでテスト */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    /* ブランドブラウザでテスト */
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge'
      },
    },
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
    },
  ],
});
```

## プロジェクトの実行

Playwrightはデフォルトですべてのプロジェクトを実行します。

```bash
npx playwright test
```

`--project`コマンドラインオプションを使用して単一のプロジェクトを実行します。

```bash
npx playwright test --project=firefox
```

VS Codeテストランナーは、デフォルトブラウザのChromeでテストを実行します。他の/複数のブラウザで実行するには、テストサイドバーからプレイボタンのドロップダウンをクリックして別のプロファイルを選択するか、**Select Default Profile**をクリックしてデフォルトプロファイルを変更し、テストを実行したいブラウザを選択します。

## 複数環境用のプロジェクト設定

プロジェクトを設定することで、異なるタイムアウトやリトライでテストグループを実行したり、異なる環境に対してテストグループを実行したりすることもできます。例えば、2回のリトライでステージング環境に対してテストを実行し、0回のリトライで本番環境に対してテストを実行することができます。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 60000, // タイムアウトはすべてのテスト間で共有されます
  projects: [
    {
      name: 'staging',
      use: {
        baseURL: 'staging.example.com',
      },
      retries: 2,
    },
    {
      name: 'production',
      use: {
        baseURL: 'production.example.com',
      },
      retries: 0,
    },
  ],
});
```

## テストをプロジェクトに分割する

テストをプロジェクトに分割し、フィルターを使用してテストのサブセットを実行できます。例えば、特定のファイル名を持つすべてのテストに一致するフィルターを使用してテストを実行するプロジェクトを作成できます。また、特定のテストファイルを無視する別のテストグループを持つこともできます。

以下は、共通のタイムアウトと2つのプロジェクトを定義する例です。「Smoke」プロジェクトはリトライなしで小さなテストのサブセットを実行し、「Default」プロジェクトはリトライありで他のすべてのテストを実行します。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 60000, // タイムアウトはすべてのテスト間で共有されます
  projects: [
    {
      name: 'Smoke',
      testMatch: /.*smoke.spec.ts/,
      retries: 0,
    },
    {
      name: 'Default',
      testIgnore: /.*smoke.spec.ts/,
      retries: 2,
    },
  ],
});
```

## 依存関係

依存関係は、別のプロジェクトのテストが実行される前に実行する必要があるプロジェクトのリストです。これは、グローバルセットアップアクションを設定するのに役立ちます。プロジェクトの依存関係を使用すると、テストレポーターはセットアップテストを表示し、トレースビューアーはセットアップのトレースを記録します。

以下の例では、chromium、firefox、webkitプロジェクトがsetupプロジェクトに依存しています。

```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: '**/*.setup.ts',
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },
  ],
});
```

### 実行順序

依存関係を持つテストを扱う場合、依存関係は常に最初に実行され、このプロジェクトからのすべてのテストが合格すると、他のプロジェクトが並行して実行されます。

実行順序：

1. 'setup'プロジェクトのテストが実行されます。このプロジェクトからのすべてのテストが合格すると、依存プロジェクトからのテストが実行を開始します。
2. 'chromium'、'webkit'、'firefox'プロジェクトのテストが一緒に実行されます。デフォルトでは、これらのプロジェクトは最大ワーカー数の制限に従って並行して実行されます。

複数の依存関係がある場合、これらのプロジェクト依存関係が最初に並行して実行されます。依存関係からのテストが失敗した場合、このプロジェクトに依存するテストは実行されません。

### ティアダウン

セットアッププロジェクトに[testProject.teardown](/docs/api/class-testproject#test-project-teardown)プロパティを追加することで、セットアップをティアダウンすることもできます。ティアダウンは、依存するすべてのプロジェクトが実行された後に実行されます。

### テストフィルタリング

`--grep/--grep-invert`または`--shard`オプションが使用されている場合、テストファイル名フィルターがコマンドラインで指定されているか、`test.only()`が使用されている場合、プロジェクト依存関係チェーンの最も深いプロジェクトからのテストにのみ適用されます。つまり、一致するテストがプロジェクト依存関係を持つプロジェクトに属している場合、Playwrightはフィルターを無視してプロジェクト依存関係からすべてのテストを実行します。

## カスタムプロジェクトパラメータ

プロジェクトを使用して、カスタム設定でテストをパラメータ化することもできます。詳細は[こちらのガイド](/docs/test-parameterize#parameterized-projects)を参照してください。