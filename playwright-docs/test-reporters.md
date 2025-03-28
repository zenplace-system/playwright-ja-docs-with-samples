# レポーター

## 概要

Playwright Testには、異なるニーズに対応するいくつかの組み込みレポーターとカスタムレポーターを提供する機能があります。組み込みレポーターを試す最も簡単な方法は、`--reporter`[コマンドラインオプション](/docs/test-cli)を渡すことです。

```bash
npx playwright test --reporter=line
```

より詳細な制御が必要な場合は、[設定ファイル](/docs/test-configuration)でプログラム的にレポーターを指定できます。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: 'line',
});
```

### 複数のレポーター

複数のレポーターを同時に使用できます。例えば、ターミナル出力用に`'list'`を使用し、テスト結果を含む包括的なjsonファイルを取得するために`'json'`を使用できます。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results.json' }]
  ],
});
```

### CI上のレポーター

ローカルとCI上で異なるレポーターを使用できます。例えば、簡潔な`'dot'`レポーターを使用すると、出力が多すぎるのを避けられます。これはCIでのデフォルトです。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // CIでは簡潔な'dot'、ローカルで実行する場合はデフォルトの'list'
  reporter: process.env.CI ? 'dot' : 'list',
});
```

## 組み込みレポーター

すべての組み込みレポーターは失敗に関する詳細情報を表示し、主に成功した実行の詳細度が異なります。

### Listレポーター

Listレポーターはデフォルトです（CIでは`dot`レポーターがデフォルト）。実行中の各テストに対して1行を出力します。

```bash
npx playwright test --reporter=list
```

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: 'list',
});
```

テスト実行中の出力例です。失敗は最後にリストされます。

```
npx playwright test --reporter=list
Running 124 tests using 6 workers
 1  ✓ should access error in env (438ms)
 2  ✓ handle long test names (515ms)
 3  x 1) render expected (691ms)
 4  ✓ should timeout (932ms)
 5    should repeat each:
 6  ✓ should respect enclosing .gitignore (569ms)
 7    should teardown env after timeout:
 8    should respect excluded tests:
 9  ✓ should handle env beforeEach error (638ms)
10    should respect enclosing .gitignore:
```

次の設定オプションを渡すことで、ステップのレンダリングを有効にできます：

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['list', { printSteps: true }]],
});
```

### Lineレポーター

Lineレポーターはlistレポーターよりも簡潔です。最後に終了したテストを報告するために1行を使用し、失敗が発生したときに出力します。Lineレポーターは、進行状況を表示しながらすべてのテストをリストアップして出力をスパムしない大規模なテストスイートに役立ちます。

```bash
npx playwright test --reporter=line
```

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: 'line',
});
```

テスト実行中の出力例です。失敗はインラインで報告されます。

```
npx playwright test --reporter=line
Running 124 tests using 6 workers
  1) dot-reporter.spec.ts:20:1 › render expected ===================================================
    Error: expect(received).toBe(expected) // Object.is equality
    Expected: 1
    Received: 0
[23/124] gitignore.spec.ts - should respect nested .gitignore
```

### Dotレポーター

Dotレポーターは非常に簡潔で、成功したテスト実行ごとに1文字だけ生成します。CIではデフォルトであり、多くの出力が不要な場合に便利です。

```bash
npx playwright test --reporter=dot
```

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: 'dot',
});
```

テスト実行中の出力例です。失敗は最後にリストされます。

```
npx playwright test --reporter=dot
Running 124 tests using 6 workers
······F·············································
```

各テストの実行状態を示す1文字が表示されます：

| 文字 | 説明 |
|-----|------|
| `·` | 合格 |
| `F` | 失敗 |
| `×` | 失敗またはタイムアウト - 再試行される |
| `±` | 再試行で合格（不安定） |
| `T` | タイムアウト |
| `°` | スキップ |

### HTMLレポーター

HTMLレポーターは、Webページとして提供できるテスト実行のレポートを含む自己完結型のフォルダを生成します。

```bash
npx playwright test --reporter=html
```

デフォルトでは、一部のテストが失敗した場合、HTMLレポートは自動的に開かれます。この動作はPlaywright設定の`open`プロパティまたは`PLAYWRIGHT_HTML_OPEN`環境変数で制御できます。このプロパティの可能な値は`always`、`never`、`on-failure`（デフォルト）です。

HTMLレポートを提供するために使用される`host`と`port`も設定できます。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['html', { open: 'never' }]],
});
```

デフォルトでは、レポートは現在の作業ディレクトリの`playwright-report`フォルダに書き込まれます。`PLAYWRIGHT_HTML_OUTPUT_DIR`環境変数またはレポーター設定を使用して、その場所を上書きできます。

