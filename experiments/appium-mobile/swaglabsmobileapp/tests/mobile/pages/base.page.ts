import { hideKeyboardIfShown, setAccessibilityValue, tapAccessibility, waitForAccessibility } from '../utils/helpers';

export abstract class BasePage {
  protected async tap(id: string): Promise<void> {
    await tapAccessibility(id);
  }

  protected async type(id: string, value: string): Promise<void> {
    await setAccessibilityValue(id, value);
    await hideKeyboardIfShown();
  }

  protected async isVisible(id: string, timeout = 5000): Promise<boolean> {
    try {
      await waitForAccessibility(id, timeout);
      return true;
    } catch {
      return false;
    }
  }
}
