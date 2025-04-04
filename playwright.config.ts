import { defineConfig, devices } from '@playwright/test';

// ポート番号を定数として宣言
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

export default defineConfig({
  // testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',

    // CI環境では追加の設定
    ...(process.env.CI ? {
      // CIでの安定性向上のための設定
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
    } : {}),
  },

  projects: [
    // ヘッドレスモードでのテスト
    {
      name: 'chromium-headless',
      use: { 
        ...devices['Desktop Chrome'],
        headless: true 
      },
    },
    {
      name: 'firefox-headless',
      use: { 
        ...devices['Desktop Firefox'],
        headless: true 
      },
    },
    {
      name: 'webkit-headless',
      use: { 
        ...devices['Desktop Safari'],
        headless: true 
      },
    },

    // ブラウザを表示するモードでのテスト
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: false 
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        headless: false 
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        headless: false 
      },
    },
  ],

  webServer: {
    command: `export PORT=${PORT} && npm run dev`,
    port: PORT,
    reuseExistingServer: !process.env.CI, // CI環境では毎回新しくサーバーを起動
  },
});
