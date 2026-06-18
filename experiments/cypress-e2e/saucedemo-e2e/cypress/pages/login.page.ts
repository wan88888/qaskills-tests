export class LoginPage {
  get usernameInput() {
    return cy.get('[placeholder="Username"]');
  }

  get passwordInput() {
    return cy.get('[placeholder="Password"]');
  }

  get loginButton() {
    return cy.getByTest('login-button');
  }

  get errorMessage() {
    return cy.getByTest('error');
  }

  visit() {
    cy.visit('/');
    return this;
  }

  fillUsername(username: string) {
    this.usernameInput.clear().type(username);
    return this;
  }

  fillPassword(password: string) {
    this.passwordInput.clear().type(password);
    return this;
  }

  submit() {
    this.loginButton.click();
    return this;
  }

  login(username: string, password: string) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.submit();
    return this;
  }

  assertError(message: string) {
    this.errorMessage.should('be.visible').and('contain.text', message);
    return this;
  }
}

export const loginPage = new LoginPage();
