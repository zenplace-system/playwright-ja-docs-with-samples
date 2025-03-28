# フィクスチャ

## 概要

Playwright Testはテストフィクスチャの概念に基づいています。テストフィクスチャは各テストの環境を確立し、テストに必要なものを提供します。フィクスチャはテスト間で分離されており、共通のセットアップではなく、テストの意味に基づいてテストをグループ化できます。

## 組み込みフィクスチャ

最初のテストですでにテストフィクスチャを使用しています。

```javascript
import { test, expect } from '@playwright/test';

test('基本テスト', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
```

`{ page }`引数は、Playwright Testに`page`フィクスチャをセットアップしてテスト関数に提供するよう指示します。

主要な組み込みフィクスチャ：

| フィクスチャ | 説明 |
|------------|------|
| page | このテスト実行用の分離されたページ |
| context | このテスト実行用の分離されたコンテキスト |
| browser | テスト間で共有されるブラウザ |
| browserName | 現在実行中のブラウザの名前（`chromium`、`firefox`、`webkit`のいずれか） |
| request | このテスト実行用の分離されたAPIRequestContextインスタンス |

## フィクスチャの利点

フィクスチャには、before/afterフックに比べて以下の利点があります：

* **カプセル化** - セットアップとティアダウンが同じ場所にあり、書きやすい
* **再利用可能** - テストファイル間で再利用できる
* **オンデマンド** - 必要なフィクスチャだけがセットアップされる
* **組み合わせ可能** - 複雑な動作を提供するために相互に依存できる
* **柔軟** - テストは必要な環境に合わせてフィクスチャを組み合わせられる
* **グループ化の簡素化** - 環境設定のためにテストを`describe`でラップする必要がない

## フィクスチャの作成

