# saucedemo-e2e

- **Skill**: `playwright-e2e`
- **目标**: 为 https://www.saucedemo.com 编写 Playwright E2E 测试
- **规范**: POM、fixtures、auth storageState、`getByRole` 优先

## 运行

```bash
npm install
npx playwright install chromium
npm test
npm run test:ui      # UI 模式
npm run test:report  # 查看报告
```

## 覆盖

- 登录（4）
- 商品列表（6）
- 购物车（3）
- 结账（3）

共 **17** 个用例，目标站点 `https://www.saucedemo.com`。
