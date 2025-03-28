# Playwrightドキュメント索引

## 🔰 基本的な学習ステップ（初めての方はこの順で）
1. [Playwright入門](intro.md) - フレームワークの基本概念を理解する
2. [VSCodeではじめる](getting-started-vscode.md) - 開発環境のセットアップ
3. [テストの作成](writing-tests.md) - 最初のテストを書く方法
4. [コード生成入門](codegen-intro.md) - UIからテストコードを自動生成する
5. [テストの実行](running-tests.md) - 書いたテストを実行する方法
6. [デバッグ](debug.md) - テストのデバッグ方法
7. [トレースビューワー入門](trace-viewer-intro.md) - テスト実行の詳細を確認
8. [アサーション](test-assertions.md) - テスト結果の検証方法
9. [ベストプラクティス](best-practices.md) - 効果的なテスト作成の秘訣

## 実践的なテスト開発
- [ロケーター](locators.md) - 要素の特定方法（最重要）
- [入力操作](input.md) - クリック、入力などの基本操作
- [ナビゲーション](navigations.md) - ページ間の移動とURL操作
- [フレーム](frames.md) - iframe内の要素操作
- [ダイアログ](dialogs.md) - アラート、確認ダイアログの扱い方
- [ページオブジェクトモデル](pom.md) - テストコードを構造化する方法
- [テストフィクスチャ](test-fixtures.md) - テスト環境の効率的な設定
- [APIテスト](api-testing.md) - APIエンドポイントのテスト
- [テスト分離](browser-contexts.md) - テスト間の独立性を保つ

## テスト設定と効率化
- [テスト設定](test-configuration.md) - プロジェクト設定の基本
- [並列実行](test-parallel.md) - テスト実行を高速化
- [コマンドライン](test-cli.md) - CLIからの実行オプション
- [リトライ](test-retries.md) - 不安定なテストの対策
- [グローバルセットアップとティアダウン](test-global-setup-teardown.md) - 前処理と後処理
- [認証](auth.md) - ログインが必要なテスト
- [UIモード](test-ui-mode.md) - 視覚的なテスト開発と実行

## CI/CD統合
- [CI入門](ci-intro.md) - 継続的インテグレーションの設定
- [シャーディング](test-sharding.md) - CI環境での実行分散
- [レポーター](test-reporters.md) - テスト結果のレポート作成
- [WebView2](webview2.md) - デスクトップアプリケーションのテスト

## 高度なテスト技法
- [スクリーンショット](screenshots.md) - 画面キャプチャ
- [ビデオ](videos.md) - テスト実行の録画
- [スナップショットテスト](test-snapshots.md) - ビジュアル比較テスト
- [モック](mock.md) - APIレスポンスのモック化
- [ブラウザAPIのモック](mock-browser-apis.md) - ブラウザ機能のモック
- [ネットワーク](network.md) - ネットワークリクエストの監視と制御
- [JavaScriptの評価](evaluating.md) - ブラウザコンテキストでのコード実行
- [コンポーネントテスト](test-components.md) - UI部品の分離テスト

## ブラウザとプラットフォーム
- [ブラウザ](browsers.md) - 複数ブラウザでのテスト
- [エミュレーション](emulation.md) - モバイルデバイスのエミュレーション
- [Chrome拡張機能](chrome-extensions.md) - 拡張機能のテスト
- [時計の操作](clock.md) - 時間依存テストの制御
- [ダウンロード](downloads.md) - ファイルダウンロードの処理

## 特殊なテスト要件
- [アクセシビリティテスト](accessibility-testing.md) - A11yテスト
- [イベント](events.md) - イベントハンドリング
- [タッチイベント](touch-events.md) - モバイルタッチ操作
- [ARIAスナップショット](aria-snapshots.md) - アクセシビリティツリーの検証

## 上級者向け機能
- [テストのパラメータ化](test-parameterize.md) - データ駆動テスト
- [拡張性](extensibility.md) - フレームワークの拡張
- [タイムアウト](test-timeouts.md) - 実行時間の制御
- [TypeScript](test-typescript.md) - 型安全なテスト
- [ハンドル](handles.md) - 低レベルDOM操作
- [その他のロケーター](other-locators.md) - 特殊な要素の特定方法

## プロジェクト管理
- [プロジェクト](test-projects.md) - 複数設定での実行
- [テストオプション](test-use-options.md) - テスト固有の設定
- [アノテーション](test-annotations.md) - テストのマーキングとフィルタリング
- [Webサーバー](test-webserver.md) - 開発サーバーとの統合

## 参考資料
- [サポートされる言語](languages.md) - 多言語サポート
- [ライブラリ](library.md) - Playwright API
- [リリースノート](release-notes.md) - 最新の変更点
- [Canaryリリース](canary-releases.md) - 最新機能の試用
