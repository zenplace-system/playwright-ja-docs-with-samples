# 並列実行

## 概要

Playwright Testはテストを並列に実行します。これを実現するために、同時に実行される複数のワーカープロセスを実行します。デフォルトでは、**テストファイル**が並列に実行されます。単一ファイル内のテストは、同じワーカープロセス内で順番に実行されます。

* [`test.describe.configure`](#単一ファイル内のテストを並列化する)を使用して、**単一ファイル内のテスト**を並列に実行するように設定できます。
* [testProject.fullyParallel](/docs/api/class-testproject#test-project-fully-parallel)または[testConfig.fullyParallel](/docs/api/class-testconfig#test-config-fully-parallel)を使用して、すべてのファイル内のすべてのテストを並列に実行するように**プロジェクト全体**を設定できます。
* 並列実行を**無効**にするには、[ワーカー数を1に制限](#並列実行を無効にする)します。

[並列ワーカープロセスの数](#ワーカーを制限する)を制御し、効率性のためにテストスイート全体の[失敗数を制限](#失敗を制限し高速に失敗する)することができます。

## ワーカープロセス

すべてのテストはワーカープロセスで実行されます。これらのプロセスはOSプロセスであり、独立して実行され、テストランナーによって調整されます。すべてのワーカーは同一の環境を持ち、それぞれが独自のブラウザを起動します。

ワーカー間で通信することはできません。Playwright Testはテストを高速化するために単一のワーカーを可能な限り再利用するため、通常、複数のテストファイルが単一のワーカーで順番に実行されます。

ワーカーは[テスト失敗](/docs/test-retries#failures)後に常にシャットダウンされ、後続のテストのための新しい環境を保証します。

## ワーカーを制限する

[コマンドライン](/docs/test-cli)または[設定ファイル](/docs/test-configuration)で、並列ワーカープロセスの最大数を制御できます。

コマンドラインから：

```bash
npx playwright test --workers 4
```

設定ファイルで：

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // CIではワーカー数を制限し、ローカルではデフォルトを使用
  workers: process.env.CI ? 2 : undefined,
});
```

## 並列実行を無効にする

設定ファイルで`workers: 1`オプションを設定するか、コマンドラインに`--workers=1`を渡すことで、並列実行を無効にできます。

```bash
npx playwright test --workers=1
```

## 単一ファイル内のテストを並列化する

デフォルトでは、単一ファイル内のテストは順番に実行されます。単一ファイル内に多くの独立したテストがある場合は、[test.describe.configure()](/docs/api/class-test#test-describe-configure)を使用して並列に実行することができます。

並列テストは別々のワーカープロセスで実行され、状態やグローバル変数を共有できないことに注意してください。各テストは`beforeAll`と`afterAll`を含む、関連するすべてのフックを自分自身のために実行します。

```javascript
import { test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test('並列に実行1', async ({ page }) => { /* ... */ });
test('並列に実行2', async ({ page }) => { /* ... */ });
```

または、設定ファイルですべてのテストをこの完全並列モードに組み込むこともできます：

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
});
```

特定のプロジェクトだけを完全並列モードにすることもできます：

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 特定のプロジェクトのすべてのファイルのすべてのテストを並列に実行
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      fullyParallel: true,
    },
  ]
});
```

## シリアルモード

相互依存するテストをシリアルとして注釈を付けることができます。シリアルテストの1つが失敗すると、後続のすべてのテストはスキップされます。グループ内のすべてのテストは一緒に再試行されます。

> 注意：シリアルの使用は推奨されません。テストを分離して独立して実行できるようにする方が通常は良いです。

```javascript
import { test, type Page } from '@playwright/test';

// ファイル全体をシリアルとして注釈を付ける
test.describe.configure({ mode: 'serial' });

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test('最初に実行', async () => {
  await page.goto('https://playwright.dev/');
});

test('2番目に実行', async () => {
  await page.getByText('Get Started').click();
});
```

## 複数マシン間でテストをシャーディングする

Playwright Testはテストスイートをシャーディングできるため、複数のマシンで実行できます。詳細については[シャーディングガイド](/docs/test-sharding)を参照してください。

```bash
npx playwright test --shard=2/3
```

## 失敗を制限し高速に失敗する

`maxFailures`設定オプションを設定するか、`--max-failures`コマンドラインフラグを渡すことで、テストスイート全体の失敗したテストの数を制限できます。

「最大失敗数」を設定して実行すると、Playwright Testはこの数の失敗したテストに達した後に停止し、まだ実行されていないテストをスキップします。これは、壊れたテストスイートでリソースを無駄にしないのに役立ちます。

コマンドラインオプションの渡し方：

```bash
npx playwright test --max-failures=10
```

設定ファイルでの設定：

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // CIでリソースを節約するために失敗数を制限
  maxFailures: process.env.CI ? 10 : undefined,
});
```

## ワーカーインデックスと並列インデックス

各ワーカープロセスには2つのIDが割り当てられます：1から始まる一意のワーカーインデックスと、`0`から`workers - 1`の間の並列インデックスです。ワーカーが再起動された場合（例えば失敗後）、新しいワーカープロセスは同じ`parallelIndex`と新しい`workerIndex`を持ちます。

