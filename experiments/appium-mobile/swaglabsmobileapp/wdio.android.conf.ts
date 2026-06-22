import fs from 'node:fs';
import path from 'node:path';
import { localAndroidCapabilities } from './tests/mobile/config/capabilities';

export const config = {
  runner: 'local',
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: './tsconfig.json',
      transpileOnly: true,
    },
  },
  specs: ['./tests/mobile/specs/**/*.spec.ts'],
  exclude: [],
  maxInstances: 1,
  specFileRetries: 0,
  capabilities: [localAndroidCapabilities()],
  logLevel: 'warn',
  bail: 0,
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,
  services: [
    [
      'appium',
      {
        args: {
          relaxedSecurity: true,
        },
        command: 'appium',
      },
    ],
  ],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000,
  },
  outputDir: path.resolve(__dirname, 'reports'),
  onPrepare: () => {
    fs.mkdirSync(path.resolve(__dirname, 'screenshots'), { recursive: true });
  },
  afterTest: async (test: { title: string }, _context: unknown, result: { error?: Error }) => {
    if (result.error) {
      const safeName = test.title.replace(/\s+/g, '-').toLowerCase();
      await browser.saveScreenshot(`./screenshots/${safeName}-${Date.now()}.png`);
    }
  },
};
