# 测试指南

本文档说明如何测试通用查询 API。

## 测试方法

### 方法 1: 使用浏览器测试页面（推荐）

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 在浏览器中打开 `test-generic-query.html` 文件

3. 点击 "📋 加载默认测试数据" 按钮加载预设的测试数据

4. 点击 "🚀 执行测试" 按钮运行测试

5. 查看响应结果

**优点：**
- 可视化界面，易于使用
- 可以修改参数并实时测试
- 自动格式化 JSON 显示

### 方法 2: 使用 Node.js 测试脚本

1. 确保 Node.js 版本 >= 18（内置 fetch）或安装 node-fetch：
   ```bash
   npm install node-fetch@2
   ```

2. 运行测试脚本：
   ```bash
   node test-generic-query.js
   ```

3. 或者设置自定义 API URL：
   ```bash
   API_BASE_URL=http://localhost:3000 node test-generic-query.js
   ```

### 方法 3: 使用 curl 命令

1. 直接运行 curl 命令：
   ```bash
   curl -X POST http://localhost:3000/api/generic/query \
     -H "Content-Type: application/json" \
     -d '{
       "tableName": "FuxiData",
       "filters": [
         { "field": "type", "operator": "=", "value": "bumpy-map-record-point" },
         { "field": "time", "operator": ">=", "value": "2025-11-03 11:01:00.000" },
         { "field": "time", "operator": "<=", "value": "2025-11-03 11:14:00.000" }
       ],
       "logic": "AND",
       "orderBy": "time",
       "order": "DESC",
       "limit": 20,
       "offset": 0
     }'
   ```

2. 或者使用提供的 shell 脚本（需要安装 jq 用于格式化）：
   ```bash
   chmod +x test-query.sh
   ./test-query.sh
   ```

### 方法 4: 使用 Postman 或类似工具

1. 创建新的 POST 请求
2. URL: `http://localhost:3000/api/generic/query`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
   ```json
   {
     "tableName": "FuxiData",
     "filters": [
       { "field": "type", "operator": "=", "value": "bumpy-map-record-point" },
       { "field": "time", "operator": ">=", "value": "2025-11-03 11:01:00.000" },
       { "field": "time", "operator": "<=", "value": "2025-11-03 11:14:00.000" }
     ],
     "logic": "AND",
     "orderBy": "time",
     "order": "DESC",
     "limit": 20,
     "offset": 0
   }
   ```

## 测试数据

默认测试数据：

```json
{
  "tableName": "FuxiData",
  "filters": [
    { "field": "type", "operator": "=", "value": "bumpy-map-record-point" },
    { "field": "time", "operator": ">=", "value": "2025-11-03 11:01:00.000" },
    { "field": "time", "operator": "<=", "value": "2025-11-03 11:14:00.000" }
  ],
  "logic": "AND",
  "orderBy": "time",
  "order": "DESC",
  "limit": 20,
  "offset": 0
}
```

## 预期响应

成功响应示例：

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "bumpy-map-record-point",
      "time": "2025-11-03T11:05:00.000Z",
      "data": { ... }
    },
    ...
  ],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

## 故障排查

### 1. 连接错误

**问题**: `fetch failed` 或 `ECONNREFUSED`

**解决方案**:
- 确保开发服务器正在运行：`npm run dev`
- 检查 API URL 是否正确
- 检查防火墙设置

### 2. 数据库连接错误

**问题**: `Database connection string not configured`

**解决方案**:
- 确保设置了 `DATABASE_URL` 环境变量
- 在 `.env.local` 文件中添加：
  ```
  DATABASE_URL=postgresql://user:password@host/database
  ```

### 3. 表不存在错误

**问题**: `relation "FuxiData" does not exist`

**解决方案**:
- 确保数据库中存在指定的表
- 检查表名是否正确（注意大小写）
- 使用正确的表名或创建表

### 4. 字段不存在错误

**问题**: `column "xxx" does not exist`

**解决方案**:
- 检查过滤器中的字段名是否正确
- 确保字段名与数据库表中的列名匹配
- 注意字段名的大小写

## 快速测试命令

```bash
# 使用 curl 快速测试
curl -X POST http://localhost:3000/api/generic/query \
  -H "Content-Type: application/json" \
  -d '{"tableName":"FuxiData","filters":[{"field":"type","operator":"=","value":"test"}],"limit":10}'
```

## 注意事项

1. 确保数据库连接正常
2. 确保表存在且有数据
3. 时间格式要正确（建议使用 ISO 8601 格式）
4. 字段名和表名区分大小写
5. 所有操作符值区分大小写（如 `LIKE` 不是 `like`）

