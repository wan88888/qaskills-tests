import type { Page } from 'puppeteer';
import { BASE_URL } from '../config.js';
import { USERS } from '../utils/test-data.js';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.locator('[data-test="username"]').fill(username);
    await this.page.locator('[data-test="password"]').fill(password);
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      this.page.locator('[data-test="login-button"]').click(),
    ]);
  }

  async loginExpectingError(username: string, password: string): Promise<void> {
    await this.page.locator('[data-test="username"]').fill(username);
    await this.page.locator('[data-test="password"]').fill(password);
    await this.page.locator('[data-test="login-button"]').click();
    await this.page.waitForSelector('[data-test="error"]');
  }

  async loginAsStandardUser(): Promise<void> {
    await this.login(USERS.standard.username, USERS.standard.password);
  }

  async submitEmpty(): Promise<void> {
    await this.page.locator('[data-test="login-button"]').click();
    await this.page.waitForSelector('[data-test="error"]');
  }

  async getErrorText(): Promise<string> {
    await this.page.waitForSelector('[data-test="error"]');
    return this.page.$eval('[data-test="error"]', (el) => el.textContent?.trim() ?? '');
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return (await this.page.$('[data-test="login-button"]')) !== null;
  }
}

export class InventoryPage {
  constructor(private readonly page: Page) {}

  async waitForLoaded(): Promise<void> {
    await this.page.waitForFunction(() => window.location.href.includes('inventory.html'));
    await this.page.locator('.title').wait();
  }

  async getProductCount(): Promise<number> {
    return this.page.$$eval('.inventory_item', (items) => items.length);
  }

  async addToCart(productName: string): Promise<void> {
    await this.page.evaluate((name) => {
      const item = Array.from(document.querySelectorAll('.inventory_item')).find((el) =>
        el.textContent?.includes(name),
      );
      const button = item?.querySelector('button[data-test*="add-to-cart"]') as HTMLButtonElement | null;
      button?.click();
    }, productName);
    await this.page.waitForSelector('[data-test="shopping-cart-badge"]');
  }

  async removeFromCart(productName: string): Promise<void> {
    await this.page.evaluate((name) => {
      const item = Array.from(document.querySelectorAll('.inventory_item')).find((el) =>
        el.textContent?.includes(name),
      );
      const button = item?.querySelector('button[data-test*="remove"]') as HTMLButtonElement | null;
      button?.click();
    }, productName);
  }

  async hasCartBadge(): Promise<boolean> {
    return (await this.page.$('[data-test="shopping-cart-badge"]')) !== null;
  }

  async getCartBadgeText(): Promise<string> {
    return this.page.$eval('[data-test="shopping-cart-badge"]', (el) => el.textContent?.trim() ?? '');
  }

  async openCart(): Promise<void> {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
    await this.page.waitForFunction(() => window.location.href.includes('cart.html'));
  }

  async sortBy(value: 'az' | 'za'): Promise<void> {
    await this.page.select('[data-test="product-sort-container"]', value);
  }

  async getProductNames(): Promise<string[]> {
    return this.page.$$eval('[data-test$="-title-link"]', (els) =>
      els.map((el) => el.textContent?.trim() ?? ''),
    );
  }

  async logout(): Promise<void> {
    await this.page.locator('#react-burger-menu-btn').click();
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      this.page.locator('#logout_sidebar_link').click(),
    ]);
  }
}

export class CartPage {
  constructor(private readonly page: Page) {}

  async waitForLoaded(): Promise<void> {
    await this.page.waitForFunction(() => window.location.href.includes('cart.html'));
  }

  async hasItem(productName: string): Promise<boolean> {
    return this.page.evaluate((name) => {
      return Array.from(document.querySelectorAll('.cart_item')).some((el) => el.textContent?.includes(name));
    }, productName);
  }

  async removeItem(productName: string): Promise<void> {
    await this.page.evaluate((name) => {
      const item = Array.from(document.querySelectorAll('.cart_item')).find((el) =>
        el.textContent?.includes(name),
      );
      const button = item?.querySelector('button[data-test*="remove"]') as HTMLButtonElement | null;
      button?.click();
    }, productName);
  }

  async continueShopping(): Promise<void> {
    await this.page.locator('[data-test="continue-shopping"]').click();
    await this.page.waitForFunction(() => window.location.href.includes('inventory.html'));
  }

  async checkout(): Promise<void> {
    await this.page.locator('[data-test="checkout"]').click();
    await this.page.waitForFunction(() => window.location.href.includes('checkout-step-one'));
  }
}

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.page.locator('[data-test="firstName"]').fill(firstName);
    await this.page.locator('[data-test="lastName"]').fill(lastName);
    await this.page.locator('[data-test="postalCode"]').fill(postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.page.locator('[data-test="continue"]').click();
  }

  async finishOrder(): Promise<void> {
    await this.page.locator('[data-test="finish"]').click();
    await this.page.waitForFunction(() => window.location.href.includes('checkout-complete'));
  }

  async cancel(): Promise<void> {
    await this.page.locator('[data-test="cancel"]').click();
    await this.page.waitForFunction(() => window.location.href.includes('cart.html'));
  }

  async getErrorText(): Promise<string> {
    await this.page.waitForSelector('[data-test="error"]');
    return this.page.$eval('[data-test="error"]', (el) => el.textContent?.trim() ?? '');
  }

  async isOnCompletePage(): Promise<boolean> {
    return this.page.evaluate(() => window.location.href.includes('checkout-complete'));
  }
}
