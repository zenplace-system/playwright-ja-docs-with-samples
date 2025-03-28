# ブラウザAPIのモック

## 概要

Playwrightはほとんどのブラウザ機能をネイティブにサポートしています。しかし、実験的なAPIや、すべてのブラウザでまだ完全にサポートされていないAPIもあります。そのような場合、Playwrightは専用の自動化APIを提供していないことが多いです。モックを使用して、そのような場合のアプリケーションの動作をテストできます。このガイドではいくつかの例を紹介します。

例として、デバイスのバッテリー状態を表示するために[バッテリーAPI](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery)を使用するウェブアプリを考えてみましょう。バッテリーAPIをモックして、ページがバッテリー状態を正しく表示しているかを確認します。

## モックの作成

ページは読み込み中に非常に早くAPIを呼び出す可能性があるため、ページの読み込みが開始される前にすべてのモックを設定することが重要です。最も簡単な方法は[page.addInitScript()](/docs/api/class-page#page-add-init-script)を呼び出すことです：

```javascript
await page.addInitScript(() => {
  const mockBattery = {
    level: 0.75,
    charging: true,
    chargingTime: 1800,
    dischargingTime: Infinity,
    addEventListener: () => { }
  };
  // 常にモックバッテリー情報を返すようにメソッドをオーバーライド
  window.navigator.getBattery = async () => mockBattery;
});
```

これが完了したら、ページに移動してUIの状態を確認できます：

```javascript
// 各テストの前にモックAPIを設定
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const mockBattery = {
      level: 0.90,
      charging: true,
      chargingTime: 1800, // 秒
      dischargingTime: Infinity,
      addEventListener: () => { }
    };
    // 常にモックバッテリー情報を返すようにメソッドをオーバーライド
    window.navigator.getBattery = async () => mockBattery;
  });
});

test('バッテリー状態を表示', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.battery-percentage')).toHaveText('90%');
  await expect(page.locator('.battery-status')).toHaveText('Adapter');
  await expect(page.locator('.battery-fully')).toHaveText('00:30');
});
```

## 読み取り専用APIのモック

一部のAPIは読み取り専用であるため、navigatorプロパティに代入することはできません。例えば：

```javascript
// 以下の行は効果がありません
navigator.cookieEnabled = true;
```

ただし、プロパティが[configurable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#configurable)である場合は、通常のJavaScriptを使用してオーバーライドできます：

```javascript
await page.addInitScript(() => {
  Object.defineProperty(Object.getPrototypeOf(navigator), 'cookieEnabled', { value: false });
});
```

## API呼び出しの検証

ページが予期されるすべてのAPI呼び出しを行ったかどうかを確認することが役立つ場合があります。すべてのAPIメソッド呼び出しを記録し、ゴールデン結果と比較できます。[page.exposeFunction()](/docs/api/class-page#page-expose-function)は、ページからテストコードにメッセージを渡すのに便利です：

```javascript
test('バッテリー呼び出しをログに記録', async ({ page }) => {
  const log = [];
  // Node.jsスクリプトにメッセージをプッシュする関数を公開
  await page.exposeFunction('logCall', msg => log.push(msg));

  await page.addInitScript(() => {
    const mockBattery = {
      level: 0.75,
      charging: true,
      chargingTime: 1800,
      dischargingTime: Infinity,
      // addEventListenerの呼び出しをログに記録
      addEventListener: (name, cb) => logCall(`addEventListener:${name}`)
    };
    // 常にモックバッテリー情報を返すようにメソッドをオーバーライド
    window.navigator.getBattery = async () => {
      logCall('getBattery');
      return mockBattery;
    };
  });

  await page.goto('/');
  await expect(page.locator('.battery-percentage')).toHaveText('75%');

  // 実際の呼び出しをゴールデンと比較
  expect(log).toEqual([
    'getBattery',
    'addEventListener:chargingchange',
    'addEventListener:levelchange'
  ]);
});
```

## モックの更新

アプリがバッテリー状態の更新を正しく反映することをテストするには、モックバッテリーオブジェクトがブラウザの実装と同じイベントを発火することを確認することが重要です。以下のテストはその方法を示しています：

```javascript
test('バッテリー状態を更新（ゴールデンなし）', async ({ page }) => {
  await page.addInitScript(() => {
    // バッテリー状態が変更されたときに対応するリスナーに通知するモッククラス
    class BatteryMock {
      level = 0.10;
      charging = false;
      chargingTime = 1800;
      dischargingTime = Infinity;
      _chargingListeners = [];
      _levelListeners = [];

      addEventListener(eventName, listener) {
        if (eventName === 'chargingchange')
          this._chargingListeners.push(listener);
        if (eventName === 'levelchange')
          this._levelListeners.push(listener);
      }

      // テストから呼び出される
      _setLevel(value) {
        this.level = value;
        this._levelListeners.forEach(cb => cb());
      }

      _setCharging(value) {
        this.charging = value;
        this._chargingListeners.forEach(cb => cb());
      }
    }

    const mockBattery = new BatteryMock();
    // 常にモックバッテリー情報を返すようにメソッドをオーバーライド
    window.navigator.getBattery = async () => mockBattery;
    // 簡単にアクセスできるようにモックオブジェクトをwindowに保存
    window.mockBattery = mockBattery;
  });

  await page.goto('/');
  await expect(page.locator('.battery-percentage')).toHaveText('10%');

  // レベルを27.5%に更新
  await page.evaluate(() => window.mockBattery._setLevel(0.275));
  await expect(page.locator('.battery-percentage')).toHaveText('27.5%');
  await expect(page.locator('.battery-status')).toHaveText('Battery');

  // 接続されたアダプターをエミュレート
  await page.evaluate(() => window.mockBattery._setCharging(true));
  await expect(page.locator('.battery-status')).toHaveText('Adapter');
  await expect(page.locator('.battery-fully')).toHaveText('00:30');
});