環境変数`process.env.TEST_WORKER_INDEX`と`process.env.TEST_PARALLEL_INDEX`からインデックスを読み取るか、[testInfo.workerIndex](/docs/api/class-testinfo#test-info-worker-index)と[testInfo.parallelIndex](/docs/api/class-testinfo#test-info-parallel-index)を通じてアクセスできます。

### 並列ワーカー間でテストデータを分離する

上記の`process.env.TEST_WORKER_INDEX`または[testInfo.workerIndex](/docs/api/class-testinfo#test-info-worker-index)を活用して、異なるワーカーで実行されるテスト間でデータベース内のユーザーデータを分離できます。ワーカーによって実行されるすべてのテストは同じユーザーを再利用します。

[`dbUserName`フィクスチャを作成](/docs/test-fixtures#creating-a-fixture)し、テストデータベースに新しいユーザーを初期化する`playwright/fixtures.ts`ファイルを作成します。ワーカーを区別するために[testInfo.workerIndex](/docs/api/class-testinfo#test-info-worker-index)を使用します。

```javascript
// playwright/fixtures.ts
import { test as baseTest, expect } from '@playwright/test';
// テストデータベースでユーザーを管理するためのプロジェクトユーティリティをインポート
import { createUserInTestDatabase, deleteUserFromTestDatabase } from './my-db-utils';

export * from '@playwright/test';

export const test = baseTest.extend<{}, { dbUserName: string }>({
  // ワーカーごとに一意のdbユーザー名を返す
  dbUserName: [async ({ }, use) => {
    // 各ワーカーの一意の識別子としてworkerIndexを使用
    const userName = `user-${test.info().workerIndex}`;
    // データベースでユーザーを初期化
    await createUserInTestDatabase(userName);
    await use(userName);
    // テスト完了後にクリーンアップ
    await deleteUserFromTestDatabase(userName);
  }, { scope: 'worker' }],
});
```

これで、各テストファイルは`@playwright/test`の代わりに私たちのフィクスチャファイルから`test`をインポートする必要があります。

```javascript
// tests/example.spec.js
// 重要：私たちのフィクスチャをインポート
import { test, expect } from '../playwright/fixtures';

test('テスト', async ({ dbUserName }) => {
  // テストでユーザー名を使用
});
```

## テスト順序を制御する

Playwright Testは、[単一ファイル内のテストを並列化](#単一ファイル内のテストを並列化する)しない限り、単一ファイルからのテストを宣言順に実行します。

Playwright Testはデフォルトでテストファイルを並列に実行するため、ファイル間のテスト実行順序に関する保証はありません。ただし、[並列実行を無効](#並列実行を無効にする)にすると、ファイルをアルファベット順に名付けるか、「テストリスト」ファイルを使用してテスト順序を制御できます。

### テストファイルをアルファベット順にソートする

**並列テスト実行を無効**にすると、Playwright Testはテストファイルをアルファベット順に実行します。テスト順序を制御するために、例えば`001-user-signin-flow.spec.ts`、`002-create-new-document.spec.ts`などの命名規則を使用できます。

### 「テストリスト」ファイルを使用する

> 警告：テストリストは推奨されず、ベストエフォートとしてのみサポートされています。VS Code拡張機能やトレースなどの一部の機能はテストリストで正しく動作しない場合があります。

テストをヘルパー関数に入れて複数のファイルに配置できます。以下の例では、テストはファイルで直接定義されるのではなく、ラッパー関数で定義されています。

```javascript
// feature-a.spec.js
import { test, expect } from '@playwright/test';

export default function createTests() {
  test('feature-a 例のテスト', async ({ page }) => {
    // ... テストはここに記述
  });
}
```

```javascript
// feature-b.spec.js
import { test, expect } from '@playwright/test';

export default function createTests() {
  test.use({ viewport: { width: 500, height: 500 } });
  test('feature-b 例のテスト', async ({ page }) => {
    // ... テストはここに記述
  });
}
```

テストの順序を制御するテストリストファイルを作成できます - 最初に`feature-b`テストを実行し、次に`feature-a`テストを実行します。各テストファイルがテストが定義されている関数を呼び出す`test.describe()`ブロックでラップされていることに注意してください。このようにして、`test.use()`呼び出しは単一ファイルからのテストにのみ影響します。

```javascript
// test.list.js
import { test } from '@playwright/test';
import featureBTests from './feature-b.spec.js';
import featureATests from './feature-a.spec.js';

test.describe(featureBTests);
test.describe(featureATests);
```

ワーカーを1に設定して並列実行を**無効**にし、テストリストファイルを指定します。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: 1,
  testMatch: 'test.list.js',
});
```

> 注意：テストをヘルパーファイルで直接定義しないでください。これにより、テストが`import`/`require`文の順序に依存するため、予期しない結果になる可能性があります。代わりに、上記の例のように、テストリストファイルによって明示的に呼び出される関数でテストをラップしてください。