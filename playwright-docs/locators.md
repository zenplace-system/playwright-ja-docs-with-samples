# Playwrightロケーター

## 概要

[ロケーター](/docs/api/class-locator)はPlaywrightの自動待機と再試行機能の中心的な要素です。簡単に言えば、ロケーターはページ上の要素を任意の時点で見つける方法を表します。

### クイックガイド

以下は推奨される組み込みロケーターです：

* **page.getByRole()** - アクセシビリティ属性による特定
* **page.getByText()** - テキスト内容による特定
* **page.getByLabel()** - ラベルテキストによるフォーム要素の特定
* **page.getByPlaceholder()** - プレースホルダーによる入力欄の特定
* **page.getByAltText()** - 代替テキストによる画像などの特定
* **page.getByTitle()** - title属性による要素の特定
* **page.getByTestId()** - `data-testid`属性による要素の特定

```javascript
await page.getByLabel('ユーザー名').fill('John');
await page.getByLabel('パスワード').fill('secret-password');
await page.getByRole('button', { name: 'サインイン' }).click();
await expect(page.getByText('ようこそ、John様！')).toBeVisible();
```

## 要素の特定

Playwrightには複数の組み込みロケーターがあります。テストを堅牢にするために、[page.getByRole()](/docs/api/class-page#page-get-by-role)のようなユーザー向け属性と明示的な契約を優先することをお勧めします。

### ロールによる特定

[page.getByRole()](/docs/api/class-page#page-get-by-role)ロケーターは、ユーザーや支援技術がページをどのように認識するかを反映します。例えば、ある要素がボタンかチェックボックスかなど。ロールで特定する場合は、通常、アクセシブルな名前も指定して、正確な要素を特定します。

```javascript
await expect(page.getByRole('heading', { name: '新規登録' })).toBeVisible();
await page.getByRole('checkbox', { name: '購読する' }).check();
await page.getByRole('button', { name: /送信/i }).click();
```

ロールロケーターには[ボタン、チェックボックス、見出し、リンク、リスト、テーブルなど多数](https://www.w3.org/TR/html-aria/#docconformance)が含まれ、W3Cの[ARIAロール](https://www.w3.org/TR/wai-aria-1.2/#roles)、[ARIA属性](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes)、[アクセシブルな名前](https://w3c.github.io/accname/#dfn-accessible-name)の仕様に従っています。

**いつ使うべきか**: ユーザーとアシスティブテクノロジーがページをどのように認識するかに最も近いため、要素を特定するためにロールロケーターを優先することをお勧めします。

### ラベルによる特定

フォームコントロールには通常、専用のラベルがあり、[page.getByLabel()](/docs/api/class-page#page-get-by-label)を使用してコントロールを特定できます。

```javascript
await page.getByLabel('パスワード').fill('secret');
```

**いつ使うべきか**: フォームフィールドを特定する場合に使用します。

### プレースホルダーによる特定

入力欄には、ユーザーにどのような値を入力すべきかを示すプレースホルダー属性がある場合があります。[page.getByPlaceholder()](/docs/api/class-page#page-get-by-placeholder)を使用してそのような入力欄を特定できます。

```javascript
await page
  .getByPlaceholder('name@example.com')
  .fill('playwright@microsoft.com');
```

**いつ使うべきか**: ラベルはないがプレースホルダーテキストがあるフォーム要素を特定する場合に使用します。

### テキストによる特定

[page.getByText()](/docs/api/class-page#page-get-by-text)を使用して、含まれるテキストで要素を見つけることができます。部分文字列、完全一致、または正規表現で一致させることができます。

```javascript
// 部分一致
await expect(page.getByText('ようこそ、John')).toBeVisible();

// 完全一致
await expect(page.getByText('ようこそ、John', { exact: true })).toBeVisible();

// 正規表現
await expect(page.getByText(/ようこそ、[A-Za-z]+$/i)).toBeVisible();
```

**いつ使うべきか**: `div`、`span`、`p`などの非インタラクティブ要素を見つけるためにテキストロケーターを使用することをお勧めします。`button`、`a`、`input`などのインタラクティブ要素には[ロールロケーター](#ロールによる特定)を使用してください。

### alt属性による特定

すべての画像には、画像を説明する`alt`属性が必要です。[page.getByAltText()](/docs/api/class-page#page-get-by-alt-text)を使用して、代替テキストに基づいて画像を特定できます。

```javascript
await page.getByAltText('playwrightロゴ').click();
```

**いつ使うべきか**: `img`や`area`要素などのalt属性をサポートする要素に使用します。

### title属性による特定

[page.getByTitle()](/docs/api/class-page#page-get-by-title)を使用して、一致するtitle属性を持つ要素を特定できます。

```javascript
await expect(page.getByTitle('課題数')).toHaveText('25件の課題');
```

**いつ使うべきか**: 要素に`title`属性がある場合に使用します。

### テストIDによる特定

テストIDによるテストは、テキストやロールが変更されてもテストが合格するため、最も堅牢なテスト方法です。QAと開発者は明示的なテストIDを定義し、[page.getByTestId()](/docs/api/class-page#page-get-by-test-id)でクエリする必要があります。

```javascript
await page.getByTestId('directions').click();
```

**いつ使うべきか**: テストID手法を選択した場合や、[ロール](#ロールによる特定)や[テキスト](#テキストによる特定)で特定できない場合に使用します。

#### カスタムテストID属性の設定

デフォルトでは、[page.getByTestId()](/docs/api/class-page#page-get-by-test-id)は`data-testid`属性に基づいて要素を特定しますが、テスト設定で設定するか、[selectors.setTestIdAttribute()](/docs/api/class-selectors#selectors-set-test-id-attribute)を呼び出すことで変更できます。

```javascript
// playwright.config.js
module.exports = {
  use: {
    testIdAttribute: 'data-pw'
  }
};
```

### CSSまたはXPathによる特定

どうしてもCSSやXPathロケーターを使用する必要がある場合は、[page.locator()](/docs/api/class-page#page-locator)を使用してページ内の要素を見つける方法を記述するロケーターを作成できます。

```javascript
await page.locator('css=button').click();
await page.locator('xpath=//button').click();
await page.locator('button').click();
await page.locator('//button').click();
```

**いつ使うべきか**: CSSとXPathはDOM構造が変更されることが多く、非堅牢なテストにつながるため、推奨されません。代わりに、[ロールロケーター](#ロールによる特定)のようなユーザーがページをどのように認識するかに近いロケーターを考えるか、テストIDを使用して[明示的なテスト契約を定義](#テストidによる特定)してください。

## Shadow DOMでの特定

Playwrightのすべてのロケーターは**デフォルトで**Shadow DOM内の要素でも機能します。例外は：

* XPathによる特定はシャドウルートを貫通しません。
* [クローズドモードのシャドウルート](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#parameters)はサポートされていません。

```javascript
// Shadow DOM内の「Details」テキストを持つ要素をクリック
await page.getByText('Details').click();
```

## ロケーターのフィルタリング

### テキストによるフィルタリング

[locator.filter()](/docs/api/class-locator#locator-filter)メソッドを使用して、ロケーターをテキストでフィルタリングできます。

```javascript
await page
  .getByRole('listitem')
  .filter({ hasText: '商品2' })
  .getByRole('button', { name: 'カートに追加' })
  .click();
```

### テキストを持たないフィルタリング

あるいは、**テキストを持たない**要素でフィルタリングすることもできます：

```javascript
// 在庫あり5アイテム
await expect(page.getByRole('listitem').filter({ hasNotText: '在庫切れ' })).toHaveCount(5);
```

### 子/子孫要素によるフィルタリング

ロケーターは、別のロケーターに一致する子孫を持つ（または持たない）要素のみを選択するオプションをサポートしています。

```javascript
await page
  .getByRole('listitem')
  .filter({ has: page.getByRole('heading', { name: '商品2' }) })
  .getByRole('button', { name: 'カートに追加' })
  .click();
```

### 子/子孫要素を持たないフィルタリング

一致する要素を**持たない**要素でフィルタリングすることもできます：

```javascript
await expect(page
  .getByRole('listitem')
  .filter({ hasNot: page.getByText('商品2') }))
  .toHaveCount(1);
```

## ロケーター演算子

### ロケーター内での一致

[page.getByText()](/docs/api/class-page#page-get-by-text)や[locator.getByRole()](/docs/api/class-locator#locator-get-by-role)などのロケーターを作成するメソッドをチェーンして、検索をページの特定の部分に絞り込むことができます。

```javascript
const product = page.getByRole('listitem').filter({ hasText: '商品2' });
await product.getByRole('button', { name: 'カートに追加' }).click();
await expect(product).toHaveCount(1);
```

### 複数ロケーターの同時一致

[locator.and()](/docs/api/class-locator#locator-and)メソッドは、追加のロケーターに一致することで既存のロケーターを絞り込みます。

```javascript
const button = page.getByRole('button').and(page.getByTitle('購読'));
```

### 代替ロケーターの一致

2つ以上の要素のいずれかをターゲットにしたい場合は、[locator.or()](/docs/api/class-locator#locator-or)を使用して、代替案のいずれかまたは両方に一致するロケーターを作成します。

```javascript
const newEmail = page.getByRole('button', { name: '新規' });
const dialog = page.getByText('セキュリティ設定を確認');
await expect(newEmail.or(dialog).first()).toBeVisible();
if (await dialog.isVisible())
  await page.getByRole('button', { name: '閉じる' }).click();
await newEmail.click();
```

### 可視要素のみの一致

```javascript
// 可視の要素のみを見つけてクリック
await page.locator('button').filter({ visible: true }).click();
```

## リスト操作

### リスト内のアイテム数の確認

```javascript
await expect(page.getByRole('listitem')).toHaveCount(3);
```

### リスト内のすべてのテキストの検証

```javascript
await expect(page
  .getByRole('listitem'))
  .toHaveText(['りんご', 'バナナ', 'オレンジ']);
```

### 特定のアイテムの取得

#### テキストによる取得

```javascript
await page.getByText('オレンジ').click();
```

#### テキストによるフィルタリング

```javascript
await page
  .getByRole('listitem')
  .filter({ hasText: 'オレンジ' })
  .click();
```

#### テストIDによる取得

```javascript
await page.getByTestId('orange').click();