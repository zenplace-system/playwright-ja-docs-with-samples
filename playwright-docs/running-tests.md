# Playwrightテストの実行とデバッグ

## 概要

Playwrightでは、単一のテスト、テストのセット、または全てのテストを実行できます。テストは`--project`フラグを使用して1つまたは複数のブラウザで実行できます。デフォルトでは、テストは並行かつヘッドレスモード（ブラウザウィンドウが表示されない）で実行され、結果はターミナルに表示されます。`--headed`フラグを使用してヘッドモードで実行したり、`--ui`フラグを使用して[UIモード](/docs/test-ui-mode)で実行することも可能です。

## テストの実行

### コマンドライン

`playwright test`コマンドでテストを実行できます。これにより、`playwright.config.js`で設定されたすべてのブラウザでテストが実行されます。

```bash
npx playwright test
```

### UIモードでの実行

[UIモード](/docs/test-ui-mode)でテストを実行すると、各ステップを視覚的に確認でき、ロケーターピッカーやウォッチモードなどの機能も利用できます。

```bash
npx playwright test --ui
```

### ヘッドモードでの実行

ヘッドモード（ブラウザウィンドウが表示される）でテストを実行するには：

```bash
npx playwright test --headed
```

### 異なるブラウザでの実行

特定のブラウザでテストを実行するには：

```bash
npx playwright test --project webkit
```

複数のブラウザでテストを実行するには：

```bash
npx playwright test --project webkit --project firefox
```

### 特定のテストの実行

単一のテストファイルを実行：

```bash
npx playwright test landing-page.spec.js
```

異なるディレクトリからのテストファイルセットを実行：

```bash
npx playwright test tests/todo-page/ tests/landing-page/
```

ファイル名に特定のキーワードを含むテストを実行：

```bash
npx playwright test landing login
```

特定のタイトルを持つテストを実行：

```bash
npx playwright test -g "todoアイテムの追加"
```

### 最後に失敗したテストの実行

最後のテスト実行で失敗したテストのみを実行：

```bash
npx playwright test --last-failed
```

### VS Codeでのテスト実行

[VS Code拡張機能](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)を使用して、VS Code内から直接テストを実行できます。インストール後、実行したいテストの横にある緑の三角形をクリックするか、テストサイドバーからすべてのテストを実行できます。

## テストのデバッグ

PlaywrightはNode.js上で動作するため、`console.log`やIDE内のデバッガーを使用してデバッグできます。また、[UIモード](/docs/test-ui-mode)や[Playwright Inspector](/docs/debug#playwright-inspector)を使用したデバッグも可能です。

### UIモードでのデバッグ

UIモードでは、テストの各ステップを視覚的に確認でき、ログ、エラー、ネットワークリクエスト、DOMスナップショットなどを確認できます。

```bash
npx playwright test --ui
```

デバッグ中に「Pick Locator」ボタンを使用して、ページ上の要素を選択し、Playwrightがその要素を見つけるために使用するロケーターを確認できます。ロケーターを編集して、ブラウザウィンドウでリアルタイムにハイライト表示を確認することも可能です。

### Playwright Inspectorでのデバッグ

すべてのテストをデバッグするには：

```bash
npx playwright test --debug
```

このコマンドを実行すると、ブラウザウィンドウとPlaywright Inspectorが開きます。インスペクターの上部にあるステップオーバーボタンを使用してテストをステップ実行したり、再生ボタンを押してテストを最初から最後まで実行できます。

特定のテストファイルをデバッグするには：

```bash
npx playwright test example.spec.js --debug
```

特定のテストの特定の行からデバッグするには：

```bash
npx playwright test example.spec.js:10 --debug
```

## テストレポート

[HTMLレポーター](/docs/test-reporters#html-reporter)は、テストの完全なレポートを表示し、ブラウザ、合格したテスト、失敗したテスト、スキップされたテスト、不安定なテストでフィルタリングできます。デフォルトでは、一部のテストが失敗した場合、HTMLレポートが自動的に開きます。それ以外の場合は、次のコマンドで開くことができます：

```bash
npx playwright show-report
```

テストをフィルタリングおよび検索したり、各テストをクリックしてテストのエラーを確認し、テストの各ステップを調査したりできます。

## 次のステップ

- [Codegenを使ったテスト生成](/docs/codegen-intro)
- [テストのトレース表示](/docs/trace-viewer-intro)
- [UIモードの機能を探索](/docs/test-ui-mode)
- [GitHub ActionsでCIにテストを実行](/docs/ci-intro)