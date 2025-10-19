import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',           // e2e folder inside packages/client
  timeout: 30_000,
  expect: { timeout: 5000 },
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } }
  ],
  forbidOnly: !!process.env.CI
});
