import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: 'tests',
  reporter: process.env.CI ? 'github' : 'list',
  forbidOnly: !!process.env.CI,
  failOnFlakyTests: !!process.env.CI,
  retries: isCI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: isCI ? 'retain-on-failure' : 'on-first-retry',
  },
  webServer: [
    {
      command: 'pnpm --filter api dev',
      url: 'http://localhost:4000/api/health',
      reuseExistingServer: !isCI,
      timeout: 120_000,
      env: {
        PORT: '4000',
        DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/playwright',
        API_CORS_ORIGIN: 'http://localhost:5173'
      }
    },
    {
      command: 'pnpm --filter web dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !isCI,
      timeout: 120_000
    }
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
