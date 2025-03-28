# TypeScript

## 概要

Playwrightは標準でTypeScriptをサポートしています。TypeScriptでテストを書くだけで、Playwrightがそれを読み取り、JavaScriptに変換して実行します。

Playwrightは型チェックを行わず、重大でないTypeScriptコンパイルエラーがあってもテストを実行することに注意してください。Playwright と並行してTypeScriptコンパイラを実行することをお勧めします。例えばGitHub Actionsでは：

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    ...
    - name: 型チェックを実行
      run: npx tsc -p tsconfig.json --noEmit
    - name: Playwrightテストを実行
      run: npx playwright test
```

ローカル開発では、[watch](https://www.typescriptlang.org/docs/handbook/configuring-watch.html)モードで`tsc`を実行できます：

```bash
npx tsc -p tsconfig.json --noEmit -w
```

## tsconfig.json

Playwrightは読み込む各ソースファイルの`tsconfig.json`を取得します。Playwrightは`allowJs`、`baseUrl`、`paths`、`references`のtsconfig オプションのみをサポートしていることに注意してください。

テスト専用の設定を変更できるように、テストディレクトリに別の`tsconfig.json`を設定することをお勧めします。以下はディレクトリ構造の例です：

```
src/
  source.ts
tests/
  tsconfig.json  # テスト専用のtsconfig
  example.spec.ts
tsconfig.json  # すべてのTypeScriptソース用の一般的なtsconfig
playwright.config.ts
```

### tsconfig パスマッピング

Playwrightは`tsconfig.json`で宣言された[パスマッピング](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)をサポートしています。`baseUrl`も設定されていることを確認してください。

Playwrightで動作する`tsconfig.json`の例：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@myhelper/*": ["packages/myhelper/*"] // このマッピングは"baseUrl"からの相対パス
    }
  }
}
```

マップされたパスを使用してインポートできるようになります：

```typescript
// example.spec.ts
import { test, expect } from '@playwright/test';
import { username, password } from '@myhelper/credentials';

test('例', async ({ page }) => {
  await page.getByLabel('User Name').fill(username);
  await page.getByLabel('Password').fill(password);
});
```

### tsconfig解決

デフォルトでは、Playwrightはインポートされた各ファイルに対して、ディレクトリ構造を上に進み、`tsconfig.json`または`jsconfig.json`を探すことで、最も近いtsconfigを検索します。これにより、テスト専用の`tests/tsconfig.json`ファイルを作成でき、Playwrightが自動的に選択します。

```bash
# Playwrightは自動的にtsconfigを選択
npx playwright test
```

または、コマンドラインで使用する単一のtsconfigファイルを指定でき、Playwrightはテストファイルだけでなく、すべてのインポートされたファイルに対してそれを使用します。

```bash
# 特定のtsconfigを渡す
npx playwright test --tsconfig=tsconfig.test.json
```

設定ファイルで単一のtsconfigファイルを指定することもできます。これはテストファイル、レポーターなどの読み込みに使用されますが、playwright設定自体やそこからインポートされたファイルの読み込みには使用されません。

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  tsconfig: './tsconfig.test.json',
});
```

## TypeScriptで手動でテストをコンパイル

場合によっては、Playwright Testが正しくTypeScriptコードを変換できないことがあります。例えば、通常`tsconfig.json`で設定されている実験的または非常に新しいTypeScriptの機能を使用している場合です。

この場合、テストをPlaywrightに送信する前に独自のTypeScriptコンパイルを実行できます。

まずテストディレクトリ内に`tsconfig.json`ファイルを追加します：

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "commonjs",
    "moduleResolution": "Node",
    "sourceMap": true,
    "outDir": "../tests-out",
  }
}
```

`package.json`に2つのスクリプトを追加します：

```json
{
  "scripts": {
    "pretest": "tsc --incremental -p tests/tsconfig.json",
    "test": "playwright test -c tests-out"
  }
}
```

`pretest`スクリプトはテストに対してtypescriptを実行します。`test`は`tests-out`ディレクトリに生成されたテストを実行します。`-c`引数はテストランナーに`tests-out`ディレクトリ内のテストを探すように設定します。

その後、`npm run test`でテストをビルドして実行します。