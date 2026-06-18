# saucedemo-e2e (Selenium Java)

- **Skill**: `selenium-java`
- **目标**: 为 https://www.saucedemo.com 编写 Selenium WebDriver + TestNG E2E 测试
- **规范**: POM、WebDriverWait、WebDriverManager、ThreadLocal Driver、DataProvider

## 运行

```bash
mvn test

# 有界面运行
mvn test -Dheadless=false

# 指定浏览器
mvn test -Dbrowser=firefox
```

## 覆盖

- 登录（4）
- 商品列表（6）
- 购物车（3）
- 结账（3）

共 **16** 个用例