設定ファイルでは、オプションを直接渡します：

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['html', { outputFolder: 'my-report' }]],
});
```

データフォルダから添付ファイルを他の場所にアップロードする場合は、`attachmentsBaseURL`オプションを使用して、HTMLレポートがそれらを探す場所を指定できます。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['html', { attachmentsBaseURL: 'https://external-storage.com/' }]],
});
```

最後のテスト実行レポートを開く簡単な方法は：

```bash
npx playwright show-report
```

またはカスタムフォルダ名がある場合：

```bash
npx playwright show-report my-report
```

### Blobレポーター

Blobレポートにはテスト実行に関するすべての詳細が含まれており、後で他のレポートを生成するために使用できます。その主な機能は、[シャーディングされたテスト](/docs/test-sharding)からのレポートのマージを容易にすることです。

```bash
npx playwright test --reporter=blob
```

デフォルトでは、レポートはpackage.jsonディレクトリまたは現在の作業ディレクトリ（package.jsonが見つからない場合）の`blob-report`ディレクトリに書き込まれます。レポートファイル名は`report-<hash>.zip`または[シャーディング](/docs/test-sharding)が使用されている場合は`report-<hash>-<shard_number>.zip`のようになります。

### JSONレポーター

JSONレポーターはテスト実行に関するすべての情報を含むオブジェクトを生成します。

ほとんどの場合、JSONをファイルに書き込みたいでしょう。`--reporter=json`で実行する場合は、`PLAYWRIGHT_JSON_OUTPUT_NAME`環境変数を使用します：

```bash
# Bash
PLAYWRIGHT_JSON_OUTPUT_NAME=results.json npx playwright test --reporter=json

# PowerShell
$env:PLAYWRIGHT_JSON_OUTPUT_NAME="results.json"
npx playwright test --reporter=json

# Batch
set PLAYWRIGHT_JSON_OUTPUT_NAME=results.json
npx playwright test --reporter=json
```

設定ファイルでは、オプションを直接渡します：

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['json', { outputFile: 'results.json' }]],
});
```

### JUnitレポーター

JUnitレポーターはJUnitスタイルのxmlレポートを生成します。

ほとんどの場合、レポートをxmlファイルに書き込みたいでしょう。`--reporter=junit`で実行する場合は、`PLAYWRIGHT_JUNIT_OUTPUT_NAME`環境変数を使用します：

```bash
# Bash
PLAYWRIGHT_JUNIT_OUTPUT_NAME=results.xml npx playwright test --reporter=junit

# PowerShell
$env:PLAYWRIGHT_JUNIT_OUTPUT_NAME="results.xml"
npx playwright test --reporter=junit

# Batch
set PLAYWRIGHT_JUNIT_OUTPUT_NAME=results.xml
npx playwright test --reporter=junit
```

設定ファイルでは、オプションを直接渡します：

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['junit', { outputFile: 'results.xml' }]],
});
```

### GitHub Actionsアノテーション

GitHub actionsで実行する際に自動的な失敗アノテーションを取得するには、組み込みの`github`レポーターを使用できます。

他のすべてのレポーターもGitHub Actionsで動作しますが、アノテーションは提供しません。また、マトリックス戦略でテストを実行する場合、スタックトレースの失敗が増加してGitHubファイルビューを不明瞭にするため、このアノテーションタイプの使用はお勧めしません。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // GitHub Actions CIでアノテーションを生成するための'github'と簡潔な'dot'
  // ローカルで実行する場合はデフォルトの'list'
  reporter: process.env.CI ? 'github' : 'list',
});
```

## カスタムレポーター

レポーターメソッドの一部を実装したクラスを作成することで、カスタムレポーターを作成できます。[Reporter](/docs/api/class-reporter)APIの詳細をご覧ください。

```javascript
// my-awesome-reporter.js
import { Reporter } from '@playwright/test/reporter';

class MyReporter {
  onBegin(config, suite) {
    console.log(`${suite.allTests().length}個のテストで実行を開始します`);
  }

  onTestBegin(test, result) {
    console.log(`テスト${test.title}を開始します`);
  }

  onTestEnd(test, result) {
    console.log(`テスト${test.title}が終了しました: ${result.status}`);
  }

  onEnd(result) {
    console.log(`実行が終了しました: ${result.status}`);
  }
}

export default MyReporter;
```

このレポーターを[testConfig.reporter](/docs/api/class-testconfig#test-config-reporter)で使用します。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: './my-awesome-reporter.js',
});
```

または、`--reporter`コマンドラインオプションとしてレポーターファイルパスを渡すだけです：

```bash
npx playwright test --reporter="./myreporter/my-awesome-reporter.js"