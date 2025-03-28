# CIの設定

## 概要

Playwrightテストは任意のCI環境で実行できます。このガイドでは、GitHub Actionsを使用したテスト実行方法を説明します。

## GitHub Actionsの設定

Playwrightをインストールする際に、GitHub Actionsワークフローを追加するオプションがあります。これにより、`.github/workflows`フォルダ内に`playwright.yml`ファイルが作成され、main/masterブランチへのプッシュとプルリクエスト時にテストが実行されるようになります。

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

このワークフローは以下のステップを実行します：

1. リポジトリのクローン
2. Node.jsのインストール
3. NPM依存関係のインストール
4. Playwrightブラウザのインストール
5. Playwrightテストの実行
6. HTMLレポートをGitHub UIにアップロード

## GitHubへのプッシュ

GitHub Actionsワークフローを設定したら、コードをGitHubリポジトリにプッシュするだけです。`git init`コマンドでgitリポジトリを初期化し、`git add`、`git commit`、`git push`コマンドを使用してコードをプッシュします。

## ワークフローの確認

**Actions**タブをクリックすると、ワークフローの実行状況を確認できます。テストが合格したか失敗したかがここに表示されます。

## テストログの確認

ワークフロー実行をクリックすると、GitHubが実行したすべてのアクションが表示されます。**Run Playwright tests**をクリックすると、エラーメッセージ、期待値と実際の値、呼び出しログが表示されます。

## HTMLレポート

HTMLレポートはテストの完全なレポートを表示します。ブラウザ、合格したテスト、失敗したテスト、スキップされたテスト、不安定なテストでフィルタリングできます。

### HTMLレポートのダウンロード

Artifactsセクションで**playwright-report**をクリックすると、レポートをZIPファイルとしてダウンロードできます。

### HTMLレポートの表示

ローカルでレポートを開くには、ZIPを展開し、Playwrightがインストールされているフォルダで`npx playwright show-report`コマンドを使用します。

```bash
npx playwright show-report 展開したレポートフォルダ名
```

## トレースの表示

`npx playwright show-report`でレポートを表示した後、テストのファイル名の横にあるトレースアイコンをクリックすると、テストのトレースを表示して各アクションを検査できます。

## Webでのレポート公開

HTMLレポートをZIPファイルとしてダウンロードするのは便利ではありません。Azure Storageの静的Webサイトホスティング機能を利用して、HTMLレポートをインターネット上で簡単に提供できます。

1. [Azure Storageアカウント](https://learn.microsoft.com/ja-jp/azure/storage/common/storage-account-create)を作成します。

2. ストレージアカウントの[静的Webサイトホスティング](https://learn.microsoft.com/ja-jp/azure/storage/blobs/storage-blob-static-website-how-to)を有効にします。

3. Azureでサービスプリンシパルを作成し、Azure Blobストレージへのアクセス権を付与します。

   ```bash
   az ad sp create-for-rbac --name "github-actions" --role "Storage Blob Data Contributor" --scopes /subscriptions/<サブスクリプションID>/resourceGroups/<リソースグループ名>/providers/Microsoft.Storage/storageAccounts/<ストレージアカウント名>
   ```

4. 前のステップの認証情報を使用して、GitHubリポジトリに暗号化されたシークレットを設定します。リポジトリの設定の[GitHub Actionsシークレット](https://docs.github.com/ja/actions/security-guides/encrypted-secrets)で、以下のシークレットを追加します：

   - `AZCOPY_SPA_APPLICATION_ID`
   - `AZCOPY_SPA_CLIENT_SECRET`
   - `AZCOPY_TENANT_ID`

5. HTMLレポートをAzure Storageにアップロードするステップを追加します。

   ```yaml
   # .github/workflows/playwright.yml
   ...
   - name: Upload HTML report to Azure
     shell: bash
     run: |
       REPORT_DIR='run-${{ github.run_id }}-${{ github.run_attempt }}'
       azcopy cp --recursive "./playwright-report/*" "https://<ストレージアカウント名>.blob.core.windows.net/$web/$REPORT_DIR"
       echo "::notice title=HTML report url::https://<ストレージアカウント名>.z1.web.core.windows.net/$REPORT_DIR/index.html"
     env:
       AZCOPY_AUTO_LOGIN_TYPE: SPN
       AZCOPY_SPA_APPLICATION_ID: '${{ secrets.AZCOPY_SPA_APPLICATION_ID }}'
       AZCOPY_SPA_CLIENT_SECRET: '${{ secrets.AZCOPY_SPA_CLIENT_SECRET }}'
       AZCOPY_TENANT_ID: '${{ secrets.AZCOPY_TENANT_ID }}'
   ```

`$web`ストレージコンテナの内容は、Webサイトの[公開URL](https://learn.microsoft.com/ja-jp/azure/storage/blobs/storage-blob-static-website-how-to?tabs=azure-portal#portal-find-url)からアクセスできます。

注意: このステップは、フォークされたリポジトリから作成されたプルリクエストでは機能しません。そのようなワークフローは[シークレットにアクセスできない](https://docs.github.com/ja/actions/security-guides/encrypted-secrets#using-encrypted-secrets-in-a-workflow)ためです。