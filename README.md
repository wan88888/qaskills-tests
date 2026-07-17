# QA Skills 试验场

本仓库用于验证 [@qaskills/cli](https://qaskills.sh) 安装的各个 skill 是否好用。

## 目录约定

```
qaskills-tests/
├── .cursor/rules/          # 已安装的 skill（qaskills add 产物，全仓库共享）
├── experiments/            # 每次 skill 验证任务（代码 + 测试产物）
│   ├── _template/          # 新建试验的说明模板
│   └── <skill-name>/       # 按 skill 分目录
│       └── <task-name>/    # 按具体任务再分子目录
└── README.md
```

| 位置 | 放什么 | 示例 |
|------|--------|------|
| `.cursor/rules/` | skill 定义文件（`SKILL.md`） | `playwright-e2e/SKILL.md` |
| `experiments/<skill>/<task>/` | 该次验证的代码、配置、运行结果 | `experiments/playwright-e2e/saucedemo-e2e/` |

**原则：skill 定义和试验产物分开，每个任务一个独立目录，互不污染。**

## 新建一次 skill 验证

```bash
# 1. 安装 skill（若尚未安装）
npx @qaskills/cli add <skill-name> --agent cursor

# 2. 创建任务目录
mkdir -p experiments/<skill-name>/<task-name>
cd experiments/<skill-name>/<task-name>

# 3. 在 Cursor 中指定 skill 完成任务，产物只写在这个目录里
# 例：「用 playwright-e2e skill，在 experiments/playwright-e2e/saucedemo-e2e 下编写测试」
```

## 共用测试目标

多个试验复用同一被测对象，便于横向对比框架与 skill：

| 目标 | 用途 | 相关试验 |
|------|------|----------|
| [saucedemo.com](https://www.saucedemo.com) | Web E2E 多框架对比 | Playwright、Cypress、Selenium、Puppeteer |
| [JSONPlaceholder](https://jsonplaceholder.typicode.com) | API 测试 + 列表接口压测 | Playwright API、REST Assured、Postman、k6、JMeter |
| [esimnum.com](https://esimnum.com/) | 可访问性 / 性能 / 安全审计链 | axe、Lighthouse、OWASP、Bug 报告 |
| **swaglabsmobileapp**（`com.swaglabsmobileapp`） | 移动端核心流程 E2E | Appium、Maestro |

**移动端共用前置条件：** 设备 `adb devices` 可见，且已从 [sample-app-mobile Releases](https://github.com/saucelabs/sample-app-mobile/releases) 手动安装 APK（`Android.SauceLabs.Mobile.Sample.app.2.7.1.apk`）。详情见各移动试验目录 README。

## 已有试验

按类型分组；目录链接见下方 [Prompt 记录](#skill-验证-prompt-记录)。

### Web E2E（saucedemo.com）

| Skill | 任务 | 说明 |
|-------|------|------|
| `playwright-e2e` | saucedemo-e2e | 全链路 E2E（17 用例） |
| `cypress-e2e` | saucedemo-e2e | 全链路 E2E（17 用例） |
| `selenium-java` | saucedemo-e2e | Selenium Java（16 用例） |
| `puppeteer-automation` | saucedemo-e2e | Puppeteer E2E（17 用例） |

### API（JSONPlaceholder）

| Skill | 任务 | 说明 |
|-------|------|------|
| `playwright-api` | jsonplaceholder-api | 核心 API（29 用例） |
| `restassured-api-framework` | jsonplaceholder-api | REST Assured（24 用例） |
| `postman-api` | jsonplaceholder-api | Postman / Newman（30 请求） |

### 移动（swaglabsmobileapp）

| Skill | 任务 | 说明 |
|-------|------|------|
| `appium-mobile` | swaglabsmobileapp | 核心流程 E2E（1 用例） |
| `maestro-mobile` | swaglabsmobileapp | 核心流程 Maestro flow（1 条） |

### 质量审计（esimnum.com）

| Skill | 任务 | 说明 |
|-------|------|------|
| `seo` (claude-seo) | esimnum-audit | eSIMNum 全站 SEO 审计（Health 71） → [experiments/seo/esimnum-audit](./experiments/seo/esimnum-audit/) |
| `axe-accessibility` | esimnum-a11y | WCAG 2.1 AA、键盘导航、Cookie 弹窗、子页面 |
| `lighthouse-performance` | esimnum-audit | Performance / A11y / SEO（桌面 + 移动） |
| `owasp-security` | esimnum-security | OWASP Top 10 被动扫描 |
| `bug-report-writing` | esimnum-bug-report | 综合 Bug 报告（15 条） → [BUG-REPORT.md](./experiments/bug-report-writing/esimnum-bug-report/BUG-REPORT.md) |

### 性能（JSONPlaceholder）

| Skill | 任务 | 说明 |
|-------|------|------|
| `k6-performance` | jsonplaceholder-api | 6 类资源列表接口（smoke / load / stress） |
| `jmeter-load` | jsonplaceholder-api | 6 类资源列表接口（JMeter smoke / load） |

## Skill 验证 Prompt 记录

在 Cursor 中调用 skill 时使用的**原始 Prompt**（仅记录首次发起 skill 的指令）。每次新试验完成后，将 Prompt **追加**到本列表。**目录链接集中在此表，避免与上方试验表重复。**

| # | Prompt | 产物目录 |
|---|--------|----------|
| 1 | 使用 playwright-e2e skill，为 https://www.saucedemo.com 网站编写 e2e 测试 | [experiments/playwright-e2e/saucedemo-e2e](./experiments/playwright-e2e/saucedemo-e2e/) |
| 2 | 使用 cypress-e2e skill，为 https://www.saucedemo.com 网站编写 e2e 测试 | [experiments/cypress-e2e/saucedemo-e2e](./experiments/cypress-e2e/saucedemo-e2e/) |
| 3 | 使用 playwright-api skill，为 JSONPlaceholder 核心接口编写 api 测试 | [experiments/playwright-api/jsonplaceholder-api](./experiments/playwright-api/jsonplaceholder-api/) |
| 4 | 使用 restassured-api-framework skill，为 JSONPlaceholder 核心接口编写 api 测试 | [experiments/restassured-api-framework/jsonplaceholder-api](./experiments/restassured-api-framework/jsonplaceholder-api/) |
| 5 | 使用 selenium-java skill，为 https://www.saucedemo.com 网站编写 e2e 测试 | [experiments/selenium-java/saucedemo-e2e](./experiments/selenium-java/saucedemo-e2e/) |
| 6 | 使用 postman-api skill，为 JSONPlaceholder 核心接口编写 api 测试 | [experiments/postman-api/jsonplaceholder-api](./experiments/postman-api/jsonplaceholder-api/) |
| 7 | 使用 puppeteer-automation skill，为 https://www.saucedemo.com 网站编写 e2e 测试 | [experiments/puppeteer-automation/saucedemo-e2e](./experiments/puppeteer-automation/saucedemo-e2e/) |
| 8 | 使用 axe-accessibility skill，检查 https://esimnum.com/ 网站的可访问性 | [experiments/axe-accessibility/esimnum-a11y](./experiments/axe-accessibility/esimnum-a11y/) |
| 9 | 使用 lighthouse-performance skill，对 https://esimnum.com/ 进行测试 | [experiments/lighthouse-performance/esimnum-audit](./experiments/lighthouse-performance/esimnum-audit/) |
| 10 | （续 #8）可以的 — 补充键盘导航测试、Cookie 弹窗专项扫描，并对 `/destinations`、`/help` 页面做同样检测 | [experiments/axe-accessibility/esimnum-a11y](./experiments/axe-accessibility/esimnum-a11y/) |
| 11 | 使用 owasp-security skill，对 https://esimnum.com/ 进行安全测试 | [experiments/owasp-security/esimnum-security](./experiments/owasp-security/esimnum-security/) |
| 12 | 使用 bug-report-writing skill，把之前 https://esimnum.com/ 网站可访问性测试、Lighthouse 测试、安全测试发现的问题整理成 1 份 Bug 报告 | [experiments/bug-report-writing/esimnum-bug-report](./experiments/bug-report-writing/esimnum-bug-report/) |
| 13 | 使用 k6-performance skill，对 JSONPlaceholder 核心接口进行性能测试 | [experiments/k6-performance/jsonplaceholder-api](./experiments/k6-performance/jsonplaceholder-api/) |
| 14 | 使用 jmeter-load skill，对 JSONPlaceholder 核心接口进行性能测试 | [experiments/jmeter-load/jsonplaceholder-api](./experiments/jmeter-load/jsonplaceholder-api/) |
| 15 | 使用 appium-mobile skill，为 swaglabsmobileapp 编写 E2E 测试 | [experiments/appium-mobile/swaglabsmobileapp](./experiments/appium-mobile/swaglabsmobileapp/) |
| 16 | 使用 maestro-mobile skill，为 swaglabsmobileapp 编写 E2E 测试 | [experiments/maestro-mobile/swaglabsmobileapp](./experiments/maestro-mobile/swaglabsmobileapp/) |
| 17 | 使用 seo skill 审计 https://esimnum.com/ | [experiments/seo/esimnum-audit](./experiments/seo/esimnum-audit/) |

**推荐 Prompt 模板（复制后改 skill 名、目标、目录）：**

```
使用 <skill-name> skill，为 <目标> 编写 <测试类型>，产物放在 experiments/<skill-name>/<task-name>/
```

示例：

```
使用 k6-performance skill，为 https://example.com 登录接口编写压测脚本，产物放在 experiments/k6-performance/login-load/
```

## 运行某个试验

进入对应任务目录，**以该目录 README 为准**。常见类型示例：

**Web E2E（Node + Playwright）**

```bash
cd experiments/playwright-e2e/saucedemo-e2e
npm install && npx playwright install chromium && npm test
```

**Web E2E（Java + Selenium）**

```bash
cd experiments/selenium-java/saucedemo-e2e
mvn test
```

**API（Postman / Newman）**

```bash
cd experiments/postman-api/jsonplaceholder-api
npm install && npm test
```

**性能（k6）**

```bash
cd experiments/k6-performance/jsonplaceholder-api
npm run smoke    # 或 load / stress
```

**移动（Appium，需已安装 swaglabsmobileapp）**

```bash
cd experiments/appium-mobile/swaglabsmobileapp
npm install
ANDROID_UDID=<device-id> ANDROID_PLATFORM_VERSION=12 npm test
```

**移动（Maestro，需已安装 swaglabsmobileapp）**

```bash
cd experiments/maestro-mobile/swaglabsmobileapp
npm test
```

**质量审计（axe / Lighthouse / OWASP）**

```bash
cd experiments/axe-accessibility/esimnum-a11y   # 或 lighthouse-performance / owasp-security
# 见各目录 README 中的审计命令
```
