import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: NextRequest) {
  try {
    // 获取数据库连接字符串
    const connectionString = process.env.DATABASE_URL2_DATABASE_URL;
    if (!connectionString) {
      return NextResponse.json(
        { error: "Database connection string not configured" },
        { status: 500 }
      );
    }

    // 创建数据库连接
    const sql = neon(connectionString);

    // 查询所有用户表（排除系统表）
    const tables = await sql`
      SELECT 
        schemaname,
        tablename,
        tableowner,
        hasindexes,
        hasrules,
        hastriggers,
        rowsecurity
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;

    // 查询每个表的行数
    const tableCounts: any[] = [];
    for (const table of tables) {
      try {
        const countResult = await sql`SELECT COUNT(*) as count FROM ${sql(
          table.tablename
        )}`;
        tableCounts.push({
          ...table,
          rowCount: parseInt(countResult[0].count, 10),
        });
      } catch (error) {
        tableCounts.push({
          ...table,
          rowCount: "Error counting rows",
        });
      }
    }

    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: "Tables retrieved successfully",
      data: {
        totalTables: tableCounts.length,
        tables: tableCounts,
      },
    });
  } catch (error) {
    console.error("Error listing tables:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
