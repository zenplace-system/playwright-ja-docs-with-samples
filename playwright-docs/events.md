# イベント

## 概要

Playwrightでは、ネットワークリクエスト、子ページの作成、専用ワーカーなど、Webページで発生するさまざまなイベントをリッスンできます。イベントを購読するには、イベントを待機する方法とイベントリスナーを追加/削除する方法があります。

## イベントの待機

多くの場合、特定のイベントが発生するのを待つ必要があります。以下に代表的なイベント待機パターンを示します。

### 特定URLのリクエストを待機

```javascript
// goto前にリクエスト待機を開始（awaitなし）
const requestPromise = page.waitForRequest('**/*logo*.png');
await page.goto('https://example.com');
const request = await requestPromise;
console.log(request.url());
```

### ポップアップウィンドウを待機

```javascript
// クリック前にポップアップ待機を開始（awaitなし）
const popupPromise = page.waitForEvent('popup');
await page.getByText('ポップアップを開く').click();
const popup = await popupPromise;
await popup.goto('https://example.com');
```

## イベントリスナーの追加/削除

イベントがランダムなタイミングで発生する場合は、待機ではなく処理する必要があります。Playwrightは、イベントの購読と解除のための従来の言語メカニズムをサポートしています。

```javascript
// リクエスト送信時のリスナー追加
page.on('request', request => console.log(`リクエスト送信: ${request.url()}`));

// リクエスト完了時のリスナー追加と変数への保存
const listener = request => console.log(`リクエスト完了: ${request.url()}`);
page.on('requestfinished', listener);

await page.goto('https://example.com');

// リスナーの削除
page.off('requestfinished', listener);

await page.goto('https://example.org/');
```

## 一度だけのリスナー追加

特定のイベントを一度だけ処理する必要がある場合は、便利なAPIが用意されています。

```javascript
// ダイアログが表示されたら一度だけ処理
page.once('dialog', dialog => dialog.accept('2021'));
await page.evaluate("prompt('数字を入力してください:')");
```

## 主なイベントタイプ

- `request`: ネットワークリクエストが発生したとき
- `response`: ネットワークレスポンスが返ってきたとき
- `requestfinished`: リクエストが完了したとき
- `popup`: 新しいウィンドウが開いたとき
- `dialog`: アラート、確認、プロンプトダイアログが表示されたとき
- `console`: コンソールメッセージが出力されたとき
- `download`: ファイルのダウンロードが開始されたとき
- `filechooser`: ファイル選択ダイアログが表示されたとき