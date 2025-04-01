import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:9999',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  testMatch: ['**/*.spec.ts', '**/tests/**/*.spec.ts'],
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
    command: 'bun run dev --port 9999',
    reuseExistingServer: true,
  },
});
