import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { blockHeavyAssets } from '../src/helpers/page-helpers.js';
import { LoginPage, InventoryPage } from '../src/pages/saucedemo.pages.js';
import { USERS } from '../src/utils/test-data.js';
import { withPage } from './harness.js';

describe('Login', () => {
  it('logs in with valid credentials', async () => {
    await withPage('login-success', async (page) => {
      const login = new LoginPage(page);
      await login.open();
      await login.loginAsStandardUser();

      const inventory = new InventoryPage(page);
      await inventory.waitForLoaded();
      assert.equal(await inventory.getProductCount(), 6);
    });
  });

  it('shows error for locked out user', async () => {
    await withPage('login-locked-out', async (page) => {
      const login = new LoginPage(page);
      await login.open();
      await login.loginExpectingError(USERS.lockedOut.username, USERS.lockedOut.password);

      const error = await login.getErrorText();
      assert.match(error, /locked out/i);
    });
  });

  it('shows error for invalid credentials', async () => {
    await withPage('login-invalid', async (page) => {
      const login = new LoginPage(page);
      await login.open();
      await login.loginExpectingError('invalid_user', 'wrong_password');

      const error = await login.getErrorText();
      assert.match(error, /do not match any user/i);
    });
  });

  it('requires username and password', async () => {
    await withPage('login-empty', async (page) => {
      const login = new LoginPage(page);
      await login.open();
      await login.submitEmpty();

      const error = await login.getErrorText();
      assert.match(error, /Username is required/i);
    });
  });

  it('loads login page with blocked heavy assets', async () => {
    await withPage('login-interception', async (page) => {
      await blockHeavyAssets(page);
      const login = new LoginPage(page);
      await login.open();
      assert.equal(await login.isLoginButtonVisible(), true);
    });
  });
});
