import { NextRequest, NextResponse } from 'next/server';
import { getErrorNoticeCard } from "@/libs/feishu/card";

// 使用位置 https://bowen01.sentry.io/settings/developer-settings/feisu_notice-d960e5/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("[BOWEN_LOG] 🚀 ~~ handler ~~ req.body:", body);
    
    // 发送 到 webhook https://open.feishu.cn/open-apis/bot/v2/hook/44fd8355-3cfb-4b4a-9858-b5b25c591309
    const { event } = body.data;
    const tags = new Map(event.tags);
    const card = getErrorNoticeCard({
      title: event.title,
      datetime: event.datetime,
      env: `${tags.get("device") ?? ""}_${tags.get("os")}_${tags.get("browser")}`,
      url: tags.get("url") as string,
      web_url: event.web_url,
    });
    
    console.log("[BOWEN_LOG] 🚀 ~~ handler ~~ card:", card);
    const webhookBody = {
      msg_type: "interactive",
      card,
    };
    
    const response = await fetch(
      "https://open.feishu.cn/open-apis/bot/v2/hook/44fd8355-3cfb-4b4a-9858-b5b25c591309",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookBody),
      }
    );
    
    const data = await response.json();
    return NextResponse.json({
      message: "ok",
      data,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
