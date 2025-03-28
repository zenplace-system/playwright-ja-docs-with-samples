# Playwrightページ

## ページ

各[BrowserContext](/docs/api/class-browsercontext)は複数のページを持つことができます。[Page](/docs/api/class-page)はブラウザコンテキスト内の単一のタブまたはポップアップウィンドウを指します。URLへのナビゲーションやページコンテンツとの対話に使用します。

```javascript
// ページを作成
const page = await context.newPage();

// 明示的にナビゲーション（ブラウザでURLを入力するのと同様）
await page.goto('http://example.com');

// 入力フィールドに入力
await page.locator('#search').fill('query');

// リンクをクリックして暗黙的にナビゲーション
await page.locator('#submit').click();

// 新しいURLを確認
console.log(page.url());
```

## 複数ページ

各ブラウザコンテキストは複数のページ（タブ）をホストできます。

* 各ページはフォーカスされたアクティブなページのように動作します。ページを前面に持ってくる必要はありません。
* コンテキスト内のページは、ビューポートサイズ、カスタムネットワークルート、ブラウザロケールなどのコンテキストレベルのエミュレーションを尊重します。

```javascript
// 2つのページを作成
const pageOne = await context.newPage();
const pageTwo = await context.newPage();

// ブラウザコンテキストのページを取得
const allPages = context.pages();
```

## 新しいページの処理

ブラウザコンテキストの`page`イベントを使用して、コンテキストで作成された新しいページを取得できます。これは`target="_blank"`リンクによって開かれた新しいページを処理するために使用できます。

```javascript
// クリック前に新しいページを待ち始めます。awaitはここでは使いません。
const pagePromise = context.waitForEvent('page');
await page.getByText('新しいタブを開く').click();
const newPage = await pagePromise;

// 新しいページと通常通り対話
await newPage.getByRole('button').click();
console.log(await newPage.title());
```

新しいページをトリガーするアクションが不明な場合は、次のパターンを使用できます。

```javascript
// コンテキスト内のすべての新しいページ（ポップアップを含む）を取得
context.on('page', async page => {
  await page.waitForLoadState();
  console.log(await page.title());
});
```

## ポップアップの処理

ページがポップアップを開く場合（例：`target="_blank"`リンクで開かれたページ）、ページの`popup`イベントをリッスンすることで参照を取得できます。

このイベントは`browserContext.on('page')`イベントに加えて発行されますが、このページに関連するポップアップに対してのみ発行されます。

```javascript
// クリック前にポップアップを待ち始めます。awaitはここでは使いません。
const popupPromise = page.waitForEvent('popup');
await page.getByText('ポップアップを開く').click();
const popup = await popupPromise;

// 新しいポップアップと通常通り対話
await popup.getByRole('button').click();
console.log(await popup.title());
```

ポップアップをトリガーするアクションが不明な場合は、次のパターンを使用できます。

```javascript
// ポップアップが開いたときにすべて取得
page.on('popup', async popup => {
  await popup.waitForLoadState();
  console.log(await popup.title());
});