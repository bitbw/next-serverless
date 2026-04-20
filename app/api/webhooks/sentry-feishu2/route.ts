import { NextRequest, NextResponse } from 'next/server';
import { getErrorNoticeCard } from "@/lib/feishu/card";

// 备用飞书群机器人 webhook：e8d208f2-cd4f-43ad-8721-3c6560777eb4
// 飞书群 Sentry通知

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("[BOWEN_LOG] 🚀 ~~ sentry-feishu2 ~~ req.body:", body);

    const { event } = body.data;
    const tags = new Map(event.tags);
    const card = getErrorNoticeCard({
      title: event.title,
      datetime: event.datetime,
      env: `${tags.get("device") ?? ""}_${tags.get("os")}_${tags.get("browser")}`,
      url: tags.get("url") as string,
      web_url: event.web_url,
    });

    console.log("[BOWEN_LOG] 🚀 ~~ sentry-feishu2 ~~ card:", card);
    const webhookBody = {
      msg_type: "interactive",
      card,
    };

    const response = await fetch(
      "https://open.feishu.cn/open-apis/bot/v2/hook/e8d208f2-cd4f-43ad-8721-3c6560777eb4",
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
    console.error("Error processing sentry-feishu2 webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
