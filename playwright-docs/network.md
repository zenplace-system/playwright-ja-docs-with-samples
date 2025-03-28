# Playwrightネットワーク

## 概要

PlaywrightはブラウザのネットワークトラフィックをHTTPとHTTPSの両方で**監視**および**変更**するためのAPIを提供します。ページが行うあらゆるリクエスト（[XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)や[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)リクエストを含む）を追跡、変更、処理できます。

## モックAPI

[APIモッキングガイド](/docs/mock)をチェックして、以下の方法を学びましょう：

* APIリクエストをモックしてAPIに到達しないようにする
* APIリクエストを実行してレスポンスを変更する
* HARファイルを使用してネットワークリクエストをモックする

## ネットワークモッキング

ネットワークリクエストをモックするために特別な設定は必要ありません。ブラウザコンテキスト用のカスタム[Route](/docs/api/class-route)を定義するだけです。

```javascript
// example.spec.js
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  // このファイルの各テストでCSSリクエストをブロック
  await context.route(/.css$/, route => route.abort());
});

test('CSSなしでページを読み込む', async ({ page }) => {
  await page.goto('https://playwright.dev');
  // ... テストはここに記述
});
```

または、[page.route()](/docs/api/class-page#page-route)を使用して単一ページでネットワークをモックすることもできます。

```javascript
// example.spec.js
import { test, expect } from '@playwright/test';

test('画像なしでページを読み込む', async ({ page }) => {
  // pngとjpeg画像をブロック
  await page.route(/(png|jpeg)$/, route => route.abort());
  await page.goto('https://playwright.dev');
  // ... テストはここに記述
});
```

## HTTP認証

HTTP認証を実行します。

```javascript
// playwright.config.js
module.exports = {
  use: {
    httpCredentials: {
      username: 'bill',
      password: 'pa55w0rd',
    }
  }
};
```

または、ライブラリAPIを使用する場合：

```javascript
const context = await browser.newContext({
  httpCredentials: {
    username: 'bill',
    password: 'pa55w0rd',
  },
});
const page = await context.newPage();
await page.goto('https://example.com');
```

## HTTPプロキシ

ページがHTTP(S)プロキシまたはSOCKSv5経由で読み込まれるように設定できます。プロキシはブラウザ全体にグローバルに設定することも、各ブラウザコンテキスト個別に設定することもできます。

HTTP(S)プロキシのユーザー名とパスワードを指定することもでき、[プロキシ](/docs/api/class-browser#browser-new-context-option-proxy)をバイパスするホストも指定できます。

グローバルプロキシの例：

```javascript
// playwright.config.js
module.exports = {
  use: {
    proxy: {
      server: 'http://myproxy.com:3128',
      username: 'usr',
      password: 'pwd'
    }
  }
};
```

コンテキストごとに指定することも可能です：

```javascript
// example.spec.js
import { test, expect } from '@playwright/test';

test('新しいコンテキストでカスタムプロキシを使用する', async ({ browser }) => {
  const context = await browser.newContext({
    proxy: {
      server: 'http://myproxy.com:3128',
    }
  });
  const page = await context.newPage();
  await context.close();
});
```

## ネットワークイベント

すべての[Request](/docs/api/class-request)と[Response](/docs/api/class-response)を監視できます：

```javascript
// 'request'と'response'イベントをサブスクライブ
page.on('request', request => console.log('>>', request.method(), request.url()));
page.on('response', response => console.log('<<', response.status(), response.url()));
await page.goto('https://example.com');
```

または、[page.waitForResponse()](/docs/api/class-page#page-wait-for-response)を使用してボタンクリック後のネットワークレスポンスを待機します：

```javascript
// グロブURLパターンを使用。awaitは使わない。
const responsePromise = page.waitForResponse('**/api/fetch_data');
await page.getByText('更新').click();
const response = await responsePromise;
```

### バリエーション

[page.waitForResponse()](/docs/api/class-page#page-wait-for-response)で[Response](/docs/api/class-response)を待機：

```javascript
// 正規表現を使用。awaitは使わない。
const responsePromise = page.waitForResponse(/\.jpeg$/);
await page.getByText('更新').click();
const response = await responsePromise;

// Responseオブジェクトを受け取る述語を使用。awaitは使わない。
const responsePromise = page.waitForResponse(response => response.url().includes(token));
await page.getByText('更新').click();
const response = await responsePromise;
```

## リクエストの処理

```javascript
await page.route('**/api/fetch_data', route => route.fulfill({
  status: 200,
  body: testData,
}));
await page.goto('https://example.com');
```

Playwrightスクリプトでネットワークリクエストを処理することで、APIエンドポイントをモックできます。

### バリエーション

[browserContext.route()](/docs/api/class-browsercontext#browser-context-route)を使用してブラウザコンテキスト全体、または[page.route()](/docs/api/class-page#page-route)を使用してページにルートを設定します。ポップアップウィンドウや開かれたリンクにも適用されます。

```javascript
await browserContext.route('**/api/login', route => route.fulfill({
  status: 200,
  body: 'accept',
}));
await page.goto('https://example.com');
```

## リクエストの変更

```javascript
// ヘッダーを削除
await page.route('**/*', async route => {
  const headers = route.request().headers();
  delete headers['X-Secret'];
  await route.continue({ headers });
});

// リクエストをPOSTとして続行
await page.route('**/*', route => route.continue({ method: 'POST' }));
```

リクエストを変更して続行できます。上記の例では、送信リクエストからHTTPヘッダーを削除しています。

## リクエストの中止

[page.route()](/docs/api/class-page#page-route)と[route.abort()](/docs/api/class-route#route-abort)を使用してリクエストを中止できます。

```javascript
await page.route('**/*.{png,jpg,jpeg}', route => route.abort());

// リクエストタイプに基づいて中止
await page.route('**/*', route => {
  return route.request().resourceType() === 'image' ? route.abort() : route.continue();
});
```

## レスポンスの変更

レスポンスを変更するには、[APIRequestContext](/docs/api/class-apirequestcontext)を使用して元のレスポンスを取得し、そのレスポンスを[route.fulfill()](/docs/api/class-route#route-fulfill)に渡します。オプションを通じてレスポンスの個々のフィールドをオーバーライドできます：

```javascript
await page.route('**/title.html', async route => {
  // 元のレスポンスを取得
  const response = await route.fetch();
  // タイトルにプレフィックスを追加
  let body = await response.text();
  body = body.replace('<title>', '<title>マイプレフィックス:');
  await route.fulfill({
    // レスポンスからすべてのフィールドを渡す
    response,
    // レスポンスボディをオーバーライド
    body,
    // コンテンツタイプを強制的にhtmlにする
    headers: {
      ...response.headers(),
      'content-type': 'text/html'
    }
  });
});
```

## グロブURLパターン

Playwrightは[page.route()](/docs/api/class-page#page-route)や[page.waitForResponse()](/docs/api/class-page#page-wait-for-response)などのネットワーク傍受メソッドでURL一致に簡略化されたグロブパターンを使用します。これらのパターンは基本的なワイルドカードをサポートしています：

1. アスタリスク：
   * 単一の`*`は`/`以外の任意の文字に一致
   * 二重の`**`は`/`を含む任意の文字に一致
2. クエスチョンマーク`?`は`/`以外の任意の1文字に一致
3. 中括弧`{}`はカンマ`,`で区切られたオプションのリストに一致するために使用できる
4. 角括弧`[]`は文字のセットに一致するために使用できる
5. バックスラッシュ`\`は特殊文字をエスケープするために使用できる（バックスラッシュ自体をエスケープするには`\\`を使用）

例：
* `https://example.com/*.js`は`https://example.com/file.js`に一致しますが、`https://example.com/path/file.js`には一致しません
* `https://example.com/\\?page=1`は`https://example.com/?page=1`に一致しますが、`https://example.com`には一致しません
* `**/v[0-9]*`は`https://example.com/v1/`に一致しますが、`https://example.com/vote/`には一致しません
* `**/*.js`は`https://example.com/file.js`と`https://example.com/path/file.js`の両方に一致します
* `**/*.{png,jpg,jpeg}`はすべての画像リクエストに一致します

重要な注意点：
* グロブパターンはURLの一部ではなく、URL全体に一致する必要があります
* URLマッチングにグロブを使用する場合は、プロトコルとパス区切り文字を含むURL構造全体を考慮してください
* より複雑なマッチング要件には、グロブパターンの代わりに[RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)の使用を検討してください

## WebSockets

Playwrightは[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)の検査、モック、変更をすぐに使用できます。WebSocketsのモック方法については、[APIモッキングガイド](/docs/mock#mock-websockets)を参照してください。

WebSocketが作成されるたびに、[page.on('websocket')](/docs/api/class-page#page-event-web-socket)イベントが発生します。このイベントには、WebSocketフレームをさらに検査するための[WebSocket](/docs/api/class-websocket)インスタンスが含まれています：

```javascript
page.on('websocket', ws => {
  console.log(`WebSocketが開かれました: ${ws.url()}>`);
  ws.on('framesent', event => console.log(event.payload));
  ws.on('framereceived', event => console.log(event.payload));
  ws.on('close', () => console.log('WebSocketが閉じられました'));
});
```

## ネットワークイベントの欠落とサービスワーカー

Playwrightの組み込み[browserContext.route()](/docs/api/class-browsercontext#browser-context-route)と[page.route()](/docs/api/class-page#page-route)を使用すると、テストでリクエストをネイティブにルーティングし、モックと傍受を実行できます。

1. Playwrightのネイティブ[browserContext.route()](/docs/api/class-browsercontext#browser-context-route)と[page.route()](/docs/api/class-page#page-route)を使用していて、ネットワークイベントが欠落しているように見える場合は、[serviceWorkers](/docs/api/class-browser#browser-new-context-option-service-workers)を`'block'`に設定してサービスワーカーを無効にしてください。

2. Mock Service Worker（MSW）などのモックツールを使用している可能性があります。このツールはレスポンスのモックにはすぐに使用できますが、独自のサービスワーカーを追加してネットワークリクエストを引き継ぐため、[browserContext.route()](/docs/api/class-browsercontext#browser-context-route)と[page.route()](/docs/api/class-page#page-route)からは見えなくなります。ネットワークテストとモッキングの両方に興味がある場合は、組み込みの[browserContext.route()](/docs/api/class-browsercontext#browser-context-route)と[page.route()](/docs/api/class-page#page-route)を使用して[レスポンスモック](#リクエストの処理)を検討してください。

3. テストとネットワークモッキングだけでなく、サービスワーカー自体が行うリクエストのルーティングとリスニングに興味がある場合は、[この実験的機能](https://github.com/microsoft/playwright/issues/15684)を参照してください。