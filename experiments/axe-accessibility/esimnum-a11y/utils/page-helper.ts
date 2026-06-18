import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as path from 'path';
import { writeReport } from './a11y-reporter';

export const BASE_URL = process.env.BASE_URL || 'https://esimnum.com';

export async function gotoPage(page: Page, route = '/') {
  const url = route.startsWith('http') ? route : `${BASE_URL}${route}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(1500);
}

export async function dismissCookieBanner(page: Page) {
  const acceptAll = page.getByRole('button', { name: /accept all/i });
  if (await acceptAll.isVisible({ timeout: 5000 }).catch(() => false)) {
    await acceptAll.click();
    await page.waitForTimeout(500);
  }
}

export async function waitForCookieBanner(page: Page) {
  const heading = page.getByRole('heading', { name: /we use cookies/i });
  await heading.waitFor({ state: 'visible', timeout: 15000 }).catch(() => undefined);
  return heading.isVisible().catch(() => false);
}

export async function runPageScan(
  page: Page,
  reportName: string,
  options?: { include?: string; exclude?: string }
) {
  let builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);
  if (options?.include) builder = builder.include(options.include);
  if (options?.exclude) builder = builder.exclude(options.exclude);

  const results = await builder.analyze();
  const summary = writeReport(results, path.join('test-results', reportName));
  return { results, summary };
}

export type FocusedElementInfo = {
  tag: string;
  role: string | null;
  name: string;
  href: string | null;
  tabIndex: string | null;
  hasFocusIndicator: boolean;
};

export async function collectTabStops(page: Page, maxTabs = 30): Promise<FocusedElementInfo[]> {
  const stops: FocusedElementInfo[] = [];

  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;

      const styles = window.getComputedStyle(el);
      const hasFocusIndicator =
        (styles.outlineWidth && styles.outlineWidth !== '0px' && styles.outlineStyle !== 'none') ||
        (styles.boxShadow && styles.boxShadow !== 'none');

      const name =
        el.getAttribute('aria-label') ||
        (el as HTMLElement).innerText?.trim().slice(0, 60) ||
        el.getAttribute('alt') ||
        el.getAttribute('title') ||
        '';

      return {
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute('role'),
        name,
        href: el.getAttribute('href'),
        tabIndex: el.getAttribute('tabindex'),
        hasFocusIndicator,
      };
    });

    if (info) stops.push(info);
  }

  return stops;
}
