import { test, expect } from '@playwright/test';
import { PUBLIC_PAGES, SENSITIVE_PATHS } from '../../config/target';
import { recordFinding } from '../../utils/security-reporter';

test.describe('A05 Security Misconfiguration @scan', () => {
  test('sensitive paths should not be exposed', async ({ request }) => {
    const exposed: string[] = [];

    for (const path of SENSITIVE_PATHS) {
      const response = await request.get(path, { timeout: 15_000 });
      const status = response.status();
      const body = await response.text();
      const looksSensitive =
        status === 200 &&
        (body.includes('APP_KEY') ||
          body.includes('DB_PASSWORD') ||
          body.includes('Index of /') ||
          body.includes('phpinfo()') ||
          body.includes('[core]'));

      if (looksSensitive) exposed.push(`${path} (${status})`);
    }

    if (exposed.length > 0) {
      recordFinding({
        owasp: 'A05:2021 Security Misconfiguration',
        severity: 'critical',
        title: 'Sensitive paths accessible',
        detail: exposed.join('; '),
        passed: false,
      });
      expect(exposed, 'Sensitive paths exposed').toEqual([]);
    } else {
      recordFinding({
        owasp: 'A05:2021 Security Misconfiguration',
        severity: 'info',
        title: 'Sensitive/debug paths not exposed',
        detail: `Probed ${SENSITIVE_PATHS.length} paths — no sensitive content at 200`,
        passed: true,
      });
    }
  });

  test('public pages should not return server errors', async ({ request }) => {
    const errors: string[] = [];

    for (const path of PUBLIC_PAGES) {
      const response = await request.get(path);
      if (response.status() >= 500) errors.push(`${path} → ${response.status()}`);
    }

    expect(errors).toEqual([]);
    recordFinding({
      owasp: 'A05:2021 Security Misconfiguration',
      severity: 'info',
      title: 'Public pages respond without 5xx errors',
      detail: PUBLIC_PAGES.join(', '),
      passed: true,
    });
  });

  test('error pages should not leak stack traces', async ({ request }) => {
    const response = await request.get('/this-page-should-not-exist-owasp-test');
    const body = await response.text();
    const leaks = [
      'stack trace',
      'Exception in thread',
      'at org.',
      'Traceback (most recent call last)',
      'SyntaxError:',
    ].filter((p) => body.toLowerCase().includes(p.toLowerCase()));

    if (leaks.length > 0) {
      recordFinding({
        owasp: 'A05:2021 Security Misconfiguration',
        severity: 'medium',
        title: 'Verbose error output on 404',
        detail: `Matched patterns: ${leaks.join(', ')}`,
        passed: false,
      });
    } else {
      recordFinding({
        owasp: 'A05:2021 Security Misconfiguration',
        severity: 'info',
        title: '404 page does not expose stack traces',
        detail: `Status: ${response.status()}`,
        passed: true,
      });
    }
  });
});
