# タイムアウト

Playwright Testには様々なタスクに対して設定可能な複数のタイムアウトがあります。

| タイムアウト | デフォルト | 説明 |
|------------|----------|------|
| テストタイムアウト | 30,000 ms | 各テストのタイムアウト<br>設定での指定: `{ timeout: 60_000 }`<br>テスト内での上書き: `test.setTimeout(120_000)` |
| アサーションタイムアウト | 5,000 ms | 各アサーションのタイムアウト<br>設定での指定: `{ expect: { timeout: 10_000 } }`<br>テスト内での上書き: `expect(locator).toBeVisible({ timeout: 10_000 })` |

## テストタイムアウト

Playwright Testは各テストに対してタイムアウトを適用します（デフォルトは30秒）。テスト関数、フィクスチャのセットアップ、`beforeEach`フックにかかる時間がテストタイムアウトに含まれます。

タイムアウトしたテストは次のようなエラーを生成します：

```
example.spec.ts:3:1 › basic test ===========================
Timeout of 30000ms exceeded.
```

テスト関数が終了した後、フィクスチャのティアダウンと`afterEach`フックには、同じ値の別個のタイムアウトが共有されます。

同じタイムアウト値は`beforeAll`と`afterAll`フックにも適用されますが、これらはどのテストとも時間を共有しません。

### 設定でテストタイムアウトを設定

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 120_000,
});
```

### 単一テストのタイムアウトを設定

```javascript
// example.spec.js
import { test, expect } from '@playwright/test';

test('遅いテスト', async ({ page }) => {
  test.slow(); // デフォルトタイムアウトを3倍にする簡単な方法
  // ...
});

test('非常に遅いテスト', async ({ page }) => {
  test.setTimeout(120_000);
  // ...
});
```

### `beforeEach`フックからタイムアウトを変更

```javascript
// example.spec.js
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  // このフックを実行するすべてのテストのタイムアウトを30秒延長
  testInfo.setTimeout(testInfo.timeout + 30_000);
});
```

### `beforeAll`/`afterAll`フックのタイムアウトを変更

`beforeAll`と`afterAll`フックには、デフォルトでテストタイムアウトと同じ別個のタイムアウトがあります。フック内で[testInfo.setTimeout()](/docs/api/class-testinfo#test-info-set-timeout)を呼び出すことで、各フックのタイムアウトを個別に変更できます。

```javascript
// example.spec.js
import { test, expect } from '@playwright/test';

test.beforeAll(async () => {
  // このフックのタイムアウトを設定
  test.setTimeout(60000);
});
```

## アサーションタイムアウト

[expect(locator).toHaveText()](/docs/api/class-locatorassertions#locator-assertions-to-have-text)のような自動再試行アサーションには、デフォルトで5秒の別個のタイムアウトがあります。アサーションタイムアウトはテストタイムアウトとは無関係です。次のようなエラーが発生します：

```
example.spec.ts:3:1 › basic test ===========================
Error: expect(received).toHaveText(expected)
Expected string: "my text"
Received string: ""
Call log:
  - expect.toHaveText with timeout 5000ms
  - waiting for "locator('button')"
```

### 設定でアサーションタイムアウトを設定

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    timeout: 10_000,
  },
});
```

### 単一アサーションのタイムアウトを指定

```javascript
// example.spec.js
import { test, expect } from '@playwright/test';

test('例', async ({ page }) => {
  await expect(locator).toHaveText('hello', { timeout: 10_000 });
});
```

## グローバルタイムアウト

Playwright Testはテスト実行全体のタイムアウトをサポートしています。これにより、すべてが誤った場合の過剰なリソース使用を防ぎます。デフォルトのグローバルタイムアウトはありませんが、設定で合理的なタイムアウト（例えば1時間）を設定できます。グローバルタイムアウトは次のようなエラーを生成します：

```
Running 1000 tests using 10 workers
  514 skipped
  486 passed
  Timed out waiting 3600s for the entire test run
```

設定でグローバルタイムアウトを設定できます：

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalTimeout: 3_600_000,
});
```

## 高度な設定：低レベルタイムアウト

これらはテストランナーによって事前設定された低レベルのタイムアウトです。通常、これらを変更する必要はありません。

| タイムアウト | デフォルト | 説明 |
|------------|----------|------|
| アクションタイムアウト | タイムアウトなし | 各アクションのタイムアウト<br>設定での指定: `{ use: { actionTimeout: 10_000 } }`<br>テスト内での上書き: `locator.click({ timeout: 10_000 })` |
| ナビゲーションタイムアウト | タイムアウトなし | 各ナビゲーションアクションのタイムアウト<br>設定での指定: `{ use: { navigationTimeout: 30_000 } }`<br>テスト内での上書き: `page.goto('/', { timeout: 30_000 })` |
| グローバルタイムアウト | タイムアウトなし | テスト実行全体のグローバルタイムアウト<br>設定での指定: `{ globalTimeout: 3_600_000 }` |
| `beforeAll`/`afterAll`タイムアウト | 30,000 ms | フックのタイムアウト<br>フック内での設定: `test.setTimeout(60_000)` |
| フィクスチャタイムアウト | タイムアウトなし | 個々のフィクスチャのタイムアウト<br>フィクスチャでの設定: `{ scope: 'test', timeout: 30_000 }` |

### 設定でアクションとナビゲーションのタイムアウトを設定

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
  },
});
```

### 単一アクションのタイムアウトを設定

```javascript
// example.spec.js
import { test, expect } from '@playwright/test';

test('基本テスト', async ({ page }) => {
  await page.goto('https://playwright.dev', { timeout: 30000 });
  await page.getByText('Get Started').click({ timeout: 10000 });
});
```

## フィクスチャタイムアウト

デフォルトでは、[フィクスチャ](/docs/test-fixtures)はテストとタイムアウトを共有します。ただし、特に[ワーカースコープ](/docs/test-fixtures#worker-scoped-fixtures)の遅いフィクスチャには、別個のタイムアウトを設定すると便利です。これにより、全体的なテストタイムアウトを小さく保ちながら、遅いフィクスチャにより多くの時間を与えることができます。

```javascript
// example.spec.js
import { test as base, expect } from '@playwright/test';

const test = base.extend<{ slowFixture: string }>({
  slowFixture: [async ({}, use) => {
    // ... 遅い操作を実行 ...
    await use('hello');
  }, { timeout: 60_000 }]
});

test('例のテスト', async ({ slowFixture }) => {
  // ...
});