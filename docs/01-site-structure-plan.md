# PetMetric 网站整体目录规划

**版本：** 2026-09-03  
**适用市场：** 美国英语用户（US English）  
**规划目标：** 让用户从“我想买什么”“两个产品有什么区别”“产品坏了怎么办”三条路径快速找到答案。

## 1. 目录总览

```text
/
├── products/                         产品数据库入口（当前八个猫狗用品方向）
│   ├── automatic-litter-boxes/       自动猫砂盆
│   ├── smart-pet-feeders/            智能喂食器
│   ├── gps-pet-trackers/             GPS 定位器
│   └── pet-cameras/                  宠物摄像头
├── reviews/                          单品评测
│   └── {brand-model}/
├── comparisons/                      对比库
│   └── {product-a-vs-product-b}/
├── best-picks/                       场景化购买指南
│   └── {best-for-use-case}/
├── troubleshooting/                  故障排查库
│   └── {brand-model-problem}/
├── guides/                           通用知识与购买教育
│   └── {topic}/
├── brands/                           品牌资料页（第二阶段）
│   └── {brand}/
├── about/                            关于 PetMetric
├── editorial-standards/              研究方法、更新和纠错政策
├── disclosure/                      联盟与商业合作披露
└── contact/                         联系与纠错提交
```

正式上线前，当前 MVP 的 `/fix-a-problem/` 建议迁移为 `/troubleshooting/`，并对旧 URL 做 301；这样目录名称更符合搜索意图，也便于后续扩展故障库。

## 2. 顶部导航

顶部导航保持不超过 5 个一级入口：

1. **Products**：产品数据库及四个品类
2. **Comparisons**：横向对比
3. **Best Picks**：按场景和预算的推荐
4. **Troubleshooting**：故障排查
5. **About**：定位、方法、披露和联系

搜索按钮始终保留在页头。移动端也要保留清晰的菜单入口，确保深层页面仍能返回一级目录。

## 3. 页面层级与职责

### 首页 `/`

首页不是文章列表，而是决策入口，顺序固定为：

1. 价值主张：独立、可核验的宠物科技研究
2. 可信信号：已研究产品数、更新日期、来源透明说明
3. 四个核心品类入口
4. 近期重点研究和精选产品
5. 对比入口
6. 常见故障入口
7. 研究方法与最终 CTA

首页每个模块最多一个主 CTA，避免同时出现多个同等权重的按钮。

### 产品库 `/products/`

产品库是目录型页面，不直接做“万能推荐”。每个品类页应包含：

- 品类定义和适用人群
- 关键购买标准
- 产品筛选（价格、宠物类型、功能、订阅、尺寸等）
- 产品卡片和更新时间
- 相关对比、Best Picks 和故障排查链接
- FAQ 与 ItemList / BreadcrumbList 结构化数据

### 单品评测 `/reviews/{brand-model}/`

单品页解决“这款产品值不值得买”及“它适合谁”：

- 一句话结论和适用人群
- 规格、价格、订阅和兼容性
- 实际使用维度：可靠性、清洁、噪音、安全、App
- 优点与限制（限制必须与推荐并列）
- 替代品和相关对比
- 来源、检查日期和联盟披露

### 对比页 `/comparisons/{a-vs-b}/`

对比页解决“两个产品怎么选”：

- 直接结论：谁适合哪一类用户
- 同一标准下的对比表
- 一次性成本和长期成本
- 关键差异解释，而不是只罗列参数
- 选择建议、替代品、购买入口

对比表在移动端改成可滚动卡片或纵向比较，不能让页面出现不可控的横向滚动。

### Best Picks `/best-picks/{best-for-use-case}/`

Best Picks 使用场景驱动，而不是只做“第一名”：

- Best automatic litter box for multiple cats
- Best GPS tracker for escape-prone dogs
- Best feeder for portion control
- Best pet camera for separation anxiety

每篇至少说明预算、取舍、适合和不适合的人群。

### 故障排查 `/troubleshooting/{brand-model-problem}/`

故障页面使用症状导向标题，例如：

- Tractive GPS location not updating
- Litter-Robot not cycling
- PETLIBRO feeder not dispensing

结构为：症状确认 → 最常见原因 → 安全检查 → 逐步修复 → 何时联系售后 → 何时更换产品。每一步要有明确的恢复路径，不只给结论。

## 4. 内链规则

每个深层页面至少有四类内链：

- 返回所属品类页
- 一个同品类对比页
- 一个相关 Best Pick 或购买指南
- 一个相关故障排查或售后说明

锚文本要描述目的，例如 `compare Tractive GPS and Fi`，不要重复使用 `click here`。3 层以上页面增加面包屑，并保持面包屑顺序与目录一致。

## 5. 发布顺序

### MVP（第 1 周）

1. 首页、Products、四个品类页
2. Comparisons、Best Picks、Troubleshooting Hub
3. About、Editorial Standards、Disclosure、Privacy
4. 每个品类至少 1 篇评测、1 篇对比、1 篇购买指南

### 第一内容垂直（第 2–3 周）

优先完成 **Automatic Litter Boxes**：品类页 → 3 篇单品评测 → 2 篇对比 → 3 篇故障排查 → 1 篇 Best Picks。完成后再复制模板到 GPS、喂食器和摄像头。

### 第二阶段（第 4 周以后）

- 品牌页和产品数据库索引
- Search Console 数据驱动的 FAQ 和新页面
- 联盟链接、价格更新时间和商业披露

## 6. 上线验收

- 所有一级入口和核心深链都能直接访问
- 375、768、1024、1440px 下无横向滚动
- H1 → H2 → H3 层级连续
- 链接、按钮和搜索控件有可见焦点状态
- 重要文字对比度至少 4.5:1，按钮触控高度至少 44px
- `prefers-reduced-motion` 下内容直接可读
- 每个产品/评测页显示来源和检查日期
- 旧 `/sample-page/` 和默认文章保持草稿，不出现在正式导航
