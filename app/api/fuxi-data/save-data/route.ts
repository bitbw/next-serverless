import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: NextRequest) {
  try {
    // 获取请求体中的 JSON 数据
    const body = await request.json();
    const jsonData = body.data;
    const type = body.type;

    // 验证数据是否存在
    if (!jsonData) {
      return NextResponse.json(
        { error: "No data provided" },
        { status: 400 }
      );
    }

    // 获取数据库连接字符串
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return NextResponse.json(
        { error: "Database connection string not configured" },
        { status: 500 }
      );
    }

    // 创建数据库连接
    const sql = neon(connectionString);

    // 插入数据到 FuxiData 表
    // data 字段存储 JSON 数据，time 字段设置为东八区当前时间
    // 获取东八区当前时间
    const now = new Date();
    const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);

    const result = await sql`
  INSERT INTO "FuxiData" (data, type, time) 
  VALUES (${JSON.stringify(jsonData)}, ${type || 'default'}, ${beijingTime.toISOString()})
  RETURNING id, data, type, time
`;

    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: "Data saved successfully",
      data: {
        id: result[0].id,
        data: result[0].data,
        type: result[0].type,
        time: result[0].time,
      },
    });
  } catch (error) {
    console.error("Error saving data:", error);
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
