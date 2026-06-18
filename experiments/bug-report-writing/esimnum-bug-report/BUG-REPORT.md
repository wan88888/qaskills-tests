# Bug Report: eSIMNum (https://esimnum.com/)

**Report ID:** ESIMNUM-QA-2026-06-18  
**Author:** QA Skills 试验场（bug-report-writing skill）  
**Report Date:** 2026-06-18  
**Document Type:** 综合缺陷报告（含 15 条独立缺陷，每条可单独拆票）

---

## Shared Environment

以下环境信息适用于本报告全部缺陷（除非某条另有说明）：

- **Application:** eSIMNum 官网
- **URL:** https://esimnum.com/
- **Environment:** Production
- **Browser/Device:** Chrome（Playwright 自动化）/ Lighthouse CLI
- **OS:** macOS（测试执行环境）
- **Screen Resolution:** Desktop 1350×940 · Mobile 375×667
- **User Role:** 匿名访客（未登录）
- **Test Sources:**
  - 可访问性：axe-core + Playwright → `experiments/axe-accessibility/esimnum-a11y/`
  - 性能/SEO：Google Lighthouse 12 → `experiments/lighthouse-performance/esimnum-audit/`
  - 安全：OWASP Top 10 被动扫描 → `experiments/owasp-security/esimnum-security/`

---

## Triage Summary

| Bug ID | Title | Severity | Priority | Source | Frequency |
|--------|-------|----------|----------|--------|-----------|
| BUG-001 | Cookie: Preference Center toggles missing accessible labels | Critical | P0 | axe | 100% |
| BUG-002 | UI: Brand orange buttons fail WCAG color contrast | High | P1 | axe · Lighthouse | 100% |
| BUG-003 | UI: Brand green links fail WCAG color contrast | Medium | P1 | axe · Lighthouse | 100% |
| BUG-004 | Testimonials: Horizontal scroll region not keyboard accessible | Medium | P1 | axe | 100% |
| BUG-005 | Header: Language selector accessible name mismatch | Medium | P2 | Lighthouse | 100% |
| BUG-006 | Header: Destination search input missing accessible name | Medium | P2 | axe | 100% |
| BUG-007 | Hero: App Store / Google Play links missing accessible names | Medium | P2 | axe | 100% |
| BUG-008 | Security: Missing Content-Security-Policy response header | Medium | P1 | OWASP | 100% |
| BUG-009 | Security: Missing clickjacking protection headers | Medium | P1 | OWASP | 100% |
| BUG-010 | Security: Missing X-Content-Type-Options nosniff | Medium | P1 | OWASP | 100% |
| BUG-011 | Security: Missing Referrer-Policy response header | Low | P2 | OWASP | 100% |
| BUG-012 | Auth: No rate limiting observed on sign-in endpoint | Medium | P1 | OWASP | 100% |
| BUG-013 | Performance: Mobile images not sized for viewport | Low | P2 | Lighthouse | 100% |
| BUG-014 | Performance: Mobile Time to Interactive excessively high | Low | P3 | Lighthouse | 100% |
| BUG-015 | A11y: Additional color contrast checks require manual review | Low | P3 | axe | N/A |

**Recommended fix order:** BUG-001 → BUG-002/008–010/012 → BUG-003/004 → BUG-005–007 → BUG-011/013 → BUG-014/015

---

## BUG-001

### Title
Cookie: Preference Center toggles missing accessible labels

### Environment
- **URL:** https://esimnum.com/
- **Precondition:** 首次访问或已清除 Cookie；Cookie 弹窗可见
- **Browser/Device:** Chrome (Playwright)

### Severity
Critical

### Priority
P0

### Steps to Reproduce
1. 打开 https://esimnum.com/（无痕模式或清除站点 Cookie）
2. 等待底部 Cookie 同意弹窗出现（标题 "We use cookies"）
3. 点击 **Customize** 打开 Preference Center
4. 使用屏幕阅读器（VoiceOver/NVDA）或 axe DevTools 检查 **Functional** / **Marketing** Cookies 开关
5. 尝试 Tab 聚焦至 `#cookie-functional` 与 `#cookie-marketing`

