export async function swipeUp(): Promise<void> {
  const { width, height } = await driver.getWindowSize();
  const startX = Math.floor(width / 2);
  const startY = Math.floor(height * 0.75);
  const endY = Math.floor(height * 0.25);

  await driver.performActions([
    {
      type: 'pointer',
      id: 'finger',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: startX, y: startY },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 200 },
        { type: 'pointerMove', duration: 600, x: startX, y: endY },
        { type: 'pointerUp', button: 0 },
      ],
    },
  ]);
  await driver.releaseActions();
}

export async function scrollToAccessibility(
  id: string,
  maxSwipes = 5,
) {
  const selector = `~${id}`;
  for (let attempt = 0; attempt <= maxSwipes; attempt += 1) {
    const element = await $(selector);
    if (await element.isDisplayed()) {
      return element;
    }
    await swipeUp();
  }

  const element = await $(selector);
  await element.waitForDisplayed({ timeout: 5000 });
  return element;
}
