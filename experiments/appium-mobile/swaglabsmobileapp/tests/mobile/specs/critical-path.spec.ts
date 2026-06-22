import { cartPage } from '../pages/cart.page';
import { checkoutPage } from '../pages/checkout.page';
import { loginPage } from '../pages/login.page';
import { productsPage } from '../pages/products.page';
import { resetToLoginScreen } from '../utils/app-lifecycle';
import { CHECKOUT, PRODUCTS, USERS } from '../utils/test-data';

describe('Critical path', () => {
  beforeEach(async () => {
    await resetToLoginScreen();
  });

  it('logs in, purchases a product, and completes checkout', async () => {
    await loginPage.expectLoginScreen();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await productsPage.expectCatalogVisible();
    await productsPage.addProductToCart(PRODUCTS.backpack);
    await productsPage.openCart();
    await cartPage.expectCartVisible();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCustomerInfo(CHECKOUT);
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderComplete();
    await checkoutPage.backToProducts();
    await productsPage.expectCatalogVisible();
  });
});
