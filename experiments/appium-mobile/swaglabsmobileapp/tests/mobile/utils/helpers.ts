export async function hideKeyboardIfShown(): Promise<void> {
  try {
    const shown = await driver.isKeyboardShown();
    if (shown) {
      await driver.hideKeyboard();
    }
  } catch {
    // Keyboard not visible or driver does not support hideKeyboard.
  }
}

export async function waitForAccessibility(
  id: string,
  timeout = 15000,
) {
  const element = await $(`~${id}`);
  await element.waitForDisplayed({ timeout });
  return element;
}

export async function tapAccessibility(id: string): Promise<void> {
  const element = await waitForAccessibility(id);
  await element.click();
}

export async function setAccessibilityValue(id: string, value: string): Promise<void> {
  const element = await waitForAccessibility(id);
  await element.clearValue();
  await element.setValue(value);
}

export async function getAccessibilityText(id: string): Promise<string> {
  const element = await waitForAccessibility(id);
  return element.getText();
}
