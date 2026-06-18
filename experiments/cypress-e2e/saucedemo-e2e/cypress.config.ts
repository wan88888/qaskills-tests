import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10_000,
    requestTimeout: 15_000,
    responseTimeout: 30_000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    video: false,
    screenshotOnRunFailure: true,
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
