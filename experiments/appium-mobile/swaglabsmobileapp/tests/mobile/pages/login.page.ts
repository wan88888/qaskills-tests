import { hideKeyboardIfShown } from '../utils/helpers';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  get usernameField() {
    return $('~test-Username');
  }

  get passwordField() {
    return $('~test-Password');
  }

  get loginButton() {
    return $('~test-LOGIN');
  }

  async expectLoginScreen(): Promise<void> {
    await $('~test-Login').waitForDisplayed({ timeout: 20000 });
    await this.usernameField.waitForDisplayed();
    await this.passwordField.waitForDisplayed();
    await this.loginButton.waitForDisplayed();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameField.setValue(username);
    await this.passwordField.setValue(password);
    await hideKeyboardIfShown();
    await this.loginButton.click();
  }
}

export const loginPage = new LoginPage();
