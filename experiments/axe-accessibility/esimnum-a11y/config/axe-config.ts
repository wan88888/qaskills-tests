import AxeBuilder from '@axe-core/playwright';
import { Page } from '@playwright/test';

export const DEFAULT_AXE_OPTIONS = {
  runOnly: {
    type: 'tag' as const,
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
  },
};

export async function runAxeScan(page: Page, options = DEFAULT_AXE_OPTIONS) {
  return new AxeBuilder({ page }).options(options).analyze();
}

export async function runAxeOnComponent(page: Page, selector: string) {
  return new AxeBuilder({ page })
    .include(selector)
    .options(DEFAULT_AXE_OPTIONS)
    .analyze();
}
