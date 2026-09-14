# PetMetric 查询 API

Base URL：`http://localhost:4000/api/v1`

所有正文使用 UTF-8，时间字段由数据库统一以 UTC 处理。查询接口默认带 `Cache-Control: public, max-age=60, stale-while-revalidate=300`。

## 通用查询参数

列表接口支持以下参数；不适用的参数会被安全忽略。

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `page` | `1` | 从 1 开始 |
| `limit` | `20` | 1–100 |
| `category` | - | 分类 slug |
| `search` | - | 产品、指南或故障关键词，最多 100 字符 |
| `sort` | `rank` | `rank`、`price_asc`、`price_desc`、`score_desc`、`popular`、`newest` |
| `maxPrice` | - | 产品最高价格，单位为美元 |
| `catCount` | - | 猫数量规格，如 `1–2 cats` |
| `litterType` | - | 猫砂类型，如 `Clumping` |
| `app` | - | 连接方式，如 `App` 或 `No app` |
| `featured` | - | `true` 或 `false` |

## 接口列表

### 系统

- `GET /health`：检查 HTTP 服务及数据库连接。数据库不可用时返回 HTTP 503。

### 首页

- `GET /home`

一次返回首页首屏文案、研究统计、方法论、分类、前三个比较、8 个最佳选择和热门故障排查，减少首页瀑布请求。

其中 `stats` 不从 `site_settings` 读取，而是根据已发布业务数据实时生成：

- `productsResearched`：`products` 中已发布产品数量。
- `productCategories`：`categories` 中已发布分类数量。
- `comparisonsPublished`：`comparisons` 中已发布产品对比数量。
- `guidesPublished`：`guides` 中已发布购买指南数量。

`site_settings` 只保存首页首屏文案、方法论等不可由业务表计算的运营配置。

### 分类与产品

- `GET /categories`：全部已发布分类及购买标准。
- `GET /categories/:slug`：分类详情及购买标准。
- `GET /categories/:slug/products`：指定分类的产品列表。
- `GET /products`：跨分类产品列表。
- `GET /products/:slug`：产品详情、标签、规格和评测正文。

示例：

```http
GET /api/v1/categories/automatic-litter-boxes/products?maxPrice=500&catCount=1%E2%80%932%20cats&litterType=Clumping&sort=score_desc&page=1&limit=12
```

产品响应保留了当前 Nuxt 使用的字段名，并包含 Amazon 商业快照字段：

- `amazonRating`、`amazonReviewCount`：Amazon 页面展示的用户评分与评论数，不是 PetMetric 编辑评分。
- `availability`、`commerceCheckedAt`：抓取时的库存文案与核验时间；为空表示来源页没有可靠展示，不代表缺货。
- `specs`、`specDetails`：经核验的 Amazon listing facts；`specDetails` 同时保留标签和值。
- `filterSpecs`：站内结构化筛选字段，与页面展示规格分开，避免更新商品事实后破坏筛选。
- `price`、`priceDisplay`：美国邮编 10001 地区核验时的美元快照，购买前必须以商家页实时信息为准。

详情额外包含 `review.quickSpecs`，其中会合并已核验规格、价格、Amazon 评分、库存及订阅信息：

```json
{
  "data": {
    "slug": "litter-robot-4",
    "categorySlug": "automatic-litter-boxes",
    "name": "Whisker Litter-Robot 4 Supply Bundle",
    "price": 749,
    "priceDisplay": "$749.00",
    "amazonRating": 4.4,
    "amazonReviewCount": 375,
    "availability": "In Stock",
    "commerceCheckedAt": "2026-09-05T16:42:00.000Z",
    "specs": ["Litter-Robot 4 supply bundle", "Wi-Fi enabled"],
    "filterSpecs": {"cat_count": "2–4 cats", "litter_type": "Clumping", "app": "App"},
    "review": {
      "strengths": [],
      "limitations": [],
      "quickSpecs": [
        {"label": "Connectivity", "value": "Wi-Fi enabled"},
        {"label": "Amazon rating", "value": "4.4 / 5 (375 reviews)"}
      ],
      "researchDate": "2026-09-05"
    }
  }
}
```

当前 Amazon 快照核验日期为 2026-09-05、配送地区为美国邮编 10001。Amazon 价格、评分、评论数、库存、卖家和配送信息均可能随时间与地区变化。

