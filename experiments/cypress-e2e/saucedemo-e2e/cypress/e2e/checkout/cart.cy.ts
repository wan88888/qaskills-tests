import { cartPage } from '../../pages/cart.page';
import { checkoutPage } from '../../pages/checkout.page';
import { inventoryPage } from '../../pages/inventory.page';

describe('Cart', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      cy.loginAs(users.standard.username, users.standard.password);
    });
    cy.fixture('checkout.json').then(({ products }) => {
      inventoryPage.visit();
      inventoryPage.addProduct(products.backpack);
      inventoryPage.addProduct(products.boltTshirt);
      inventoryPage.openCart();
    });
  });

  it('should display added items in cart', () => {
    cy.fixture('checkout.json').then(({ products }) => {
      cartPage.assertLoaded();
      cartPage.assertItemVisible(products.backpack);
      cartPage.assertItemVisible(products.boltTshirt);
    });
  });

  it('should remove item from cart', () => {
    cy.fixture('checkout.json').then(({ products }) => {
      cartPage.removeItem(products.backpack);
      cartPage.cartItem(products.backpack).should('not.exist');
      cartPage.continueShoppingButton.click();
      inventoryPage.assertLoaded();
      inventoryPage.cartBadge.should('have.text', '1');
    });
  });

  it('should navigate to checkout', () => {
    cartPage.proceedToCheckout();
    checkoutPage.assertStepOne();
  });
});
