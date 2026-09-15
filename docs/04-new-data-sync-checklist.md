# 新增宠物用品数据同步清单

本文档用于维护 PetMetric 新增品类、产品或内容时的同步要求。当前适用范围包括猫狗用品，也适用于后续扩展的其他宠物用品。

## 1. 先确定数据身份

- [ ] 确定 PetMetric 分类 `slug`、英文标题、中文/展示标题、排序和发布状态。
- [ ] 确定 Amazon marketplace（当前为 Amazon US）和 Amazon 类别/子类别。
- [ ] 每个产品记录 ASIN、Amazon 详情页 URL、当前变体、品牌、型号、价格、评分、评论数、检查日期和配送区域。
- [ ] 只有从目标 marketplace 和配送区域实际核验到的字段才能入库；若价格、库存或评论数没有可靠取到，必须保存为 `NULL`，页面显示“查看 Amazon 当前 listing”，不能用其他币种、估算值或编辑占位值代替。
- [ ] 产品 `external_id` 必须是 ASIN，`merchant_url` 必须是对应的 `https://www.amazon.com/dp/{ASIN}` 直达链接，不能使用 Amazon 搜索结果页作为商品链接。
- [ ] 产品图片必须来自对应 Amazon listing/ASIN 的主图或授权图片 URL；不能用泛化场景图、随机图库图或与产品不匹配的图片。
- [ ] 保存图片 alt 文本，描述图片中的实际产品，不把图片当作产品规格证据。

## 2. Server 数据库

### 分类

- [ ] `categories`
  - `slug`
  - `title`
  - `eyebrow`
  - `description`
  - `subtitle`
  - `product_count`
  - `comparison_count`
  - `price_range`
  - `top_pick`
  - `top_score`
  - `image_url`
  - `image_key`
  - `alt_text`
  - `sort_order`
  - `is_published`
- [ ] `category_criteria` 至少 5 条，覆盖适配、安全、日常使用、维护和持续成本。

### 产品链

每个产品都要同步：

- [ ] `products`
- [ ] `product_specs`
- [ ] `product_tags`
- [ ] `product_reviews`
- [ ] Amazon 来源字段：`external_id`/ASIN、`merchant_url`、`merchant_name`、`marketplace_domain`、`delivery_country_code`、`commerce_checked_at`。
- [ ] 价格、评分、评论数为空时必须明确显示“未检查/不可用”，不能用推测值填充。
- [ ] Amazon 动态商业字段必须以美国站当前选中变体的主展示报价为准；不要把 Amazon Visa、分期、coupon、used offer 或其它卖家价格写入基础 `price`。
- [ ] 每次价格/评分/评论数刷新都要记录 `commerce_checked_at`、`marketplace_domain=amazon.com` 和 `delivery_country_code=US`；页面应显示检查日期或动态数据提示。

### 内容链

每个新分类至少应有：

- [ ] 3 篇 `comparisons`
- [ ] 每篇对比至少 2 条 `comparison_criteria`
- [ ] 每篇对比至少 2 条 `comparison_best_for`
- [ ] 2 个 `best_picks`
- [ ] 2 篇 `guides`
- [ ] 2 篇 `troubleshooting_guides`
- [ ] 每篇故障排除至少 4 条 `troubleshooting_steps`

同时检查所有外键引用：对比双方产品、Best Pick 产品、指南分类、故障排除产品都不能成为孤儿记录。

## 3. 前端同步

