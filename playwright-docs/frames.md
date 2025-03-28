# フレーム

## 概要

[Page](/docs/api/class-page "Page")には、1つ以上の[Frame](/docs/api/class-frame "Frame")オブジェクトが関連付けられています。各ページにはメインフレームがあり、ページレベルの操作（`click`など）はメインフレームで実行されると想定されています。

ページには、HTML `iframe`タグで追加のフレームを関連付けることができます。これらのフレームにアクセスして、フレーム内での操作を行うことができます。

```javascript
// フレーム内の要素を特定
const username = await page.frameLocator('.frame-class').getByLabel('ユーザー名');
await username.fill('John');
```

## フレームオブジェクト

[page.frame()](/docs/api/class-page#page-frame) APIを使用してフレームオブジェクトにアクセスできます：

```javascript
// フレームのname属性を使用してフレームを取得
const frame = page.frame('frame-login');

// フレームのURLを使用してフレームを取得
const frame = page.frame({ url: /.*domain.*/ });

// フレームと対話する
await frame.fill('#username-input', 'John');