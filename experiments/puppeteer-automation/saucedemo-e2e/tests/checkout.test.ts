import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CartPage, CheckoutPage, InventoryPage } from '../src/pages/saucedemo.pages.js';
import { CHECKOUT, PRODUCTS } from '../src/utils/test-data.js';
import { withAuthenticatedPage } from './harness.js';

describe('Checkout', () => {
  it('completes checkout with valid customer info', async () => {
    await withAuthenticatedPage('checkout-complete', async (page) => {
      const inventory = new InventoryPage(page);
      await inventory.addToCart(PRODUCTS.backpack);
      await inventory.openCart();

      const cart = new CartPage(page);
      await cart.checkout();

      const checkout = new CheckoutPage(page);
      await checkout.fillCustomerInfo(
        CHECKOUT.firstName,
        CHECKOUT.lastName,
        CHECKOUT.postalCode,
      );
      await checkout.continueToOverview();
      await page.waitForFunction(() => window.location.href.includes('checkout-step-two'));
      await checkout.finishOrder();

      assert.equal(await checkout.isOnCompletePage(), true);
    });
  });

  it('requires customer information', async () => {
    await withAuthenticatedPage('checkout-required', async (page) => {
      const inventory = new InventoryPage(page);
      await inventory.addToCart(PRODUCTS.backpack);
      await inventory.openCart();
      await new CartPage(page).checkout();

      const checkout = new CheckoutPage(page);
      await checkout.continueToOverview();
      const error = await checkout.getErrorText();
      assert.match(error, /First Name is required/i);
    });
  });

  it('cancels checkout and returns to cart', async () => {
    await withAuthenticatedPage('checkout-cancel', async (page) => {
      const inventory = new InventoryPage(page);
      await inventory.addToCart(PRODUCTS.backpack);
      await inventory.openCart();
      await new CartPage(page).checkout();

      const checkout = new CheckoutPage(page);
      await checkout.cancel();

      const cart = new CartPage(page);
      await cart.waitForLoaded();
      assert.equal(await cart.hasItem(PRODUCTS.backpack), true);
    });
  });
});
