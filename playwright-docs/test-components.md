# コンポーネントテスト（実験的機能） | Playwright

## 概要

Playwrightを使用してReact、Vue、Svelteなどのコンポーネントをテストできるようになりました。

## 基本例

典型的なコンポーネントテストの例：

```javascript
test('イベントが動作するか', async ({ mount }) => {
  let clicked = false;
  // コンポーネントをマウント。コンポーネントを指すロケーターを返します
  const component = await mount(
    <Button title="送信" onClick={() => { clicked = true }}></Button>
  );
  // 通常のPlaywrightテストと同様にテキストを検証
  await expect(component).toContainText('送信');
  // クリックを実行。これによりイベントが発火します
  await component.click();
  // イベントが発火したことを確認
  expect(clicked).toBeTruthy();
});
```

## 始め方

既存のプロジェクトにコンポーネントテストを追加するのは簡単です。

### ステップ1: Playwrightのコンポーネントテストをインストール

```bash
npm init playwright@latest -- --ct
```

このコマンドによって、以下のファイルが作成されます：

**playwright/index.html**
```html
<html lang="en">
  <body>
    <div id="root"></div>
    <script type="module" src="./index.ts"></script>
  </body>
</html>
```

これはコンポーネントをレンダリングするためのHTMLファイルです。`id="root"`の要素が必要で、そこにコンポーネントがマウントされます。

**playwright/index.ts**
```typescript
// ここにテーマを適用したり、コンポーネントが実行時に必要なものを追加
```

### ステップ2: テストファイルを作成

**React用の例（app.spec.tsx）**
```javascript
import { test, expect } from '@playwright/experimental-ct-react';
import App from './App';

test('動作確認', async ({ mount }) => {
  const component = await mount(<App />);
  await expect(component).toContainText('Learn React');
});
```

**Vue用の例（app.spec.ts）**
```javascript
import { test, expect } from '@playwright/experimental-ct-vue';
import App from './App.vue';

test('動作確認', async ({ mount }) => {
  const component = await mount(App);
  await expect(component).toContainText('Learn Vue');
});
```

### ステップ3: テスト実行

VS Code拡張機能またはコマンドラインから実行できます：

```bash
npm run test-ct
```

## ストーリーベースのテスト

コンポーネントはブラウザで実行され、テストはNode.jsで実行されるため、いくつかの制限があります：

- 複雑なオブジェクトをコンポーネントに渡せない（プリミティブ型のみ渡せる）
- コールバックで同期的にデータを渡せない

これらの制限を回避するため、テスト用の「ストーリー」ファイルを作成することをお勧めします。

**例：テスト用ラッパーの作成**

```javascript
// input-media.story.tsx
import React from 'react';
import InputMedia from './import-media';

export function InputMediaForTest(props) {
  // 複雑なメディアオブジェクトの代わりに名前を渡す
  return <InputMedia onChange={media => props.onMediaChange(media.name)} />;
}
```

**テスト例**

```javascript
// input-media.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { InputMediaForTest } from './input-media.story.tsx';

test('画像を変更する', async ({ mount }) => {
  let mediaSelected = null;
  const component = await mount(
    <InputMediaForTest
      onMediaChange={mediaName => {
        mediaSelected = mediaName;
      }}
    />
  );
  await component
    .getByTestId('imageInput')
    .setInputFiles('src/assets/logo.png');
  await expect(component.getByAltText(/selected image/i)).toBeVisible();
  await expect.poll(() => mediaSelected).toBe('logo.png');
});
```

## 主な機能

### プロパティの設定

```javascript
// Reactの場合
const component = await mount(<Component msg="こんにちは" />);

// Vueの場合
const component = await mount(Component, { props: { msg: 'こんにちは' } });
// または
const component = await mount(<Component msg="こんにちは" />);
```

### コールバック/イベント

```javascript
// Reactの場合
let clickCount = 0;
const component = await mount(
  <Component onClick={() => clickCount++} />
);
await component.click();
expect(clickCount).toBe(1);
```

### コンポーネントのアンマウント

```javascript
const component = await mount(<Component />);
// テスト実行...
await component.unmount();
// アンマウント後の状態をテスト
```

### テスト設定のカスタマイズ

```javascript
import { test, expect } from '@playwright/experimental-ct-react';
import HelloWorld from './HelloWorld';

test.use({ viewport: { width: 500, height: 500 } });

test('動作確認', async ({ mount }) => {
  const component = await mount(<HelloWorld msg="こんにちは" />);
  await expect(component).toContainText('こんにちは');
});