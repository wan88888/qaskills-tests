import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'fs';
import * as path from 'path';
import { formatViolations, writeReport } from '../../../utils/a11y-reporter';
import { gotoPage, waitForCookieBanner } from '../../../utils/page-helper';

test.describe('Cookie Banner Accessibility @scan', () => {
  test('cookie consent dialog should be accessible when visible', async ({ page }) => {
    await gotoPage(page, '/');
    const bannerVisible = await waitForCookieBanner(page);
    expect(bannerVisible, 'Cookie banner should appear on first visit').toBe(true);

    const results = await new AxeBuilder({ page })
      .include('body')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const summary = writeReport(results, path.join('test-results', 'cookie-banner-a11y-report.json'));

    console.log('\n=== Cookie Banner Scan ===');
    console.log(`Violations: ${summary.totalViolations}`);
    if (results.violations.length > 0) {
      console.log(formatViolations(results.violations));
    }

    fs.writeFileSync(
      path.join('test-results', 'cookie-banner-violations.txt'),
      formatViolations(results.violations)
    );
  });

  test('cookie banner buttons should be keyboard reachable', async ({ page }) => {
    await gotoPage(page, '/');
    await waitForCookieBanner(page);

    const acceptAll = page.getByRole('button', { name: /accept all/i });
    const customize = page.getByRole('button', { name: /customize/i });
    const reject = page.getByRole('button', { name: /reject/i });

    await expect(acceptAll).toBeVisible();
    await expect(customize).toBeVisible();
    await expect(reject).toBeVisible();

    await acceptAll.focus();
    await expect(acceptAll).toBeFocused();

    const focusOutline = await acceptAll.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow,
      };
    });

    const hasFocusIndicator =
      (focusOutline.outlineWidth && focusOutline.outlineWidth !== '0px') ||
      (focusOutline.boxShadow && focusOutline.boxShadow !== 'none');

    expect(hasFocusIndicator, 'Accept all button should have visible focus indicator').toBe(true);
  });

  test('cookie preference center should be accessible when opened', async ({ page }) => {
    await gotoPage(page, '/');
    await waitForCookieBanner(page);

    await page.getByRole('button', { name: /customize/i }).click();
    await page.waitForTimeout(500);

    const preferenceCenter = page.locator('text=Preference Center').first();
    await expect(preferenceCenter).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const summary = writeReport(
      results,
      path.join('test-results', 'cookie-preference-center-a11y-report.json')
    );

    console.log(`Preference center violations: ${summary.totalViolations}`);
    if (results.violations.length > 0) {
      console.log(formatViolations(results.violations));
    }
  });
});
