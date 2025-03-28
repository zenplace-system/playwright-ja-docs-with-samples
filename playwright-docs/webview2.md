# WebView2

## 概要

ここでは、Playwrightを[Microsoft Edge WebView2](https://docs.microsoft.com/en-us/microsoft-edge/webview2/)と共に使用する方法を説明します。WebView2はWinFormsコントロールで、Microsoft Edgeを使用してWebコンテンツをレンダリングします。Windows 10およびWindows 11で利用可能なMicrosoft Edgeブラウザの一部です。PlaywrightはWebView2アプリケーションの自動化やWebView2内のWebコンテンツのテストに使用できます。WebView2への接続には、Chrome DevTools Protocol (CDP)を介して接続する[browserType.connectOverCDP()](/docs/api/class-browsertype#browser-type-connect-over-cdp)を使用します。

## 概要

WebView2コントロールは、`WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS`環境変数に`--remote-debugging-port=9222`を設定するか、[EnsureCoreWebView2Async](https://docs.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.ensurecorewebview2async?view=webview2-dotnet-1.0.1343.22)を`--remote-debugging-port=9222`引数で呼び出すことで、着信CDP接続をリッスンするように指示できます。これにより、Chrome DevTools Protocolが有効になったWebView2プロセスが起動し、Playwrightによる自動化が可能になります。9222は例としてのポート番号で、他の未使用のポートも使用できます。

```csharp
await this.webView.EnsureCoreWebView2Async(await CoreWebView2Environment.CreateAsync(null, null, new CoreWebView2EnvironmentOptions(){
  AdditionalBrowserArguments = "--remote-debugging-port=9222",
})).ConfigureAwait(false);
```

WebView2コントロールを含むアプリケーションが実行されたら、Playwrightを使って接続できます：

```javascript
const browser = await playwright.chromium.connectOverCDP('http://localhost:9222');
const context = browser.contexts()[0];
const page = context.pages()[0];
```

WebView2コントロールの準備ができたことを確認するには、[`CoreWebView2InitializationCompleted`](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.corewebview2initializationcompleted?view=webview2-dotnet-1.0.1343.22)イベントを待つことができます：

```csharp
this.webView.CoreWebView2InitializationCompleted += (_, e) =>
{
    if (e.IsSuccess)
    {
        Console.WriteLine("WebView2 initialized");
    }
};
```

## テストの作成と実行

デフォルトでは、WebView2コントロールはすべてのインスタンスに同じユーザーデータディレクトリを使用します。これは、複数のテストを並行して実行すると、互いに干渉することを意味します。これを避けるには、`WEBVIEW2_USER_DATA_FOLDER`環境変数（または[WebView2.EnsureCoreWebView2Async Method](https://docs.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.ensurecorewebview2async?view=webview2-dotnet-1.0.1343.22)を使用）を各テストで異なるフォルダに設定する必要があります。これにより、各テストが独自のユーザーデータディレクトリで実行されます。

以下を使用すると、PlaywrightはWebView2アプリケーションをサブプロセスとして実行し、一意のユーザーデータディレクトリを割り当て、[Page](/docs/api/class-page "Page")インスタンスをテストに提供します：

```javascript
// webView2Test.ts
import { test as base } from '@playwright/test';
import fs from 'fs';
import os from 'os';
import path from 'path';
import childProcess from 'child_process';

const EXECUTABLE_PATH = path.join(
    __dirname,
    '../../webview2-app/bin/Debug/net8.0-windows/webview2.exe',
);

export const test = base.extend({
  browser: async ({ playwright }, use, testInfo) => {
    const cdpPort = 10000 + testInfo.workerIndex;
    // 実行可能ファイルが存在し、実行可能であることを確認
    fs.accessSync(EXECUTABLE_PATH, fs.constants.X_OK);
    const userDataDir = path.join(
        fs.realpathSync.native(os.tmpdir()),
        `playwright-webview2-tests/user-data-dir-${testInfo.workerIndex}`,
    );
    const webView2Process = childProcess.spawn(EXECUTABLE_PATH, [], {
      shell: true,
      env: {
        ...process.env,
        WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${cdpPort}`,
        WEBVIEW2_USER_DATA_FOLDER: userDataDir,
      }
    });

    await new Promise<void>(resolve => webView2Process.stdout.on('data', data => {
      if (data.toString().includes('WebView2 initialized'))
        resolve();
    }));

    const browser = await playwright.chromium.connectOverCDP(`http://127.0.0.1:${cdpPort}`);
    await use(browser);
    await browser.close();
    childProcess.execSync(`taskkill /pid ${webView2Process.pid} /T /F`);
    fs.rmdirSync(userDataDir, { recursive: true });
  },
  context: async ({ browser }, use) => {
    const context = browser.contexts()[0];
    await use(context);
  },
  page: async ({ context }, use) => {
    const page = context.pages()[0];
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

```javascript
// example.spec.ts
import { test, expect } from './webView2Test';

test('test WebView2', async ({ page }) => {
  await page.goto('https://playwright.dev');
  const getStarted = page.getByText('Get Started');
  await expect(getStarted).toBeVisible();
});
```

## デバッグ

WebView2コントロール内では、右クリックしてコンテキストメニューを開き、「検査」を選択するか、F12キーを押してDevToolsを開くことができます。また、[WebView2.CoreWebView2.OpenDevToolsWindow](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.core.corewebview2.opendevtoolswindow?view=webview2-dotnet-1.0.1462.37)メソッドを使用してプログラムでDevToolsを開くこともできます。

テストのデバッグについては、Playwrightの[デバッグガイド](/docs/debug)を参照してください。