### Expected Result
每个 checkbox 通过 `<label for="...">`、`aria-label` 或 `aria-labelledby` 提供可访问名称；屏幕阅读器朗读出开关用途（如 "Functional cookies"）。

### Actual Result
两个 checkbox 均无可访问名称：

| Element | Selector |
|---------|----------|
| Functional Cookies toggle | `#cookie-functional` |
| Marketing Cookies toggle | `#cookie-marketing` |

axe 规则 `label` 报 **Critical** 违规。

### Impact
依赖屏幕阅读器的用户无法理解 Cookie 偏好开关含义，无法知情同意；可能违反 GDPR/ePrivacy 可访问性合规要求。

### Workaround
无可靠用户侧变通；需开发修复 markup。

### Attachments
- `experiments/axe-accessibility/esimnum-a11y/test-results/cookie-preference-center-a11y-report.json`
- Rule reference: https://dequeuniversity.com/rules/axe/4.11/label

### Additional Context
- 复现率：100%
- Strictly Necessary 开关为 "Always On"，未测及；Functional/Marketing 为问题焦点
- 与 BUG-002 中 Cookie 按钮对比度问题独立，需分别修复

---

## BUG-002

### Title
UI: Brand orange buttons fail WCAG color contrast

### Environment
- **URLs:** `/` · `/help` · Cookie 弹窗 · Preference Center
- **Colors:** 前景 `#ffffff` · 背景 `#ff6b35` · 对比度 **2.83:1**（要求 ≥ 4.5:1）

### Severity
High

### Priority
P1

### Steps to Reproduce
1. 打开 https://esimnum.com/
2. 打开 Chrome DevTools → Lighthouse → Accessibility audit，或运行 `cd experiments/axe-accessibility/esimnum-a11y && npm run scan`
3. 检查以下元素的文字与背景对比度

### Expected Result
所有按钮/CTA 文字与背景对比度 ≥ 4.5:1（WCAG 2.1 AA）。

### Actual Result
以下元素对比度为 **2.83:1**，未达标：

| Page | Label | Selector |
|------|-------|----------|
| Header | Shop Plans | `a.btn.btn-primary.btn-header` |
| Homepage | See all 200+ destinations → | `.benefit-button` |
| Homepage | Get started now | `.action-button` |
| Homepage | Visit Help Center | `.faq-support-button` |
| Help | Contact Support | `.help-card-button-support` |
| Help | View All Destinations | `.help-card-button-travel` |
| Cookie banner | Accept all | `.cookie-btn-primary` |
| Preference Center | Confirm Selection | `.cookie-modal-btn-primary` |

Lighthouse Accessibility 扣分项：`color-contrast`（桌面/移动 A11y 96/100）。

### Impact
低视力用户对全站主 CTA、帮助入口及 Cookie 流程按钮难以辨认；影响转化与合规。

### Workaround
用户使用浏览器缩放或高对比度模式可能部分缓解，非产品级解决方案。

### Attachments
- `experiments/axe-accessibility/esimnum-a11y/test-results/homepage-a11y-report.json`
- `experiments/axe-accessibility/esimnum-a11y/test-results/help-a11y-report.json`
- `experiments/lighthouse-performance/esimnum-audit/reports/combined-summary.json`

### Additional Context
- 复现率：100%
- 建议从 Design Token 层统一调整 `#ff6b35` 在按钮场景的使用（加深背景或改用深色文字）
- `/destinations` 页面 axe 扫描零违规，但全站按钮色需统一治理

---

## BUG-003

### Title
UI: Brand green links fail WCAG color contrast

### Environment
- **Colors:** 前景 `#009387` · 背景 `#ffffff` · 对比度 **3.8:1**（要求 ≥ 4.5:1）
- Cookie Policy 链接为橙色 `#ff6b35`，对比度 2.83:1（同 BUG-002 色系）

### Severity
Medium

### Priority
P1

### Steps to Reproduce
1. 打开 https://esimnum.com/
2. 定位 "See all 200+ destinations →" 链接（`.home-section-link`、`.section-link`）
3. 首次访问时在 Cookie 弹窗中检查 **Cookie Policy** 链接
4. 用 DevTools 或 axe 验证对比度

