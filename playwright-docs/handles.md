# ハンドル

## 概要

Playwrightは、ページのDOM要素やページ内の他のオブジェクトへのハンドルを作成できます。これらのハンドルはPlaywrightプロセス内に存在しますが、実際のオブジェクトはブラウザ内に存在します。ハンドルには2種類あります：

* **JSHandle** - ページ内のJavaScriptオブジェクトを参照
* **ElementHandle** - ページ内のDOM要素を参照し、要素に対するアクションの実行やプロパティの検証を可能にする追加メソッドを持つ

ページ内のDOM要素もJavaScriptオブジェクトであるため、すべての`ElementHandle`は`JSHandle`でもあります。

## ElementHandle

> **非推奨**: `ElementHandle`の使用は推奨されません。代わりに`Locator`オブジェクトとWeb優先のアサーションを使用してください。

`ElementHandle`が必要な場合は、`page.waitForSelector()`または`frame.waitForSelector()`メソッドでフェッチすることをお勧めします。これらのAPIは要素が接続され表示されるのを待ちます。

```javascript
// 要素ハンドルを取得
const elementHandle = page.waitForSelector('#box');

// 要素の境界ボックスを検証
const boundingBox = await elementHandle.boundingBox();
expect(boundingBox.width).toBe(100);

// 要素の属性を検証
const classNames = await elementHandle.getAttribute('class');
expect(classNames.includes('highlighted')).toBeTruthy();
```

## パラメータとしてのハンドル

ハンドルは`page.evaluate()`などのメソッドに渡すことができます。以下のスニペットは、ページ内に新しい配列を作成し、データで初期化して、この配列へのハンドルをPlaywrightに返します。その後、このハンドルを後続の評価で使用します：

```javascript
// ページ内に新しい配列を作成
const myArrayHandle = await page.evaluateHandle(() => {
  window.myArray = [1];
  return myArray;
});

// 配列の長さを取得
const length = await page.evaluate(a => a.length, myArrayHandle);

// ハンドルを使用して配列に要素を追加
await page.evaluate(arg => arg.myArray.push(arg.newElement), {
  myArray: myArrayHandle,
  newElement: 2
});

// 不要になったオブジェクトを解放
await myArrayHandle.dispose();
```

## ハンドルのライフサイクル

ハンドルは`page.evaluateHandle()`、`page.$()`、`page.$$()`などのページメソッドまたはそれらのフレームカウンターパートを使用して取得できます。作成されたハンドルは、ページがナビゲートするか、`jsHandle.dispose()`メソッドで手動で破棄されない限り、オブジェクトをガベージコレクションから保持します。

## LocatorとElementHandleの違い

> **注意**: 静的ページで広範なDOM走査を行う必要がある稀なケースでのみ`ElementHandle`の使用をお勧めします。すべてのユーザーアクションとアサーションにはLocatorを使用してください。

`Locator`と`ElementHandle`の違いは、後者が特定の要素を指すのに対し、Locatorはその要素を取得する方法のロジックをキャプチャすることです。

以下の例では、handleはページ上の特定のDOM要素を指しています。その要素がテキストを変更したり、Reactによって全く異なるコンポーネントをレンダリングするために使用されたりしても、handleは依然としてその古いDOM要素を指しています。これは予期しない動作につながる可能性があります。

```javascript
const handle = await page.$('text=Submit');
// ...
await handle.hover();
await handle.click();
```

Locatorを使用すると、Locatorが使用されるたびに、セレクタを使用してページ内の最新のDOM要素が特定されます。したがって、以下のスニペットでは、基礎となるDOM要素が2回特定されます。

```javascript
const locator = page.getByText('Submit');
// ...
await locator.hover();
await locator.click();