# saucedemo-e2e (Puppeteer)

- **Skill**: `puppeteer-automation`
- **目标**: 为 https://www.saucedemo.com 编写 Puppeteer E2E 自动化测试
- **规范**: `page.locator()`、显式等待、`finally` 关闭浏览器、请求拦截

## 运行

```bash
npm install
npm test

# 有界面调试
HEADLESS=false npm test
```

## 覆盖

- 登录（5，含资源拦截）
- 商品列表（6）
- 购物车（3）
- 结账（3）

共 **17** 个用例
