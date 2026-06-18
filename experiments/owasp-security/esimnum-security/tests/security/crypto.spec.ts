import { test, expect } from '@playwright/test';
import { recordFinding } from '../../utils/security-reporter';

async function dismissCookieBanner(page: import('@playwright/test').Page) {
  const accept = page.getByRole('button', { name: /accept all/i });
  if (await accept.isVisible({ timeout: 5000 }).catch(() => false)) {
    await accept.click();
  }
}

test.describe('A02 Cryptographic Failures @scan', () => {
  test('site enforces HTTPS', async ({ request }) => {
    const response = await request.get('/', { maxRedirects: 5 });
    expect(response.url()).toMatch(/^https:\/\//);

    recordFinding({
      owasp: 'A02:2021 Cryptographic Failures',
      severity: 'info',
      title: 'HTTPS enforced',
      detail: `Final URL: ${response.url()}`,
      passed: true,
    });
  });

  test('HTTP redirects to HTTPS', async ({ request }) => {
    const response = await request.get('http://esimnum.com/', { maxRedirects: 5 });
    expect(response.url()).toMatch(/^https:\/\//);

    recordFinding({
      owasp: 'A02:2021 Cryptographic Failures',
      severity: 'info',
      title: 'HTTP to HTTPS redirect',
      detail: `Redirected to ${response.url()}`,
      passed: true,
    });
  });

  test('session cookies should use Secure flag when present', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await dismissCookieBanner(page);

    const cookies = await page.context().cookies();
    const sensitive = cookies.filter(
      (c) =>
        /session|token|auth|jwt|sid|csrf/i.test(c.name) ||
        c.httpOnly ||
        c.name.startsWith('__Secure-')
    );

    console.log(`\n=== Cookies (${cookies.length} total) ===`);
    cookies.forEach((c) => {
      console.log(
        `  ${c.name}: secure=${c.secure}, httpOnly=${c.httpOnly}, sameSite=${c.sameSite}`
      );
    });

    if (cookies.length === 0) {
      recordFinding({
        owasp: 'A02:2021 Cryptographic Failures',
        severity: 'info',
        title: 'No cookies set on first visit (before consent)',
        detail: 'Cookie security flags N/A until cookies are issued',
        passed: true,
      });
      return;
    }

    const insecureSensitive = sensitive.filter((c) => !c.secure);
    if (insecureSensitive.length > 0) {
      recordFinding({
        owasp: 'A02:2021 Cryptographic Failures',
        severity: 'high',
        title: 'Sensitive cookies missing Secure flag',
        detail: insecureSensitive.map((c) => c.name).join(', '),
        passed: false,
      });
    } else if (sensitive.length > 0) {
      recordFinding({
        owasp: 'A02:2021 Cryptographic Failures',
        severity: 'info',
        title: 'Sensitive cookies use Secure flag',
        detail: sensitive.map((c) => c.name).join(', '),
        passed: true,
      });
    }

    const missingSameSite = cookies.filter((c) => !c.sameSite || c.sameSite === 'None');
    if (missingSameSite.some((c) => c.secure)) {
      recordFinding({
        owasp: 'A02:2021 Cryptographic Failures',
        severity: 'medium',
        title: 'Cookies with SameSite=None or unset',
        detail: missingSameSite.map((c) => `${c.name} (${c.sameSite})`).join(', '),
        passed: false,
      });
    }
  });

  test('sign-in page does not leak credentials in URL', async ({ page }) => {
    await page.goto('/sign-in', { waitUntil: 'domcontentloaded' });
    await dismissCookieBanner(page);

    const passwordInput = page.locator('input[type="password"]').first();
    const hasPasswordField = (await passwordInput.count()) > 0;

    if (hasPasswordField) {
      await passwordInput.fill('TestPassword123!');
      const url = page.url();
      expect(url.toLowerCase()).not.toContain('testpassword');
      recordFinding({
        owasp: 'A02:2021 Cryptographic Failures',
        severity: 'info',
        title: 'Credentials not reflected in URL on sign-in page',
        detail: 'Password not present in address bar during input',
        passed: true,
      });
    } else {
      recordFinding({
        owasp: 'A02:2021 Cryptographic Failures',
        severity: 'info',
        title: 'Sign-in page loaded (OAuth/third-party flow may apply)',
        detail: 'No local password field detected on /sign-in',
        passed: true,
      });
    }
  });
});
