# 時間操作

## 概要

Playwrightの時間操作機能を使用すると、テスト内で時間を制御できます。これにより、実際に待機することなく、タイムアウトやスケジュールされたタスクなどの時間依存の動作を検証できます。

## 主な機能

- `setFixedTime`: `Date.now()`と`new Date()`の時間を固定値に設定
- `install`: 時計を初期化し、以下の操作を可能にする
  - `pauseAt`: 特定の時間で一時停止
  - `fastForward`: 時間を早送り
  - `runFor`: 特定の時間だけ実行
  - `resume`: 時間を再開
- `setSystemTime`: システム時間を設定

基本的には`setFixedTime`を使用して特定の時間を設定するのがおすすめです。より高度な制御が必要な場合は`install`を使用します。

## 注意点

`page.clock`は以下の時間関連のネイティブ関数をオーバーライドします：
- `Date`
- `setTimeout`/`clearTimeout`
- `setInterval`/`clearInterval`
- `requestAnimationFrame`/`cancelAnimationFrame`
- `requestIdleCallback`/`cancelIdleCallback`
- `performance`
- `Event.timeStamp`

`install`を使用する場合は、他の時間関連の呼び出しの前に行う必要があります。

## 使用例

### 固定時間でのテスト

時間の流れは自然に進みながら、`Date.now`が常に固定値を返すようにします。

```javascript
// 時間を2024年2月2日10時に固定
await page.clock.setFixedTime(new Date('2024-02-02T10:00:00'));
await page.goto('http://localhost:3333');
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:00 AM');

// 時間を10時30分に変更
await page.clock.setFixedTime(new Date('2024-02-02T10:30:00'));
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:30:00 AM');
```

### 一貫した時間とタイマー

タイマーが`Date.now`に依存している場合、時計をインストールして関心のある時間まで早送りできます。

```javascript
// 時計を初期化して自然にページを読み込む
await page.clock.install({ time: new Date('2024-02-02T08:00:00') });
await page.goto('http://localhost:3333');

// 10時に時間を一時停止
await page.clock.pauseAt(new Date('2024-02-02T10:00:00'));
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:00 AM');

// 30分早送り
await page.clock.fastForward('30:00');
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:30:00 AM');
```

### 非アクティブ監視のテスト

一定時間の非アクティブ後にユーザーをログアウトする機能をテストします。

```javascript
await page.clock.install();
await page.goto('http://localhost:3333');

// ページと対話
await page.getByRole('button').click();

// 5分間早送り（ユーザーが何もしなかったかのように）
await page.clock.fastForward('05:00');

// 自動ログアウトを確認
await expect(page.getByText('非アクティブのためログアウトされました')).toBeVisible();
```

### 手動で時間を進める

時間を細かく制御したい場合は、手動でティックさせることができます。

```javascript
await page.clock.install({ time: new Date('2024-02-02T08:00:00') });
await page.goto('http://localhost:3333');

// 10時に時間を一時停止
await page.clock.pauseAt(new Date('2024-02-02T10:00:00'));
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:00 AM');

// 2秒間手動で時間を進める
await page.clock.runFor(2000);
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:02 AM');