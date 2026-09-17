# PetMetricus Cloudflare 部署文档

本文对应 `pet-metric-ui`。站点使用 Nuxt 4 + Nitro `cloudflare-pages` preset，内容使用 D1，研究图片/媒体使用 R2。

## 1. 本地准备

需要 Node.js 20+、pnpm 11+ 和已登录 Cloudflare 的 Wrangler：

```bash
pnpm install
pnpm wrangler login
```

本地 D1 使用 Wrangler 的本地 SQLite 持久化，不需要先创建远程数据库：

```bash
pnpm run db:migrate:local
pnpm run dev:wrangler
```

如果本机 Wrangler 无法创建本地监听端口，检查终端权限或改用：

```bash
pnpm run build
pnpm exec wrangler --cwd dist pages dev
```

## 2. 创建 Cloudflare 资源

```bash
pnpm exec wrangler d1 create pet-metric-db
pnpm exec wrangler r2 bucket create pet-metric-media
```

把 `d1 create` 返回的 `database_id` 写回 `wrangler.jsonc` 的 `d1_databases[0]`。R2 的 `bucket_name` 保持为 `pet-metric-media`，绑定名必须保持 `BUCKET`。

## 3. 远程初始化 D1

```bash
pnpm run db:migrate:remote
```

迁移文件是 `migrations/0001_initial.sql` 和 `migrations/0002_design_content.sql`。第二个迁移补齐设计稿首页与四个分类页使用的产品短名单；以后请继续用递增编号添加内容，不要修改已经执行过的迁移。

`0001_initial.sql` 创建：

- `categories`：四个产品品类
- `products`：产品数据库和标准化字段
- `research_items`：首页/研究卡片
- `correction_requests`：联系与纠错表单

正式环境添加内容时，新增编号递增的 migration，不要直接修改已执行过的 migration。

## 4. 配置 Secret

不要把 token 写进 `wrangler.jsonc`，用 Secret：

```bash
pnpm exec wrangler pages secret put ADMIN_TOKEN
```

本地可复制 `.dev.vars.example` 为 `.dev.vars`，并填入 `ADMIN_TOKEN`。`/api/media/upload` 需要请求头 `x-admin-token`，前端公开页面不应持有该 token。

## 5. 构建与部署

```bash
pnpm run build
pnpm run deploy
```

也可以在 Cloudflare Pages 项目中使用：

- Build command: `pnpm run build`
- Build output directory: `dist`
- Node.js version: `20` 或更高

Pages 项目的 Settings → Functions → Bindings 中确认：

- D1 database binding：变量名 `DB`
- R2 bucket binding：变量名 `BUCKET`

变量 `SITE_NAME`、`SITE_DESCRIPTION`、`CONTACT_EMAIL` 可在 `wrangler.jsonc` 或 Pages 环境变量中设置。生产环境建议在 Preview/Production 分开配置。

## 6. R2 图片上传与引用

上传成功后接口返回 `/api/media/{key}`。内容记录的 `image_key` 应保存 R2 object key，不要保存临时本地路径。前端可以把它拼成同源地址：

```ts
const imageUrl = `/api/media/${encodeURIComponent(imageKey)}`
```

上传请求示例：

```bash
curl -X POST https://your-site.pages.dev/api/media/upload \
  -H "x-admin-token: $ADMIN_TOKEN" \
  -F "file=@./product-photo.webp"
```

图片建议使用 WebP/AVIF，并在内容中保留描述性 alt 文本；不要把个人信息或敏感文件上传到此 bucket。

## 7. 上线检查

1. 打开首页、产品库、四个品类页、对比、Best Picks、故障排查、About、Disclosure、Privacy、Contact。
2. 用 375px、768px、1024px、1440px 检查没有横向滚动。
3. 验证 D1：`/api/content/home` 返回 `source: "d1"`。
4. 验证纠错表单能写入 `correction_requests`。
5. 验证未配置 `ADMIN_TOKEN` 或错误 token 时 R2 上传返回 401。
6. 检查所有商业页面显示来源/检查日期/限制说明，联盟关系链接到 `/disclosure/`。
7. 上传真实图片后再为内容记录填 `image_key`，并确认图片 alt 文本有意义。

本地开发站点固定使用 `http://localhost:3000`；可以用下面的接口确认当前确实读取了 Wrangler 本地 D1，而不是页面内置的备用数据：

```bash
curl http://localhost:3000/api/content/home
```

返回结果中的 `source` 应为 `d1`。

## 8. 安全和维护

- `ADMIN_TOKEN` 只能作为 Secret，不可提交到仓库。
- R2 上传接口应在正式环境前增加管理员认证、文件类型白名单和大小限制。
- D1 纠错表单建议在生产前加速率限制或 Turnstile。
- 价格、订阅和库存是时间敏感字段，更新时同步修改 `updated_at`/`checked_at`。
- 生产部署前运行 `pnpm run build`；部署后用 `wrangler tail` 检查 Worker 错误。

## 9. 搜索引擎更新通知

生产部署完成后，用 IndexNow 将当前站点地图中的同域 URL 主动提交给支持该协议的搜索引擎：

```bash
pnpm run seo:indexnow
```

脚本会从 `https://petmetricus.com/sitemap.xml` 读取 URL，并使用站点根目录中的公开验证 key 文件提交。新增、删除或大批量更新内容后应再次运行。

Google Search Console 和 Bing Webmaster Tools 的 HTML meta 验证由以下公开环境变量控制：

```bash
NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION=google-provided-token
NUXT_PUBLIC_BING_SITE_VERIFICATION=bing-provided-token
```

在 Cloudflare Pages 的 Production 环境中设置平台提供的 token 后重新部署。站点会分别输出 `google-site-verification` 和 `msvalidate.01`。验证完成后仍建议保留这些值，防止所有权复核失败。

GA4 会记录普通 `page_view`，并将带 `rel="sponsored"` 或指向 Amazon.com 的出站链接记录为 `affiliate_click`。事件参数包括目标 URL、域名、链接文字和来源页面路径。
