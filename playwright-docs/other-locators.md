# その他のロケーター

## 概要

> 注意：最も一般的で推奨されるロケーターについては、メインの[ロケーターガイド](/docs/locators)を確認してください。

[page.getByRole()](/docs/api/class-page#page-get-by-role)や[page.getByText()](/docs/api/class-page#page-get-by-text)などの推奨ロケーターに加えて、Playwrightはこのガイドで説明する他のロケーターもサポートしています。

## CSSロケーター

> 注意：テキストやアクセシブルなロールなどの[ユーザーに見えるロケーター](/docs/locators#quick-guide)を優先することをお勧めします。

PlaywrightはCSSセレクターで要素を特定できます。

```javascript
await page.locator('css=button').click();
```

Playwrightは標準のCSSセレクターを拡張しています：
* CSSセレクターはシャドウDOMを貫通します
* `:visible`、`:has-text()`、`:has()`などのカスタム疑似クラスを追加

### CSS：テキストによる一致

* `article:has-text("Playwright")` - 指定テキストを含む要素に一致
* `#nav-bar :text("Home")` - 指定テキストを含む最小の要素に一致
* `#nav-bar :text-is("Home")` - 正確なテキストを持つ最小の要素に一致
* `#nav-bar :text-matches("reg?ex", "i")` - 正規表現に一致するテキストを持つ要素に一致

### CSS：可視要素のみの一致

```javascript
// 可視ボタンのみに一致
await page.locator('button:visible').click();
```

### CSS：他の要素を含む要素

```javascript
// 内部に<div class=promo>を持つ<article>要素を取得
await page.locator('article:has(div.promo)').textContent();
```

### CSS：レイアウトに基づく一致

* `:right-of(selector)` - 指定要素の右側にある要素に一致
* `:left-of(selector)` - 指定要素の左側にある要素に一致
* `:above(selector)` - 指定要素の上にある要素に一致
* `:below(selector)` - 指定要素の下にある要素に一致
* `:near(selector)` - 指定要素の近く（50px以内）にある要素に一致

```javascript
// "Username"の右側の入力フィールドを埋める
await page.locator('input:right-of(:text("Username"))').fill('value');
```

### CSS：n番目の一致を選択

```javascript
// 3番目の「Buy」ボタンをクリック
await page.locator(':nth-match(:text("Buy"), 3)').click();
```

## N番目の要素ロケーター

```javascript
// 最初のボタンをクリック
await page.locator('button').locator('nth=0').click();
// 最後のボタンをクリック
await page.locator('button').locator('nth=-1').click();
```

## 親要素ロケーター

```javascript
// 推奨方法
const child = page.getByText('Hello');
const parent = page.getByRole('listitem').filter({ has: child });

// 代替方法（あまり推奨されない）
const parent = page.getByText('Hello').locator('xpath=..');
```

## Reactロケーター（実験的）

```javascript
// コンポーネント名で一致
await page.locator('_react=BookItem').click();

// プロパティ値で一致
await page.locator('_react=BookItem[author = "Steven King"]').click();
```

## Vueロケーター（実験的）

```javascript
// コンポーネント名で一致
await page.locator('_vue=book-item').click();

// プロパティ値で一致
await page.locator('_vue=book-item[author = "Steven King"]').click();
```

## XPathロケーター

```javascript
await page.locator('xpath=//button').click();
```

> 注意：XPathはシャドウルートを貫通しません。

## ラベルからフォームコントロールへのリターゲティング

```javascript
// ラベルをターゲットにして入力フィールドを埋める
await page.getByText('Password').fill('secret');
```

## レガシーテキストロケーター

```javascript
await page.locator('text=Log in').click();
```

## id、data-testid、data-test-id、data-testセレクター

```javascript
// id "username"を持つ入力を埋める
await page.locator('id=username').fill('value');
// data-test-id "submit"を持つ要素をクリック
await page.locator('data-test-id=submit').click();
```

## セレクターのチェーン

```javascript
// セレクターをチェーン
await page.locator('css=article >> css=.bar >> css=span').click();
```

> 注意：ほとんどの場合、[ロケーターのチェーン](/docs/locators#matching-inside-a-locator)を使用することをお勧めします。
