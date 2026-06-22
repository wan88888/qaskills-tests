import path from 'node:path';

export const APP = {
  packageName: 'com.swaglabsmobileapp',
  activity: 'com.swaglabsmobileapp.MainActivity',
  version: '2.7.1',
} as const;

export function localAndroidCapabilities(): WebdriverIO.Capabilities {
  const appPath = process.env.ANDROID_APP_PATH;

  const caps: WebdriverIO.Capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.ANDROID_DEVICE_NAME ?? 'Android Device',
    'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION,
    'appium:udid': process.env.ANDROID_UDID,
    'appium:appPackage': APP.packageName,
    'appium:appActivity': APP.activity,
    'appium:appWaitActivity': 'com.swaglabsmobileapp.*',
    'appium:autoGrantPermissions': true,
    'appium:noReset': true,
    'appium:fullReset': false,
    'appium:newCommandTimeout': 300,
    'appium:disableWindowAnimation': true,
  };

  if (appPath) {
    caps['appium:app'] = path.resolve(appPath);
    caps['appium:noReset'] = false;
  }

  return caps;
}

export function sauceAndroidCapabilities(): WebdriverIO.Capabilities {
  return {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:app': 'storage:filename=Android.SauceLabs.Mobile.Sample.app.2.7.1.apk',
    'appium:deviceName': process.env.SAUCE_DEVICE_NAME ?? 'Google Pixel.*',
    'appium:platformVersion': process.env.SAUCE_PLATFORM_VERSION ?? '13',
    'appium:autoGrantPermissions': true,
    'appium:appWaitActivity': 'com.swaglabsmobileapp.*',
    'sauce:options': {
      build: process.env.SAUCE_BUILD ?? 'qaskills-swaglabsmobileapp',
      name: process.env.SAUCE_TEST_NAME ?? 'swaglabsmobileapp E2E',
      appiumVersion: 'latest',
    },
  };
}
