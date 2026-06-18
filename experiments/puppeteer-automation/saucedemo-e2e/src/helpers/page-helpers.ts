import type { Page } from 'puppeteer';
import { DEFAULT_TIMEOUT } from '../config.js';

export function configurePage(page: Page): void {
  page.setDefaultTimeout(DEFAULT_TIMEOUT);
}

export async function screenshotOnFailure(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
}

export async function blockHeavyAssets(page: Page): Promise<void> {
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const type = request.resourceType();
    if (type === 'image' || type === 'font' || type === 'media') {
      return request.abort();
    }
    return request.continue();
  });
}
