import { test, expect } from '@playwright/test';
import { SECURITY_HEADERS } from '../../config/target';
import { recordFinding } from '../../utils/security-reporter';

test.describe('A05 Security Headers @scan', () => {
  test('homepage response headers', async ({ request }) => {
    const response = await request.get('/');
    expect(response.status()).toBe(200);

    const headers = Object.fromEntries(
      Object.entries(response.headers()).map(([k, v]) => [k.toLowerCase(), v])
    );

    console.log('\n=== Security Headers (/) ===');
    for (const h of [...SECURITY_HEADERS.required, ...SECURITY_HEADERS.recommended]) {
      console.log(`  ${h}: ${headers[h] ?? '(missing)'}`);
    }

    if (headers['strict-transport-security']) {
      recordFinding({
        owasp: 'A02:2021 Cryptographic Failures',
        severity: 'info',
        title: 'HSTS header present',
        detail: `strict-transport-security: ${headers['strict-transport-security']}`,
        passed: true,
      });
    } else {
      recordFinding({
        owasp: 'A02:2021 Cryptographic Failures',
        severity: 'high',
        title: 'Missing HSTS header',
        detail: 'Strict-Transport-Security not set on homepage',
        passed: false,
      });
    }

    if (headers['x-content-type-options'] === 'nosniff') {
      recordFinding({
        owasp: 'A05:2021 Security Misconfiguration',
        severity: 'info',
        title: 'X-Content-Type-Options: nosniff',
        detail: 'MIME sniffing protection enabled',
        passed: true,
      });
    } else {
      recordFinding({
        owasp: 'A05:2021 Security Misconfiguration',
        severity: 'medium',
        title: 'Missing X-Content-Type-Options',
        detail: 'X-Content-Type-Options: nosniff not set',
        passed: false,
      });
    }

    const xfo = headers['x-frame-options'];
    if (xfo && /deny|sameorigin/i.test(xfo)) {
      recordFinding({
        owasp: 'A05:2021 Security Misconfiguration',
        severity: 'info',
        title: 'Clickjacking protection via X-Frame-Options',
        detail: `x-frame-options: ${xfo}`,
        passed: true,
      });
    } else {
      recordFinding({
        owasp: 'A05:2021 Security Misconfiguration',
        severity: 'medium',
        title: 'Missing clickjacking protection',
        detail: 'X-Frame-Options or CSP frame-ancestors not configured',
        passed: false,
      });
    }

    if (headers['content-security-policy']) {
      recordFinding({
        owasp: 'A05:2021 Security Misconfiguration',
        severity: 'info',
        title: 'Content-Security-Policy present',
        detail: headers['content-security-policy'].slice(0, 120),
        passed: true,
      });
    } else {
      recordFinding({
        owasp: 'A05:2021 Security Misconfiguration',
        severity: 'medium',
        title: 'Missing Content-Security-Policy',
        detail: 'No CSP header — XSS impact mitigation reduced',
        passed: false,
      });
    }

    if (headers['referrer-policy']) {
      recordFinding({
        owasp: 'A05:2021 Security Misconfiguration',
        severity: 'info',
        title: 'Referrer-Policy configured',
        detail: headers['referrer-policy'],
        passed: true,
      });
    } else {
      recordFinding({
        owasp: 'A05:2021 Security Misconfiguration',
        severity: 'low',
        title: 'Missing Referrer-Policy',
        detail: 'Referrer leakage not restricted by policy header',
        passed: false,
      });
    }

    if (headers['x-powered-by']) {
      recordFinding({
        owasp: 'A05:2021 Security Misconfiguration',
        severity: 'low',
        title: 'Server technology disclosed via X-Powered-By',
        detail: headers['x-powered-by'],
        passed: false,
      });
    } else {
      recordFinding({
        owasp: 'A05:2021 Security Misconfiguration',
        severity: 'info',
        title: 'No X-Powered-By header',
        detail: 'Framework/version not exposed via X-Powered-By',
        passed: true,
      });
    }
  });

  test('CORS should not allow arbitrary origins on public pages', async ({ request }) => {
    const response = await request.get('/', {
      headers: { Origin: 'https://evil-example.com' },
    });
    const cors = response.headers()['access-control-allow-origin'];
    const allowsWildcard = cors === '*';
    const allowsEvil = cors?.includes('evil-example.com');

    if (allowsWildcard || allowsEvil) {
      recordFinding({
        owasp: 'A05:2021 Security Misconfiguration',
        severity: 'high',
        title: 'Permissive CORS on homepage',
        detail: `access-control-allow-origin: ${cors}`,
        passed: false,
      });
    } else {
      recordFinding({
        owasp: 'A05:2021 Security Misconfiguration',
        severity: 'info',
        title: 'CORS not overly permissive on homepage',
        detail: cors ? `access-control-allow-origin: ${cors}` : 'No ACAO header returned',
        passed: true,
      });
    }
  });
});
