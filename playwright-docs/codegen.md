# Playwrightテストジェネレーター

## 概要

Playwrightのテストジェネレーターは、ブラウザ上での操作を自動的にJavaScriptコードに変換する機能です。ページを分析して最適なロケーターを特定し、ユニークな要素識別子を生成します。

## VS Codeでのテスト生成

### 準備

[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)からPlaywright拡張機能をインストールします。

### 新規テスト記録

1. テストサイドバーから「**Record new**」ボタンをクリックします
2. ブラウザが開くので、テストしたいURLに移動して操作を行います
3. 操作はリアルタイムでコードに変換されます
4. アサーションを追加するには、ツールバーのアイコンを選択し、ページ上の要素をクリックします：
   - 「要素の表示確認」
   - 「テキスト確認」
   - 「値の確認」
5. 記録を終了するには「キャンセル」ボタンをクリックするか、ブラウザを閉じます

### カーソル位置からの記録

1. テストファイル内の記録を開始したい位置にカーソルを置きます
2. テストサイドバーから「**Record at cursor**」ボタンをクリックします
3. ブラウザで操作を行うと、カーソル位置にコードが追加されます

### ロケーターの生成

1. テストサイドバーから「**Pick locator**」ボタンをクリックします
2. ブラウザ上で要素にホバーすると、ロケーターがハイライト表示されます
3. 必要な要素をクリックすると、VS Codeの「Pick locator」ボックスにロケーターが表示されます
4. Enterキーを押してクリップボードにコピーします

## コマンドラインでのテスト生成

### 基本的な使い方

```bash
npx playwright codegen demo.playwright.dev/todomvc
```

このコマンドを実行すると、ブラウザウィンドウとPlaywright Inspectorウィンドウが開きます。

### テストの記録

1. ブラウザで操作を行うと、Inspectorウィンドウにコードが生成されます
2. 記録できる操作：
   - クリックや入力などの基本操作
   - アサーション（要素の表示確認、テキスト確認、値の確認）
3. 記録を停止するには「record」ボタンをクリックします
4. 「copy」ボタンでコードをコピーしてエディタに貼り付けます

### ロケーターの生成

1. 「Record」ボタンをクリックして記録を停止し、「Pick Locator」ボタンを表示させます
2. 「Pick Locator」ボタンをクリックし、ブラウザ上の要素にホバーします
3. 要素をクリックすると、そのロケーターが表示されます
4. コピーボタンでロケーターをコピーできます

## エミュレーション機能

### ビューポートサイズの指定

```bash
npx playwright codegen --viewport-size="800,600" playwright.dev
```

### モバイルデバイスのエミュレーション

```bash
npx playwright codegen --device="iPhone 13" playwright.dev
```

### ダークモードなどのカラースキーム

```bash
npx playwright codegen --color-scheme=dark playwright.dev
```

### 位置情報、言語、タイムゾーンの設定

```bash
npx playwright codegen --timezone="Europe/Rome" --geolocation="41.890221,12.492348" --lang="it-IT" bing.com/maps
```

## 認証状態の保存と再利用

### 認証状態の保存

```bash
npx playwright codegen github.com/microsoft/playwright --save-storage=auth.json
```

ログイン後、ブラウザを閉じると`auth.json`に認証情報が保存されます。
※この情報は機密情報を含むため、`.gitignore`に追加するか使用後に削除してください。

### 保存した認証状態の読み込み

```bash
npx playwright codegen --load-storage=auth.json github.com/microsoft/playwright
```

## カスタムセットアップでの記録

特殊な設定（ルーティングのカスタマイズなど）が必要な場合は、`page.pause()`を使用できます：

```javascript
const { chromium } = require('@playwright/test');

(async () => {
  // ヘッドレスモードをオフにする
  const browser = await chromium.launch({ headless: false });
  
  // コンテキストの設定
  const context = await browser.newContext();
  await context.route('**/*', route => route.continue());
  
  // ページを一時停止して手動で記録を開始
  const page = await context.newPage();
  await page.pause();
})();