### Expected Result
链接文字对比度 ≥ 4.5:1。

### Actual Result
- 绿色链接 `#009387` / 白底：**3.8:1**
- Cookie Policy 橙字 / 白底：**2.83:1**

### Impact
次要导航链接与法律文档链接对低视力用户可读性不足。

### Workaround
用户可通过浏览器强制颜色/缩放改善，非正式方案。

### Attachments
- `experiments/axe-accessibility/esimnum-a11y/test-results/homepage-a11y-report.json`
- `experiments/lighthouse-performance/esimnum-audit/reports/esimnum-desktop.json`（audit: `color-contrast`）

### Additional Context
- 建议链接色加深至约 `#007A70` 及以上
- 与 BUG-002 可同一 Epic 处理，但验收需分 selector 验证

---

## BUG-004

### Title
Testimonials: Horizontal scroll region not keyboard accessible

### Environment
- **URL:** https://esimnum.com/（首页 Testimonials 区块）
- **Browser:** Safari 影响最大；axe 规则 `scrollable-region-focusable`

### Severity
Medium

### Priority
P1

### Steps to Reproduce
1. 打开 https://esimnum.com/
2. 关闭 Cookie 弹窗（Accept all）
3. 滚动至 "What travelers say about eSIM Num"
4. **仅使用键盘** Tab 键，尝试浏览横向滚动区域中的全部评价卡片
5. 在 Safari 中重复步骤 4

### Expected Result
用户可通过 Tab 聚焦滚动容器并操作滚动，或通过可见 prev/next 控件访问全部内容。

### Actual Result
`.testimonials-grid` 含溢出内容，但容器不可聚焦，内部无可聚焦子元素；键盘用户无法访问屏幕外评价。

### Impact
键盘-only 及 Safari 辅助技术用户无法阅读完整用户评价内容。

### Workaround
用户使用鼠标/触摸滑动可访问内容，键盘用户无等价路径。

### Attachments
- `experiments/axe-accessibility/esimnum-a11y/test-results/homepage-a11y-report.json`（rule: `scrollable-region-focusable`）

### Additional Context
- 复现率：100%
- 修复示例：`tabindex="0"` + `role="region"` + `aria-label`，或增加箭头导航按钮

---

## BUG-005

### Title
Header: Language selector accessible name mismatch

### Environment
- **URL:** https://esimnum.com/
- **Element:** `button.language-selector-trigger`

### Severity
Medium

### Priority
P2

### Steps to Reproduce
1. 打开 https://esimnum.com/
2. 检查 Header 语言按钮：可见文字为 **English**
3. 查看 DOM：`aria-label="Language menu"`，`aria-expanded="false"`
4. 用屏幕阅读器聚焦该按钮

### Expected Result
可访问名称与可见标签一致或包含可见文本，如 "Language: English"。

### Actual Result
屏幕阅读器朗读 "Language menu"，与可见 "English" 不一致。Lighthouse 审计 `label-content-name-mismatch` 失败。

### Impact
屏幕阅读器用户无法从朗读中得知当前所选语言，增加导航认知负担。

### Workaround
视觉用户不受影响；辅助技术用户需额外探索子菜单。

### Attachments
- `experiments/lighthouse-performance/esimnum-audit/reports/esimnum-desktop.json`（audit: `label-content-name-mismatch`）

### Additional Context
- 复现率：100%（桌面 Header）
- 建议：`aria-label="Language: English"` 或 `aria-labelledby` 指向含 "English" 的节点

---

## BUG-006

### Title
Header: Destination search input missing accessible name

### Environment
- **URL:** https://esimnum.com/
- **Element:** `input` placeholder="where do you need an eSIM?"

### Severity
Medium

### Priority
P2

### Steps to Reproduce
1. 打开 https://esimnum.com/
2. 关闭 Cookie 弹窗
3. Tab 至 Header 搜索输入框
4. 用 VoiceOver/NVDA 听读焦点元素名称
5. 查看 `experiments/axe-accessibility/esimnum-a11y/test-results/homepage-tab-stops.json` 中 input 条目

