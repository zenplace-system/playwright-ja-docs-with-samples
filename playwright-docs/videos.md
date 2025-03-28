# ビデオ

## 概要

Playwrightを使用してテストのビデオを記録できます。

## ビデオの記録

Playwright Testでは、Playwright設定の`video`オプションを使用してテストのビデオを記録できます。デフォルトではビデオはオフになっています。

* `'off'` - ビデオを記録しない
* `'on'` - 各テストのビデオを記録する
* `'retain-on-failure'` - 各テストのビデオを記録するが、成功したテスト実行からはすべてのビデオを削除する
* `'on-first-retry'` - 最初のテスト再試行時のみビデオを記録する

ビデオファイルはテスト出力ディレクトリ（通常は`test-results`）に保存されます。高度なビデオ設定については[testOptions.video](/docs/api/class-testoptions#test-options-video)を参照してください。

ビデオはテスト終了時に[ブラウザコンテキスト](/docs/browser-contexts)が閉じられると保存されます。ブラウザコンテキストを手動で作成する場合は、必ず[browserContext.close()](/docs/api/class-browsercontext#browser-context-close)を待機してください。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    video: 'on-first-retry',
  },
});
```

ライブラリを直接使用する場合：

```javascript
const context = await browser.newContext({ 
  recordVideo: { dir: 'videos/' } 
});

// ビデオが保存されるように、closeを待機することを確認してください
await context.close();
```

ビデオサイズも指定できます。ビデオサイズはデフォルトで800x800に収まるようにスケールダウンされたビューポートサイズになります。ビューポートのビデオは出力ビデオの左上隅に配置され、必要に応じてスケールダウンされます。希望するビデオサイズに合わせてビューポートサイズを設定する必要がある場合があります。

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    video: {
      mode: 'on-first-retry',
      size: { width: 640, height: 480 }
    }
  },
});
```

ライブラリを直接使用する場合：

```javascript
const context = await browser.newContext({
  recordVideo: {
    dir: 'videos/',
    size: { width: 640, height: 480 },
  }
});
```

複数ページのシナリオでは、[page.video()](/docs/api/class-page#page-video)を使用してページに関連付けられたビデオファイルにアクセスできます。

```javascript
const path = await page.video().path();
```

> 注意：ビデオはページまたはブラウザコンテキストが閉じられた後にのみ利用可能になります。