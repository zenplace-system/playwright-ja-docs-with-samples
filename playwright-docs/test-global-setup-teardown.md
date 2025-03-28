# グローバルセットアップとティアダウン

## 概要

グローバルセットアップとティアダウンを設定する方法は2つあります：グローバルセットアップファイルを使用して設定ファイルの[`globalSetup`](#オプション2-globalsetupとglobalteardownの設定)で設定する方法と、[プロジェクト依存関係](#オプション1-プロジェクト依存関係)を使用する方法です。プロジェクト依存関係を使用すると、他のすべてのプロジェクトの前に実行されるプロジェクトを定義します。これはグローバルセットアップを設定する推奨方法です。プロジェクト依存関係を使用すると、HTMLレポートにグローバルセットアップが表示され、トレースビューアーがセットアップのトレースを記録し、フィクスチャを使用できます。

## オプション1: プロジェクト依存関係

[プロジェクト依存関係](/docs/api/class-testproject#test-project-dependencies)は、別のプロジェクトのテストが実行される前に実行する必要があるプロジェクトのリストです。これは、あるプロジェクトが最初に実行されることに依存するようにグローバルセットアップアクションを設定するのに役立ちます。依存関係を使用すると、グローバルセットアップがトレースやその他の成果物を生成できます。

### セットアップ

まず、「setup db」という名前の新しいプロジェクトを追加します。次に、`global.setup.ts`というファイルに一致するように[testProject.testMatch](/docs/api/class-testproject#test-project-test-match)プロパティを指定します：

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // ...
  projects: [
    {
      name: 'setup db',
      testMatch: /global\.setup\.ts/,
    },
    // {
    //   other project
    // }
  ]
});
```

次に、セットアッププロジェクトに依存するプロジェクトに[testProject.dependencies](/docs/api/class-testproject#test-project-dependencies)プロパティを追加し、前のステップで定義した依存関係プロジェクトの名前を配列に渡します：

```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // ...
  projects: [
    {
      name: 'setup db',
      testMatch: /global\.setup\.ts/,
    },
    {
      name: 'chromium with db',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup db'],
    },
  ]
});
```

この例では、「chromium with db」プロジェクトは「setup db」プロジェクトに依存しています。次に、プロジェクトのルートレベルに保存されるセットアップテストを作成します（セットアップとティアダウンコードは[test()](/docs/api/class-test#test-call)関数を呼び出して通常のテストとして定義する必要があることに注意してください）：

```javascript
// tests/global.setup.js
import { test as setup } from '@playwright/test';

setup('create new database', async ({ }) => {
  console.log('creating new database...');
  // データベースを初期化
});
```

```javascript
// tests/menu.spec.js
import { test, expect } from '@playwright/test';

test('menu', async ({ page }) => {
  // データベースに依存するテスト
});
```

### ティアダウン

セットアッププロジェクトに[testProject.teardown](/docs/api/class-testproject#test-project-teardown)プロパティを追加することで、セットアップをティアダウンできます。これは、依存するすべてのプロジェクトが実行された後に実行されます。

まず、前のステップでティアダウンプロジェクトに付けた名前「cleanup db」を持つ[testProject.teardown](/docs/api/class-testproject#test-project-teardown)プロパティをセットアッププロジェクトに追加します：

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // ...
  projects: [
    {
      name: 'setup db',
      testMatch: /global\.setup\.ts/,
      teardown: 'cleanup db',
    },
    {
      name: 'cleanup db',
      testMatch: /global\.teardown\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup db'],
    },
  ]
});
```

次に、プロジェクトのtestsディレクトリに`global.teardown.js`ファイルを作成します。これは、すべてのテストが実行された後にデータベースからデータを削除するために使用されます。

```javascript
// tests/global.teardown.js
import { test as teardown } from '@playwright/test';

teardown('delete database', async ({ }) => {
  console.log('deleting test database...');
  // データベースを削除
});
```

### その他の例

より詳細な例については、以下を参照してください：

