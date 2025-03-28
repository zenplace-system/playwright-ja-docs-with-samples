# ビジュアル比較

## 概要

Playwright Testには、`await expect(page).toHaveScreenshot()`を使用してスクリーンショットを生成し、視覚的に比較する機能が含まれています。最初の実行時、Playwright Testは参照スクリーンショットを生成します。その後の実行では、参照と比較します。

```javascript
// example.spec.js
import { test, expect } from '@playwright/test';

test('例のテスト', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveScreenshot();
});
```

> **注意**: ブラウザのレンダリングは、ホストOS、バージョン、設定、ハードウェア、電源（バッテリーvs電源アダプター）、ヘッドレスモードなどの要因によって異なる場合があります。一貫したスクリーンショットを得るには、ベースラインスクリーンショットが生成されたのと同じ環境でテストを実行してください。

## スクリーンショットの生成

初めて上記を実行すると、テストランナーは次のように表示します：

```
Error: A snapshot doesn't exist at example.spec.ts-snapshots/example-test-1-chromium-darwin.png, writing actual.
```

これは、まだゴールデンファイルが存在しなかったためです。このメソッドは、2つの連続するスクリーンショットが一致するまで複数のスクリーンショットを撮影し、最後のスクリーンショットをファイルシステムに保存しました。これでリポジトリに追加する準備ができました。

ゴールデン期待値を含むフォルダの名前はテストファイルの名前から始まります：

```
drwxr-xr-x  5 user  group  160 Jun  4 11:46 .
drwxr-xr-x  6 user  group  192 Jun  4 11:45 ..
-rw-r--r--  1 user  group  231 Jun  4 11:16 example.spec.ts
drwxr-xr-x  3 user  group   96 Jun  4 11:46 example.spec.ts-snapshots
```

スナップショット名`example-test-1-chromium-darwin.png`はいくつかの部分から構成されています：

* `example-test-1.png` - スナップショットの自動生成された名前。または、`toHaveScreenshot()`メソッドの最初の引数としてスナップショット名を指定することもできます：

  ```javascript
  await expect(page).toHaveScreenshot('landing.png');
  ```

* `chromium-darwin` - ブラウザ名とプラットフォーム。スクリーンショットはレンダリング、フォントなどが異なるため、ブラウザとプラットフォーム間で異なります。[設定ファイル](/docs/test-configuration)で複数のプロジェクトを使用する場合、`chromium`の代わりにプロジェクト名が使用されます。

スナップショット名とパスは、playwright設定の[testConfig.snapshotPathTemplate](/docs/api/class-testconfig#test-config-snapshot-path-template)で設定できます。

## スクリーンショットの更新

ページが変更された場合など、参照スクリーンショットを更新する必要がある場合があります。これは`--update-snapshots`フラグで行います。

```bash
npx playwright test --update-snapshots
```

> 注意：`snapshotName`は`expect().toHaveScreenshot(['relative', 'path', 'to', 'snapshot.png'])`のようにスナップショットファイルへのパスセグメントの配列も受け付けます。ただし、このパスは各テストファイルのスナップショットディレクトリ（例：`a.spec.js-snapshots`）内に留まる必要があります。そうでない場合はエラーがスローされます。

## オプション

### maxDiffPixels

Playwright Testは[pixelmatch](https://github.com/mapbox/pixelmatch)ライブラリを使用しています。その動作を変更するために[様々なオプション](/docs/api/class-pageassertions#page-assertions-to-have-screenshot-1)を渡すことができます：

```javascript
// example.spec.js
import { test, expect } from '@playwright/test';

test('例のテスト', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });
});
```

プロジェクト内のすべてのテストでデフォルト値を共有したい場合は、playwright設定でグローバルまたはプロジェクトごとに指定できます：

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    toHaveScreenshot: { maxDiffPixels: 100 },
  },
});
```

### stylePath

スクリーンショットを撮影する際に、ページにカスタムスタイルシートを適用できます。これにより、動的または揮発性の要素をフィルタリングし、スクリーンショットの決定性を向上させることができます。

```css
/* screenshot.css */
iframe {
  visibility: hidden;
}
```

```javascript
// example.spec.js
import { test, expect } from '@playwright/test';
import path from 'path';

test('例のテスト', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveScreenshot({ 
    stylePath: path.join(__dirname, 'screenshot.css') 
  });
});
```

プロジェクト内のすべてのテストでデフォルト値を共有したい場合は、playwright設定でグローバルまたはプロジェクトごとに指定できます：

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    toHaveScreenshot: {
      stylePath: './screenshot.css'
    },
  },
});
```

## 画像以外のスナップショット

スクリーンショットの他に、`expect(value).toMatchSnapshot(snapshotName)`を使用してテキストや任意のバイナリデータを比較できます。Playwright Testはコンテンツタイプを自動検出し、適切な比較アルゴリズムを使用します。

以下では、テキストコンテンツを参照と比較しています。

```javascript
// example.spec.js
import { test, expect } from '@playwright/test';

test('例のテスト', async ({ page }) => {
  await page.goto('https://playwright.dev');
  expect(await page.textContent('.hero__title')).toMatchSnapshot('hero.txt');
});
```

スナップショットはテストファイルの隣の別のディレクトリに保存されます。例えば、`my.spec.js`ファイルは`my.spec.js-snapshots`ディレクトリにスナップショットを生成して保存します。このディレクトリをバージョン管理（例：`git`）にコミットし、変更を確認する必要があります。