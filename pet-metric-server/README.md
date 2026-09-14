# PetMetric REST API

PetMetric 官网的 Node.js 查询服务。当前版本只提供公开内容查询，不包含内容后台、登录和写入接口。

## 技术栈

- Node.js 20+
- TypeScript
- Fastify 5
- MySQL 8.4 / mysql2 连接池
- Zod 参数校验

## 本地启动

```bash
cp .env.example .env
docker compose up -d mysql
pnpm install
pnpm db:migrate
pnpm dev
```

服务默认监听 `http://localhost:4000`：

```bash
curl http://localhost:4000/health
curl 'http://localhost:4000/api/v1/products?category=automatic-litter-boxes&sort=score_desc'
```

## 脚本

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | 开发模式启动并监听源码变化 |
| `pnpm build` | 编译 TypeScript 到 `dist/` |
| `pnpm start` | 启动编译后的服务 |
| `pnpm typecheck` | 仅执行类型检查 |
| `pnpm test` | 执行接口单元测试 |
| `pnpm db:migrate` | 按文件名顺序执行尚未应用的 SQL |

迁移历史记录在 MySQL 的 `schema_migrations` 表。初始化数据来自当前 Nuxt 页面，包含 4 个分类、18 个产品、18 个评测、6 组比较、8 个最佳选择、6 篇指南和 11 个故障排查入口。

## 返回约定

成功的单条数据：

```json
{ "data": { "slug": "litter-robot-4" } }
```

成功的列表数据：

```json
{
  "data": [],
  "meta": { "page": 1, "limit": 20, "total": 18, "totalPages": 1 }
}
```

失败：

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Product not found",
    "requestId": "req-1"
  }
}
```

完整接口说明见 [docs/API.md](docs/API.md)，机器可读定义见 [docs/openapi.yaml](docs/openapi.yaml)。

## 前端接入建议

Nuxt 中配置：

```env
NUXT_PUBLIC_API_BASE=http://localhost:4000/api/v1
```

按页面替换的推荐顺序：

1. 首页：`GET /home`
2. 产品分类页：`GET /categories/:slug` + `GET /categories/:slug/products`
3. 产品评测：`GET /products/:slug`
4. 对比、最佳选择、指南和故障排查的列表与详情接口
5. About、Disclosure、Privacy 等：`GET /pages/:slug`

生产环境应使用独立 MySQL 用户、TLS/私网连接、数据库备份，并将 `CORS_ORIGINS` 限制为正式域名。
