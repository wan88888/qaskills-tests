import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { collectTabStops, dismissCookieBanner, gotoPage } from '../../../utils/page-helper';

test.describe('Keyboard Navigation @scan', () => {
  test('homepage interactive elements should be in tab order', async ({ page }) => {
    await gotoPage(page, '/');
    await dismissCookieBanner(page);

    const stops = await collectTabStops(page, 25);

    fs.writeFileSync(
      path.join('test-results', 'homepage-tab-stops.json'),
      JSON.stringify(stops, null, 2)
    );

    console.log('\n=== Homepage Tab Stops (first 25) ===');
    stops.forEach((s, i) => {
      console.log(`${i + 1}. <${s.tag}> ${s.name || s.href || '(no label)'} focus: ${s.hasFocusIndicator}`);
    });

    const links = stops.filter((s) => s.tag === 'a');
    const buttons = stops.filter((s) => s.tag === 'button' || s.role === 'button');
    const inputs = stops.filter((s) => s.tag === 'input' || s.tag === 'select' || s.tag === 'textarea');

    expect(links.length, 'Should tab to at least one link').toBeGreaterThan(0);
    expect(buttons.length + inputs.length, 'Should tab to interactive controls').toBeGreaterThan(0);
  });

  test('focused elements should have visible focus indicators', async ({ page }) => {
    await gotoPage(page, '/');
    await dismissCookieBanner(page);

    const stops = await collectTabStops(page, 15);
    const withoutIndicator = stops.filter((s) => !s.hasFocusIndicator);

    console.log(`Elements without visible focus indicator: ${withoutIndicator.length}/${stops.length}`);
    withoutIndicator.forEach((s) => {
      console.log(`  - <${s.tag}> "${s.name}"`);
    });

    fs.writeFileSync(
      path.join('test-results', 'focus-indicator-gaps.json'),
      JSON.stringify(withoutIndicator, null, 2)
    );

    const ratio = withoutIndicator.length / Math.max(stops.length, 1);
    expect(ratio, 'More than 50% of tab stops lack focus indicators').toBeLessThan(0.5);
  });

  test('search input should be reachable by keyboard', async ({ page }) => {
    await gotoPage(page, '/');
    await dismissCookieBanner(page);

    const searchInput = page.getByPlaceholder(/where do you need an eSIM/i);
    await expect(searchInput).toBeVisible();

    await searchInput.focus();
    await expect(searchInput).toBeFocused();

    await searchInput.fill('Japan');
    await expect(searchInput).toHaveValue(/Japan/i);
  });

  test('mobile menu should be keyboard accessible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await gotoPage(page, '/');
    await dismissCookieBanner(page);

    const menuButton = page.getByRole('button', { name: /toggle menu/i });
    await expect(menuButton).toBeVisible();

    await menuButton.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);

    const menuStops = await collectTabStops(page, 10);
    expect(menuStops.length, 'Should tab into opened mobile menu').toBeGreaterThan(0);
    fs.writeFileSync(
      path.join('test-results', 'mobile-menu-tab-stops.json'),
      JSON.stringify(menuStops, null, 2)
    );
  });

  test('FAQ accordion should respond to keyboard', async ({ page }) => {
    await gotoPage(page, '/');
    await dismissCookieBanner(page);

    const faqTrigger = page.getByRole('button', { name: /what is an eSIM/i }).first();
    await faqTrigger.scrollIntoViewIfNeeded();
    await expect(faqTrigger).toBeVisible({ timeout: 10000 });

    await faqTrigger.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const expanded = await faqTrigger.getAttribute('aria-expanded');
    console.log(`FAQ aria-expanded after Enter: ${expanded}`);
    expect(expanded, 'FAQ should expand on Enter key').toBe('true');
  });
});
