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

Playwrightをインストールするには：

```bash
# npmの場合
npm init playwright@latest

# bunの場合
bun create playwright
```

## 貢献について

誤訳や改善点があれば、Issues または Pull Requestsでお知らせください。
