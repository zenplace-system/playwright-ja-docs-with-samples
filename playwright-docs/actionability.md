# Playwright自動待機

## 概要

Playwrightは、アクションを実行する前に要素に対して一連のアクション可能性チェックを実行し、これらのアクションが期待通りに動作することを確認します。関連するすべてのチェックが合格するまで自動的に待機し、その後でリクエストされたアクションを実行します。指定された`timeout`内に必要なチェックが合格しない場合、アクションは`TimeoutError`で失敗します。

例えば、[locator.click()](/docs/api/class-locator#locator-click)の場合、Playwrightは以下を確認します：

* ロケーターが正確に1つの要素に解決される
* 要素が[可視](#可視性)である
* 要素がアニメーションしていないか、アニメーションが完了しているなど[安定](#安定性)している
* 要素が他の要素に隠されていないなど[イベントを受信](#イベント受信)する
* 要素が[有効](#有効性)である

以下は、各アクションに対して実行されるアクション可能性チェックの完全なリストです：

| アクション | [可視性](#可視性) | [安定性](#安定性) | [イベント受信](#イベント受信) | [有効性](#有効性) | [編集可能性](#編集可能性) |
|----------|--------------|--------------|----------------------|--------------|-------------------|
| [locator.check()](/docs/api/class-locator#locator-check) | はい | はい | はい | はい | - |
| [locator.click()](/docs/api/class-locator#locator-click) | はい | はい | はい | はい | - |
| [locator.dblclick()](/docs/api/class-locator#locator-dblclick) | はい | はい | はい | はい | - |
| [locator.setChecked()](/docs/api/class-locator#locator-set-checked) | はい | はい | はい | はい | - |
| [locator.tap()](/docs/api/class-locator#locator-tap) | はい | はい | はい | はい | - |
| [locator.uncheck()](/docs/api/class-locator#locator-uncheck) | はい | はい | はい | はい | - |
| [locator.hover()](/docs/api/class-locator#locator-hover) | はい | はい | はい | - | - |
| [locator.dragTo()](/docs/api/class-locator#locator-drag-to) | はい | はい | はい | - | - |
| [locator.screenshot()](/docs/api/class-locator#locator-screenshot) | はい | はい | - | - | - |
| [locator.fill()](/docs/api/class-locator#locator-fill) | はい | - | - | はい | はい |
| [locator.clear()](/docs/api/class-locator#locator-clear) | はい | - | - | はい | はい |
| [locator.selectOption()](/docs/api/class-locator#locator-select-option) | はい | - | - | はい | - |
| [locator.selectText()](/docs/api/class-locator#locator-select-text) | はい | - | - | - | - |
| [locator.scrollIntoViewIfNeeded()](/docs/api/class-locator#locator-scroll-into-view-if-needed) | - | はい | - | - | - |
| [locator.blur()](/docs/api/class-locator#locator-blur) | - | - | - | - | - |
| [locator.dispatchEvent()](/docs/api/class-locator#locator-dispatch-event) | - | - | - | - | - |
| [locator.focus()](/docs/api/class-locator#locator-focus) | - | - | - | - | - |
| [locator.press()](/docs/api/class-locator#locator-press) | - | - | - | - | - |
| [locator.pressSequentially()](/docs/api/class-locator#locator-press-sequentially) | - | - | - | - | - |
| [locator.setInputFiles()](/docs/api/class-locator#locator-set-input-files) | - | - | - | - | - |

## アクションの強制実行

[locator.click()](/docs/api/class-locator#locator-click)のような一部のアクションは、非必須のアクション可能性チェックを無効にする`force`オプションをサポートしています。例えば、[locator.click()](/docs/api/class-locator#locator-click)メソッドに真の`force`を渡すと、ターゲット要素が実際にクリックイベントを受信するかどうかをチェックしません。

## アサーション

Playwrightには、アクションの前の自動待機と同様に、条件が満たされるまで待機することでフレーキーさを排除する自動再試行アサーションが含まれています。

詳細は[アサーションガイド](/docs/test-assertions)を参照してください。

## 可視性

要素は、空でないバウンディングボックスを持ち、`visibility:hidden`の計算スタイルを持たない場合に可視と見なされます。

この定義によると：

* サイズがゼロの要素は可視と見なされ**ません**。
* `display:none`の要素は可視と見なされ**ません**。
* `opacity:0`の要素は可視と見なされ**ます**。

## 安定性

要素は、少なくとも連続する2つのアニメーションフレームで同じバウンディングボックスを維持している場合に安定していると見なされます。

## 有効性

要素は、**無効でない**場合に有効と見なされます。

要素は以下の場合に**無効**です：

* `[disabled]`属性を持つ`<button>`、`<select>`、`<input>`、`<textarea>`、`<option>`または`<optgroup>`である場合
* `[disabled]`属性を持つ`<fieldset>`の一部である`<button>`、`<select>`、`<input>`、`<textarea>`、`<option>`または`<optgroup>`である場合
* `[aria-disabled=true]`属性を持つ要素の子孫である場合

## 編集可能性

要素は、[有効](#有効性)で**読み取り専用でない**場合に編集可能と見なされます。

要素は以下の場合に**読み取り専用**です：

* `[readonly]`属性を持つ`<select>`、`<input>`または`<textarea>`である場合
* `[aria-readonly=true]`属性と[それをサポートする](https://w3c.github.io/aria/#aria-readonly)ariaロールを持つ場合

## イベント受信

要素は、アクションポイントでポインターイベントのヒットターゲットである場合、ポインターイベントを受信していると見なされます。例えば、ポイント`(10;10)`でクリックする場合、Playwrightは他の要素（通常はオーバーレイ）が代わりに`(10;10)`でクリックをキャプチャするかどうかをチェックします。

例えば、[locator.click()](/docs/api/class-locator#locator-click)呼び出しがいつ行われたかに関係なく、Playwrightが「サインアップ」ボタンをクリックするシナリオを考えてみましょう：

* ページはユーザー名が一意であるかをチェックしており、「サインアップ」ボタンは無効になっています
* サーバーとのチェック後、無効な「サインアップ」ボタンは有効になった別のボタンに置き換えられます