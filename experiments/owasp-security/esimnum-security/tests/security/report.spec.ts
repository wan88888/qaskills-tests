import { test } from '@playwright/test';
import { writeSecurityReport } from '../../utils/security-reporter';

test.describe('Report Generation @scan', () => {
  test('generate security report', async () => {
    const summary = writeSecurityReport();

    console.log('\n=== OWASP Security Scan Summary ===');
    console.log(`Target: ${summary.target}`);
    console.log(`Issues: ${summary.issues} | Passed: ${summary.passedChecks}`);
    console.log(
      `Severity — critical: ${summary.bySeverity.critical}, high: ${summary.bySeverity.high}, medium: ${summary.bySeverity.medium}, low: ${summary.bySeverity.low}`
    );

    summary.findings
      .filter((f) => f.passed === false)
      .forEach((f) => {
        console.log(`  [${f.severity.toUpperCase()}] ${f.title}`);
      });

    console.log(`\nReport: test-results/security-report.json`);
  });
});