- [ ] 完成 MySQL 迁移后，在 `pet-metric-ui` 运行 `npm run content:sync`，把分类、全部商品详情字段、对比决策数据、Best Picks、Guides、Troubleshooting 和静态内容页同步到 Cloudflare 使用的 `server/data/content.json`。
- [ ] 同步前确认本地内容 API `http://localhost:4000/health` 返回 200；如使用其他源地址，通过 `PETMETRIC_CONTENT_API` 指定 API 根地址。
- [ ] 不允许只同步列表接口：商品必须逐条同步详情接口，否则 `product_reviews`、用户评论摘要和来源事实会丢失。
- [ ] 对比同步必须保留 `bestFor`、`productAttributes`、`criteria`、`researchConclusion`、`userReviewSummaries`、`userFeedback`、`matchType/matchLabel/whyCompare` 和 `scope/controversy/decisionRule`。
- [ ] `app/composables/useCategoryOptions.ts` 增加 fallback 分类，并确认不要继续截断新分类。
- [ ] `app/pages/products/[category].vue`
  - `criterionIcons`
  - `facetDefinitions`
  - 相关 Best Pick 链接
  - 分类专属 FAQ（如确有必要）
- [ ] 产品、对比、Best Picks、指南、故障排除页面都能通过分类筛选出新数据。
- [ ] 分类卡片、导航、移动端导航、About/Products/Guides 等入口显示新分类。
- [ ] `sitemap.xml` 能生成新分类、产品、对比、Best Picks、指南和故障排除 URL。
- [ ] SEO title、description、breadcrumb 和 alt 文本使用新分类的实际内容。

## 4. 图片规则

- [ ] 分类卡片图：优先使用 Amazon listing 中代表性产品的实际主图；更新 `image_url` 时将旧 `image_key` 置空，避免 R2 旧图覆盖 fallback。
- [ ] 产品卡和产品详情图：使用该产品对应 ASIN/变体的 Amazon 主图，不跨产品复用。
- [ ] 图片 URL、ASIN、产品名和变体必须人工抽查一致。
- [ ] 不在图片上添加品牌、价格、评分或未经验证的文字。
- [ ] 图片加载失败时要有可访问的 alt 文本和安全 fallback。

## 5. 迁移与验证

- [ ] 新增内容写入新的、可重复执行的 `pet-metric-server/sql/*.sql` 迁移文件。
- [ ] 执行 `npm run db:migrate`。
- [ ] 检查分类统计是否等于实际发布记录。
- [ ] 检查每个分类的 `subtitle` 和 `criteria.title/description`，不能把 criteria 字符串当数组下标读取。
- [ ] 检查每个产品的 `asin`、`amazonVerified`、`sourceFacts` 和 `specDetails` 均已进入部署数据；内部数据库 ID 不能代替 ASIN 展示。
- [ ] 检查 Best Picks 指向商品详情时使用 `/reviews/{productSlug}/`，而不是不存在的 `/products/{productSlug}/`。
- [ ] 检查没有真实价格、库存或用户评论样本时展示明确的“未采集/未验证”状态，不隐藏证据缺口，也不生成推测值。
- [ ] 检查产品、对比、Best Pick、指南、故障排除详情页 HTTP 状态均为 200。
- [ ] 检查新增产品详情页不会因 JSON 对象/数组格式差异触发 SSR 错误。
- [ ] 执行 Server tests/build 和 UI build。
- [ ] 至少手动检查一个分类页、一个产品页、一个对比页、一个 Best Pick、一个指南和一个故障排除页。

## 6. 当前三类猫狗用品的示例迁移

- `062_add_cat_dog_core_categories.sql`：首批分类和内容。
- `063_complete_cat_dog_core_content.sql`：产品、评测、指南和故障排除补全。
- `064_add_third_comparisons_core_categories.sql`：第三篇对比。
- `065_complete_core_relationships.sql`：标签、对比适用人群和故障步骤补全。
- `066_align_core_amazon_source_and_site_copy.sql`：Amazon 来源字段和站点描述。
- `067_use_amazon_category_product_images.sql`：分类卡片切换到 Amazon 商品主图。
- `078_refresh_us_amazon_commerce_snapshot.sql`：从登录的 Amazon.com 美国站页面刷新价格、评分和评论数快照；无可靠主报价的商品保持 `NULL`。
