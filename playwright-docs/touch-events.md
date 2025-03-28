# タッチイベント

## 概要

スワイプ、ピンチ、タップなどのジェスチャーに反応する[タッチイベント](https://developer.mozilla.org/ja/docs/Web/API/Touch_events)を処理するWebアプリケーションは、[TouchEvent](https://developer.mozilla.org/ja/docs/Web/API/TouchEvent/TouchEvent)を手動でディスパッチすることでテストできます。

## パンジェスチャーのエミュレーション

以下の例では、マップを移動させるパンジェスチャーをエミュレートします。テスト対象のアプリは、タッチポイントの`clientX/clientY`座標のみを使用しているため、それだけを初期化します。

```javascript
import { test, expect, devices, type Locator } from '@playwright/test';

test.use({ ...devices['Pixel 7'] });

async function pan(locator: Locator, deltaX = 0, deltaY = 0, steps = 5) {
  // 要素の中心座標を取得
  const { centerX, centerY } = await locator.evaluate((target: HTMLElement) => {
    const bounds = target.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    return { centerX, centerY };
  });

  // タッチポイントを作成（clientXとclientYのみ設定）
  const touches = [{
    identifier: 0,
    clientX: centerX,
    clientY: centerY,
  }];

  // タッチ開始イベントを発火
  await locator.dispatchEvent('touchstart', 
    { touches, changedTouches: touches, targetTouches: touches });

  // 複数ステップでタッチ移動イベントを発火
  for (let i = 1; i <= steps; i++) {
    const touches = [{
      identifier: 0,
      clientX: centerX + deltaX * i / steps,
      clientY: centerY + deltaY * i / steps,
    }];
    await locator.dispatchEvent('touchmove',
      { touches, changedTouches: touches, targetTouches: touches });
  }

  // タッチ終了イベントを発火
  await locator.dispatchEvent('touchend');
}

test(`パンジェスチャーでマップを移動`, async ({ page }) => {
  await page.goto('https://www.google.com/maps/place/@37.4117722,-122.0713234,15z',
    { waitUntil: 'commit' });
  await page.getByRole('button', { name: 'ウェブ版を使用' }).click();
  
  // マップ要素を取得
  const map = page.locator('[data-test-id="met"]');
  
  // 複数回パンを実行
  for (let i = 0; i < 5; i++)
    await pan(map, 200, 100);
  
  // マップが移動したことを確認
  await expect(map).toHaveScreenshot();
});
```

## ピンチジェスチャーのエミュレーション

以下の例では、ピンチジェスチャー（2つのタッチポイントが互いに近づく/離れる）をエミュレートします。これはマップをズームイン/アウトすることが期待されます。

```javascript
import { test, expect, devices, type Locator } from '@playwright/test';

test.use({ ...devices['Pixel 7'] });

async function pinch(locator: Locator, 
  arg: { deltaX?: number, steps?: number, direction?: 'in' | 'out' }) {
  
  // 要素の中心座標を取得
  const { centerX, centerY } = await locator.evaluate((target: HTMLElement) => {
    const bounds = target.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    return { centerX, centerY };
  });

  const deltaX = arg.deltaX ?? 50;
  const steps = arg.steps ?? 5;
  const stepDeltaX = deltaX / (steps + 1);

  // 要素の中心から等距離にある2つのタッチポイント
  const touches = [
    {
      identifier: 0,
      clientX: centerX - (arg.direction === 'in' ? deltaX : stepDeltaX),
      clientY: centerY,
    },
    {
      identifier: 1,
      clientX: centerX + (arg.direction === 'in' ? deltaX : stepDeltaX),
      clientY: centerY,
    },
  ];

  // タッチ開始イベントを発火
  await locator.dispatchEvent('touchstart',
    { touches, changedTouches: touches, targetTouches: touches });

  // タッチポイントを互いに近づける/離す
  for (let i = 1; i <= steps; i++) {
    const offset = (arg.direction === 'in' ? (deltaX - i * stepDeltaX) : (stepDeltaX * (i + 1)));
    const touches = [
      {
        identifier: 0,
        clientX: centerX - offset,
        clientY: centerY,
      },
      {
        identifier: 1,
        clientX: centerX + offset,
        clientY: centerY,
      },
    ];
    await locator.dispatchEvent('touchmove',
      { touches, changedTouches: touches, targetTouches: touches });
  }

  // タッチ終了イベントを発火
  await locator.dispatchEvent('touchend', { touches: [], changedTouches: [], targetTouches: [] });
}

test(`ピンチインジェスチャーでマップをズームアウト`, async ({ page }) => {
  await page.goto('https://www.google.com/maps/place/@37.4117722,-122.0713234,15z',
    { waitUntil: 'commit' });
  await page.getByRole('button', { name: 'ウェブ版を使用' }).click();
  
  // マップ要素を取得
  const map = page.locator('[data-test-id="met"]');
  
  // 複数回ピンチインを実行
  for (let i = 0; i < 5; i++)
    await pinch(map, { deltaX: 40, direction: 'in' });
  
  // マップがズームアウトされたことを確認
  await expect(map).toHaveScreenshot();
});