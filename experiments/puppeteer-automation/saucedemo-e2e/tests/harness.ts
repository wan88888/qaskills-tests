import type { Browser, Page } from 'puppeteer';
import { launchBrowser } from '../src/browser.js';
import { configurePage, screenshotOnFailure } from '../src/helpers/page-helpers.js';

export async function withPage(
  name: string,
  run: (page: Page) => Promise<void>,
): Promise<void> {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    configurePage(page);
    try {
      await run(page);
    } catch (error) {
      await screenshotOnFailure(page, name).catch(() => undefined);
      throw error;
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

export async function withAuthenticatedPage(
  name: string,
  run: (page: Page) => Promise<void>,
): Promise<void> {
  await withPage(name, async (page) => {
    const { LoginPage, InventoryPage } = await import('../src/pages/saucedemo.pages.js');
    const login = new LoginPage(page);
    await login.open();
    await login.loginAsStandardUser();
    await new InventoryPage(page).waitForLoaded();
    await run(page);
  });
}
