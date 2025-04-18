# PlaywrightのUIモード

## 概要

UIモードでは、タイムトラベル機能を備えたテストの探索、実行、デバッグが可能で、ウォッチモードも完備しています。すべてのテストファイルがテストサイドバーに表示され、各ファイルや記述ブロックを展開して個別に実行、表示、監視、デバッグできます。テストは**名前**、[**プロジェクト**](/docs/test-projects)（`playwright.config.js`ファイルで設定）、**@タグ**、または**成功**、**失敗**、**スキップ**の実行ステータスでフィルタリングできます。テストの完全なトレースを確認し、各アクションの前後にホバーして各ステップで何が起こっていたかを確認できます。また、特定の瞬間のDOMスナップショットを別ウィンドウにポップアウトして、より良いデバッグ体験を得ることもできます。

## UIモードの開き方

UIモードを開くには、ターミナルで次のコマンドを実行します：

```bash
npx playwright test --ui
```

## テストの実行

UIモードを起動すると、すべてのテストファイルのリストが表示されます。サイドバーの三角形アイコンをクリックすると、すべてのテストを実行できます。また、名前にカーソルを合わせて横の三角形をクリックすると、単一のテストファイル、テストブロック、または単一のテストを実行できます。

## テストのフィルタリング

テキストや`@タグ`、または成功、失敗、スキップしたテストでフィルタリングできます。また、`playwright.config.js`ファイルで設定した[プロジェクト](/docs/test-projects)でフィルタリングすることもできます。プロジェクト依存関係を使用している場合は、依存するテストを実行する前にセットアップテストを最初に実行してください。UIモードはセットアップテストを考慮しないため、手動で先に実行する必要があります。

## タイムラインビュー

トレースの上部には、ナビゲーションやアクションを強調表示するために異なる色を使用したテストのタイムラインビューが表示されます。前後にホバーすると、各アクションの画像スナップショットが表示されます。アクションをダブルクリックすると、そのアクションの時間範囲が表示されます。タイムラインのスライダーを使用して選択されたアクションを増やすことができ、これらはアクションタブに表示され、コンソールログとネットワークログは選択されたアクションのログのみを表示するようにフィルタリングされます。

## アクション

アクションタブでは、各アクションに使用されたロケーターと実行にかかった時間を確認できます。テストの各アクションにホバーすると、DOMスナップショットの変化を視覚的に確認できます。時間を前後に移動し、アクションをクリックして検査およびデバッグします。「Before」と「After」タブを使用して、アクションの前後に何が起こったかを視覚的に確認できます。

## DOMのポップアウトと検査

DOMスナップショット上部のポップアウトアイコンをクリックすると、より良いデバッグ体験のためにDOMスナップショットを独自のウィンドウにポップアウトできます。そこからブラウザのDevToolsを開き、HTML、CSS、コンソールなどを検査できます。UIモードに戻り、別のアクションをクリックしてポップアウトすると、2つを並べて簡単に比較したり、個別にデバッグしたりできます。

## ロケーターの選択

「Pick locator」ボタンをクリックし、DOMスナップショット上にホバーすると、ホバーするたびに各要素のロケーターがハイライト表示されます。要素をクリックすると、ロケーターのプレイグラウンドが追加されます。プレイグラウンドでロケーターを変更し、変更したロケーターがDOMスナップショット内のロケーターと一致するかどうかを確認できます。ロケーターに満足したら、コピーボタンを使用してロケーターをコピーし、テストに貼り付けることができます。

## ソース

テストの各アクションにホバーすると、そのアクションのコード行がソースパネルでハイライト表示されます。このセクションの右上には「Open in VSCode」ボタンがあります。このボタンをクリックすると、クリックした行のコードでVS Codeでテストが開きます。

## コール

コールタブには、アクションに関する情報（所要時間、使用されたロケーター、strictモードかどうか、使用されたキーなど）が表示されます。

## ログ

テストの完全なログを確認して、Playwrightがビューへのスクロール、要素の表示、有効化、安定化の待機、クリック、入力、キー押下などのアクションの実行など、バックグラウンドで何をしているかをよりよく理解できます。

## エラー

テストが失敗した場合、エラータブに各テストのエラーメッセージが表示されます。タイムラインにもエラーが発生した場所を示す赤い線が表示されます。ソースタブをクリックして、ソースコードのどの行にエラーがあるかを確認することもできます。

## コンソール

ブラウザからのコンソールログとテストからのコンソールログを確認できます。コンソールログがブラウザから来たのかテストファイルから来たのかを示す異なるアイコンが表示されます。

## ネットワーク

ネットワークタブには、テスト中に行われたすべてのネットワークリクエストが表示されます。リクエストの種類、ステータスコード、メソッド、リクエスト、コンテンツタイプ、所要時間、サイズでソートできます。リクエストをクリックすると、リクエストヘッダー、レスポンスヘッダー、リクエスト本文、レスポンス本文などの詳細情報が表示されます。

## 添付ファイル

「添付ファイル」タブでは、添付ファイルを探索できます。[ビジュアルリグレッションテスト](/docs/test-snapshots)を行っている場合は、画像の差分、実際の画像、期待される画像を調べることでスクリーンショットを比較できます。期待される画像をクリックすると、スライダーを使用して一方の画像をもう一方の上にスライドさせることができ、スクリーンショットの違いを簡単に確認できます。

## メタデータ

アクションタブの横にあるメタデータタブには、ブラウザ、ビューポートサイズ、テスト時間などのテストに関する詳細情報が表示されます。

## ウォッチモード

サイドバーの各テスト名の横には目のアイコンがあります。このアイコンをクリックするとウォッチモードが有効になり、テストを変更すると再実行されます。各テストの横にある目のアイコンをクリックするか、サイドバーの上部にある目のアイコンをクリックすると、複数のテストを同時に監視できます。

## DockerとGitHub Codespaces

DockerとGitHub Codespacesの環境では、ブラウザでUIモードを実行できます。コンテナの外部からエンドポイントにアクセスできるようにするには、`localhost`インターフェースにバインドする必要があります：

```bash
npx playwright test --ui-host=localhost
```

GitHub Codespacesの場合、ポートは[自動的に転送](https://docs.github.com/en/codespaces/developing-in-codespaces/forwarding-ports-in-your-codespace#about-forwarded-ports)されるため、ターミナルのリンクをクリックしてブラウザでUIモードを開くことができます。

静的ポートを持つには、`--ui-port`フラグを渡すことができます：

```bash
npx playwright test --ui-port=8080 --ui-host=localhost
```

> **注意**: `--ui-host=localhost`フラグを指定すると、トレース、パスワード、シークレットを含むUIモードがネットワーク内の他のマシンからアクセス可能になります。GitHub Codespacesの場合、ポートはデフォルトでアカウントからのみアクセス可能です。