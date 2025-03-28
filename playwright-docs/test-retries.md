# リトライ

## 概要

テストリトライは、テストが失敗した場合に自動的に再実行する方法です。これは、テストが不安定で断続的に失敗する場合に役立ちます。テストリトライは[設定ファイル](/docs/test-configuration)で設定します。

## 失敗

Playwright Testはワーカープロセスでテストを実行します。これらのプロセスはOSプロセスであり、独立して実行され、テストランナーによって調整されます。すべてのワーカーは同一の環境を持ち、それぞれが独自のブラウザを起動します。

次のスニペットを考えてみましょう：

```javascript
import { test } from '@playwright/test';

test.describe('suite', () => {
  test.beforeAll(async () => { /* ... */ });
  test('first good', async ({ page }) => { /* ... */ });
  test('second flaky', async ({ page }) => { /* ... */ });
  test('third good', async ({ page }) => { /* ... */ });
  test.afterAll(async () => { /* ... */ });
});
```

**すべてのテストが成功する**場合、それらは同じワーカープロセス内で順番に実行されます。

* ワーカープロセスが開始
  * `beforeAll`フックが実行される
  * `first good`が成功
  * `second flaky`が成功
  * `third good`が成功
  * `afterAll`フックが実行される

**いずれかのテストが失敗**した場合、Playwright Testはブラウザと共にワーカープロセス全体を破棄し、新しいプロセスを開始します。テストは次のテストから始まる新しいワーカープロセスで続行されます。

* ワーカープロセス#1が開始
  * `beforeAll`フックが実行される
  * `first good`が成功
  * `second flaky`が失敗
  * `afterAll`フックが実行される
* ワーカープロセス#2が開始
  * `beforeAll`フックが再度実行される
  * `third good`が成功
  * `afterAll`フックが実行される

[リトライ](#リトライ)を有効にすると、2番目のワーカープロセスは失敗したテストを再試行し、そこから続行します。

* ワーカープロセス#1が開始
  * `beforeAll`フックが実行される
  * `first good`が成功
  * `second flaky`が失敗
  * `afterAll`フックが実行される
* ワーカープロセス#2が開始
  * `beforeAll`フックが再度実行される
  * `second flaky`が再試行され成功
  * `third good`が成功
  * `afterAll`フックが実行される

このスキームは独立したテストに完璧に機能し、失敗したテストが健全なテストに影響を与えないことを保証します。

## リトライ

Playwrightは**テストリトライ**をサポートしています。有効にすると、失敗したテストは成功するか、最大リトライ回数に達するまで複数回再試行されます。デフォルトでは、失敗したテストは再試行されません。

```bash
# 失敗したテストに3回のリトライ試行を与える
npx playwright test --retries=3
```

設定ファイルでリトライを設定できます：

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 失敗したテストに3回のリトライ試行を与える
  retries: 3,
});
```

Playwright Testはテストを次のように分類します：

* "passed" - 最初の実行で合格したテスト
* "flaky" - 最初の実行で失敗したが、再試行時に合格したテスト
* "failed" - 最初の実行で失敗し、すべての再試行でも失敗したテスト

```
Running 3 tests using 1 worker
  ✓ example.spec.ts:4:2 › first passes (438ms)
  x example.spec.ts:5:2 › second flaky (691ms)
  ✓ example.spec.ts:5:2 › second flaky (522ms)
  ✓ example.spec.ts:6:2 › third passes (932ms)
  1 flaky
    example.spec.ts:5:2 › second flaky
  2 passed (4s)
```

[testInfo.retry](/docs/api/class-testinfo#test-info-retry)を使用して、実行時にリトライを検出できます。これは任意のテスト、フック、またはフィクスチャからアクセスできます。以下は、リトライの前にサーバー側の状態をクリアする例です。

```javascript
import { test, expect } from '@playwright/test';

test('my test', async ({ page }, testInfo) => {
  if (testInfo.retry)
    await cleanSomeCachesOnTheServer();
  // ...
});
```

[test.describe.configure()](/docs/api/class-test#test-describe-configure)を使用して、特定のテストグループまたは単一のファイルのリトライを指定できます。

```javascript
import { test, expect } from '@playwright/test';

test.describe(() => {
  // このdescribeグループ内のすべてのテストは2回のリトライ試行を取得します。
  test.describe.configure({ retries: 2 });

  test('test 1', async ({ page }) => {
    // ...
  });

  test('test 2', async ({ page }) => {
    // ...
  });
});
```

## シリアルモード

依存するテストをグループ化して、常に一緒に順番に実行されるようにするには、[test.describe.serial()](/docs/api/class-test#test-describe-serial)を使用します。テストの1つが失敗すると、後続のすべてのテストはスキップされます。グループ内のすべてのテストは一緒に再試行されます。

`test.describe.serial`を使用する次のスニペットを考えてみましょう：

```javascript
import { test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => { /* ... */ });
test('first good', async ({ page }) => { /* ... */ });
test('second flaky', async ({ page }) => { /* ... */ });
test('third good', async ({ page }) => { /* ... */ });
```

[リトライ](#リトライ)なしで実行すると、失敗後のすべてのテストはスキップされます：

* ワーカープロセス#1：
  * `beforeAll`フックが実行される
  * `first good`が成功
  * `second flaky`が失敗
  * `third good`は完全にスキップされる

[リトライ](#リトライ)ありで実行すると、すべてのテストが一緒に再試行されます：

* ワーカープロセス#1：
  * `beforeAll`フックが実行される
  * `first good`が成功
  * `second flaky`が失敗
  * `third good`はスキップされる
* ワーカープロセス#2：
  * `beforeAll`フックが再度実行される
  * `first good`が再度成功
  * `second flaky`が成功
  * `third good`が成功

> 注意：通常、テストを分離して、効率的に実行し、独立して再試行できるようにする方が良いです。

## テスト間で単一のページを再利用する

Playwright Testは各テストに分離された[Page](/docs/api/class-page)オブジェクトを作成します。ただし、複数のテスト間で単一の[Page](/docs/api/class-page)オブジェクトを再利用したい場合は、[test.beforeAll()](/docs/api/class-test#test-before-all)で独自のページを作成し、[test.afterAll()](/docs/api/class-test#test-after-all)で閉じることができます。

```javascript
// example.spec.js
import { test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page;

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