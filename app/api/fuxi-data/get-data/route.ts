import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: NextRequest) {
  try {
    // 获取数据库连接字符串
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return NextResponse.json(
        { error: 'Database connection string not configured' },
        { status: 500 }
      );
    }

    // 创建数据库连接
    const sql = neon(connectionString);

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';
    const limitNum = Math.min(parseInt(limit, 10), 100); // 最多返回100条
    const offsetNum = parseInt(offset, 10);

    // 查询数据，按时间倒序排列
    const result = await sql`
      SELECT * 
      FROM "FuxiData" 
      ORDER BY time DESC 
      LIMIT ${limitNum} 
      OFFSET ${offsetNum}
    `;

    // 获取总记录数
    const countResult = await sql`SELECT COUNT(*) as total FROM "FuxiData"`;
    const total = parseInt(countResult[0].total, 10);

    // 返回成功响应
    return NextResponse.json({
      success: true,
      data: result,
      pagination: {
        total,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < total
      }
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