### Expected Result
输入框有可见 `<label>` 或 `aria-label`；屏幕阅读器能读出字段用途。

### Actual Result
Tab 停点 `name` 为空；仅有 placeholder，不符合 WCAG 对可访问名称的要求（placeholder 不能替代 label）。

### Impact
屏幕阅读器用户 Tab 至搜索框时不知道字段用途。

### Workaround
移动端菜单内有 "Search eSIM cards for 200+ countries" 按钮，但桌面 Header 搜索框仍缺 label。

### Attachments
- `experiments/axe-accessibility/esimnum-a11y/test-results/homepage-tab-stops.json`

### Additional Context
- 键盘可达、可输入（已验证可 fill "Japan"）
- 缺的是可访问**名称**，非键盘可达性

---

## BUG-007

### Title
Hero: App Store / Google Play links missing accessible names

### Environment
- **URL:** https://esimnum.com/（Hero 下载区）

### Severity
Medium

### Priority
P2

### Steps to Reproduce
1. 打开 https://esimnum.com/
2. Tab 至 App Store 与 Google Play 下载链接
3. 观察 Tab 停点名称（见 `homepage-tab-stops.json`）
4. 用屏幕阅读器聚焦链接

### Expected Result
图标链接具备描述性 `aria-label`，如 "Download on the App Store"。

### Actual Result
链接 `name` 为空；图标无有效 alt/aria-label，屏幕阅读器无法描述链接目标。

### Impact
辅助技术用户无法识别应用下载入口。

### Workaround
用户可通过页面其他文本推断，但链接本身不可访问。

### Attachments
- `experiments/axe-accessibility/esimnum-a11y/test-results/homepage-tab-stops.json`（href 存在但 name 为空的两条 `<a>`）

### Additional Context
- App Store URL: `apps.apple.com/.../esimnum-esim-card-travel-wifi/...`
- Google Play URL: `play.google.com/store/apps/details?id=com.esim.free...`

---

## BUG-008

### Title
Security: Missing Content-Security-Policy response header

### Environment
- **URL:** https://esimnum.com/（全站 HTTP 响应）
- **Detection:** `curl -sI https://esimnum.com/`

### Severity
Medium

### Priority
P1

### Steps to Reproduce
1. 执行：`curl -sI https://esimnum.com/ | grep -i content-security-policy`
2. 或运行：`cd experiments/owasp-security/esimnum-security && npm run scan`
3. 检查响应头

### Expected Result
响应包含 `Content-Security-Policy`，限制脚本/样式/框架来源，降低 XSS 影响面。

### Actual Result
无 `Content-Security-Policy` 头。OWASP A05 Security Misconfiguration 检出。

### Impact
若发生 XSS，缺少 CSP 作为纵深防御层，攻击面扩大。

### Workaround
无终端用户变通；依赖 WAF/CDN 其他规则（如有）。

### Attachments
- `experiments/owasp-security/esimnum-security/test-results/security-report.json`
- `experiments/owasp-security/esimnum-security/test-results/security-report.md`

### Additional Context
- 复现率：100%
- CSP 需根据 Analytics、Live Chat 等第三方脚本逐步收紧，非一次性 copy-paste

---

## BUG-009

### Title
Security: Missing clickjacking protection headers

### Environment
- **URL:** https://esimnum.com/

### Severity
Medium

### Priority
P1

### Steps to Reproduce
1. `curl -sI https://esimnum.com/ | grep -iE 'x-frame-options|content-security-policy'`
2. 确认无 `X-Frame-Options` 且 CSP 无 `frame-ancestors`

### Expected Result
`X-Frame-Options: DENY` 或 CSP `frame-ancestors 'none'` / `'self'`。

### Actual Result
两者均缺失；页面可被第三方 iframe 嵌入（点击劫持风险）。

### Impact
恶意站点可将 eSIMNum 嵌入 iframe 实施 UI 覆盖/点击劫持攻击。

### Workaround
无。

### Attachments
- `experiments/owasp-security/esimnum-security/test-results/security-report.json`

### Additional Context
- 与 BUG-008 可在 CDN 层同一配置变更中处理

