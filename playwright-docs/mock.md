# PlaywrightのAPIモック

## 概要

Web APIは通常、HTTPエンドポイントとして実装されています。PlaywrightはHTTPとHTTPSの両方のネットワークトラフィックを**モック**および**変更**するためのAPIを提供します。[XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)や[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)リクエストを含む、ページが行うあらゆるリクエストを追跡、変更、モックできます。Playwrightでは、ページが行う複数のネットワークリクエストを含むHARファイルを使用してモックすることもできます。

## APIリクエストのモック

以下のコードは、`*/**/api/v1/fruits`へのすべての呼び出しを傍受し、代わりにカスタムレスポンスを返します。APIへのリクエストは行われません。テストはモックされたルートを使用するURLに移動し、モックデータがページに存在することを確認します。

```javascript
test("フルーツをモックしてAPIを呼び出さない", async ({ page }) => {
  // ナビゲーション前にAPIコールをモック
  await page.route('*/**/api/v1/fruits', async route => {
    const json = [{ name: 'Strawberry', id: 21 }];
    await route.fulfill({ json });
  });
  
  // ページに移動
  await page.goto('https://demo.playwright.dev/api-mocking');
  
  // Strawberryフルーツが表示されていることを確認
  await expect(page.getByText('Strawberry')).toBeVisible();
});
```

テストのトレースから、APIが呼び出されず、モックデータで満たされたことがわかります。

詳細については[高度なネットワーキング](/docs/network)をご覧ください。

## APIレスポンスの変更

場合によっては、APIリクエストを行うことが不可欠ですが、再現可能なテストを可能にするためにレスポンスを修正する必要があります。その場合、リクエストをモックする代わりに、リクエストを実行し、変更されたレスポンスで満たすことができます。

以下の例では、フルーツAPIへの呼び出しを傍受し、データに「Loquat」という新しいフルーツを追加します。その後、URLに移動してこのデータが存在することを確認します：

```javascript
test('APIからJSONを取得して新しいフルーツを追加', async ({ page }) => {
  // レスポンスを取得して追加
  await page.route('*/**/api/v1/fruits', async route => {
    const response = await route.fetch();
    const json = await response.json();
    json.push({ name: 'Loquat', id: 100 });
    
    // 元のレスポンスを使用して満たしながら、
    // 指定されたJSONオブジェクトでレスポンスボディをパッチ
    await route.fulfill({ response, json });
  });
  
  // ページに移動
  await page.goto('https://demo.playwright.dev/api-mocking');
  
  // 新しいフルーツが表示されていることを確認
  await expect(page.getByText('Loquat', { exact: true })).toBeVisible();
});
```

テストのトレースでは、APIが呼び出され、レスポンスが変更されたことがわかります。レスポンスを調査すると、新しいフルーツがリストに追加されたことがわかります。

## HARファイルを使用したモッキング

