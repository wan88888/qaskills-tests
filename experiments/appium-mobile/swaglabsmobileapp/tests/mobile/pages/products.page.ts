import { swipeUp } from '../utils/gestures';
import { BasePage } from './base.page';

export class ProductsPage extends BasePage {
  get screen() {
    return $('~test-PRODUCTS');
  }

  get cartBadge() {
    return $('~test-Cart');
  }

  async expectCatalogVisible(): Promise<void> {
    await this.screen.waitForDisplayed({ timeout: 20000 });
  }

  async addProductToCart(productName: string): Promise<void> {
    const item = await this.findProductItem(productName);
    const addButton = await item.$('~test-ADD TO CART');
    await addButton.waitForDisplayed({ timeout: 10000 });
    await addButton.click();
    await driver.pause(750);
  }

  async openCart(): Promise<void> {
    await this.cartBadge.waitForDisplayed({ timeout: 10000 });
    await this.cartBadge.click();
  }

  private async findProductItem(productName: string) {
    const xpath =
      `//android.widget.TextView[contains(@text,"${productName}")]` +
      `//ancestor::*[@content-desc="test-Item"]`;
    const item = await $(xpath);

    for (let attempt = 0; attempt < 8; attempt += 1) {
      if (await item.isExisting()) {
        await item.waitForDisplayed({ timeout: 5000 });
        return item;
      }
      await swipeUp();
    }

    await item.waitForDisplayed({ timeout: 10000 });
    return item;
  }
}

export const productsPage = new ProductsPage();
