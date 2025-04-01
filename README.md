# Playwright 初心者向け日本語ドキュメント

このリポジトリは、[Playwright](https://playwright.dev)の公式ドキュメントを日本語に翻訳し、JavaScript開発者向けに最適化したものです。

## 概要

- **目的**: Playwright初心者が素早く理解できる日本語リソースの提供
- **特徴**: JavaScriptのみに特化（Python、C#、Javaなどの説明は省略）
- **内容**: 簡潔で重要なポイントに絞った説明（原文より文字数を大幅に削減）
- **構成**: 学習の進行順に整理されたドキュメント構造

## ドキュメントへのアクセス

翻訳されたドキュメントは `playwright-docs` ディレクトリにあります：

```bash
cd playwright-docs
```

[索引ページ](playwright-docs/index.md)から効率的に学習を進めることができます。

## 学習の進め方

初心者の方は、以下の順序でドキュメントを読むことをお勧めします：

1. [Playwright入門](playwright-docs/intro.md) - 基本概念の理解
2. [テストの作成](playwright-docs/writing-tests.md) - 最初のテストコード
3. [コード生成入門](playwright-docs/codegen-intro.md) - UIから自動生成
4. [テストの実行](playwright-docs/running-tests.md) - 実行方法
5. [ロケーター](playwright-docs/locators.md) - 要素の特定方法（最重要）

詳細な学習パスについては[索引ページ](playwright-docs/index.md)を参照してください。

## 翻訳ポリシー

- **簡潔さ**: 冗長な説明を避け、核心をついた説明を心がけています
- **初心者視点**: 専門用語をできるだけ平易な言葉で説明
- **JavaScript特化**: JavaScriptとTypeScriptの例のみを掲載

## 開発環境のセットアップ

Playwrightをインストールするには、以下のコマンドを実行してください：

```bash
# bunの場合
bun install
bunx playwright install --with-deps
bun run test
```

## Github Actionsによるテスト自動化、レポートについて

GitHub Actionsの設定ファイルを`.github/workflows/playwright.yml`として用意しました。

### 主なテスト実行仕様

- **実行条件**:
	- **自動実行**: main, master, developブランチへのPR作成時のみ
	- **手動実行**: `workflow_dispatch`トリガーを追加
	- 手動実行の使用方法
		リポジトリのGitHub Actionsタブから「Playwright テスト」ワークフローを選択し、「Run workflow」ボタンをクリックすることで、いつでも手動でテストを実行できます。このボタンは通常、ブランチを選択できるドロップダウンと一緒に表示されます。
- **環境設定**:
    - Bunを使用した依存関係のインストール
    - Playwrightブラウザの自動インストール
- **テストレポートの共有**:
    - テスト結果をGitHub Artifactsとして保存（リポジトリ権限ベースのアクセス制限付き）
    - 実行IDを含むユニークな名前でレポートを保存
    - PRの場合、テスト結果の概要をPRコメントに自動追加

### アクセス制限について

この設定では、テストレポートへのアクセスはリポジトリへの権限を持つユーザーのみに制限されます：

- GitHub Artifactsはリポジトリ権限に基づいてアクセス制御されます
- プライベートリポジトリの場合、アクセス権を持つメンバーのみがレポートを閲覧可能

### 使用方法
テスト実行後は、GitHub Actionsの実行結果ページから「Artifacts」セクションにてテストレポートをダウンロードできます。

## Github Actionのlocalでの動作確認

`brew install act`で`act`をインストールして、localで動作確認できます。

```bash
act -v
```
act 

このコマンドはworkflow_dispatchイベントをトリガーとして、testジョブを実行します。
```bash
act -j test workflow_dispatch
```
