export const TARGET_URL = process.env.TARGET_URL || 'https://esimnum.com/';

export const THRESHOLDS = {
  performance: 70,
  accessibility: 90,
  'best-practices': 90,
  seo: 90,
} as const;

export type LighthouseCategory = keyof typeof THRESHOLDS;

export const DESKTOP_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop' as const,
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    emulatedUserAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
};

export const MOBILE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'mobile' as const,
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false,
    },
  },
};
