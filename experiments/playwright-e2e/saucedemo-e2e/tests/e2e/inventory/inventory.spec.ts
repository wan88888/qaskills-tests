import { expect, authenticatedTest as test } from '../../fixtures/auth.fixture';
import { PRODUCTS } from '../../utils/test-data';

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('should display product catalog', async ({ inventoryPage }) => {
    await inventoryPage.expectToBeVisible();
    await expect(inventoryPage.productNames()).toHaveCount(6);
  });

  test('should add product to cart and update badge', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart(PRODUCTS.backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(inventoryPage.addToCartButton(PRODUCTS.backpack)).toBeHidden();
    await expect(inventoryPage.removeButton(PRODUCTS.backpack)).toBeVisible();
  });

  test('should remove product from cart on inventory page', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart(PRODUCTS.bikeLight);
    await inventoryPage.removeProductFromCart(PRODUCTS.bikeLight);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('should sort products from A to Z', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.productNames().allTextContents();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('should sort products from Z to A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.productNames().allTextContents();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('should logout and return to login page', async ({ inventoryPage, loginPage }) => {
    await inventoryPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
  });
});
