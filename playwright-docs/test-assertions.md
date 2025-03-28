# Playwrightアサーション

## 概要

Playwrightには`expect`関数の形でテストアサーションが含まれています。アサーションを行うには、`expect(値)`を呼び出し、期待に合ったマッチャーを選択します。`toEqual`、`toContain`、`toBeTruthy`などの[一般的なマッチャー](/docs/api/class-genericassertions)を使用して、任意の条件を検証できます。

```javascript
expect(success).toBeTruthy();
```

Playwrightには、期待される条件が満たされるまで待機するWeb固有の[非同期マッチャー](/docs/api/class-locatorassertions)も含まれています：

```javascript
await expect(page.getByTestId('status')).toHaveText('送信済み');
```

Playwrightは、`status`というテストIDを持つ要素が`"送信済み"`というテキストを持つまで、要素を再テストします。タイムアウトに達するまで、要素を何度も取得してチェックします。このタイムアウトは、[testConfig.expect](/docs/api/class-testconfig#test-config-expect)値でテスト設定に指定できます。

デフォルトでは、アサーションのタイムアウトは5秒に設定されています。[各種タイムアウト](/docs/test-timeouts)の詳細をご覧ください。

## 自動リトライアサーション

以下のアサーションは、アサーションが成功するか、アサーションタイムアウトに達するまで自動的にリトライされます。リトライアサーションは非同期なので、`await`を付ける必要があります。

| アサーション | 説明 |
|------------|------|
| `await expect(locator).toBeAttached()` | 要素がDOMにアタッチされている |
| `await expect(locator).toBeChecked()` | チェックボックスがチェックされている |
| `await expect(locator).toBeDisabled()` | 要素が無効化されている |
| `await expect(locator).toBeEditable()` | 要素が編集可能 |
| `await expect(locator).toBeEmpty()` | コンテナが空 |
| `await expect(locator).toBeEnabled()` | 要素が有効化されている |
| `await expect(locator).toBeFocused()` | 要素にフォーカスがある |
| `await expect(locator).toBeHidden()` | 要素が非表示 |
| `await expect(locator).toBeInViewport()` | 要素がビューポートと交差している |
| `await expect(locator).toBeVisible()` | 要素が表示されている |
| `await expect(locator).toContainText()` | 要素にテキストが含まれている |
| `await expect(locator).toHaveAttribute()` | 要素にDOM属性がある |
| `await expect(locator).toHaveClass()` | 要素にクラスプロパティがある |
| `await expect(locator).toHaveCount()` | リストに正確な数の子要素がある |
| `await expect(locator).toHaveCSS()` | 要素にCSSプロパティがある |
| `await expect(locator).toHaveId()` | 要素にIDがある |
| `await expect(locator).toHaveJSProperty()` | 要素にJavaScriptプロパティがある |
| `await expect(locator).toHaveRole()` | 要素に特定の[ARIAロール](https://www.w3.org/TR/wai-aria-1.2/#roles)がある |
| `await expect(locator).toHaveScreenshot()` | 要素のスクリーンショットが一致する |
| `await expect(locator).toHaveText()` | 要素のテキストが一致する |
| `await expect(locator).toHaveValue()` | 入力要素に値がある |
| `await expect(locator).toHaveValues()` | セレクトで選択されたオプションがある |
| `await expect(page).toHaveScreenshot()` | ページのスクリーンショットが一致する |
| `await expect(page).toHaveTitle()` | ページにタイトルがある |
| `await expect(page).toHaveURL()` | ページのURLが一致する |
| `await expect(response).toBeOK()` | レスポンスがOKステータス |

## リトライしないアサーション

これらのアサーションは任意の条件をテストできますが、自動リトライはしません。多くの場合、Webページは情報を非同期で表示するため、リトライしないアサーションを使用すると不安定なテストになる可能性があります。

可能な限り[自動リトライ](#自動リトライアサーション)アサーションを優先してください。より複雑なアサーションでリトライが必要な場合は、[`expect.poll`](#expectpoll)または[`expect.toPass`](#expecttopass)を使用してください。

主な非リトライアサーション：

| アサーション | 説明 |
|------------|------|
| `expect(value).toBe()` | 値が同じ |
| `expect(value).toEqual()` | 値が類似（深い等価性とパターンマッチング） |
| `expect(value).toBeTruthy()` | 値が真値 |
| `expect(value).toBeFalsy()` | 値が偽値 |
| `expect(value).toBeGreaterThan()` | 数値が大きい |
| `expect(value).toBeLessThan()` | 数値が小さい |
| `expect(value).toContain()` | 文字列にサブ文字列が含まれる、または配列に要素が含まれる |
| `expect(value).toMatch()` | 文字列が正規表現に一致する |

## 否定マッチャー

マッチャーの前に`.not`を追加することで、反対の条件を期待できます：

```javascript
expect(value).not.toEqual(0);
await expect(locator).not.toContainText('一部のテキスト');
```

## ソフトアサーション

デフォルトでは、失敗したアサーションはテスト実行を終了します。Playwrightは_ソフトアサーション_もサポートしています：失敗したソフトアサーションはテスト実行を**停止しません**が、テストを失敗としてマークします。

```javascript
// 失敗してもテストを停止しないチェックを行う
await expect.soft(page.getByTestId('status')).toHaveText('成功');
await expect.soft(page.getByTestId('eta')).toHaveText('1日');

// テストを続行して他の項目をチェック
await page.getByRole('link', { name: '次のページ' }).click();
await expect.soft(page.getByRole('heading', { name: '別の注文をする' })).toBeVisible();
```

テスト実行中のどの時点でも、ソフトアサーションの失敗があったかどうかを確認できます：

```javascript
// いくつかのソフトアサーションを実行
await expect.soft(page.getByTestId('status')).toHaveText('成功');
await expect.soft(page.getByTestId('eta')).toHaveText('1日');

// ソフトアサーションの失敗があった場合、それ以上実行しない
expect(test.info().errors).toHaveLength(0);
```

ソフトアサーションはPlaywrightテストランナーでのみ機能します。

## カスタムexpectメッセージ

`expect`関数の2番目の引数としてカスタムメッセージを指定できます：

```javascript
await expect(page.getByText('名前'), 'ログインしているはず').toBeVisible();
```

このメッセージはレポーターに表示され、合格・不合格に関わらずアサーションについての文脈を提供します。

## expect.configure

独自の事前設定された`expect`インスタンスを作成して、`timeout`や`soft`などの独自のデフォルト値を持たせることができます：

```javascript
// タイムアウトを10秒に設定
const slowExpect = expect.configure({ timeout: 10000 });
await slowExpect(locator).toHaveText('送信');

// 常にソフトアサーションを使用
const softExpect = expect.configure({ soft: true });
await softExpect(locator).toHaveText('送信');
```

## expect.poll

`expect.poll`を使用して、任意の同期的な`expect`を非同期的なポーリングに変換できます。

以下のメソッドは、指定された関数がHTTPステータス200を返すまでポーリングします：

```javascript
await expect.poll(async () => {
  const response = await page.request.get('https://api.example.com');
  return response.status();
}, {
  // レポート用のカスタムメッセージ（オプション）
  message: 'APIが最終的に成功することを確認',
  // 10秒間ポーリング（デフォルトは5秒）。0を指定するとタイムアウトなし
  timeout: 10000,
}).toBe(200);
```

カスタムポーリング間隔も指定できます：

```javascript
await expect.poll(async () => {
  const response = await page.request.get('https://api.example.com');
  return response.status();
}, {
  // プローブ、1秒待機、プローブ、2秒待機、プローブ、10秒待機...
  // デフォルトは[100, 250, 500, 1000]
  intervals: [1_000, 2_000, 10_000],
  timeout: 60_000
}).toBe(200);
```

## expect.toPass

コードブロックが正常に実行されるまでリトライできます：

```javascript
await expect(async () => {
  const response = await page.request.get('https://api.example.com');
  expect(response.status()).toBe(200);
}).toPass();
```

カスタムタイムアウトとリトライ間隔も指定できます：

```javascript
await expect(async () => {
  const response = await page.request.get('https://api.example.com');
  expect(response.status()).toBe(200);
}).toPass({
  // プローブ、1秒待機、プローブ、2秒待機、プローブ、10秒待機...
  // デフォルトは[100, 250, 500, 1000]
  intervals: [1_000, 2_000, 10_000],
  timeout: 60_000
});
```

デフォルトでは`toPass`のタイムアウトは0で、カスタムの[expectタイムアウト](/docs/test-timeouts#expect-timeout)を尊重しません。

## expect.extendを使用したカスタムマッチャーの追加

カスタムマッチャーを提供することで、Playwrightのアサーションを拡張できます。これらのマッチャーは`expect`オブジェクトで利用可能になります。

以下の例では、カスタムの`toHaveAmount`関数を追加しています：

```javascript
// fixtures.js
import { expect as baseExpect } from '@playwright/test';
import type { Locator } from '@playwright/test';
export { test } from '@playwright/test';

export const expect = baseExpect.extend({
  async toHaveAmount(locator, expected, options) {
    const assertionName = 'toHaveAmount';
    let pass;
    let matcherResult;
    
    try {
      await baseExpect(locator).toHaveAttribute('data-amount', String(expected), options);
      pass = true;
    } catch (e) {
      matcherResult = e.matcherResult;
      pass = false;
    }
    
    // メッセージ生成ロジック...
    
    return {
      message,
      pass,
      name: assertionName,
      expected,
      actual: matcherResult?.actual,
    };
  },
});
```

これで、テストで`toHaveAmount`を使用できます：

```javascript
// example.spec.js
import { test, expect } from './fixtures';

test('金額', async () => {
  await expect(page.locator('.cart')).toHaveAmount(4);
});