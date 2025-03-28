# JavaScriptの評価

## 概要

Playwrightスクリプトは、Playwright環境で実行されます。一方、ページスクリプトはブラウザページ環境で実行されます。これらの環境は交差せず、異なるプロセスの異なる仮想マシンで実行され、場合によっては異なるコンピュータで実行されることもあります。

[page.evaluate()](/docs/api/class-page#page-evaluate) APIを使用すると、Webページのコンテキストで JavaScript 関数を実行し、その結果を Playwright 環境に戻すことができます。`evaluate`内では`window`や`document`などのブラウザグローバル変数を使用できます。

```javascript
const href = await page.evaluate(() => document.location.href);
```

結果がPromiseの場合や関数が非同期の場合、evaluateは自動的に解決されるまで待機します：

```javascript
const status = await page.evaluate(async () => {
  const response = await fetch(location.href);
  return response.status;
});
```

## 異なる環境

評価されるスクリプトはブラウザ環境で実行されますが、テストはテスト環境で実行されます。つまり、テストの変数をページで使用したり、その逆を行うことはできません。代わりに、それらを引数として明示的に渡す必要があります。

以下のスニペットは変数を直接使用しているため**間違っています**：

```javascript
const data = 'some data';
const result = await page.evaluate(() => {
  // 間違い: Webページには "data" がありません
  window.myApp.use(data);
});
```

以下のスニペットは値を引数として明示的に渡しているため**正しいです**：

```javascript
const data = 'some data';
// |data| をパラメータとして渡す
const result = await page.evaluate(data => {
  window.myApp.use(data);
}, data);
```

## 評価引数

[page.evaluate()](/docs/api/class-page#page-evaluate)のようなPlaywright評価メソッドは、単一のオプション引数を取ります。この引数は[シリアライズ可能](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#Description "Serializable")な値と[JSHandle](/docs/api/class-jshandle "JSHandle")インスタンスの混合が可能です。ハンドルは自動的に表す値に変換されます。

```javascript
// プリミティブ値
await page.evaluate(num => num, 42);

// 配列
await page.evaluate(array => array.length, [1, 2, 3]);

// オブジェクト
await page.evaluate(object => object.foo, { foo: 'bar' });

// 単一のハンドル
const button = await page.evaluateHandle('window.button');
await page.evaluate(button => button.textContent, button);

// JSHandle.evaluateを使用した代替表記
await button.evaluate((button, from) => button.textContent.substring(from), 5);

// 複数のハンドルを持つオブジェクト
const button1 = await page.evaluateHandle('window.button1');
const button2 = await page.evaluateHandle('window.button2');
await page.evaluate(
    o => o.button1.textContent + o.button2.textContent,
    { button1, button2 });

// オブジェクト分割代入も機能します。プロパティ名は
// 分割されたオブジェクトと引数の間で一致する必要があります。
// 括弧が必要なことに注意してください。
await page.evaluate(
    ({ button1, button2 }) => button1.textContent + button2.textContent,
    { button1, button2 });

// 配列も同様に機能します。分割代入には任意の名前を使用できます。
// 括弧が必要なことに注意してください。
await page.evaluate(
    ([b1, b2]) => b1.textContent + b2.textContent,
    [button1, button2]);

// シリアライズ可能な値とハンドルの任意の組み合わせが機能します。
await page.evaluate(
    x => x.button1.textContent + x.list[0].textContent + String(x.foo),
    { button1, list: [button2], foo: null });
```

## 初期化スクリプト

ページの読み込みが開始される前に何かを評価すると便利な場合があります。例えば、モックやテストデータをセットアップしたい場合などです。

この場合、[page.addInitScript()](/docs/api/class-page#page-add-init-script)または[browserContext.addInitScript()](/docs/api/class-browsercontext#browser-context-add-init-script)を使用します。以下の例では、`Math.random()`を定数値に置き換えます。

まず、モックを含む`preload.js`ファイルを作成します。

```javascript
// preload.js
Math.random = () => 42;
```

次に、ページに初期化スクリプトを追加します。

```javascript
import { test, expect } from '@playwright/test';
import path from 'path';

test.beforeEach(async ({ page }) => {
  // beforeEachフックで全テスト用にスクリプトを追加
  // スクリプトパスを正しく解決してください
  await page.addInitScript({ path: path.resolve(__dirname, '../mocks/preload.js') });
});
```

あるいは、プリロードスクリプトファイルを作成する代わりに関数を渡すこともできます。これは短いスクリプトや一度限りのスクリプトに便利です。この方法で引数を渡すこともできます。

```javascript
import { test, expect } from '@playwright/test';

// beforeEachフックで全テスト用にスクリプトを追加
test.beforeEach(async ({ page }) => {
  const value = 42;
  await page.addInitScript(value => {
    Math.random = () => value;
  }, value);
});