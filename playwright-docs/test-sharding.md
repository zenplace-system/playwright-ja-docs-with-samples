# シャーディング

## 概要

デフォルトでは、Playwrightはテストファイルを[並列](/docs/test-parallel)で実行し、マシンのCPUコアを最適に活用します。さらに並列化を高めるために、複数のマシンで同時にテストを実行することでPlaywrightのテスト実行をスケールアップできます。これを「シャーディング」と呼びます。Playwrightでのシャーディングとは、テストを「シャード」と呼ばれる小さな部分に分割することです。各シャードは独立して実行できる別々のジョブのようなものです。目的はテストを分割してテスト実行時間を短縮することです。

テストをシャーディングすると、各シャードは利用可能なCPUコアを活用して独立して実行できます。これにより、タスクを同時に実行してテストプロセスを高速化できます。

CIパイプラインでは、各シャードを別々のジョブとして実行でき、CPUコアなどのCIパイプラインで利用可能なハードウェアリソースを活用してテストをより速く実行できます。

## 複数マシン間でのテストのシャーディング

テストスイートをシャーディングするには、コマンドラインに`--shard=x/y`を渡します。例えば、スイートを4つのシャードに分割し、それぞれがテストの4分の1を実行する場合：

```bash
npx playwright test --shard=1/4
npx playwright test --shard=2/4
npx playwright test --shard=3/4
npx playwright test --shard=4/4
```

これらのシャードを異なるジョブで並列に実行すると、テストスイートは4倍速く完了します。

Playwrightは並列に実行できるテストのみをシャーディングできることに注意してください。デフォルトでは、Playwrightはテストファイルをシャーディングします。他のオプションについては[並列実行ガイド](/docs/test-parallel)を参照してください。

## シャードのバランシング

