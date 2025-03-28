# Playwrightにおける認証

## 概要

Playwrightは[ブラウザコンテキスト](/docs/browser-contexts)と呼ばれる分離環境でテストを実行します。この分離モデルにより再現性が向上し、テスト間の干渉を防ぎます。テストは既存の認証済み状態を読み込むことができ、これによりテスト実行が高速化されます。

## 基本概念

認証戦略に関わらず、認証済みブラウザ状態をファイルシステムに保存することになります。

`playwright/.auth`ディレクトリを作成し、`.gitignore`に追加することをお勧めします。認証状態をこのディレクトリに保存し、テストで再利用します。

```bash
mkdir -p playwright/.auth
echo $'\nplaywright/.auth' >> .gitignore
```

## 基本：すべてのテストで共有アカウント

このアプローチは**サーバーサイドの状態がない**テストに最適です。セットアッププロジェクトで一度認証し、その状態を各テストで再利用します。

**使用するタイミング**
- すべてのテストが同じアカウントで同時に実行でき、互いに影響しない場合

**避けるべきタイミング**
- テストがサーバーサイドの状態を変更する場合
- 認証がブラウザ固有の場合

**実装方法**

すべてのテストのための認証状態を準備する`tests/auth.setup.js`を作成します：

```javascript
// tests/auth.setup.js
import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // 認証ステップ（サイトに合わせて変更してください）
  await page.goto('https://github.com/login');
  await page.getByLabel('Username or email address').fill('username');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // 認証完了を確認
  await page.waitForURL('https://github.com/');
  // または要素の表示を確認
  await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();
  
  // 認証状態を保存
  await page.context().storageState({ path: authFile });
});
```

設定ファイルに`setup`プロジェクトを追加し、各テストプロジェクトの依存関係として設定します：

```javascript
// playwright.config.js
module.exports = {
  projects: [
    // セットアッププロジェクト
    { name: 'setup', testMatch: /.*\.setup\.js/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // 保存した認証状態を使用
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
};
```

これにより、テストは既に認証された状態で開始します：

```javascript
// tests/example.spec.js
import { test } from '@playwright/test';

test('テスト', async ({ page }) => {
  // pageは既に認証済み
});
```

保存した状態が期限切れになった場合は削除する必要があります。テスト実行間で状態を保持する必要がない場合は、`testProject.outputDir`の下に状態を保存すると自動的にクリーンアップされます。

### UIモードでの認証

UIモードではデフォルトで`setup`プロジェクトは実行されません。認証が必要になったら手動で`auth.setup.js`を実行してください。

フィルターで`setup`プロジェクトを有効にし、`auth.setup.js`ファイルを実行してから、再びフィルターで無効にします。

## 中級：並列ワーカーごとに1つのアカウント

このアプローチは**サーバーサイドの状態を変更する**テストに適しています。各並列ワーカーは専用のアカウントを使用し、そのワーカー内のすべてのテストで同じ認証状態を共有します。

**使用するタイミング**
- テストが共有サーバーサイド状態を変更する場合

**避けるべきタイミング**
- テストがサーバーサイド状態を変更しない場合

**実装方法**

ワーカーごとに一度だけ認証するために、フィクスチャをオーバーライドする`playwright/fixtures.js`を作成します：

```javascript
// playwright/fixtures.js
import { test as baseTest, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export * from '@playwright/test';

export const test = baseTest.extend({
  // ワーカー共有の認証状態を使用
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // ワーカーごとに一度だけ認証
  workerStorageState: [async ({ browser }, use) => {
    // ワーカー識別子
    const id = test.info().parallelIndex;
    const fileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);

    if (fs.existsSync(fileName)) {
      // 既存の認証状態を再利用
      await use(fileName);
      return;
    }

    // クリーンな状態で認証
    const page = await browser.newPage({ storageState: undefined });

    // ワーカー固有のアカウント取得
    const account = await acquireAccount(id);

    // 認証処理
    await page.goto('https://github.com/login');
    await page.getByLabel('Username or email address').fill(account.username);
    await page.getByLabel('Password').fill(account.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('https://github.com/');
    await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();

    // 認証状態を保存
    await page.context().storageState({ path: fileName });
    await page.close();
    await use(fileName);
  }, { scope: 'worker' }],
});
```

