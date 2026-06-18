# jsonplaceholder-api (Postman)

- **Skill**: `postman-api`
- **目标**: 为 [JSONPlaceholder](https://jsonplaceholder.typicode.com) 核心 REST 接口编写 Postman + Newman API 测试
- **规范**: Collection 组织、Environment 变量、pm.test 脚本、变量链、Newman CI

## 运行

```bash
npm install
node scripts/generate-collections.mjs   # 重新生成 collection JSON
npm test                                # Newman 运行全部集合

npm run test:workflow                   # 仅工作流集合
npm run test:report                     # HTML 报告
```

## 目录结构

```
postman/
  collections/     API 集合 + Workflow 集合
  environments/    baseUrl 等环境变量
  data/            CSV 数据驱动
  scripts/         run-tests.sh
```

## 覆盖

| 集合 | 请求数 | 说明 |
|------|--------|------|
| JSONPlaceholder API | 24 | Smoke、Posts、Comments、Todos、Users |
| Workflows | 5 | 变量链工作流（create→read→patch→verify→delete） |
| Data Driven | 2 迭代 | `posts-create.csv` 驱动 POST /posts |

主集合 **79** 个断言；全部通过 Newman 验证（含工作流与 CSV）。