HARファイルは、ページが読み込まれるときに行われるすべてのネットワークリクエストの記録を含む[HTTP Archive](http://www.softwareishard.com/blog/har-12-spec/)ファイルです。リクエストとレスポンスのヘッダー、Cookie、コンテンツ、タイミングなどの情報が含まれています。テストでネットワークリクエストをモックするためにHARファイルを使用できます。以下の手順が必要です：

1. HARファイルを記録する
2. テストと一緒にHARファイルをコミットする
3. テストで保存されたHARファイルを使用してリクエストをルーティングする

### HARファイルの記録

HARファイルを記録するには、[page.routeFromHAR()](/docs/api/class-page#page-route-from-har)または[browserContext.routeFromHAR()](/docs/api/class-browsercontext#browser-context-route-from-har)メソッドを使用します。このメソッドはHARファイルへのパスとオプションのオブジェクトを受け取ります。オプションオブジェクトにはURLを含めることができ、指定されたグロブパターンに一致するURLを持つリクエストのみがHARファイルから提供されます。指定されていない場合、すべてのリクエストがHARファイルから提供されます。

`update`オプションをtrueに設定すると、HARファイルからリクエストを提供する代わりに、実際のネットワーク情報でHARファイルを作成または更新します。テストを作成する際に、実際のデータでHARを入力するために使用します。

```javascript
test('HARファイルを記録または更新する', async ({ page }) => {
  // HARファイルからレスポンスを取得
  await page.routeFromHAR('./hars/fruit.har', {
    url: '*/**/api/v1/fruits',
    update: true,
  });
  
  // ページに移動
  await page.goto('https://demo.playwright.dev/api-mocking');
  
  // フルーツが表示されていることを確認
  await expect(page.getByText('Strawberry')).toBeVisible();
});
```

### HARファイルの変更

HARファイルを記録したら、「hars」フォルダ内のハッシュ化された.txtファイルを開いてJSONを編集することで変更できます。このファイルはソース管理にコミットする必要があります。`update: true`でこのテストを実行するたびに、APIからのリクエストでHARファイルが更新されます。

```json
[
  {
    "name": "Playwright",
    "id": 100
  },
  // ... 他のフルーツ
]
```

### HARからの再生

HARファイルを記録してモックデータを変更したら、テストで一致するレスポンスを提供するために使用できます。そのためには、`update`オプションをオフにするか、単に削除します。これにより、APIにアクセスする代わりにHARファイルに対してテストが実行されます。

```javascript
test('HARからJSONを取得して新しいフルーツが追加されたことを確認', async ({ page }) => {
  // HARからAPIリクエストを再生
  // HARから一致するレスポンスを使用するか、
  // 何も一致しない場合はリクエストを中止
  await page.routeFromHAR('./hars/fruit.har', {
    url: '*/**/api/v1/fruits',
    update: false,
  });
  
  // ページに移動
  await page.goto('https://demo.playwright.dev/api-mocking');
  
  // Playwrightフルーツが表示されていることを確認
  await expect(page.getByText('Playwright', { exact: true })).toBeVisible();
});
```

テストのトレースでは、ルートがHARファイルから満たされ、APIが呼び出されなかったことがわかります。レスポンスを調査すると、「hars」フォルダ内のハッシュ化された`.txt`ファイルを手動で更新することで追加された新しいフルーツがJSONに追加されたことがわかります。

HARの再生はURLとHTTPメソッドを厳密に一致させます。POSTリクエストの場合、POSTペイロードも厳密に一致させます。複数の記録がリクエストに一致する場合、最も多くのヘッダーが一致するものが選択されます。リダイレクトになるエントリは自動的に追跡されます。

記録時と同様に、指定されたHARファイル名が`.zip`で終わる場合、それは別々のエントリとして保存されたネットワークペイロードと一緒にHARファイルを含むアーカイブと見なされます。このアーカイブを抽出し、ペイロードやHARログを手動で編集して、抽出されたharファイルを指定することもできます。すべてのペイロードはファイルシステム上の抽出されたharファイルに対して相対的に解決されます。

#### CLIでのHAR記録

テスト用のHARファイルを記録するには`update`オプションを推奨しますが、Playwright CLIでHARを記録することもできます。

Playwright CLIでブラウザを開き、`--save-har`オプションを渡してHARファイルを生成します。オプションで、`--save-har-glob`を使用して、関心のあるリクエスト（例：APIエンドポイント）のみを保存します。harファイル名が`.zip`で終わる場合、アーティファクトは別々のファイルとして書き込まれ、すべて単一の`zip`に圧縮されます。

```bash
# example.comからのAPIリクエストを「example.har」アーカイブとして保存
npx playwright open --save-har=example.har --save-har-glob="**/api/**" https://example.com
```

詳細については[高度なネットワーキング](/docs/network)をご覧ください。

## WebSocketのモック

以下のコードはWebSocket接続を傍受し、サーバーに接続する代わりにWebSocket経由の通信全体をモックします。この例では、`"request"`に対して`"response"`で応答します。

```javascript
await page.routeWebSocket('wss://example.com/ws', ws => {
  ws.onMessage(message => {
    if (message === 'request')
      ws.send('response');
  });
});
```

あるいは、実際のサーバーに接続しながら、途中でメッセージを傍受して変更またはブロックすることもできます。以下は、ページからサーバーに送信される一部のメッセージを変更し、残りは変更せずに残す例です。

```javascript
await page.routeWebSocket('wss://example.com/ws', ws => {
  const server = ws.connectToServer();
  ws.onMessage(message => {
    if (message === 'request')
      server.send('request2');
    else
      server.send(message);
  });
});
```

詳細については、[WebSocketRoute](/docs/api/class-websocketroute)を参照してください。