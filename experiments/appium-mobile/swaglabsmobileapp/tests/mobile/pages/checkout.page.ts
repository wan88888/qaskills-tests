import { scrollToAccessibility } from '../utils/gestures';
import { hideKeyboardIfShown } from '../utils/helpers';
import { CHECKOUT } from '../utils/test-data';
import { BasePage } from './base.page';

type CustomerInfo = typeof CHECKOUT;

export class CheckoutPage extends BasePage {
  async fillCustomerInfo(info: CustomerInfo): Promise<void> {
    await $('~test-Checkout: Your Info').waitForDisplayed({ timeout: 15000 });
    await $('~test-First Name').setValue(info.firstName);
    await $('~test-Last Name').setValue(info.lastName);
    await $('~test-Zip/Postal Code').setValue(info.postalCode);
    await hideKeyboardIfShown();

    const continueButton = await scrollToAccessibility('test-CONTINUE', 3);
    await continueButton.click();
  }

  async finishOrder(): Promise<void> {
    await $('~test-CHECKOUT: OVERVIEW').waitForDisplayed({ timeout: 15000 });
    const finishButton = await scrollToAccessibility('test-FINISH', 4);
    await finishButton.click();
  }

  async expectOrderComplete(): Promise<void> {
    await $('~test-CHECKOUT: COMPLETE!').waitForDisplayed({ timeout: 20000 });
  }

  async backToProducts(): Promise<void> {
    const backHome = await scrollToAccessibility('test-BACK HOME', 3);
    await backHome.click();
  }
}

export const checkoutPage = new CheckoutPage();
