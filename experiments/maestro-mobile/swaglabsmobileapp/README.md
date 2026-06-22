# swaglabsmobileapp

- **Skill**: `maestro-mobile`
- **目标**: swaglabsmobileapp（`com.swaglabsmobileapp`，[sample-app-mobile](https://github.com/saucelabs/sample-app-mobile/releases) v2.7.1）
- **规范**: 声明式 YAML、`test-*` accessibility ID、`runFlow` 子流程、`clearState` 重置

## 前置条件

1. [Maestro CLI](https://maestro.mobile.dev/)（`maestro --version`）
2. Android 真机或模拟器（`adb devices` 可见）
3. 已手动安装 swaglabsmobileapp（包名 `com.swaglabsmobileapp`）

从 [sample-app-mobile Releases](https://github.com/saucelabs/sample-app-mobile/releases) 下载 APK（`Android.SauceLabs.Mobile.Sample.app.2.7.1.apk`）并安装到设备。

## 运行

```bash
npm test               # 核心流程（1 条 flow）
npm run test:all       # 运行 .maestro/ 下全部 flow
npm run studio         # 交互式定位元素
```

环境变量（可选）：

```bash
maestro test .maestro/critical-path.yaml \
  -e USERNAME=standard_user \
  -e PASSWORD=secret_sauce
```

## 覆盖

**1** 条核心流程：登录 → 加购 Backpack → 结账 → 完成订单 → 返回商品页。

| 文件 | 说明 |
|------|------|
| `.maestro/critical-path.yaml` | 主流程 |
| `.maestro/subflows/login.yaml` | 可复用登录子流程 |

## 定位策略

与 [sample-app-mobile](https://github.com/saucelabs/sample-app-mobile) 对齐：

- **表单 / 按钮**：用可见文案（`Username`、`LOGIN`、`CHECKOUT` 等）
- **仅 content-desc 的图标**：用 `tapOn: "test-Cart"`（Maestro 将 Android `contentDescription` 暴露为 text）
- **列表项**：`scrollUntilVisible` + 商品名文案

> Android 上 Maestro 的 `id` 对应 `resource-id`，不是 Appium 的 `test-*` accessibility id。
