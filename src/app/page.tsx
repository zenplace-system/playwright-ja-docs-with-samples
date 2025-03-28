import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, BookOpen, Command } from "lucide-react";

export default function Page() {
  return (
    <div className="space-y-12">
      <section className="flex flex-col items-center text-center space-y-4 py-8 md:py-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Playwright 学習ガイド
        </h1>
        <p className="text-xl text-muted-foreground max-w-[800px]">
          ブラウザテストを簡単に、信頼性高く実行するためのフレームワーク
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button asChild>
            <Link href="/writing-tests">
              テストを始める <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/generating-tests">テスト自動生成を試す</Link>
          </Button>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Playwrightの特徴</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="mb-4 text-primary">
              <BookOpen className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">多ブラウザサポート</h3>
            <p className="text-muted-foreground">
              Chrome、Firefox、Safariなど主要なブラウザでテストを実行できます。すべて同じAPIで統一的に操作可能です。
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="mb-4 text-primary">
              <Code className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">自動待機機能</h3>
            <p className="text-muted-foreground">
              要素が表示され、有効になり、アニメーションが完了するまで自動的に待機するため、テストの信頼性が向上します。
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="mb-4 text-primary">
              <Command className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">強力なデバッグ</h3>
            <p className="text-muted-foreground">
              トレース機能により、テスト実行の各ステップを視覚的に確認でき、問題の原因を素早く特定できます。
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6 py-8">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8">はじめましょう</h2>
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h3 className="text-xl font-semibold mb-4">インストール</h3>
          <div className="bg-muted p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
            <code>npm init playwright@latest</code>
          </div>
          <p className="text-muted-foreground mb-4">
            このコマンドで、Playwrightをインストールし、初期設定を行います。必要なブラウザも自動的にダウンロードされます。
          </p>
          
          <h3 className="text-xl font-semibold mb-4 mt-8">最初のテスト</h3>
          <div className="bg-muted p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
            <pre>{`import { test, expect } from '@playwright/test';

test('タイトルを確認', async ({ page }) => {
  await page.goto('https://example.com/');
  await expect(page).toHaveTitle(/Example/);
});`}</pre>
          </div>
          <p className="text-muted-foreground">
            このシンプルなテストは、ページにアクセスしてタイトルを確認します。
            Playwrightのテストは直感的で読みやすい構文を持っています。
          </p>
        </div>
        
        <div className="flex justify-center mt-8">
          <Button asChild>
            <Link href="/writing-tests">
              テストの書き方を詳しく学ぶ <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}