# Playwrightテスト分離

## 概要

Playwrightで書かれたテストは、ブラウザコンテキストと呼ばれる分離されたクリーンな環境で実行されます。この分離モデルにより再現性が向上し、連鎖的なテスト失敗を防ぎます。

## テスト分離とは

テスト分離とは、各テストが他のテストから完全に分離されている状態を指します。すべてのテストは他のテストから独立して実行されます。つまり、各テストには独自のローカルストレージ、セッションストレージ、Cookieなどがあります。Playwrightは[BrowserContext](/docs/api/class-browsercontext)を使用してこれを実現します。これはシークレットモードのようなプロファイルに相当します。作成が高速で低コストであり、単一のブラウザで実行する場合でも完全に分離されています。Playwrightは各テストにコンテキストを作成し、そのコンテキスト内にデフォルトの[Page](/docs/api/class-page)を提供します。

## テスト分離が重要な理由

* 失敗の連鎖がない：1つのテストが失敗しても、他のテストに影響しません。
* エラーやフレーキーさのデバッグが容易：単一のテストを必要な回数だけ実行できます。
* 並列実行、シャーディングなどの際に実行順序を考慮する必要がありません。

## テスト分離の2つの方法

テスト分離には2つの異なる戦略があります：ゼロから始めるか、テスト間でクリーンアップするかです。テスト間でクリーンアップする問題点は、クリーンアップを忘れやすいことと、「訪問済みリンク」などクリーンアップが不可能なものがあることです。あるテストの状態が次のテストに漏れると、テストが失敗する可能性があり、問題が別のテストから来るためデバッグが難しくなります。ゼロから始めるということは、すべてが新しいので、テストが失敗した場合、デバッグするためにそのテスト内だけを見ればよいということです。

## Playwrightがテスト分離を実現する方法

Playwrightはブラウザコンテキストを使用してテスト分離を実現します。各テストには独自のブラウザコンテキストがあります。テストを実行すると、毎回新しいブラウザコンテキストが作成されます。Playwrightをテストランナーとして使用する場合、ブラウザコンテキストはデフォルトで作成されます。それ以外の場合は、手動でブラウザコンテキストを作成できます。

```javascript
// テストランナーを使用する場合
import { test } from '@playwright/test';

test('例のテスト', async ({ page, context }) => {
  // "context"はこの特定のテスト用に作成された分離されたBrowserContextです。
  // "page"はこのコンテキストに属しています。
});

test('別のテスト', async ({ page, context }) => {
  // この2番目のテストの"context"と"page"は
  // 最初のテストから完全に分離されています。
});
```

```javascript
// ライブラリAPIを使用する場合
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
```

ブラウザコンテキストは、モバイルデバイス、権限、ロケール、カラースキームを含む複数ページのシナリオをエミュレートするためにも使用できます。詳細については、[エミュレーション](/docs/emulation)ガイドをご覧ください。

## 単一テスト内での複数コンテキスト

Playwrightは単一のシナリオ内で複数のブラウザコンテキストを作成できます。これは、チャットのようなマルチユーザー機能をテストする場合に便利です。

```javascript
// テストランナーを使用する場合
import { test } from '@playwright/test';

test('管理者とユーザー', async ({ browser }) => {
  // 2つの分離されたブラウザコンテキストを作成
  const adminContext = await browser.newContext();
  const userContext = await browser.newContext();
  
  // ページを作成し、コンテキストと独立してやり取り
  const adminPage = await adminContext.newPage();
  const userPage = await userContext.newPage();
});
```

```javascript
// ライブラリAPIを使用する場合
const { chromium } = require('playwright');

// Chromiumブラウザインスタンスを作成
const browser = await chromium.launch();

// 2つの分離されたブラウザコンテキストを作成
const userContext = await browser.newContext();
const adminContext = await browser.newContext();

// ページを作成し、コンテキストと独立してやり取り
const adminPage = await adminContext.newPage();
const userPage = await userContext.newPage();