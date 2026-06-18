import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { USERS } from '../utils/test-data';

type SauceFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<SauceFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export const authenticatedTest = test.extend({
  page: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/standard-user.json',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export async function loginAsStandardUser(page: import('@playwright/test').Page): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(USERS.standard.username, USERS.standard.password);
  await new InventoryPage(page).expectToBeVisible();
}

export { expect } from '@playwright/test';
