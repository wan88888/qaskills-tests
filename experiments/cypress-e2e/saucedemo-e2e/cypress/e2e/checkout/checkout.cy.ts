import { cartPage } from '../../pages/cart.page';
import { checkoutPage } from '../../pages/checkout.page';
import { inventoryPage } from '../../pages/inventory.page';

describe('Checkout', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      cy.loginAs(users.standard.username, users.standard.password);
    });
    cy.fixture('checkout.json').then(({ products }) => {
      inventoryPage.visit();
      inventoryPage.addProduct(products.backpack);
      inventoryPage.openCart();
      cartPage.proceedToCheckout();
    });
  });

  it('should complete checkout with valid customer info', () => {
    cy.fixture('checkout.json').then(({ customer, products }) => {
      checkoutPage.assertStepOne();
      checkoutPage.fillCustomerInfo(
        customer.firstName,
        customer.lastName,
        customer.postalCode,
      );
      checkoutPage.continueToOverview();
      checkoutPage.assertOverview();
      cy.contains(products.backpack).should('be.visible');
      checkoutPage.completeOrder();
      checkoutPage.assertComplete();
      cy.contains('Back Home').should('be.visible');
    });
  });

  it('should require customer information on step one', () => {
    checkoutPage.continueButton.click();
    cy.contains('Error: First Name is required').should('be.visible');
  });

  it('should cancel checkout and return to cart', () => {
    cy.fixture('checkout.json').then(({ products }) => {
      checkoutPage.cancelButton.click();
      cartPage.assertLoaded();
      cartPage.assertItemVisible(products.backpack);
    });
  });
});