### 产品比较

- `GET /comparisons?category=gps-pet-trackers&sort=popular`
- `GET /comparisons/:slug`

列表和详情均返回 `a`、`b`、`bestFor` 与 `criteria`。`criteria` 只包含由 `comparison_metric_definitions` 定义的品类专属核心功能，不混入价格、评分、库存等商业快照。前端以“核心功能、商品 A、商品 B”三列展示，每项包含 `group`、`label`、`aVal`、`bVal`、证据状态、来源链接和可选的 `helpText`。

价格、Amazon 评分、库存和订阅等非核心功能信息单独位于 `listingFacts`，不得作为核心功能强弱或整体胜者的主要依据。

详情响应还包含 `products`、`userFeedback` 与 `researchConclusion`：

- `products`：两款商品的身份信息，包括 `brand`、`asin`、`variant`、`img`、`merchantUrl`、`structure`、`dimensions`、`weight` 和 `capacity`。缺失资料返回 `Not verified`，不会推断参数。
- `productAttributes`：基础商品信息矩阵。固定包含品牌、ASIN、当前 listing/变体、颜色、材质、尺寸、重量、价格、Amazon 评分、评论数、Amazon Best Sellers Rank 和 PetMetric 站内顺序；同时合并两款商品 `product_specs` 的属性并集。同一标准化属性只返回一行，两边分别给值；只有一方有资料时，另一方返回未明确状态，而不是删除该指标。Amazon BSR 与 PetMetric 站内顺序是两个独立字段。
- `criteria[].aStatus` / `criteria[].bStatus`：证据状态，取值为 `explicit`（页面明确说明）、`claim`（宣传声称）、`unclear`（未明确说明）或 `unsupported`（明确不支持）。`aSourceUrl` / `bSourceUrl` 为该指标的来源链接；没有来源时为空。
- `userFeedback`：官方资料与评论级用户反馈分离。当前尚未完成逐条评论功能编码时，`status` 为 `not_researched`，并通过 `summary`、`sampleLimit` 明确说明，不能把 Amazon 评分当作功能验证。
- `researchConclusion`：基于当前已核验证据生成的 `coreFunctionLeader`、`practicalChoice`、`developerLessons` 和 `marketOpportunities`。证据不足时不会强行给出整体胜者。

`winner` 可能为 `a`、`b`、`tie` 或 `unknown`。缺少一方数据、评论样本不足、配置不一致以及情境型指标都会返回 `unknown`，前端不应将其显示为平局或胜出。接口同时返回 `checkedAt`、`evidenceConfidence`、`scopeNote` 和 `decisionGaps`，用于解释数据范围与购买前仍需核验的宠物适配项目。

### 最佳选择

- `GET /best-picks?category=pet-cameras`
- `GET /best-picks/:slug`

返回具体选择、预算、取舍、关联产品 slug 和结构化正文。

### 指南

- `GET /guides?category=automatic-litter-boxes&search=litter`
- `GET /guides/:slug`

详情正文位于 `content.sections`，每项包含 `title` 与 `body`。

### 故障排查

- `GET /troubleshooting?category=gps-pet-trackers&search=location&sort=popular`
- `GET /troubleshooting/:slug`

列表已经包含 `steps`，便于当前展开面板直接使用；详情还包含安全提示等 `content`。

### 通用页面

- `GET /pages/about`
- `GET /pages/editorial-standards`
- `GET /pages/disclosure`
- `GET /pages/privacy`
- `GET /pages/contact`

## HTTP 状态码

| 状态码 | code | 含义 |
| --- | --- | --- |
| 200 | - | 查询成功 |
| 400 | `VALIDATION_ERROR` | slug、分页或筛选参数无效 |
| 404 | `NOT_FOUND` | 资源不存在或未发布 |
| 404 | `ROUTE_NOT_FOUND` | 路由不存在 |
| 500 | `INTERNAL_SERVER_ERROR` | 未处理的服务端错误 |
| 503 | - | 数据库健康检查失败 |

## 边界与二期

本期所有业务路由仅注册 `GET`，CORS 也只放行 `GET/HEAD/OPTIONS`。内容后台二期建议增加管理员身份认证、草稿/发布流、审计日志、乐观锁及图片上传签名，不要直接在当前公开路由上增加匿名写操作。
