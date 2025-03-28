# ページオブジェクトモデル

## 概要

大規模なテストスイートは、作成と保守を最適化するために構造化できます。ページオブジェクトモデル（POM）はテストスイートを構造化するためのアプローチの一つです。

ページオブジェクトはウェブアプリケーションの一部を表します。例えば、Eコマースウェブアプリケーションには、ホームページ、商品一覧ページ、チェックアウトページなどがあり、それぞれをページオブジェクトモデルで表現できます。

ページオブジェクトは、アプリケーションに適した高レベルAPIを作成することで**作成を簡素化**し、要素セレクターを一箇所にまとめて再利用可能なコードを作成することで繰り返しを避け、**保守を簡素化**します。

## 実装

`playwright.dev`ページでの一般的な操作をカプセル化する`PlaywrightDevPage`ヘルパークラスを作成します。内部的には`page`オブジェクトを使用します。

```javascript
// playwright-dev-page.js
const { expect } = require('@playwright/test');

exports.PlaywrightDevPage = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.getStartedLink = page.locator('a', { hasText: 'Get started' });
    this.gettingStartedHeader = page.locator('h1', { hasText: 'Installation' });
    this.pomLink = page.locator('li', {
      hasText: 'Guides',
    }).locator('a', {
      hasText: 'Page Object Model',
    });
    this.tocList = page.locator('article div.markdown ul > li > a');
  }

  async goto() {
    await this.page.goto('https://playwright.dev');
  }

  async getStarted() {
    await this.getStartedLink.first().click();
    await expect(this.gettingStartedHeader).toBeVisible();
  }

  async pageObjectModel() {
    await this.getStarted();
    await this.pomLink.click();
  }
};
```

これで、テストで`PlaywrightDevPage`クラスを使用できます。

```javascript
// example.spec.js
const { test, expect } = require('@playwright/test');
const { PlaywrightDevPage } = require('./playwright-dev-page');

test('getting started should contain table of contents', async ({ page }) => {
  const playwrightDev = new PlaywrightDevPage(page);
  await playwrightDev.goto();
  await playwrightDev.getStarted();
  await expect(playwrightDev.tocList).toHaveText([
    `How to install Playwright`,
    `What's Installed`,
    `How to run the example test`,
    `How to open the HTML test report`,
    `Write tests using web first assertions, page fixtures and locators`,
    `Run single test, multiple tests, headed mode`,
    `Generate tests with Codegen`,
    `See a trace of your tests`
  ]);
});

test('should show Page Object Model article', async ({ page }) => {
  const playwrightDev = new PlaywrightDevPage(page);
  await playwrightDev.goto();
  await playwrightDev.pageObjectModel();
  await expect(page.locator('article')).toContainText('Page Object Model is a common pattern');
});
```

Playwrightライブラリを直接使用する場合は、以下のようになります：

```javascript
const { PlaywrightDevPage } = require('./playwright-dev-page');

// テスト内で
const page = await browser.newPage();
const playwrightDev = new PlaywrightDevPage(page);
await playwrightDev.goto();
await playwrightDev.getStarted();
await expect(playwrightDev.tocList).toHaveText([
  `How to install Playwright`,
  `What's Installed`,
  `How to run the example test`,
  `How to open the HTML test report`,
  `Write tests using web first assertions, page fixtures and locators`,
  `Run single test, multiple tests, headed mode`,
  `Generate tests with Codegen`,
  `See a trace of your tests`
]);