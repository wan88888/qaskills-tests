import { expect, authenticatedTest as test } from '../../fixtures/auth.fixture';
import { CHECKOUT, PRODUCTS } from '../../utils/test-data';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page, inventoryPage, cartPage }) => {
    await page.goto('/inventory.html');
    await inventoryPage.addProductToCart(PRODUCTS.backpack);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
  });

  test('should complete checkout with valid customer info', async ({
    checkoutPage,
    inventoryPage,
  }) => {
    await checkoutPage.expectCheckoutStepOne();
    await checkoutPage.fillCustomerInfo(
      CHECKOUT.firstName,
      CHECKOUT.lastName,
      CHECKOUT.postalCode,
    );
    await checkoutPage.continueToOverview();
    await checkoutPage.expectOverviewVisible();
    await expect(checkoutPage.page.getByText(PRODUCTS.backpack)).toBeVisible();
    await checkoutPage.completeOrder();
    await checkoutPage.expectCheckoutComplete();
    await expect(inventoryPage.page.getByText('Back Home')).toBeVisible();
  });

  test('should require customer information on step one', async ({ checkoutPage }) => {
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.page.getByText('Error: First Name is required')).toBeVisible();
  });

  test('should cancel checkout and return to cart', async ({ checkoutPage, cartPage }) => {
    await checkoutPage.cancelButton.click();
    await cartPage.expectToBeVisible();
    await cartPage.expectItemInCart(PRODUCTS.backpack);
  });
});