---

## BUG-010

### Title
Security: Missing X-Content-Type-Options nosniff

### Environment
- **URL:** https://esimnum.com/

### Severity
Medium

### Priority
P1

### Steps to Reproduce
1. `curl -sI https://esimnum.com/ | grep -i x-content-type-options`
2. 返回为空

### Expected Result
`X-Content-Type-Options: nosniff`

### Actual Result
响应未设置该头，浏览器可能对 MIME 类型进行嗅探。

### Impact
在某些场景下增加 MIME 混淆类攻击风险。

### Workaround
无。

### Attachments
- `experiments/owasp-security/esimnum-security/test-results/security-report.json`

### Additional Context
- 与 BUG-008/009 建议同一 DevOps 变更批次添加安全响应头

---

## BUG-011

### Title
Security: Missing Referrer-Policy response header

### Environment
- **URL:** https://esimnum.com/

### Severity
Low

### Priority
P2

### Steps to Reproduce
1. `curl -sI https://esimnum.com/ | grep -i referrer-policy`
2. 返回为空

### Expected Result
例如 `Referrer-Policy: strict-origin-when-cross-origin`

### Actual Result
未配置 Referrer-Policy，Referrer 泄露策略依赖浏览器默认行为。

### Impact
跨站导航时可能泄露完整 URL 路径（含 query 参数）至第三方。

### Workaround
无。

### Attachments
- `experiments/owasp-security/esimnum-security/test-results/security-report.json`

### Additional Context
- 优先级低于 CSP/XFO/nosniff，但实现成本低

---

## BUG-012

### Title
Auth: No rate limiting observed on sign-in endpoint

### Environment
- **URL:** https://esimnum.com/sign-in
- **Method:** 10 次连续 POST（被动探测，非暴力破解）

### Severity
Medium

### Priority
P1

### Steps to Reproduce
1. 运行 OWASP 扫描：`cd experiments/owasp-security/esimnum-security && npm run scan`
2. 或手动：10 秒内对 `/sign-in` 发送 10 次 POST（错误凭证）
3. 记录 HTTP 状态码

### Expected Result
出现 `429 Too Many Requests` 或临时 IP/账户锁定机制。

### Actual Result
10 次请求均返回 **200**，未观察到 429 或 lockout。

### Impact
增加凭证填充（credential stuffing）与暴力破解风险。

### Workaround
无用户侧变通；依赖 IdP/WAF 层防护（若存在且未在本次探测中体现）。

### Attachments
- `experiments/owasp-security/esimnum-security/test-results/security-report.json`（finding: "No rate limiting observed on sign-in probe"）

### Additional Context
- 复现率：100%（本次探测窗口内）
- 若登录走第三方 OAuth，限流应在认证 API / 回调层实施
- **不**建议在未授权情况下进行高强度 brute-force 测试

---

## BUG-013

### Title
Performance: Mobile images not sized for viewport

### Environment
- **URL:** https://esimnum.com/
- **Device:** Mobile 375×667（Lighthouse mobile preset）

### Severity
Low

### Priority
P2

### Steps to Reproduce
1. `cd experiments/lighthouse-performance/esimnum-audit && npm run audit:mobile`
2. 查看 Opportunities → **Properly size images**

### Expected Result
图片通过 `srcset`/`<picture>` 按视口提供合适分辨率，减少无效字节传输。

### Actual Result
Lighthouse 估算可节省约 **247 KiB**；另有 image-delivery 约 55 KiB 优化空间。

### Impact
移动网络用户加载更慢、消耗更多流量；Performance 97/100（仍达标但可优化）。

### Workaround
用户使用 WiFi；无产品内变通。

### Attachments
- `experiments/lighthouse-performance/esimnum-audit/reports/esimnum-mobile.json`
- `experiments/lighthouse-performance/esimnum-audit/reports/esimnum-mobile.html`

### Additional Context
- 桌面 Performance 99/100，问题主要集中在移动视口
- DOM 约 1,021 元素，属诊断信息，非独立 Bug

---

## BUG-014

### Title
Performance: Mobile Time to Interactive excessively high

