# PetMetricus Admin

PetMetricus 内容管理后台，对接 `pet-metric-server` 的 MySQL 管理接口。

## 本地启动

1. 在 `pet-metric-server/.env` 中设置至少 16 位的 `ADMIN_TOKEN`，并在 `CORS_ORIGINS` 加入 `http://localhost:3002`。
2. 启动后端：`cd ../pet-metric-server && pnpm dev`。
3. 安装并启动后台：`pnpm install && pnpm dev`。
4. 打开 `http://localhost:3002`，输入与后端一致的 `ADMIN_TOKEN`。

后台支持分类、产品、产品评测、比较、最佳选择、指南、故障指南、页面内容和网站设置的新增与编辑。下线按钮只将内容标记为未发布，不物理删除数据库记录。
