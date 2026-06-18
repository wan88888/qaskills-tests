import { expect, authenticatedTest as test } from '../../fixtures/auth.fixture';
import { PRODUCTS } from '../../utils/test-data';

test.describe('Cart', () => {
  test.beforeEach(async ({ page, inventoryPage }) => {
    await page.goto('/inventory.html');
    await inventoryPage.addProductToCart(PRODUCTS.backpack);
    await inventoryPage.addProductToCart(PRODUCTS.boltTshirt);
    await inventoryPage.openCart();
  });

  test('should display added items in cart', async ({ cartPage }) => {
    await cartPage.expectToBeVisible();
    await cartPage.expectItemInCart(PRODUCTS.backpack);
    await cartPage.expectItemInCart(PRODUCTS.boltTshirt);
  });

  test('should remove item from cart', async ({ cartPage, inventoryPage }) => {
    await cartPage.removeItem(PRODUCTS.backpack);
    await expect(cartPage.cartItem(PRODUCTS.backpack)).toBeHidden();
    await cartPage.continueShoppingButton.click();
    await inventoryPage.expectToBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('should navigate to checkout', async ({ cartPage, checkoutPage }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.expectCheckoutStepOne();
  });
});
