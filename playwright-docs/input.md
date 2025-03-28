# アクション

## 概要

Playwrightは、テキスト入力、チェックボックス、ラジオボタン、セレクトオプション、マウスクリック、文字入力、キーとショートカットなどのHTML入力要素と対話できるほか、ファイルのアップロードや要素へのフォーカスも可能です。

## テキスト入力

[locator.fill()](/docs/api/class-locator#locator-fill)を使用するのが、フォームフィールドに入力する最も簡単な方法です。要素にフォーカスし、入力されたテキストで`input`イベントをトリガーします。`<input>`、`<textarea>`、`[contenteditable]`要素で動作します。

```javascript
// テキスト入力
await page.getByRole('textbox').fill('Peter');

// 日付入力
await page.getByLabel('Birth date').fill('2020-02-02');

// 時間入力
await page.getByLabel('Appointment time').fill('13:15');

// ローカル日時入力
await page.getByLabel('Local time').fill('2020-03-02T05:15');
```

## チェックボックスとラジオボタン

[locator.setChecked()](/docs/api/class-locator#locator-set-checked)を使用するのが、チェックボックスやラジオボタンをチェック/チェック解除する最も簡単な方法です。このメソッドは`input[type=checkbox]`、`input[type=radio]`、`[role=checkbox]`要素で使用できます。

```javascript
// チェックボックスをチェック
await page.getByLabel('I agree to the terms above').check();

// チェック状態をアサート
expect(page.getByLabel('Subscribe to newsletter')).toBeChecked();

// ラジオボタンを選択
await page.getByLabel('XL').check();
```

## セレクトオプション

[locator.selectOption()](/docs/api/class-locator#locator-select-option)を使用して、`<select>`要素で1つまたは複数のオプションを選択します。選択するオプションの`value`または`label`を指定できます。複数のオプションを選択することも可能です。

```javascript
// 値またはラベルに一致する単一選択
await page.getByLabel('Choose a color').selectOption('blue');

// ラベルに一致する単一選択
await page.getByLabel('Choose a color').selectOption({ label: 'Blue' });

// 複数選択項目
await page.getByLabel('Choose multiple colors').selectOption(['red', 'green', 'blue']);
```

## マウスクリック

シンプルな人間のクリックを実行します。

```javascript
// 一般的なクリック
await page.getByRole('button').click();

// ダブルクリック
await page.getByText('Item').dblclick();

// 右クリック
await page.getByText('Item').click({ button: 'right' });

// Shift + クリック
await page.getByText('Item').click({ modifiers: ['Shift'] });

// WindowsとLinuxではCtrl + クリック
// macOSではMeta + クリック
await page.getByText('Item').click({ modifiers: ['ControlOrMeta'] });

// 要素にホバー
await page.getByText('Item').hover();

// 左上隅をクリック
await page.getByText('Item').click({ position: { x: 0, y: 0 } });
```

内部的には、このメソッドやその他のポインター関連メソッドは以下を行います：

* 指定されたセレクタを持つ要素がDOMに存在するのを待つ
* 表示されるのを待つ（空でない、`display:none`でない、`visibility:hidden`でない）
* 動きが止まるのを待つ（例：CSSトランジションが終了するまで）
* 要素を表示領域内にスクロール
* アクションポイントでポインターイベントを受信するのを待つ（例：他の要素に隠されていないことを確認）
* 上記のチェック中に要素が切り離された場合は再試行

#### クリックの強制

アプリが複雑なロジックを使用し、要素にホバーすると別の要素がオーバーレイされてクリックを妨げる場合があります。この動作は、要素が覆われてクリックが別の場所に送られるバグと区別がつきません。これが意図的な動作だとわかっている場合は、[アクション可能性](/docs/actionability)チェックをバイパスしてクリックを強制できます：

```javascript
await page.getByRole('button').click({ force: true });
```

#### プログラムによるクリック

実際の条件下でアプリをテストすることに興味がなく、可能な限りクリックをシミュレートしたい場合は、[locator.dispatchEvent()](/docs/api/class-locator#locator-dispatch-event)を使用して要素上でクリックイベントをディスパッチすることで、[`HTMLElement.click()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click)の動作をトリガーできます：

```javascript
await page.getByRole('button').dispatchEvent('click');
```

## 文字入力

> 注意：ほとんどの場合、[locator.fill()](/docs/api/class-locator#locator-fill)を使用してテキストを入力すべきです。上記の[テキスト入力](#テキスト入力)セクションを参照してください。ページに特別なキーボード処理がある場合にのみ、文字を入力する必要があります。

[locator.pressSequentially()](/docs/api/class-locator#locator-press-sequentially)を使用して、実際のキーボードを持つユーザーのように、フィールドに文字を1つずつ入力します。

```javascript
// キーを1つずつ押す
await page.locator('#area').pressSequentially('Hello World!');
```

このメソッドは、`keydown`、`keyup`、`keypress`イベントを含む必要なすべてのキーボードイベントを発行します。オプションの`delay`を指定して、キー押下間の遅延を設定し、実際のユーザーの動作をシミュレートすることもできます。

## キーとショートカット

```javascript
// Enterキーを押す
await page.getByText('Submit').press('Enter');

// Control+右矢印を送信
await page.getByRole('textbox').press('Control+ArrowRight');

// キーボードで$記号を押す
await page.getByRole('textbox').press('$');
```

[locator.press()](/docs/api/class-locator#locator-press)メソッドは選択した要素にフォーカスし、単一のキーストロークを生成します。キーボードイベントの[keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)プロパティで発行される論理キー名を受け付けます：

```
Backquote, Minus, Equal, Backslash, Backspace, Tab, Delete, Escape,
ArrowDown, End, Enter, Home, Insert, PageDown, PageUp, ArrowRight,
ArrowUp, F1 - F12, Digit0 - Digit9, KeyA - KeyZ, など
```

* 代わりに、`"a"`や`"#"`などの単一の文字を指定することもできます。
* 以下の修飾ショートカットもサポートされています：`Shift, Control, Alt, Meta`

シンプルなバージョンは単一の文字を生成します。この文字は大文字と小文字が区別されるため、`"a"`と`"A"`は異なる結果になります。

```javascript
// <input id=name>
await page.locator('#name').press('Shift+A');

// <input id=name>
await page.locator('#name').press('Shift+ArrowLeft');
```

`"Control+o"`や`"Control+Shift+T"`などのショートカットもサポートされています。修飾キーを指定すると、修飾キーが押され、続くキーが押されている間保持されます。

大文字の文字を生成するには、`Shift-A`で大文字の`A`を指定する必要があることに注意してください。`Shift-a`は、`CapsLock`がトグルされているかのように小文字を生成します。

## ファイルのアップロード

[locator.setInputFiles()](/docs/api/class-locator#locator-set-input-files)メソッドを使用して、アップロードするファイルを選択できます。最初の引数は、タイプが`"file"`の[input要素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)を指す必要があります。複数のファイルを配列で渡すことができます。ファイルパスが相対パスの場合、現在の作業ディレクトリからの相対パスとして解決されます。空の配列を渡すと、選択されたファイルがクリアされます。

```javascript
// 1つのファイルを選択
await page.getByLabel('Upload file').setInputFiles(path.join(__dirname, 'myfile.pdf'));

// 複数のファイルを選択
await page.getByLabel('Upload files').setInputFiles([
  path.join(__dirname, 'file1.txt'),
  path.join(__dirname, 'file2.txt'),
]);

// ディレクトリを選択
await page.getByLabel('Upload directory').setInputFiles(path.join(__dirname, 'mydir'));

// 選択したファイルをすべて削除
await page.getByLabel('Upload file').setInputFiles([]);

// メモリからバッファをアップロード
await page.getByLabel('Upload file').setInputFiles({
  name: 'file.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('this is test')
});
```

input要素が手元にない場合（動的に作成される場合）、[page.on('filechooser')](/docs/api/class-page#page-event-file-chooser)イベントを処理するか、アクション時に対応する待機メソッドを使用できます：

```javascript
// クリック前にファイルチューザーの待機を開始。awaitは使用しない。
const fileChooserPromise = page.waitForEvent('filechooser');
await page.getByLabel('Upload file').click();
const fileChooser = await fileChooserPromise;
await fileChooser.setFiles(path.join(__dirname, 'myfile.pdf'));
```

## 要素にフォーカス

フォーカスイベントを処理する動的なページでは、[locator.focus()](/docs/api/class-locator#locator-focus)で指定した要素にフォーカスできます。

```javascript
await page.getByLabel('Password').focus();
```

## ドラッグアンドドロップ

[locator.dragTo()](/docs/api/class-locator#locator-drag-to)を使用してドラッグ＆ドロップ操作を実行できます。このメソッドは以下を行います：

* ドラッグする要素にホバー
* 左マウスボタンを押す
* ドロップを受け取る要素にマウスを移動
* 左マウスボタンを離す

```javascript
await page.locator('#item-to-be-dragged').dragTo(page.locator('#item-to-drop-at'));
```

### 手動でのドラッグ

ドラッグ操作を正確に制御したい場合は、[locator.hover()](/docs/api/class-locator#locator-hover)、[mouse.down()](/docs/api/class-mouse#mouse-down)、[mouse.move()](/docs/api/class-mouse#mouse-move)、[mouse.up()](/docs/api/class-mouse#mouse-up)などの低レベルメソッドを使用します。

```javascript
await page.locator('#item-to-be-dragged').hover();
await page.mouse.down();
await page.locator('#item-to-drop-at').hover();
await page.mouse.up();
```

> 注意：ページが`dragover`イベントのディスパッチに依存している場合、すべてのブラウザでトリガーするには少なくとも2回のマウス移動が必要です。2回目のマウス移動を確実に発行するには、[mouse.move()](/docs/api/class-mouse#mouse-move)または[locator.hover()](/docs/api/class-locator#locator-hover)を2回繰り返します。操作の順序は：ドラッグ要素にホバー、マウスダウン、ドロップ要素にホバー、ドロップ要素に2回目のホバー、マウスアップとなります。

## スクロール

ほとんどの場合、Playwrightはアクションを実行する前に自動的にスクロールします。そのため、明示的にスクロールする必要はありません。

```javascript
// ボタンが見えるように自動的にスクロール
await page.getByRole('button').click();
```

ただし、まれに手動でスクロールする必要がある場合があります。例えば、「無限リスト」により多くの要素を読み込ませたり、特定のスクリーンショット用にページを配置したりする場合です。そのような場合、最も信頼性の高い方法は、下部で表示したい要素を見つけ、それを表示領域にスクロールすることです。

```javascript
// フッターを表示領域にスクロールし、「無限リスト」により多くのコンテンツを読み込ませる
await page.getByText('Footer text').scrollIntoViewIfNeeded();
```

スクロールをより正確に制御したい場合は、[mouse.wheel()](/docs/api/class-mouse#mouse-wheel)または[locator.evaluate()](/docs/api/class-locator#locator-evaluate)を使用します：

```javascript
// マウスを配置してマウスホイールでスクロール
await page.getByTestId('scrolling-container').hover();
await page.mouse.wheel(0, 10);

// または、特定の要素をプログラムでスクロール
await page.getByTestId('scrolling-container').evaluate(e => e.scrollTop += 100);