import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { InventoryPage } from '../src/pages/saucedemo.pages.js';
import { PRODUCTS } from '../src/utils/test-data.js';
import { withAuthenticatedPage } from './harness.js';

describe('Inventory', () => {
  it('displays product catalog', async () => {
    await withAuthenticatedPage('inventory-catalog', async (page) => {
      const inventory = new InventoryPage(page);
      assert.equal(await inventory.getProductCount(), 6);
    });
  });

  it('adds product to cart and updates badge', async () => {
    await withAuthenticatedPage('inventory-add', async (page) => {
      const inventory = new InventoryPage(page);
      await inventory.addToCart(PRODUCTS.backpack);
      assert.equal(await inventory.getCartBadgeText(), '1');
    });
  });

  it('removes product from cart on inventory page', async () => {
    await withAuthenticatedPage('inventory-remove', async (page) => {
      const inventory = new InventoryPage(page);
      await inventory.addToCart(PRODUCTS.bikeLight);
      await inventory.removeFromCart(PRODUCTS.bikeLight);
      assert.equal(await inventory.hasCartBadge(), false);
    });
  });

  it('sorts products A to Z', async () => {
    await withAuthenticatedPage('inventory-sort-az', async (page) => {
      const inventory = new InventoryPage(page);
      await inventory.sortBy('az');
      const names = await inventory.getProductNames();
      const sorted = [...names].sort((a, b) => a.localeCompare(b));
      assert.deepEqual(names, sorted);
    });
  });

  it('sorts products Z to A', async () => {
    await withAuthenticatedPage('inventory-sort-za', async (page) => {
      const inventory = new InventoryPage(page);
      await inventory.sortBy('za');
      const names = await inventory.getProductNames();
      const sorted = [...names].sort((a, b) => b.localeCompare(a));
      assert.deepEqual(names, sorted);
    });
  });

  it('logs out to login page', async () => {
    await withAuthenticatedPage('inventory-logout', async (page) => {
      const inventory = new InventoryPage(page);
      await inventory.logout();
      assert.match(page.url(), /saucedemo\.com\/?$/);
    });
  });
});
