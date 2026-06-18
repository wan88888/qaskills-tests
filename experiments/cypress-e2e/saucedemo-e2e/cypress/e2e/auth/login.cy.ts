import { loginPage } from '../../pages/login.page';

describe('Login', () => {
  beforeEach(() => {
    loginPage.visit();
  });

  it('should login with valid credentials and land on inventory', () => {
    cy.fixture('users.json').then((users) => {
      loginPage.login(users.standard.username, users.standard.password);
      cy.url().should('include', 'inventory.html');
      cy.contains('.title', 'Products').should('be.visible');
    });
  });

  it('should show error for locked out user', () => {
    cy.fixture('users.json').then((users) => {
      loginPage.login(users.lockedOut.username, users.lockedOut.password);
      loginPage.assertError('Sorry, this user has been locked out.');
    });
  });

  it('should show error for invalid credentials', () => {
    cy.fixture('users.json').then((users) => {
      loginPage.login(users.invalid.username, users.invalid.password);
      loginPage.assertError('Username and password do not match any user in this service');
    });
  });

  it('should require username and password', () => {
    loginPage.submit();
    loginPage.assertError('Username is required');
  });

  it('should load login page via network intercept', () => {
    cy.intercept('GET', '/').as('loginPage');
    loginPage.visit();
    cy.wait('@loginPage').its('response.statusCode').should('eq', 200);
    loginPage.usernameInput.should('be.visible');
  });
});
