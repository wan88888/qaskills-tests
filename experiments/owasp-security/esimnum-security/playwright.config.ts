import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/security',
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://esimnum.com',
    trace: 'on-first-retry',
    extraHTTPHeaders: {
      'User-Agent': 'QASkills-OWASP-Security-Scanner/1.0 (+passive; authorized-test)',
    },
  },
});
