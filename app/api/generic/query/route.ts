import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { buildQuery, QueryParams } from '@/lib/db/query-builder';

/**
 * GET 或 POST 查询接口
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 从 URL 参数构建查询参数
    const params: QueryParams = {
      tableName: searchParams.get('tableName') || undefined,
      logic: (searchParams.get('logic') as 'AND' | 'OR') || 'AND',
      orderBy: searchParams.get('orderBy') || undefined,
      order: (searchParams.get('order') as 'ASC' | 'DESC') || 'DESC',
    };

    // 解析 limit 和 offset
    if (searchParams.get('limit')) {
      params.limit = parseInt(searchParams.get('limit')!, 10);
    }
    if (searchParams.get('offset')) {
      params.offset = parseInt(searchParams.get('offset')!, 10);
    }

    // 解析 filters（从 URL 参数，需要特殊处理）
    const filtersParam = searchParams.get('filters');
    if (filtersParam) {
      try {
        params.filters = JSON.parse(filtersParam);
      } catch (e) {
        return NextResponse.json(
          { error: 'Invalid filters parameter' },
          { status: 400 }
        );
      }
    }

    return await executeQuery(params);
  } catch (error) {
    console.error('Error in GET query:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const params: QueryParams = {
      tableName: body.tableName,
      filters: body.filters,
      logic: body.logic || 'AND',
      orderBy: body.orderBy,
      order: body.order || 'DESC',
      limit: body.limit,
      offset: body.offset,
    };

    return await executeQuery(params);
  } catch (error) {
    console.error('Error in POST query:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function executeQuery(params: QueryParams) {
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

  // 构建查询
  const { query, params: queryParams } = buildQuery(params);

  console.log('Executing query:', query);
  console.log('Query params:', queryParams);

  // 执行查询
  const result = await sql.query(query, queryParams);

  // 获取总数（用于分页）
  let total: number | undefined;
  if (params.limit !== undefined || params.offset !== undefined) {
    const countQuery = buildQuery(params, true);
    const countResult = await sql.query(countQuery.query, countQuery.params);
    total = parseInt(countResult[0].total, 10);
  }

  return NextResponse.json({
    success: true,
    data: result,
    ...(total !== undefined && {
      pagination: {
        total,
        limit: params.limit,
        offset: params.offset || 0,
        hasMore: params.offset !== undefined && params.limit !== undefined
          ? (params.offset + params.limit) < total
          : undefined,
      },
    }),
  });
}

// 处理 OPTIONS 请求（预检请求）
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

