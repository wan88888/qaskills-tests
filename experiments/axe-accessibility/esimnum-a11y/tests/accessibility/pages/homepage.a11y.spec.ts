import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'fs';
import * as path from 'path';
import { formatViolations, writeReport } from '../../../utils/a11y-reporter';
import { dismissCookieBanner, gotoPage, runPageScan } from '../../../utils/page-helper';

const TARGET_URL = '/';

test.describe('eSIMNum Homepage Accessibility @scan', () => {
  test('full page WCAG 2.1 AA scan', async ({ page }) => {
    await gotoPage(page, TARGET_URL);
    await dismissCookieBanner(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const summary = writeReport(results, path.join('test-results', 'homepage-a11y-report.json'));

    console.log('\n=== eSIMNum Accessibility Scan Summary ===');
    console.log(`URL: ${summary.url}`);
    console.log(`Total violations: ${summary.totalViolations}`);
    console.log(
      `By impact — critical: ${summary.byImpact.critical}, serious: ${summary.byImpact.serious}, moderate: ${summary.byImpact.moderate}, minor: ${summary.byImpact.minor}`
    );
    console.log(`Incomplete checks: ${summary.totalIncomplete}`);
    console.log(`Passed rules: ${summary.totalPasses}`);

    if (results.violations.length > 0) {
      console.log('\n=== Violations Detail ===');
      console.log(formatViolations(results.violations));
    }

    fs.writeFileSync(
      path.join('test-results', 'homepage-violations.txt'),
      formatViolations(results.violations)
    );

    expect(results.violations, formatViolations(results.violations)).toEqual([]);
  });

  test('color contrast scan', async ({ page }) => {
    await gotoPage(page, TARGET_URL);
    await dismissCookieBanner(page);

    const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();

    const contrastViolations = results.violations.filter((v) => v.id === 'color-contrast');
    console.log(`Color contrast violations: ${contrastViolations.length}`);

    writeReport(
      { ...results, violations: contrastViolations },
      path.join('test-results', 'color-contrast-report.json')
    );
  });

  test('navigation landmark scan', async ({ page }) => {
    await gotoPage(page, TARGET_URL);
    await dismissCookieBanner(page);

    const nav = page.locator('nav, header, [role="navigation"]').first();
    const hasNav = (await nav.count()) > 0;

    if (hasNav) {
      const results = await new AxeBuilder({ page })
        .include('nav, header, [role="navigation"]')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      writeReport(results, path.join('test-results', 'navigation-a11y-report.json'));
      console.log(`Navigation violations: ${results.violations.length}`);
    }
  });

  test('mobile viewport scan', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await gotoPage(page, TARGET_URL);
    await dismissCookieBanner(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const summary = writeReport(results, path.join('test-results', 'mobile-a11y-report.json'));
    console.log(`Mobile violations: ${summary.totalViolations}`);
  });
});