* [認証](/docs/auth)ガイド
* ブログ記事[プロジェクト依存関係を使用したPlaywrightでのより良いグローバルセットアップ](https://dev.to/playwright/a-better-global-setup-in-playwright-reusing-login-with-project-dependencies-14)
* デモを見るための[v1.31リリースビデオ](https://youtu.be/PI50YAPTAs4)

## オプション2: globalSetupとglobalTeardownの設定

[設定ファイル](/docs/test-configuration#advanced-configuration)の`globalSetup`オプションを使用して、すべてのテストを実行する前に一度だけ何かを設定できます。グローバルセットアップファイルは、設定オブジェクトを受け取る単一の関数をエクスポートする必要があります。この関数はすべてのテストの前に一度だけ実行されます。

同様に、`globalTeardown`を使用して、すべてのテストの後に一度だけ何かを実行します。または、グローバルティアダウンとして使用される関数を`globalSetup`から返すこともできます。環境変数を使用して、ポート番号、認証トークンなどのデータをグローバルセットアップからテストに渡すことができます。

> 注意：`globalSetup`と`globalTeardown`の注意点：
>
> * [グローバルセットアップ中の失敗のトレースをキャプチャする](#グローバルセットアップ中の失敗のトレースをキャプチャする)で説明されているように明示的に有効にしない限り、これらのメソッドはトレースやアーティファクトを生成しません。
> * 設定ファイルで指定された`headless`や`testIdAttribute`などのオプションは適用されません。
> * `globalSetup`でキャッチされない例外が発生すると、Playwrightはテストを実行できなくなり、テスト結果はレポーターに表示されません。
>
> トレース、アーティファクトを生成し、設定オプションを尊重し、セットアップ失敗の場合でもレポーターにテスト結果を取得するには、[プロジェクト依存関係](#オプション1-プロジェクト依存関係)の使用を検討してください。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
});
```

### 例

以下は、一度認証を行い、テストで認証状態を再利用するグローバルセットアップの例です。設定ファイルから`baseURL`と`storageState`オプションを使用しています。

```javascript
// global-setup.js
import { chromium } from '@playwright/test';

async function globalSetup(config) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(baseURL);
  await page.getByLabel('User Name').fill('user');
  await page.getByLabel('Password').fill('password');
  await page.getByText('Sign in').click();
  await page.context().storageState({ path: storageState });
  await browser.close();
}

export default globalSetup;
```

設定ファイルで`globalSetup`、`baseURL`、`storageState`を指定します。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  use: {
    baseURL: 'http://localhost:3000/',
    storageState: 'state.json',
  },
});
```

グローバルセットアップによって設定された`storageState`を指定するため、テストは既に認証された状態で開始されます。

```javascript
import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/');
  // サインイン済み！
});
```

`process.env`を介して環境変数を設定することで、グローバルセットアップファイルから任意のデータをテストで利用できるようにすることができます。

```javascript
// global-setup.js
async function globalSetup(config) {
  process.env.FOO = 'some data';
  // または、JSONとしてより複雑なデータ構造：
  process.env.BAR = JSON.stringify({ some: 'data' });
}

export default globalSetup;
```

テストはグローバルセットアップで設定された`process.env`プロパティにアクセスできます。

```javascript
import { test } from '@playwright/test';

test('test', async ({ page }) => {
  // globalSetupで設定された環境変数はtest()内でのみ利用可能
  const { FOO, BAR } = process.env;
  // FOOとBARプロパティが設定されている
  expect(FOO).toEqual('some data');
  const complexData = JSON.parse(BAR);
  expect(BAR).toEqual({ some: 'data' });
});
```

### グローバルセットアップ中の失敗のトレースをキャプチャする

場合によっては、グローバルセットアップ中に発生した失敗のトレースをキャプチャすると便利です。これを行うには、セットアップで[トレースを開始](/docs/api/class-tracing#tracing-start)し、エラーが発生した場合にそのエラーがスローされる前に[トレースを停止](/docs/api/class-tracing#tracing-stop)する必要があります。これは、セットアップを`try...catch`ブロックでラップすることで実現できます。以下は、トレースをキャプチャするためにグローバルセットアップの例を拡張したものです。

```javascript
// global-setup.js
import { chromium } from '@playwright/test';

async function globalSetup(config) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await context.tracing.start({ screenshots: true, snapshots: true });
    await page.goto(baseURL);
    await page.getByLabel('User Name').fill('user');
    await page.getByLabel('Password').fill('password');
    await page.getByText('Sign in').click();
    await context.storageState({ path: storageState });
    await context.tracing.stop({
      path: './test-results/setup-trace.zip',
    });
    await browser.close();
  } catch (error) {
    await context.tracing.stop({
      path: './test-results/failed-setup-trace.zip',
    });
    await browser.close();
    throw error;
  }
}

export default globalSetup;