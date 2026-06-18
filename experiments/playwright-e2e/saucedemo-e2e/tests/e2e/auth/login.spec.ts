import { test } from '../../fixtures/auth.fixture';
import { USERS } from '../../utils/test-data';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should login with valid credentials and land on inventory', async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.expectToBeVisible();
  });

  test('should show error for locked out user', async ({ loginPage }) => {
    await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);
    await loginPage.expectErrorMessage('Sorry, this user has been locked out.');
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    await loginPage.login('invalid_user', 'wrong_password');
    await loginPage.expectErrorMessage(
      'Username and password do not match any user in this service',
    );
  });

  test('should require username and password', async ({ loginPage }) => {
    await loginPage.loginButton.click();
    await loginPage.expectErrorMessage('Username is required');
  });
});
