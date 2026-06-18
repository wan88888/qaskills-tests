# jsonplaceholder-api (REST Assured)

- **Skill**: `restassured-api-framework`
- **目标**: 为 [JSONPlaceholder](https://jsonplaceholder.typicode.com) 核心 REST 接口编写 Java API 自动化测试
- **规范**: REST Assured + TestNG + GSON POJO + PayloadManager + AssertActions + Allure

## 运行

```bash
# CRUD + Smoke 套件
mvn test

# E2E 集成流（ITestContext 跨步骤共享状态）
mvn test -DsuiteXmlFile=testng_e2e.xml
```

## 项目结构

```
src/main/java/.../endpoints/APIConstants.java
src/main/java/.../modules/PayloadManager.java
src/main/java/.../pojos/
src/test/java/.../base/BaseTest.java
src/test/java/.../asserts/AssertActions.java
src/test/java/.../tests/crud/
src/test/java/.../tests/e2e_integration/
```

## 覆盖

| 模块 | 用例 |
|------|------|
| Smoke | 6 大资源可用性 + 数量 |
| Posts | GET/POST/PUT/PATCH/DELETE + 嵌套评论 + Faker |
| Comments | 过滤、详情、创建 |
| Todos | 过滤、详情、创建、更新 |
| Users | 详情、posts/todos 关联 |
| E2E | Post 创建→验证→更新→删除（ITestContext） |

共 **24** 个用例（CRUD 19 + E2E 5）
