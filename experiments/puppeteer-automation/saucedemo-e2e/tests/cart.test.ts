import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CartPage, InventoryPage } from '../src/pages/saucedemo.pages.js';
import { PRODUCTS } from '../src/utils/test-data.js';
import { withAuthenticatedPage } from './harness.js';

describe('Cart', () => {
  it('displays added items', async () => {
    await withAuthenticatedPage('cart-display', async (page) => {
      const inventory = new InventoryPage(page);
      await inventory.addToCart(PRODUCTS.backpack);
      await inventory.addToCart(PRODUCTS.boltTshirt);
      await inventory.openCart();

      const cart = new CartPage(page);
      await cart.waitForLoaded();
      assert.equal(await cart.hasItem(PRODUCTS.backpack), true);
      assert.equal(await cart.hasItem(PRODUCTS.boltTshirt), true);
    });
  });

  it('removes item and updates badge', async () => {
    await withAuthenticatedPage('cart-remove', async (page) => {
      const inventory = new InventoryPage(page);
      await inventory.addToCart(PRODUCTS.backpack);
      await inventory.addToCart(PRODUCTS.boltTshirt);
      await inventory.openCart();

      const cart = new CartPage(page);
      await cart.removeItem(PRODUCTS.backpack);
      assert.equal(await cart.hasItem(PRODUCTS.backpack), false);

      await cart.continueShopping();
      await inventory.waitForLoaded();
      assert.equal(await inventory.getCartBadgeText(), '1');
    });
  });

  it('navigates to checkout', async () => {
    await withAuthenticatedPage('cart-checkout', async (page) => {
      const inventory = new InventoryPage(page);
      await inventory.addToCart(PRODUCTS.backpack);
      await inventory.openCart();

      const cart = new CartPage(page);
      await cart.checkout();
      assert.match(page.url(), /checkout-step-one/);
    });
  });
});
