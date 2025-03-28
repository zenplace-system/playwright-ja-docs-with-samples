# スナップショットテスト

## 概要

Playwrightのスナップショットテストを使用すると、ページのアクセシビリティツリーを事前定義されたスナップショットテンプレートと比較できます。

```javascript
await page.goto('https://example.com/');
await expect(page.getByRole('banner')).toMatchAriaSnapshot(`
  - heading "タイトル" [level=1]
  - link "始める"
  - button "送信"
`);
```

## アサーションテストとスナップショットテストの違い

### アサーションテスト
特定の値や条件を検証する方法です。例えば、`expect(locator).toHaveText()`は要素が期待するテキストを含むか確認します。

**利点**:
- 意図が明確で理解しやすい
- 特定の機能に焦点を当てる
- 失敗時に問題箇所を特定しやすい

**欠点**:
- 複雑な出力には冗長になりがち
- コード進化に伴うメンテナンスコストが高い

### スナップショットテスト
要素や構造全体の状態を「スナップショット」として保存し、将来の比較に使用します。

**利点**:
- 複雑な出力の検証が簡単
- 意図しない変更を素早く発見できる
- 一貫性の維持に役立つ

**欠点**:
- 変更を十分理解せずに受け入れる可能性がある
- 大きなスナップショットは差異の解釈が難しい
- 頻繁に変わる動的コンテンツには不向き

## ARIAスナップショット

PlaywrightのARIAスナップショットは、ページのアクセシビリティツリーをYAML形式で表現します。

各アクセシブル要素はYAMLノードとして表現されます:

```
- role "name" [attribute=value]
```

- **role**: 要素のARIAまたはHTMLロール（例: `heading`, `button`）
- **"name"**: 要素のアクセシブル名。正確な値は引用符で、正規表現は `/パターン/` で表現
- **[attribute=value]**: 属性と値（例: `checked`, `disabled`, `level`）

## スナップショットの照合

`expect(locator).toMatchAriaSnapshot()`メソッドは、ロケータのアクセシブル構造を事前定義されたテンプレートと比較します。

例えば、次のDOMに対して:

```html
<h1>タイトル</h1>
```

このスナップショットテンプレートで照合できます:

```javascript
await expect(page.locator('body')).toMatchAriaSnapshot(`
  - heading "タイトル"
`);
```

### 部分一致

属性やアクセシブル名を省略することで、部分一致を行えます:

```html
<button>送信</button>
```

```
- button
```

この例では、ボタンのロールは一致しますが、アクセシブル名（「送信」）は指定されていないため、ボタンのラベルに関係なくテストはパスします。

### 正規表現による一致

動的なテキストには正規表現を使用できます:

```html
<h1>課題 12</h1>
```

```
- heading /課題 \d+/
```

## スナップショットの生成

### Playwrightコードジェネレータでの生成

- **「Assert snapshot」アクション**: 選択した要素のスナップショットアサーションを自動生成
- **「Aria snapshot」タブ**: 選択したロケータのARIAスナップショットを視覚的に表示

### `--update-snapshots`フラグでの更新

```bash
npx playwright test --update-snapshots
```

または空のテンプレートを渡して生成:

```javascript
await expect(locator).toMatchAriaSnapshot('');
```

### 別ファイルとしてのスナップショット

```javascript
await expect(page.getByRole('main')).toMatchAriaSnapshot({ name: 'main.aria.yml' });
```

## アクセシビリティツリーの例

### 見出しとレベル属性

```html
<h1>タイトル</h1>
<h2>サブタイトル</h2>
```

```
- heading "タイトル" [level=1]
- heading "サブタイトル" [level=2]
```

### リンク

```html
<a href="#more-info">アクセシビリティについてもっと読む</a>
```

```
- link "アクセシビリティについてもっと読む"
```

### リストと項目

```html
<ul aria-label="主な機能">
  <li>機能1</li>
  <li>機能2</li>
</ul>
```

```
- list "主な機能":
  - listitem: 機能1
  - listitem: 機能2
```

### 属性と状態

```html
<input type="checkbox" checked>
```

```
- checkbox [checked]
```

```html
<button aria-pressed="true">切り替え</button>
```

```
- button "切り替え" [pressed=true]