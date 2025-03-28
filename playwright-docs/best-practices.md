# Playwrightのベストプラクティス

## はじめに

このガイドは、ベストプラクティスに従って、より堅牢なテストを書くための参考になります。

## テストの哲学

### ユーザーに見える動作をテストする

自動テストは、エンドユーザー向けのアプリケーションが正しく動作することを検証すべきです。関数名、配列構造、CSSクラス名など、実装の詳細に依存しないようにしましょう。エンドユーザーはページにレンダリングされたものを見て操作するので、テストも同様にレンダリングされた出力のみと対話すべきです。

### テストを可能な限り独立させる

各テストは他のテストから完全に独立して、ローカルストレージ、セッションストレージ、データ、クッキーなどを独自に持ち、単独で実行できるようにすべきです。[テストの分離](/docs/browser-contexts)により、再現性が向上し、デバッグが容易になり、連鎖的なテスト失敗を防ぎます。

テストの特定の部分を繰り返さないようにするには、[beforeとafterフック](/docs/api/class-test)を使用できます。テストファイル内にbeforeフックを追加し、各テストの前に特定のURLにアクセスしたり、アプリの特定の部分にログインしたりする処理を実行できます。

```javascript
import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // 各テストの前に実行され、各ページにサインインします
  await page.goto('https://github.com/login');
  await page.getByLabel('Username or email address').fill('username');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
});

test('最初のテスト', async ({ page }) => {
  // pageは既にサインイン済み
});

test('2番目のテスト', async ({ page }) => {
  // pageは既にサインイン済み
});
```

