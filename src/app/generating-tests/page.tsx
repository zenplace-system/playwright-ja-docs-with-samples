import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Video, ExternalLink, Code2, Wand2 } from "lucide-react";

export default function GeneratingTestsPage() {
  return (
    <div className="space-y-12">
      <section className="flex flex-col items-center text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">
          テストの自動生成
        </h1>
        <p className="text-xl text-muted-foreground max-w-[800px]">
          Playwrightのコードジェネレーターを使って簡単にテストを作成
        </p>
      </section>

      <section className="space-y-6">
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Codegen — コード自動生成ツール</h2>
          <p className="text-muted-foreground mb-6">
            Playwrightの<code>codegen</code>コマンドを使用すると、ブラウザで操作するだけでテストコードが自動生成されます。
            手作業でコードを書く手間を大幅に削減し、テスト作成のスピードを向上させます。
          </p>

          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary/10 p-8 rounded-lg text-center">
              <Wand2 className="h-12 w-12 mx-auto text-primary mb-4" />
              <p className="text-xl font-semibold">操作を記録するだけで<br />テストコードが自動生成される</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-3">基本的な使い方</h3>
          <div className="bg-muted p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
            <code>npx playwright codegen https://example.com</code>
          </div>
          <p className="text-muted-foreground mb-6">
            このコマンドを実行すると、以下の2つのウィンドウが開きます：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 border rounded-md">
              <h4 className="font-semibold mb-2">1. ブラウザウィンドウ</h4>
              <p className="text-sm text-muted-foreground">
                通常のウェブブラウザとして操作できます。ここでの操作がテストとして記録されます。
              </p>
            </div>
            <div className="p-4 border rounded-md">
              <h4 className="font-semibold mb-2">2. Playwrightインスペクタ</h4>
              <p className="text-sm text-muted-foreground">
                ブラウザでの操作に対応するコードがリアルタイムで表示されます。
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-2xl font-bold mb-4">実践的な例</h2>
          <p className="text-muted-foreground mb-6">
            たとえば、ログインフォームのテストを自動生成する場合：
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mt-0.5">1</div>
              <div>
                <p className="font-medium">コードジェネレーターを起動</p>
                <div className="bg-muted p-3 rounded-md font-mono text-sm mt-2 overflow-x-auto">
                  <code>npx playwright codegen https://your-website.com/login</code>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mt-0.5">2</div>
              <div>
                <p className="font-medium">ブラウザでログイン操作を実行</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                  <li>ユーザー名フィールドをクリックして入力</li>
                  <li>パスワードフィールドをクリックして入力</li>
                  <li>ログインボタンをクリック</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mt-0.5">3</div>
              <div>
                <p className="font-medium">生成されたコードを確認・コピー</p>
                <div className="bg-muted p-3 rounded-md font-mono text-sm mt-2 overflow-x-auto">
                  <pre>{`import { test, expect } from '@playwright/test';

test('ログインテスト', async ({ page }) => {
  await page.goto('https://your-website.com/login');
  await page.getByLabel('ユーザー名').fill('testuser');
  await page.getByLabel('パスワード').fill('password123');
  await page.getByRole('button', { name: 'ログイン' }).click();
  await expect(page.getByText('ログインに成功しました')).toBeVisible();
});`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-2xl font-bold mb-4">高度な使い方</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded-md">
              <div className="text-primary mb-2">
                <Code2 className="h-6 w-6" />
              </div>
              <h4 className="font-semibold">特定の言語で出力</h4>
              <p className="text-sm text-muted-foreground">
                <code>--target</code>オプションで言語を指定できます（JavaScript, TypeScript, Python など）
              </p>
              <div className="bg-muted p-2 rounded-md font-mono text-xs mt-2 overflow-x-auto">
                <code>npx playwright codegen --target=python</code>
              </div>
            </div>
            <div className="p-4 border rounded-md">
              <div className="text-primary mb-2">
                <Video className="h-6 w-6" />
              </div>
              <h4 className="font-semibold">デバイスエミュレーション</h4>
              <p className="text-sm text-muted-foreground">
                スマホやタブレットなど特定のデバイスをエミュレートしてテスト生成
              </p>
              <div className="bg-muted p-2 rounded-md font-mono text-xs mt-2 overflow-x-auto">
                <code>npx playwright codegen --device=&quot;iPhone 13&quot;</code>
              </div>
            </div>
            <div className="p-4 border rounded-md">
              <div className="text-primary mb-2">
                <ExternalLink className="h-6 w-6" />
              </div>
              <h4 className="font-semibold">ビューポートの設定</h4>
              <p className="text-sm text-muted-foreground">
                特定の画面サイズでテストを生成することが可能
              </p>
              <div className="bg-muted p-2 rounded-md font-mono text-xs mt-2 overflow-x-auto">
                <code>npx playwright codegen --viewport-size=1280,720</code>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-3">コードの修正と最適化</h3>
          <p className="text-muted-foreground mb-4">
            自動生成されたコードは、そのまま使用することもできますが、必要に応じて以下のような最適化ができます：
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
            <li>冗長な操作の削除</li>
            <li>より堅牢なセレクターへの変更</li>
            <li>アサーション（検証ステップ）の追加</li>
            <li>変数の抽出や関数化によるコードの整理</li>
          </ul>
          <p className="text-muted-foreground">
            Playwrightは優れたセレクターを自動的に生成しますが、プロジェクトに最適なセレクター戦略に合わせて調整すると、より保守性の高いテストになります。
          </p>
        </div>
      </section>

      <div className="flex justify-between mt-8">
        <Button variant="outline" asChild>
          <Link href="/writing-tests">
            <ArrowLeft className="mr-2 h-4 w-4" /> テストの作成に戻る
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            ホームに戻る <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
