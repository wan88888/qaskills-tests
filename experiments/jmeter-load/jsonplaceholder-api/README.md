# JSONPlaceholder JMeter 性能测试

基于 jmeter-load skill 的 Demo 压测，与 [k6 试验](../k6-performance/jsonplaceholder-api/) 对齐：**每种资源类型一个列表 GET**。

**Base URL:** `https://jsonplaceholder.typicode.com`

## 压测接口（6 个）

| 资源类型 | 接口 |
|----------|------|
| posts | `GET /posts` |
| comments | `GET /comments` |
| albums | `GET /albums` |
| photos | `GET /photos` |
| todos | `GET /todos` |
| users | `GET /users` |

## 前置条件

```bash
brew install jmeter   # macOS
jmeter --version      # 建议 5.6+
python3               # 生成 .jmx
```

## 测试计划

| 文件 | 线程 |  ramp | 持续时间/循环 |
|------|------|------|----------------|
| `test-plans/smoke-test.jmx` | 1 | 1s | 3 次循环 |
| `test-plans/load-test.jmx` | 20 | 30s | 120s（scheduler） |

每个请求含：**状态码 200 断言**、**响应时间 < 15s 断言**、**Gaussian 思考时间 1–3s**。

## 运行（非 GUI，skill 要求）

```bash
cd experiments/jmeter-load/jsonplaceholder-api

npm run generate   # 重新生成 JMX
npm run smoke
npm run load
```

自定义 Host：

```bash
jmeter -n -t test-plans/smoke-test.jmx -JBASE_HOST=jsonplaceholder.typicode.com -l results/smoke.jtl
```

## 报告

| 运行 | JTL | HTML 报告 |
|------|-----|-----------|
| smoke | `results/smoke.jtl` | `reports/smoke-html/` |
| load | `results/load.jtl` | `reports/load-html/` |

## 目录结构

```
jmeter-load/jsonplaceholder-api/
├── scripts/
│   ├── generate-test-plan.py
│   ├── run-smoke.sh
│   └── run-load.sh
├── test-plans/
│   ├── smoke-test.jmx
│   └── load-test.jmx
├── results/
└── reports/
```
