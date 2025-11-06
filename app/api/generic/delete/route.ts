import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { triggerPusherEvent } from '@/libs/pusher';

/**
 * DELETE 删除接口
 * 根据 id 删除记录
 */
export async function DELETE(request: NextRequest) {
  try {
    // 支持从 URL 参数或请求体获取参数
    const { searchParams } = new URL(request.url);
    let id: string | number | undefined = searchParams.get('id') || undefined;
    let tableName: string | undefined = searchParams.get('tableName') || undefined;

    // 如果 URL 中没有，尝试从请求体获取
    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
        tableName = body.tableName || tableName;
      } catch {
        // 请求体为空或不是 JSON，忽略
      }
    }

    // 验证 id
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const finalTableName = tableName || 'FuxiData';

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

    // 构建 DELETE 语句
    const query = `DELETE FROM "${finalTableName}" WHERE id = $1 RETURNING *`;
    const queryParams = [id];

    console.log('Executing delete query:', query);
    console.log('Query params:', queryParams);

    // 执行删除
    const result = await sql.query(query, queryParams);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }

    // 触发 Pusher 事件
    // await triggerPusherEvent(finalTableName, 'deleted', {
    //   id,
    //   tableName: finalTableName,
    // });

    return NextResponse.json({
      success: true,
      message: 'Record deleted successfully',
      data: result[0],
    });
  } catch (error) {
    console.error('Error deleting record:', error);
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

