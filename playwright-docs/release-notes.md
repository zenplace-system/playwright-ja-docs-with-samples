# リリースノート

## バージョン 1.51

### IndexedDBのStorageState

* [browserContext.storageState()](/docs/api/class-browsercontext#browser-context-storage-state)の新しいオプション[indexedDB](/docs/api/class-browsercontext#browser-context-storage-state-option-indexed-db)により、IndexedDBの内容を保存・復元できるようになりました。Firebase認証などでIndexedDB APIを使用する場合に便利です。

```javascript
// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto('/');
  // ... 認証ステップを実行 ...
  // indexedDBを保存することを確認
  await page.context().storageState({ path: authFile, indexedDB: true });
});
```

### プロンプトのコピー

HTMLレポート、トレースビューワー、UIモードのエラーに「Copy prompt」ボタンが追加されました。クリックすると、エラーメッセージと修正に役立つコンテキストが含まれた事前入力されたLLMプロンプトがコピーされます。

### 可視要素のフィルタリング

[locator.filter()](/docs/api/class-locator#locator-filter)の新しいオプション[visible](/docs/api/class-locator#locator-filter-option-visible)により、可視要素のみをマッチングできるようになりました。

```javascript
test('テスト例', async ({ page }) => {
  // 非表示のTODO項目を無視
  const todoItems = page.getByTestId('todo-item').filter({ visible: true });
  // 表示されているのが3つだけであることを確認
  await expect(todoItems).toHaveCount(3);
});
```

### HTMLレポートのGit情報

[testConfig.captureGitInfo](/docs/api/class-testconfig#test-config-capture-git-info)オプションを設定して、Git情報を[testConfig.metadata](/docs/api/class-testconfig#test-config-metadata)にキャプチャできます。

```javascript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  captureGitInfo: { commit: true, diff: true }
});
```

### テストステップの改善

テストステップで新しい[TestStepInfo](/docs/api/class-teststepinfo "TestStepInfo")オブジェクトが利用可能になりました。ステップに添付ファイルを追加したり、特定の条件でステップをスキップしたりできます。

```javascript
test('テスト例', async ({ page, isMobile }) => {
  // 新しい「step」引数に注目:
  await test.step('ステップ例', async step => {
    step.skip(isMobile, 'モバイルレイアウトでは関連なし');
    // ...
    await step.attach('添付ファイル', { body: 'テキスト' });
    // ...
  });
});
```

### その他

* [page.emulateMedia()](/docs/api/class-page#page-emulate-media)と[browser.newContext()](/docs/api/class-browser#browser-new-context)の新しいオプション`contrast`で`prefers-contrast`メディア機能をエミュレートできます
* [APIRequestContext](/docs/api/class-apirequestcontext "APIRequestContext")を通じて行われるすべてのフェッチリクエストが、2xxと3xx以外のレスポンスコードでスローするようにする新しいオプション[failOnStatusCode](/docs/api/class-apirequest#api-request-new-context-option-fail-on-status-code)
* [expect(page).toHaveURL()](/docs/api/class-pageassertions#page-assertions-to-have-url)がプレディケートをサポートするようになりました

### ブラウザバージョン

* Chromium 134.0.6998.35
* Mozilla Firefox 135.0
* WebKit 18.4

このバージョンは以下の安定チャンネルでもテストされています：

* Google Chrome 133
* Microsoft Edge 133

## バージョン 1.50

### テストランナー

* 個々のテストステップの最大実行時間を指定できる新しいオプション[timeout](/docs/api/class-test#test-step-option-timeout)
* テストステップの実行を無効にする新しいメソッド[test.step.skip()](/docs/api/class-test#test-step-skip)
* [expect(locator).toMatchAriaSnapshot()](/docs/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot-2)が拡張され、ARIAスナップショットを別のYAMLファイルに保存できるようになりました
* ロケーターが[aria errormessage](https://w3c.github.io/aria/#aria-errormessage)を持つ要素を指しているかをアサートする新しいメソッド[expect(locator).toHaveAccessibleErrorMessage()](/docs/api/class-locatorassertions#locator-assertions-to-have-accessible-error-message)
* [testConfig.updateSnapshots](/docs/api/class-testconfig#test-config-update-snapshots)に設定列挙型`changed`が追加されました。`changed`は変更されたスナップショットのみを更新し、`all`は差異があるかどうかに関わらずすべてのスナップショットを更新します
* [testConfig.updateSourceMethod](/docs/api/class-testconfig#test-config-update-source-method)は、[testConfig.updateSnapshots](/docs/api/class-testconfig#test-config-update-snapshots)が設定されている場合のソースコードの更新方法を定義します

### 破壊的変更

* [expect(locator).toBeEditable()](/docs/api/class-locatorassertions#locator-assertions-to-be-editable)と[locator.isEditable()](/docs/api/class-locator#locator-is-editable)が、ターゲット要素が`<input>`、`<select>`、またはその他の編集可能な要素でない場合にスローするようになりました
* [testConfig.updateSnapshots](/docs/api/class-testconfig#test-config-update-snapshots)が`all`に設定されている場合、失敗/変更されたスナップショットだけでなく、すべてのスナップショットが更新されるようになりました。変更されたスナップショットのみを更新する以前の機能を維持するには、新しい列挙型`changed`を使用してください

### ブラウザバージョン

* Chromium 133.0.6943.16
* Mozilla Firefox 134.0
* WebKit 18.2

このバージョンは以下の安定チャンネルでもテストされています：

* Google Chrome 132
* Microsoft Edge 132