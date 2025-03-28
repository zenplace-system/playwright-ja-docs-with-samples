# Playwrightスクリーンショット

## 概要

スクリーンショットを撮影してファイルに保存する簡単な方法は以下の通りです：

```javascript
await page.screenshot({ path: 'screenshot.png' });
```

[スクリーンショットAPI](/docs/api/class-page#page-screenshot)は、画像フォーマット、クリップ領域、品質など、多くのパラメータを受け付けます。詳細を確認することをお勧めします。

## フルページスクリーンショット

フルページスクリーンショットは、スクロール可能なページ全体のスクリーンショットです。非常に高い画面があり、ページ全体がそこに収まるかのようなイメージです。

```javascript
await page.screenshot({ path: 'screenshot.png', fullPage: true });
```

## バッファへのキャプチャ

ファイルに書き込む代わりに、画像を含むバッファを取得して後処理したり、サードパーティのピクセル差分機能に渡したりすることができます。

```javascript
const buffer = await page.screenshot();
console.log(buffer.toString('base64'));
```

## 要素のスクリーンショット

単一の要素のスクリーンショットを撮ることが役立つ場合があります。

```javascript
await page.locator('.header').screenshot({ path: 'screenshot.png' });