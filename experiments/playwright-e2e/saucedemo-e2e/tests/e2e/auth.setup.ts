import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { USERS } from '../utils/test-data';

setup('authenticate as standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(USERS.standard.username, USERS.standard.password);
  await new InventoryPage(page).expectToBeVisible();
  await page.context().storageState({ path: 'playwright/.auth/standard-user.json' });
});