独自のフィクスチャを作成するには、[test.extend()](/docs/api/class-test#test-extend)を使用して新しい`test`オブジェクトを作成します。

以下は[Page Object Model](/docs/pom)パターンに従った`todoPage`と`settingsPage`の2つのフィクスチャを作成する例です：

```typescript
// my-test.ts
import { test as base } from '@playwright/test';
import { TodoPage } from './todo-page';
import { SettingsPage } from './settings-page';

// フィクスチャの型を宣言
type MyFixtures = {
  todoPage: TodoPage;
  settingsPage: SettingsPage;
};

// "todoPage"と"settingsPage"を提供するベーステストを拡張
export const test = base.extend<MyFixtures>({
  todoPage: async ({ page }, use) => {
    // フィクスチャのセットアップ
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.addToDo('item1');
    await todoPage.addToDo('item2');
    
    // テストでフィクスチャ値を使用
    await use(todoPage);
    
    // フィクスチャのクリーンアップ
    await todoPage.removeAll();
  },
  
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
});

export { expect } from '@playwright/test';
```

> 注意: カスタムフィクスチャ名は文字またはアンダースコアで始まり、文字、数字、アンダースコアのみを含む必要があります。

## フィクスチャの使用

テスト関数の引数でフィクスチャを指定するだけで、テストランナーがそれを処理します。フィクスチャはフックや他のフィクスチャでも使用できます。

```javascript
import { test, expect } from './my-test';

test.beforeEach(async ({ settingsPage }) => {
  await settingsPage.switchToDarkMode();
});

test('基本テスト', async ({ todoPage, page }) => {
  await todoPage.addToDo('何か良いこと');
  await expect(page.getByTestId('todo-title')).toContainText(['何か良いこと']);
});
```

## フィクスチャのオーバーライド

既存のフィクスチャをオーバーライドして、ニーズに合わせることもできます。以下の例では、自動的に`baseURL`にナビゲートすることで`page`フィクスチャをオーバーライドしています：

```javascript
import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ baseURL, page }, use) => {
    await page.goto(baseURL);
    await use(page);
  },
});
```

この例では、`page`フィクスチャは[testOptions.baseURL](/docs/api/class-testoptions#test-options-base-url)などの他の組み込みフィクスチャに依存できます。

## ワーカースコープのフィクスチャ

Playwright Testは[ワーカープロセス](/docs/test-parallel)を使用してテストファイルを実行します。ワーカーフィクスチャは各ワーカープロセスに対してセットアップされます。サービスの設定やサーバーの実行などに使用できます。

以下の例では、同じワーカー内のすべてのテストで共有される`account`フィクスチャを作成し、各テストでこのアカウントにログインするように`page`フィクスチャをオーバーライドします：

```typescript
import { test as base } from '@playwright/test';

type Account = {
  username: string;
  password: string;
};

export const test = base.extend<{}, { account: Account }>({
  account: [async ({ browser }, use, workerInfo) => {
    // ユニークなユーザー名
    const username = 'user' + workerInfo.workerIndex;
    const password = 'verysecure';
    
    // Playwrightでアカウントを作成
    const page = await browser.newPage();
    await page.goto('/signup');
    await page.getByLabel('User Name').fill(username);
    await page.getByLabel('Password').fill(password);
    await page.getByText('Sign up').click();
    
    // 問題ないことを確認
    await expect(page.getByTestId('result')).toHaveText('Success');
    
    // クリーンアップを忘れずに
    await page.close();
    
    // アカウント値を使用
    await use({ username, password });
  }, { scope: 'worker' }],
  
  page: async ({ page, account }, use) => {
    // アカウントでサインイン
    const { username, password } = account;
    await page.goto('/signin');
    await page.getByLabel('User Name').fill(username);
    await page.getByLabel('Password').fill(password);
    await page.getByText('Sign in').click();
    await expect(page.getByTestId('userinfo')).toHaveText(username);
    
    // テストでサインイン済みページを使用
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

## 自動フィクスチャ

自動フィクスチャは、テストが直接リストしていなくても、各テスト/ワーカーに対してセットアップされます。自動フィクスチャを作成するには、タプル構文を使用して`{ auto: true }`を渡します。

以下は、テストが失敗したときに自動的にデバッグログを添付するフィクスチャの例です：

```javascript
import debug from 'debug';
import fs from 'fs';
import { test as base } from '@playwright/test';

export const test = base.extend<{ saveLogs: void }>({
  saveLogs: [async ({}, use, testInfo) => {
    // テスト中にログを収集
    const logs = [];
    debug.log = (...args) => logs.push(args.map(String).join(''));
    debug.enable('myserver');
    
    await use();
    
    // テスト後、テストが合格したか失敗したかを確認できる
    if (testInfo.status !== testInfo.expectedStatus) {
      // outputPath() APIは一意のファイル名を保証
      const logFile = testInfo.outputPath('logs.txt');
      await fs.promises.writeFile(logFile, logs.join('\n'), 'utf8');
      testInfo.attachments.push({ name: 'logs', contentType: 'text/plain', path: logFile });
    }
  }, { auto: true }],
});

export { expect } from '@playwright/test';
```

## フィクスチャのタイムアウト

デフォルトでは、フィクスチャはテストとタイムアウトを共有します。ただし、特に[ワーカースコープ](#ワーカースコープのフィクスチャ)の遅いフィクスチャには、別のタイムアウトを設定すると便利です：

```javascript
import { test as base, expect } from '@playwright/test';

const test = base.extend<{ slowFixture: string }>({
  slowFixture: [async ({}, use) => {
    // ... 遅い操作を実行 ...
    await use('hello');
  }, { timeout: 60000 }]
});

test('例のテスト', async ({ slowFixture }) => {
  // ...
});
```

## フィクスチャオプション

Playwright Testは、個別に設定できる複数のテストプロジェクトの実行をサポートしています。「オプション」フィクスチャを使用して、設定オプションを宣言的で型チェックされたものにできます。

以下では、他の例の`todoPage`フィクスチャに加えて`defaultItem`オプションを作成します：

```typescript
import { test as base } from '@playwright/test';
import { TodoPage } from './todo-page';

// 型チェックするためのオプションを宣言
export type MyOptions = {
  defaultItem: string;
};

type MyFixtures = {
  todoPage: TodoPage;
};

// オプションとフィクスチャの両方の型を指定
export const test = base.extend<MyOptions & MyFixtures>({
  // オプションを定義し、デフォルト値を提供
  // 後で設定でオーバーライドできる
  defaultItem: ['Something nice', { option: true }],
  
  // "todoPage"フィクスチャはオプションに依存
  todoPage: async ({ page, defaultItem }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.addToDo(defaultItem);
    await use(todoPage);
    await todoPage.removeAll();
  },
});

export { expect } from '@playwright/test';
```

設定ファイルで`defaultItem`オプションを設定できます：

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
import type { MyOptions } from './my-test';

export default defineConfig<MyOptions>({
  projects: [
    {
      name: 'shopping',
      use: { defaultItem: '牛乳を買う' },
    },
    {
      name: 'wellbeing',
      use: { defaultItem: '運動する！' },
    },
  ]
});
```

## 複数のモジュールからのカスタムフィクスチャの結合

複数のファイルやモジュールからテストフィクスチャをマージできます：

```typescript
// fixtures.ts
import { mergeTests } from '@playwright/test';
import { test as dbTest } from 'database-test-utils';
import { test as a11yTest } from 'a11y-test-utils';

export const test = mergeTests(dbTest, a11yTest);
```

```typescript
// test.spec.ts
import { test } from './fixtures';

test('合格', async ({ database, page, a11y }) => {
  // databaseとa11yフィクスチャを使用
});
```

## グローバルbeforeEach/afterEachフックの追加

グローバルに実行される`beforeEach`/`afterEach`フックを宣言するには、次のように自動フィクスチャとして宣言できます：

```typescript
// fixtures.ts
import { test as base } from '@playwright/test';

export const test = base.extend<{ forEachTest: void }>({
  forEachTest: [async ({ page }, use) => {
    // このコードは各テストの前に実行される
    await page.goto('http://localhost:8000');
    await use();
    // このコードは各テストの後に実行される
    console.log('最後のURL:', page.url());
  }, { auto: true }], // 自動的に各テストで開始
});
```

## グローバルbeforeAll/afterAllフックの追加

グローバルに実行される`beforeAll`/`afterAll`フックを宣言するには、次のように`scope: 'worker'`を持つ自動フィクスチャとして宣言できます：

```typescript
// fixtures.ts
import { test as base } from '@playwright/test';

export const test = base.extend<{}, { forEachWorker: void }>({
  forEachWorker: [async ({}, use) => {
    // このコードはワーカープロセス内のすべてのテストの前に実行される
    console.log(`テストワーカー ${test.info().workerIndex} を開始`);
    await use();
    // このコードはワーカープロセス内のすべてのテストの後に実行される
    console.log(`テストワーカー ${test.info().workerIndex} を停止`);
  }, { scope: 'worker', auto: true }], // 自動的に各ワーカーで開始
});