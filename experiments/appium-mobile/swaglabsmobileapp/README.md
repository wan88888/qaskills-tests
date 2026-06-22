# swaglabsmobileapp

- **Skill**: `appium-mobile`
- **目标**: swaglabsmobileapp（`com.swaglabsmobileapp`，[sample-app-mobile](https://github.com/saucelabs/sample-app-mobile/releases) v2.7.1）
- **规范**: WebdriverIO + Appium 2、POM、`test-*` accessibility ID、显式等待

## 前置条件

1. **Node.js** 18+
2. **Java JDK** 11+（`JAVA_HOME` 已配置）
3. **Android SDK**（`ANDROID_HOME` 指向 SDK 目录）
4. **Appium 2** 与 **UiAutomator2** 驱动
5. Android 真机或模拟器（`adb devices` 可见）
6. 已手动安装 swaglabsmobileapp（包名 `com.swaglabsmobileapp`）

可选：Sauce Labs 云设备（`SAUCE_USERNAME`、`SAUCE_ACCESS_KEY`）

## 安装与准备

从 [sample-app-mobile Releases](https://github.com/saucelabs/sample-app-mobile/releases) 下载 APK（`Android.SauceLabs.Mobile.Sample.app.2.7.1.apk`），自行安装到设备后：

```bash
npm install
adb devices    # 确认设备在线
adb shell pm list packages | grep swaglabsmobileapp   # 确认已安装
```

环境变量（可选）：

| 变量 | 说明 |
|------|------|
| `ANDROID_UDID` | 设备 ID（`adb devices` 第一列） |
| `ANDROID_PLATFORM_VERSION` | 系统版本，如 `12` |
| `ANDROID_APP_PATH` | 本地 APK 路径；设置后由 Appium 安装，而非使用已安装 App |
| `SAUCE_USERNAME` / `SAUCE_ACCESS_KEY` | Sauce Labs 云跑 |

## 运行

```bash
ANDROID_UDID=<device-id> ANDROID_PLATFORM_VERSION=12 npm test
npm run test:sauce    # Sauce Labs 云
```

失败时截图保存在 `screenshots/`。

## 覆盖

**1** 个核心流程用例：登录 → 加购 → 结账 → 完成订单 → 返回商品页。

## 测试账号

| 用户 | 密码 |
|------|------|
| `standard_user` | `secret_sauce` |

## 定位策略

与 [sample-app-mobile](https://github.com/saucelabs/sample-app-mobile) 一致，使用 `test-{label}` 形式的 accessibility ID，例如：

- `test-Username` / `test-Password` / `test-LOGIN`
- `test-PRODUCTS` / `test-Item` / `test-ADD TO CART` / `test-Cart`
- `test-CHECKOUT` / `test-CONTINUE` / `test-FINISH` / `test-BACK HOME`