シャーディングは、[testProject.fullyParallel](/docs/api/class-testproject#test-project-fully-parallel)オプションを使用するかどうかによって、2つの粒度レベルで行うことができます。これはテストがシャード間でどのようにバランスされるかに影響します。

**fullyParallelを使用したシャーディング**

`fullyParallel: true`が有効な場合、Playwright Testは個々のテストを複数のシャードで並列に実行し、各シャードがテストを均等に分散して受け取るようにします。これにより、テストレベルの粒度が可能になり、各シャードは実行する個々のテストの数をバランスさせようとします。これはシャーディング時に均等な負荷分散を確保するための推奨モードであり、Playwrightはテストの総数に基づいてシャード実行を最適化できます。

**fullyParallelなしのシャーディング**

fullyParallel設定がない場合、Playwright Testはファイルレベルの粒度をデフォルトとし、テストファイル全体がシャードに割り当てられます（同じファイルが異なるプロジェクト間で異なるシャードに割り当てられる場合があることに注意）。この場合、ファイルごとのテスト数がシャードの分散に大きく影響します。テストファイルが均等にサイズ設定されていない場合（つまり、一部のファイルに他のファイルよりもはるかに多くのテストが含まれている場合）、特定のシャードが大幅に多くのテストを実行し、他のシャードはより少ないテストを実行するか、まったく実行しない可能性があります。

**重要なポイント：**

* **`fullyParallel: true`の場合**：テストは個々のテストレベルで分割され、よりバランスの取れたシャード実行につながります。
* **`fullyParallel`なしの場合**：テストはファイルレベルで分割されるため、シャードをバランスさせるには、テストファイルを小さく均等なサイズに保つことが重要です。
* シャーディングを最も効果的に使用するには、特にCI環境では、シャード間でバランスの取れた分散を目指す場合は`fullyParallel: true`を使用することをお勧めします。そうでない場合は、不均衡を避けるためにテストファイルを手動で整理する必要があるかもしれません。

## 複数シャードからのレポートのマージ

前の例では、各テストシャードに独自のテストレポートがあります。すべてのシャードからのすべてのテスト結果を示す結合レポートが必要な場合は、それらをマージできます。

CIで実行する際に、設定に`blob`レポーターを追加することから始めます：

```javascript
// playwright.config.js
export default defineConfig({
  testDir: './tests',
  reporter: process.env.CI ? 'blob' : 'html',
});
```

blobレポートには、実行されたすべてのテストとその結果、およびトレースやスクリーンショットの差分などのすべてのテスト添付ファイルに関する情報が含まれています。blobレポートはマージして、他のPlaywrightレポートに変換できます。デフォルトでは、blobレポートは`blob-report`ディレクトリに生成されます。

複数のシャードからのレポートをマージするには、blobレポートファイルを単一のディレクトリ（例：`all-blob-reports`）に配置します。blobレポート名にはシャード番号が含まれているため、衝突することはありません。

その後、`npx playwright merge-reports`コマンドを実行します：

```bash
npx playwright merge-reports --reporter html ./all-blob-reports
```

これにより、標準のHTMLレポートが`playwright-report`ディレクトリに生成されます。

## GitHub Actionsの例

GitHub Actionsは[`jobs.<job_id>.strategy.matrix`](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix)オプションを使用して[複数のジョブ間でテストをシャーディング](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)をサポートしています。`matrix`オプションは、提供されたオプションのすべての可能な組み合わせに対して別々のジョブを実行します。

次の例は、4台のマシンで並列にテストを実行し、レポートを1つのレポートにマージするようにジョブを設定する方法を示しています。上記の例のように、`playwright.config.js`ファイルに`reporter: process.env.CI ? 'blob' : 'html',`を追加することを忘れないでください。

1. まず、作成するシャードの総数を含む`shardTotal: [4]`オプションとシャード番号の配列`shardIndex: [1, 2, 3, 4]`を含む`matrix`オプションをジョブ設定に追加します。
2. 次に、`--shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}`オプションでPlaywrightテストを実行します。これにより、各シャードに対してテストコマンドが実行されます。
3. 最後に、blobレポートをGitHub Actions Artifactsにアップロードします。これにより、blobレポートがワークフロー内の他のジョブで利用可能になります。

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  playwright-tests:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
    - name: Upload blob report to GitHub Actions Artifacts
      if: ${{ !cancelled() }}
      uses: actions/upload-artifact@v4
      with:
        name: blob-report-${{ matrix.shardIndex }}
        path: blob-report
        retention-days: 1
```

1. すべてのシャードが完了した後、レポートをマージして結合された[HTMLレポート](/docs/test-reporters#html-reporter)を生成する別のジョブを実行できます。実行順序を確保するために、`needs: [playwright-tests]`を追加して`merge-reports`ジョブをシャーディングされた`playwright-tests`ジョブに[依存](https://docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow#defining-prerequisite-jobs)させます。

```yaml
# .github/workflows/playwright.yml
jobs:
...
  merge-reports:
    # 一部のシャードが失敗した場合でも、playwright-testsの後にレポートをマージ
    if: ${{ !cancelled() }}
    needs: [playwright-tests]
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Download blob reports from GitHub Actions Artifacts
      uses: actions/download-artifact@v4
      with:
        path: all-blob-reports
        pattern: blob-report-*
        merge-multiple: true
    - name: Merge into HTML Report
      run: npx playwright merge-reports --reporter html ./all-blob-reports
    - name: Upload HTML report
      uses: actions/upload-artifact@v4
      with:
        name: html-report--attempt-${{ github.run_attempt }}
        path: playwright-report
        retention-days: 14
```

これで、レポートがマージされ、結合されたHTMLレポートがGitHub Actions Artifactsタブで利用可能になります。

## merge-reports CLI

`npx playwright merge-reports path/to/blob-reports-dir`は、渡されたディレクトリからすべてのblobレポートを読み取り、それらを1つのレポートにマージします。

異なるOSからのレポートをマージする場合は、テストのルートとして使用するディレクトリを明確にするために明示的なマージ設定を提供する必要があります。

サポートされているオプション：

* `--reporter reporter-to-use`

  生成するレポートの種類。カンマで区切られた複数のレポーターを指定できます。

  例：
  ```bash
  npx playwright merge-reports --reporter=html,github ./blob-reports
  ```

* `--config path/to/config/file`

  出力レポーターを含むPlaywright設定ファイルを指定します。このオプションを使用して、出力レポーターに追加の設定を渡します。この設定ファイルは、blobレポートの作成中に使用されたものとは異なる場合があります。

  例：
  ```bash
  npx playwright merge-reports --config=merge.config.js ./blob-reports
  ```

  ```javascript
  // merge.config.js
  export default {
    testDir: 'e2e',
    reporter: [['html', { open: 'never' }]],
  };