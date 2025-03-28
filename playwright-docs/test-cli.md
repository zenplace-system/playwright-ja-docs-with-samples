# コマンドライン | Playwright

---

*   [](/)
*   Playwright Test
*   コマンドライン

このページの内容

# コマンドライン

## はじめに

コマンドラインで利用できる主なオプションを紹介します。

* すべてのテストを実行
    ```bash
    npx playwright test
    ```

* 単一のテストファイルを実行
    ```bash
    npx playwright test tests/todo-page.spec.ts
    ```

* 複数のテストファイルを実行
    ```bash
    npx playwright test tests/todo-page/ tests/landing-page/
    ```

* ファイル名に `my-spec` または `my-spec-2` を含むファイルを実行
    ```bash
    npx playwright test my-spec my-spec-2
    ```

* my-spec.ts の 42 行目にあるテストを実行
    ```bash
    npx playwright test my-spec.ts:42
    ```

* タイトルを指定してテストを実行
    ```bash
    npx playwright test -g "add a todo item"
    ```

* ヘッドモード（ブラウザ表示）でテストを実行
    ```bash
    npx playwright test --headed
    ```

* 特定のプロジェクトに対してすべてのテストを実行
    ```bash
    npx playwright test --project=chromium
    ```

* [並列実行](/docs/test-parallel)を無効化
    ```bash
    npx playwright test --workers=1
    ```

* [レポーター](/docs/test-reporters)を選択
    ```bash
    npx playwright test --reporter=dot
    ```

* [Playwright Inspector](/docs/debug)を使用したデバッグモードで実行
    ```bash
    npx playwright test --debug
    ```

* 対話型UIモードでテストを実行（ウォッチモード付き、プレビュー機能）
    ```bash
    npx playwright test --ui
    ```

* ヘルプを表示
    ```bash
    npx playwright test --help
    ```

## リファレンス

Playwright Testのオプション一覧は[設定ファイル](/docs/test-use-options)で確認できます。以下のオプションはコマンドラインから指定でき、設定ファイルよりも優先されます：

| オプション | 説明 |
| --- | --- |
| 非オプション引数 | 各引数はテストファイルパスに対する正規表現として扱われます。パターンにマッチするファイルのテストのみが実行されます。`$`や`*`などの特殊記号は`\`でエスケープする必要があります。多くのシェル/ターミナルでは引数を引用符で囲む必要があります。 |
| `-c <file>` または `--config <file>` | 設定ファイル、または「playwright.config.{m,c}?{js,ts}」を含むテストディレクトリを指定します。デフォルトは現在のディレクトリの `playwright.config.ts` または `playwright.config.js` です。 |
| `--debug` | Playwright Inspectorを使用してテストを実行します。`PWDEBUG=1` 環境変数と `--timeout=0 --max-failures=1 --headed --workers=1` オプションのショートカットです。 |
| `--fail-on-flaky-tests` | テストが不安定（flaky）としてフラグが立てられた場合に失敗させます（デフォルト: false）。 |
| `--forbid-only` | `test.only` が呼び出された場合に失敗させます（デフォルト: false）。CI環境で便利です。 |
| `--fully-parallel` | すべてのテストを並列実行します（デフォルト: false）。 |
| `--global-timeout <timeout>` | このテストスイートが実行できる最大時間をミリ秒単位で指定します（デフォルト: 無制限）。 |
| `-g <grep>` または `--grep <grep>` | この正規表現にマッチするテストのみを実行します（デフォルト: ".*"）。 |
| `-gv <grep>` または `--grep-invert <grep>` | この正規表現にマッチしないテストのみを実行します。 |
| `--headed` | ヘッドモード（ブラウザ表示）でテストを実行します（デフォルト: ヘッドレス）。 |
| `--ignore-snapshots` | スクリーンショットとスナップショットの検証を無視します。 |
| `--last-failed` | 前回失敗したテストのみを再実行します。 |
| `--list` | すべてのテストを収集して報告しますが、実行はしません。 |
| `--max-failures <N>` または `-x` | 最初の `N` 回の失敗後に停止します。`-x` を渡すと最初の失敗後に停止します。 |
| `--no-deps` | プロジェクトの依存関係を実行しません。 |
| `--output <dir>` | 出力アーティファクトのフォルダを指定します（デフォルト: "test-results"）。 |
| `--only-changed [ref]` | 'HEAD'と'ref'の間で変更されたテストファイルのみを実行します。デフォルトではコミットされていないすべての変更を実行します。Gitのみサポートしています。 |
| `--pass-with-no-tests` | テストが見つからなくてもテスト実行を成功させます。 |
| `--project <project-name...>` | 指定されたプロジェクトリストからのみテストを実行します。'*'ワイルドカードをサポートします（デフォルト: すべてのプロジェクトを実行）。 |
| `--quiet` | 標準出力を抑制します。 |
| `--repeat-each <N>` | 各テストを `N` 回実行します（デフォルト: 1）。 |
| `--reporter <reporter>` | 使用するレポーターをカンマ区切りで指定します。"dot"、"line"、"list"などが使用できます（デフォルト: "list"）。カスタムレポーターファイルへのパスも指定できます。 |
| `--retries <retries>` | 不安定なテストの最大リトライ回数。ゼロはリトライなし（デフォルト: リトライなし）。 |
| `--shard <shard>` | テストをシャード化し、選択されたシャードのみを実行します。"current/all"の形式で指定し、1から始まります（例: "3/5"）。 |
| `--timeout <timeout>` | テストのタイムアウトしきい値をミリ秒単位で指定します。ゼロは無制限（デフォルト: 30秒）。 |
| `--trace <mode>` | トレースモードを強制します。"on"、"off"、"on-first-retry"、"on-all-retries"、"retain-on-failure"、"retain-on-first-failure"が指定できます。 |
| `--tsconfig <path>` | インポートされるすべてのファイルに適用される単一のtsconfigへのパス（デフォルト: インポートされる各ファイルのtsconfigを個別に検索）。 |
| `--ui` | 対話型UIモードでテストを実行します。 |
| `--ui-host <host>` | UIを提供するホスト。このオプションを指定するとブラウザタブでUIが開きます。 |
| `--ui-port <port>` | UIを提供するポート（デフォルト: 自動）。 |
| `--update-snapshots` または `-u` | 失敗したスナップショットを更新します。 |
| `--update-source-method [mode]` | 失敗したスナップショットを更新します。"patch"（デフォルト）、"3way"、"overwrite"が指定できます。"patch"は差分ファイルを作成します。"3way"はソースコードにマージコンフリクトマーカーを生成します。"overwrite"はソースコードを上書きします。 |
| `--workers <workers>` または `-j <workers>` | 並列ワーカーの数（デフォルト: CPUコア数の50%、最小2）。 |
| `-x` | 最初の失敗後に停止します。 |