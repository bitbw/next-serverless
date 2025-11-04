# FuxiData API 接口文档

## 基础信息
- **基础URL**: `https://next-serverless.bitbw.top`
- **API版本**: v1
- **数据格式**: JSON

## 接口列表

### 1. 保存数据
**接口地址**: `POST /api/fuxi-data/save-data`

**请求参数**:
```json
{
  "data": "要保存的数据对象",
  "type": "数据类型（可选，默认为'default'）"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "Data saved successfully",
  "data": {
    "id": "",
    "data": {"name": "示例数据", "value": 100},
    "type": "default",
    "time": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 2. 获取数据
**接口地址**: `GET /api/fuxi-data/get-data`

**查询参数**:
- `id` (可选): 指定ID获取单条记录
- `limit` (可选): 每页数量，默认10，最大100
- `offset` (可选): 偏移量，默认0

**使用示例**:
- 获取单条记录: `GET /api/fuxi-data/get-data?id=123`
- 分页查询: `GET /api/fuxi-data/get-data?limit=20&offset=0`

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "123",
    "data": {"name": "示例数据", "value": 100},
    "type": "default",
    "time": "2024-01-15T10:30:00.000Z"
  }
}
```

**分页响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "time": "2024-01-15T10:30:00.000Z",
      "type": "default"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### 3. 更新数据 ⭐ 新增接口
**接口地址**: `PUT /api/fuxi-data/update-data`

**请求参数**:
```json
{
  "id": "记录ID（必需）",
  "data": "新的数据内容（必需）",
  "type": "数据类型（可选）"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "Data updated successfully",
  "data": {
    "id": "123",
    "data": {"name": "更新后的数据", "value": 200},
    "type": "updated",
    "time": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### 4. 获取表列表
**接口地址**: `GET /api/fuxi-data/list-tables`

**响应示例**:
```json
{
  "success": true,
  "message": "Tables retrieved successfully",
  "data": {
    "totalTables": 5,
    "tables": [
      {
        "schemaname": "public",
        "tablename": "FuxiData",
        "tableowner": "postgres",
        "hasindexes": true,
        "hasrules": false,
        "hastriggers": false,
        "rowsecurity": false,
        "rowCount": 100
      }
    ]
  }
}
```

## 错误响应格式

所有接口在出错时都会返回统一的错误格式：

```json
{
  "error": "错误类型",
  "message": "详细错误信息"
}
```

**常见错误码**:
- `400`: 请求参数错误
- `404`: 记录不存在（仅更新接口）
- `500`: 服务器内部错误

## 使用示例

### JavaScript/Fetch
```javascript
// 保存数据
const saveData = async (data) => {
  const response = await fetch('https://next-serverless.bitbw.top/api/fuxi-data/save-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: { name: '测试数据', value: 100 },
      type: 'test'
    })
  });
  return await response.json();
};

// 更新数据
const updateData = async (id, newData) => {
  const response = await fetch('https://next-serverless.bitbw.top/api/fuxi-data/update-data', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
      data: newData,
      type: 'updated'
    })
  });
  return await response.json();
};

// 获取数据
const getData = async (id) => {
  const response = await fetch(`https://next-serverless.bitbw.top/api/fuxi-data/get-data?id=${id}`);
  return await response.json();
};
```

### cURL 示例
```bash
# 保存数据
curl -X POST https://next-serverless.bitbw.top/api/fuxi-data/save-data \
  -H "Content-Type: application/json" \
  -d '{"data": {"name": "测试", "value": 100}, "type": "test"}'

# 更新数据
curl -X PUT https://next-serverless.bitbw.top/api/fuxi-data/update-data \
  -H "Content-Type: application/json" \
  -d '{"id": "123", "data": {"name": "更新测试", "value": 200}}'

# 获取单条数据
curl https://next-serverless.bitbw.top/api/fuxi-data/get-data?id=123

# 分页查询
curl https://next-serverless.bitbw.top/api/fuxi-data/get-data?limit=20&offset=0
```

## 注意事项

1. **时间格式**: 所有时间字段都使用东八区时间（UTC+8）
2. **数据存储**: `data` 字段存储 JSON 格式的数据
3. **分页限制**: 单次查询最多返回 100 条记录
4. **CORS 支持**: 所有接口都支持跨域请求
5. **错误处理**: 建议在生产环境中添加适当的错误处理逻辑

## 测试接口

你可以使用以下工具测试接口：
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- 浏览器开发者工具
- cURL 命令行工具

---

*文档更新时间: 2024年1月15日*
*API 版本: v1*
