export class CartPage {
  get pageTitle() {
    return cy.contains('.title', 'Your Cart');
  }

  get checkoutButton() {
    return cy.getByTest('checkout');
  }

  get continueShoppingButton() {
    return cy.getByTest('continue-shopping');
  }

  assertLoaded() {
    cy.url().should('include', 'cart.html');
    this.pageTitle.should('be.visible');
    return this;
  }

  cartItem(productName: string) {
    return cy.contains('.cart_item', productName);
  }

  assertItemVisible(productName: string) {
    this.cartItem(productName).should('be.visible');
    return this;
  }

  removeItem(productName: string) {
    this.cartItem(productName).contains('button', 'Remove').click();
    return this;
  }

  proceedToCheckout() {
    this.checkoutButton.click();
    return this;
  }
}

export const cartPage = new CartPage();
