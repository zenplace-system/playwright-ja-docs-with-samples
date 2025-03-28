# ライブラリ

## 概要

Playwrightライブラリは、ブラウザの起動と操作のための統一APIを提供し、Playwright Testはそれに加えて完全に管理されたエンドツーエンドのテストランナーと体験を提供します。

ほとんどの場合、エンドツーエンドテストには`playwright`（Playwrightライブラリ）を直接使用するのではなく、`@playwright/test`（Playwright Test）を使用することをお勧めします。Playwright Testを始めるには、[入門ガイド](/docs/intro)に従ってください。

## ライブラリ使用時の違い

### ライブラリの例

以下は、Playwrightライブラリを直接使用してChromiumを起動し、ページに移動してタイトルを確認する例です：

```javascript
const assert = require('node:assert');
const { chromium, devices } = require('playwright');

(async () => {
  // セットアップ
  const browser = await chromium.launch();
  const context = await browser.newContext(devices['iPhone 11']);
  const page = await context.newPage();

  // 実際の処理
  await context.route('**.jpg', route => route.abort());
  await page.goto('https://example.com/');
  assert(await page.title() === 'Example Domain'); // 👎 Webファーストアサーションではない

  // 終了処理
  await context.close();
  await browser.close();
})();
```

`node my-script.js`で実行します。

### テストの例

同様の動作を実現するテストは次のようになります：

```javascript
const { expect, test, devices } = require('@playwright/test');

test.use(devices['iPhone 11']);

test('タイトルが正しいこと', async ({ page, context }) => {
  await context.route('**.jpg', route => route.abort());
  await page.goto('https://example.com/');
  await expect(page).toHaveTitle('Example');
});
```

`npx playwright test`で実行します。

### 主な違い

主な違いは以下の通りです：

