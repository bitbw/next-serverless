import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function PUT(request: NextRequest) {
  try {
    // 获取请求体中的 JSON 数据
    const body = await request.json();
    const { id, data, type } = body;

    // 验证必需参数
    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Data is required" },
        { status: 400 }
      );
    }

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

    // 首先检查记录是否存在
    const existingRecord = await sql`
      SELECT id FROM "FuxiData" WHERE id = ${id}
    `;

    if (existingRecord.length === 0) {
      return NextResponse.json(
        { error: "Record not found" },
        { status: 404 }
      );
    }

    // 更新数据
    // 如果提供了 type，则更新 type 字段；否则保持原有 type
    // time 字段更新为东八区当前时间
    const now = new Date();
    const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);

    const result = await sql`
      UPDATE "FuxiData" 
      SET 
        data = ${JSON.stringify(data)},
        time = ${beijingTime.toISOString()}
        ${type ? sql`, type = ${type}` : sql``}
      WHERE id = ${id}
      RETURNING id, data, type, time
    `;

    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: "Data updated successfully",
      data: {
        id: result[0].id,
        data: result[0].data,
        type: result[0].type,
        time: result[0].time,
      },
    });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// 处理 OPTIONS 请求（预检请求）
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
