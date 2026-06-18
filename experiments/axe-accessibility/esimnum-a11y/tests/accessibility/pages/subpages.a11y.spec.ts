import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { formatViolations } from '../../../utils/a11y-reporter';
import { dismissCookieBanner, gotoPage, runPageScan } from '../../../utils/page-helper';

const PAGES = [
  { route: '/destinations', report: 'destinations-a11y-report.json', label: 'Destinations' },
  { route: '/help', report: 'help-a11y-report.json', label: 'Help Center' },
];

test.describe('Subpages Accessibility @scan', () => {
  for (const { route, report, label } of PAGES) {
    test(`${label} (${route}) WCAG 2.1 AA scan`, async ({ page }) => {
      await gotoPage(page, route);
      await dismissCookieBanner(page);

      const { results, summary } = await runPageScan(page, report);

      console.log(`\n=== ${label} Scan ===`);
      console.log(`URL: ${summary.url}`);
      console.log(`Violations: ${summary.totalViolations}`);
      console.log(
        `By impact — critical: ${summary.byImpact.critical}, serious: ${summary.byImpact.serious}, moderate: ${summary.byImpact.moderate}, minor: ${summary.byImpact.minor}`
      );
      console.log(`Incomplete: ${summary.totalIncomplete} | Passed: ${summary.totalPasses}`);

      if (results.violations.length > 0) {
        console.log(formatViolations(results.violations));
      }

      fs.writeFileSync(
        path.join('test-results', report.replace('.json', '-violations.txt')),
        formatViolations(results.violations)
      );
    });
  }
});