| | ライブラリ | テスト |
|---|---|---|
| インストール | `npm install playwright` | `npm init playwright@latest` - `install`と`init`の違いに注意 |
| ブラウザのインストール | `@playwright/browser-chromium`、`@playwright/browser-firefox`、`@playwright/browser-webkit`をインストール | `npx playwright install`または単一のブラウザの場合は`npx playwright install chromium` |
| インポート元 | `playwright` | `@playwright/test` |
| 初期化 | 明示的に以下を行う必要がある：<br>1. 使用するブラウザを選択（例：`chromium`）<br>2. [browserType.launch()](/docs/api/class-browsertype#browser-type-launch)でブラウザを起動<br>3. [browser.newContext()](/docs/api/class-browser#browser-new-context)でコンテキストを作成し、コンテキストオプションを明示的に渡す（例：`devices['iPhone 11']`）<br>4. [browserContext.newPage()](/docs/api/class-browsercontext#browser-context-new-page)でページを作成 | 分離された`page`と`context`が各テストに最初から提供され、他の[組み込みフィクスチャ](/docs/test-fixtures#built-in-fixtures)も利用可能。明示的な作成は不要。テストの引数で参照すると、テストランナーがテスト用に作成します（遅延初期化）。 |
| アサーション | 組み込みのWebファーストアサーションなし | [Webファーストアサーション](/docs/test-assertions)あり：<br>• [expect(page).toHaveTitle()](/docs/api/class-pageassertions#page-assertions-to-have-title)<br>• [expect(page).toHaveScreenshot()](/docs/api/class-pageassertions#page-assertions-to-have-screenshot-1)<br><br>条件が満たされるまで自動的に待機して再試行します。 |
| タイムアウト | ほとんどの操作のデフォルトは30秒 | ほとんどの操作はタイムアウトしないが、各テストにはタイムアウト（デフォルトで30秒）があり、それを超えると失敗する |
| クリーンアップ | 明示的に以下を行う必要がある：<br>1. [browserContext.close()](/docs/api/class-browsercontext#browser-context-close)でコンテキストを閉じる<br>2. [browser.close()](/docs/api/class-browser#browser-close)でブラウザを閉じる | [組み込みフィクスチャ](/docs/test-fixtures#built-in-fixtures)の明示的なクローズは不要。テストランナーが処理します。 |
| 実行 | ライブラリを使用する場合、コードをNodeスクリプトとして実行し、場合によっては事前にコンパイルします。 | テストランナーを使用する場合、`npx playwright test`コマンドを使用します。[設定](/docs/test-configuration)と共に、テストランナーがコンパイルや実行内容と方法を処理します。 |

上記に加えて、完全な機能を備えたテストランナーであるPlaywright Testには以下が含まれます：

* [設定マトリックスとプロジェクト](/docs/test-configuration)：上記の例では、Playwrightライブラリ版で異なるデバイスやブラウザで実行したい場合、スクリプトを変更して情報を通す必要があります。Playwright Testでは、[設定のマトリックス](/docs/test-configuration)を一箇所で指定するだけで、各設定下でテストを実行します。
* [並列実行](/docs/test-parallel)
* [Webファーストアサーション](/docs/test-assertions)
* [レポート](/docs/test-reporters)
* [リトライ](/docs/test-retries)
* [簡単に有効化できるトレース](/docs/trace-viewer-intro)
* その他多数…

## 使用方法

npmまたはYarnを使用して、Node.jsプロジェクトにPlaywrightライブラリをインストールします。[システム要件](/docs/intro#system-requirements)を参照してください。

```bash
npm i -D playwright
```

ブラウザも手動でインストールするか、自動的にインストールするパッケージを追加する必要があります。

```bash
# Chromium、Firefox、WebKitブラウザをダウンロード
npx playwright install chromium firefox webkit

# または、npm install時にブラウザをダウンロードするパッケージを追加
npm i -D @playwright/browser-chromium @playwright/browser-firefox @playwright/browser-webkit
```

その他のオプションについては[ブラウザの管理](/docs/browsers#managing-browser-binaries)を参照してください。

インストール後、Node.jsスクリプトでPlaywrightをインポートし、3つのブラウザ（`chromium`、`firefox`、`webkit`）のいずれかを起動できます。

```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  // ページの作成、UI要素との対話、値のアサート
  await browser.close();
})();
```

PlaywrightのAPIは非同期で、Promiseオブジェクトを返します。コード例では読みやすさを向上させるために[async/awaitパターン](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)を使用しています。コードは自己呼び出しする無名の非同期アロー関数でラップされています。

```javascript
(async () => { // 非同期アロー関数の開始
  // 関数コード
  // ...
})(); // 関数の終了と自己呼び出し
```

## 最初のスクリプト

最初のスクリプトでは、`https://playwright.dev/`に移動し、WebKitでスクリーンショットを撮ります。

```javascript
const { webkit } = require('playwright');

(async () => {
  const browser = await webkit.launch();
  const page = await browser.newPage();
  await page.goto('https://playwright.dev/');
  await page.screenshot({ path: `example.png` });
  await browser.close();
})();
```

デフォルトでは、Playwrightはブラウザをヘッドレスモードで実行します。ブラウザUIを表示するには、ブラウザの起動時に`headless: false`フラグを渡します。`slowMo`を使用して実行を遅くすることもできます。詳細はデバッグツールの[セクション](/docs/debug)を参照してください。

```javascript
firefox.launch({ headless: false, slowMo: 50 });
```

## スクリプトの記録

[コマンドラインツール](/docs/test-cli)を使用して、ユーザーの操作を記録し、JavaScriptコードを生成できます。

```bash
npx playwright codegen wikipedia.org
```

## ブラウザのダウンロード

Playwrightブラウザをダウンロードするには：

```bash
# ブラウザを明示的にダウンロード
npx playwright install
```

または、パッケージのインストール中に自動的に対応するブラウザをダウンロードする`@playwright/browser-chromium`、`@playwright/browser-firefox`、`@playwright/browser-webkit`パッケージを追加できます。

```bash
# npmインストール時にブラウザをダウンロードするヘルパーパッケージを使用
npm install @playwright/browser-chromium
```

**ファイアウォールまたはプロキシ経由でのダウンロード**

プロキシ経由でダウンロードするには、`HTTPS_PROXY`環境変数を渡します。

```bash
# 手動
HTTPS_PROXY=https://192.0.2.1 npx playwright install

# @playwright/browser-chromium、@playwright/browser-firefox、
# @playwright/browser-webkitヘルパーパッケージ経由
HTTPS_PROXY=https://192.0.2.1 npm install
```

**アーティファクトリポジトリからのダウンロード**

デフォルトでは、PlaywrightはMicrosoftのCDNからブラウザをダウンロードします。内部アーティファクトリポジトリからダウンロードするには、`PLAYWRIGHT_DOWNLOAD_HOST`環境変数を渡します。

```bash
# 手動
PLAYWRIGHT_DOWNLOAD_HOST=192.0.2.1 npx playwright install

# @playwright/browser-chromium、@playwright/browser-firefox、
# @playwright/browser-webkitヘルパーパッケージ経由
PLAYWRIGHT_DOWNLOAD_HOST=192.0.2.1 npm install
```

**ブラウザダウンロードのスキップ**

ブラウザバイナリが別途管理されている場合など、ブラウザのダウンロードを完全に回避したい場合があります。これは、パッケージをインストールする前に`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD`変数を設定することで実現できます。

```bash
# @playwright/browser-chromium、@playwright/browser-firefox、
# @playwright/browser-webkitヘルパーパッケージを使用する場合
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install
```

## TypeScriptサポート

Playwrightには組み込みのTypeScriptサポートが含まれています。型定義は自動的にインポートされます。IDE体験を向上させるために型チェックを使用することをお勧めします。

### JavaScriptでの使用

VS CodeやWebStormで型チェックを行うには、JavaScriptファイルの先頭に以下を追加します。

```javascript
// @ts-check
// ...
```

または、JSDocを使用して変数の型を設定することもできます。

```javascript
/** @type {import('playwright').Page} */
let page;
```

### TypeScriptでの使用

TypeScriptサポートはそのまま動作します。型を明示的にインポートすることもできます。

```typescript
let page: import('playwright').Page;