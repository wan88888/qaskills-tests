import puppeteer, { Browser } from 'puppeteer';

export async function launchBrowser(): Promise<Browser> {
  const headless = process.env.HEADLESS !== 'false';

  return puppeteer.launch({
    headless,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1366,768',
    ],
    defaultViewport: { width: 1366, height: 768 },
  });
}
