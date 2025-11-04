/**
 * 测试通用查询 API
 * 使用方法: node test-generic-query.js
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

async function testQueryAPI() {
  console.log('🧪 开始测试通用查询 API...\n');

  const testData = {
    tableName: "FuxiData",
    filters: [
      { field: "type", operator: "=", value: "bumpy-map-record-point" },
      { field: "time", operator: ">=", value: "2025-11-03 11:01:00.000" },
      { field: "time", operator: "<=", value: "2025-11-03 11:14:00.000" }
    ],
    logic: "AND",
    orderBy: "time",
    order: "DESC",
    limit: 20,
    offset: 0
  };

  try {
    console.log('📤 发送请求:');
    console.log('URL:', `${API_BASE_URL}/api/generic/query`);
    console.log('Method: POST');
    console.log('Body:', JSON.stringify(testData, null, 2));
    console.log('\n');

    const response = await fetch(`${API_BASE_URL}/api/generic/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('📥 响应状态:', response.status, response.statusText);
    console.log('响应头:', Object.fromEntries(response.headers.entries()));
    console.log('\n');

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ 请求失败:');
      console.error(JSON.stringify(result, null, 2));
      return;
    }

    console.log('✅ 请求成功!');
    console.log('\n响应结果:');
    console.log(JSON.stringify(result, null, 2));

    // 验证响应结构
    console.log('\n📊 验证响应结构:');
    if (result.success) {
      console.log('✓ success 字段存在');
    } else {
      console.log('✗ success 字段缺失或为 false');
    }

    if (Array.isArray(result.data)) {
      console.log(`✓ data 是数组，包含 ${result.data.length} 条记录`);
      
      if (result.data.length > 0) {
        console.log('\n第一条记录示例:');
        console.log(JSON.stringify(result.data[0], null, 2));
      }
    } else {
      console.log('✗ data 不是数组');
    }

    if (result.pagination) {
      console.log('✓ pagination 信息存在');
      console.log(`  - 总数: ${result.pagination.total}`);
      console.log(`  - 限制: ${result.pagination.limit}`);
      console.log(`  - 偏移: ${result.pagination.offset}`);
      console.log(`  - 还有更多: ${result.pagination.hasMore}`);
    } else {
      console.log('⚠ pagination 信息不存在（可能是没有使用 limit/offset）');
    }

    console.log('\n🎉 测试完成!');

  } catch (error) {
    console.error('\n❌ 测试过程中发生错误:');
    console.error(error.message);
    if (error.stack) {
      console.error('\n堆栈跟踪:');
      console.error(error.stack);
    }
  }
}

// 运行测试
if (typeof require !== 'undefined' && require.main === module) {
  // Node.js 环境
  if (typeof fetch === 'undefined') {
    console.error('❌ 此脚本需要 Node.js 18+ 或安装 node-fetch');
    console.error('请使用: npm install node-fetch@2');
    console.error('或者使用 Node.js 18+ (内置 fetch)');
    process.exit(1);
  }
  
  testQueryAPI().catch(console.error);
} else {
  // 浏览器环境
  console.log('在浏览器环境中，请调用 testQueryAPI() 函数');
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testQueryAPI };
}