### Environment
- **URL:** https://esimnum.com/
- **Lighthouse Mobile:** TTI **16.0 s** · FCP 1.9 s · LCP 2.3 s · CLS 0

### Severity
Low

### Priority
P3

### Steps to Reproduce
1. 运行 Lighthouse mobile audit（见 BUG-013）
2. 对比 Core Web Vitals 中 TTI 与 FCP/LCP

### Expected Result
TTI 与 LCP 差距合理（通常同量级或略高），页面在数秒内可交互。

### Actual Result
TTI 16.0 s，明显高于 FCP（1.9 s）与 LCP（2.3 s），暗示长任务或第三方脚本延迟主线程可交互时间。

### Impact
移动用户在 LCP 完成后仍可能长时间无法顺畅交互；当前 Lighthouse Performance 仍 97 分。

### Workaround
无。

### Attachments
- `experiments/lighthouse-performance/esimnum-audit/reports/combined-summary.json`

### Additional Context
- FCP 1.9 s 略超 Good 阈值 1.8 s，可一并关注
- 建议 Chrome Performance 面板分析长任务；延迟 Live Chat/Analytics 加载

---

## BUG-015

### Title
A11y: Additional color contrast checks require manual review

### Environment
- **URLs:** `/` · Cookie Preference Center
- **Tool:** axe-core incomplete checks

### Severity
Low

### Priority
P3

### Steps to Reproduce
1. 运行 `cd experiments/axe-accessibility/esimnum-a11y && npm run scan`
2. 查看报告 `incomplete` 节：首页 13 项、Preference Center 16 项 `color-contrast`

### Expected Result
axe 可自动判定所有文本/背景对比度，或人工确认后无违规。

### Actual Result
axe 无法自动判定（常见于渐变、图片叠加、伪元素背景），需人工用 WebAIM Contrast Checker 逐项确认。

### Impact
可能存在尚未被自动化捕获的对比度问题；风险待人工闭环后确定。

### Workaround
QA 人工复核 incomplete 列表元素。

### Attachments
- `experiments/axe-accessibility/esimnum-a11y/test-results/homepage-a11y-report.json`（incomplete: 13 nodes）
- `experiments/axe-accessibility/esimnum-a11y/test-results/cookie-preference-center-a11y-report.json`（incomplete: 16 nodes）

### Additional Context
- 非确认缺陷，为 **待人工验证项**
- 若人工确认通过，可关闭；若失败则新建子 Bug 并引用具体 selector

---

## Verified Passing (No Action Required)

| Area | Check | Result |
|------|-------|--------|
| Security | HTTPS + HSTS (`max-age=31556926`) | Pass |
| Security | Sensitive paths (`.env`, `.git`, `/actuator`, etc.) | Pass |
| Security | CORS not permissive on homepage | Pass |
| Security | XSS/SQLi reflection probes | Pass |
| Security | Unauthenticated admin/account routes | Pass |
| A11y | `/destinations` axe zero violations | Pass |
| A11y | Keyboard tab order & focus indicators | Pass |
| A11y | FAQ accordion Enter expands | Pass |
| Lighthouse | Performance 97–99 · SEO 100 · Best Practices 100 | Pass |
| Lighthouse | CLS 0 · Desktop LCP 0.5 s | Pass |

---

## Regression Verification

修复后执行以下命令并对照本报告逐项关闭：

```bash
cd experiments/axe-accessibility/esimnum-a11y && npm run scan
cd experiments/lighthouse-performance/esimnum-audit && npm run audit
cd experiments/owasp-security/esimnum-security && npm run scan
```

---

## Triage Checklist (Post-Fix)

- [ ] 每条 Bug 有独立 ticket 或 Epic 子任务
- [ ] 开发确认 BUG-001 P0 优先合入
- [ ] 安全头（BUG-008–011）在 CDN/Hosting 配置验证
- [ ] QA 重跑三套自动化并更新 Attachments
- [ ] 为 BUG-001/002/004 添加回归用例至 CI

---

*Generated with bug-report-writing skill · Evidence from axe-accessibility, lighthouse-performance, owasp-security experiments · 2026-06-18*
