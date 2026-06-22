import { APP } from '../config/capabilities';

export async function resetToLoginScreen(): Promise<void> {
  await driver.terminateApp(APP.packageName);
  await driver.activateApp(APP.packageName);
  await $('~test-Login').waitForDisplayed({ timeout: 20000 });
}
