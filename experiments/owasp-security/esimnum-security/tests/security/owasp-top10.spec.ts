import { test, expect } from '@playwright/test';
import { PATH_TRAVERSAL_PAYLOADS, SQL_ERROR_PATTERNS, SQLI_PAYLOADS, XSS_PAYLOADS } from '../../utils/payloads';
import { recordFinding } from '../../utils/security-reporter';

test.describe('A03 Injection @scan', () => {
  test('search query XSS reflection check', async ({ page }) => {
    const payload = XSS_PAYLOADS[0];
    await page.goto(`/destinations?q=${encodeURIComponent(payload)}`, {
      waitUntil: 'domcontentloaded',
    });

    const html = await page.content();
    const reflectedRaw =
      html.includes(payload) ||
      html.includes('<script>alert("XSS")</script>') ||
      html.includes('onerror=alert');

    if (reflectedRaw) {
      recordFinding({
        owasp: 'A03:2021 Injection',
        severity: 'high',
        title: 'XSS payload reflected unescaped in page',
        detail: `Payload in URL q= parameter appears in DOM`,
        evidence: payload,
        passed: false,
      });
    } else {
      recordFinding({
        owasp: 'A03:2021 Injection',
        severity: 'info',
        title: 'No obvious XSS reflection in destinations search',
        detail: 'Test payload not found raw in HTML response',
        passed: true,
      });
    }
  });

  for (const payload of SQLI_PAYLOADS) {
    test(`SQLi probe via search param: ${payload.slice(0, 20)}`, async ({ request }) => {
      const response = await request.get('/destinations', {
        params: { q: payload, search: payload },
      });
      const body = await response.text();
      const status = response.status();

      expect(status).not.toBe(500);

      const sqlLeak = SQL_ERROR_PATTERNS.some((p) =>
        body.toLowerCase().includes(p.toLowerCase())
      );
      if (sqlLeak) {
        recordFinding({
          owasp: 'A03:2021 Injection',
          severity: 'critical',
          title: 'SQL error message in response',
          detail: `Payload: ${payload}`,
          passed: false,
        });
      }
    });
  }

  test('path traversal probes return no sensitive files', async ({ request }) => {
    for (const payload of PATH_TRAVERSAL_PAYLOADS) {
      const response = await request.get('/destinations', { params: { file: payload } });
      const body = await response.text();
      expect(body).not.toContain('root:');
      expect(body).not.toContain('/bin/bash');
    }

    recordFinding({
      owasp: 'A03:2021 Injection',
      severity: 'info',
      title: 'Path traversal probes did not return system files',
      detail: 'Tested file= parameter on /destinations',
      passed: true,
    });
  });
});

test.describe('A01 Broken Access Control @scan', () => {
  test('admin paths require authentication', async ({ request }) => {
    const adminPaths = ['/admin', '/api/admin/users', '/my-orders', '/my-esims'];
    const unauthorizedAccess: string[] = [];

    for (const path of adminPaths) {
      const response = await request.get(path, { maxRedirects: 0 });
      const status = response.status();
      if (status === 200) {
        const body = await response.text();
        if (!body.includes('sign-in') && !body.includes('Sign in')) {
          unauthorizedAccess.push(`${path} → 200 without auth`);
        }
      }
    }

    if (unauthorizedAccess.length > 0) {
      recordFinding({
        owasp: 'A01:2021 Broken Access Control',
        severity: 'high',
        title: 'Protected routes accessible without authentication',
        detail: unauthorizedAccess.join('; '),
        passed: false,
      });
    } else {
      recordFinding({
        owasp: 'A01:2021 Broken Access Control',
        severity: 'info',
        title: 'Protected routes not directly accessible',
        detail: 'Admin/account paths redirect or deny unauthenticated access',
        passed: true,
      });
    }
  });
});

test.describe('A04 Insecure Design @scan', () => {
  test('sign-in endpoint rate limiting probe (passive)', async ({ request }) => {
    const attempts = 10;
    const statuses: number[] = [];

    for (let i = 0; i < attempts; i++) {
      const res = await request.post('/sign-in', {
        data: { email: 'probe@example.com', password: `wrong${i}` },
        timeout: 10_000,
      }).catch(() => null);

      if (res) statuses.push(res.status());
    }

    const rateLimited = statuses.includes(429);
    const allAccepted = statuses.every((s) => s === 200 || s === 404 || s === 405);

    if (!rateLimited && statuses.length === attempts) {
      recordFinding({
        owasp: 'A04:2021 Insecure Design',
        severity: 'medium',
        title: 'No rate limiting observed on sign-in probe',
        detail: `${attempts} rapid requests — no 429 returned (statuses: ${[...new Set(statuses)].join(', ')})`,
        passed: false,
      });
    } else if (rateLimited) {
      recordFinding({
        owasp: 'A04:2021 Insecure Design',
        severity: 'info',
        title: 'Rate limiting detected on sign-in',
        detail: 'Received HTTP 429 during probe',
        passed: true,
      });
    } else {
      recordFinding({
        owasp: 'A04:2021 Insecure Design',
        severity: 'info',
        title: 'Sign-in rate limiting inconclusive',
        detail: `Endpoint may use GET/OAuth; statuses: ${[...new Set(statuses)].join(', ') || 'none'}`,
        passed: true,
      });
    }
  });
});
