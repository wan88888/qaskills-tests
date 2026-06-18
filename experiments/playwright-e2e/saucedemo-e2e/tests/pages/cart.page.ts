import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByText('Your Cart', { exact: true });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
  }

  async expectToBeVisible(): Promise<void> {
    await expect(this.page).toHaveURL(/cart\.html/);
    await expect(this.pageTitle).toBeVisible();
  }

  cartItem(productName: string): Locator {
    return this.page.locator('.cart_item').filter({ hasText: productName });
  }

  async expectItemInCart(productName: string): Promise<void> {
    await expect(this.cartItem(productName)).toBeVisible();
  }

  async removeItem(productName: string): Promise<void> {
    await this.cartItem(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
