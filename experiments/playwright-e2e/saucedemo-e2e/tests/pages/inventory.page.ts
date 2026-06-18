import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByText('Products', { exact: true });
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.sortDropdown = page.getByRole('combobox');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
  }

  async expectToBeVisible(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.pageTitle).toBeVisible();
  }

  inventoryItem(productName: string): Locator {
    return this.page.locator('.inventory_item').filter({ hasText: productName });
  }

  addToCartButton(productName: string): Locator {
    return this.inventoryItem(productName).getByRole('button', { name: 'Add to cart' });
  }

  removeButton(productName: string): Locator {
    return this.inventoryItem(productName).getByRole('button', { name: 'Remove' });
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.addToCartButton(productName).click();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    await this.removeButton(productName).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  productNames(): Locator {
    return this.page.getByTestId(/item-\d+-title-link/);
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
