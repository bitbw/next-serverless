import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { triggerPusherEvent } from '@/libs/pusher';

/**
 * POST 创建接口
 * 接受任意字段，动态插入到指定表中
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableName = 'FuxiData', ...fields } = body;

    // 验证字段
    if (!fields || Object.keys(fields).length === 0) {
      return NextResponse.json(
        { error: 'No fields provided' },
        { status: 400 }
      );
    }

    // 获取数据库连接字符串
    const connectionString = process.env.DATABASE_URL2_DATABASE_URL;
    if (!connectionString) {
      return NextResponse.json(
        { error: 'Database connection string not configured' },
        { status: 500 }
      );
    }

    // 创建数据库连接
    const sql = neon(connectionString);

    // 构建 INSERT 语句
    const fieldNames = Object.keys(fields);
    const fieldValues = Object.values(fields);
    const placeholders = fieldValues.map((_, index) => `$${index + 1}`).join(', ');
    const escapedFieldNames = fieldNames.map(name => `"${name}"`).join(', ');

    const query = `
      INSERT INTO "${tableName}" (${escapedFieldNames}) 
      VALUES (${placeholders})
      RETURNING *
    `;

    console.log('Executing create query:', query);
    console.log('Query params:', fieldValues);

    // 执行插入
    const result = await sql.query(query, fieldValues);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create record' },
        { status: 500 }
      );
    }

    // 触发 Pusher 事件
    // await triggerPusherEvent(tableName, 'created', {
    //   tableName,
    //   ...fields,
    //   id: result[0].id,
    // });

    return NextResponse.json({
      success: true,
      message: 'Record created successfully',
      data: result[0],
    });
  } catch (error) {
    console.error('Error creating record:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// 处理 OPTIONS 请求（预检请求）
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