各テストファイルは、カスタムフィクスチャを使用する必要があります：

```javascript
// tests/example.spec.js
// フィクスチャをインポート
import { test, expect } from '../playwright/fixtures';

test('テスト', async ({ page }) => {
  // pageは認証済み
});
```

## 高度なシナリオ

### APIリクエストでの認証

**使用するタイミング**
- WebアプリがUI操作よりも簡単なAPI認証をサポートしている場合

**実装方法**

`APIRequestContext`を使用して認証し、状態を保存します：

```javascript
// tests/auth.setup.js
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ request }) => {
  // 認証リクエスト（サイトに合わせて変更）
  await request.post('https://github.com/login', {
    form: {
      'user': 'user',
      'password': 'password'
    }
  });
  await request.storageState({ path: authFile });
});
```

### 複数のサインインロール

**使用するタイミング**
- テストに複数のロール（管理者、一般ユーザーなど）が必要な場合

**実装方法**

セットアッププロジェクトで複数のロールに対して認証します：

```javascript
// tests/auth.setup.js
import { test as setup, expect } from '@playwright/test';

const adminFile = 'playwright/.auth/admin.json';
setup('管理者として認証', async ({ page }) => {
  // 管理者認証処理
  await page.goto('https://github.com/login');
  await page.getByLabel('Username or email address').fill('admin');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('https://github.com/');
  await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();
  await page.context().storageState({ path: adminFile });
});

const userFile = 'playwright/.auth/user.json';
setup('一般ユーザーとして認証', async ({ page }) => {
  // 一般ユーザー認証処理
  await page.goto('https://github.com/login');
  await page.getByLabel('Username or email address').fill('user');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('https://github.com/');
  await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();
  await page.context().storageState({ path: userFile });
});
```

テストでは必要なロールを指定します：

```javascript
// tests/example.spec.js
import { test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });
test('管理者テスト', async ({ page }) => {
  // 管理者として認証済み
});

test.describe(() => {
  test.use({ storageState: 'playwright/.auth/user.json' });
  test('一般ユーザーテスト', async ({ page }) => {
    // 一般ユーザーとして認証済み
  });
});
```

### 複数のロールを同時テスト

**使用するタイミング**
- 1つのテスト内で複数の認証ロールの相互作用をテストする場合

**実装方法**

同じテスト内で異なる認証状態を持つ複数のコンテキストを使用します：

```javascript
// tests/example.spec.js
import { test } from '@playwright/test';

test('管理者とユーザーの相互作用', async ({ browser }) => {
  // 管理者として認証されたコンテキスト
  const adminContext = await browser.newContext({ storageState: 'playwright/.auth/admin.json' });
  const adminPage = await adminContext.newPage();
  
  // 一般ユーザーとして認証されたコンテキスト
  const userContext = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
  const userPage = await userContext.newPage();
  
  // 両方のページと対話する処理
  
  await adminContext.close();
  await userContext.close();
});
```

### セッションストレージ

認証情報の保存にはクッキーやローカルストレージが使われますが、セッションストレージを使う場合は以下のようにします：

```javascript
// セッションストレージを保存
const sessionStorage = await page.evaluate(() => JSON.stringify(sessionStorage));
fs.writeFileSync('playwright/.auth/session.json', sessionStorage, 'utf-8');

// 新しいコンテキストでセッションストレージを設定
const sessionStorage = JSON.parse(fs.readFileSync('playwright/.auth/session.json', 'utf-8'));
await context.addInitScript(storage => {
  if (window.location.hostname === 'example.com') {
    for (const [key, value] of Object.entries(storage))
      window.sessionStorage.setItem(key, value);
  }
}, sessionStorage);
```

### 一部のテストで認証を避ける

プロジェクト全体で認証設定がある場合でも、特定のテストで認証をスキップできます：

```javascript
// not-signed-in.spec.js
import { test } from '@playwright/test';

// 認証をクリアしてテスト実行
test.use({ storageState: { cookies: [], origins: [] } });

test('未認証状態テスト', async ({ page }) => {
  // 未認証状態でのテスト
});