# Canaryリリース

## 概要

Node.js版Playwrightにはcanaryリリースシステムがあります。

これにより、正式リリースを待たずに**新機能をテスト**できます。これらの機能は、PlaywrightのNPM `next`タグで毎日リリースされます。

これは、新しく実装された機能が意図通りに動作することを確認し、メンテナに**フィードバックを提供する**良い方法です。

> 注意：canaryリリースを本番環境で使用することはリスクがあるように思えるかもしれませんが、実際にはそうではありません。
> 
> canaryリリースはすべての自動テストに合格し、HTMLレポート、トレースビューア、Playwright Inspectorなどをエンドツーエンドテストでテストするために使用されます。

```bash
npm install -D @playwright/test@next
```

## Next npmディストタグ

`main`ブランチへのコード関連のコミットごとに、継続的インテグレーションは`@next` npmディストタグの下で毎日canaryリリースを公開します。

[npm](https://www.npmjs.com/package/@playwright/test?activeTab=versions)で現在のディストタグを確認できます：

* `latest`: 安定版リリース
* `next`: 次期リリース、毎日公開
* `beta`: リリースブランチが切られた後、通常は安定版リリースの1週間前に、各コミットがこのタグで公開されます

## Canaryリリースの使用方法

```bash
npm install -D @playwright/test@next
```

## ドキュメント

安定版と`next`のドキュメントは[playwright.dev](https://playwright.dev)で公開されています。`next`のドキュメントを表示するには、キーボードの`Shift`キーを5回押してください。