# Playwrightブラウザ

## 概要

Playwrightの各バージョンは、動作するために特定のバージョンのブラウザバイナリが必要です。PlaywrightのCLIを使用してこれらのブラウザをインストールする必要があります。

Playwrightは各リリースでサポートするブラウザのバージョンを更新するため、最新のPlaywrightは常に最新のブラウザをサポートします。つまり、Playwrightを更新するたびに、`install`コマンドを再実行する必要がある場合があります。

## ブラウザのインストール

Playwrightはサポートされているブラウザをインストールできます。引数なしでコマンドを実行すると、デフォルトのブラウザがインストールされます。

```bash
npx playwright install
```

引数を指定して特定のブラウザをインストールすることもできます：

```bash
npx playwright install webkit
```

サポートされているすべてのブラウザを確認：

```bash
npx playwright install --help
```

## システム依存関係のインストール

システム依存関係は自動的にインストールできます。これはCI環境で特に便利です。

```bash
npx playwright install-deps
```

単一のブラウザの依存関係をインストールすることもできます：

```bash
npx playwright install-deps chromium
```

`install-deps`と`install`を組み合わせることも可能です：

```bash
npx playwright install --with-deps chromium
```

公式にサポートされているオペレーティングシステムについては、[システム要件](/docs/intro#system-requirements)を参照してください。

## Playwrightの定期的な更新

Playwrightを最新の状態に保つことで、新機能を使用し、最新のブラウザバージョンでアプリをテストして、最新のブラウザバージョンが一般公開される前に障害を検出できます。

```bash
# Playwrightを更新
npm install -D @playwright/test@latest

# 新しいブラウザをインストール
npx playwright install
```

最新バージョンとリリースされた変更を確認するには、[リリースノート](/docs/release-notes)を参照してください。

```bash
# 現在のPlaywrightバージョンを確認
npx playwright --version
```

## ブラウザの設定

Playwrightは、Chromium、WebKit、Firefoxブラウザだけでなく、Google ChromeやMicrosoft Edgeなどのブランドブラウザでもテストを実行できます。また、エミュレートされたタブレットやモバイルデバイスでも実行できます。デスクトップ、タブレット、モバイルデバイスの完全なリストについては、[デバイスパラメータレジストリ](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json)を参照してください。

### 異なるブラウザでテストを実行

Playwrightは、設定で**プロジェクト**を設定することで、複数のブラウザと構成でテストを実行できます。各プロジェクトに[異なるオプション](/docs/test-configuration)を追加することもできます。

```javascript
// playwright.config.js
module.exports = {
  projects: [
    /* デスクトップブラウザでテスト */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* モバイルビューポートでテスト */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    /* ブランドブラウザでテスト */
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' }, // または 'chrome-beta'
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' }, // または 'msedge-dev'
    },
  ],
};
```

Playwrightはデフォルトですべてのプロジェクトを実行します。

```bash
npx playwright test
```

`--project`コマンドラインオプションを使用して単一のプロジェクトを実行します。

```bash
npx playwright test --project=firefox
```

VS Code拡張機能を使用すると、Playwrightサイドバーでブラウザ名の横にあるチェックボックスをチェックして、異なるブラウザでテストを実行できます。

### Chromium

Google Chrome、Microsoft Edge、その他のChromiumベースのブラウザの場合、デフォルトでPlaywrightはオープンソースのChromiumビルドを使用します。Chromiumプロジェクトはブランドブラウザよりも先行しているため、世界がGoogle Chrome Nを使用している時点で、PlaywrightはすでにChromium N+1をサポートしており、これは数週間後にGoogle ChromeとMicrosoft Edgeでリリースされます。

### Chromium: headless shell

Playwrightはヘッド付き操作用の通常のChromiumビルドと、ヘッドレスモード用の別の[chromium headless shell](https://developer.chrome.com/blog/chrome-headless-shell)を提供しています。

ヘッドレスシェルでのみテストを実行している場合（つまり、`channel`オプションが指定されていない場合）、例えばCIでは、インストール時に`--only-shell`を渡すことで、完全なChromiumブラウザのダウンロードを避けることができます。

```bash
# ヘッドレスでのみテストを実行
npx playwright install --with-deps --only-shell
```

### Chromium: 新しいヘッドレスモード

`'chromium'`チャンネルを使用して新しいヘッドレスモードを選択できます。[公式のChromeドキュメントによると](https://developer.chrome.com/blog/chrome-headless-shell)：

> 一方、新しいヘッドレスは実際のChromeブラウザであり、より本物らしく、信頼性が高く、より多くの機能を提供します。これにより、高精度のエンドツーエンドWebアプリテストやブラウザ拡張機能テストに適しています。

詳細については、[issue #33566](https://github.com/microsoft/playwright/issues/33566)を参照してください。

```javascript
// playwright.config.js
module.exports = {
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
};
```

新しいヘッドレスモードでは、ブラウザインストール中に`--no-shell`オプションを使用してヘッドレスシェルのダウンロードをスキップできます：

```bash
# ヘッドレスでのみテストを実行
npx playwright install --with-deps --no-shell
```

### Google ChromeとMicrosoft Edge

Playwrightは最新のChromiumビルドをダウンロードして使用できますが、マシンで利用可能なブランド版のGoogle ChromeとMicrosoft Edgeに対して操作することもできます（Playwrightはデフォルトではそれらをインストールしないことに注意してください）。特に、現在のPlaywrightバージョンは、これらのブラウザの安定版とベータ版チャンネルをサポートします。

利用可能なチャンネルは`chrome`、`msedge`、`chrome-beta`、`msedge-beta`、`chrome-dev`、`msedge-dev`、`chrome-canary`、`msedge-canary`です。

> **警告**: 特定のエンタープライズブラウザポリシーは、PlaywrightがGoogle ChromeとMicrosoft Edgeを起動および制御する能力に影響を与える可能性があります。ブラウザポリシーのある環境での実行は、Playwrightプロジェクトの範囲外です。

> **警告**: Google ChromeとMicrosoft Edgeは、通常のヘッドモードに近い[新しいヘッドレスモード](https://developer.chrome.com/docs/chromium/headless)に切り替えました。これは、Playwrightがヘッドレスで実行する際にデフォルトで使用される[chromium headless shell](https://developer.chrome.com/blog/chrome-headless-shell)とは異なるため、場合によっては異なる動作が予想されます。詳細については、[issue #33566](https://github.com/microsoft/playwright/issues/33566)を参照してください。

```javascript
// playwright.config.js
module.exports = {
  projects: [
    /* ブランドブラウザでテスト */
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' }, // または 'chrome-beta'
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' }, // または "msedge-beta" または 'msedge-dev'
    },
  ],
};
```

#### Google ChromeとMicrosoft Edgeのインストール

マシンでGoogle ChromeまたはMicrosoft Edgeが利用できない場合は、Playwrightコマンドラインツールを使用してインストールできます：

```bash
npx playwright install msedge
```

> **警告**: Google ChromeまたはMicrosoft Edgeのインストールは、現在のブラウザインストールを上書きして、オペレーティングシステムのデフォルトのグローバルな場所にインストールされます。

#### Google ChromeとMicrosoft Edgeを使用する場合と使用しない場合

##### デフォルト

最新のChromiumを使用するデフォルトのPlaywright設定を使用することは、ほとんどの場合良い考えです。Playwrightは安定版チャンネルよりも先行しているため、今後のGoogle ChromeまたはMicrosoft Edgeのリリースがサイトを壊さないという安心感があります。早期に問題を発見し、公式のChrome更新前に修正する時間が十分にあります。

##### 回帰テスト

とはいえ、テストポリシーでは、現在公開されているブラウザに対して回帰テストを実行することが必要な場合があります。この場合、`"chrome"`または`"msedge"`の安定版チャンネルのいずれかを選択できます。

##### メディアコーデック

公式バイナリを使用してテストするもう一つの理由は、メディアコーデックに関連する機能をテストすることです。Chromiumには、様々なライセンス上の考慮事項や契約のため、Google ChromeやMicrosoft Edgeがバンドルしているすべてのコーデックがありません。サイトがこの種のコーデックに依存している場合（これはまれですが）、公式チャンネルを使用することもできます。

##### エンタープライズポリシー

Google ChromeとMicrosoft Edgeはエンタープライズポリシーを尊重しており、これには機能の制限、ネットワークプロキシ、テストの妨げになる必須拡張機能が含まれます。そのため、そのようなポリシーを使用する組織の一部である場合、ローカルテストにはバンドルされたChromiumを使用するのが最も簡単です。通常、そのような制限がないボット上では、安定版チャンネルを選択することもできます。

### Firefox

PlaywrightのFirefoxバージョンは、最新の[Firefox安定版](https://www.mozilla.org/en-US/firefox/new/)ビルドに一致します。Playwrightはパッチに依存しているため、ブランド版のFirefoxでは動作しません。

プラットフォームに大きく依存する特定の機能の可用性は、オペレーティングシステム間で異なる場合があることに注意してください。例えば、利用可能なメディアコーデックはLinux、macOS、Windowsの間で大幅に異なります。

### WebKit

PlaywrightのWebKitは最新のWebKitメインブランチソースから派生しており、これらの更新がApple Safariやその他のWebKitベースのブラウザに組み込まれる前に提供されることがよくあります。これにより、潜在的なブラウザ更新の問題に対応するための十分な時間が得られます。Playwrightはパッチに依存しているため、ブランド版のSafariでは動作しません。代わりに、最新のWebKitビルドを使用してテストできます。

プラットフォームに大きく依存する特定の機能の可用性は、オペレーティングシステム間で異なる場合があることに注意してください。例えば、利用可能なメディアコーデックはLinux、macOS、Windowsの間で大幅に異なります。Linux CI上でWebKitを実行することは通常最も手頃なオプションですが、Safariに最も近い体験を得るには、特にビデオ再生を行う場合は、mac上でWebKitを実行する必要があります。

## ファイアウォールまたはプロキシ背後でのインストール

デフォルトでは、PlaywrightはMicrosoftのCDNからブラウザをダウンロードします。

企業が公共リソースへの直接アクセスをブロックする内部プロキシを維持している場合があります。この場合、Playwrightはプロキシサーバーを介してブラウザをダウンロードするように設定できます。

```bash
HTTPS_PROXY=https://192.0.2.1 npx playwright install
```

## アーティファクトリポジトリからのダウンロード

デフォルトでは、PlaywrightはMicrosoftのCDNからブラウザをダウンロードします。

企業がブラウザバイナリをホストする内部アーティファクトリポジトリを維持している場合があります。この場合、Playwrightは`PLAYWRIGHT_DOWNLOAD_HOST`環境変数を使用してカスタムの場所からダウンロードするように設定できます。

```bash
PLAYWRIGHT_DOWNLOAD_HOST=http://192.0.2.1 npx playwright install
```

ブラウザごとのダウンロードホストを使用することも可能です。`PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST`、`PLAYWRIGHT_FIREFOX_DOWNLOAD_HOST`、`PLAYWRIGHT_WEBKIT_DOWNLOAD_HOST`環境変数は`PLAYWRIGHT_DOWNLOAD_HOST`よりも優先されます。

```bash
PLAYWRIGHT_FIREFOX_DOWNLOAD_HOST=http://203.0.113.3 PLAYWRIGHT_DOWNLOAD_HOST=http://192.0.2.1 npx playwright install
```

## ブラウザバイナリの管理

PlaywrightはChromium、WebKit、Firefoxブラウザを、OS固有のキャッシュフォルダにダウンロードします：

* Windows: `%USERPROFILE%\AppData\Local\ms-playwright`
* macOS: `~/Library/Caches/ms-playwright`
* Linux: `~/.cache/ms-playwright`

これらのブラウザはインストール時に数百メガバイトのディスク容量を占めます。

環境変数を使用してデフォルトの動作をオーバーライドできます。Playwrightをインストールする際に、特定の場所にブラウザをダウンロードするよう指示できます：

```bash
PLAYWRIGHT_BROWSERS_PATH=$HOME/pw-browsers npx playwright install
```

Playwrightスクリプトを実行する際に、共有場所でブラウザを検索するよう指示できます：

```bash
PLAYWRIGHT_BROWSERS_PATH=$HOME/pw-browsers npx playwright test
```

Playwrightはこれらのブラウザを必要とするパッケージを追跡し、Playwrightを新しいバージョンに更新すると、それらをガベージコレクションします。

### ハーメティックインストール

ハーメティックインストールを選択し、バイナリをローカルフォルダに配置することができます：

```bash
# バイナリをnode_modules/playwright-core/.local-browsersに配置
PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install
```

> **注意**: `PLAYWRIGHT_BROWSERS_PATH`はGoogle ChromeとMicrosoft Edgeのインストールパスを変更しません。

### 古いブラウザの削除

Playwrightはそのブラウザを使用するクライアントを追跡します。特定のバージョンのブラウザを必要とするクライアントがなくなると、そのバージョンはシステムから削除されます。これにより、異なるバージョンのPlaywrightインスタンスを安全に使用でき、同時に使用されなくなったブラウザのディスク容量を無駄にしません。

未使用ブラウザの削除をオプトアウトするには、`PLAYWRIGHT_SKIP_BROWSER_GC=1`環境変数を設定できます。

### ブラウザのアンインストール

これにより、現在のPlaywrightインストールのブラウザ（chromium、firefox、webkit）が削除されます：

```bash
npx playwright uninstall
```

他のPlaywrightインストールのブラウザも削除するには、`--all`フラグを渡します：

```bash
npx playwright uninstall --all