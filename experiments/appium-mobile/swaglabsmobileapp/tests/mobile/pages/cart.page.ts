import { scrollToAccessibility } from '../utils/gestures';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  get screen() {
    return $('~test-Cart Content');
  }

  get checkoutButton() {
    return $('~test-CHECKOUT');
  }

  async expectCartVisible(): Promise<void> {
    await this.screen.waitForDisplayed({ timeout: 15000 });
  }

  async proceedToCheckout(): Promise<void> {
    const button = await scrollToAccessibility('test-CHECKOUT', 4);
    await button.click();
  }
}

export const cartPage = new CartPage();
