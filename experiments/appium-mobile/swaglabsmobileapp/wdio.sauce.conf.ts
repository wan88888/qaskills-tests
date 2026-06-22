import path from 'node:path';
import { sauceAndroidCapabilities } from './tests/mobile/config/capabilities';

const region = process.env.SAUCE_REGION ?? 'us-west-1';
const username = process.env.SAUCE_USERNAME;
const accessKey = process.env.SAUCE_ACCESS_KEY;

if (!username || !accessKey) {
  throw new Error('Set SAUCE_USERNAME and SAUCE_ACCESS_KEY for Sauce Labs runs.');
}

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
  maxInstances: 1,
  user: username,
  key: accessKey,
  hostname: `ondemand.${region}.saucelabs.com`,
  port: 443,
  protocol: 'https',
  path: '/wd/hub',
  capabilities: [sauceAndroidCapabilities()],
  logLevel: 'warn',
  waitforTimeout: 20000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 3,
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 180000,
  },
  outputDir: path.resolve(__dirname, 'reports'),
};
