# アノテーション

## 概要

Playwrightはテストレポートに表示されるタグとアノテーションをサポートしています。

独自のタグやアノテーションをいつでも追加できますが、Playwrightにはいくつかの組み込みのものがあります：

* [test.skip()](/docs/api/class-test#test-skip) - テストを無関係としてマークします。Playwrightはこのようなテストを実行しません。テストが特定の設定で適用されない場合にこのアノテーションを使用します。
* [test.fail()](/docs/api/class-test#test-fail) - テストを失敗としてマークします。Playwrightはこのテストを実行し、実際に失敗することを確認します。テストが失敗しない場合、Playwrightは警告します。
* [test.fixme()](/docs/api/class-test#test-fixme) - テストを失敗としてマークします。`fail`アノテーションとは対照的に、Playwrightはこのテストを実行しません。テストの実行が遅いまたはクラッシュする場合は`fixme`を使用します。
* [test.slow()](/docs/api/class-test#test-slow) - テストを遅いとしてマークし、テストタイムアウトを3倍にします。

アノテーションは単一のテストまたはテストのグループに追加できます。

組み込みアノテーションは条件付きにすることができ、その場合は条件が真の場合に適用され、テストフィクスチャに依存する場合があります。同じテスト上に、異なる設定で複数のアノテーションが存在する可能性があります。

## テストにフォーカスする

一部のテストにフォーカスできます。フォーカスされたテストがある場合、それらのテストのみが実行されます。

```javascript
test.only('このテストにフォーカス', async ({ page }) => {
  // プロジェクト全体でフォーカスされたテストのみを実行します。
});
```

## テストをスキップする

テストをスキップとしてマークします。

```javascript
test.skip('このテストをスキップ', async ({ page }) => {
  // このテストは実行されません
});
```

## 条件付きでテストをスキップする

条件に基づいて特定のテストをスキップできます。

```javascript
test('このテストをスキップ', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'まだ作業中');
});
```

## テストをグループ化する

テストをグループ化して論理的な名前を付けたり、before/afterフックをグループにスコープしたりできます。

```javascript
import { test, expect } from '@playwright/test';

test.describe('2つのテスト', () => {
  test('1つ目', async ({ page }) => {
    // ...
  });

  test('2つ目', async ({ page }) => {
    // ...
  });
});
```

## テストにタグを付ける

テストに`@fast`や`@slow`などのタグを付け、テストレポートでタグでフィルタリングしたい場合があります。または、特定のタグを持つテストのみを実行したい場合もあります。

テストにタグを付けるには、テストを宣言するときに追加の詳細オブジェクトを提供するか、テストタイトルに`@`トークンを追加します。タグは`@`記号で始まる必要があることに注意してください。

```javascript
import { test, expect } from '@playwright/test';

test('ログインページをテスト', {
  tag: '@fast',
}, async ({ page }) => {
  // ...
});

test('完全なレポートをテスト @slow', async ({ page }) => {
  // ...
});
```

グループ内のすべてのテストにタグを付けたり、複数のタグを提供したりすることもできます：

```javascript
import { test, expect } from '@playwright/test';

test.describe('グループ', {
  tag: '@report',
}, () => {
  test('レポートヘッダーをテスト', async ({ page }) => {
    // ...
  });

  test('完全なレポートをテスト', {
    tag: ['@slow', '@vrt'],
  }, async ({ page }) => {
    // ...
  });
});
```

[`--grep`](/docs/test-cli#reference)コマンドラインオプションを使用して、特定のタグを持つテストを実行できるようになりました。

```bash
npx playwright test --grep @fast
```

または、特定のタグを持つテストをスキップしたい場合：

```bash
npx playwright test --grep-invert @fast
```

いずれかのタグを含むテストを実行するには（論理`OR`演算子）：

```bash
npx playwright test --grep "@fast|@slow"
```

または、両方のタグを含むテストを実行するには（論理`AND`演算子）、正規表現の先読みを使用します：

```bash
npx playwright test --grep "(?=.*@fast)(?=.*@slow)"
```

[testConfig.grep](/docs/api/class-testconfig#test-config-grep)と[testProject.grep](/docs/api/class-testproject#test-project-grep)を使用して、設定ファイルでテストをフィルタリングすることもできます。

## テストにアノテーションを付ける

タグよりも実質的なものでテストに注釈を付けたい場合は、テストを宣言するときにそれを行うことができます。アノテーションには、より多くのコンテキストを提供する`type`と`description`があり、レポーターAPIで利用できます。Playwrightの組み込みHTMLレポーターは、`type`が`_`記号で始まるものを除くすべてのアノテーションを表示します。

例えば、テストに問題URLでアノテーションを付けるには：

```javascript
import { test, expect } from '@playwright/test';

test('ログインページをテスト', {
  annotation: {
    type: 'issue',
    description: 'https://github.com/microsoft/playwright/issues/23180',
  },
}, async ({ page }) => {
  // ...
});
```

グループ内のすべてのテストにアノテーションを付けたり、複数のアノテーションを提供したりすることもできます：

```javascript
import { test, expect } from '@playwright/test';

test.describe('レポートテスト', {
  annotation: { type: 'category', description: 'report' },
}, () => {
  test('レポートヘッダーをテスト', async ({ page }) => {
    // ...
  });

  test('完全なレポートをテスト', {
    annotation: [
      { type: 'issue', description: 'https://github.com/microsoft/playwright/issues/23180' },
      { type: 'performance', description: 'とても遅いテスト！' },
    ],
  }, async ({ page }) => {
    // ...
  });
});
```

## テストのグループを条件付きでスキップする

例えば、コールバックを渡すことで、Chromiumでのみテストのグループを実行できます。

```javascript
// example.spec.js
test.describe('chromiumのみ', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Chromiumのみ！');

  test.beforeAll(async () => {
    // このフックはChromiumでのみ実行されます。
  });

  test('テスト1', async ({ page }) => {
    // このテストはChromiumでのみ実行されます。
  });

  test('テスト2', async ({ page }) => {
    // このテストはChromiumでのみ実行されます。
  });
});
```

## `beforeEach`フックで`fixme`を使用する

`beforeEach`フックを実行しないようにするには、フック自体にアノテーションを配置できます。

```javascript
// example.spec.js
test.beforeEach(async ({ page, isMobile }) => {
  test.fixme(isMobile, '設定ページはまだモバイルでは動作しません');
  await page.goto('http://localhost:4000/settings');
});

test('ユーザープロフィール', async ({ page }) => {
  await page.getByText('My Profile').click();
  // ...
});
```

## ランタイムアノテーション

テストが既に実行中の場合、[`test.info().annotations`](/docs/api/class-testinfo#test-info-annotations)にアノテーションを追加できます。

```javascript
// example.spec.js
test('例のテスト', async ({ page, browser }) => {
  test.info().annotations.push({
    type: 'browser version',
    description: browser.version(),
  });
  // ...
});