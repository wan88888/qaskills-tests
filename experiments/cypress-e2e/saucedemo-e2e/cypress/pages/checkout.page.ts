export class CheckoutPage {
  get firstNameInput() {
    return cy.getByTest('firstName');
  }

  get lastNameInput() {
    return cy.getByTest('lastName');
  }

  get postalCodeInput() {
    return cy.getByTest('postalCode');
  }

  get continueButton() {
    return cy.getByTest('continue');
  }

  get finishButton() {
    return cy.getByTest('finish');
  }

  get cancelButton() {
    return cy.getByTest('cancel');
  }

  get subtotalLabel() {
    return cy.get('.summary_subtotal_label');
  }

  get taxLabel() {
    return cy.get('.summary_tax_label');
  }

  get totalLabel() {
    return cy.get('.summary_total_label');
  }

  fillCustomerInfo(firstName: string, lastName: string, postalCode: string) {
    this.firstNameInput.clear().type(firstName);
    this.lastNameInput.clear().type(lastName);
    this.postalCodeInput.clear().type(postalCode);
    return this;
  }

  continueToOverview() {
    this.continueButton.click();
    return this;
  }

  completeOrder() {
    this.finishButton.click();
    return this;
  }

  assertStepOne() {
    cy.url().should('include', 'checkout-step-one.html');
    this.firstNameInput.should('be.visible');
    return this;
  }

  assertOverview() {
    cy.url().should('include', 'checkout-step-two.html');
    this.subtotalLabel.should('be.visible');
    this.taxLabel.should('be.visible');
    this.totalLabel.should('be.visible');
    return this;
  }

  assertComplete() {
    cy.url().should('include', 'checkout-complete.html');
    cy.contains('Thank you for your order!').should('be.visible');
    return this;
  }
}

export const checkoutPage = new CheckoutPage();
