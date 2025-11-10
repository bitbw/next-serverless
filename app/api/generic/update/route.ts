import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { triggerPusherEvent } from '@/lib/pusher';

/**
 * PUT 更新接口
 * 根据 id 更新记录，接受任意字段
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, tableName = 'FuxiData', ...fields } = body;

    // 验证 id
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // 验证字段
    if (!fields || Object.keys(fields).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
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

    // 构建 UPDATE 语句
    const fieldNames = Object.keys(fields);
    const fieldValues = Object.values(fields);
    const setClauses = fieldNames.map((name, index) => `"${name}" = $${index + 1}`).join(', ');

    const query = `
      UPDATE "${tableName}" 
      SET ${setClauses}
      WHERE id = $${fieldNames.length + 1}
      RETURNING *
    `;

    const queryParams = [...fieldValues, id];

    console.log('Executing update query:', query);
    console.log('Query params:', queryParams);

    // 执行更新
    const result = await sql.query(query, queryParams);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }

    // 触发 Pusher 事件
    await triggerPusherEvent(tableName, 'updated', {
      id,
      tableName,
      ...fields,
    });

    return NextResponse.json({
      success: true,
      message: 'Record updated successfully',
      data: result[0],
    });
  } catch (error) {
    console.error('Error updating record:', error);
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

