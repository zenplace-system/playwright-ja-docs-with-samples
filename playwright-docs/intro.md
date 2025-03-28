# Playwrightインストールガイド

## 概要

Playwrightは、エンドツーエンドテスト向けに設計されたテストフレームワークです。Chromium、WebKit、Firefoxなどの主要ブラウザエンジンをサポートし、Windows、Linux、macOSで動作します。

## インストール方法

npmを使用して簡単にインストールできます：

```bash
npm init playwright@latest
```

インストール時に選択する項目：
- JavaScript（TypeScriptも選択可能）
- テストフォルダの名前（デフォルトは「tests」）
- GitHub Actionsワークフローの追加
- Playwrightブラウザのインストール

## インストールされるもの

Playwrightは必要なブラウザをダウンロードし、以下のファイルを作成します：

```
playwright.config.js  # 設定ファイル
package.json
package-lock.json
tests/
  example.spec.js     # 基本的なテスト例
tests-examples/
  demo-todo-app.spec.js  # より詳細なテスト例
```

`playwright.config.js`では、使用するブラウザなどの設定をカスタマイズできます。

## サンプルテストの実行

デフォルトでは、テストはChromium、Firefox、WebKitの3つのブラウザで並行実行されます。

```bash
npx playwright test
```

テストはヘッドレスモードで実行され、結果はターミナルに表示されます。

## HTMLテストレポート

テスト完了後、HTMLレポートが生成されます。このレポートでは、ブラウザ別、成功/失敗/スキップ/不安定テスト別にフィルタリングできます。

```bash
npx playwright show-report
```

## UIモードでのテスト実行

開発者向けの改善されたUIモードでテストを実行できます：

```bash
npx playwright test --ui
```

UIモードでは、タイムトラベルデバッグやウォッチモードなどの機能が利用できます。

## Playwrightの更新

最新バージョンへの更新：

```bash
npm install -D @playwright/test@latest
# ブラウザバイナリも更新
npx playwright install --with-deps
```

バージョン確認：

```bash
npx playwright --version
```

## システム要件

- Node.js 18、20、または22の最新バージョン
- Windows 10+、Windows Server 2016+、またはWSL
- macOS 13 Ventura以降
- Debian 12、Ubuntu 22.04、Ubuntu 24.04（x86-64およびarm64アーキテクチャ）

## 次のステップ

- [テストの作成](/docs/writing-tests)
- [テストの実行](/docs/running-tests)
- [Codegenを使ったテスト生成](/docs/codegen-intro)
- [テストのトレース表示](/docs/trace-viewer-intro)