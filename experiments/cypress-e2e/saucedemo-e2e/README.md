# saucedemo-e2e (Cypress)

- **Skill**: `cypress-e2e`
- **目标**: 为 https://www.saucedemo.com 编写 Cypress E2E 测试
- **规范**: POM、custom commands、`cy.session()`、`cy.intercept()`、fixtures

## 运行

```bash
npm install
npx cypress install
npm test
npm run test:open    # Cypress UI
npm run test:headed  # 有界面运行
```

## 覆盖

- 登录（5，含 intercept 示例）
- 商品列表（6）
- 购物车（3）
- 结账（3）

共 **17** 个用例。
