import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: NextRequest) {
  try {
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

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    
    console.log('Query parameters:', { id, type, startTime, endTime });
    
    // 如果有 id 参数，根据 id 查询单条记录
    if (id) {
      const result = await sql`
        SELECT * 
        FROM "FuxiData" 
        WHERE id = ${id}
      `;
      
      if (result.length === 0) {
        return NextResponse.json(
          { error: 'Record not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: result[0]
      });
    }
    
    // 如果有 type 参数，根据 type 查询所有匹配的记录
    if (type) {
      console.log('Querying by type:', type, 'startTime:', startTime, 'endTime:', endTime);
      
      let result;
      // 如果有时间范围参数，添加时间过滤
      if (startTime || endTime) {
        if (startTime && endTime) {
          result = await sql`
            SELECT * 
            FROM "FuxiData" 
            WHERE type = ${type}
              AND time >= ${startTime}
              AND time <= ${endTime}
            ORDER BY id ASC
          `;
        } else if (startTime) {
          result = await sql`
            SELECT * 
            FROM "FuxiData" 
            WHERE type = ${type}
              AND time >= ${startTime}
            ORDER BY id ASC
          `;
        } else {
          result = await sql`
            SELECT * 
            FROM "FuxiData" 
            WHERE type = ${type}
              AND time <= ${endTime}
            ORDER BY id ASC
          `;
        }
      } else {
        // 没有时间范围参数，使用原来的查询
        result = await sql`
          SELECT * 
          FROM "FuxiData" 
          WHERE type = ${type}
          ORDER BY id ASC
        `;
      }
      
      console.log('Type query result:', result.length, 'records found');
      
      return NextResponse.json({
        success: true,
        data: result,
        total: result.length,
        message: `Found ${result.length} records with type: ${type}${startTime || endTime ? ` (time range: ${startTime || 'any'} - ${endTime || 'any'})` : ''}`,
        queryType: 'type'
      });
    }
    
    // 如果没有 id 参数，使用原有的分页查询逻辑
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';
    const limitNum = Math.min(parseInt(limit, 10), 100); // 最多返回100条
    const offsetNum = parseInt(offset, 10);

    // 查询数据，按时间倒序排列   ORDER BY time DESC 
    const result = await sql`
      SELECT id, time, type
      FROM "FuxiData" 
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
