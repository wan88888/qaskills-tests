/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      getByTest(testId: string): Chainable<JQuery<HTMLElement>>;
      loginAs(username: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('getByTest', (testId: string) => {
  return cy.get(`[data-test="${testId}"]`);
});

Cypress.Commands.add('loginAs', (username: string, password: string) => {
  cy.session([username, password], () => {
    cy.visit('/');
    cy.get('[placeholder="Username"]').clear().type(username);
    cy.get('[placeholder="Password"]').clear().type(password);
    cy.getByTest('login-button').click();
    cy.url().should('include', 'inventory.html');
    cy.contains('.title', 'Products').should('be.visible');
  });
});

export {};
