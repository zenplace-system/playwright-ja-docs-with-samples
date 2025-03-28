# テストのパラメータ化 | Playwright

## 概要

テストのパラメータ化は、同じテストを異なる入力データで実行するための手法です。Playwrightでは、テストレベルまたはプロジェクトレベルでパラメータ化を実現できます。

## テストレベルのパラメータ化

```javascript
[
  { name: 'Alice', expected: 'Hello, Alice!' },
  { name: 'Bob', expected: 'Hello, Bob!' },
  { name: 'Charlie', expected: 'Hello, Charlie!' },
].forEach(({ name, expected }) => {
  test(`${name}でテスト`, async ({ page }) => {
    await page.goto(`https://example.com/greet?name=${name}`);
    await expect(page.getByRole('heading')).toHaveText(expected);
  });
});
```

### フックの使用

通常、`beforeEach`や`afterEach`などのフックは、`forEach`の外側に配置すると一度だけ実行されます：

```javascript
test.beforeEach(async ({ page }) => {
  // 前処理
});

[
  { name: 'Alice', expected: 'Hello, Alice!' },
  // 他のデータ...
].forEach(({ name, expected }) => {
  test(`${name}でテスト`, async ({ page }) => {
    // テスト本体
  });
});
```

各テスト用に独自のフックを実行したい場合は、`describe()`内に配置します：

```javascript
[
  { name: 'Alice', expected: 'Hello, Alice!' },
  // 他のデータ...
].forEach(({ name, expected }) => {
  test.describe(() => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`https://example.com/greet?name=${name}`);
    });
    
    test(`${expected}でテスト`, async ({ page }) => {
      await expect(page.getByRole('heading')).toHaveText(expected);
    });
  });
});
```

## プロジェクトレベルのパラメータ化

複数のプロジェクトで同時にテストを実行する際にもパラメータを利用できます。

まず、オプションを定義します：

```javascript
// my-test.js
const base = require('@playwright/test');
exports.test = base.test.extend({
  person: ['John', { option: true }],
});
```

このオプションはフィクスチャのように使用できます：

```javascript
// example.spec.js
import { test } from './my-test';
test('テスト1', async ({ page, person }) => {
  await page.goto(`/index.html`);
  await expect(page.locator('#node')).toContainText(person);
});
```

設定ファイルで複数のプロジェクトを定義できます：

```javascript
// playwright.config.js
module.exports = {
  projects: [
    {
      name: 'alice',
      use: { person: 'Alice' },
    },
    {
      name: 'bob',
      use: { person: 'Bob' },
    },
  ]
};
```

## 環境変数の利用

環境変数を使用してテストを設定することもできます：

```javascript
test(`ログインテスト`, async ({ page }) => {
  await page.getByLabel('ユーザー名').fill(process.env.USER_NAME);
  await page.getByLabel('パスワード').fill(process.env.PASSWORD);
});
```

実行時に環境変数を渡す方法：

```bash
USER_NAME=me PASSWORD=secret npx playwright test
```

### .envファイル

`dotenv`パッケージを使用して.envファイルから環境変数を読み込むことができます：

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  use: {
    baseURL: process.env.STAGING === '1' ? 'http://staging.example.test/' : 'http://example.test/',
  }
});
```

## CSVファイルからのテスト生成

CSVファイルを使用してテストデータを管理することもできます：

```javascript
import fs from 'fs';
import path from 'path';
import { test } from '@playwright/test';
import { parse } from 'csv-parse/sync';

const records = parse(fs.readFileSync(path.join(__dirname, 'input.csv')), {
  columns: true,
  skip_empty_lines: true
});

for (const record of records) {
  test(`ケース: ${record.test_case}`, async ({ page }) => {
    // レコードのデータを使用したテスト
    console.log(record.test_case, record.some_value, record.some_other_value);
  });
}