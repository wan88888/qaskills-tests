# JSONPlaceholder k6 性能测试

基于 k6-performance skill 的 Demo 压测：**每种资源类型只保留一个列表接口**。

**Base URL:** `https://jsonplaceholder.typicode.com`

## 压测接口（共 6 个）

| 资源类型 | 接口 | 预期条数 |
|----------|------|----------|
| posts | `GET /posts` | 100 |
| comments | `GET /comments` | 500 |
| albums | `GET /albums` | 100 |
| photos | `GET /photos` | 5000 |
| todos | `GET /todos` | 200 |
| users | `GET /users` | 10 |

## 脚本说明

| 脚本 | 用途 | 负载 |
|------|------|------|
| `scripts/smoke-test.js` | 串行请求 6 个列表接口 | 1 VU · 30s |
| `scripts/load-test.js` | 同上，多用户阶梯加压 | 5→20 VU · 2min |
| `scripts/stress-test.js` | `http.batch` 并发 6 个列表接口 | 10→50 VU · 3.5min |

## 运行

```bash
cd experiments/k6-performance/jsonplaceholder-api

npm run smoke
npm run load
npm run stress
```

## 阈值（load）

| 指标 | 目标 |
|------|------|
| `http_req_duration` p95 | < 800ms |
| `http_req_duration` p99 | < 2500ms |
| `http_req_failed` | < 1% |
| `checks` | > 99% |

## 结果目录

`results/` — k6 JSON 输出（已 gitignore）
