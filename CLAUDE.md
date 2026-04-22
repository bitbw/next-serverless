# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 开发命令

```bash
npm run dev      # 启动开发服务器（Turbopack，http://localhost:3000）
npm run build    # 生产构建
npm run lint     # ESLint 检查
```

无自动化测试框架。手动测试方法见 `test/TEST_README.md`，主要通过以下方式：
```bash
# curl 快速测试
curl -X POST http://localhost:3000/api/generic/query \
  -H "Content-Type: application/json" \
  -d '{"tableName":"FuxiData","filters":[{"field":"type","operator":"=","value":"test"}],"limit":10}'

# 或运行 Node.js 脚本
node test/test-generic-query.js
```

## 环境变量

必须在 `.env.local` 中配置（参考 `.env.example`）：

```env
DATABASE_URL2_DATABASE_URL=   # NeonDB PostgreSQL 连接字符串（注意：变量名有双 _DATABASE_URL 后缀）
BLOB_READ_WRITE_TOKEN=        # Vercel Blob 读写 Token
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=               # 例如 ap3
```

## 架构概览

基于 **Next.js 15 App Router** 的纯后端 Serverless API 项目，部署在 Vercel（`main` 分支生产，`preview` 分支预览）。

### API 路由分组

**通用 CRUD (`/api/generic`)** - 操作 NeonDB 中任意表，通过 `tableName` 参数指定（默认 `FuxiData`）：
- `POST /create` — 插入记录
- `DELETE /delete` — 按 id 删除
- `GET|POST /query` — 条件查询（支持 filters 数组）
- `PUT /update` — 按 id 更新，成功后对白名单表触发 Pusher 事件

**FuxiData 专用 (`/api/fuxi-data`)** - 固定操作 `FuxiData` 表（结构：`id`, `data` JSON, `type`, `time` 东八区）：
- `POST /save-data`, `GET /get-data`, `PUT /update-data`, `GET /list-tables`

**文件上传 (`/api/blob/client-upload`)** - Vercel Blob 客户端直传，支持 PNG/JPEG/WebP，最大 15MB

**Webhook (`/api/webhooks/sentry-feishu` 和 `sentry-feishu2`)** - 接收 Sentry 错误事件，格式化后发送飞书富文本卡片通知

### 核心库文件

- **`lib/db/query-builder.ts`** — 将 `QueryParams`（含 `filters` 数组）转换为参数化 SQL；所有字段名用双引号转义防注入
- **`lib/pusher.ts`** — Pusher 服务端实例 + `ENABLED_TABLES` 白名单（当前仅 `FuxiKuangBiao`）；`PUT /api/generic/update` 成功后调用 `triggerPusherEvent()`，channel 名 = 表名，事件名 = `updated`
- **`lib/feishu/card.ts`** — 飞书消息卡片模板函数 `getErrorNoticeCard()`

### CORS

`next.config.ts` 对所有 `/api/*` 路由全局配置了 `Access-Control-Allow-Origin: *`，无需在单个 route 中添加 CORS 头。

### UI 组件

`components/ui/` 使用 shadcn/ui 模式（Radix UI + Tailwind）。`components.json` 是 shadcn 配置文件。动画使用 `motion` (Framer Motion)。

### 数据库模式注意事项

- 每次 API 调用都通过 `neon(connectionString)` 新建连接（无连接池，符合 Serverless 场景）
- 表名和字段名**区分大小写**，SQL 中用双引号包裹
- `FuxiData` 是主要业务表；`FuxiKuangBiao` 是已启用实时推送的表
