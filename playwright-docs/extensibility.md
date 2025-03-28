# 拡張性

## カスタムセレクターエンジン

Playwrightは[selectors.register()](/docs/api/class-selectors#selectors-register)で登録されたカスタムセレクターエンジンをサポートしています。

セレクターエンジンは以下のプロパティを持つ必要があります：

* `root`に対して`selector`に一致する最初の要素を検索する`query`関数
* `root`に対して`selector`に一致するすべての要素を検索する`queryAll`関数

デフォルトでは、エンジンはフレームのJavaScriptコンテキスト内で直接実行され、例えばアプリケーション定義の関数を呼び出すことができます。エンジンをフレーム内のJavaScriptから分離しつつDOMへのアクセスを残すには、`{contentScript: true}`オプションでエンジンを登録します。コンテンツスクリプトエンジンは、`Node.prototype`メソッドの変更など、グローバルオブジェクトへの改ざんから保護されるため、より安全です。すべての組み込みセレクターエンジンはコンテンツスクリプトとして実行されます。エンジンが他のカスタムエンジンと一緒に使用される場合、コンテンツスクリプトとして実行されることは保証されないことに注意してください。

セレクターはページを作成する前に登録する必要があります。

タグ名に基づいて要素を検索するセレクターエンジンを登録する例：

```javascript
// baseTest.js
import { test as base } from '@playwright/test';
export { expect } from '@playwright/test';

// セレクターエンジンインスタンスを評価する関数である必要があります
const createTagNameEngine = () => ({
  // rootのサブツリー内で指定されたセレクターに一致する最初の要素を返します
  query(root, selector) {
    return root.querySelector(selector);
  },
  // rootのサブツリー内で指定されたセレクターに一致するすべての要素を返します
  queryAll(root, selector) {
    return Array.from(root.querySelectorAll(selector));
  }
});

export const test = base.extend<{}, { selectorRegistration: void }>({
  // ワーカーごとに一度セレクターを登録します
  selectorRegistration: [async ({ playwright }, use) => {
    // エンジンを登録します。セレクターには "tag=" というプレフィックスが付きます
    await playwright.selectors.register('tag', createTagNameEngine);
    await use();
  }, { scope: 'worker', auto: true }],
});
```

```javascript
// example.spec.js
import { test, expect } from './baseTest';

test('セレクターエンジンのテスト', async ({ page }) => {
  // これで 'tag=' セレクターを使用できます
  const button = page.locator('tag=button');
  await button.click();
  
  // 組み込みロケーターと組み合わせることができます
  await page.locator('tag=div').getByText('Click me').click();
  
  // セレクターをサポートするあらゆるメソッドで使用できます
  await expect(page.locator('tag=button')).toHaveCount(3);
});