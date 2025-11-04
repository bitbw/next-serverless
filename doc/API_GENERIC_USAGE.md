# 通用数据库 API 使用文档

本文档介绍如何使用通用数据库 API 端点进行数据库操作。

## 目录

- [概述](#概述)
- [API 端点](#api-端点)
  - [查询 (Query)](#查询-query)
  - [创建 (Create)](#创建-create)
  - [更新 (Update)](#更新-update)
  - [删除 (Delete)](#删除-delete)
- [操作符说明](#操作符说明)
- [完整示例](#完整示例)

## 概述

通用数据库 API 提供了一套标准化的接口，用于对任意数据库表进行 CRUD 操作。所有 API 都支持动态表名（默认为 `FuxiData`）和灵活的字段操作。

### 基础配置

所有 API 都需要在环境变量中配置数据库连接字符串：

```env
DATABASE_URL=postgresql://user:password@host/database
```

## API 端点

### 查询 (Query)

支持 GET 和 POST 两种请求方式，用于复杂查询。

#### 请求方式

**POST** `/api/generic/query`（推荐）

**GET** `/api/generic/query`（适用于简单查询）

#### 请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `tableName` | string | 否 | `FuxiData` | 表名 |
| `filters` | Filter[] | 否 | `[]` | 过滤条件数组 |
| `logic` | string | 否 | `AND` | 过滤条件逻辑关系：`AND` 或 `OR` |
| `orderBy` | string | 否 | - | 排序字段 |
| `order` | string | 否 | `DESC` | 排序方向：`ASC` 或 `DESC` |
| `limit` | number | 否 | - | 返回记录数限制 |
| `offset` | number | 否 | - | 偏移量（用于分页） |

#### Filter 对象结构

```typescript
{
  field: string;      // 字段名
  operator: string;   // 操作符（见下方操作符说明）
  value: any;         // 值
}
```

#### 请求示例

**POST 请求示例：**

```bash
curl -X POST http://localhost:3000/api/generic/query \
  -H "Content-Type: application/json" \
  -d '{
    "tableName": "FuxiData",
    "filters": [
      {
        "field": "type",
        "operator": "=",
        "value": "bumpy-map-record-point"
      },
      {
        "field": "time",
        "operator": ">=",
        "value": "2025-11-03 11:01:00.000"
      },
      {
        "field": "time",
        "operator": "<=",
        "value": "2025-11-03 11:14:00.000"
      }
    ],
    "logic": "AND",
    "orderBy": "time",
    "order": "DESC",
    "limit": 20,
    "offset": 0
  }'
```

**GET 请求示例：**

```bash
curl "http://localhost:3000/api/generic/query?tableName=FuxiData&limit=10&offset=0&orderBy=time&order=DESC"
```

**JavaScript/Fetch 示例：**

```javascript
// POST 请求
const response = await fetch('/api/generic/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    tableName: 'FuxiData',
    filters: [
      { field: 'type', operator: '=', value: 'bumpy-map-record-point' },
      { field: 'time', operator: '>=', value: '2025-11-03 11:01:00.000' },
      { field: 'time', operator: '<=', value: '2025-11-03 11:14:00.000' }
    ],
    logic: 'AND',
    orderBy: 'time',
    order: 'DESC',
    limit: 20,
    offset: 0
  })
});

const result = await response.json();
console.log(result.data);        // 查询结果
console.log(result.pagination);  // 分页信息
```

#### 响应示例

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
    {
      "id": 2,
      "type": "bumpy-map-record-point",
      "time": "2025-11-03T11:06:00.000Z",
      "data": { ... }
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### 创建 (Create)

用于创建新记录。

#### 请求方式

**POST** `/api/generic/create`

#### 请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `tableName` | string | 否 | `FuxiData` | 表名 |
| `[field]` | any | 是* | - | 任意字段（至少需要一个字段） |

*注：除了 `tableName` 外，至少需要提供一个其他字段用于插入。

#### 请求示例

```bash
curl -X POST http://localhost:3000/api/generic/create \
  -H "Content-Type: application/json" \
  -d '{
    "tableName": "FuxiData",
    "type": "bumpy-map-record-point",
    "data": {
      "latitude": 39.9042,
      "longitude": 116.4074,
      "severity": "high"
    },
    "time": "2025-11-03 11:01:00.000"
  }'
```

**JavaScript/Fetch 示例：**

```javascript
const response = await fetch('/api/generic/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    tableName: 'FuxiData',
    type: 'bumpy-map-record-point',
    data: {
      latitude: 39.9042,
      longitude: 116.4074,
      severity: 'high'
    },
    time: new Date().toISOString()
  })
});

const result = await response.json();
console.log(result.data); // 创建后的完整记录（包含自动生成的 id）
```

#### 响应示例

```json
{
  "success": true,
  "message": "Record created successfully",
  "data": {
    "id": 123,
    "type": "bumpy-map-record-point",
    "data": {
      "latitude": 39.9042,
      "longitude": 116.4074,
      "severity": "high"
    },
    "time": "2025-11-03T11:01:00.000Z"
  }
}
```

### 更新 (Update)

根据 ID 更新记录。

#### 请求方式

**PUT** `/api/generic/update`

#### 请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `id` | number/string | 是 | - | 记录 ID |
| `tableName` | string | 否 | `FuxiData` | 表名 |
| `[field]` | any | 是* | - | 要更新的字段（至少需要一个字段） |

*注：除了 `id` 和 `tableName` 外，至少需要提供一个其他字段用于更新。

#### 请求示例

```bash
curl -X PUT http://localhost:3000/api/generic/update \
  -H "Content-Type: application/json" \
  -d '{
    "id": 123,
    "tableName": "FuxiData",
    "type": "updated-type",
    "data": {
      "latitude": 39.9042,
      "longitude": 116.4074,
      "severity": "medium"
    }
  }'
```

**JavaScript/Fetch 示例：**

```javascript
const response = await fetch('/api/generic/update', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: 123,
    tableName: 'FuxiData',
    type: 'updated-type',
    data: {
      latitude: 39.9042,
      longitude: 116.4074,
      severity: 'medium'
    }
  })
});

const result = await response.json();
console.log(result.data); // 更新后的完整记录
```

#### 响应示例

```json
{
  "success": true,
  "message": "Record updated successfully",
  "data": {
    "id": 123,
    "type": "updated-type",
    "data": {
      "latitude": 39.9042,
      "longitude": 116.4074,
      "severity": "medium"
    },
    "time": "2025-11-03T11:01:00.000Z"
  }
}
```

### 删除 (Delete)

根据 ID 删除记录。

#### 请求方式

**DELETE** `/api/generic/delete`

#### 请求参数

支持两种方式传递参数：

**方式 1：URL 查询参数**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `id` | number/string | 是 | - | 记录 ID |
| `tableName` | string | 否 | `FuxiData` | 表名 |

**方式 2：请求体 JSON**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `id` | number/string | 是 | - | 记录 ID |
| `tableName` | string | 否 | `FuxiData` | 表名 |

#### 请求示例

**URL 参数方式：**

```bash
curl -X DELETE "http://localhost:3000/api/generic/delete?id=123&tableName=FuxiData"
```

**请求体方式：**

```bash
curl -X DELETE http://localhost:3000/api/generic/delete \
  -H "Content-Type: application/json" \
  -d '{
    "id": 123,
    "tableName": "FuxiData"
  }'
```

**JavaScript/Fetch 示例：**

```javascript
// URL 参数方式
const response1 = await fetch('/api/generic/delete?id=123&tableName=FuxiData', {
  method: 'DELETE'
});

// 请求体方式
const response2 = await fetch('/api/generic/delete', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: 123,
    tableName: 'FuxiData'
  })
});

const result = await response2.json();
console.log(result.data); // 被删除的记录
```

#### 响应示例

```json
{
  "success": true,
  "message": "Record deleted successfully",
  "data": {
    "id": 123,
    "type": "bumpy-map-record-point",
    "data": { ... },
    "time": "2025-11-03T11:01:00.000Z"
  }
}
```

## 操作符说明

查询 API 的 `filters` 中支持以下操作符：

| 操作符 | 符号 | 说明 | 示例 |
|--------|------|------|------|
| **equals** | `=` | 等于 | `{ "field": "type", "operator": "=", "value": "test" }` |
| **not equals** | `<>` | 不等于 | `{ "field": "type", "operator": "<>", "value": "test" }` |
| **greater** | `>` | 大于 | `{ "field": "id", "operator": ">", "value": 100 }` |
| **greater or equals** | `>=` | 大于等于 | `{ "field": "time", "operator": ">=", "value": "2025-01-01" }` |
| **less** | `<` | 小于 | `{ "field": "id", "operator": "<", "value": 100 }` |
| **less or equals** | `<=` | 小于等于 | `{ "field": "time", "operator": "<=", "value": "2025-12-31" }` |
| **like** | `LIKE` | 模糊匹配（区分大小写） | `{ "field": "type", "operator": "LIKE", "value": "%test%" }` |
| **ilike** | `ILIKE` | 模糊匹配（不区分大小写） | `{ "field": "type", "operator": "ILIKE", "value": "%test%" }` |
| **not like** | `NOT LIKE` | 不匹配 | `{ "field": "type", "operator": "NOT LIKE", "value": "%test%" }` |
| **in** | `IN` | 在列表中（支持数组） | `{ "field": "type", "operator": "IN", "value": ["type1", "type2"] }` |
| **is null** | `IS NULL` | 为空 | `{ "field": "data", "operator": "IS NULL", "value": null }` |
| **is not null** | `IS NOT NULL` | 不为空 | `{ "field": "data", "operator": "IS NOT NULL", "value": null }` |

### 操作符使用示例

```javascript
// 等值查询
{ field: "type", operator: "=", value: "bumpy-map-record-point" }

// 范围查询
{ field: "time", operator: ">=", value: "2025-01-01 00:00:00" }
{ field: "time", operator: "<=", value: "2025-12-31 23:59:59" }

// 模糊查询（不区分大小写）
{ field: "type", operator: "ILIKE", value: "%bumpy%" }

// IN 查询（数组）
{ field: "type", operator: "IN", value: ["type1", "type2", "type3"] }

// NULL 检查
{ field: "data", operator: "IS NULL", value: null }
{ field: "data", operator: "IS NOT NULL", value: null }

// 组合查询（AND 逻辑）
{
  filters: [
    { field: "type", operator: "=", value: "test" },
    { field: "id", operator: ">", value: 100 }
  ],
  logic: "AND"
}

// 组合查询（OR 逻辑）
{
  filters: [
    { field: "type", operator: "=", value: "type1" },
    { field: "type", operator: "=", value: "type2" }
  ],
  logic: "OR"
}
```

## 完整示例

### 示例 1：查询特定时间段的数据

```javascript
async function queryTimeRange(startTime, endTime) {
  const response = await fetch('/api/generic/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tableName: 'FuxiData',
      filters: [
        { "field": "type", "operator": "=", "value": "bumpy-map-record-point" },
       { "field": "time", "operator": ">=", "value": "2025-11-03 11:01:00.000" },
       { "field": "time", "operator": "<=", "value": "2025-11-03 11:14:00.000" }
      ],
      logic: 'AND',
      orderBy: 'time',
      order: 'DESC',
      limit: 50
    })
  });
  
  return await response.json();
}

// 使用
const result = await queryTimeRange(
  '2025-11-03 11:01:00.000',
  '2025-11-03 11:14:00.000'
);
```

### 示例 2：创建并更新记录

```javascript
// 创建记录
async function createRecord(data) {
  const response = await fetch('/api/generic/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tableName: 'FuxiData',
      type: 'bumpy-map-record-point',
      data: data,
      time: new Date().toISOString()
    })
  });
  
  return await response.json();
}

// 更新记录
async function updateRecord(id, updates) {
  const response = await fetch('/api/generic/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: id,
      tableName: 'FuxiData',
      ...updates
    })
  });
  
  return await response.json();
}

// 使用
const created = await createRecord({
  latitude: 39.9042,
  longitude: 116.4074
});

const updated = await updateRecord(created.data.id, {
  data: {
    latitude: 39.9042,
    longitude: 116.4074,
    severity: 'high'
  }
});
```

### 示例 3：分页查询

```javascript
async function paginatedQuery(page = 1, pageSize = 20) {
  const response = await fetch('/api/generic/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tableName: 'FuxiData',
      filters: [
        { field: 'type', operator: '=', value: 'bumpy-map-record-point' }
      ],
      orderBy: 'time',
      order: 'DESC',
      limit: pageSize,
      offset: (page - 1) * pageSize
    })
  });
  
  const result = await response.json();
  return {
    data: result.data,
    pagination: result.pagination,
    currentPage: page,
    totalPages: Math.ceil(result.pagination.total / pageSize)
  };
}

// 使用
const page1 = await paginatedQuery(1, 20);
console.log(`第 1 页，共 ${page1.totalPages} 页`);
```

### 示例 4：复杂查询

```javascript
async function complexQuery() {
  const response = await fetch('/api/generic/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tableName: 'FuxiData',
      filters: [
        // 类型在指定列表中
        { field: 'type', operator: 'IN', value: ['type1', 'type2', 'type3'] },
        // 时间范围
        { field: 'time', operator: '>=', value: '2025-01-01 00:00:00' },
        { field: 'time', operator: '<=', value: '2025-12-31 23:59:59' },
        // 数据不为空
        { field: 'data', operator: 'IS NOT NULL', value: null }
      ],
      logic: 'AND',
      orderBy: 'time',
      order: 'DESC',
      limit: 100
    })
  });
  
  return await response.json();
}
```

## 错误处理

所有 API 在出错时都会返回标准的错误响应：

```json
{
  "error": "错误类型",
  "message": "详细错误信息"
}
```

常见错误码：

- `400` - 请求参数错误
- `404` - 记录未找到（更新/删除时）
- `500` - 服务器内部错误

### 错误处理示例

```javascript
async function safeQuery(params) {
  try {
    const response = await fetch('/api/generic/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Query failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}
```

## 注意事项

1. **表名大小写**：PostgreSQL 表名和字段名区分大小写，如果使用引号包裹，需要保持原样大小写。

2. **参数化查询**：所有查询都使用参数化查询，防止 SQL 注入攻击。

3. **默认表名**：如果不指定 `tableName`，默认使用 `FuxiData`。

4. **字段名**：字段名会自动使用引号包裹，支持包含特殊字符的字段名。

5. **数据类型**：确保传入的值类型与数据库字段类型匹配。

6. **NULL 值**：使用 `IS NULL` 或 `IS NOT NULL` 时，`value` 字段仍需要提供（通常为 `null`），但不会被用于 SQL 参数。

7. **分页性能**：当数据量很大时，建议使用 `limit` 和 `offset` 进行分页，避免一次性查询过多数据。

