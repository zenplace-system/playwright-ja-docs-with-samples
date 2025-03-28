# APIテスト

## 概要

PlaywrightはWebアプリケーションのREST APIテストに使用できます。ブラウザを介さずに直接サーバーにリクエストを送信したい場合に便利です。

主な用途：
- サーバーAPIのテスト
- Webアプリケーションテスト前のサーバー状態準備
- ブラウザでのアクション後のサーバー側の状態確認

## APIテストの作成

### 設定

APIリクエストの設定は`playwright.config.js`で行います：

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // ベースURL設定
    baseURL: 'https://api.example.com',
    // 共通ヘッダー設定
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.API_TOKEN}`,
    },
  }
});
```

プロキシが必要な場合：

```javascript
// playwright.config.js
export default defineConfig({
  use: {
    proxy: {
      server: 'http://my-proxy:8080',
      username: 'user',
      password: 'secret'
    },
  }
});
```

### テスト例

```javascript
const test = require('@playwright/test');
const { expect } = test;

test('新規ユーザー作成', async ({ request }) => {
  // POSTリクエスト
  const response = await request.post('/api/users', {
    data: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  });
  
  // レスポンス検証
  expect(response.ok()).toBeTruthy();
  const userData = await response.json();
  expect(userData).toHaveProperty('id');
  expect(userData.name).toBe('John Doe');
  
  // 作成したユーザーの取得確認
  const getResponse = await request.get(`/api/users/${userData.id}`);
  expect(getResponse.ok()).toBeTruthy();
  expect(await getResponse.json()).toEqual(userData);
});
```

### セットアップとティアダウン

```javascript
test.beforeAll(async ({ request }) => {
  // テスト前の準備（データ作成など）
  const response = await request.post('/api/setup', {
    data: { testId: 'test-123' }
  });
  expect(response.ok()).toBeTruthy();
});

test.afterAll(async ({ request }) => {
  // テスト後のクリーンアップ
  const response = await request.delete('/api/cleanup');
  expect(response.ok()).toBeTruthy();
});
```

## UIテストとAPIテストの組み合わせ

### 前提条件の設定

```javascript
import { test, expect } from '@playwright/test';

// APIコンテキストの作成
let apiContext;

test.beforeAll(async ({ playwright }) => {
  apiContext = await playwright.request.newContext({
    baseURL: 'https://api.example.com',
    extraHTTPHeaders: {
      'Authorization': `Bearer ${process.env.API_TOKEN}`,
    },
  });
});

test.afterAll(async () => {
  await apiContext.dispose();
});

test('APIで作成したデータをUIで確認', async ({ page }) => {
  // APIでデータ作成
  const newItem = await apiContext.post('/api/items', {
    data: { name: 'テストアイテム' }
  });
  expect(newItem.ok()).toBeTruthy();
  const itemData = await newItem.json();
  
  // UIでデータ確認
  await page.goto('https://example.com/items');
  await expect(page.getByText(itemData.name)).toBeVisible();
});
```

### 事後条件の検証

```javascript
test('UIで作成したデータをAPIで確認', async ({ page }) => {
  // UIでデータ作成
  await page.goto('https://example.com/items/new');
  await page.getByLabel('名前').fill('新しいアイテム');
  await page.getByRole('button', { name: '作成' }).click();
  
  // URLからIDを取得
  const itemId = page.url().split('/').pop();
  
  // APIでデータ確認
  const response = await apiContext.get(`/api/items/${itemId}`);
  expect(response.ok()).toBeTruthy();
  const itemData = await response.json();
  expect(itemData.name).toBe('新しいアイテム');
});
```

## 認証状態の再利用

APIで認証した状態をブラウザで再利用できます：

```javascript
// APIで認証
const requestContext = await request.newContext();
await requestContext.post('https://example.com/api/login', {
  data: { username: 'user', password: 'pass' }
});

// 認証状態を保存
await requestContext.storageState({ path: 'auth.json' });

// 保存した認証状態でブラウザを起動
const context = await browser.newContext({ 
  storageState: 'auth.json' 
});
const page = await context.newPage();
await page.goto('https://example.com/dashboard');
// すでにログイン済みの状態