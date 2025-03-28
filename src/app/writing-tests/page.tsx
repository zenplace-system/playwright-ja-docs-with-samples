import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Terminal, FileCode, Play } from "lucide-react";

export default function WritingTestsPage() {
  return (
    <div className="space-y-12">
      <section className="flex flex-col items-center text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">
          テストの作成
        </h1>
        <p className="text-xl text-muted-foreground max-w-[800px]">
          Playwrightを使って効果的なテストを記述する方法
        </p>
      </section>

      <section className="space-y-8">
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-2xl font-bold mb-4">基本的なテスト構造</h2>
          <div className="bg-muted p-4 rounded-md font-mono text-sm my-4 overflow-x-auto">
            <pre>{`import { test, expect } from '@playwright/test';

test('テスト名', async ({ page }) => {
  // 各テストコードをここに記述
});`}</pre>
          </div>
          <p className="text-muted-foreground mb-6">
            Playwrightのテストはシンプルな構造を持っています。<code>test</code>関数にテスト名と非同期関数を渡します。
            非同期関数の引数には<code>page</code>オブジェクトが含まれ、これを使用してブラウザとやり取りします。
          </p>

          <h3 className="text-xl font-semibold mb-3">ページ操作の基本</h3>
          <div className="bg-muted p-4 rounded-md font-mono text-sm my-4 overflow-x-auto">
            <pre>{`// ページにアクセス
await page.goto('https://example.com');

// クリック操作
await page.click('text=ログイン');

// テキスト入力
await page.fill('#username', 'ユーザー名');
await page.fill('#password', 'パスワード');

// ボタンクリック
await page.click('button:has-text("送信")');`}</pre>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 border rounded-md">
              <div className="text-primary mb-2">
                <Terminal className="h-6 w-6" />
              </div>
              <h4 className="font-semibold">セレクターの使用</h4>
              <p className="text-sm text-muted-foreground">
                テキスト、ID、CSSセレクターなど様々な方法で要素を特定できます。
              </p>
            </div>
            <div className="p-4 border rounded-md">
              <div className="text-primary mb-2">
                <FileCode className="h-6 w-6" />
              </div>
              <h4 className="font-semibold">自動待機</h4>
              <p className="text-sm text-muted-foreground">
                要素が操作可能になるまで自動的に待機するので、明示的な待機が不要です。
              </p>
            </div>
            <div className="p-4 border rounded-md">
              <div className="text-primary mb-2">
                <Play className="h-6 w-6" />
              </div>
              <h4 className="font-semibold">非同期処理</h4>
              <p className="text-sm text-muted-foreground">
                すべての操作は非同期で、await キーワードを使用して処理します。
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-2xl font-bold mb-4">アサーション（検証）</h2>
          <p className="text-muted-foreground mb-4">
            テストでは、ページの状態が期待通りであることを確認するためにアサーションを使用します。
          </p>
          <div className="bg-muted p-4 rounded-md font-mono text-sm my-4 overflow-x-auto">
            <pre>{`// タイトルの検証
await expect(page).toHaveTitle(/ホームページ/);

// テキストの存在を確認
await expect(page.locator('.welcome-message')).toContainText('ようこそ');

// 要素が表示されていることを確認
await expect(page.locator('.success-message')).toBeVisible();

// 要素の数を確認
await expect(page.locator('li.item')).toHaveCount(5);`}</pre>
          </div>
          <p className="text-muted-foreground">
            Playwrightの<code>expect</code>関数は、様々な検証メソッドを提供しています。
            これらを使って、テストの各ステップで期待する結果を確認できます。
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-2xl font-bold mb-4">テストの実行</h2>
          <div className="bg-muted p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
            <code>npx playwright test</code>
          </div>
          <p className="text-muted-foreground mb-6">
            このコマンドでプロジェクト内のすべてのテストが実行されます。ヘッドレスモードがデフォルトです。
          </p>

          <h3 className="text-xl font-semibold mb-3">ブラウザを表示して実行</h3>
          <div className="bg-muted p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
            <code>npx playwright test --headed</code>
          </div>
          <p className="text-muted-foreground mb-6">
            <code>--headed</code>オプションを使用すると、テスト実行中のブラウザを表示できます。
          </p>

          <h3 className="text-xl font-semibold mb-3">特定のテストファイルを実行</h3>
          <div className="bg-muted p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
            <code>npx playwright test login.spec.ts</code>
          </div>
          <p className="text-muted-foreground">
            特定のテストファイルのみを実行したい場合は、ファイル名を指定します。
          </p>
        </div>
      </section>

      <div className="flex justify-between mt-8">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> ホームに戻る
          </Link>
        </Button>
        <Button asChild>
          <Link href="/generating-tests">
            テスト自動生成を学ぶ <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
