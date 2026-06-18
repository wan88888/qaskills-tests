import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/api',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/api-results.json' }],
    process.env.CI ? ['github'] : ['list'],
  ],
  use: {
    baseURL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },
});
