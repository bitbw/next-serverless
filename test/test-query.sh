#!/bin/bash

# 通用查询 API 测试脚本
# 使用方法: ./test-query.sh 或 bash test-query.sh

API_URL="${API_BASE_URL:-http://localhost:3000}/api/generic/query"

echo "🧪 测试通用查询 API"
echo "API URL: $API_URL"
echo ""

# 测试数据
TEST_DATA='{
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

echo "📤 请求数据:"
echo "$TEST_DATA" | jq '.' 2>/dev/null || echo "$TEST_DATA"
echo ""
echo "📥 发送 POST 请求..."
echo ""

# 发送请求
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "$TEST_DATA")

# 分离响应体和状态码
HTTP_BODY=$(echo "$RESPONSE" | head -n -1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

echo "状态码: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ 请求成功!"
  echo ""
  echo "响应结果:"
  echo "$HTTP_BODY" | jq '.' 2>/dev/null || echo "$HTTP_BODY"
else
  echo "❌ 请求失败 (状态码: $HTTP_CODE)"
  echo ""
  echo "错误信息:"
  echo "$HTTP_BODY" | jq '.' 2>/dev/null || echo "$HTTP_BODY"
fi

