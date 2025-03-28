# ダウンロード

## 概要

ページによってダウンロードされる添付ファイルごとに、[page.on('download')](/docs/api/class-page#page-event-download)イベントが発生します。これらの添付ファイルはすべて一時フォルダにダウンロードされます。イベントから[Download](/docs/api/class-download "Download")オブジェクトを使用して、ダウンロードURL、ファイル名、ペイロードストリームを取得できます。

[browserType.launch()](/docs/api/class-browsertype#browser-type-launch)の[downloadsPath](/docs/api/class-browsertype#browser-type-launch-option-downloads-path)オプションを使用して、ダウンロードしたファイルを保存する場所を指定できます。

> 注意：ダウンロードされたファイルは、それらを生成したブラウザコンテキストが閉じられると削除されます。

ファイルダウンロードを処理する最も簡単な方法は次のとおりです：

```javascript
// クリックする前にダウンロードを待ち始めます。awaitは使いません。
const downloadPromise = page.waitForEvent('download');
await page.getByText('ファイルをダウンロード').click();
const download = await downloadPromise;

// ダウンロードプロセスが完了するのを待ち、ダウンロードしたファイルを保存します。
await download.saveAs('/path/to/save/at/' + download.suggestedFilename());
```

### バリエーション

何がダウンロードを開始するかわからない場合でも、イベントを処理できます：

```javascript
page.on('download', download => download.path().then(console.log));
```

イベントを処理すると制御フローが分岐し、スクリプトの追跡が難しくなることに注意してください。メインの制御フローがこの操作の完了を待っていないため、ファイルをダウンロード中にシナリオが終了する可能性があります。

> 注意：ファイルのアップロードについては、[ファイルのアップロード](/docs/input#upload-files)セクションを参照してください。