[setupプロジェクト](/docs/auth#basic-shared-account-in-all-tests)を使用して、サインイン状態を再利用することもできます。これにより、一度だけログインし、すべてのテストでログインステップをスキップできます。

### サードパーティの依存関係をテストしない

自分がコントロールできるものだけをテストしましょう。外部サイトやコントロールできないサードパーティサーバーへのリンクはテストしないでください。時間がかかるだけでなく、リンク先のページの内容やクッキーバナー、オーバーレイページなど、テストが失敗する原因となる要素をコントロールできません。

代わりに、[Playwright Network API](/docs/network#handle-requests)を使用して、必要なレスポンスを保証します。

```javascript
await page.route('**/api/fetch_data_third_party_dependency', route => route.fulfill({
  status: 200,
  body: testData,
}));
await page.goto('https://example.com');
```

### データベースを使ったテスト

データベースを扱う場合は、データを制御できることを確認してください。ステージング環境でテストし、環境が変化しないようにします。ビジュアルリグレッションテストの場合は、OS、ブラウザバージョンが同じであることを確認してください。

## ベストプラクティス

### ロケーターを使用する

Webページの要素を見つけるには、Playwrightの[ロケーター](/docs/locators)を使用します。ロケーターは自動待機と再試行機能を備えています。自動待機とは、Playwrightが要素に対して一連のアクションを実行する前に、要素が表示され有効化されているなどのチェックを行うことです。堅牢なテストを作成するためには、ユーザー向けの属性と明示的な契約を優先することをお勧めします。

```javascript
// 👍
page.getByRole('button', { name: '送信' });
```

#### チェーンとフィルタリングを使用する

ロケーターは[チェーン](/docs/locators#matching-inside-a-locator)して、ページの特定の部分に検索範囲を絞り込むことができます。

```javascript
const product = page.getByRole('listitem').filter({ hasText: '製品2' });
```

また、ロケーターをテキストや別のロケーターで[フィルタリング](/docs/locators#filtering-locators)することもできます。

```javascript
await page
  .getByRole('listitem')
  .filter({ hasText: '製品2' })
  .getByRole('button', { name: 'カートに追加' })
  .click();
```

#### XPathやCSSセレクターよりもユーザー向け属性を優先する

DOMは簡単に変更される可能性があるため、テストがDOM構造に依存していると、テストが失敗する原因になります。例えば、このボタンをCSSクラスで選択した場合、デザイナーが何か変更するとクラスが変わり、テストが失敗する可能性があります。

```javascript
// 👎
page.locator('button.buttonIcon.episode-actions-later');
```

DOM構造の変更に影響されないロケーターを使用しましょう。

```javascript
// 👍
page.getByRole('button', { name: '送信' });
```

### ロケーターを生成する

Playwrightには、テストを生成し、適切なロケーターを選択してくれる[テストジェネレーター](/docs/codegen)があります。ページを分析し、role、text、test idロケーターを優先して最適なロケーターを選択します。ジェネレーターが複数の要素に一致するロケーターを見つけた場合、ターゲット要素を一意に識別するためにロケーターを改善するので、ロケーターによるテスト失敗を心配する必要はありません。

#### `codegen`を使用してロケーターを生成する

ロケーターを選択するには、`codegen`コマンドの後にロケーターを選択したいURLを指定して実行します。

```bash
# npm
npx playwright codegen playwright.dev

# yarn
yarn playwright codegen playwright.dev

# pnpm
pnpm exec playwright codegen playwright.dev
```

これにより、新しいブラウザウィンドウとPlaywright inspectorが開きます。ロケーターを選択するには、まず「録画」ボタンをクリックして録画を停止します。デフォルトでは、`codegen`コマンドを実行すると新しい録画が開始されます。録画を停止すると、「ロケーターを選択」ボタンがクリック可能になります。

ブラウザウィンドウで任意の要素にカーソルを合わせると、カーソルの下にハイライトされたロケーターが表示されます。要素をクリックすると、ロケーターがPlaywright inspectorに追加されます。ロケーターをコピーしてテストファイルに貼り付けるか、Playwright inspectorでロケーターを編集（テキストの変更など）して、ブラウザウィンドウで結果を確認できます。

![codegenでロケーターを生成する](https://user-images.githubusercontent.com/13063165/212103268-e7d8ee8b-d307-4cba-be13-831f3fbb1f40.png)

#### VS Code拡張機能を使用してロケーターを生成する

[VS Code拡張機能](/docs/getting-started-vscode)を使用してロケーターの生成やテストの記録も可能です。VS Code拡張機能は、テストの作成、実行、デバッグに優れた開発者体験を提供します。

![VS CodeのcodegenでロケーターをVS Code生成する](https://user-images.githubusercontent.com/13063165/212269873-aca04043-16ce-4627-906f-7351d09740ab.png)

### Webファーストのアサーションを使用する

アサーションは、期待される結果と実際の結果が一致したかどうかを検証する方法です。[Webファーストのアサーション](/docs/test-assertions)を使用すると、Playwrightは期待される条件が満たされるまで待機します。例えば、アラートメッセージをテストする場合、メッセージを表示するボタンをクリックし、アラートメッセージが表示されることをチェックします。アラートメッセージが0.5秒後に表示される場合、`toBeVisible()`などのアサーションは必要に応じて待機して再試行します。

```javascript
// 👍
await expect(page.getByText('ようこそ')).toBeVisible();

// 👎
expect(await page.getByText('ようこそ').isVisible()).toBe(true);
```

#### 手動アサーションを使用しない

expectの前にawaitを使用しない手動アサーションは避けてください。以下のコードでは、awaitがexpectの内部にあります。`isVisible()`のようなアサーションを使用すると、テストは1秒も待機せず、単にロケーターがあるかを確認して即座に結果を返します。

```javascript
// 👎
expect(await page.getByText('ようこそ').isVisible()).toBe(true);
```

代わりに、`toBeVisible()`などのWebファーストアサーションを使用してください。

```javascript
// 👍
await expect(page.getByText('ようこそ')).toBeVisible();
```

### デバッグを設定する

#### ローカルデバッグ

ローカルデバッグには、[VS Code拡張機能](/docs/getting-started-vscode)をインストールして[VS Codeでテストをライブデバッグする](/docs/getting-started-vscode#live-debugging)ことをお勧めします。実行したいテストの行の横を右クリックしてデバッグモードでテストを実行できます。これにより、ブラウザウィンドウが開き、ブレークポイントが設定された場所で一時停止します。

#### CI上のデバッグ

CIで失敗したテストのデバッグには、次のようなものを含めることをお勧めします：

1. [トレース](/docs/trace-viewer)を保存し、テスト失敗のステップバイステップ再生を可能にする
2. [HTML Report](/docs/test-reporters#html-reporter)に失敗したテストの概要を表示する
3. スクリーンショットを撮影してテストが失敗した直前の状態を確認する

### 複数のブラウザをテストする

Playwrightを使用すると、プラットフォームに関係なく、すべての[ブラウザ](/docs/test-projects#configure-projects-for-multiple-browsers)でサイトを簡単にテストできます。すべてのブラウザでテストすることで、アプリがすべてのユーザーに対して機能することを確認できます。設定ファイルでプロジェクトを設定し、名前と使用するブラウザやデバイスを追加できます。

```javascript
// playwright.config.ts
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
  ],
});
```

### モバイルサポートを追加する

Playwrightを使用すると、モバイルブラウザでサイトをエミュレートできます。構成ファイルにモバイルデバイスを定義し、テスト時にそれを選択できます。デフォルトでは、Playwrightはモバイルデバイスのviewport、device-scale-factor、user-agent、touch、mobileなどを含む現実的な端末エミュレーションをデフォルトで提供します。

```javascript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
```

モバイルブラウザのテストを実行するには：

```bash
npx playwright test --project="mobile chrome"
```

### ビジュアルテストを追加する

[スクリーンショット](/docs/screenshots)と[ビジュアルコンパリソン](/docs/test-assertions#visual-comparisons)を使用して、ページのビジュアルリグレッションをテストできます。画像をキャプチャし、基準として保存します。後続のテストでは、新しいスクリーンショットを既存の基準と比較します。

```javascript
// page.jsxのスクリーンショットを取得し、ビジュアルリグレッションテストを行う
await expect(page).toHaveScreenshot('page.png');
```

初回実行時に`-u`フラグを使用してスクリーンショットを生成します：

```bash
npx playwright test --update-snapshots
```

### レポートビューア

テストが失敗した場合、Playwrightはテストのどの部分が失敗したかを示すエラーメッセージを表示します。これはVS Code、ターミナル、HTMLレポート、トレースビューアで確認できます。また、[ソフトアサーション](/docs/test-assertions#soft-assertions)も使用できます。これらはテスト実行を即座に終了せず、テスト終了後に失敗したアサーションのリストをまとめて表示します。

```javascript
// 失敗してもテストを停止しないいくつかのチェックを行う
await expect.soft(page.getByTestId('status')).toHaveText('成功');

// テストを続行して他のことをチェックする
await page.getByRole('link', { name: '次のページ' }).click();
```