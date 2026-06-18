# jsonplaceholder-api

- **Skill**: `playwright-api`
- **目标**: 为 [JSONPlaceholder](https://jsonplaceholder.typicode.com) 核心 REST 接口编写 API 测试
- **规范**: APIRequestContext、类型模型、API Client、fixtures

## 运行

```bash
npm install
npm test
npm run test:ui
npm run test:report
```

## 覆盖资源

| 资源 | 路径 | 用例 |
|------|------|------|
| Posts | `/posts` | 列表、详情、嵌套评论、CRUD |
| Users | `/users` | 列表、详情、posts/todos/albums 关联 |
| Comments | `/comments` | 列表、过滤、创建 |
| Todos | `/todos` | 列表、过滤、创建、更新 |
| Smoke | 全部 6 资源 | 可用性 + 数量 + 响应时间 |

共 **29** 个用例，目标 API：`https://jsonplaceholder.typicode.com`
