# Playwrightダイアログ

## 概要

Playwrightは、[`alert`](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert)、[`confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm)、[`prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt)などのWebページダイアログや[`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event)確認と対話できます。印刷ダイアログについては、[印刷](#印刷ダイアログ)を参照してください。

## alert()、confirm()、prompt()ダイアログ

デフォルトでは、ダイアログはPlaywrightによって自動的に閉じられるため、手動で処理する必要はありません。ただし、ダイアログをトリガーするアクションの前にダイアログハンドラーを登録して、[dialog.accept()](/docs/api/class-dialog#dialog-accept)または[dialog.dismiss()](/docs/api/class-dialog#dialog-dismiss)することができます。

```javascript
page.on('dialog', dialog => dialog.accept());
await page.getByRole('button').click();
```

> **注意**: [page.on('dialog')](/docs/api/class-page#page-event-dialog)リスナーは**必ずダイアログを処理する**必要があります。そうしないと、[locator.click()](/docs/api/class-locator#locator-click)などのアクションが停止します。これは、Webのダイアログがモーダルであり、処理されるまで後続のページ実行をブロックするためです。

その結果、次のスニペットは解決されません：

> **警告**: 間違った例！
> ```javascript
> page.on('dialog', dialog => console.log(dialog.message()));
> await page.getByRole('button').click(); // ここで停止します
> ```

> **注意**: [page.on('dialog')](/docs/api/class-page#page-event-dialog)のリスナーがない場合、すべてのダイアログは自動的に閉じられます。

## beforeunloadダイアログ

[page.close()](/docs/api/class-page#page-close)が真の[runBeforeUnload](/docs/api/class-page#page-close-option-run-before-unload)値で呼び出されると、ページはアンロードハンドラーを実行します。これは、[page.close()](/docs/api/class-page#page-close)がページが実際に閉じるのを待たない唯一のケースです。なぜなら、操作の最後にページが開いたままになる可能性があるためです。

`beforeunload`ダイアログを自分で処理するためのダイアログハンドラーを登録できます：

```javascript
page.on('dialog', async dialog => {
  assert(dialog.type() === 'beforeunload');
  await dialog.dismiss();
});
await page.close({ runBeforeUnload: true });
```

## 印刷ダイアログ

[`window.print`](https://developer.mozilla.org/en-US/docs/Web/API/Window/print)による印刷ダイアログがトリガーされたことを確認するには、次のスニペットを使用できます：

```javascript
await page.goto('<url>');
await page.evaluate('(() => {window.waitForPrintDialog = new Promise(f => window.print = f);})()');
await page.getByText('印刷する！').click();
await page.waitForFunction('window.waitForPrintDialog');
```

これにより、ボタンがクリックされた後に印刷ダイアログが開くのを待ちます。ボタンをクリックする前/ページが読み込まれた後にスクリプトを評価するようにしてください。